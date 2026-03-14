from sqlalchemy import Column, Integer, String, ForeignKey, JSON
from app.database import Base

class Itinerary(Base):
    __tablename__ = "itineraries"

    id = Column(Integer, primary_key=True, index=True)
    trip_id = Column(Integer, ForeignKey("trips.id"))
    days_plan = Column(JSON) # JSON representing day-wise travel plans
