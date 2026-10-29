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
      const nameParts = (customer.fullName || '').trim().split(/\s+/);
      const firstName = nameParts[0] || 'Customer';
      const lastName = nameParts.slice(1).join(' ') || '';
      const cleanPhone = (customer.phone || '').replace(/\D/g, '');
      const customerEmail = (customer.email && customer.email.trim().includes('@'))
        ? customer.email.trim()
        : `${cleanPhone || Date.now()}@customer.azbstore.com`;

      const orderPayload = {
        payment_method: 'razorpay',
        payment_method_title: 'Razorpay Secure Online Payment',
        set_paid: true,
        status: 'processing',
        transaction_id: razorpay_payment_id || `pay_${Date.now()}`,
        customer_note: customer.notes?.trim() || `Razorpay Online Payment (Payment ID: ${razorpay_payment_id || 'N/A'})`,
        billing: {
          first_name: firstName,
          last_name: lastName,
          address_1: customer.address || '',
          city: customer.city || '',
          state: customer.state || 'Kerala',
          postcode: customer.pincode || '',
          phone: customer.phone || '',
          email: customerEmail,
          country: 'IN'
        },
        shipping: {
          first_name: firstName,
          last_name: lastName,
          address_1: customer.address || '',
          city: customer.city || '',
          state: customer.state || 'Kerala',
          postcode: customer.pincode || '',
          phone: customer.phone || '',
          country: 'IN'
        },
        line_items: items.map((item: any) => {
          const qty = Math.max(1, Number(item.quantity) || 1);
          const price = Number(item.price) || 0;
          const totalStr = String(price * qty);
          return {
            product_id: Number(item.id) || 12,
            name: item.title || item.name || 'Product',
            quantity: qty,
            subtotal: totalStr,
            total: totalStr
          };
        }),
        meta_data: [
          { key: 'payment_channel', value: 'Razorpay Online' },
          { key: 'razorpay_payment_id', value: razorpay_payment_id || '' },
          { key: 'razorpay_order_id', value: razorpay_order_id || '' },
          { key: 'customer_mobile', value: customer.phone || '' },
          { key: 'order_source', value: 'AZB Web Storefront' }
        ]
      };

      wcOrder = await createWCOrder(orderPayload);
    }

    return NextResponse.json({
      success: true,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      wcOrderId: wcOrder?.id || null,
      wcOrderNumber: wcOrder?.number || wcOrder?.id || null
    });
  } catch (error: any) {
    console.error('Error verifying Razorpay payment:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Verification failed' },
      { status: 500 }
    );
  }
}
