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

        {/* Follow-up Blood Test Partners */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-purple-900 mb-3">📋 Track Your Progress with Follow-up Testing</h3>
          <p className="text-purple-800 text-sm mb-6">
            Monitor your supplement effectiveness with discounted follow-up blood tests from our trusted lab partners.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Lab Partner 1 */}
            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 font-bold text-sm">L</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">LabCorp</h4>
                  <p className="text-xs text-gray-600">Nationwide locations</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Vitamin D Test</span>
                  <div className="text-right">
                    <span className="text-gray-400 line-through">$89</span>
                    <span className="text-green-600 font-semibold ml-2">$59</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Complete Metabolic Panel</span>
                  <div className="text-right">
                    <span className="text-gray-400 line-through">$149</span>
                    <span className="text-green-600 font-semibold ml-2">$99</span>
                  </div>
                </div>
                <button className="w-full mt-3 bg-purple-600 text-white py-2 px-3 rounded-md text-sm font-medium hover:bg-purple-700 transition-colors">
                  Book Test - 30% OFF
                </button>
              </div>
            </div>

            {/* Lab Partner 2 */}
            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">Q</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Quest Diagnostics</h4>
                  <p className="text-xs text-gray-600">2,000+ locations</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">B12 & Folate Test</span>
                  <div className="text-right">
                    <span className="text-gray-400 line-through">$79</span>
                    <span className="text-green-600 font-semibold ml-2">$49</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Iron Studies Panel</span>
                  <div className="text-right">
                    <span className="text-gray-400 line-through">$119</span>
                    <span className="text-green-600 font-semibold ml-2">$79</span>
                  </div>
                </div>
                <button className="w-full mt-3 bg-purple-600 text-white py-2 px-3 rounded-md text-sm font-medium hover:bg-purple-700 transition-colors">
                  Book Test - 35% OFF
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-purple-100 rounded-lg">
            <h4 className="font-semibold text-purple-900 mb-2">📅 Recommended Testing Schedule:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-purple-800">
              <div className="text-center">
                <div className="font-medium">4-6 Weeks</div>
                <div className="text-xs">Initial progress check</div>
              </div>
              <div className="text-center">
                <div className="font-medium">12 Weeks</div>
                <div className="text-xs">Mid-term assessment</div>
              </div>
              <div className="text-center">
                <div className="font-medium">6 Months</div>
                <div className="text-xs">Full evaluation</div>
              </div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-purple-700">
              💡 <strong>Pro Tip:</strong> Set a calendar reminder to book your follow-up test in 4-6 weeks for optimal tracking!
            </p>
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
        </div>

        {/* Support Info */}
        <div className="mt-8 pt-6 border-gray-200">
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