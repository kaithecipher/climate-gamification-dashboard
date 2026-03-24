# Climate Gamification Dashboard

A unique Azure-ready static dashboard project that turns sustainability data into an engaging climate experience. The interface combines impact analytics, challenges, badges, streaks, and leaderboard-style feedback to demonstrate how cloud apps can drive behavior change.

## Why this project works in a portfolio

This is more than a landing page. It shows:
- Front-end engineering with semantic HTML, responsive CSS, and modular JavaScript
- Data visualization with charts and dynamic rendering
- Product thinking through mission systems, badges, and retention loops
- Azure deployment readiness using Static Web Apps
- Python serverless API integration using Azure Functions

## Project structure

```text
climate-gamification-dashboard/
├── index.html
├── styles.css
├── script.js
├── staticwebapp.config.json
├── README.md
├── data/
│   └── sample_dashboard.json
├── api/
│   ├── function_app.py
│   ├── host.json
│   └── requirements.txt
└── scripts/
    └── generate_seed_data.py
```

## Features

- Sticky navigation with active section highlighting
- Hero section with project framing and live summary metrics
- KPI cards for points, CO₂ avoided, water saved, and tree equivalency
- Line chart for impact trends
- Bar chart for category-level contribution analysis
- Mission progress ring for gamified goal tracking
- Climate action feed with recent activity
- Weekly missions and badge cabinet
- Community leaderboard
- Fallback data strategy so the UI still works without the API

## Local run options

### Option 1: Front-end only

Because this project includes local fallback JSON, you can open it with a basic static server:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

### Option 2: Front end + Azure Functions locally

Install Azure Functions Core Tools and create a virtual environment for the API.

```bash
cd api
python -m venv .venv
source .venv/bin/activate   # macOS/Linux
# .venv\Scripts\activate    # Windows PowerShell
pip install -r requirements.txt
func start
```

Then serve the front end separately from the project root.

## Deploy to Azure Static Web Apps

1. Create a GitHub repository named `climate-gamification-dashboard`.
2. Push this project to the repository.
3. In Azure, create a **Static Web App** resource and connect it to GitHub.
4. Set the app location to `/` and the API location to `api`.
5. Azure will build and deploy the static front end and wire in the Python API.

## Suggested recruiter talking points

- Built a climate-tech dashboard on Azure Static Web Apps with an optional Python serverless API.
- Designed a gamified sustainability experience featuring missions, badges, and leaderboard engagement loops.
- Implemented resilient front-end data loading with API-first fetch logic and static JSON fallback.
- Structured the app for easy extension into machine learning forecasts, carbon scoring models, or personalized climate recommendations.

## Easy upgrade ideas

- Add Azure Cosmos DB for persistent mission history
- Add Azure AI Foundry or Azure Machine Learning for prediction models
- Add authentication and per-user dashboards
- Add geospatial emissions views using Azure Maps
- Add team competitions for schools, offices, or neighborhoods
