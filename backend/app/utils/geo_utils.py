def distance_lat_lon(lat1, lon1, lat2, lon2):
    """
    Calculate rough distance or use Haversine.
    """
    # Simple mock distance
    return ((lat1 - lat2) ** 2 + (lon1 - lon2) ** 2) ** 0.5
