import React from 'react';
import { Star, Clock, Users } from 'lucide-react';

interface SupplementCardProps {
  id: string;
  name: string;
  brand: string;
  originalPrice: number;
  discountPrice: number;
  discountPercentage: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  timeLeft: string;
  soldCount: number;
}

export default function SupplementCard({
  name,
  brand,
  originalPrice,
  discountPrice,
  discountPercentage,
  rating,
  reviewCount,
  imageUrl,
  timeLeft,
  soldCount,
}: SupplementCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow border border-gray-100 overflow-hidden group">
      <div className="relative">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-bold">
          -{discountPercentage}%
        </div>
        <div className="absolute top-3 right-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded-lg text-xs flex items-center space-x-1">
          <Clock className="h-3 w-3" />
          <span>{timeLeft}</span>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-3">
          <h3 className="font-semibold text-gray-900 text-lg line-clamp-2">{name}</h3>
          <p className="text-sm text-gray-600">{brand}</p>
        </div>

        <div className="flex items-center space-x-2 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">({reviewCount})</span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-blue-600">${discountPrice}</span>
            <span className="text-lg text-gray-400 line-through">${originalPrice}</span>
          </div>
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <Users className="h-4 w-4" />
            <span>{soldCount} sold</span>
          </div>
        </div>

        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
          Claim Deal
        </button>
      </div>
    </div>
  );
} 