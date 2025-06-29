# Overview

BioRebate is a platform that helps users find the best supplement discounts customized to their unique health needs. 

Users can upload their health records to receive personalized supplement recommendations, then how the platform delivers savings with exclusive deals.

Personalized: BioRebate analyzes their biomarkers to suggest supplements that truly fit their wellness goals.

savings: The platform searches across top brands to bring users exclusive discounts, ensuring they get what their bodies need—at the best price.

The MOCA AIR 3 Kit ensures every recommendation and deal is based on real, verified health data, while giving users full control and privacy over their information.

# Check

b6 iron b12

# AIR Credential Demo

A comprehensive React application demonstrating credential issuance and verification flows using the AIR Credential SDK.

## Features

- **Credential Issuance**: Complete flow for issuing digital credentials to users
- **Credential Verification**: Full verification process with detailed status

## Prerequisites

- Node.js 20+
- npm or yarn
- AIR Credential SDK access

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd air-credential-example
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### Credential Issuance

1. Navigate to the "Credential Issuance" tab
2. Configure the following parameters:
   - **Issuer DID**: Your issuer's decentralized identifier
   - **Issuer Auth Token**: Authentication token for the issuer
   - **Credential ID**: The type of credential to issue
   - **Project Name**: Name of your project
3. Manage credential subject fields:
   - Click "Add Field" to add new credential fields
   - For each field, specify:
     - Field Name (e.g., name, email, age)
     - Type (String, Number, Boolean, or Date)
     - Value
   - Use the delete button to remove unwanted fields
4. Click "Start Credential Issuance"
5. The AIR Credential widget will open and guide the user through the issuance process
6. You'll receive a success notification when the process completes

### Credential Verification

1. Navigate to the "Credential Verification" tab
2. Configure the following parameters:
   - **Verifier Auth Token**: Authentication token for the verifier
   - **Program ID**: The program ID for verification
   - **Project Name**: Name of your project
   - **Redirect URL for Issuer**: URL to redirect users who need to obtain credentials
3. Click "Start Credential Verification"
4. The widget will guide the user through the verification process
5. View the detailed verification result with status information

## Verification Statuses

The application supports the following verification statuses:

- **✅ Compliant**: Credential is valid and meets all requirements
- **❌ Non-Compliant**: Credential does not meet verification requirements
- **⏳ Pending**: Credential is waiting for blockchain confirmation
- **🔄 Revoking**: Credential is currently being revoked
- **🚫 Revoked**: Credential has been revoked and is no longer valid
- **⏰ Expired**: Credential has expired and is no longer valid
- **🔍 NotFound**: No credential was found matching the criteria

## Configuration

### Environment Variables

For production use, consider setting up environment variables for sensitive configuration:

```bash
# .env.local

# Issuance Configuration
VITE_ISSUER_DID=your-issuer-did
VITE_ISSUER_API_KEY=your-issuer-api-key
VITE_CREDENTIAL_ID=your-credential-id
VITE_ISSUER_PARTNER_ID=issuer-partner-id

# Verification Configuration
VITE_VERIFIER_DID=your-verifier-did
VITE_VERIFIER_API_KEY=your-verifier-api-key
VITE_PROGRAM_ID=your-program-id
VITE_VERIFIER_PARTNER_ID=verifier-partner-id

# General Configuration
VITE_LOCALE=en
VITE_REDIRECT_URL_FOR_ISSUER=http://localhost:5173/issue
```

### Environment-Based Configuration

The application uses environment-based configuration for Widget and API URLs:

- **Staging Environment**: Uses staging URLs for widget and API endpoints
- **Sandbox Environment**: Uses sandbox URLs for widget and API endpoints

The URLs are configured in `src/config/environments.ts` and automatically switch based on the environment selected in the NavBar dropdown.

### Partner ID Management

The application automatically switches Partner IDs based on the current route:

- **Issuance Route** (`/issue`): Uses `VITE_ISSUER_PARTNER_ID` as default
- **Verification Route** (`/verify`): Uses `VITE_VERIFIER_PARTNER_ID` as default

The Partner ID is displayed and editable in the NavBar. When you navigate between Issuance and Verification flows, the Partner ID will automatically update to the appropriate default for that flow. You can still manually edit the Partner ID in the NavBar to test different configurations.

### SDK Configuration

The application uses the AIR Credential SDK with the following configuration options:

- **Theme**: Auto (adapts to system preference)
- **Locale**: English (en)
- **Endpoint**: Default AIR endpoint
- **Redirect URL**: Configurable for credential issuance redirection

## Project Structure

```
src/
├── components/
│   ├── issuance/
│   │   └── CredentialIssuance.tsx    # Credential issuance component
│   ├── verification/
│   │   └── CredentialVerification.tsx # Credential verification component
│   └── NavBarLogin.tsx               # Navigation bar with wallet connection
├── App.tsx                           # Main application component
├── App.css                           # Custom styles
├── index.css                         # Tailwind CSS imports
└── main.tsx                          # Application entry point
```

## Dependencies

- **React 19**: Modern React with hooks
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **AIR Credential SDK**: Core credential functionality
- **Vite**: Fast build tool and dev server

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Troubleshooting

### Common Issues

1. **Widget not loading**: Check your auth tokens and configuration
2. **Import errors**: Ensure all dependencies are installed
3. **TypeScript errors**: Verify your TypeScript configuration

### Debug Mode

