const fallbackDataUrl = "./data/sample_dashboard.json";
const apiEndpoint = "/api/dashboard";

const state = {
  period: "30d",
  payload: null,
  charts: {}
};

const icons = {
  carbon: "🌍",
  water: "💧",
  points: "⚡",
  streak: "🔥",
  mission: "🎯",
  badge: "🏅",
  tree: "🌱",
  bike: "🚲",
  recycle: "♻️",
  transit: "🚌",
  energy: "🔋"
};

async function loadDashboard(period = state.period) {
  const query = `?period=${encodeURIComponent(period)}`;

  try {
    const response = await fetch(`${apiEndpoint}${query}`);
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    state.payload = await response.json();
  } catch (error) {
    console.warn("Using local fallback data:", error.message);
    const fallbackResponse = await fetch(fallbackDataUrl);
    state.payload = await fallbackResponse.json();
    state.payload.meta.source = "local-fallback";
    state.payload.meta.period = period;
  }

  renderAll();
}

function renderAll() {
  if (!state.payload) return;

  renderHeroStats();
  renderKPIs();
  renderProgress();
  renderActivity();
  renderMissions();
  renderBadges();
  renderLeaderboard();
  renderCharts();
}

function renderHeroStats() {
  const { summary } = state.payload;
  setText("heroCarbon", formatNumber(summary.co2_avoided_kg));
  setText("heroStreak", `${summary.streak_days}`);
  setText("heroWater", formatNumber(summary.water_saved_liters));
  setText("heroRank", `#${summary.community_rank}`);
}

function renderKPIs() {
  const kpis = [
    {
      label: "Climate points",
      value: formatNumber(state.payload.summary.points),
      note: "Earned from verified actions",
      trend: `+${state.payload.summary.points_growth_pct}%`,
      icon: icons.points
    },
    {
      label: "CO₂ avoided (kg)",
      value: formatNumber(state.payload.summary.co2_avoided_kg),
      note: "Transportation + energy + waste",
      trend: `+${state.payload.summary.co2_growth_pct}%`,
      icon: icons.carbon
    },
    {
      label: "Water saved (L)",
      value: formatNumber(state.payload.summary.water_saved_liters),
      note: "Household efficiency actions",
      trend: `+${state.payload.summary.water_growth_pct}%`,
      icon: icons.water
    },
    {
      label: "Trees equivalent",
      value: formatNumber(state.payload.summary.trees_equivalent),
      note: "Converted environmental impact",
      trend: `${state.payload.summary.streak_days} day streak`,
      icon: icons.tree
    }
  ];

  const grid = document.getElementById("kpiGrid");
  grid.innerHTML = kpis
    .map(
      (kpi) => `
      <article class="kpi-card">
        <div class="kpi-top">
          <span class="kpi-icon" aria-hidden="true">${kpi.icon}</span>
          <span class="kpi-trend">${kpi.trend}</span>
        </div>
        <p class="kpi-label">${kpi.label}</p>
        <strong class="kpi-value">${kpi.value}</strong>
        <p class="metric-note">${kpi.note}</p>
      </article>
    `
    )
    .join("");
}

function renderProgress() {
  const { mission_progress } = state.payload.summary;
  const percent = Math.max(0, Math.min(100, mission_progress.percentage));
  const circumference = 2 * Math.PI * 70;
  const offset = circumference - (percent / 100) * circumference;

  document.getElementById("progressRingValue").style.strokeDasharray = `${circumference}`;
  document.getElementById("progressRingValue").style.strokeDashoffset = `${offset}`;
  setText("missionProgressValue", `${percent}%`);

  const details = document.getElementById("progressDetails");
  details.innerHTML = `
    <li><strong>${mission_progress.current}</strong> of <strong>${mission_progress.target}</strong> mission points completed</li>
    <li><strong>${mission_progress.next_reward}</strong> unlocks at ${mission_progress.target} points</li>
    <li><strong>${mission_progress.remaining}</strong> points left to complete this cycle</li>
  `;
}

function renderActivity() {
  const list = document.getElementById("activityList");
  list.innerHTML = state.payload.activities
    .map(
      (item) => `
      <article class="activity-item">
        <div class="activity-icon">${icons[item.icon] || "🌿"}</div>
        <div class="activity-copy">
          <h4>${item.title}</h4>
          <p>${item.description}</p>
          <small class="activity-meta">${item.timestamp} • +${item.points} pts • ${item.impact}</small>
        </div>
      </article>
    `
    )
    .join("");
}

