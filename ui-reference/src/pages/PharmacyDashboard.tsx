import React, { useState } from 'react';
import { Plus, Target, TrendingUp, Users, DollarSign, Edit3, Trash2, Calendar } from 'lucide-react';

export default function PharmacyDashboard() {
  const [showAddTarget, setShowAddTarget] = useState(false);
  const [targets, setTargets] = useState([
    {
      id: '1',
      condition: 'Vitamin D Deficiency',
      product: 'Vitamin D3 5000 IU',
      discount: 25,
      targetUsers: 500,
      currentUsers: 234,
      revenue: 5420,
      expiryDate: '2024-03-15',
      status: 'active',
    },
    {
      id: '2',
      condition: 'High Cholesterol',
      product: 'Omega-3 Fish Oil',
      discount: 30,
      targetUsers: 300,
      currentUsers: 187,
      revenue: 3240,
      expiryDate: '2024-02-28',
      status: 'active',
    },
    {
      id: '3',
      condition: 'Sleep Disorders',
      product: 'Magnesium Glycinate',
      discount: 40,
      targetUsers: 200,
      currentUsers: 89,
      revenue: 1890,
      expiryDate: '2024-04-10',
      status: 'active',
    },
  ]);

  const [newTarget, setNewTarget] = useState({
    condition: '',
    product: '',
    discount: 0,
    targetUsers: 0,
    expiryDate: '',
  });

  const handleAddTarget = () => {
    if (newTarget.condition && newTarget.product && newTarget.discount && newTarget.targetUsers) {
      const target = {
        id: Date.now().toString(),
        ...newTarget,
        currentUsers: 0,
        revenue: 0,
        status: 'active' as const,
      };
      setTargets([...targets, target]);
      setNewTarget({ condition: '', product: '', discount: 0, targetUsers: 0, expiryDate: '' });
      setShowAddTarget(false);
    }
  };

  const handleDeleteTarget = (id: string) => {
    setTargets(targets.filter(target => target.id !== id));
  };

  const totalRevenue = targets.reduce((sum, target) => sum + target.revenue, 0);
  const totalUsers = targets.reduce((sum, target) => sum + target.currentUsers, 0);
  const avgConversion = targets.length > 0 
    ? (targets.reduce((sum, target) => sum + (target.currentUsers / target.targetUsers), 0) / targets.length * 100).toFixed(1)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pharmacy Partner Dashboard</h1>
          <p className="text-gray-600">Manage your targeted discount campaigns and track performance</p>
        </div>
        <button
          onClick={() => setShowAddTarget(true)}
          className="mt-4 md:mt-0 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Create New Target</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">${totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-400" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active Targets</p>
              <p className="text-2xl font-bold text-blue-600">{targets.length}</p>
            </div>
            <Target className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Users Reached</p>
              <p className="text-2xl font-bold text-purple-600">{totalUsers}</p>
            </div>
            <Users className="h-8 w-8 text-purple-400" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Avg. Conversion</p>
              <p className="text-2xl font-bold text-orange-600">{avgConversion}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-400" />
          </div>
        </div>
      </div>

      {/* Targets Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Active Campaigns</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Target Condition
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Discount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expires
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {targets.map((target) => {
                const progress = (target.currentUsers / target.targetUsers) * 100;
                return (
                  <tr key={target.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{target.condition}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{target.product}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        -{target.discount}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span>{target.currentUsers}/{target.targetUsers}</span>
                            <span>{progress.toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${Math.min(progress, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">${target.revenue}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-1" />
                        {target.expiryDate}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTarget(target.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Target Modal */}
      {showAddTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Target Campaign</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Condition
                </label>
                <input
                  type="text"
                  value={newTarget.condition}
                  onChange={(e) => setNewTarget({ ...newTarget, condition: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Diabetes, High Blood Pressure"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  value={newTarget.product}
                  onChange={(e) => setNewTarget({ ...newTarget, product: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Omega-3 Fish Oil"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Percentage
                </label>
                <input
                  type="number"
                  value={newTarget.discount}
                  onChange={(e) => setNewTarget({ ...newTarget, discount: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="25"
                  min="1"
                  max="100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Users
                </label>
                <input
                  type="number"
                  value={newTarget.targetUsers}
                  onChange={(e) => setNewTarget({ ...newTarget, targetUsers: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="500"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={newTarget.expiryDate}
                  onChange={(e) => setNewTarget({ ...newTarget, expiryDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleAddTarget}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Create Target
              </button>
              <button
                onClick={() => setShowAddTarget(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}