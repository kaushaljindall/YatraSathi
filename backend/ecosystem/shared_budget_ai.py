import logging

logger = logging.getLogger(__name__)

class SharedBudgetAI:
    """
    Intelligently splits group expenses, detects imbalances, and suggests fair distributions.
    """
    def calculate_split(self, total_amount: float, member_count: int, split_type: str = "equal") -> dict:
        if member_count <= 0:
            return {"error": "Invalid member count"}

        if split_type == "equal":
            per_person = round(total_amount / member_count, 2)
            return {
                "split_type": "equal",
                "total": total_amount,
                "per_person": per_person,
                "member_count": member_count,
            }
        return {"note": "Custom split logic can be added based on member weights."}

    def detect_imbalance(self, payments: list[dict]) -> dict:
        """Identifies who has paid more/less than their fair share."""
        if not payments:
            return {"balanced": True}

        total = sum(p["amount"] for p in payments)
        fair_share = total / len(payments)

        imbalances = [
            {
                "user_id": p["user_id"],
                "paid": p["amount"],
                "owes": round(fair_share - p["amount"], 2)
            }
            for p in payments if abs(p["amount"] - fair_share) > 0.5
        ]
        return {"balanced": len(imbalances) == 0, "imbalances": imbalances, "fair_share": round(fair_share, 2)}

shared_budget_ai = SharedBudgetAI()
