import { XCircle, ArrowLeft, ShoppingCart, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cancel = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        
        {/* Cancel Icon */}
        <div className="mb-8">
          <div className="mx-auto w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <XCircle className="h-12 w-12 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Checkout Canceled
          </h1>
          <p className="text-gray-600 text-lg">
            No worries! Your payment was not processed.
          </p>
        </div>

        {/* Information */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-orange-900 mb-3">What happened?</h2>
          <div className="space-y-2 text-sm text-orange-800">
            <p>• You canceled the payment process on the Stripe checkout page</p>
            <p>• No charges were made to your payment method</p>
            <p>• Your cart items are still available if you'd like to try again</p>
          </div>
        </div>

        {/* Reasons & Solutions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Common reasons & solutions:</h3>
          <div className="text-left space-y-3 text-sm text-blue-800">
            <div>
              <p className="font-medium">❓ Changed your mind?</p>
              <p>That's totally fine! You can always come back later.</p>
            </div>
            <div>
              <p className="font-medium">💳 Payment method issues?</p>
              <p>Try a different card or payment method when you're ready.</p>
            </div>
            <div>
              <p className="font-medium">🔍 Want to review your order?</p>
              <p>You can go back to your cart to make any changes.</p>
            </div>
            <div>
              <p className="font-medium">❓ Need help?</p>
              <p>Contact our support team if you experienced any technical issues.</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/stripe-checkout"
              className="inline-flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Cart</span>
            </Link>
            
            <Link
              to="/discounts"
              className="inline-flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Browse Discounts</span>
            </Link>
          </div>

          <Link
            to="/home"
            className="inline-flex items-center justify-center space-x-2 text-gray-600 hover:text-gray-700 font-medium"
          >
            <Home className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Support Section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2">Need assistance?</h4>
          <p className="text-sm text-gray-600 mb-3">
            If you encountered any issues during checkout, we're here to help!
          </p>
          <div className="space-y-1 text-sm">
            <p>
              📧 Email: <a href="mailto:support@biorebate.com" className="text-blue-600 hover:text-blue-700">support@biorebate.com</a>
            </p>
            <p>
              💬 Live chat: Available 9 AM - 6 PM EST
            </p>
          </div>
        </div>

        {/* Reassurance */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>🔒 Your security matters:</strong> No payment information was stored or processed since you canceled before completing the transaction.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cancel; 