import { useState } from 'react';
import { ShoppingCart, Minus, Plus, Trash2, CreditCard, TestTube } from 'lucide-react';
import CheckoutButton, { type CartItem } from '../components/CheckoutButton';

const StripeCheckout = () => {
  // Sample products
  const products = [
    {
      id: 'vitamin-b6',
      name: 'Vitamin B6 Supplement',
      description: 'High-quality Vitamin B6 (Pyridoxine) - 100mg, 60 capsules',
      price: 24.99,
      image: 'https://images.unsplash.com/photo-1584308666077-421b2b0e4b67?w=400&h=400&fit=crop&crop=center'
    },
    {
      id: 'omega-3',
      name: 'Omega-3 Fish Oil',
      description: 'Premium Omega-3 supplement - 1000mg, 120 softgels',
      price: 34.99,
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop&crop=center'
    },
    {
      id: 'vitamin-d',
      name: 'Vitamin D3 5000 IU',
      description: 'High-potency Vitamin D3 for immune support - 90 tablets',
      price: 22.99,
      image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=400&fit=crop&crop=center'
    },
    {
      id: 'magnesium',
      name: 'Magnesium Glycinate',
      description: 'Chelated magnesium for better absorption - 400mg, 90 capsules',
      price: 28.99,
      image: 'https://images.unsplash.com/photo-1550572017-edd951aa8eab?w=400&h=400&fit=crop&crop=center'
    }
  ];

  const [cart, setCart] = useState<CartItem[]>([]);
  const [backendStatus, setBackendStatus] = useState<string>('');

  // Test backend connectivity
  const testBackend = async () => {
    setBackendStatus('Testing...');
    try {
      console.log('🧪 Testing backend connectivity...');
      console.log('🌍 Current origin:', window.location.origin);
      
      // Test 1: Simple GET request to test basic connectivity
      console.log('🔄 Test 1: Basic connectivity...');
      try {
        const basicResponse = await fetch('https://biorebatebe.fulin.workers.dev/', {
          method: 'GET',
          mode: 'cors', // Explicitly request CORS
          credentials: 'omit', // Don't send credentials
          headers: { 
            'Accept': 'application/json'
          }
        });
        console.log('✅ Test 1 SUCCESS - Status:', basicResponse.status);
        console.log('✅ Test 1 CORS headers:', Object.fromEntries(basicResponse.headers.entries()));
        
        const basicText = await basicResponse.text();
        console.log('✅ Test 1 Response:', basicText.substring(0, 200));
      } catch (basicError) {
        console.error('❌ Test 1 FAILED:', basicError);
      }
      
      // Test 2: Direct POST to create-checkout-session (like your working curl)
      console.log('🔄 Test 2: Direct POST request...');
      try {
        const directPostResponse = await fetch('https://biorebatebe.fulin.workers.dev/create-checkout-session', {
          method: 'POST',
          mode: 'cors',
          credentials: 'omit',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            items: [
              {
                name: "Test Supplement",
                image: "https://example.com/test.jpg",
                price: 29.99,
                quantity: 1
              }
            ]
          })
        });
        
        console.log('✅ Test 2 SUCCESS - Status:', directPostResponse.status);
        console.log('✅ Test 2 CORS headers:', Object.fromEntries(directPostResponse.headers.entries()));
        
        if (directPostResponse.ok) {
          const responseData = await directPostResponse.json();
          console.log('✅ Test 2 Response data:', responseData);
          setBackendStatus(`✅ Backend working! Status: ${directPostResponse.status}`);
        } else {
          const errorText = await directPostResponse.text();
          console.log('⚠️ Test 2 Error response:', errorText);
          setBackendStatus(`⚠️ Backend responded but with error: ${directPostResponse.status} - ${errorText.substring(0, 100)}`);
        }
        
      } catch (postError) {
        console.error('❌ Test 2 FAILED:', postError);
        
        // More detailed error analysis
        if (postError instanceof TypeError && postError.message.includes('Failed to fetch')) {
          setBackendStatus(`❌ CORS Error: Your backend needs to add CORS headers. Error: ${postError.message}`);
        } else {
          setBackendStatus(`❌ Network Error: ${postError instanceof Error ? postError.message : 'Unknown error'}`);
        }
      }
      
    } catch (error) {
      console.error('❌ Overall test failed:', error);
      setBackendStatus(`❌ Test Failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const addToCart = (product: typeof products[0]) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image
        }];
      }
    });
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
    } else {
      setCart(prev =>
        prev.map(item =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
            <CreditCard className="h-8 w-8 text-blue-600" />
            Stripe Checkout with Backend
          </h1>
          <p className="text-gray-600">
            Full checkout flow using backend session creation
          </p>
        </div>

        {/* Backend Debug Section */}
        <div className="mb-8 max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="font-semibold text-red-900 mb-3">🐛 Debug Backend Issues</h3>
            <div className="space-y-3">
              <button
                onClick={testBackend}
                className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center space-x-2"
              >
                <TestTube className="h-4 w-4" />
                <span>Test Backend Connection</span>
              </button>
              {backendStatus && (
                <div className="bg-white p-3 rounded border">
                  <p className="text-sm font-mono">{backendStatus}</p>
                </div>
              )}
                             <div className="text-red-800 text-sm">
                 <p><strong>💡 URL Encoding Issue Fixed:</strong></p>
                 <p className="bg-green-100 text-green-800 p-2 rounded mb-2">
                   ✅ Removed problematic `{"{CHECKOUT_SESSION_ID}"}` placeholder that caused encoding errors
                 </p>
                 <p><strong>💡 Your Backend Should:</strong></p>
                 <ul className="list-disc list-inside space-y-1 mt-2">
                   <li>Create Stripe session with simple success/cancel URLs</li>
                   <li>Let Stripe automatically append `?session_id=` to success URL</li>
                   <li>Or manually append session_id in your success_url</li>
                   <li>Example: `success_url: payload.success_url + '?session_id=' + session.id`</li>
                 </ul>
               </div>
            </div>
          </div>
        </div>

        {/* Backend Info */}
        <div className="mb-8 max-w-4xl mx-auto">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-2">🔧 Backend Integration</h3>
            <div className="text-blue-800 text-sm space-y-1">
              <p><strong>Backend URL:</strong> <code className="bg-blue-100 px-1 rounded">https://biorebatebe.fulin.workers.dev</code></p>
              <p><strong>Endpoint:</strong> <code className="bg-blue-100 px-1 rounded">POST /create-checkout-session</code></p>
              <p><strong>Success URL:</strong> <code className="bg-blue-100 px-1 rounded">{window.location.origin}/success</code></p>
              <p><strong>Cancel URL:</strong> <code className="bg-blue-100 px-1 rounded">{window.location.origin}/cancel</code></p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Products Section */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                  <div className="text-center mb-4">
                    <div className="mb-4">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-24 h-24 object-cover rounded-lg mx-auto shadow-md"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/96x96/e5e7eb/9ca3af?text=No+Image';
                        }}
                      />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                    <div className="text-xl font-bold text-green-600">${product.price}</div>
                  </div>
                  
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <ShoppingCart className="h-5 w-5" />
                <span>Cart ({cartItemCount})</span>
              </h2>

              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">Your cart is empty</p>
                  <p className="text-gray-400 text-sm">Add some products to get started</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
                        <div className="flex-shrink-0">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded-md"
                            onError={(e) => {
                              e.currentTarget.src = 'https://via.placeholder.com/48x48/e5e7eb/9ca3af?text=No+Image';
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
                          <p className="text-green-600 font-semibold">${item.price}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="text-gray-500 hover:text-gray-700 p-1"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="text-gray-900 font-medium min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="text-gray-500 hover:text-gray-700 p-1"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 p-1 ml-2"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Cart Total */}
                  <div className="border-t pt-4 mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-semibold">${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Shipping:</span>
                      <span className="font-semibold text-green-600">FREE</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold">Total:</span>
                        <span className="text-xl font-bold text-green-600">${cartTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <CheckoutButton 
                    cartItems={cart}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-bold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <CreditCard className="h-5 w-5" />
                      <span>Checkout - ${cartTotal.toFixed(2)}</span>
                    </div>
                  </CheckoutButton>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StripeCheckout; 