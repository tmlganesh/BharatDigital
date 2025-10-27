#Bharat - MGNREGA District Performance Dashboard

A comprehensive full-stack web application that allows citizens to explore MGNREGA district-level performance through clean visuals and real data from data.gov.in.

## 🎯 Project Overview

This dashboard provides transparent access to MGNREGA (Mahatma Gandhi National Rural Employment Guarantee Act) performance data across Indian districts, featuring:

- **Real Government Data**: Uses actual MGNREGA data from data.gov.in (290,000+ records)
- **Clean Design**: Sarvam AI-inspired minimal and elegant interface
- **Performance Analytics**: District-wise performance metrics and comparisons
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Fast Performance**: Optimized MongoDB queries and React components

## 🧱 Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern component library
- **Recharts** - Beautiful data visualization
- **Framer Motion** - Smooth animations
- **React Query** - Data fetching and caching

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database for performance data
- **Mongoose** - Object modeling for MongoDB
- **CSV Parser** - For processing government data files

### Security & Performance
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API protection
- **Compression** - Response compression
- **MongoDB Indexing** - Optimized queries

## 📊 Data Structure

The application processes real MGNREGA data with the following key metrics:

- **Financial Year & Month** - Time-based analysis
- **State and District** - Geographic breakdown
- **Household Employment** - Total households that worked
- **Person-days Generated** - Employment days provided
- **Average Wage Rate** - Daily wage information
- **Expenditure Details** - Total and administrative costs
- **Work Progress** - Ongoing and completed works
- **Social Inclusion** - SC/ST and women participation
- **Payment Efficiency** - Within 15-day payment percentage

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB (Atlas or local)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Bharat
   ```

2. **Set up environment variables**
   ```bash
   # Update .env file with your MongoDB connection string
   MONGO_URI="mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority"
   ```

3. **Install and start the backend**
   ```bash
   cd backend
   npm install
   node server.js
   ```
   Backend will run on http://localhost:5000

4. **Install and start the frontend**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```
   Frontend will run on http://localhost:3000

5. **Load real data (if needed)**
   ```bash
   cd ../backend
   node loadRealData.js
   ```

## 📁 Project Structure

```
Bharat/
├── backend/                 # Express.js API server
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API endpoints
│   ├── controllers/        # Request handlers
│   ├── config/             # Database configuration
│   ├── loadRealData.js     # CSV data loader
│   └── server.js           # Main server file
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── hooks/          # Custom React hooks
│   │   └── utils/          # Utility functions
│   ├── public/             # Static assets
│   └── index.html          # Entry HTML
├── data/                   # Government data files
└── .env                    # Environment variables
```

## 🌐 API Endpoints

### States & Districts
- `GET /api/states` - Get all states
- `GET /api/districts/:state` - Get districts by state
- `GET /api/states/search?q=term` - Search districts

### Performance Data
- `GET /api/performance/:state/:district` - Get district performance
- `POST /api/performance/compare` - Compare multiple districts
- `GET /api/performance/trends` - Get trending data
- `GET /api/performance/top` - Get top performers

### System
- `GET /api/health` - Health check
- `GET /` - API information

## 📊 Key Features

### 1. **Home Page**
- Clean hero section with project mission
- State and district selection dropdowns
- Search functionality for districts
- Responsive navigation

### 2. **Performance Dashboard**
- Real-time performance metrics cards
- Monthly trend charts (12-month history)
- State and national average comparisons
- Color-coded performance indicators
- Employment and expenditure analytics

### 3. **District Comparison**
- Side-by-side district performance
- Visual performance rankings
- Export functionality for reports
- Historical data analysis

### 4. **Data Visualization**
- Interactive charts with Recharts
- Responsive design for all devices
- Clean typography and spacing
- Accessibility-first approach

## 🔒 Security Features

- Rate limiting on all endpoints
- CORS protection
- Input validation with Joi
- Security headers with Helmet
- Environment variable protection
- MongoDB injection prevention

## 🚀 Performance Optimizations

- **Database**: Compound indexes for fast queries
- **Frontend**: Code splitting and lazy loading  
- **API**: Response compression and caching
- **Memory**: Optimized CSV processing in batches
- **Network**: Efficient data structures and pagination

## 📱 Mobile Responsiveness

- Mobile-first Tailwind CSS design
- Touch-friendly interface elements
- Responsive charts and tables
- Optimized for various screen sizes

## 🎨 Design Philosophy

Inspired by Sarvam AI's clean and minimal approach:
- **Typography**: Inter font for readability
- **Color Scheme**: Soft blues and grays
- **Layout**: Generous whitespace and clean lines
- **Interactions**: Subtle animations and transitions
- **Accessibility**: High contrast and keyboard navigation

## 🔧 Development

### Running in Development
```bash
# Backend with auto-reload
cd backend
npm run dev

# Frontend with hot reload
cd frontend
npm run dev
```

### Building for Production
```bash
# Frontend build
cd frontend
npm run build

# Backend is ready for production deployment
```

## 📊 Data Sources

- **MGNREGA Data**: Government of India's data.gov.in portal
- **Coverage**: 290,000+ records across all Indian states and districts
- **Time Range**: Multiple financial years with monthly breakdowns
- **Metrics**: 25+ performance indicators per district

## 🔄 Data Updates

The system is designed to handle new data:
1. Place new CSV files in the `data/` folder
2. Run the data loader: `node loadRealData.js`
3. Data is automatically processed and indexed
4. Frontend reflects updates immediately

## 🤝 Contributing

This project is part of the Bharat Digital Internship program, demonstrating:
- Full-stack development skills
- Real government data integration
- Modern web technologies
- Production-ready code quality
- User-centered design principles

## 📄 License

Built for educational and transparency purposes under the Bharat Digital Internship program.

---

**"Our Voice, Our Rights"** - Empowering citizens with transparent access to rural employment data across India.

### Current Status: ✅ Fully Functional
- ✅ Backend API with real MGNREGA data
- ✅ Frontend React application
- ✅ MongoDB database with 290,000+ records
- ✅ Complete API endpoints
- ✅ Responsive UI components
- ✅ Performance analytics
- ✅ District comparison features

**Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000