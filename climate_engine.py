from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, List


@dataclass(frozen=True)
class ActionRule:
    points: int
    carbon_saved_kg: float
    badge_hint: str


ACTION_RULES: Dict[str, ActionRule] = {
    "bike_commute": ActionRule(points=40, carbon_saved_kg=2.5, badge_hint="Progress toward Transit Titan"),
    "public_transit": ActionRule(points=30, carbon_saved_kg=1.8, badge_hint="Strong commuter impact"),
    "meatless_meal": ActionRule(points=20, carbon_saved_kg=1.2, badge_hint="Feeds Meatless Momentum"),
    "recycling": ActionRule(points=15, carbon_saved_kg=0.8, badge_hint="Builds Carbon Cutter momentum"),
    "plant_tree": ActionRule(points=120, carbon_saved_kg=21.0, badge_hint="High-value ecosystem action"),
    "energy_saving": ActionRule(points=25, carbon_saved_kg=1.5, badge_hint="Moves Energy Guardian forward"),
}


def get_dashboard_payload() -> Dict:
    return {
        "summary": {
            "totalPoints": 18420,
            "carbonSavedKg": 5280,
            "challengesCompleted": 312,
            "activeParticipants": 148,
            "communityScore": 18420,
            "currentStreakDays": 26,
        },
        "weeklyImpact": [
            {"label": "Mon", "value": 410},
            {"label": "Tue", "value": 520},
            {"label": "Wed", "value": 600},
            {"label": "Thu", "value": 560},
            {"label": "Fri", "value": 720},
            {"label": "Sat", "value": 880},
            {"label": "Sun", "value": 760},
        ],
        "challenges": [
            {
                "title": "Transit Week Sprint",
                "description": "Use public transit or bike commuting for five trips this week.",
                "rewardPoints": 250,
                "difficulty": "Medium",
            },
            {
                "title": "Meatless Momentum",
                "description": "Complete three plant-forward meals to lower food-related emissions.",
                "rewardPoints": 150,
                "difficulty": "Easy",
            },
            {
                "title": "Energy Saver Night",
                "description": "Reduce evening energy use and log one home-saving action.",
                "rewardPoints": 200,
                "difficulty": "Medium",
            },
        ],
        "leaderboard": [
            {"rank": 1, "name": "Kai", "points": 2410, "impact": "820 kg CO₂e", "streak": "32 days"},
            {"rank": 2, "name": "Jordan", "points": 2280, "impact": "760 kg CO₂e", "streak": "27 days"},
            {"rank": 3, "name": "Avery", "points": 2075, "impact": "705 kg CO₂e", "streak": "21 days"},
            {"rank": 4, "name": "Sage", "points": 1940, "impact": "660 kg CO₂e", "streak": "18 days"},
            {"rank": 5, "name": "Milan", "points": 1815, "impact": "602 kg CO₂e", "streak": "16 days"},
        ],
        "badges": [
            {"name": "Carbon Cutter", "icon": "🌿", "description": "Reduce over 500 kg of CO₂e.", "status": "Unlocked"},
            {"name": "Transit Titan", "icon": "🚲", "description": "Complete 20 low-emission commutes.", "status": "Unlocked"},
            {"name": "Energy Guardian", "icon": "⚡", "description": "Log 10 home energy savings.", "status": "In Progress"},
            {"name": "Community Spark", "icon": "🏆", "description": "Finish in the top 10 leaderboard.", "status": "Unlocked"},
        ],
    }


def calculate_action_reward(action_type: str, quantity: int, participant_name: str) -> Dict:
    quantity = max(1, int(quantity))
    rule = ACTION_RULES.get(action_type, ActionRule(points=10, carbon_saved_kg=0.5, badge_hint="General climate action"))

    total_points = rule.points * quantity
    total_carbon_saved = round(rule.carbon_saved_kg * quantity, 1)

    return {
        "participantName": participant_name,
        "actionType": action_type,
        "quantity": quantity,
        "pointsAwarded": total_points,
        "carbonSavedKg": total_carbon_saved,
        "badgeHint": rule.badge_hint,
        "message": (
            f"{participant_name} completed {quantity} "
            f"{action_type.replace('_', ' ')} action(s) and earned a measurable climate reward."
        ),
    }
