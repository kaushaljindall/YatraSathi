import time
import logging
from config.database import read_db, write_db

logger = logging.getLogger(__name__)

class GroupTripManager:
    """
    Collaborative travel engine for group trips.
    Handles shared itineraries, synchronized schedules, and group voting.
    """
    async def create_group(self, owner_id: int, name: str, member_ids: list[int]) -> dict:
        db = await read_db()
        if "groups" not in db:
            db["groups"] = []

        new_group = {
            "group_id": int(time.time()),
            "name": name,
            "owner_id": owner_id,
            "members": [owner_id] + member_ids,
            "itinerary": [],
            "votes": {},
            "shared_expenses": [],
        }
        db["groups"].append(new_group)
        await write_db(db)
        logger.info(f"Group '{name}' created with {len(new_group['members'])} members")
        return new_group

    async def get_group(self, group_id: int) -> dict | None:
        db = await read_db()
        return next((g for g in db.get("groups", []) if g["group_id"] == group_id), None)

    async def cast_vote(self, group_id: int, user_id: int, activity: str, vote: bool) -> dict:
        db = await read_db()
        for group in db.get("groups", []):
            if group["group_id"] == group_id:
                if activity not in group["votes"]:
                    group["votes"][activity] = {"yes": 0, "no": 0}
                group["votes"][activity]["yes" if vote else "no"] += 1
                break
        await write_db(db)
        return {"status": "vote_recorded", "activity": activity, "vote": "yes" if vote else "no"}

group_manager = GroupTripManager()
