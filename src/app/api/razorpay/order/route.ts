import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, receipt, notes } = body;

    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    const amountInPaise = Math.round(Number(amount || 0) * 100);

    if (amountInPaise <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid order amount' },
        { status: 400 }
      );
    }

    // If Razorpay live/test credentials are provided in .env.local
    if (keyId && keySecret) {
      const razorpay = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });

      const options = {
        amount: amountInPaise,
        currency: 'INR',
        receipt: receipt || `receipt_${Date.now()}`,
        notes: notes || {},
      };

      const order = await razorpay.orders.create(options);
      return NextResponse.json({
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: keyId,
        isDemo: false,
      });
    }

    // Graceful fallback for local preview / testing before user adds live keys
    const demoOrderId = `order_demo_${Date.now()}`;
    return NextResponse.json({
      success: true,
      orderId: demoOrderId,
      amount: amountInPaise,
      currency: 'INR',
      keyId: keyId || 'rzp_test_placeholder',
      isDemo: true,
    });
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create Razorpay order' },
      { status: 500 }
    );
  }
}
