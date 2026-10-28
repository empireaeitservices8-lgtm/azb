'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  CheckCircle2, 
  Wallet, 
  Smartphone, 
  CreditCard, 
  ArrowLeft, 
  ShieldCheck,
  Truck
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();

  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [isProcessing, setIsProcessing] = useState(false);

  // Customer Shipping Information
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    pincode: ''
  });

  // Placed Order Snapshot for Success Screen
  const [placedOrder, setPlacedOrder] = useState<{
    orderId: string;
    paymentId?: string;
    itemsCount: number;
    amount: number;
    method: string;
    customer: typeof shippingInfo;
  } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value
    });
  };

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') return resolve(false);
      if ((window as any).Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!shippingInfo.fullName.trim()) {
      toast.error('Please enter your full name');
      return;
    }
    const cleanPhone = shippingInfo.phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!shippingInfo.address.trim()) {
      toast.error('Please enter your delivery address');
      return;
    }
    if (!shippingInfo.pincode.trim() || shippingInfo.pincode.trim().length < 6) {
      toast.error('Please enter a valid 6-digit PIN code');
      return;
    }

    setIsProcessing(true);

    try {
      // Create Razorpay Order
      const res = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalPrice,
          receipt: `rcpt_${Date.now()}`,
          notes: {
            customer_name: shippingInfo.fullName,
            customer_phone: shippingInfo.phone,
            city: shippingInfo.city,
            pincode: shippingInfo.pincode
          }
        }),
      });

      if (!res.ok) {
        toast.error('Failed to initiate Razorpay order. Please try again.');
        setIsProcessing(false);
        return;
      }

      const orderData = await res.json();

      // If Razorpay live/test credentials are not configured in .env.local yet, run in simulated demo test mode
      if (orderData.isDemo) {
        toast.loading('Processing Razorpay Test Checkout...', { duration: 1500 });
        setTimeout(async () => {
          const demoPaymentId = `pay_demo_${Math.floor(100000 + Math.random() * 900000)}`;

          try {
            await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: orderData.orderId,
                razorpay_payment_id: demoPaymentId,
                customer: shippingInfo,
                items: cart,
                amount: totalPrice
              })
            });
          } catch (e) {
            console.error('Error recording demo order:', e);
          }

          setPlacedOrder({
            orderId: orderData.orderId,
            paymentId: demoPaymentId,
            itemsCount: cart.reduce((acc, i) => acc + i.quantity, 0),
            amount: totalPrice,
            method: 'Razorpay Online Payment (Demo / Test Mode)',
            customer: { ...shippingInfo }
          });

          clearCart();
          setIsProcessing(false);
          setCheckoutStep('success');
          toast.success('Order placed successfully with Razorpay!');
        }, 1200);
        return;
      }

      // Standard Razorpay live / test checkout flow
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        toast.error('Razorpay SDK failed to load. Please check your internet connection.');
        setIsProcessing(false);
        return;
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'AZB Store',
        description: 'Order Payment',
        image: '/images/logo.png',
        order_id: orderData.orderId,
        prefill: {
          name: shippingInfo.fullName,
          contact: shippingInfo.phone
        },
        theme: {
          color: '#000000'
        },
        handler: async function (response: any) {
          try {
            toast.loading('Verifying Razorpay payment...');
            const verifyRes = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                customer: shippingInfo,
                items: cart,
                amount: totalPrice
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              setPlacedOrder({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                itemsCount: cart.reduce((acc, i) => acc + i.quantity, 0),
                amount: totalPrice,
                method: 'Razorpay Online Payment (Verified)',
                customer: { ...shippingInfo }
              });
              clearCart();
              setCheckoutStep('success');
              toast.success('Payment completed successfully!');
            } else {
              toast.error('Payment verification failed.');
            }
          } catch (err) {
            console.error('Verification error:', err);
            toast.error('Payment verification error.');
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            toast('Payment cancelled', { icon: 'ℹ️' });
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        setIsProcessing(false);
        toast.error(`Payment failed: ${response.error?.description || 'Transaction declined'}`);
      });
      rzp.open();
    } catch (err: any) {
      console.error('Razorpay checkout error:', err);
      toast.error('Something went wrong during checkout.');
      setIsProcessing(false);
    }
  };

  // SUCCESS SCREEN
  if (checkoutStep === 'success' && placedOrder) {
    return (
      <div className='container mx-auto px-4 py-16 md:py-24 max-w-2xl'>
        <div className='bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-10 text-center'>
          <div className='w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xs animate-bounce'>
            <CheckCircle2 size={44} />
          </div>

          <h1 className='text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2'>
            Order Placed Successfully!
          </h1>
          <p className='text-sm text-gray-500 mb-6'>
            Thank you for shopping with AZB Store. Your payment has been received and order is confirmed.
          </p>

          <div className='bg-gray-50 rounded-2xl p-5 sm:p-6 text-left border border-gray-200/80 mb-8 space-y-3 text-sm'>
            <div className='flex justify-between items-center border-b border-gray-200 pb-3'>
              <span className='text-gray-500 font-medium'>Order ID:</span>
              <span className='font-mono font-bold text-gray-900 text-base'>#{placedOrder.orderId}</span>
            </div>

            <div className='flex justify-between items-center border-b border-gray-200 pb-3'>
              <span className='text-gray-500 font-medium'>Payment Gateway:</span>
              <span className='font-bold text-blue-700 flex items-center gap-1.5'>
                <ShieldCheck size={16} className='text-blue-600' />
                {placedOrder.method}
              </span>
            </div>

            {placedOrder.paymentId && (
              <div className='flex justify-between items-center border-b border-gray-200 pb-3'>
                <span className='text-gray-500 font-medium'>Razorpay Payment ID:</span>
                <span className='font-mono font-bold text-gray-900 text-xs sm:text-sm bg-gray-100 px-2 py-0.5 rounded'>
                  {placedOrder.paymentId}
                </span>
              </div>
            )}

            <div className='flex justify-between items-center border-b border-gray-200 pb-3'>
              <span className='text-gray-500 font-medium'>Total Amount Paid:</span>
              <span className='font-extrabold text-lg text-gray-900'>₹{placedOrder.amount}</span>
            </div>

            <div className='flex justify-between items-start pt-1'>
              <span className='text-gray-500 font-medium'>Delivery Address:</span>
              <span className='text-right text-gray-800 font-medium max-w-[240px]'>
                {placedOrder.customer.fullName}<br />
                {placedOrder.customer.address}, {placedOrder.customer.city} - {placedOrder.customer.pincode}<br />
                Phone: {placedOrder.customer.phone}
              </span>
            </div>
          </div>

          <div className='flex flex-col sm:flex-row gap-3 justify-center'>
            <Link
              href='/shop'
              className='bg-black text-white hover:bg-gray-800 font-bold py-3.5 px-8 rounded-xl transition-colors text-sm uppercase tracking-wide'
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // EMPTY CART SCREEN
  if (cart.length === 0) {
    return (
      <div className='container mx-auto px-4 py-32 text-center min-h-[60vh] flex flex-col items-center justify-center'>
        <ShoppingBag size={64} className='text-gray-300 mb-6' />
        <h1 className='text-2xl sm:text-4xl font-bold mb-4 text-gray-800'>Your Cart is Empty</h1>
        <p className='text-gray-500 mb-8'>Looks like you haven't added anything to your cart yet.</p>
        <Link href='/shop' className='bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-8 rounded-full transition-colors'>
          Start Shopping
        </Link>
      </div>
    );
  }

  // CHECKOUT FORM SCREEN
  if (checkoutStep === 'checkout') {
    return (
      <div className='container mx-auto px-4 py-10 md:py-14 max-w-5xl'>
        {/* Back to Cart button */}
        <button
          onClick={() => setCheckoutStep('cart')}
          className='flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-black mb-6 transition-colors cursor-pointer'
        >
          <ArrowLeft size={16} /> Back to Cart
        </button>

        <h1 className='text-2xl sm:text-3xl font-extrabold text-gray-900 mb-8'>Checkout & Payment</h1>

        <form onSubmit={handlePlaceOrder} className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
          {/* Left Column: Delivery Address & Payment Method */}
          <div className='lg:col-span-7 space-y-6'>
            {/* Delivery Details Card */}
            <div className='bg-white rounded-2xl shadow-xs border border-gray-200 p-6'>
              <h2 className='text-base sm:text-lg font-bold text-gray-900 mb-4 flex items-center gap-2'>
                <Truck size={18} className='text-yellow-500' />
                1. Delivery Address
              </h2>

              <div className='space-y-4'>
                <div>
                  <label className='block text-xs font-bold text-gray-700 uppercase mb-1'>Full Name *</label>
                  <input
                    type='text'
                    name='fullName'
                    value={shippingInfo.fullName}
                    onChange={handleInputChange}
                    placeholder='Enter your full name'
                    required
                    className='w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm'
                  />
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-xs font-bold text-gray-700 uppercase mb-1'>Mobile Number *</label>
                    <input
                      type='tel'
                      name='phone'
                      value={shippingInfo.phone}
                      onChange={handleInputChange}
                      placeholder='10-digit mobile number'
                      required
                      maxLength={10}
                      className='w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm'
                    />
                  </div>

                  <div>
                    <label className='block text-xs font-bold text-gray-700 uppercase mb-1'>PIN Code *</label>
                    <input
                      type='text'
                      name='pincode'
                      value={shippingInfo.pincode}
                      onChange={handleInputChange}
                      placeholder='6-digit pincode'
                      required
                      maxLength={6}
                      className='w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm'
                    />
                  </div>
                </div>

                <div>
                  <label className='block text-xs font-bold text-gray-700 uppercase mb-1'>Delivery Address *</label>
                  <textarea
                    name='address'
                    value={shippingInfo.address}
                    onChange={handleInputChange}
                    placeholder='House / Flat No, Street, Landmark, Area'
                    required
                    rows={2}
                    className='w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm resize-none'
                  />
                </div>

                <div>
                  <label className='block text-xs font-bold text-gray-700 uppercase mb-1'>City / District</label>
                  <input
                    type='text'
                    name='city'
                    value={shippingInfo.city}
                    onChange={handleInputChange}
                    placeholder='City or District'
                    className='w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm'
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Card - EXCLUSIVELY RAZORPAY */}
            <div className='bg-white rounded-2xl shadow-xs border border-gray-200 p-6'>
              <div className='flex items-center justify-between mb-4'>
                <h2 className='text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2'>
                  <ShieldCheck size={20} className='text-blue-600' />
                  2. Payment Method
                </h2>
                <span className='inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200'>
                  <ShieldCheck size={12} />
                  Razorpay Verified
                </span>
              </div>

              {/* Sole Razorpay Gateway Option */}
              <div className='p-5 rounded-2xl border-2 border-blue-600 bg-gradient-to-br from-blue-50/70 via-white to-amber-50/30 shadow-xs'>
                <div className='flex items-start justify-between gap-3'>
                  <div className='flex items-center gap-3'>
                    <div className='w-5 h-5 rounded-full border-2 border-blue-600 flex items-center justify-center bg-white mt-0.5'>
                      <div className='w-2.5 h-2.5 rounded-full bg-blue-600'></div>
                    </div>
                    <div>
                      <div className='flex items-center gap-2 flex-wrap'>
                        <span className='font-extrabold text-gray-900 text-base'>Razorpay Secure Checkout</span>
                        <span className='text-[10px] font-bold uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded'>Official</span>
                      </div>
                      <p className='text-xs text-gray-600 mt-1'>
                        All payment methods supported directly in one unified, instant popup.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Grid of supported payment channels under Razorpay */}
                <div className='grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 pt-4 border-t border-gray-200/80'>
                  <div className='bg-white p-2.5 rounded-xl border border-gray-200 flex flex-col items-center text-center shadow-2xs'>
                    <Smartphone size={20} className='text-green-600 mb-1' />
                    <span className='text-[11px] font-bold text-gray-800'>UPI Apps</span>
                    <span className='text-[9px] text-gray-500'>GPay, PhonePe, Paytm, QR</span>
                  </div>

                  <div className='bg-white p-2.5 rounded-xl border border-gray-200 flex flex-col items-center text-center shadow-2xs'>
                    <CreditCard size={20} className='text-blue-600 mb-1' />
                    <span className='text-[11px] font-bold text-gray-800'>Cards</span>
                    <span className='text-[9px] text-gray-500'>Visa, RuPay, MasterCard</span>
                  </div>

                  <div className='bg-white p-2.5 rounded-xl border border-gray-200 flex flex-col items-center text-center shadow-2xs'>
                    <Wallet size={20} className='text-purple-600 mb-1' />
                    <span className='text-[11px] font-bold text-gray-800'>Net Banking</span>
                    <span className='text-[9px] text-gray-500'>50+ Indian Banks</span>
                  </div>

                  <div className='bg-white p-2.5 rounded-xl border border-gray-200 flex flex-col items-center text-center shadow-2xs'>
                    <ShieldCheck size={20} className='text-amber-600 mb-1' />
                    <span className='text-[11px] font-bold text-gray-800'>Wallets</span>
                    <span className='text-[9px] text-gray-500'>Mobikwik, Amazon Pay & More</span>
                  </div>
                </div>

                {/* Trust and compliance footnote */}
                <div className='mt-3.5 pt-3 border-t border-gray-200/70 flex items-center justify-between text-[11px] text-gray-500 flex-wrap gap-2'>
                  <span className='flex items-center gap-1 text-green-700 font-semibold'>
                    <ShieldCheck size={13} /> 256-Bit SSL Bank-Grade Encryption
                  </span>
                  <span className='text-gray-400'>PCI-DSS Level 1 Certified</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Place Order */}
          <div className='lg:col-span-5'>
            <div className='bg-white rounded-2xl shadow-xs border border-gray-200 p-6 sticky top-24'>
              <h2 className='text-base sm:text-lg font-bold text-gray-900 mb-4'>Order Summary</h2>

              {/* Items List in checkout */}
              <div className='divide-y divide-gray-100 max-h-60 overflow-y-auto mb-4 pr-1'>
                {cart.map((item) => (
                  <div key={item.id} className='py-3 flex items-center gap-3'>
                    <img src={item.image} alt={item.title} className='w-12 h-12 rounded-lg object-cover bg-gray-100 flex-shrink-0' />
                    <div className='flex-1 min-w-0'>
                      <p className='text-xs font-bold text-gray-900 truncate'>{item.title}</p>
                      <p className='text-[11px] text-gray-500'>Qty: {item.quantity} × ₹{item.price}</p>
                    </div>
                    <span className='text-xs font-bold text-gray-900'>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className='space-y-3 text-sm border-t border-gray-100 pt-3'>
                <div className='flex justify-between text-gray-600'>
                  <span>Subtotal</span>
                  <span className='font-bold text-gray-900'>₹{totalPrice}</span>
                </div>
                <div className='flex justify-between text-gray-600'>
                  <span>Delivery</span>
                  <span className='font-bold text-green-600'>Free</span>
                </div>
                <div className='border-t border-gray-100 pt-3 flex justify-between items-end'>
                  <span className='font-bold text-gray-900 text-base'>Total Amount</span>
                  <span className='font-extrabold text-2xl text-gray-900'>₹{totalPrice}</span>
                </div>
              </div>

              {/* Razorpay Order CTA */}
              <button
                type='submit'
                disabled={isProcessing}
                className='w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-4 rounded-xl mt-6 transition-all text-sm uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-200 active:scale-[0.99]'
              >
                {isProcessing ? (
                  <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
                ) : (
                  <>
                    <ShieldCheck size={18} className='text-yellow-300' />
                    <span>Pay ₹{totalPrice} via Razorpay</span>
                  </>
                )}
              </button>

              <div className='mt-4 flex items-center justify-center gap-1.5 text-xs text-gray-400'>
                <ShieldCheck size={14} className='text-green-500' />
                <span>100% Safe & Secure Checkout</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }

  // STANDARD CART VIEW
  return (
    <div className='container mx-auto px-4 py-12 md:py-16'>
      <h1 className='text-2xl sm:text-3xl font-bold mb-8 text-gray-900'>Shopping Cart</h1>
      
      <div className='flex flex-col lg:flex-row gap-8'>
        <div className='lg:w-2/3'>
          <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
            <div className='hidden sm:grid grid-cols-12 gap-4 p-4 border-b border-gray-100 bg-gray-50 text-xs font-semibold text-gray-500 uppercase'>
              <div className='col-span-6'>Product</div>
              <div className='col-span-2 text-center'>Price</div>
              <div className='col-span-2 text-center'>Quantity</div>
              <div className='col-span-2 text-right'>Total</div>
            </div>
            
            <div className='divide-y divide-gray-100'>
              {cart.map((item) => (
                <div key={item.id} className='p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center'>
                  <div className='sm:col-span-6 flex items-center gap-4'>
                    <img src={item.image} alt={item.title} className='w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg bg-gray-100' />
                    <div className='flex-1'>
                      <h3 className='font-bold text-sm sm:text-base text-gray-900 line-clamp-2'>{item.title}</h3>
                      <p className='text-xs text-gray-500 mt-1'>{item.category}</p>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className='text-xs text-red-500 hover:text-red-700 font-semibold mt-2 flex items-center gap-1 transition-colors cursor-pointer'
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>
                  </div>
                  
                  <div className='sm:col-span-2 flex justify-between sm:block text-sm font-bold text-gray-900 sm:text-center'>
                    <span className='sm:hidden text-gray-500 font-normal'>Price: </span>
                    ₹{item.price}
                  </div>
                  
                  <div className='sm:col-span-2 flex justify-center'>
                    <div className='flex items-center bg-gray-50 border border-gray-200 rounded-lg overflow-hidden'>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className='p-2 hover:bg-gray-200 text-gray-600 transition-colors cursor-pointer'
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span className='w-8 text-center text-sm font-bold'>{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className='p-2 hover:bg-gray-200 text-gray-600 transition-colors cursor-pointer'
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  
                  <div className='sm:col-span-2 flex justify-between sm:block text-sm font-extrabold text-gray-900 sm:text-right'>
                    <span className='sm:hidden text-gray-500 font-normal'>Total: </span>
                    ₹{item.price * item.quantity}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Order Summary & Checkout Button */}
        <div className='lg:w-1/3'>
          <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24'>
            <h2 className='text-lg font-bold text-gray-900 mb-6'>Order Summary</h2>
            
            <div className='space-y-4 text-sm'>
              <div className='flex justify-between text-gray-600'>
                <span>Subtotal</span>
                <span className='font-bold text-gray-900'>₹{totalPrice}</span>
              </div>
              <div className='flex justify-between text-gray-600'>
                <span>Shipping</span>
                <span className='font-bold text-green-600'>Free</span>
              </div>
              <div className='border-t border-gray-100 pt-4 flex justify-between items-end'>
                <span className='font-bold text-gray-900 text-base'>Total</span>
                <span className='font-extrabold text-2xl text-gray-900'>₹{totalPrice}</span>
              </div>
            </div>
            
            {/* Working Proceed to Checkout Button */}
            <button 
              onClick={() => setCheckoutStep('checkout')}
              className='w-full bg-black text-white hover:bg-gray-800 font-bold py-3.5 rounded-xl mt-8 transition-colors text-sm uppercase tracking-wide cursor-pointer shadow-md'
            >
              Proceed to Checkout
            </button>
            
            <p className='text-xs text-center text-gray-400 mt-4'>
              Taxes included. Free delivery all over India.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
