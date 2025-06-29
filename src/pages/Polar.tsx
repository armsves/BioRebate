import React, { useState } from 'react';

const Polar = () => {
  const [customerEmail, setCustomerEmail] = useState('');
  
  const productInfo = {
    name: 'Vitamin B6 Supplement',
    price: 24.99,
    description: 'High-quality Vitamin B6 (Pyridoxine) - 100mg, 60 capsules',
    image: '🟡'
  };

  // Base Stripe payment link
  const basePaymentLink = 'https://buy.stripe.com/test_28EfZh4r25lA7ky2NF2go00';

  const handleBuyNow = () => {
    // Build the payment link with customer email if provided
    let paymentLink = basePaymentLink;
    
    if (customerEmail) {
      // If there's already a prefilled_email parameter, we need to replace it
      const url = new URL(paymentLink);
      url.searchParams.set('prefilled_email', customerEmail);
      paymentLink = url.toString();
    }

    // Redirect to Stripe payment link
    window.location.href = paymentLink;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6">
            <h1 className="text-3xl font-bold">Polar Vitamins</h1>
            <p className="text-yellow-100">Premium Health Supplements</p>
          </div>

          <div className="md:flex">
            {/* Product Section */}
            <div className="md:w-1/2 p-6 bg-gray-50">
              <div className="text-center">
                <div className="text-6xl mb-4">{productInfo.image}</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {productInfo.name}
                </h2>
                <p className="text-gray-600 mb-4">{productInfo.description}</p>
                <div className="text-3xl font-bold text-green-600">
                  ${productInfo.price}
                </div>
              </div>

              <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Benefits:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Supports brain function and development</li>
                  <li>• Helps with protein metabolism</li>
                  <li>• Supports immune system health</li>
                  <li>• May help reduce PMS symptoms</li>
                </ul>
              </div>

              <div className="mt-6 bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2">Why Choose Polar?</h3>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Third-party tested for purity</li>
                  <li>• Non-GMO and gluten-free</li>
                  <li>• 60-day money-back guarantee</li>
                  <li>• Fast, free shipping</li>
                </ul>
              </div>
            </div>

            {/* Purchase Section */}
            <div className="md:w-1/2 p-6">
              <h3 className="text-xl font-semibold mb-4">Get Your Vitamin B6 Today</h3>
              
              <div className="space-y-4">
                {/* Optional Email Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email (Optional - for order updates)
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    placeholder="your@email.com"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    We'll pre-fill this email in the checkout for faster ordering
                  </p>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 p-4 rounded-lg border-2 border-yellow-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Order Summary</h4>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">Vitamin B6 Supplement</span>
                    <span className="font-semibold">${productInfo.price}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">Shipping</span>
                    <span className="font-semibold text-green-600">FREE</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">Total:</span>
                    <span className="text-xl font-bold text-green-600">
                      ${productInfo.price}
                    </span>
                  </div>
                </div>

                {/* Buy Now Button */}
                <button
                  onClick={handleBuyNow}
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg"
                >
                  🛒 Buy Now - Secure Checkout
                </button>

                {/* Trust Indicators */}
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                    <span>🔒 Secure Payment</span>
                    <span>📦 Fast Shipping</span>
                    <span>✅ Money Back Guarantee</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Powered by Stripe - Your payment information is secure and encrypted
                  </p>
                </div>

                {/* What Happens Next */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">What happens next?</h4>
                  <ol className="text-sm text-blue-800 space-y-1">
                    <li>1. Click "Buy Now" to go to secure Stripe checkout</li>
                    <li>2. Enter your payment and shipping details</li>
                    <li>3. Receive instant order confirmation</li>
                    <li>4. Your Vitamin B6 ships within 1-2 business days</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Polar; 