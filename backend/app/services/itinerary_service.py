import json
from datetime import datetime
from tinydb import TinyDB
from app.ai.llm_client import LLMClient
from app.utils.clustering import cluster_attractions
from app.services.route_optimizer import optimize_route
from app.services.attraction_service import get_attractions

llm_client = LLMClient()

def generate_ai_itinerary(db: TinyDB, trip_id: int):
    """
    Generate an itinerary using LLM, clustering, and route optimization.
    """
    trips_table = db.table('trips')
    trip = trips_table.get(doc_id=trip_id)
    
    if not trip:
        return None

    # Parse ISO strings back to datetimes
    start_date = datetime.fromisoformat(trip.get("start_date"))
    end_date = datetime.fromisoformat(trip.get("end_date"))
    destination = trip.get("destination")
    
    days = (end_date - start_date).days + 1
    if days <= 0:
        days = 1

    # 1. Fetch Attractions
    attractions = get_attractions(destination)
    
    # 2. Cluster Attractions based on days
    clustered = cluster_attractions(attractions, num_clusters=days)
    
    # 3. Optimize Route for each day
    days_plan = []
    for i, cluster in enumerate(clustered):
        optimized_route = optimize_route(cluster)
        
        # 4. Generate narrative with LLM
        prompt = f"Create a daily travel plan for {destination} for day {i+1} covering: {', '.join([a['name'] for a in optimized_route])}."
        narrative = llm_client.generate(prompt)
        
        days_plan.append({
            "day": i + 1,
            "date": str(start_date.date()),
            "route": optimized_route,
            "description": narrative
        })

    # Save to db
    itineraries_table = db.table('itineraries')
    
    itinerary_data = {
        "trip_id": trip_id,
        "days_plan": days_plan
    }
    
    doc_id = itineraries_table.insert(itinerary_data)

    return {"id": doc_id, "trip_id": trip_id, "days_plan": days_plan}


def generate_direct_itinerary(destination: str, days: int, budget: str, interests: str) -> str:
    """
    Directly asks Groq LLM to generate a fully detailed, HTML-formatted itinerary
    based on the provided parameters.
    """
    prompt = (
        f"You are YatraSathi, an expert AI travel planner. Create a highly detailed and engaging "
        f"{days}-day travel itinerary for {destination}. "
        f"The user has a {budget} budget and is primarily interested in: {interests}. "
        f"Format your entire response strictly as raw HTML. Do not include markdown blocks like ```html. "
        f"Use headings (<h4 style='color: var(--primary); margin-bottom: 0.5rem; font-size: 1.2rem;'>), "
        f"paragraphs (<p style='color: var(--text-muted); margin-bottom: 1.5rem;'>), "
        f"and lists to make it look beautiful. For each day, provide a clear Morning, Afternoon, and Evening plan."
    )
    
    # Try calling Groq, if not configured it returns mock response automatically from LLMClient
    html_content = llm_client.generate(prompt)
    
    # Strip markdown if the LLM still returns it
    html_content = html_content.replace('```html', '').replace('```', '')
    
    return html_content
