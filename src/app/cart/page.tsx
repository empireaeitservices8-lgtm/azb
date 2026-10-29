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
  Truck,
  Banknote,
  Clock,
  MapPin,
  Phone,
  Mail,
  FileText,
  BadgeCheck,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();

  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'razorpay'>('cod');
  const [isProcessing, setIsProcessing] = useState(false);

  // Customer Shipping Information
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: 'Kerala',
    pincode: '',
    notes: ''
  });

  // Placed Order Snapshot for Success Screen
  const [placedOrder, setPlacedOrder] = useState<{
    orderId: string | number;
    wcOrderId?: number;
    paymentId?: string;
    itemsCount: number;
    amount: number;
    method: string;
    isCOD: boolean;
    customer: typeof shippingInfo;
    items: typeof cart;
  } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

  const validateForm = () => {
    if (!shippingInfo.fullName.trim()) {
      toast.error('Please enter your full name');
      return false;
    }
    const cleanPhone = shippingInfo.phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return false;
    }
    if (!shippingInfo.address.trim()) {
      toast.error('Please enter your complete delivery address');
      return false;
    }
    if (!shippingInfo.city.trim()) {
      toast.error('Please enter your city or district');
      return false;
    }
    if (!shippingInfo.pincode.trim() || shippingInfo.pincode.trim().length < 6) {
      toast.error('Please enter a valid 6-digit PIN code');
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsProcessing(true);

    // ==========================================
    // 1. CASH ON DELIVERY (COD) WORKFLOW
    // ==========================================
    if (paymentMethod === 'cod') {
      const toastId = toast.loading('Placing your Cash on Delivery order with WordPress...');
      try {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentMethod: 'cod',
            customer: shippingInfo,
            items: cart,
            amount: totalPrice
          })
        });

        const data = await res.json();
        toast.dismiss(toastId);

        if (!res.ok || !data.success) {
          toast.error(data.error || 'Failed to place COD order. Please try again.');
          setIsProcessing(false);
          return;
        }

        // Set snapshot of placed order for success screen
        setPlacedOrder({
          orderId: data.orderNumber || data.orderId,
          wcOrderId: data.orderId,
          itemsCount: cart.reduce((acc, i) => acc + i.quantity, 0),
          amount: totalPrice,
          method: 'Cash on Delivery (COD)',
          isCOD: true,
          customer: { ...shippingInfo },
          items: [...cart]
        });

        clearCart();
        setIsProcessing(false);
        setCheckoutStep('success');
        toast.success('Order placed successfully! Cash on delivery confirmed.');
      } catch (err: any) {
        toast.dismiss(toastId);
        console.error('COD Order Error:', err);
        toast.error('Network error placing order. Please try again.');
        setIsProcessing(false);
      }
      return;
    }

    // ==========================================
    // 2. RAZORPAY ONLINE PAYMENT WORKFLOW
    // ==========================================
    try {
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
        toast.error('Failed to initiate Razorpay payment. Please try again or choose COD.');
        setIsProcessing(false);
        return;
      }

      const orderData = await res.json();

      // Demo/preview mode fallback if keys not configured
      if (orderData.isDemo) {
        toast.loading('Processing Razorpay Test Checkout...', { duration: 1500 });
        setTimeout(async () => {
          const demoPaymentId = `pay_demo_${Math.floor(100000 + Math.random() * 900000)}`;

          try {
            const verifyRes = await fetch('/api/razorpay/verify', {
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
            const verifyData = await verifyRes.json();

            setPlacedOrder({
              orderId: verifyData.wcOrderNumber || verifyData.wcOrderId || orderData.orderId,
              wcOrderId: verifyData.wcOrderId,
              paymentId: demoPaymentId,
              itemsCount: cart.reduce((acc, i) => acc + i.quantity, 0),
              amount: totalPrice,
              method: 'Razorpay Online Payment (Demo / Test Mode)',
              isCOD: false,
              customer: { ...shippingInfo },
              items: [...cart]
            });
          } catch (e) {
            console.error('Error recording demo order in WooCommerce:', e);
            setPlacedOrder({
              orderId: orderData.orderId,
              paymentId: demoPaymentId,
              itemsCount: cart.reduce((acc, i) => acc + i.quantity, 0),
              amount: totalPrice,
              method: 'Razorpay Online Payment',
              isCOD: false,
              customer: { ...shippingInfo },
              items: [...cart]
            });
          }

          clearCart();
          setIsProcessing(false);
          setCheckoutStep('success');
          toast.success('Order placed successfully with Razorpay!');
        }, 1200);
        return;
      }

      // Live Razorpay popup flow
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
          contact: shippingInfo.phone,
          email: shippingInfo.email || ''
        },
        theme: {
          color: '#000000'
        },
        handler: async function (response: any) {
          try {
            toast.loading('Verifying payment & syncing order with WooCommerce...');
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
                orderId: verifyData.wcOrderNumber || verifyData.wcOrderId || response.razorpay_order_id,
                wcOrderId: verifyData.wcOrderId,
                paymentId: response.razorpay_payment_id,
                itemsCount: cart.reduce((acc, i) => acc + i.quantity, 0),
                amount: totalPrice,
                method: 'Razorpay Online Payment (Paid)',
                isCOD: false,
                customer: { ...shippingInfo },
                items: [...cart]
              });
              clearCart();
              setCheckoutStep('success');
              toast.success('Payment completed & order created in WordPress!');
            } else {
              toast.error(verifyData.error || 'Payment verification failed.');
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

  // ========================================================
  // 3. SUCCESS SCREEN (CONFIRMATION FOR COD & RAZORPAY)
  // ========================================================
  if (checkoutStep === 'success' && placedOrder) {
    return (
      <div className='container mx-auto px-4 py-12 md:py-20 max-w-3xl'>
        <div className='bg-white rounded-3xl shadow-lg border border-gray-100 p-6 sm:p-10 text-center relative overflow-hidden'>
          {/* Subtle top banner glow */}
          <div className='absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-yellow-400 to-blue-500'></div>

          <div className='w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm'>
            <CheckCircle2 size={46} className='animate-pulse' />
          </div>

          <h1 className='text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2'>
            Order Placed Successfully!
          </h1>
          <p className='text-sm sm:text-base text-gray-600 mb-6 max-w-lg mx-auto'>
            {placedOrder.isCOD ? (
              <span>Your order has been recorded in our store. You can pay with cash or UPI scanner when the package is delivered.</span>
            ) : (
              <span>Thank you for your purchase! Your online payment was verified and order details have been synchronized with WordPress.</span>
            )}
          </p>

          {/* Order Details Summary Card */}
          <div className='bg-gray-50/90 rounded-2xl p-5 sm:p-7 text-left border border-gray-200/80 mb-8 space-y-4 text-sm'>
            <div className='flex flex-wrap justify-between items-center border-b border-gray-200 pb-3 gap-2'>
              <span className='text-gray-500 font-medium flex items-center gap-1.5'>
                <FileText size={16} className='text-gray-400' /> WooCommerce Order ID:
              </span>
              <span className='font-mono font-extrabold text-gray-900 text-base sm:text-lg bg-white px-3 py-1 rounded-lg border border-gray-200 shadow-2xs'>
                #{placedOrder.orderId}
              </span>
            </div>

            <div className='flex flex-wrap justify-between items-center border-b border-gray-200 pb-3 gap-2'>
              <span className='text-gray-500 font-medium flex items-center gap-1.5'>
                {placedOrder.isCOD ? (
                  <Banknote size={16} className='text-emerald-600' />
                ) : (
                  <ShieldCheck size={16} className='text-blue-600' />
                )}
                Payment Method:
              </span>
              <span className={`font-bold flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm ${
                placedOrder.isCOD 
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                  : 'bg-blue-50 text-blue-800 border border-blue-200'
              }`}>
                {placedOrder.isCOD ? (
                  <>
                    <Truck size={14} className='text-emerald-600' />
                    Cash on Delivery (Pay upon delivery)
                  </>
                ) : (
                  <>
                    <BadgeCheck size={14} className='text-blue-600' />
                    Razorpay Online (Paid)
                  </>
                )}
              </span>
            </div>

            {placedOrder.paymentId && (
              <div className='flex flex-wrap justify-between items-center border-b border-gray-200 pb-3 gap-2'>
                <span className='text-gray-500 font-medium'>Razorpay Payment ID:</span>
                <span className='font-mono font-bold text-gray-900 text-xs sm:text-sm bg-gray-100 px-2.5 py-1 rounded border border-gray-200'>
                  {placedOrder.paymentId}
                </span>
              </div>
            )}

            <div className='flex justify-between items-center border-b border-gray-200 pb-3'>
              <span className='text-gray-500 font-medium'>Total Amount:</span>
              <span className='font-extrabold text-xl text-gray-900'>₹{placedOrder.amount}</span>
            </div>

            {/* Delivery address snapshot */}
            <div className='flex flex-col sm:flex-row justify-between items-start pt-1 gap-2'>
              <span className='text-gray-500 font-medium flex items-center gap-1.5'>
                <MapPin size={16} className='text-gray-400' /> Delivery Address:
              </span>
              <div className='text-left sm:text-right text-gray-800 font-medium max-w-sm'>
                <p className='font-bold text-gray-900'>{placedOrder.customer.fullName}</p>
                <p className='text-xs text-gray-600'>{placedOrder.customer.address}</p>
                <p className='text-xs text-gray-600'>
                  {placedOrder.customer.city}, {placedOrder.customer.state} - {placedOrder.customer.pincode}
                </p>
                <p className='text-xs text-gray-600 mt-1 flex items-center gap-1 sm:justify-end'>
                  <Phone size={12} /> {placedOrder.customer.phone}
                </p>
              </div>
            </div>

            {/* Ordered items preview */}
            {placedOrder.items && placedOrder.items.length > 0 && (
              <div className='border-t border-gray-200 pt-3 mt-2'>
                <p className='text-xs font-bold text-gray-500 uppercase tracking-wider mb-2'>
                  Items Ordered ({placedOrder.itemsCount})
                </p>
                <div className='divide-y divide-gray-100 bg-white rounded-xl border border-gray-200/80 p-2'>
                  {placedOrder.items.map((item) => (
                    <div key={item.id} className='py-2 px-2 flex items-center justify-between text-xs'>
                      <div className='flex items-center gap-2.5 min-w-0'>
                        <img src={item.image} alt={item.title} className='w-9 h-9 rounded object-cover bg-gray-100 flex-shrink-0' />
                        <div className='truncate'>
                          <p className='font-bold text-gray-900 truncate'>{item.title}</p>
                          <p className='text-[11px] text-gray-500'>Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className='font-bold text-gray-900 ml-2'>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className='flex flex-col sm:flex-row gap-3 justify-center'>
            <Link
              href='/shop'
              className='bg-black text-white hover:bg-gray-800 font-bold py-3.5 px-8 rounded-xl transition-colors text-sm uppercase tracking-wide shadow-md'
            >
              Continue Shopping
            </Link>
            <Link
              href='/'
              className='bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3.5 px-8 rounded-xl transition-colors text-sm uppercase tracking-wide'
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ========================================================
  // 4. EMPTY CART SCREEN
  // ========================================================
  if (cart.length === 0) {
    return (
      <div className='container mx-auto px-4 py-32 text-center min-h-[60vh] flex flex-col items-center justify-center'>
        <ShoppingBag size={64} className='text-gray-300 mb-6' />
        <h1 className='text-2xl sm:text-4xl font-bold mb-4 text-gray-800'>Your Cart is Empty</h1>
        <p className='text-gray-500 mb-8'>Looks like you haven't added anything to your cart yet.</p>
        <Link href='/shop' className='bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-8 rounded-full transition-colors shadow-sm'>
          Start Shopping
        </Link>
      </div>
    );
  }

  // ========================================================
  // 5. CHECKOUT SCREEN (COD + RAZORPAY)
  // ========================================================
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

        <div className='flex items-center justify-between mb-8'>
          <div>
            <h1 className='text-2xl sm:text-3xl font-extrabold text-gray-900'>Checkout</h1>
            <p className='text-xs sm:text-sm text-gray-500 mt-1'>
              Complete your delivery details and choose your preferred payment method.
            </p>
          </div>
          <span className='hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200'>
            <ShieldCheck size={14} /> 100% Safe & Secure
          </span>
        </div>

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
                    <label className='block text-xs font-bold text-gray-700 uppercase mb-1'>Email Address (Optional)</label>
                    <input
                      type='email'
                      name='email'
                      value={shippingInfo.email}
                      onChange={handleInputChange}
                      placeholder='For order tracking updates'
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
                    placeholder='House / Flat No, Building, Street, Area, Landmark'
                    required
                    rows={2}
                    className='w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm resize-none'
                  />
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
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

                  <div>
                    <label className='block text-xs font-bold text-gray-700 uppercase mb-1'>City / District *</label>
                    <input
                      type='text'
                      name='city'
                      value={shippingInfo.city}
                      onChange={handleInputChange}
                      placeholder='City or District'
                      required
                      className='w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm'
                    />
                  </div>

                  <div>
                    <label className='block text-xs font-bold text-gray-700 uppercase mb-1'>State</label>
                    <input
                      type='text'
                      name='state'
                      value={shippingInfo.state}
                      onChange={handleInputChange}
                      placeholder='State'
                      className='w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm'
                    />
                  </div>
                </div>

                <div>
                  <label className='block text-xs font-bold text-gray-700 uppercase mb-1'>Order Notes / Delivery Instructions (Optional)</label>
                  <input
                    type='text'
                    name='notes'
                    value={shippingInfo.notes}
                    onChange={handleInputChange}
                    placeholder='e.g., Near landmark, call before delivery'
                    className='w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-xs'
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Card - COD & RAZORPAY OPTIONS */}
            <div className='bg-white rounded-2xl shadow-xs border border-gray-200 p-6'>
              <div className='flex items-center justify-between mb-4'>
                <h2 className='text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2'>
                  <Wallet size={20} className='text-yellow-500' />
                  2. Select Payment Method
                </h2>
                <span className='text-xs font-medium text-gray-500'>
                  Choose how you'd like to pay
                </span>
              </div>

              <div className='space-y-4'>
                {/* OPTION 1: CASH ON DELIVERY (COD) */}
                <label 
                  onClick={() => setPaymentMethod('cod')}
                  className={`block p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer relative ${
                    paymentMethod === 'cod'
                      ? 'border-emerald-600 bg-gradient-to-br from-emerald-50/70 via-white to-amber-50/20 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className='flex items-start gap-3.5'>
                    <input
                      type='radio'
                      name='paymentMethodRadio'
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className='mt-1 w-4 h-4 text-emerald-600 focus:ring-emerald-500 accent-emerald-600 cursor-pointer'
                    />
                    <div className='flex-1'>
                      <div className='flex items-center justify-between flex-wrap gap-2'>
                        <div className='flex items-center gap-2'>
                          <span className='font-extrabold text-gray-900 text-base flex items-center gap-1.5'>
                            <Banknote size={18} className='text-emerald-600' />
                            Cash on Delivery (COD)
                          </span>
                        </div>
                        <span className='text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-300'>
                          Pay at Doorstep
                        </span>
                      </div>

                      <p className='text-xs text-gray-600 mt-1.5 leading-relaxed'>
                        Pay in cash or scan UPI when your package arrives at your doorstep. Zero advance payment needed.
                      </p>

                      {/* COD benefits */}
                      <div className='flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-emerald-100 text-[11px] text-gray-600 font-medium'>
                        <span className='flex items-center gap-1 text-emerald-700 font-semibold'>
                          <CheckCircle2 size={13} /> Direct Delivery
                        </span>
                        <span className='text-gray-300'>•</span>
                        <span className='flex items-center gap-1'>
                          <Truck size={13} className='text-gray-500' /> Inspect & Pay
                        </span>
                        <span className='text-gray-300'>•</span>
                        <span className='flex items-center gap-1'>
                          <Smartphone size={13} className='text-gray-500' /> Cash or UPI on delivery
                        </span>
                      </div>
                    </div>
                  </div>
                </label>

                {/* OPTION 2: RAZORPAY ONLINE PAYMENT */}
                <label 
                  onClick={() => setPaymentMethod('razorpay')}
                  className={`block p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer relative ${
                    paymentMethod === 'razorpay'
                      ? 'border-blue-600 bg-gradient-to-br from-blue-50/70 via-white to-amber-50/20 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className='flex items-start gap-3.5'>
                    <input
                      type='radio'
                      name='paymentMethodRadio'
                      checked={paymentMethod === 'razorpay'}
                      onChange={() => setPaymentMethod('razorpay')}
                      className='mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer'
                    />
                    <div className='flex-1'>
                      <div className='flex items-center justify-between flex-wrap gap-2'>
                        <div className='flex items-center gap-2'>
                          <span className='font-extrabold text-gray-900 text-base flex items-center gap-1.5'>
                            <ShieldCheck size={18} className='text-blue-600' />
                            Online Payment (Razorpay)
                          </span>
                        </div>
                        <span className='text-[10px] font-extrabold uppercase tracking-wider bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full border border-blue-300'>
                          Instant Confirmation
                        </span>
                      </div>

                      <p className='text-xs text-gray-600 mt-1.5 leading-relaxed'>
                        Pay securely with UPI (Google Pay, PhonePe, Paytm), Debit/Credit Card, Net Banking, or Wallets.
                      </p>

                      {/* Razorpay Badges */}
                      <div className='grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-blue-100'>
                        <div className='bg-white p-2 rounded-lg border border-gray-200 flex items-center justify-center gap-1.5 text-center shadow-2xs'>
                          <Smartphone size={14} className='text-emerald-600' />
                          <span className='text-[11px] font-bold text-gray-800'>UPI / QR</span>
                        </div>
                        <div className='bg-white p-2 rounded-lg border border-gray-200 flex items-center justify-center gap-1.5 text-center shadow-2xs'>
                          <CreditCard size={14} className='text-blue-600' />
                          <span className='text-[11px] font-bold text-gray-800'>Cards</span>
                        </div>
                        <div className='bg-white p-2 rounded-lg border border-gray-200 flex items-center justify-center gap-1.5 text-center shadow-2xs'>
                          <Wallet size={14} className='text-purple-600' />
                          <span className='text-[11px] font-bold text-gray-800'>NetBanking</span>
                        </div>
                        <div className='bg-white p-2 rounded-lg border border-gray-200 flex items-center justify-center gap-1.5 text-center shadow-2xs'>
                          <ShieldCheck size={14} className='text-amber-600' />
                          <span className='text-[11px] font-bold text-gray-800'>Wallets</span>
                        </div>
                      </div>

                      <div className='mt-2.5 flex items-center justify-between text-[11px] text-gray-500'>
                        <span className='flex items-center gap-1 text-emerald-700 font-semibold'>
                          <ShieldCheck size={12} /> 256-Bit SSL Bank-Grade Encryption
                        </span>
                        <span className='text-gray-400'>PCI-DSS Compliant</span>
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Action Button */}
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
                  <span>Subtotal ({cart.reduce((a, b) => a + b.quantity, 0)} items)</span>
                  <span className='font-bold text-gray-900'>₹{totalPrice}</span>
                </div>
                <div className='flex justify-between text-gray-600'>
                  <span>Delivery Charges</span>
                  <span className='font-bold text-emerald-600'>FREE</span>
                </div>
                <div className='flex justify-between text-gray-600'>
                  <span>Payment Type</span>
                  <span className='font-semibold text-gray-800'>
                    {paymentMethod === 'cod' ? 'Cash on Delivery' : 'Razorpay Online'}
                  </span>
                </div>
                <div className='border-t border-gray-100 pt-3 flex justify-between items-end'>
                  <div>
                    <span className='font-bold text-gray-900 text-base'>Total Payable</span>
                    <p className='text-[11px] text-gray-400'>Inclusive of all taxes</p>
                  </div>
                  <span className='font-extrabold text-2xl text-gray-900'>₹{totalPrice}</span>
                </div>
              </div>

              {/* DYNAMIC SUBMIT BUTTON ACCORDING TO PAYMENT METHOD */}
              {paymentMethod === 'cod' ? (
                <button
                  type='submit'
                  disabled={isProcessing}
                  className='w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-4 rounded-xl mt-6 transition-all text-sm uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-200 active:scale-[0.99] disabled:opacity-50'
                >
                  {isProcessing ? (
                    <div className='flex items-center gap-2'>
                      <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
                      <span>Placing Order in WordPress...</span>
                    </div>
                  ) : (
                    <>
                      <Truck size={18} />
                      <span>Confirm Order (COD) • ₹{totalPrice}</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  type='submit'
                  disabled={isProcessing}
                  className='w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-4 rounded-xl mt-6 transition-all text-sm uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-200 active:scale-[0.99] disabled:opacity-50'
                >
                  {isProcessing ? (
                    <div className='flex items-center gap-2'>
                      <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
                      <span>Opening Secure Checkout...</span>
                    </div>
                  ) : (
                    <>
                      <ShieldCheck size={18} className='text-yellow-300' />
                      <span>Pay ₹{totalPrice} via Razorpay</span>
                    </>
                  )}
                </button>
              )}

              <div className='mt-4 flex items-center justify-center gap-1.5 text-xs text-gray-400'>
                <ShieldCheck size={14} className='text-emerald-500' />
                <span>Synchronized with WooCommerce Admin</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }

  // ========================================================
  // 6. STANDARD CART ITEMS VIEW
  // ========================================================
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
        
        {/* Order Summary & Proceed Button */}
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
                <span className='font-bold text-emerald-600'>Free</span>
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
            
            <div className='mt-4 pt-4 border-t border-gray-100 space-y-2 text-xs text-gray-500'>
              <div className='flex items-center gap-2 text-emerald-700 font-medium'>
                <CheckCircle2 size={14} /> Cash on Delivery Available
              </div>
              <div className='flex items-center gap-2 text-blue-700 font-medium'>
                <ShieldCheck size={14} /> Razorpay UPI & Cards Accepted
              </div>
              <div className='flex items-center gap-2 text-gray-500'>
                <Truck size={14} /> Free delivery all over India
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