function renderMissions() {
  const list = document.getElementById("missionList");
  list.innerHTML = state.payload.missions
    .map(
      (mission) => `
      <article class="mission-item">
        <div class="mission-main">
          <h4>${mission.title}</h4>
          <p>${mission.description}</p>
        </div>
        <div class="mission-meta">
          <span class="mission-points">+${mission.points} pts</span>
          <div class="mission-status">${mission.status}</div>
        </div>
      </article>
    `
    )
    .join("");
}

function renderBadges() {
  const grid = document.getElementById("badgeGrid");
  grid.innerHTML = state.payload.badges
    .map(
      (badge) => `
      <article class="badge-item">
        <div class="badge-icon">${icons[badge.icon] || "🏅"}</div>
        <h4>${badge.name}</h4>
        <p>${badge.description}</p>
      </article>
    `
    )
    .join("");
}

function renderLeaderboard() {
  const body = document.getElementById("leaderboardBody");
  body.innerHTML = state.payload.leaderboard
    .map(
      (entry) => `
      <div class="leaderboard-row">
        <span class="leaderboard-rank">#${entry.rank}</span>
        <span>${entry.name}</span>
        <span>${formatNumber(entry.points)}</span>
        <span>${entry.co2_saved_kg} kg</span>
        <span>${entry.badge}</span>
      </div>
    `
    )
    .join("");
}

function renderCharts() {
  renderImpactTrendChart();
  renderCategoryChart();
}

function renderImpactTrendChart() {
  const ctx = document.getElementById("impactTrendChart");
  destroyChart("impactTrend");

  const chartData = state.payload.trends;
  state.charts.impactTrend = new Chart(ctx, {
    type: "line",
    data: {
      labels: chartData.map((item) => item.label),
      datasets: [
        {
          label: "CO₂ Avoided (kg)",
          data: chartData.map((item) => item.co2_avoided_kg),
          borderColor: "#54d2a7",
          backgroundColor: "rgba(84, 210, 167, 0.18)",
          fill: true,
          tension: 0.35,
          pointRadius: 3
        },
        {
          label: "Points Earned",
          data: chartData.map((item) => item.points),
          borderColor: "#7ed9ff",
          backgroundColor: "rgba(126, 217, 255, 0.1)",
          fill: false,
          tension: 0.35,
          pointRadius: 3
        }
      ]
    },
    options: getSharedChartOptions()
  });
}

function renderCategoryChart() {
  const ctx = document.getElementById("categoryChart");
  destroyChart("category");

  const categories = state.payload.categories;
  state.charts.category = new Chart(ctx, {
    type: "bar",
    data: {
      labels: categories.map((item) => item.category),
      datasets: [
        {
          label: "Impact points",
          data: categories.map((item) => item.value),
          backgroundColor: [
            "rgba(84, 210, 167, 0.85)",
            "rgba(126, 217, 255, 0.85)",
            "rgba(255, 214, 107, 0.85)",
            "rgba(255, 139, 139, 0.8)"
          ],
          borderRadius: 12,
          borderSkipped: false
        }
      ]
    },
    options: {
      ...getSharedChartOptions(),
      plugins: {
        legend: { display: false }
      }
    }
  });
}

function getSharedChartOptions() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: { color: "#aac0bb" },
        grid: { display: false }
      },
      y: {
        ticks: { color: "#aac0bb" },
        grid: { color: "rgba(255,255,255,0.06)" }
      }
    },
    plugins: {
      legend: {
        labels: { color: "#eef6f3" }
      },
      tooltip: {
        backgroundColor: "rgba(6, 17, 26, 0.94)",
        titleColor: "#eef6f3",
        bodyColor: "#eef6f3",
        borderColor: "rgba(84, 210, 167, 0.2)",
        borderWidth: 1
      }
    }
  };
}

function destroyChart(key) {
  if (state.charts[key]) {
    state.charts[key].destroy();
  }
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

function setupPeriodFilters() {
  const buttons = document.querySelectorAll(".filter-btn");
  buttons.forEach((button) => {
    button.addEventListener("click", async () => {
      buttons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      state.period = button.dataset.period;
      await loadDashboard(state.period);
    });
  });
}

function setupNavigation() {
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = [...document.querySelectorAll("main .section")];
  const menuToggle = document.getElementById("menuToggle");
  const navLinksWrap = document.getElementById("navLinks");

  menuToggle.addEventListener("click", () => {
    const isOpen = navLinksWrap.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navLinksWrap.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
        });
      });
    },
    {
      rootMargin: "-45% 0px -45% 0px",
      threshold: 0.01
    }
  );

  sections.forEach((section) => observer.observe(section));
}

window.addEventListener("DOMContentLoaded", async () => {
  setupNavigation();
  setupPeriodFilters();
  await loadDashboard();
});
