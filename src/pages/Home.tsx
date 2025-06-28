import React from 'react';
import SupplementCard from '../components/SupplementCard';
import { Search, Filter, TrendingUp } from 'lucide-react';

export default function Home() {
  const supplements = [
    {
      id: '1',
      name: 'Premium Whey Protein Isolate 5lb',
      brand: 'OptimalNutrition',
      originalPrice: 89.99,
      discountPrice: 54.99,
      discountPercentage: 39,
      rating: 4.8,
      reviewCount: 2341,
      imageUrl: 'https://images.pexels.com/photos/4099238/pexels-photo-4099238.jpeg?auto=compress&cs=tinysrgb&w=500',
      timeLeft: '2d 5h',
      soldCount: 1247,
      description: 'Fast-absorbing whey protein isolate with 25g protein per serving. Perfect for post-workout recovery.',
    },
    {
      id: '2',
      name: 'Organic Multivitamin Complex',
      brand: 'NaturePlus',
      originalPrice: 49.99,
      discountPrice: 29.99,
      discountPercentage: 40,
      rating: 4.6,
      reviewCount: 856,
      imageUrl: 'https://images.pexels.com/photos/3683040/pexels-photo-3683040.jpeg?auto=compress&cs=tinysrgb&w=500',
      timeLeft: '1d 12h',
      soldCount: 623,
      description: 'Complete daily multivitamin with organic whole food ingredients and essential minerals.',
    },
    {
      id: '3',
      name: 'Creatine Monohydrate 1kg',
      brand: 'StrengthMax',
      originalPrice: 39.99,
      discountPrice: 24.99,
      discountPercentage: 38,
      rating: 4.9,
      reviewCount: 1892,
      imageUrl: 'https://images.pexels.com/photos/4099238/pexels-photo-4099238.jpeg?auto=compress&cs=tinysrgb&w=500',
      timeLeft: '3d 8h',
      soldCount: 2156,
      description: 'Pure creatine monohydrate powder for enhanced strength, power, and muscle growth.',
    },
    {
      id: '4',
      name: 'Omega-3 Fish Oil 180 Capsules',
      brand: 'OceanLife',
      originalPrice: 34.99,
      discountPrice: 19.99,
      discountPercentage: 43,
      rating: 4.7,
      reviewCount: 1234,
      imageUrl: 'https://images.pexels.com/photos/3683040/pexels-photo-3683040.jpeg?auto=compress&cs=tinysrgb&w=500',
      timeLeft: '4d 15h',
      soldCount: 892,
      description: 'High-quality fish oil with EPA and DHA for heart and brain health support.',
    },
    {
      id: '5',
      name: 'Pre-Workout Energy Boost',
      brand: 'PowerFuel',
      originalPrice: 44.99,
      discountPrice: 27.99,
      discountPercentage: 38,
      rating: 4.5,
      reviewCount: 967,
      imageUrl: 'https://images.pexels.com/photos/4099238/pexels-photo-4099238.jpeg?auto=compress&cs=tinysrgb&w=500',
      timeLeft: '2d 3h',
      soldCount: 743,
      description: 'Clean energy pre-workout with natural caffeine, beta-alanine, and performance enhancers.',
    },
    {
      id: '6',
      name: 'Collagen Peptides Powder',
      brand: 'VitalBeauty',
      originalPrice: 59.99,
      discountPrice: 35.99,
      discountPercentage: 40,
      rating: 4.8,
      reviewCount: 1456,
      imageUrl: 'https://images.pexels.com/photos/3683040/pexels-photo-3683040.jpeg?auto=compress&cs=tinysrgb&w=500',
      timeLeft: '5d 7h',
      soldCount: 1089,
      description: 'Hydrolyzed collagen peptides for skin, hair, nail, and joint health support.',
    },
  ];

  const categories = [
    'Protein & Fitness',
    'Vitamins & Minerals',
    'Health & Wellness',
    'Beauty & Anti-aging',
    'Sports Nutrition',
    'Herbal Supplements',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 mb-8 text-white">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold mb-4">
            Smart Health-Based
            <span className="text-blue-200"> Supplement Discounts</span>
          </h1>
          <p className="text-xl text-blue-100 mb-6">
            Upload your health records and get AI-powered supplement recommendations with personalized discounts based on your biomarkers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Start Shopping
            </button>
            <button className="bg-blue-500 border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Upload Health Records
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
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
      </div>

      {/* Categories */}
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
      </div>

      {/* Trending Section */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Trending Deals</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {supplements.map((supplement) => (
            <SupplementCard key={supplement.id} {...supplement} />
          ))}
        </div>
      </div>

      {/* Stats Section */}
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
      </div>
    </div>
  );
} 