import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Define TypeScript interface
interface CartItem {
  id: string;
  name: string;
  price: number; // Price in euros
  quantity: number;
  image: string; // Image URL
}

interface CheckoutButtonProps {
  cartItems: CartItem[];
  className?: string;
  children?: React.ReactNode;
}

export default function CheckoutButton({ 
  cartItems, 
  className = "bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
  children = "Pay Now"
}: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);
    
    try {
      console.log('🛒 Starting checkout with items:', cartItems);
      
      // Prepare payload with items and redirect URLs
      const payload = {
        items: cartItems,
        success_url: window.location.origin + '/success',
        cancel_url: window.location.origin + '/cancel'
      };
      
      console.log('📤 Sending payload with success/cancel URLs:', payload);
      console.log('📤 Payload JSON:', JSON.stringify(payload, null, 2));

      // 1. Create Checkout Session (matching working curl exactly)
      console.log('🔄 Sending request to backend...');
      
      const response = await fetch('https://biorebatebe.fulin.workers.dev/create-checkout-session', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      console.log('📥 Response status:', response.status);
      
      if (!response.ok) {
        let errorDetails;
        try {
          errorDetails = await response.json();
        } catch {
          errorDetails = await response.text();
        }
        console.error('❌ Backend error:', errorDetails);
        throw new Error(`Backend error: ${JSON.stringify(errorDetails)}`);
      }

      console.log('📥 Final response headers:', Object.fromEntries(response.headers.entries()));

      // 2. Get session ID from response
      const data = await response.json();
      console.log('✅ Success response:', data);
      
      const sessionId = data.sessionId || data.id || data.session_id;

      if (!sessionId) {
        console.error('❌ No session ID in response:', data);
        throw new Error('No session ID received from server');
      }

      console.log('🔑 Using session ID:', sessionId);

      // 3. Redirect to Stripe Checkout
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe not initialized');
      
      console.log('🔄 Redirecting to Stripe...');
      const { error } = await stripe.redirectToCheckout({ sessionId });
      
      if (error) {
        console.error('❌ Stripe redirect error:', error);
        alert(`Payment failed: ${error.message}`);
      }
    } catch (error) {
      console.error('💥 Checkout error:', error);
      
      // More detailed error message
      let errorMessage = 'Unknown error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      alert(`Checkout failed: ${errorMessage}\n\nCheck the browser console for more details.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={handleCheckout}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span>Processing...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}

export type { CartItem }; 