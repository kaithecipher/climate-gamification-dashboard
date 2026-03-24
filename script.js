const fallbackDashboardData = {
  summary: {
    totalPoints: 18420,
    carbonSavedKg: 5280,
    challengesCompleted: 312,
    activeParticipants: 148,
    communityScore: 18420,
    currentStreakDays: 26
  },
  weeklyImpact: [
    { label: "Mon", value: 410 },
    { label: "Tue", value: 520 },
    { label: "Wed", value: 600 },
    { label: "Thu", value: 560 },
    { label: "Fri", value: 720 },
    { label: "Sat", value: 880 },
    { label: "Sun", value: 760 }
  ],
  challenges: [
    {
      title: "Transit Week Sprint",
      description: "Use public transit or bike commuting for five trips this week.",
      rewardPoints: 250,
      difficulty: "Medium"
    },
    {
      title: "Meatless Momentum",
      description: "Complete three plant-forward meals to lower food-related emissions.",
      rewardPoints: 150,
      difficulty: "Easy"
    },
    {
      title: "Energy Saver Night",
      description: "Reduce evening energy use and log one home-saving action.",
      rewardPoints: 200,
      difficulty: "Medium"
    }
  ],
  leaderboard: [
    { rank: 1, name: "Kai", points: 2410, impact: "820 kg CO₂e", streak: "32 days" },
    { rank: 2, name: "Jordan", points: 2280, impact: "760 kg CO₂e", streak: "27 days" },
    { rank: 3, name: "Avery", points: 2075, impact: "705 kg CO₂e", streak: "21 days" },
    { rank: 4, name: "Sage", points: 1940, impact: "660 kg CO₂e", streak: "18 days" },
    { rank: 5, name: "Milan", points: 1815, impact: "602 kg CO₂e", streak: "16 days" }
  ],
  badges: [
    { name: "Carbon Cutter", icon: "🌿", description: "Reduce over 500 kg of CO₂e.", status: "Unlocked" },
    { name: "Transit Titan", icon: "🚲", description: "Complete 20 low-emission commutes.", status: "Unlocked" },
    { name: "Energy Guardian", icon: "⚡", description: "Log 10 home energy savings.", status: "In Progress" },
    { name: "Community Spark", icon: "🏆", description: "Finish in the top 10 leaderboard.", status: "Unlocked" }
  ]
};

let impactChart;

const currencylessFormat = (value) => new Intl.NumberFormat("en-US").format(value);

document.addEventListener("DOMContentLoaded", () => {
  setupMobileNav();
  setupScrollSpy();
  loadDashboard();
  setupActionForm();
});

function setupMobileNav() {
  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("mainNav");

  toggle.addEventListener("click", () => {
    nav.classList.toggle("open");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => nav.classList.remove("open"));
  });
}

