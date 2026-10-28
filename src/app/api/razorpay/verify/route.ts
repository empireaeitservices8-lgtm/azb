import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createWCOrder } from '@/lib/woocommerce';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      customer,
      items,
      amount
    } = body;

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Verify signature if secret is configured
    if (keySecret && razorpay_signature) {
      const generatedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (generatedSignature !== razorpay_signature) {
        return NextResponse.json(
          { success: false, error: 'Payment signature verification failed' },
          { status: 400 }
        );
      }
    }

    // Prepare and create order in WooCommerce
    let wcOrder = null;
    if (customer && items && Array.isArray(items)) {
      const orderPayload = {
        payment_method: 'razorpay',
        payment_method_title: 'Razorpay Online Payment',
        set_paid: true,
        transaction_id: razorpay_payment_id || `pay_${Date.now()}`,
        billing: {
          first_name: customer.fullName || 'Customer',
          address_1: customer.address || '',
          city: customer.city || '',
          postcode: customer.pincode || '',
          phone: customer.phone || '',
          country: 'IN'
        },
        shipping: {
          first_name: customer.fullName || 'Customer',
          address_1: customer.address || '',
          city: customer.city || '',
          postcode: customer.pincode || '',
          phone: customer.phone || '',
          country: 'IN'
        },
        line_items: items.map((item: any) => ({
          product_id: item.id,
          quantity: item.quantity || 1,
          total: String(item.price * (item.quantity || 1))
        }))
      };

      wcOrder = await createWCOrder(orderPayload);
    }

    return NextResponse.json({
      success: true,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      wcOrderId: wcOrder?.id || null
    });
  } catch (error: any) {
    console.error('Error verifying Razorpay payment:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Verification failed' },
      { status: 500 }
    );
  }
}
