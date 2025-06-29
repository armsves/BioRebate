import { useEffect, useState } from 'react';
import { CheckCircle, Package, ArrowRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const Success = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    // Get session_id from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('session_id');
    setSessionId(id);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        
        {/* Success Icon */}
        <div className="mb-8">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Successful! 🎉
          </h1>
          <p className="text-gray-600 text-lg">
            Thank you for your purchase. Your order has been confirmed.
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Package className="h-6 w-6 text-green-600" />
            <h2 className="text-xl font-semibold text-green-900">Order Confirmed</h2>
          </div>
          
          {sessionId && (
            <div className="bg-white rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600 mb-1">Session ID:</p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono break-all">
                {sessionId}
              </code>
            </div>
          )}

          <div className="space-y-3 text-sm text-green-800">
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span>Payment processed successfully</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span>Order confirmation email sent</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span>Items will be shipped within 1-2 business days</span>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">What happens next?</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>📧 You'll receive an order confirmation email shortly</p>
            <p>📦 Your items will be packed and shipped within 1-2 business days</p>
            <p>🚚 You'll receive tracking information once your order ships</p>
            <p>💬 Contact support if you have any questions about your order</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/discounts"
              className="inline-flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <span>View More Discounts</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            
            <Link
              to="/home"
              className="inline-flex items-center justify-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              <Home className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </div>

          <Link
                          to="/discounts"
            className="inline-flex items-center justify-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
          >
                          <span>Browse More Discounts</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
        </div>

        {/* Support Info */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Need help with your order? Contact our support team at{' '}
            <a href="mailto:support@biorebate.com" className="text-blue-600 hover:text-blue-700">
              support@biorebate.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Success; 