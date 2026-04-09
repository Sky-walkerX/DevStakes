"""
Burnout Risk — Weighted scoring algorithm
Calculates burnout risk based on session patterns.
"""


def calculate_burnout_risk(sessions: list[dict]) -> float:
    """
    Calculate burnout risk (0-100) based on session patterns.

    Factors:
    - Missed/completed ratio (high misses = high burnout)
    - Session density (too many sessions = fatigue)
    - Time-of-day fatigue curve (late sessions increase risk)
    - Consecutive misses (streak of failures compounds stress)
    """
    if not sessions:
        return 0.0

    total = len(sessions)
    missed = sum(1 for s in sessions if s.get("status") == "missed")
    completed = sum(1 for s in sessions if s.get("status") == "completed")
    active_or_upcoming = total - missed - completed

    # Factor 1: Miss ratio (0-40 points)
    miss_ratio = (missed / total) * 40 if total > 0 else 0

    # Factor 2: Session density — more than 5 sessions/day is stressful (0-25 points)
    density_score = min(25, (total / 5) * 25) if total > 5 else (total / 5) * 10

    # Factor 3: Late-night sessions increase fatigue (0-20 points)
    late_sessions = sum(
        1
        for s in sessions
        if s.get("time") and int(s["time"].split(":")[0]) >= 20
    )
    late_score = min(20, late_sessions * 10)

    # Factor 4: Consecutive misses detection (0-15 points)
    consecutive_misses = 0
    max_consecutive = 0
    for s in sorted(sessions, key=lambda x: x.get("time", "00:00")):
        if s.get("status") == "missed":
            consecutive_misses += 1
            max_consecutive = max(max_consecutive, consecutive_misses)
        else:
            consecutive_misses = 0
    consecutive_score = min(15, max_consecutive * 5)

    total_risk = miss_ratio + density_score + late_score + consecutive_score

    # Reduce risk if user has good completion rate
    if total > 0 and completed / total > 0.7:
        total_risk *= 0.6  # 40% reduction for high achievers

    return round(min(100, max(0, total_risk)), 1)


def calculate_efficiency(sessions: list[dict]) -> float:
    """
    Calculate efficiency percentage based on completion patterns.
    """
    if not sessions:
        return 0.0

    total = len(sessions)
    completed = sum(1 for s in sessions if s.get("status") == "completed")
    missed = sum(1 for s in sessions if s.get("status") == "missed")

    if total == 0:
        return 0.0

    # Base efficiency from completion rate
    base = (completed / total) * 100

    # Penalty for missed sessions
    penalty = (missed / total) * 15

    return round(min(100, max(0, base - penalty)), 1)


def compute_peak_output(sessions: list[dict]) -> str:
    """
    Find the hour block with the most completed sessions.
    """
    completed = [s for s in sessions if s.get("status") == "completed"]
    if not completed:
        return "--:--h"

    hour_counts: dict[str, int] = {}
    for s in completed:
        if s.get("time"):
            hour = s["time"].split(":")[0]
            hour_counts[hour] = hour_counts.get(hour, 0) + 1

    if not hour_counts:
        return "--:--h"

    peak_hour = max(hour_counts, key=hour_counts.get)
    return f"{peak_hour}:00h"
