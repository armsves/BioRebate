//import React from 'react';
import { useNavigate } from 'react-router-dom';
import SupplementCard from '../components/SupplementCard';
import { 
  //Search, 
  //Filter, 
  TrendingUp, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';

export default function Home() {
  const navigate = useNavigate();
  const { supplements, loading, error, refetch } = useProducts();
  
  /*
  const categories = [
    'Protein & Fitness',
    'Vitamins & Minerals',
    'Health & Wellness',
    'Beauty & Anti-aging',
    'Sports Nutrition',
    'Herbal Supplements',
  ];*/

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 mb-8 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 whitespace-nowrap">
            Smart Health-Based Supplement Discounts
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 mb-6">
            Upload your health records and get supplement recommendations with personalized discounts based on your biomarkers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Start Shopping
            </button>
            <button 
              onClick={() => navigate('/upload')}
              className="bg-blue-500 border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Upload
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search supplements, brands, or ingredients..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-3">
          <button className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </button>
          <select className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>Sort by: Popular</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Highest Rated</option>
            <option>Most Recent</option>
          </select>
        </div>
      </div>*/}

      {/* Categories
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <button
              key={index}
              className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-center"
            >
              <div className="font-medium text-gray-900">{category}</div>
            </button>
          ))}
        </div>
      </div>*/}

      {/* Trending Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Some discounts you could access</h2>
          </div>
          {error && (
            <button
              onClick={refetch}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Retry</span>
            </button>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-3">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              <span className="text-gray-600">Loading products...</span>
            </div>
          </div>
        )}
          

        {/* Error State */}
        {error && !loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load products</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={refetch}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Products Grid*/}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {supplements.map((supplement) => (
              <SupplementCard key={supplement.id} {...supplement} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && supplements.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              <h3 className="text-lg font-semibold mb-2">No products found</h3>
              <p>Check back later for new deals!</p>
            </div>
          </div>
        )}
      </div>

      {/* Stats Section 
      <div className="bg-white rounded-2xl p-8 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-600 mb-2">50,000+</div>
            <div className="text-gray-600">Happy Customers</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600 mb-2">1,200+</div>
            <div className="text-gray-600">Premium Products</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600 mb-2">40%</div>
            <div className="text-gray-600">Average Savings</div>
          </div>
        </div>
      </div>*/}
    </div>
  );
} 