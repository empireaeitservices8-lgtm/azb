import { NextResponse } from 'next/server';
import { createWCOrder } from '@/lib/woocommerce';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      paymentMethod = 'cod', // 'cod' | 'razorpay'
      customer,
      items,
      amount,
      transactionId,
      razorpayOrderId,
      razorpayPaymentId,
    } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Your cart is empty. Please add items before placing an order.' },
        { status: 400 }
      );
    }

    if (!customer?.fullName?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Customer full name is required.' },
        { status: 400 }
      );
    }

    const cleanPhone = (customer.phone || '').replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      return NextResponse.json(
        { success: false, error: 'A valid 10-digit mobile number is required.' },
        { status: 400 }
      );
    }

    if (!customer?.address?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Delivery address is required.' },
        { status: 400 }
      );
    }

    if (!customer?.pincode?.trim() || customer.pincode.trim().length < 6) {
      return NextResponse.json(
        { success: false, error: 'A valid 6-digit PIN code is required.' },
        { status: 400 }
      );
    }

    // Split name into first and last name for WooCommerce customer record
    const nameParts = customer.fullName.trim().split(/\s+/);
    const firstName = nameParts[0] || 'Customer';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Generate valid email if not supplied
    const customerEmail = (customer.email && customer.email.trim().includes('@'))
      ? customer.email.trim()
      : `${cleanPhone}@customer.azbstore.com`;

    const isCOD = paymentMethod === 'cod';

    // Format line items
    const lineItems = items.map((item: any) => {
      const qty = Math.max(1, Number(item.quantity) || 1);
      const price = Number(item.price) || 0;
      const totalStr = String(price * qty);

      const itemPayload: any = {
        product_id: Number(item.id) || 12,
        quantity: qty,
        subtotal: totalStr,
        total: totalStr,
      };

      if (item.title || item.name) {
        itemPayload.name = item.title || item.name;
      }

      return itemPayload;
    });

    const paymentMethodTitle = isCOD
      ? 'Cash on delivery'
      : 'Razorpay Secure Online Payment';

    const orderPayload: any = {
      payment_method: isCOD ? 'cod' : 'razorpay',
      payment_method_title: paymentMethodTitle,
      set_paid: !isCOD,
      status: 'processing', // Standard WooCommerce status for active orders
      customer_note: customer.notes?.trim() || (isCOD ? 'Cash on Delivery (COD) Order' : `Online Payment via Razorpay`),
      billing: {
        first_name: firstName,
        last_name: lastName,
        address_1: customer.address.trim(),
        city: (customer.city || '').trim(),
        state: (customer.state || 'Kerala').trim(),
        postcode: customer.pincode.trim(),
        country: 'IN',
        email: customerEmail,
        phone: customer.phone.trim(),
      },
      shipping: {
        first_name: firstName,
        last_name: lastName,
        address_1: customer.address.trim(),
        city: (customer.city || '').trim(),
        state: (customer.state || 'Kerala').trim(),
        postcode: customer.pincode.trim(),
        country: 'IN',
        phone: customer.phone.trim(),
      },
      line_items: lineItems,
      meta_data: [
        { key: 'payment_channel', value: isCOD ? 'Cash on Delivery (COD)' : 'Razorpay Online' },
        { key: 'customer_mobile', value: customer.phone.trim() },
        { key: 'order_source', value: 'AZB Next.js Web Store' },
      ],
    };

    if (!isCOD) {
      const pId = transactionId || razorpayPaymentId || `pay_${Date.now()}`;
      orderPayload.transaction_id = pId;
      orderPayload.meta_data.push({ key: 'razorpay_payment_id', value: pId });
      if (razorpayOrderId) {
        orderPayload.meta_data.push({ key: 'razorpay_order_id', value: razorpayOrderId });
      }
    }

    const wcOrder = await createWCOrder(orderPayload);

    if (!wcOrder || !wcOrder.id) {
      console.error('WooCommerce order creation returned empty or invalid response');
      return NextResponse.json(
        {
          success: false,
          error: 'Could not record order in WooCommerce store. Please verify your WordPress connection.',
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      orderId: wcOrder.id,
      orderNumber: wcOrder.number || String(wcOrder.id),
      status: wcOrder.status,
      paymentMethod: wcOrder.payment_method_title || paymentMethodTitle,
      total: wcOrder.total || String(amount || 0),
      currency: wcOrder.currency || 'INR',
    });
  } catch (error: any) {
    console.error('Error in /api/orders route:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error while creating order.' },
      { status: 500 }
    );
  }
}
