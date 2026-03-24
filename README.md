# Climate Gamification Dashboard

A clean, Azure-ready climate engagement dashboard built with:

- **HTML**
- **CSS**
- **JavaScript**
- **Python Azure Functions**

This project is designed for **Azure Static Web Apps** and demonstrates how to combine a responsive frontend with a lightweight Python API layer for climate impact tracking, user actions, badges, and leaderboard gamification.

## Features

- Responsive dashboard UI
- Climate KPI summary cards
- Weekly impact chart
- Challenge feed
- Badge and leaderboard system
- Action logger form
- Python API endpoints for dashboard data and action reward logic
- Local fallback demo mode when the backend is unavailable

## Project Structure

```text
climate-gamification-dashboard/
├── index.html
├── styles.css
├── script.js
├── host.json
├── requirements.txt
├── local.settings.json.example
├── staticwebapp.config.json
└── api/
    ├── GetDashboardData/
    │   ├── __init__.py
    │   └── function.json
    ├── RegisterAction/
    │   ├── __init__.py
    │   └── function.json
    └── shared/
        ├── __init__.py
        └── climate_engine.py
```

## API Endpoints

### `GET /api/GetDashboardData`
Returns the dashboard payload used by the frontend:
- summary metrics
- weekly impact series
- active challenges
- leaderboard
- badges

### `POST /api/RegisterAction`
Accepts a JSON payload like this:

```json
{
  "participantName": "Kai",
  "actionType": "bike_commute",
  "quantity": 2
}
```

Returns:
- points awarded
- carbon saved
- badge hint
- descriptive confirmation message

## Run Locally

### 1. Install Azure Functions Core Tools
Use Microsoft's official installation instructions for your operating system.

### 2. Create a virtual environment
```bash
python -m venv .venv
source .venv/bin/activate
```

On Windows:
```powershell
.venv\Scripts\activate
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Start the app
```bash
func start
```

By default:
- frontend loads locally
- API endpoints are served under `/api`

## Deploy to Azure Static Web Apps

1. Create a new **Azure Static Web App**
2. Connect the GitHub repository:
   - `kaithecipher/climate-gamification-dashboard`
3. Use the following build settings:

- **App location:** `/`
- **API location:** `api`
- **Output location:** leave blank for static HTML/CSS/JS

## Suggested Enhancements

- Add Azure Cosmos DB for persistent leaderboard storage
- Add Azure Table Storage or Blob Storage for challenge history
- Add Microsoft Entra ID authentication
- Add admin analytics view for campaign managers
- Add real user profiles and mission tracking
- Add downloadable climate impact reports

## Push to GitHub

```bash
git init
git branch -M main
git remote add origin https://github.com/kaithecipher/climate-gamification-dashboard.git
git add .
git commit -m "Initial commit - climate gamification dashboard"
git push -u origin main
```

## Why this project is strong for a portfolio

This repo shows:
- Azure deployment thinking
- frontend + backend integration
- climate-tech product sense
- gamification logic
- API design and clean UI engineering
