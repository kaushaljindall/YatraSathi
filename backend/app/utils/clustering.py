from sklearn.cluster import KMeans
import numpy as np

def cluster_attractions(attractions: list, num_clusters: int):
    """
    Group nearby attractions to minimize travel time.
    """
    if not attractions:
        return [[]]
        
    num_clusters = min(num_clusters, len(attractions))
    
    # Extract coordinates
    coords = np.array([[a["lat"], a["lon"]] for a in attractions])
    
    # Perform K-means clustering
    kmeans = KMeans(n_clusters=num_clusters, random_state=42, n_init=10)
    labels = kmeans.fit_predict(coords)
    
    # Group attractions
    clusters = [[] for _ in range(num_clusters)]
    for i, label in enumerate(labels):
        clusters[label].append(attractions[i])
        
    return clusters
