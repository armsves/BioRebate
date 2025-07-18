import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Link } from "react-router-dom";
import { Elements } from '@stripe/react-stripe-js';
import "./App.css";
import CredentialIssuance from "./components/issuance/CredentialIssuance";
import CredentialVerification from "./components/verification/CredentialVerification";
import Home from "./pages/Home";
import Discounts from "./pages/Discounts";
import Upload from "./pages/Upload";
import PharmacyDashboard from "./pages/PharmacyDashboard";

import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
import NavBarLogin from "./components/NavBarLogin";
import { AirService, BUILD_ENV, type AirEventListener, type BUILD_ENV_TYPE } from "@mocanetwork/airkit";
import { getEnvironmentConfig, type EnvironmentConfig } from "./config/environments";
import getStripe from "./lib/stripe";

// Get partner IDs from environment variables
const ISSUER_PARTNER_ID = import.meta.env.VITE_ISSUER_PARTNER_ID || "0383ce1d-82dc-4311-971e-1e43c9516ff9";
const VERIFIER_PARTNER_ID = import.meta.env.VITE_VERIFIER_PARTNER_ID || "0383ce1d-82dc-4311-971e-1e43c9516ff9";
const enableLogging = true;

const ENV_OPTIONS = [
  { label: "Staging", value: BUILD_ENV.STAGING },
  { label: "Sandbox", value: BUILD_ENV.SANDBOX },
];

// Component for the main title - always BioRebate and clickable to go home
const FlowTitle = () => {
  return (
    <Link to="/home" className="text-blue-600 hover:text-blue-700 transition-colors">
      <img
        src="/BioRebate.png"
        alt="BioRebate"
        className="h-24 w-auto"
      />
    </Link>
  );
};

// Function to get default partner ID based on current route
const getDefaultPartnerId = (pathname: string): string => {
  if (pathname === "/issue") {
    return ISSUER_PARTNER_ID;
  } else if (pathname === "/verify") {
    return VERIFIER_PARTNER_ID;
  }
  return ISSUER_PARTNER_ID; // Default to issuer for all other routes
};