function setupScrollSpy() {
  const links = [...document.querySelectorAll(".nav a")];
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const observer = new IntersectionObserver(
    (entries) => {
      const visibleSection = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visibleSection) return;

      links.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${visibleSection.target.id}`;
        link.classList.toggle("active", isActive);
      });
    },
    { threshold: 0.35 }
  );

  sections.forEach((section) => observer.observe(section));
}

async function loadDashboard() {
  setApiStatus("Checking API...", "Connecting to Azure Function endpoint.", "pending");
  let data = fallbackDashboardData;

  try {
    const response = await fetch("/api/GetDashboardData");
    if (!response.ok) {
      throw new Error(`Dashboard API returned ${response.status}`);
    }
    data = await response.json();
    setApiStatus("API connected", "Live dashboard data is loading from Azure Functions.", "online");
  } catch (error) {
    console.warn("Using fallback data:", error.message);
    setApiStatus(
      "Fallback demo mode",
      "Azure API is unavailable locally, so sample dashboard data is being used.",
      "offline"
    );
  }

  populateSummary(data.summary);
  populateChallenges(data.challenges);
  populateLeaderboard(data.leaderboard);
  populateBadges(data.badges);
  renderImpactChart(data.weeklyImpact);
}

function setApiStatus(title, detail, state) {
  document.getElementById("apiStatusText").textContent = title;
  document.getElementById("apiStatusDetail").textContent = detail;

  const indicator = document.getElementById("statusIndicator");
  indicator.classList.remove("online", "offline");
  if (state === "online") indicator.classList.add("online");
  if (state === "offline") indicator.classList.add("offline");
}

function populateSummary(summary) {
  document.getElementById("totalPoints").textContent = `${currencylessFormat(summary.totalPoints)} pts`;
  document.getElementById("carbonSaved").textContent = `${currencylessFormat(summary.carbonSavedKg)} kg CO₂e`;
  document.getElementById("challengesCompleted").textContent = currencylessFormat(summary.challengesCompleted);
  document.getElementById("activeParticipants").textContent = currencylessFormat(summary.activeParticipants);

  document.getElementById("heroCommunityScore").textContent = `${currencylessFormat(summary.communityScore)} pts`;
  document.getElementById("heroCarbonSaved").textContent = `${currencylessFormat(summary.carbonSavedKg)} kg CO₂e`;
  document.getElementById("heroStreak").textContent = `${currencylessFormat(summary.currentStreakDays)} days`;
}

function populateChallenges(challenges) {
  const container = document.getElementById("challengeFeed");
  container.innerHTML = challenges
    .map(
      (challenge) => `
        <article class="challenge-card">
          <strong>${challenge.title}</strong>
          <p>${challenge.description}</p>
          <div class="challenge-meta">
            <span>${challenge.rewardPoints} pts</span>
            <span>${challenge.difficulty}</span>
          </div>
        </article>
      `
    )
    .join("");
}

function populateLeaderboard(leaderboard) {
  const tbody = document.getElementById("leaderboardBody");
  tbody.innerHTML = leaderboard
    .map(
      (user) => `
        <tr>
          <td><span class="rank-pill">${user.rank}</span></td>
          <td>${user.name}</td>
          <td>${currencylessFormat(user.points)} pts</td>
          <td>${user.impact}</td>
          <td>${user.streak}</td>
        </tr>
      `
    )
    .join("");
}

function populateBadges(badges) {
  const badgeGrid = document.getElementById("badgeGrid");
  badgeGrid.innerHTML = badges
    .map(
      (badge) => `
        <article class="badge-card">
          <div class="badge-icon">${badge.icon}</div>
          <strong>${badge.name}</strong>
          <p>${badge.description}</p>
          <span class="badge-status">${badge.status}</span>
        </article>
      `
    )
    .join("");
}

function renderImpactChart(series) {
  const ctx = document.getElementById("impactChart");
  if (impactChart) impactChart.destroy();

  impactChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: series.map((item) => item.label),
      datasets: [
        {
          label: "CO₂e Reduced (kg)",
          data: series.map((item) => item.value),
          fill: true,
          tension: 0.36,
          borderWidth: 3,
          borderColor: "#55c3ff",
          backgroundColor: "rgba(85, 195, 255, 0.14)",
          pointRadius: 4,
          pointHoverRadius: 5,
          pointBackgroundColor: "#59d6a3"
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          ticks: { color: "#9eb5c8" },
          grid: { color: "rgba(255,255,255,0.04)" }
        },
        y: {
          ticks: { color: "#9eb5c8" },
          grid: { color: "rgba(255,255,255,0.04)" }
        }
      },
      plugins: {
        legend: {
          labels: { color: "#ecf6ff" }
        }
      }
    }
  });

  ctx.style.minHeight = "320px";
}

function setupActionForm() {
  const form = document.getElementById("actionForm");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const payload = {
      actionType: form.actionType.value,
      quantity: Number(form.quantity.value),
      participantName: form.participantName.value.trim()
    };

    const resultBox = document.getElementById("actionResult");
    resultBox.textContent = "Submitting action...";

    try {
      const response = await fetch("/api/RegisterAction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`RegisterAction returned ${response.status}`);
      }

      const result = await response.json();
      renderActionResult(result);
    } catch (error) {
      console.warn("Unable to post to API:", error.message);
      renderActionResult({
        participantName: payload.participantName,
        actionType: payload.actionType,
        quantity: payload.quantity,
        pointsAwarded: estimatePoints(payload.actionType, payload.quantity),
        carbonSavedKg: estimateCarbonSaved(payload.actionType, payload.quantity),
        badgeHint: "Demo mode active. Connect Azure Functions for live action logging.",
        message: "Sample action calculated locally because the backend is unavailable."
      });
    }
  });
}

function estimatePoints(actionType, quantity) {
  const values = {
    bike_commute: 40,
    public_transit: 30,
    meatless_meal: 20,
    recycling: 15,
    plant_tree: 120,
    energy_saving: 25
  };

  return (values[actionType] || 10) * quantity;
}

function estimateCarbonSaved(actionType, quantity) {
  const values = {
    bike_commute: 2.5,
    public_transit: 1.8,
    meatless_meal: 1.2,
    recycling: 0.8,
    plant_tree: 21,
    energy_saving: 1.5
  };

  return ((values[actionType] || 0.5) * quantity).toFixed(1);
}

function renderActionResult(result) {
  const resultBox = document.getElementById("actionResult");
  resultBox.innerHTML = `
    <div class="result-card">
      <strong>${result.participantName} logged a new action.</strong>
      <p>${result.message}</p>
      <div class="result-metrics">
        <div>
          <span class="hero-stat-label">Points Awarded</span>
          <strong>${currencylessFormat(result.pointsAwarded)} pts</strong>
        </div>
        <div>
          <span class="hero-stat-label">Carbon Saved</span>
          <strong>${result.carbonSavedKg} kg CO₂e</strong>
        </div>
        <div>
          <span class="hero-stat-label">Action Type</span>
          <strong>${formatActionLabel(result.actionType)}</strong>
        </div>
        <div>
          <span class="hero-stat-label">Badge Hint</span>
          <strong>${result.badgeHint}</strong>
        </div>
      </div>
    </div>
  `;
}

function formatActionLabel(actionType) {
  return actionType
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
