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
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi' | 'card'>('cod');
  const [upiId, setUpiId] = useState('');
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

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!shippingInfo.fullName.trim()) {
      toast.error('Please enter your full name');
      return;
    }
    if (!shippingInfo.phone.trim() || shippingInfo.phone.trim().length < 10) {
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
    if (paymentMethod === 'upi' && upiId.trim() && !upiId.includes('@')) {
      toast.error('Please enter a valid UPI ID (e.g. mobile@upi)');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const generatedOrderId = `AZB-${Math.floor(100000 + Math.random() * 900000)}`;
      
      setPlacedOrder({
        orderId: generatedOrderId,
        itemsCount: cart.reduce((acc, i) => acc + i.quantity, 0),
        amount: totalPrice,
        method: paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : paymentMethod === 'upi' ? 'UPI Payment' : 'Card / Net Banking',
        customer: { ...shippingInfo }
      });

      clearCart();
      setIsProcessing(false);
      setCheckoutStep('success');
      toast.success('Order placed successfully!');
    }, 1200);
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
            Thank you for shopping with AZB Store. Your order is confirmed.
          </p>

          <div className='bg-gray-50 rounded-2xl p-5 sm:p-6 text-left border border-gray-200/80 mb-8 space-y-3 text-sm'>
            <div className='flex justify-between items-center border-b border-gray-200 pb-3'>
              <span className='text-gray-500 font-medium'>Order ID:</span>
              <span className='font-mono font-bold text-gray-900 text-base'>#{placedOrder.orderId}</span>
            </div>

            <div className='flex justify-between items-center border-b border-gray-200 pb-3'>
              <span className='text-gray-500 font-medium'>Payment Method:</span>
              <span className='font-bold text-gray-900 flex items-center gap-1.5'>
                {placedOrder.method === 'Cash on Delivery (COD)' && <Wallet size={16} className='text-yellow-600' />}
                {placedOrder.method === 'UPI Payment' && <Smartphone size={16} className='text-green-600' />}
                {placedOrder.method === 'Card / Net Banking' && <CreditCard size={16} className='text-blue-600' />}
                {placedOrder.method}
              </span>
            </div>

            <div className='flex justify-between items-center border-b border-gray-200 pb-3'>
              <span className='text-gray-500 font-medium'>Total Amount:</span>
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

            {/* Payment Method Card */}
            <div className='bg-white rounded-2xl shadow-xs border border-gray-200 p-6'>
              <h2 className='text-base sm:text-lg font-bold text-gray-900 mb-4 flex items-center gap-2'>
                <Wallet size={18} className='text-yellow-500' />
                2. Select Payment Method
              </h2>

              <div className='space-y-3'>
                {/* Cash on Delivery (COD) Option */}
                <label
                  onClick={() => setPaymentMethod('cod')}
                  className={`flex items-start gap-3.5 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-yellow-400 bg-yellow-50/50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <input
                    type='radio'
                    name='payment'
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className='mt-1 text-yellow-500 focus:ring-yellow-400'
                  />
                  <div className='flex-1'>
                    <div className='flex items-center gap-2'>
                      <Wallet size={18} className='text-yellow-600' />
                      <span className='font-bold text-gray-900 text-sm'>Cash on Delivery (COD)</span>
                    </div>
                    <p className='text-xs text-gray-500 mt-1'>
                      Pay cash to delivery agent when your order arrives at your doorstep.
                    </p>
                  </div>
                </label>

                {/* UPI Option */}
                <label
                  onClick={() => setPaymentMethod('upi')}
                  className={`flex items-start gap-3.5 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'upi'
                      ? 'border-yellow-400 bg-yellow-50/50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <input
                    type='radio'
                    name='payment'
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                    className='mt-1 text-yellow-500 focus:ring-yellow-400'
                  />
                  <div className='flex-1'>
                    <div className='flex items-center gap-2'>
                      <Smartphone size={18} className='text-green-600' />
                      <span className='font-bold text-gray-900 text-sm'>UPI (Google Pay / PhonePe / Paytm / BHIM)</span>
                    </div>
                    <p className='text-xs text-gray-500 mt-1'>
                      Pay instantly using any UPI App or QR Code.
                    </p>

                    {paymentMethod === 'upi' && (
                      <div className='mt-3 pt-3 border-t border-gray-200/80'>
                        <label className='block text-[11px] font-bold text-gray-600 mb-1'>Enter UPI ID (Optional)</label>
                        <input
                          type='text'
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder='e.g. 9876543210@paytm or name@okaxis'
                          className='w-full px-3 py-2 rounded-lg border border-gray-300 text-xs focus:outline-none focus:ring-1 focus:ring-yellow-400'
                        />
                        <p className='text-[10px] text-gray-400 mt-1'>
                          You will receive a payment request notification on your UPI app.
                        </p>
                      </div>
                    )}
                  </div>
                </label>

                {/* Card / Net Banking Option */}
                <label
                  onClick={() => setPaymentMethod('card')}
                  className={`flex items-start gap-3.5 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'border-yellow-400 bg-yellow-50/50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <input
                    type='radio'
                    name='payment'
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className='mt-1 text-yellow-500 focus:ring-yellow-400'
                  />
                  <div className='flex-1'>
                    <div className='flex items-center gap-2'>
                      <CreditCard size={18} className='text-blue-600' />
                      <span className='font-bold text-gray-900 text-sm'>Credit / Debit Card / Net Banking</span>
                    </div>
                    <p className='text-xs text-gray-500 mt-1'>
                      Visa, MasterCard, RuPay, and all major Indian Banks supported.
                    </p>
                  </div>
                </label>
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

              {/* Place Order CTA */}
              <button
                type='submit'
                disabled={isProcessing}
                className='w-full bg-black hover:bg-gray-800 text-white font-bold py-3.5 rounded-xl mt-6 transition-all text-sm uppercase tracking-wide cursor-pointer flex items-center justify-center gap-2 shadow-md'
              >
                {isProcessing ? (
                  <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
                ) : (
                  <>
                    <ShieldCheck size={18} className='text-yellow-400' />
                    <span>
                      {paymentMethod === 'cod' && `Confirm Order (COD - ₹${totalPrice})`}
                      {paymentMethod === 'upi' && `Pay via UPI (₹${totalPrice})`}
                      {paymentMethod === 'card' && `Pay Now (₹${totalPrice})`}
                    </span>
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