Enable debug logging by opening the browser console and looking for:

- initialization messages
- Event listener registrations
- Verification/issuance completion events

## License

This project is licensed under the MIT License.

## Support

For issues related to:

- **AIR Credential SDK**: Contact the AIR team
- **This Demo Application**: Open an issue in this repository

# BioRebate

A health-focused application that allows users to upload health records, get verifiable credentials, and access personalized supplement discounts.

## Features

- Upload and process health documents (PDFs)
- Generate verifiable credentials for health data
- Access personalized supplement discounts
- Integration with Stripe Payment Links for purchasing

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Stripe account for payment processing
- Air Protocol credentials for document verification

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/your-username/BioRebate.git
cd BioRebate
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your environment variables:
```env
VITE_VERIFIER_API_KEY=your-verifier-api-key
VITE_VERIFIER_DID=your-verifier-did
VITE_PROGRAM_ID=your-program-id
```

4. Start the development server:
```bash
npm run dev
```

## Stripe Payment Links Setup

The application uses Stripe Payment Links for processing supplement purchases. To set up payment links for testing:

### 1. Create a Stripe Account
- Go to [stripe.com](https://stripe.com) and create an account
- Switch to test mode in the Stripe Dashboard

### 2. Create Products and Payment Links

For each supplement discount, create a corresponding product and payment link:

#### Product 1: Omega-3 Fish Oil
- **Product Name**: Omega-3 Fish Oil (30% OFF)
- **Price**: $24.49 (discounted from $34.99)
- **Description**: High-quality fish oil supplement for heart health
- **Enable shipping address collection**: Yes
- **Shipping rates**: Add standard shipping options

#### Product 2: Vitamin D3 5000 IU  
- **Product Name**: Vitamin D3 5000 IU (25% OFF)
- **Price**: $22.49 (discounted from $29.99)
- **Description**: High-potency Vitamin D3 for bone and immune health
- **Enable shipping address collection**: Yes

#### Product 3: Magnesium Glycinate
- **Product Name**: Magnesium Glycinate (40% OFF)
- **Price**: $23.99 (discounted from $39.99)
- **Description**: Highly absorbable magnesium for sleep and relaxation
- **Enable shipping address collection**: Yes

#### Product 4: Probiotics 50 Billion CFU
- **Product Name**: Probiotics 50 Billion CFU (35% OFF)
- **Price**: $32.49 (discounted from $49.99)
- **Description**: Multi-strain probiotic for digestive health
- **Enable shipping address collection**: Yes

### 3. Configure Payment Link Settings

For each payment link, configure the following settings:

- **Collect customer addresses**: Enable both billing and shipping addresses
- **Shipping countries**: Select countries you ship to (e.g., US, Canada)
- **Add shipping rates**: 
  - Standard Shipping: $5.99 (5-7 business days)
  - Express Shipping: $12.99 (2-3 business days)
  - Overnight Shipping: $19.99 (1 business day)
- **Collect phone number**: Enable for shipping notifications
- **Save payment details**: Optional (for future purchases)

### 4. Update Payment Links in Code

After creating your payment links, update the `testPaymentLinks` object in `src/pages/Discounts.tsx`:

```typescript
const testPaymentLinks = {
  '1': 'https://buy.stripe.com/test_YOUR_OMEGA3_LINK',
  '2': 'https://buy.stripe.com/test_YOUR_VITAMIND3_LINK', 
  '3': 'https://buy.stripe.com/test_YOUR_MAGNESIUM_LINK',
  '4': 'https://buy.stripe.com/test_YOUR_PROBIOTICS_LINK',
};
```

### 5. Test Payment Flow

Use Stripe's test card numbers for testing:

- **Successful payment**: 4242 4242 4242 4242
- **Declined payment**: 4000 0000 0000 0002
- **Requires authentication**: 4000 0025 0000 3155

For testing, use:
- **Expiry date**: Any future date (e.g., 12/25)
- **CVC**: Any 3 digits (e.g., 123)
- **ZIP code**: Any valid postal code

## Testing Instructions

### Step 1: Complete the Upload Flow
1. Navigate to the Upload page
2. Upload a health document (PDF)
3. Complete the credential issuance process
4. Verify you're redirected to the Discounts page

### Step 2: Verify Health Credential
1. On the Discounts page, click "Verify Credential"
2. Complete the verification process
3. You should see the available discounts

### Step 3: Test Purchase Flow
1. Click "Buy Now" on any supplement discount
2. You'll be redirected to the Stripe Payment Link
3. Fill in shipping address and payment information
4. Use test card number: 4242 4242 4242 4242
5. Complete the purchase

### Step 4: Verify Shipping Address Collection
- Confirm that shipping address is required
- Test different shipping options and rates
- Verify that shipping costs are calculated correctly

## Expected Payment Flow

1. **User clicks "Buy Now"** → Opens Stripe Payment Link in new tab
2. **Customer enters shipping address** → Required for all purchases
3. **Customer selects shipping method** → Standard, Express, or Overnight
4. **Customer enters payment information** → Test cards work in test mode
5. **Payment processed** → Customer receives confirmation email
6. **Merchant receives webhook** → Order fulfillment can begin

## Architecture

```
Upload → Issue Credential → Verify Credential → View Discounts → Purchase with Stripe
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production  
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Technologies Used

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Stripe Payment Links
- Air Protocol SDK
- Lucide React (icons)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request
