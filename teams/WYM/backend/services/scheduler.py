"""
Scheduler — Smart recalculation logic
Reschedules missed sessions into available time slots.
"""


def recalculate_schedule(sessions: list[dict]) -> list[dict]:
    """
    Smart recalculation:
    1. Remove missed sessions
    2. Find available time slots
    3. Create replacement sessions in open slots
    4. Respect priority ordering (high → medium → low)
    """
    active_sessions = [s for s in sessions if s["status"] != "missed"]
    missed_sessions = [s for s in sessions if s["status"] == "missed"]

    if not missed_sessions:
        return sessions

    # Find occupied time slots
    occupied_times = set()
    for s in active_sessions:
        if s.get("time"):
            occupied_times.add(s["time"])

    # Available time slots (8:00 to 21:00 in 1.5h blocks)
    all_slots = []
    for hour in range(8, 21):
        for minute in [0, 30]:
            slot = f"{hour:02d}:{minute:02d}"
            if slot not in occupied_times:
                all_slots.append(slot)

    # Sort missed by priority (high first)
    priority_order = {"high": 0, "medium": 1, "low": 2}
    missed_sessions.sort(key=lambda s: priority_order.get(s.get("priority", "low"), 2))

    # Reschedule missed sessions into available slots
    rescheduled = list(active_sessions)
    slot_index = 0

    for missed in missed_sessions:
        if slot_index >= len(all_slots):
            break  # No more available slots

        new_time = all_slots[slot_index]
        slot_index += 1

        # Calculate end time (original duration or 1 hour default)
        start_hour, start_min = map(int, new_time.split(":"))
        end_hour = start_hour + 1
        end_min = start_min
        if end_hour > 21:
            end_hour = 21
            end_min = 0
        new_end_time = f"{end_hour:02d}:{end_min:02d}"

        rescheduled_session = {
            **missed,
            "time": new_time,
            "timeEnd": new_end_time,
            "status": "upcoming",
            "title": f"[Rescheduled] {missed['title']}",
            "description": f"Rescheduled: {missed.get('description', '')}",
        }
        rescheduled.append(rescheduled_session)

    # Sort by time
    rescheduled.sort(key=lambda s: s.get("time", "00:00"))

    return rescheduled
