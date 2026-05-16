import urllib.request
import urllib.parse
import logging
from bs4 import BeautifulSoup
import asyncio

logger = logging.getLogger(__name__)

def fetch_image_sync(query: str) -> str:
    """
    Scrapes Wikipedia using BeautifulSoup to find highly accurate, high-quality images.
    Returns a fallback URL if it fails.
    """
    fallback_url = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=300&fit=crop"
    try:
        encoded_query = urllib.parse.quote_plus(query)
        search_url = f"https://en.wikipedia.org/w/index.php?search={encoded_query}"
        
        req = urllib.request.Request(
            search_url, 
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) YatraSathiBot/1.0'}
        )
        res = urllib.request.urlopen(req, timeout=5)
        html = res.read()
        soup = BeautifulSoup(html, 'html.parser')
        
        # If Wikipedia redirected directly to an article, it won't be a Special:Search page
        if 'Special:Search' in res.url:
            # We are on a search results page. Get the first result's article link.
            first_result = soup.select_one('.mw-search-result-heading a')
            if first_result and first_result.get('href'):
                article_url = 'https://en.wikipedia.org' + first_result['href']
                req2 = urllib.request.Request(
                    article_url, 
                    headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) YatraSathiBot/1.0'}
                )
                res2 = urllib.request.urlopen(req2, timeout=5)
                html2 = res2.read()
                soup = BeautifulSoup(html2, 'html.parser')
            else:
                return fallback_url
                
        # First try the OpenGraph meta tag (usually the best quality)
        og_image = soup.find('meta', property='og:image')
        if og_image and og_image.get('content') and not og_image['content'].endswith('.svg'):
            return og_image['content']
            
        # Fallback: look for the first decent sized photo
        for img_tag in soup.select('.infobox img, .thumbimage, .mw-file-element, img'):
            src = img_tag.get('src', '')
            if not src:
                continue
                
            # Skip icons, maps, and UI elements
            src_lower = src.lower()
            if '.svg' in src_lower or 'icon' in src_lower or 'logo' in src_lower or 'ambox' in src_lower or 'map' in src_lower:
                continue
                
            # We want a real photo
            if '.jpg' in src_lower or '.jpeg' in src_lower or '.png' in src_lower:
                if src.startswith('//'):
                    src = 'https:' + src
                elif src.startswith('/'):
                    src = 'https://en.wikipedia.org' + src
                
                # Wikipedia thumbs look like: .../thumb/a/a2/Name.jpg/220px-Name.jpg
                # Convert thumb to full res by removing /thumb/ and the trailing resolution part
                if '/thumb/' in src:
                    parts = src.split('/')
                    # Remove the last part (e.g., 220px-...)
                    if parts[-1].endswith('.jpg') or parts[-1].endswith('.png') or parts[-1].endswith('.jpeg'):
                        parts.pop()
                    src = '/'.join(parts).replace('/thumb/', '/')
                return src
                
    except Exception as e:
        logger.error(f"BeautifulSoup Wiki scrape failed for '{query}': {e}")
        
    return fallback_url

async def get_image_for_query(query: str) -> str:
    """
    Async wrapper for the synchronous BeautifulSoup scraping function.
    """
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, fetch_image_sync, query)
