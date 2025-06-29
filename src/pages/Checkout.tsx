import CheckoutForm from '../components/CheckoutForm';

const Checkout = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Test Checkout
            </h1>
            <p className="text-gray-600">
              Test Stripe payment integration with shipping address collection
            </p>
          </div>

          <div className="mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Test Card Numbers:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li><strong>Success:</strong> 4242 4242 4242 4242</li>
                <li><strong>Decline:</strong> 4000 0000 0000 0002</li>
                <li><strong>3D Secure:</strong> 4000 0027 6000 3184</li>
              </ul>
              <p className="text-xs text-blue-700 mt-2">
                Use any future expiry date, any 3-digit CVC, and any postal code.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Shipping & Payment Information
            </h2>
            <CheckoutForm />
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              This is a test environment. No real payments will be processed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 