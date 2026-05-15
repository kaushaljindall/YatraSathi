from typing import Dict, Any

class PersonalizationSystem:
    """Manages user travel profiles and implicit preferences."""
    def __init__(self):
        # user_id -> profile
        self.profiles: Dict[int, Dict[str, Any]] = {}
        
    def get_profile(self, user_id: int) -> Dict[str, Any]:
        if user_id not in self.profiles:
            self.profiles[user_id] = {
                "travel_style": "balanced",
                "favorite_categories": [],
                "average_budget_per_day": 0,
                "avoided_tags": []
            }
        return self.profiles[user_id]
        
    def update_from_interaction(self, user_id: int, query: str):
        """Implicitly update profile based on queries."""
        profile = self.get_profile(user_id)
        
        query_lower = query.lower()
        if "budget" in query_lower or "cheap" in query_lower:
            profile["travel_style"] = "budget"
        if "luxury" in query_lower or "expensive" in query_lower:
            profile["travel_style"] = "luxury"
        if "food" in query_lower or "restaurant" in query_lower:
            if "food" not in profile["favorite_categories"]:
                profile["favorite_categories"].append("food")
                
        self.profiles[user_id] = profile

personalizer = PersonalizationSystem()
