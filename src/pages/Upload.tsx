import React, { useState } from 'react';
import { Upload as UploadIcon, FileText, CheckCircle, Gift, ArrowRight, AlertTriangle, TrendingDown, Activity } from 'lucide-react';

interface Deficiency {
  name: string;
  level: 'Low' | 'Very Low' | 'Borderline';
  value: string;
  normalRange: string;
  severity: 'mild' | 'moderate' | 'severe';
}

interface Discount {
  id: string;
  title: string;
  brand: string;
  discount: number;
  originalPrice: number;
  discountPrice: number;
  reason: string;
  category: string;
  rating: number;
  image: string;
  deficiencyMatch: string;
}

export default function Upload() {
  const [uploadStep, setUploadStep] = useState<'upload' | 'processing' | 'analyzing' | 'complete'>('upload');
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [detectedDeficiencies, setDetectedDeficiencies] = useState<Deficiency[]>([]);
  const [personalizedDiscounts, setPersonalizedDiscounts] = useState<Discount[]>([]);

  const mockDeficiencies: Deficiency[] = [
    {
      name: 'Vitamin D',
      level: 'Very Low',
      value: '18 ng/mL',
      normalRange: '30-100 ng/mL',
      severity: 'severe'
    },
    {
      name: 'Vitamin B12',
      level: 'Low',
      value: '180 pg/mL',
      normalRange: '200-900 pg/mL',
      severity: 'mild'
    },
    {
      name: 'Iron',
      level: 'Borderline',
      value: '45 μg/dL',
      normalRange: '50-170 μg/dL',
      severity: 'mild'
    },
    {
      name: 'Magnesium',
      level: 'Low',
      value: '1.5 mg/dL',
      normalRange: '1.7-2.2 mg/dL',
      severity: 'moderate'
    }
  ];

  const mockDiscounts: Discount[] = [
    {
      id: '1',
      title: 'Vitamin D3 5000 IU High Potency',
      brand: 'SunVitamin Pro',
      discount: 35,
      originalPrice: 29.99,
      discountPrice: 19.49,
      reason: 'Severe Vitamin D deficiency detected',
      category: 'Vitamins',
      rating: 4.9,
      image: 'https://images.pexels.com/photos/3683040/pexels-photo-3683040.jpeg?auto=compress&cs=tinysrgb&w=300',
      deficiencyMatch: 'Vitamin D'
    },
    {
      id: '2',
      title: 'Methylcobalamin B12 1000mcg',
      brand: 'NeuroPlex',
      discount: 25,
      originalPrice: 24.99,
      discountPrice: 18.74,
      reason: 'Low B12 levels require supplementation',
      category: 'B-Vitamins',
      rating: 4.8,
      image: 'https://images.pexels.com/photos/3683040/pexels-photo-3683040.jpeg?auto=compress&cs=tinysrgb&w=300',
      deficiencyMatch: 'Vitamin B12'
    },
    {
      id: '3',
      title: 'Chelated Iron Complex 28mg',
      brand: 'IronMax',
      discount: 20,
      originalPrice: 19.99,
      discountPrice: 15.99,
      reason: 'Borderline iron levels detected',
      category: 'Minerals',
      rating: 4.6,
      image: 'https://images.pexels.com/photos/3683040/pexels-photo-3683040.jpeg?auto=compress&cs=tinysrgb&w=300',
      deficiencyMatch: 'Iron'
    },
    {
      id: '4',
      title: 'Magnesium Glycinate 400mg',
      brand: 'MineralMax',
      discount: 30,
      originalPrice: 34.99,
      discountPrice: 24.49,
      reason: 'Low magnesium affects sleep and muscle function',
      category: 'Sleep Support',
      rating: 4.7,
      image: 'https://images.pexels.com/photos/3683040/pexels-photo-3683040.jpeg?auto=compress&cs=tinysrgb&w=300',
      deficiencyMatch: 'Magnesium'
    }
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        setUploadedFile(file);
        handleFileUpload(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      handleFileUpload(file);
    }
  };

  const handleFileUpload = (file: File) => {
    setUploadStep('processing');
    
    // Simulate processing time
    setTimeout(() => {
      setUploadStep('analyzing');
      
      // Simulate analysis time
      setTimeout(() => {
        setDetectedDeficiencies(mockDeficiencies);
        setPersonalizedDiscounts(mockDiscounts);
        setUploadStep('complete');
      }, 2500);
    }, 2000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'severe': return 'text-red-600 bg-red-50 border-red-200';
      case 'moderate': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'mild': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const benefits = [
    {
      title: 'AI Health Analysis',
      description: 'Advanced biomarker analysis identifies nutritional gaps',
      icon: Activity,
    },
    {
      title: 'Personalized Discounts',
      description: 'Get targeted deals based on your specific deficiencies',
      icon: Gift,
    },
    {
      title: 'Evidence-Based Matching',
      description: 'Supplements matched to your lab results and health needs',
      icon: FileText,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Upload Health Records & Get Smart Discounts
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Our AI analyzes your biomarkers to identify nutritional deficiencies and matches you with targeted supplement discounts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Upload Section */}
        <div className="space-y-6">
          {uploadStep === 'upload' && (
            <div className="bg-white rounded-2xl p-8 border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
              <div
                className={`relative ${dragActive ? 'bg-blue-50' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="text-center">
                  <UploadIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Upload Your Lab Results
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Upload blood work, vitamin panels, or comprehensive metabolic panels
                  </p>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 cursor-pointer inline-block transition-colors"
                  >
                    Choose File
                  </label>
                </div>
              </div>
            </div>
          )}

          {uploadStep === 'processing' && (
            <div className="bg-white rounded-2xl p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Processing Your Lab Results
              </h3>
              <p className="text-gray-600">
                Extracting biomarker data from your health records...
              </p>
              {uploadedFile && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg flex items-center justify-center space-x-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <span className="text-sm text-gray-700">{uploadedFile.name}</span>
                </div>
              )}
            </div>
          )}

          {uploadStep === 'analyzing' && (
            <div className="bg-white rounded-2xl p-8 text-center">
              <Activity className="mx-auto h-12 w-12 text-blue-600 mb-4 animate-pulse" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Analyzing Your Biomarkers
              </h3>
              <p className="text-gray-600">
                AI is identifying nutritional deficiencies and matching supplements...
              </p>
              <div className="mt-4 space-y-2">
                <div className="text-sm text-blue-600">✓ Vitamin levels analyzed</div>
                <div className="text-sm text-blue-600">✓ Mineral deficiencies detected</div>
                <div className="text-sm text-blue-600">✓ Matching personalized discounts...</div>
              </div>
            </div>
          )}

          {uploadStep === 'complete' && (
            <div className="space-y-6">
              {/* Health Analysis Results */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center space-x-2 mb-4">
                  <AlertTriangle className="h-6 w-6 text-orange-500" />
                  <h3 className="text-lg font-semibold text-gray-900">Detected Deficiencies</h3>
                </div>
                <div className="space-y-3">
                  {detectedDeficiencies.map((deficiency, index) => (
                    <div key={index} className={`p-3 rounded-lg border ${getSeverityColor(deficiency.severity)}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{deficiency.name}</div>
                          <div className="text-sm opacity-75">
                            Current: {deficiency.value} | Normal: {deficiency.normalRange}
                          </div>
                        </div>
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-white bg-opacity-50">
                          {deficiency.level}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Personalized Discounts */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center space-x-2 mb-4">
                  <Gift className="h-6 w-6 text-green-500" />
                  <h3 className="text-lg font-semibold text-gray-900">Your Personalized Discounts</h3>
                </div>
                <div className="space-y-4">
                  {personalizedDiscounts.map((discount) => (
                    <div key={discount.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-4">
                        <img
                          src={discount.image}
                          alt={discount.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                              -{discount.discount}% OFF
                            </span>
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                              {discount.category}
                            </span>
                          </div>
                          <h4 className="font-semibold text-gray-900 mb-1">{discount.title}</h4>
                          <p className="text-sm text-gray-600 mb-1">{discount.brand}</p>
                          <p className="text-sm text-blue-600 mb-2">
                            <TrendingDown className="h-3 w-3 inline mr-1" />
                            {discount.reason}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg font-bold text-blue-600">${discount.discountPrice}</span>
                              <span className="text-sm text-gray-400 line-through">${discount.originalPrice}</span>
                            </div>
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                              Claim Deal
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                  <span>View All My Discounts</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    setUploadStep('upload');
                    setUploadedFile(null);
                    setDetectedDeficiencies([]);
                    setPersonalizedDiscounts([]);
                  }}
                  className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Upload Another File
                </button>
              </div>
            </div>
          )}

          {/* Privacy Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Privacy & Security</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Your health data is encrypted and stored securely</li>
              <li>• AI analysis happens locally, data never leaves our servers</li>
              <li>• You can delete your data at any time</li>
              <li>• HIPAA compliant data handling</li>
            </ul>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            How BioRebate Works
          </h2>
          
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <benefit.icon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Example Analysis */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Example Analysis Results</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Vitamin D Deficiency</span>
                <span className="font-semibold text-red-600">35% OFF</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Low B12 Levels</span>
                <span className="font-semibold text-orange-600">25% OFF</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Iron Deficiency</span>
                <span className="font-semibold text-yellow-600">20% OFF</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 