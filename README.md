# OSREN Integrated Ops Manager - Mobile Inventory System

A comprehensive mobile inventory management system that uses Excel files stored on Google Drive as the main database, with integrations for Google Calendar, Maps, Firebase notifications, and payment gateways.

## Features

- **Excel Database**: Read/write inventory data directly from Excel files on Google Drive
- **Mobile PWA**: Progressive Web App for mobile compatibility
- **Google Calendar**: Sync appointments and bookings
- **Google Maps**: Location services and navigation
- **Push Notifications**: Firebase Cloud Messaging for alerts
- **Payment Gateways**: Stripe and Malaysia-friendly options (ToyyibPay)

## Setup Instructions

### Backend Setup (Required)

1. Navigate to backend directory:
   ```bash
   cd backend
   npm install
   ```

2. **Google Service Account Setup:**
   - Create a Google Cloud Project
   - Enable Google Sheets API and Google Calendar API
   - Create a service account and download the JSON key file
   - Extract values from the JSON:
     - `client_email` → `GOOGLE_CLIENT_EMAIL`
     - `private_key` → `GOOGLE_PRIVATE_KEY` (keep the `\n` line breaks)

3. Configure environment variables in `backend/.env`:
   ```
   GOOGLE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----"
   GOOGLE_SPREADSHEET_ID=1g_UE2dUf4VNxC7P01UIUz22VqhLwUH93  # Already set
   ```

4. **Share Google Sheet:**
   - The spreadsheet is already configured: `https://docs.google.com/spreadsheets/d/1g_UE2dUf4VNxC7P01UIUz22VqhLwUH93`
   - Share it with your service account email (from step 2) with Editor permissions

### Frontend Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables in `.env.local`:
   ```
   REACT_APP_API_BASE_URL=http://localhost:5000/api
   ```

### Running the Application

1. Start the backend:
   ```bash
   npm run backend
   ```
   This will run `cd backend && npm run dev`

2. In another terminal, start the frontend:
   ```bash
   npm run dev
   ```

3. Access the app at `http://localhost:5173`

## API Endpoints

### Inventory (Excel Database)
- `GET /api/inventory/list` - Get all inventory items from Google Sheets
- `POST /api/inventory/add` - Add new row to Excel (body: item data)
- `POST /api/inventory/update` - Update row by ID (body: {id, ...updates})
- `POST /api/inventory/delete` - Delete row by ID (body: {id})

### Calculated Fields in Excel
After any update, these formulas are recalculated automatically:
- **Profit** = SellingPrice - UnitCost
- **StockValue** = Quantity * UnitCost
- **LowStockFlag** = IF(Quantity < MinLevel, 1, 0)

### Additional APIs
- `POST /api/calendar/create-event` - Create Google Calendar event
- `GET /api/maps/navigation` - Get Google Maps navigation URL
- `POST /api/payment/create-payment-intent` - Stripe payment
- `POST /api/payment/create-bill` - ToyyibPay payment

## Deployment

### Backend Deployment

**Railway:**
1. Connect your GitHub repository
2. Set environment variables in Railway dashboard
3. Deploy automatically

**Render:**
1. Create a new Web Service
2. Connect repository
3. Set environment variables
4. Build command: `npm install`
5. Start command: `npm start`

### Frontend Deployment
Deploy to Netlify, Vercel, or any static hosting service.

## Key Features

### Excel as Database
- The system reads/writes directly to Google Sheets
- Maintains Excel formulas and formatting
- Auto-calculates Profit, StockValue, and LowStockFlag
- Real-time synchronization with the mobile app

### Mobile Integration
- Low stock alerts with visual indicators
- Search functionality across all inventory fields
- Responsive PWA for mobile browsers
- Instant sync between app and Excel file

### API Structure
The backend follows modular architecture:
```
backend/
├── services/googleDriveService.js  # Google Sheets integration
├── services/calendarService.js     # Google Calendar
├── controllers/inventoryController.js
├── routes/inventory.js
└── server.js
```

### Security
- Service account authentication for Google APIs
- API key management for external services
- Secure environment variable configuration

## File Structure

```
/
├── backend/                 # Express.js API server
│   ├── controllers/         # Route handlers
│   ├── models/             # Data models
│   ├── routes/             # API routes
│   ├── services/           # Integration services
│   ├── server.js           # Main server file
│   └── package.json
├── components/             # React components
├── services/               # Frontend services
├── types.ts                # TypeScript types
├── constants.ts            # App constants
└── public/                 # Static assets (PWA icons)
```
