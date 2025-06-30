/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect } from 'react';
import { Gift, Clock, Star, CheckCircle, Filter, Search, Shield, AlertTriangle, Award, ArrowRight, ShoppingCart, Minus, Plus, Trash2, CreditCard } from 'lucide-react';
import CheckoutButton, { type CartItem } from '../components/CheckoutButton';
import { AirCredentialWidget, type QueryRequest, type VerificationResults, type Language } from "@mocanetwork/air-credential-sdk";
import "@mocanetwork/air-credential-sdk/dist/style.css";
import { type AirService, BUILD_ENV } from "@mocanetwork/airkit";
import type { BUILD_ENV_TYPE } from "@mocanetwork/airkit";
import type { EnvironmentConfig } from "../config/environments";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";

interface DiscountsProps {
  airService?: AirService | null;
  isLoggedIn?: boolean;
  airKitBuildEnv?: BUILD_ENV_TYPE;
  partnerId?: string;
  environmentConfig?: EnvironmentConfig;
}

const getVerifierAuthToken = async (verifierDid: string, apiKey: string, apiUrl: string): Promise<string | null> => {
  try {
    const response = await fetch(`${apiUrl}/verifier/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "*/*",
        "X-Test": "true",
      },
      body: JSON.stringify({
        verifierDid: verifierDid,
        authToken: apiKey,
      }),
    });

    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const data = await response.json();

    if (data.code === 80000000 && data.data && data.data.token) {
      return data.data.token;
    } else {
      console.error("Failed to get verifier auth token from API:", data.msg || "Unknown error");
      return null;
    }
  } catch (error) {
    console.error("Error fetching verifier auth token:", error);
    return null;
  }
};

export default function Discounts({
  airService = null,
  isLoggedIn = false,
  airKitBuildEnv = BUILD_ENV.SANDBOX,
  partnerId = "",
  environmentConfig = {
    apiUrl: "https://api-sandbox.airprotocol.com",
    widgetUrl: "https://widget-sandbox.airprotocol.com"
  }
}: DiscountsProps = {}) {

  // Cart state management
  const [cart, setCart] = useState<CartItem[]>([]);

  // Cart management functions
  const addToCart = (discount: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === discount.id);
      if (existing) {
        return prev.map(item =>
          item.id === discount.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, {
          id: discount.id,
          name: discount.title,
          price: discount.discountPrice,
          quantity: 1,
          image: discount.image
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

  // Verification states
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResults | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const widgetRef = useRef<AirCredentialWidget | null>(null);

  // Configuration for verification
  const [config] = useState({
    apiKey: import.meta.env.VITE_VERIFIER_API_KEY || "your-verifier-api-key",
    verifierDid: import.meta.env.VITE_VERIFIER_DID || "did:example:verifier123",
    programId: import.meta.env.VITE_PROGRAM_ID || "c21hc030kb5iu0030224Qs",
  });

  // Verification logic
  const generateWidget = async () => {
    try {
      const fetchedVerifierAuthToken = await getVerifierAuthToken(config.verifierDid, config.apiKey, environmentConfig.apiUrl);

      if (!fetchedVerifierAuthToken) {
        setVerificationError("Failed to fetch verifier authentication token. Please check your API Key.");
        setIsVerifying(false);
        return;
      }

      const queryRequest: QueryRequest = {
        process: "Verify",
        verifierAuth: fetchedVerifierAuthToken,
        programId: config.programId,
      };

      const rp = await airService?.goToPartner(environmentConfig.widgetUrl).catch((err) => {
        console.error("Error getting URL with token:", err);
      });

      if (!rp?.urlWithToken) {
        console.warn("Failed to get URL with token. Please check your partner ID.");
        setVerificationError("Failed to get URL with token. Please check your partner ID.");
        setIsVerifying(false);
        return;
      }

      widgetRef.current = new AirCredentialWidget(queryRequest, partnerId, {
        endpoint: rp?.urlWithToken,
        airKitBuildEnv: airKitBuildEnv || BUILD_ENV.STAGING,
        theme: "light",
        locale: "en" as Language,
      });

      widgetRef.current.on("verifyCompleted", (results: VerificationResults) => {
        setVerificationResult(results);
        setIsVerifying(false);

        // Check if verification was successful
        if (results.status === "Compliant") {
          setIsVerified(true);
        } else {
          setVerificationError(`Verification failed: ${results.status}`);
        }
        console.log("Verification completed:", results);
      });

      widgetRef.current.on("close", () => {
        setIsVerifying(false);
        console.log("Widget closed");
      });
    } catch (err) {
      setVerificationError(err instanceof Error ? err.message : "Failed to create widget");
      setIsVerifying(false);
    }
  };

  const handleVerifyCredential = async () => {
    setIsVerifying(true);
    setVerificationError(null);
    setVerificationResult(null);

    try {
      if (!widgetRef.current) {
        await generateWidget();
      }

      if (widgetRef.current) {
        widgetRef.current.launch();
      }
    } catch (err) {
      setVerificationError(err instanceof Error ? err.message : "An error occurred");
      setIsVerifying(false);
    }
  };

  // Clean up widget on unmount
  useEffect(() => {
    return () => {
      if (widgetRef.current) {
        widgetRef.current.destroy();
      }
    };
  }, []);

  const discounts = {
    available: [
      {
        id: '1',
        title: '30% OFF Omega-3 Fish Oil',
        brand: 'OceanLife',
        discount: '30%',
        originalPrice: 34.99,
        discountPrice: 24.49,
        expiresIn: '5 days',
        reason: 'Based on your cholesterol levels',
        category: 'Heart Health',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop&crop=center',
      },
      {
        id: '2',
        title: '25% OFF Vitamin D3 5000 IU',
        brand: 'SunVitamin',
        discount: '25%',
        originalPrice: 29.99,
        discountPrice: 22.49,
        expiresIn: '3 days',
        reason: 'Based on your vitamin D deficiency',
        category: 'Vitamins',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=400&fit=crop&crop=center',
      },
      {
        id: '3',
        title: '40% OFF Magnesium Glycinate',
        brand: 'MineralMax',
        discount: '40%',
        originalPrice: 39.99,
        discountPrice: 23.99,
        expiresIn: '7 days',
        reason: 'Recommended for sleep improvement',
        category: 'Sleep Support',
        rating: 4.7,
        image: 'https://plus.unsplash.com/premium_photo-1730838596002-a2e656bc7ebf?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
      {
        id: '4',
        title: '35% OFF Probiotics 50 Billion CFU',
        brand: 'GutHealth',
        discount: '35%',
        originalPrice: 49.99,
        discountPrice: 32.49,
        expiresIn: '2 days',
        reason: 'Based on digestive health indicators',
        category: 'Digestive Health',
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1631824681694-60908ffbbff6?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
    ],
    used: [
      {
        id: '5',
        title: '20% OFF Multivitamin Complex',
        brand: 'NaturePlus',
        discount: '20%',
        originalPrice: 49.99,
        discountPrice: 39.99,
        usedDate: '2024-01-15',
        category: 'General Health',
        rating: 4.5,
      },
    ],
    expired: [
      {
        id: '6',
        title: '45% OFF Protein Powder',
        brand: 'FitnessPro',
        discount: '45%',
        originalPrice: 79.99,
        discountPrice: 43.99,
        expiredDate: '2024-01-10',
        category: 'Fitness',
        rating: 4.8,
      },
    ],
  };

  const stats = [
    { label: 'Total Savings', value: '$127.50', color: 'text-green-600' },
    { label: 'Active Discounts', value: '4', color: 'text-blue-600' },
    { label: 'Used This Month', value: '2', color: 'text-purple-600' },
  ];

  // If not verified, show verification flow
  if (!isVerified) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        {/* Verification Card */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
                <Award className="h-8 w-8 text-blue-500" />
                Health Credential Verification
              </h2>
              <p className="text-gray-600">
                Verify your digital health credential to unlock personalized discounts
              </p>
            </div>

            {/* Verification Status Messages */}
            {verificationError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                  <p className="text-red-800 text-sm">{verificationError}</p>
                </div>
              </div>
            )}

            {verificationResult && verificationResult.status !== "Compliant" && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="text-yellow-800 text-sm font-medium">Verification Status: {verificationResult.status}</p>
                    <p className="text-yellow-700 text-sm mt-1">
                      Your credential verification was not successful. Please ensure you have a valid health credential and try again.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Benefits of Verification */}
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-blue-900 mb-3">What you'll get after verification:</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <span className="text-blue-800 text-sm">Personalized supplement recommendations</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <span className="text-blue-800 text-sm">Exclusive discounts up to 60% OFF</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <span className="text-blue-800 text-sm">Health-based product matching</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <span className="text-blue-800 text-sm">Priority access to new products</span>
                </div>
              </div>
            </div>

            {/* Verification Button */}
            <div className="relative group">
              <button
                onClick={handleVerifyCredential}
                disabled={isVerifying || !isLoggedIn}
                className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold text-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-3"
              >
                {isVerifying ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Verifying Credential...</span>
                  </>
                ) : (
                  <>
                    <Shield className="h-5 w-5" />
                    <span>Verify My Health Credential</span>
                  </>
                )}
              </button>
              {/* Tooltip for disabled state */}
              {!isLoggedIn && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                  Please connect your wallet to verify credentials
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="mt-2 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-2">How it works:</h4>
              <ol className="text-sm text-gray-600 space-y-1">
                <li>1. Click "Verify My Health Credential" above</li>
                <li>2. Present your digital health credential</li>
                <li>3. Once verified, access your personalized discounts</li>
              </ol>
            </div>
          </div>

          {/* Alternative Actions */}
          <div className="mt-2 text-center">
            <p className="text-gray-600 mb-4">Don't have a health credential yet?</p>
            <a
              href="/upload"
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <span>Upload health records to create one</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  // If verified, show discounts
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Verified Header */}
      <div className="mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center space-x-3 bg-green-50 px-4 py-2 rounded-full border border-green-200">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-green-800 font-medium text-sm">Credential Verified</span>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">My Personalized Discounts</h1>
        <p className="text-gray-600 text-center">Supplement deals based on your verified health profile</p>
      </div>

      {/* Stats and Cart Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-2">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
              <Gift className={`h-8 w-8 ${stat.color.replace('text-', 'text-').split('-')[1] === 'green' ? 'text-green-400' : stat.color.replace('text-', 'text-').split('-')[1] === 'blue' ? 'text-blue-400' : 'text-purple-400'}`} />
            </div>
          </div>
        ))}
        {/* Cart Summary Card */}
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 mb-1">Cart Items</p>
              <p className="text-2xl font-bold text-blue-600">{cartItemCount}</p>
            </div>
            <ShoppingCart className="h-8 w-8 text-blue-400" />
          </div>
          {cartTotal > 0 && (
            <div className="mt-2 pt-2 border-t border-blue-200">
              <p className="text-sm text-blue-800 font-medium">Total: ${cartTotal.toFixed(2)}</p>
            </div>
          )}
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search your discounts..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <Filter className="h-5 w-5" />
          <span>Filter</span>
        </button>
      </div>

      {/* Main Content with Discounts and Cart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Discounts Section */}
        <div className="lg:col-span-2">
          {/* Tabs */}
          <Tabs defaultValue="available" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="available" className="relative">
                Available
                <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                  {discounts.available.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="used" className="relative">
                Used
                <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                  {discounts.used.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="expired" className="relative">
                Expired
                <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                  {discounts.expired.length}
                </span>
              </TabsTrigger>
            </TabsList>

        {/* Available Discounts Tab Content */}
        <TabsContent value="available" className="space-y-4">
          {discounts.available.map((discount) => (
            <div key={discount.id} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start space-x-4 mb-4 lg:mb-0">
                  <img
                    src={discount.image}
                    alt={discount.title}
                    className="w-16 h-16 rounded-lg object-cover shadow-md"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/64x64/e5e7eb/9ca3af?text=No+Image';
                    }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                        -{discount.discount}
                      </span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        {discount.category}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{discount.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{discount.brand}</p>
                    <p className="text-sm text-blue-600 mb-2">{discount.reason}</p>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">{discount.rating}</span>
                      </div>
                      <span className="text-gray-300">•</span>
                      <div className="flex items-center text-orange-600">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="text-sm">Expires in {discount.expiresIn}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">${discount.discountPrice}</div>
                    <div className="text-sm text-gray-400 line-through">${discount.originalPrice}</div>
                  </div>
                  <button 
                    onClick={() => addToCart(discount)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Empty State for Available */}
          {discounts.available.length === 0 && (
            <div className="text-center py-4">
              <Gift className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No available discounts
              </h3>
              <p className="text-gray-600 mb-6">
                Upload health records to unlock personalized discounts
              </p>
              <a 
                href="/upload"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Upload Health Records
              </a>
              </div>
          )}
        </TabsContent>

        {/* Used Discounts Tab Content */}
        <TabsContent value="used" className="space-y-4">
          {discounts.used.map((discount) => (
            <div key={discount.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                  <div>
                    <h3 className="font-semibold text-gray-900">{discount.title}</h3>
                    <p className="text-sm text-gray-600">{discount.brand}</p>
                    <p className="text-sm text-gray-500">Used on {discount.usedDate}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-700">${discount.discountPrice}</div>
                  <div className="text-sm text-gray-400 line-through">${discount.originalPrice}</div>
                  <div className="text-sm text-green-600">Saved {discount.discount}</div>
                </div>
              </div>
            </div>
          ))}

          {/* Empty State for Used */}
          {discounts.used.length === 0 && (
            <div className="text-center py-12">
              <Gift className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No used discounts
              </h3>
              <p className="text-gray-600 mb-6">
                You don't have any used discounts yet
              </p>
            </div>
          )}
        </TabsContent>

        {/* Expired Discounts Tab Content */}
        <TabsContent value="expired" className="space-y-4">
          {discounts.expired.map((discount) => (
            <div key={discount.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200 opacity-60">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Clock className="h-8 w-8 text-gray-400" />
                  <div>
                    <h3 className="font-semibold text-gray-700">{discount.title}</h3>
                    <p className="text-sm text-gray-500">{discount.brand}</p>
                    <p className="text-sm text-gray-400">Expired on {discount.expiredDate}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-500">${discount.discountPrice}</div>
                  <div className="text-sm text-gray-400 line-through">${discount.originalPrice}</div>
                  <div className="text-sm text-gray-400">Expired</div>
                </div>
              </div>
            </div>
          ))}

          {/* Empty State for Expired */}
          {discounts.expired.length === 0 && (
            <div className="text-center py-12">
              <Gift className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No expired discounts
              </h3>
              <p className="text-gray-600 mb-6">
                You don't have any expired discounts yet
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
        </div>

        {/* Cart Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-2 sticky top-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <ShoppingCart className="h-5 w-5" />
              <span>Cart ({cartItemCount})</span>
            </h2>

            {cart.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">Your cart is empty</p>
                <p className="text-gray-400 text-sm">Add discounted items to get started</p>
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
  );
}

