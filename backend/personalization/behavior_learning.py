import logging

logger = logging.getLogger(__name__)

class BehaviorLearning:
    """
    Tracks implicit user actions to refine recommendation quality over time.
    Detects drift in preference (e.g., user trending towards luxury after budget trips).
    """
    def __init__(self):
        self._feedback: dict[int, list] = {}

    def record_feedback(self, user_id: int, recommendation_id: str, accepted: bool, category: str):
        if user_id not in self._feedback:
            self._feedback[user_id] = []
        self._feedback[user_id].append({
            "id": recommendation_id,
            "accepted": accepted,
            "category": category,
        })
        logger.info(f"Feedback from user {user_id}: {'accepted' if accepted else 'rejected'} [{category}]")

    def get_acceptance_rate(self, user_id: int, category: str) -> float:
        records = [r for r in self._feedback.get(user_id, []) if r["category"] == category]
        if not records:
            return 0.5  # neutral default
        return sum(1 for r in records if r["accepted"]) / len(records)

    def get_weak_categories(self, user_id: int) -> list[str]:
        """Returns categories where acceptance rate is below 40% (AI needs to improve)."""
        categories = set(r["category"] for r in self._feedback.get(user_id, []))
        return [cat for cat in categories if self.get_acceptance_rate(user_id, cat) < 0.4]

behavior_learning = BehaviorLearning()
