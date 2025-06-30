/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Activity, AlertTriangle, ArrowRight, FileText, Gift, Upload as UploadIcon, Award, CheckCircle2 } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AirCredentialWidget, type ClaimRequest, type JsonDocumentObject, type Language } from "@mocanetwork/air-credential-sdk";
import "@mocanetwork/air-credential-sdk/dist/style.css";
import { AirService, BUILD_ENV } from "@mocanetwork/airkit";
import type { BUILD_ENV_TYPE } from "@mocanetwork/airkit";
import type { EnvironmentConfig } from "../config/environments";
import * as pdfjs from 'pdfjs-dist';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;

// Alternative: Use a specific version that matches
// pdfjs.GlobalWorkerOptions.workerSrc = '//unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js';

//interface Deficiency {
  //name: string;
  //level: 'Low' | 'Very Low' | 'Borderline';
  //value: string;
  //normalRange: string;
  //severity: 'mild' | 'moderate' | 'severe';
 //}

interface Deficiency {
  name: string;
  level: 'Low' | 'Very Low' | 'Borderline';
  value: string;
  normalRange: string;
  severity: 'mild' | 'moderate' | 'severe';
}

interface UploadProps {
  airService?: AirService | null;
  isLoggedIn?: boolean;
  airKitBuildEnv?: BUILD_ENV_TYPE;
  partnerId?: string;
  environmentConfig?: EnvironmentConfig;
}

// PDF parsing interfaces
interface ExtractedBiomarker {
  name: string;
  value: number;
  unit: string;
  normalRange: string;
  isDeficient: boolean;
  severity: 'mild' | 'moderate' | 'severe';
}

interface PDFParseResult {
  success: boolean;
  biomarkers: ExtractedBiomarker[];
  rawText: string;
  demographics?: Demographics; // Add this line
  error?: string;
}

// You'll also need to define the Demographics interface
interface Demographics {
  age: number | null;
  gender: string | null;
}