function AppRoutes({
  airService,
  isInitialized,
  isLoading,
  isLoggedIn,
  userAddress,
  handleLogin,
  handleLogout,
  currentEnv,
  setCurrentEnv,
  partnerId,
  setPartnerId,
  environmentConfig,
}: {
  airService: AirService | null;
  isInitialized: boolean;
  isLoading: boolean;
  isLoggedIn: boolean;
  userAddress: string | null;
  handleLogin: () => void;
  handleLogout: () => void;
  currentEnv: BUILD_ENV_TYPE;
  setCurrentEnv: (env: string) => void;
  partnerId: string;
  setPartnerId: (partnerId: string) => void;
  environmentConfig: EnvironmentConfig;
}) {
  const location = useLocation();

  // Update partner ID when route changes
  useEffect(() => {
    const defaultPartnerId = getDefaultPartnerId(location.pathname);
    setPartnerId(defaultPartnerId);
  }, [location.pathname, setPartnerId]);

  return (
    <div
      className={
        "min-h-screen flex flex-col " +
        (location.pathname.startsWith("/issue")
          ? "bg-gradient-to-br from-blue-50 to-brand-100"
          : location.pathname.startsWith("/verify")
            ? "bg-gradient-to-br from-verify-50 to-verify-200"
            : location.pathname === "/home"
              ? "bg-gradient-to-br from-blue-50 to-blue-100"
              : location.pathname === "/discounts"
                ? "bg-gradient-to-br from-green-50 to-green-100"
                : location.pathname === "/upload"
                  ? "bg-gradient-to-br from-purple-50 to-purple-100"
                  : location.pathname === "/success"
                    ? "bg-gradient-to-br from-green-50 to-green-100"
                    : location.pathname === "/cancel"
                      ? "bg-gradient-to-br from-orange-50 to-orange-100"
                      : location.pathname === "/pharmacy"
                        ? "bg-gradient-to-br from-orange-50 to-orange-100"
                        : "bg-gradient-to-br from-gray-50 to-gray-200")
      }
    >
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-full sm:max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center h-auto sm:h-16 gap-2 sm:gap-0 py-2 sm:py-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-6">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                <FlowTitle />
              </h1>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">Partner ID:</span>
                <input
                  type="text"
                  value={partnerId}
                  onChange={(e) => setPartnerId(e.target.value)}
                  className="text-xs font-mono text-brand-700 bg-brand-50 px-2 py-1 rounded border border-transparent focus:border-brand-300 focus:outline-none focus:ring-1 focus:ring-brand-300 min-w-[260px]"
                  placeholder="Enter Partner ID"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-8 w-full sm:w-auto">
              <nav className="flex flex-row space-x-2 sm:space-x-4 w-full sm:w-auto overflow-x-auto p-1">
                <Link
                  to="/home"
                  className={`flex-1 sm:flex-none px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-all text-center whitespace-nowrap ${
                    location.pathname === "/home"
                      ? "text-blue-700 bg-blue-50 ring-2 ring-blue-300 shadow-sm"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/upload"
                  className={`flex-1 sm:flex-none px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-all text-center whitespace-nowrap ${
                    location.pathname === "/upload"
                      ? "text-purple-700 bg-purple-50 ring-2 ring-purple-300 shadow-sm"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Upload
                </Link>
                <Link
                  to="/discounts"
                  className={`flex-1 sm:flex-none px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-all text-center whitespace-nowrap ${
                    location.pathname === "/discounts"
                      ? "text-green-700 bg-green-50 ring-2 ring-green-300 shadow-sm"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Discounts
                </Link>
              </nav>
              <div className="w-full sm:w-auto">
                <NavBarLogin
                  isLoading={isLoading}
                  isInitialized={isInitialized}
                  isLoggedIn={isLoggedIn}
                  userAddress={userAddress}
                  onLogin={handleLogin}
                  onLogout={handleLogout}
                  currentEnv={currentEnv}
                  setCurrentEnv={(env) => setCurrentEnv(env as BUILD_ENV_TYPE)}
                  envOptions={ENV_OPTIONS}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Routes>
          {/* Redirect root to /home */}
          <Route path="/" element={<Navigate to="/home" replace />} />

          {/* BioRebate Pages */}
          <Route path="/home" element={<Home />} />
          <Route
            path="/discounts"
            element={
              <Discounts
                airService={airService}
                isLoggedIn={isLoggedIn}
                airKitBuildEnv={currentEnv}
                partnerId={partnerId}
                environmentConfig={environmentConfig}
              />
            }
          />
          <Route
            path="/upload"
            element={
              <Upload
                airService={airService}
                isLoggedIn={isLoggedIn}
                airKitBuildEnv={currentEnv}
                partnerId={partnerId}
                environmentConfig={environmentConfig}
              />
            }
          />

          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />
          <Route path="/pharmacy" element={<PharmacyDashboard />} />

          {/* Issuance Flow */}
          <Route
            path="/issue"
            element={
              <CredentialIssuance
                airService={airService}
                isLoggedIn={isLoggedIn}
                airKitBuildEnv={currentEnv}
                partnerId={partnerId}
                environmentConfig={environmentConfig}
              />
            }
          />

          {/* Verification Flow */}
          <Route
            path="/verify"
            element={
              <CredentialVerification
                airService={airService}
                isLoggedIn={isLoggedIn}
                airKitBuildEnv={currentEnv}
                partnerId={partnerId}
                environmentConfig={environmentConfig}
              />
            }
          />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-full sm:max-w-7xl mx-auto px-2 sm:px-4 lg:px-4 py-2 sm:py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
            {/* Developer Links */}
            <div className="flex items-center space-x-4">
              <Link
                to="/issue"
                className="px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              >
                Credential Issuance
              </Link>
              <Link
                to="/verify"
                className="px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              >
                Credential Verification
              </Link>
            </div>

            {/* Powered by text */}
            <p className="text-center text-gray-500 text-xs sm:text-sm">Powered by AIR Credential SDK</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  const [airService, setAirService] = useState<AirService | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [currentEnv, setCurrentEnv] = useState<BUILD_ENV_TYPE>(BUILD_ENV.SANDBOX);
  const [partnerId, setPartnerId] = useState<string>(ISSUER_PARTNER_ID);
  const [stripePromise, setStripePromise] = useState<Promise<import('@stripe/stripe-js').Stripe | null>>();

  // Get environment config based on current environment
  const environmentConfig = getEnvironmentConfig(currentEnv);

  useEffect(() => {
    setStripePromise(getStripe());
  }, []);

  const initializeAirService = async (env: BUILD_ENV_TYPE = currentEnv, partnerIdToUse: string = partnerId) => {
    if (!partnerIdToUse || partnerIdToUse === "your-partner-id") {
      console.warn("No valid Partner ID configured for nav bar login");
      setIsInitialized(true); // Set to true to prevent infinite loading
      return;
    }

    try {
      const service = new AirService({ partnerId: partnerIdToUse });
      await service.init({ buildEnv: env as (typeof BUILD_ENV)[keyof typeof BUILD_ENV], enableLogging, skipRehydration: false });
      setAirService(service);
      setIsInitialized(true);
      setIsLoggedIn(service.isLoggedIn);

      if (service.isLoggedIn && service.loginResult) {
        const result = service.loginResult;
        console.log("result @ initializeAirService", result);
        if (result.abstractAccountAddress) {
          setUserAddress(result.abstractAccountAddress || null);
        } else {
          console.log("no abstractAccountAddress @ initializeAirService");
          const accounts = await airService?.provider.request({ method: "eth_accounts", params: [] });

          console.log("accounts @ initializeAirService", accounts, airService?.provider);
          setUserAddress(Array.isArray(accounts) && accounts.length > 0 ? accounts[0] : null);
        }
      }

      const eventListener: AirEventListener = async (data) => {
        if (data.event === "logged_in") {
          setIsLoggedIn(true);
          if (data.result.abstractAccountAddress) {
            setUserAddress(data.result.abstractAccountAddress || null);
          } else {
            const accounts = await airService?.provider.request({ method: "eth_accounts", params: [] });
            setUserAddress(Array.isArray(accounts) && accounts.length > 0 ? accounts[0] : null);
          }
        } else if (data.event === "logged_out") {
          setIsLoggedIn(false);
          setUserAddress(null);
        }
      };
      service.on(eventListener);
    } catch (err) {
      console.error("Failed to initialize AIRKit service in nav bar:", err);
      setIsInitialized(true); // Set to true to prevent infinite loading on error
    }
  };

  // Re-initialize AIRKit when partner ID or environment changes
  useEffect(() => {
    initializeAirService(currentEnv, partnerId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentEnv, partnerId]);

  useEffect(() => {
    // Only run on mount for initial load
    // (the above effect will handle env and partner ID changes)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    initializeAirService(currentEnv, partnerId);
    return () => {
      if (airService) {
        airService.cleanUp();
      }
    };
  }, []);

  const handleLogin = async () => {
    if (!airService) return;
    setIsLoading(true);
    try {
      const loginResult = await airService.login();

      if (loginResult.abstractAccountAddress) {
        setUserAddress(loginResult.abstractAccountAddress || null);
      } else {
        const accounts = await airService?.provider.request({ method: "eth_accounts", params: [] });
        setUserAddress(Array.isArray(accounts) && accounts.length > 0 ? accounts[0] : null);
      }
    } catch (err) {
      console.error("Login failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    if (!airService) return;
    try {
      await airService.logout();
      setUserAddress(null);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  if (!stripePromise) return null;

  return (
    <Elements stripe={stripePromise}>
      <Router>
        <AppRoutes
          airService={airService}
          isInitialized={isInitialized}
          isLoading={isLoading}
          isLoggedIn={isLoggedIn}
          userAddress={userAddress}
          handleLogin={handleLogin}
          handleLogout={handleLogout}
          currentEnv={currentEnv}
          setCurrentEnv={(env) => setCurrentEnv(env as BUILD_ENV_TYPE)}
          partnerId={partnerId}
          setPartnerId={setPartnerId}
          environmentConfig={environmentConfig}
        />
      </Router>
    </Elements>
  );
}

export default App;
