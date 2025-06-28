import React, { useState } from 'react';
import { Gift, Clock, Star, CheckCircle, Filter, Search } from 'lucide-react';

export default function Discounts() {
  const [activeTab, setActiveTab] = useState<'available' | 'used' | 'expired'>('available');

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
        image: 'https://images.pexels.com/photos/3683040/pexels-photo-3683040.jpeg?auto=compress&cs=tinysrgb&w=300',
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
        image: 'https://images.pexels.com/photos/3683040/pexels-photo-3683040.jpeg?auto=compress&cs=tinysrgb&w=300',
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
        image: 'https://images.pexels.com/photos/3683040/pexels-photo-3683040.jpeg?auto=compress&cs=tinysrgb&w=300',
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
        image: 'https://images.pexels.com/photos/3683040/pexels-photo-3683040.jpeg?auto=compress&cs=tinysrgb&w=300',
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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Discounts</h1>
        <p className="text-gray-600">Personalized supplement deals based on your health profile</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {[
            { key: 'available', label: 'Available', count: discounts.available.length },
            { key: 'used', label: 'Used', count: discounts.used.length },
            { key: 'expired', label: 'Expired', count: discounts.expired.length },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span>{tab.label}</span>
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Discount Cards */}
      <div className="space-y-4">
        {activeTab === 'available' && (
          <>
            {discounts.available.map((discount) => (
              <div key={discount.id} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-start space-x-4 mb-4 lg:mb-0">
                    <img
                      src={discount.image}
                      alt={discount.title}
                      className="w-16 h-16 rounded-lg object-cover"
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
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                      Claim Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {activeTab === 'used' && (
          <>
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
          </>
        )}

        {activeTab === 'expired' && (
          <>
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
          </>
        )}
      </div>

      {/* Empty State */}
      {((activeTab === 'available' && discounts.available.length === 0) ||
        (activeTab === 'used' && discounts.used.length === 0) ||
        (activeTab === 'expired' && discounts.expired.length === 0)) && (
        <div className="text-center py-12">
          <Gift className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No {activeTab} discounts
          </h3>
          <p className="text-gray-600 mb-6">
            {activeTab === 'available'
              ? 'Upload health records to unlock personalized discounts'
              : `You don't have any ${activeTab} discounts yet`}
          </p>
          {activeTab === 'available' && (
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Upload Health Records
            </button>
          )}
        </div>
      )}
    </div>
  );
} 