// Helper function to get issuer auth token
const getIssuerAuthToken = async (issuerDid: string, apiKey: string, apiUrl: string): Promise<string | null> => {
  try {
    const response = await fetch(`${apiUrl}/issuer/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "*/*",
        "X-Test": "true",
      },
      body: JSON.stringify({
        issuerDid: issuerDid,
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
      console.error("Failed to get issuer auth token from API:", data.msg || "Unknown error");
      return null;
    }
  } catch (error) {
    console.error("Error fetching issuer auth token:", error);
    return null;
  }
};

// Real PDF parsing function that actually works
const parsePDFForBiomarkers = async (file: File): Promise<PDFParseResult> => {
  try {
    console.log('Starting PDF parsing for:', file.name);
    console.log('PDF.js version:', pdfjs.version);
    
    // Convert file to array buffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Load the PDF document
    const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    console.log('PDF loaded successfully. Pages:', pdf.numPages);
    
    let fullText = '';
    
    // Extract text from all pages
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      console.log(`Processing page ${pageNum}/${pdf.numPages}`);
      
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      // Combine all text items from the page
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      
      fullText += pageText + '\n';
    }
    
    console.log('Extracted text length:', fullText.length);
    console.log('First 500 characters:', fullText.substring(0, 500));
    
    // Define comprehensive biomarker patterns
    const biomarkerPatterns = {
      // Vitamin D patterns
      vitaminD: {
        pattern: /(?:Vitamin\s*D|25-OH\s*Vitamin\s*D|25\(OH\)D|Calcidiol).*?(\d+\.?\d*)\s*(ng\/mL|nmol\/L)/i,
        normalRange: '30-100 ng/mL',
        normalMin: 30,
        normalMax: 100,
        displayName: 'Vitamin D'
      },
      
      // B12 patterns
      vitaminB12: {
        pattern: /(?:Vitamin\s*B12|Cobalamin|B-12).*?(\d+\.?\d*)\s*(pg\/mL|pmol\/L)/i,
        normalRange: '200-900 pg/mL',
        normalMin: 200,
        normalMax: 900,
        displayName: 'Vitamin B12'
      },
      
      // Iron/Ferritin patterns
      ferritin: {
        pattern: /(?:Ferritin|Iron\s*storing\s*protein).*?(\d+\.?\d*)\s*(ng\/mL|μg\/L|mcg\/L)/i,
        normalRange: '25-400 ng/mL',
        normalMin: 25,
        normalMax: 400,
        displayName: 'Iron (Ferritin)'
      },
      
      // Hemoglobin patterns
      hemoglobin: {
        pattern: /(?:Hemoglobin|Haemoglobin|Hgb|Hb).*?(\d+\.?\d*)\s*(g\/dL|g\/L)/i,
        normalRange: '12.0-16.0 g/dL',
        normalMin: 12.0,
        normalMax: 16.0,
        displayName: 'Hemoglobin'
      },
      
      // Folate patterns
      folate: {
        pattern: /(?:Folate|Folic\s*Acid|Acid\s*fòlic).*?(\d+\.?\d*)\s*(ng\/mL|μg\/L|nmol\/L)/i,
        normalRange: '2.9-16.9 ng/mL',
        normalMin: 2.9,
        normalMax: 16.9,
        displayName: 'Folic Acid'
      },
      
      // Magnesium patterns
      magnesium: {
        pattern: /(?:^|\s)(?:Magnesium|Mg)(?:\s+|\s*:|\s*\.)\s*(\d+\.?\d*)\s*(mg\/dL|mmol\/L|mEq\/L)(?!\d)/i,
        normalRange: '1.7-2.2 mg/dL',
        normalMin: 1.7,
        normalMax: 2.2,
        displayName: 'Magnesium'
      },
      
      // Zinc patterns
      zinc: {
        pattern: /(?:Zinc|Zn).*?(\d+\.?\d*)\s*(μg\/dL|mcg\/dL|μmol\/L)/i,
        normalRange: '70-120 μg/dL',
        normalMin: 70,
        normalMax: 120,
        displayName: 'Zinc'
      }
    };
    
    // Extract patient demographics
    const demographicPatterns = {
      // Age patterns (Catalan: "Edat: 41 anys")
      age: /(?:Edat|Age|Edad):\s*(\d+)\s*(?:anys|years|años)/i,
      // Gender patterns (Catalan: "Sexe: M")
      gender: /(?:Sexe|Sex|Sexo|Gender):\s*([MFmf])/i
    };
    
    // Extract demographics
    let patientAge: number | null = null;
    let patientGender: string | null = null;
    
    // Extract age
    const ageMatch = fullText.match(demographicPatterns.age);
    if (ageMatch) {
      patientAge = parseInt(ageMatch[1]);
      console.log('Found age:', patientAge);
    }
      
    // Extract gender
    const genderMatch = fullText.match(demographicPatterns.gender);
    if (genderMatch) {
      const genderCode = genderMatch[1].toLowerCase();
      patientGender = genderCode === 'm' ? 'Male' : 'Female';
      console.log('Found gender:', patientGender);
    }
    
    console.log('Extracted demographics:', { 
      age: patientAge, 
      gender: patientGender, 
    });
    
    const extractedBiomarkers: ExtractedBiomarker[] = [];
    
    // Extract each biomarker
    Object.entries(biomarkerPatterns).forEach(([key, config]) => {
      const match = fullText.match(config.pattern);
      if (match) {
        const value = parseFloat(match[1]);
        const unit = match[2] || '';
        
        console.log(`Found ${key}:`, { value, unit });
        
        // Determine if deficient and severity
        const isDeficient = value < config.normalMin || value > config.normalMax;
        let severity: 'mild' | 'moderate' | 'severe' = 'mild';
        
        if (isDeficient) {
          const percentageBelow = (config.normalMin - value) / config.normalMin;
          const percentageAbove = (value - config.normalMax) / config.normalMax;
          
          if (percentageBelow > 0.5 || percentageAbove > 0.5) {
            severity = 'severe';
          } else if (percentageBelow > 0.3 || percentageAbove > 0.3) {
            severity = 'moderate';
          }
        }
        
        extractedBiomarkers.push({
          name: config.displayName,
          value,
          unit,
          normalRange: config.normalRange,
          isDeficient,
          severity
        });
      }
    });
    
    console.log('Extracted biomarkers:', extractedBiomarkers);
    
    return {
      biomarkers: extractedBiomarkers,
      rawText: fullText,
      success: true,
      // Add demographics to the result
      demographics: {
        age: patientAge,
        gender: patientGender,
      }
    };
    
  } catch (error) {
    console.error('PDF parsing error:', error);
    
    return {
      biomarkers: [],
      rawText: '',
      success: false,
      error: `PDF parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

// Convert extracted biomarkers to deficiencies
const convertBiomarkersToDeficiencies = (biomarkers: ExtractedBiomarker[]): Deficiency[] => {
  return biomarkers
    .filter(marker => marker.isDeficient)
    .map(marker => {
      let level: 'Low' | 'Very Low' | 'Borderline' = 'Low';
      
      // Determine level based on severity
      switch (marker.severity) {
        case 'severe':
          level = 'Very Low';
          break;
        case 'moderate':
          level = 'Low';
          break;
        case 'mild':
          level = 'Borderline';
          break;
      }
      
      return {
        name: marker.name,
        level,
        value: `${marker.value} ${marker.unit}`,
        normalRange: marker.normalRange,
        severity: marker.severity
      };
    });
};

export default function Upload({
  airService = null,
  isLoggedIn = false,
  airKitBuildEnv = BUILD_ENV.SANDBOX,
  partnerId = "",
  environmentConfig = {
    apiUrl: "https://api-sandbox.airprotocol.com",
    widgetUrl: "https://widget-sandbox.airprotocol.com"
  }
}: UploadProps = {}) {
  const navigate = useNavigate();
  const [uploadStep, setUploadStep] = useState<'upload' | 'processing' | 'analyzing' | 'complete'>('upload');
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [detectedDeficiencies, setDetectedDeficiencies] = useState<Deficiency[]>([]);
  
  // Credential issuance states
  const [showCredentialSection, setShowCredentialSection] = useState(false);
  const [isIssuanceLoading, setIsIssuanceLoading] = useState(false);
  const [isIssuanceSuccess, setIsIssuanceSuccess] = useState(false);
  const [issuanceError, setIssuanceError] = useState<string | null>(null);
  const widgetRef = useRef<AirCredentialWidget | null>(null);
  
  console.log(showCredentialSection)
  // PDF parsing states
  const [pdfParseResult, setPdfParseResult] = useState<PDFParseResult | null>(null);
  const [isParsingPDF, setIsParsingPDF] = useState(false);
  const [pdfParseError, setPdfParseError] = useState<string | null>(null);
  
  // Configuration for credential issuance
  const [config] = useState({
    issuerDid: import.meta.env.VITE_ISSUER_DID || "did:example:issuer123",
    apiKey: import.meta.env.VITE_ISSUER_API_KEY || "your-issuer-api-key",
    credentialId: import.meta.env.VITE_CREDENTIAL_ID || "c21hc0g0joevn0015479aK",
  });

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

  const handleFileUpload = async (file: File) => {
    setUploadStep('processing');
    setIsParsingPDF(true);
    setPdfParseError(null);
    setPdfParseResult(null);
    
    try {
      console.log('File details:', {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: new Date(file.lastModified)
      });
      
      // Parse PDF to extract biomarkers
      const parseResult = await parsePDFForBiomarkers(file);
      console.log('PDF parse result:', parseResult);
      setPdfParseResult(parseResult);
      
      if (parseResult.success) {
        if (parseResult.biomarkers.length > 0) {
          // Convert to deficiencies format
          const detectedDeficiencies = convertBiomarkersToDeficiencies(parseResult.biomarkers);
          console.log('Detected deficiencies:', detectedDeficiencies);
          
          if (detectedDeficiencies.length > 0) {
            setDetectedDeficiencies(detectedDeficiencies);
          } else {
            // No deficiencies found, use mock data
            setDetectedDeficiencies(mockDeficiencies);
            console.log('No deficiencies detected from PDF, using mock data for demo');
          }
        } else {
          // No biomarkers found in PDF
          setDetectedDeficiencies(mockDeficiencies);
          setPdfParseError('No biomarkers found in PDF. The document may not contain lab results, or the format is not recognized.');
          console.log('No biomarkers found in PDF text');
        }
      } else {
        // PDF parsing failed
        setDetectedDeficiencies(mockDeficiencies);
        setPdfParseError(parseResult.error || 'Could not parse PDF');
        console.log('PDF parsing failed:', parseResult.error);
      }
      
      setUploadStep('analyzing');
      setIsParsingPDF(false);
      
      // Continue with analysis logic...
      setTimeout(() => {
        setUploadStep('complete');
      }, 2500);
      
    } catch (error) {
      console.error('PDF processing failed:', error);
      setPdfParseError(error instanceof Error ? error.message : 'Failed to process PDF');
      
      // Fall back to mock data
      setDetectedDeficiencies(mockDeficiencies);
      setUploadStep('complete');
      setIsParsingPDF(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'severe': return 'text-red-600 bg-red-50 border-red-200';
      case 'moderate': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'mild': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Convert deficiencies to credential subject using exact medical schema
  const convertDeficienciesToCredentialSubject = (): JsonDocumentObject => {
    // Extract demographic data from PDF if available
    const age = Math.floor(pdfParseResult?.demographics?.age || 55);
    const gender = pdfParseResult?.demographics?.gender === 'Male' ? 2 : 1; // 1 = Male, 2 = Female

    // Extract biomarker values from parsed data or use default values
    const getVitaminValue = (vitaminName: string, defaultValue: number): number => {
      const biomarker = pdfParseResult?.biomarkers?.find(b => 
        b.name.toLowerCase().includes(vitaminName.toLowerCase())
      );
      const value = biomarker?.value ?? defaultValue; // Use nullish coalescing to handle 0 values
      return Math.floor(value); // Convert to integer
    };

    const subject: JsonDocumentObject = {
      // Medical Schema credentialSubject fields (id handled by AIR system)
      "age-field": age, // number - required
      "gender-field": gender, // number - required
      "vitamin-B12-field": getVitaminValue('B12', 300), // number
      "ferritin-field": getVitaminValue('ferritin', 50), // number
      "hemoglobin-field": getVitaminValue('hemoglobin', 13), // number
      "vitamin-B9-field": getVitaminValue('folate', 8), // number (B9 is folate)
      "vitamin-D-field": getVitaminValue('vitamin D', 25), // number
      "date-creation-field": "2025-06-29" // string - test with specific date format
    };

    console.log("Subject:", subject);
    return subject;
  };

  const generateWidget = async () => {
    try {
      const fetchedIssuerAuthToken = await getIssuerAuthToken(config.issuerDid, config.apiKey, environmentConfig.apiUrl);

      if (!fetchedIssuerAuthToken) {
        setIssuanceError("Failed to fetch issuer authentication token. Please check your DID and API Key.");
        setIsIssuanceLoading(false);
        return;
      }

      const credentialSubject = convertDeficienciesToCredentialSubject();

      const claimRequest: ClaimRequest = {
        process: "Issue",
        issuerDid: config.issuerDid,
        issuerAuth: fetchedIssuerAuthToken,
        credentialId: config.credentialId,
        credentialSubject: credentialSubject,
      };

      console.log("Claim request:", claimRequest);

      const rp = await airService?.goToPartner(environmentConfig.widgetUrl).catch((err) => {
        console.error("Error getting URL with token:", err);
      });

      if (!rp?.urlWithToken) {
        console.warn("Failed to get URL with token. Please check your partner ID.");
        setIssuanceError("Failed to get URL with token. Please check your partner ID.");
        setIsIssuanceLoading(false);
        return;
      }

      widgetRef.current = new AirCredentialWidget(claimRequest, partnerId, {
        endpoint: rp?.urlWithToken,
        airKitBuildEnv: airKitBuildEnv || BUILD_ENV.STAGING,
        theme: "light",
        locale: "en" as Language,
      });

      widgetRef.current.on("issueCompleted", () => {
        setIsIssuanceSuccess(true);
        setIsIssuanceLoading(false);
        console.log("Health credential issuance completed successfully!");
      });

      widgetRef.current.on("close", () => {
        setIsIssuanceLoading(false);
        console.log("Widget closed");
      });
    } catch (err) {
      setIssuanceError(err instanceof Error ? err.message : "Failed to create widget");
      setIsIssuanceLoading(false);
    }
  };

  const handleIssueHealthCredential = async () => {
    setIsIssuanceLoading(true);
    setIssuanceError(null);
    setIsIssuanceSuccess(false);

    try {
      await generateWidget();
      if (widgetRef.current) {
        widgetRef.current.launch();
      }
    } catch (err) {
      setIssuanceError(err instanceof Error ? err.message : "An error occurred");
      setIsIssuanceLoading(false);
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Upload Health Records & Get Smart Discounts
        </h1>
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
                  <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
                    <label
                      htmlFor="file-upload"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 cursor-pointer inline-block transition-colors"
                    >
                      Choose File
                    </label>
                    <span className="text-gray-500 text-sm">or</span>
                    <button
                      onClick={() => {
                        // Create a mock file for testing
                        const mockFile = new File(['mock health data'], 'health-report.pdf', {
                          type: 'application/pdf'
                        });
                        setUploadedFile(mockFile);
                        handleFileUpload(mockFile);
                      }}
                      className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      Try Demo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {uploadStep === 'processing' && (
            <div className="bg-white rounded-2xl p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {isParsingPDF ? 'Reading PDF and Extracting Data' : 'Processing Your Lab Results'}
              </h3>
              <p className="text-gray-600">
                {isParsingPDF ? 'Analyzing PDF content for biomarker values...' : 'Extracting biomarker data from your health records...'}
              </p>
              {uploadedFile && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg flex items-center justify-center space-x-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <span className="text-sm text-gray-700">{uploadedFile.name}</span>
                </div>
              )}
              
              {/* Show PDF parsing error if any */}
              {pdfParseError && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-sm">
                    PDF parsing warning: {pdfParseError}. Using sample data for demonstration.
                  </p>
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
              {/* PDF Analysis Results */}
              {pdfParseResult && pdfParseResult.success && pdfParseResult.biomarkers.length > 0 && (
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <div className="flex items-center space-x-2 mb-4">
                    <FileText className="h-6 w-6 text-blue-500" />
                    <h3 className="text-lg font-semibold text-gray-900">PDF Analysis Results</h3>
                  </div>
                  
                  {/* Demographics Section */}
                  {pdfParseResult.demographics && (pdfParseResult.demographics.age || pdfParseResult.demographics.gender) && (
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="text-md font-semibold text-blue-900 mb-3">Patient Demographics</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {pdfParseResult.demographics.age && (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-blue-700">Age:</span>
                            <span className="text-sm text-blue-900">{pdfParseResult.demographics.age} years</span>
                          </div>
                        )}
                        {pdfParseResult.demographics.gender && (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-blue-700">Gender:</span>
                            <span className="text-sm text-blue-900">{pdfParseResult.demographics.gender}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pdfParseResult.biomarkers.map((biomarker, index) => (
                      <div key={index} className={`p-3 rounded-lg border ${biomarker.isDeficient ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium text-gray-900">{biomarker.name}</div>
                            <div className="text-sm text-gray-600">
                              Value: {biomarker.value} {biomarker.unit}
                            </div>
                            <div className="text-sm text-gray-500">
                              Normal: {biomarker.normalRange}
                            </div>
                          </div>
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                            biomarker.isDeficient ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {biomarker.isDeficient ? 'Deficient' : 'Normal'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Show raw extracted values for debugging */}
                  <details className="mt-4">
                    <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                      Show extracted PDF text (for debugging)
                    </summary>
                    <div className="mt-2 p-3 bg-gray-50 rounded text-xs font-mono text-gray-700 max-h-32 overflow-y-auto">
                      {pdfParseResult.rawText.substring(0, 500)}...
                    </div>
                  </details>
                </div>
              )}

              {/* Health Analysis Results */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center space-x-2 mb-4">
                  <AlertTriangle className="h-6 w-6 text-orange-500" />
                  <h3 className="text-lg font-semibold text-gray-900">Detected Deficiencies</h3>
                </div>
                <div className="space-y-3">
                  {/* Use PDF biomarkers if available, otherwise fall back to detectedDeficiencies */}
                  {(pdfParseResult && pdfParseResult.success && pdfParseResult.biomarkers.length > 0 
                    ? pdfParseResult.biomarkers.filter(biomarker => biomarker.isDeficient)
                    : detectedDeficiencies
                  ).map((item, index) => {
                    // Handle both ExtractedBiomarker and Deficiency types
                    const isExtractedBiomarker = 'unit' in item;
                    const name = isExtractedBiomarker ? item.name : item.name;
                    const value = isExtractedBiomarker ? `${item.value} ${item.unit}` : item.value;
                    const normalRange = isExtractedBiomarker ? item.normalRange : item.normalRange;
                    const severity = isExtractedBiomarker ? item.severity : item.severity;
                    const level = isExtractedBiomarker 
                      ? (item.severity === 'severe' ? 'Very Low' : item.severity === 'moderate' ? 'Low' : 'Borderline')
                      : item.level;

                    return (
                      <div key={index} className={`p-3 rounded-lg border ${getSeverityColor(severity)}`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{name}</div>
                            <div className="text-sm opacity-75">
                              Current: {value} | Normal: {normalRange}
                            </div>
                          </div>
                          <span className="text-xs font-medium px-2 py-1 rounded-full bg-white bg-opacity-50">
                            {level}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Health Credential Issuance Section */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center space-x-2 mb-4">
                  <Award className="h-6 w-6 text-purple-500" />
                  <h3 className="text-lg font-semibold text-gray-900">Get Your Health Credential</h3>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                  <p className="text-purple-800 text-sm mb-3">
                    Create a verifiable digital credential of your health analysis. This credential can be used to prove your 
                    health status to partners, insurance providers, or health apps while maintaining your privacy.
                  </p>
                </div>

                {/* Credential Subject Preview */}
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Medical Schema Preview</h4>
                  <p className="text-sm text-gray-600 mb-4">Your health credential will include the following 8 medical data fields (ID handled automatically by AIR system):</p>
                  
                  <div className="space-y-4">
                    {/* Age Field */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white rounded-lg p-3 border">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Field Name</label>
                        <input
                          type="text"
                          value="age-field"
                          readOnly
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-gray-50"
                        />
                      </div>
                      <div className="bg-white rounded-lg p-3 border">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                        <select disabled className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-gray-50">
                          <option>Number</option>
                        </select>
                      </div>
                      <div className="bg-white rounded-lg p-3 border">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Value</label>
                        <input
                          type="text"
                          value={Math.floor(pdfParseResult?.demographics?.age || 55).toString()}
                          readOnly
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-gray-50"
                        />
                      </div>
                    </div>

                    {/* Gender Field */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white rounded-lg p-3 border">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Field Name</label>
                        <input
                          type="text"
                          value="gender-field"
                          readOnly
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-gray-50"
                        />
                      </div>
                      <div className="bg-white rounded-lg p-3 border">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                        <select disabled className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-gray-50">
                          <option>Number</option>
                        </select>
                      </div>
                      <div className="bg-white rounded-lg p-3 border">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Value</label>
                        <input
                          type="text"
                          value={pdfParseResult?.demographics?.gender === 'Male' ? "2" : "1"}
                          readOnly
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-gray-50"
                        />
                      </div>
                    </div>

                    {/* Date Creation Field */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white rounded-lg p-3 border">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Field Name</label>
                        <input
                          type="text"
                          value="date-creation-field"
                          readOnly
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-gray-50"
                        />
                      </div>
                      <div className="bg-white rounded-lg p-3 border">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                        <select disabled className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-gray-50">
                          <option>String</option>
                        </select>
                      </div>
                      <div className="bg-white rounded-lg p-3 border">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Value</label>
                        <input
                          type="text"
                          value="2025-06-29"
                          readOnly
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-gray-50"
                        />
                      </div>
                    </div>

                    {/* Vitamin B12 Field */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white rounded-lg p-3 border">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Field Name</label>
                        <input
                          type="text"
                          value="vitamin-B12-field"
                          readOnly
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-gray-50"
                        />
                      </div>
                      <div className="bg-white rounded-lg p-3 border">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                        <select disabled className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-gray-50">
                          <option>Number</option>
                        </select>
                      </div>
                      <div className="bg-white rounded-lg p-3 border">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Value</label>
                        <input
                          type="text"
                          value={Math.floor(pdfParseResult?.biomarkers?.find(b => b.name.toLowerCase().includes('b12'))?.value || 300).toString()}
                          readOnly
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-gray-50"
                        />
                      </div>
                    </div>

                    {/* Ferritin Field */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white rounded-lg p-3 border">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Field Name</label>
                        <input
                          type="text"
                          value="ferritin-field"
                          readOnly
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-gray-50"
                        />
                      </div>
                      <div className="bg-white rounded-lg p-3 border">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                        <select disabled className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-gray-50">
                          <option>Number</option>
                        </select>
                      </div>
                      <div className="bg-white rounded-lg p-3 border">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Value</label>
                        <input
                          type="text"
                          value={Math.floor(pdfParseResult?.biomarkers?.find(b => b.name.toLowerCase().includes('ferritin'))?.value || 50).toString()}
                          readOnly
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-gray-50"
                        />
                      </div>
                    </div>

                    {/* Hemoglobin Field */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white rounded-lg p-3 border">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Field Name</label>
                        <input
                          type="text"
                          value="hemoglobin-field"
                          readOnly
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-gray-50"
                        />
                      </div>
                      <div className="bg-white rounded-lg p-3 border">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                        <select disabled className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-gray-50">
                          <option>Number</option>
                        </select>
                      </div>
                      <div className="bg-white rounded-lg p-3 border">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Value</label>
                        <input
                          type="text"
                          value={Math.floor(pdfParseResult?.biomarkers?.find(b => b.name.toLowerCase().includes('hemoglobin'))?.value || 13).toString()}
                          readOnly
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-gray-50"
                        />
                      </div>
                    </div>

                    {/* Vitamin B9 Field */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white rounded-lg p-3 border">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Field Name</label>
                        <input
                          type="text"
                          value="vitamin-B9-field"
                          readOnly
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-gray-50"
                        />
                      </div>
                      <div className="bg-white rounded-lg p-3 border">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                        <select disabled className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-gray-50">
                          <option>Number</option>
                        </select>
                      </div>
                      <div className="bg-white rounded-lg p-3 border">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Value</label>
                        <input
                          type="text"
                          value={Math.floor(pdfParseResult?.biomarkers?.find(b => b.name.toLowerCase().includes('folate'))?.value || 8).toString()}
                          readOnly
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-gray-50"
                        />
                      </div>
                    </div>

                    {/* Vitamin D Field */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white rounded-lg p-3 border">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Field Name</label>
                        <input
                          type="text"
                          value="vitamin-D-field"
                          readOnly
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-gray-50"
                        />
                      </div>
                      <div className="bg-white rounded-lg p-3 border">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                        <select disabled className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-gray-50">
                          <option>Number</option>
                        </select>
                      </div>
                      <div className="bg-white rounded-lg p-3 border">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Value</label>
                        <input
                          type="text"
                          value={Math.floor(pdfParseResult?.biomarkers?.find(b => b.name.toLowerCase().includes('vitamin d'))?.value || 25).toString()}
                          readOnly
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-gray-50"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Credential Status Messages */}
                {issuanceError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-800 text-sm">{issuanceError}</p>
                  </div>
                )}

                {isIssuanceSuccess && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-green-800 text-sm">✅ Health credential issued successfully!</p>
                  </div>
                )}

                {/* Credential Issuance Button */}
                <button
                  onClick={handleIssueHealthCredential}
                  disabled={isIssuanceLoading || !isLoggedIn}
                  className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  {isIssuanceLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Issuing Credential...</span>
                    </>
                  ) : (
                    <>
                      <Award className="h-4 w-4" />
                      <span>Issue Health Credential</span>
                    </>
                  )}
                </button>

                {!isLoggedIn && (
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    Please log in using the wallet connection to issue credentials
                  </p>
                )}
              </div>

              {/* Analysis Complete - Redirect to Discounts */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 border-2 border-green-200">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <CheckCircle2 className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Analysis Complete!
                  </h3>
                  <p className="text-gray-600 mb-6">
                    We've found {detectedDeficiencies.length} nutritional deficiencies and matched you with personalized supplement discounts.
                  </p>
                  
                  {/* Summary of deficiencies */}
                  <div className="bg-white rounded-lg p-4 mb-6 border border-green-200">
                    <h4 className="font-semibold text-gray-900 mb-3">Deficiencies Found:</h4>
                    <div className="flex flex-wrap justify-center gap-2">
                      {detectedDeficiencies.slice(0, 4).map((deficiency, index) => (
                        <span 
                          key={index} 
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(deficiency.severity)}`}
                        >
                          {deficiency.name}
                        </span>
                      ))}
                      {detectedDeficiencies.length > 4 && (
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
                          +{detectedDeficiencies.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => navigate('/discounts')}
                    className="bg-green-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-green-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-3 mx-auto"
                  >
                    <Gift className="h-6 w-6" />
                    <span>View My Personalized Discounts</span>
                    <ArrowRight className="h-6 w-6" />
                  </button>
                  
                  <p className="text-sm text-gray-500 mt-4">
                    Get up to 40% OFF on supplements tailored to your health needs
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => {
                    setUploadStep('upload');
                    setUploadedFile(null);
                    setDetectedDeficiencies([]);
                    setShowCredentialSection(false);
                    setIsIssuanceSuccess(false);
                    setIssuanceError(null);
                    setPdfParseResult(null);
                    setPdfParseError(null);
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

          
        </div>
      </div>
    </div>
  );
}