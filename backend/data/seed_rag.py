"""
YatraSaathi RAG Data Seeder
Run this script once to populate the FAISS vector store with real city knowledge.
Usage: python -m data.seed_rag
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from rag.ingestion import ingestion_pipeline
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("RAG_SEEDER")

CITY_DATA = {
    "delhi": {
        "attractions": """
            Delhi's top attractions include the Red Fort (Lal Qila), a UNESCO World Heritage Site built by Shah Jahan in 1648.
            Entry fee is INR 50 for Indians, INR 600 for foreigners. Best visited in the morning 9–11 AM to avoid crowds.
            Qutub Minar is the world's tallest brick minaret at 72.5m. Located in Mehrauli, entry INR 40/600.
            Humayun's Tomb is a Mughal architectural masterpiece and photography paradise. Entry INR 40/600.
            India Gate war memorial is free to visit. Best at dusk when lit. Avoid weekends — very crowded.
            Lotus Temple is free entry but queues can be 1 hour+. Visit on weekday mornings.
            Akshardham Temple: Free but no phones/cameras allowed. Takes 3–4 hours minimum.
            Chandni Chowk is the old city market — best explored by cycle rickshaw (INR 100–200).
            Dilli Haat offers authentic handicrafts at fixed prices (entry INR 30).
        """,
        "food": """
            Delhi street food hotspots: Paranthe Wali Gali in Chandni Chowk for stuffed parathas (INR 60–120 each).
            Karim's restaurant near Jama Masjid — legendary Mughlai food since 1913. Mutton korma INR 250–350.
            Khan Market has upscale cafes. Budget INR 400–800 per meal.
            Sarojini Nagar Market: street food stalls — chaat, golgappe, aloo tikki. Budget INR 50–150.
            Lajpat Nagar Central Market for South Indian and North Indian — Sagar Ratna recommended INR 200–400.
            INA Market for fresh produce and spices — locals shop here.
            Avoid tourist traps: restaurants near major monuments often charge 3–5x. Walk 200m away for real prices.
            Best budget thali: Andhra Bhavan INR 200–250 for unlimited food (lunch only).
        """,
        "transport": """
            Delhi Metro is the best way to navigate — AC, safe, and cheap. Token INR 10–60 depending on distance.
            Tourist Card (1-day INR 200, 3-day INR 500) for unlimited metro rides — worth it for 4+ trips/day.
            Auto-rickshaws: Always insist on meter or pre-negotiate. Red Anand Vihar to Connaught Place ~INR 150.
            Uber/Ola are reliable and metered — recommended over autos for tourists.
            Cycle rickshaws in Old Delhi for narrow lanes — INR 50–100 per km.
            Airport: Metro Yellow Line to New Delhi station, then change for Aerocity. OR Airport Express Line direct INR 60.
            Buses: cheap but complex route system — use Google Maps to navigate.
        """,
        "scams": """
            Common Delhi scams: Fake tourist offices near India Gate and Connaught Place.
            Tuk-tuk/auto drivers offering "free city tours" that end at commission shops.
            Gem stone scams: strangers asking you to carry "gifts" for export tax discounts — never agree.
            Overpriced tour guides at monuments — official guides have government ID cards.
            Fake Taj Mahal ticket offices near New Delhi Railway Station — buy online or at official counters.
            Currency exchange: Only use RBI-authorized exchange or bank ATMs. Street exchangers are all fake.
            Prepaid taxi booths at the airport are genuine — avoid negotiating with drivers outside.
        """,
        "budget": """
            Delhi budget breakdown per day (solo traveler):
            Budget: Dorm INR 500–800, street food INR 200–400, local transport INR 100–200. Total INR 800–1400.
            Mid-range: Guesthouse INR 1500–3000, restaurants INR 600–1200, cabs INR 400–600. Total INR 2500–4800.
            Luxury: Hotel INR 6000–15000, fine dining INR 2000–5000, private car INR 2000–4000. Total INR 10000–24000.
            Free attractions: India Gate, Lodhi Garden, Gurudwara Bangla Sahib, Dilli Haat (INR 30 entry).
        """
    },
    "jaipur": {
        "attractions": """
            Jaipur, the Pink City of Rajasthan — most buildings are painted terracotta pink by royal decree.
            Amber Fort (Amer Fort): UNESCO site, 11km from city. Entry INR 100/500. Elephant rides INR 900–1100 (booked in advance).
            City Palace is still partially inhabited by the royal family. Museum entry INR 200/700.
            Hawa Mahal (Palace of Winds): The iconic 953-windowed facade. Best photographed from the tea shop opposite. Entry INR 50/200.
            Jantar Mantar: UNESCO astronomical observatory. Entry INR 70/200. Hire a guide (INR 200–300) to understand instruments.
            Nahargarh Fort: Hilltop fort with best city views. Entry INR 50/200. Beautiful at sunset.
            Jal Mahal: Water palace visible from the road — exterior only, no public entry.
            Albert Hall Museum: State museum with excellent Rajasthani art. Entry INR 40/300.
            Best day trip: Abhaneri Chand Baori stepwell (95km) — one of the deepest and most beautiful in India.
        """,
        "food": """
            Jaipur food specialties: Dal Baati Churma is the must-try Rajasthani dish — lentils with baked wheat balls.
            Lassiwala on MI Road: Famous yogurt lassi since 1944. INR 30–60 per glass, arrives in clay cups.
            Rawat Misthan Bhandar: Best pyaaz kachori (onion-stuffed pastry) and ghevar. INR 20–80.
            Chokhi Dhani: Rajasthani village experience with cultural show and traditional thali. INR 800–1200.
            Niro's Restaurant: Established 1949, Indian and Continental. Budget INR 500–1200.
            1135 AD at Amber Fort: Fine dining in Mughal ambience. INR 1500–2500 per person.
            Bapu Bazaar area: Dozens of street food stalls — golgappe, kachori, chai. Budget INR 50–150.
            Avoid: Restaurants immediately outside Amber Fort — 3x city prices.
        """,
        "transport": """
            Jaipur transport: Auto-rickshaws are main mode but always negotiate first.
            Typical fares: Railway Station to City Palace INR 80–100. City Palace to Amber Fort INR 150–200.
            Cycle rickshaws in old city bazaars for short distances — INR 20–50.
            Hop-on Hop-off Bus: Pink City on Wheels tour covers major sites INR 200–300.
            Ola/Uber available — metered and reliable. Preferred for airport.
            Jaipur Metro: Limited coverage but connects station to city center. Token INR 10–40.
            Day rental of auto for all sites: INR 800–1200 for 8 hours — negotiate beforehand.
            Bike rentals available at most hostels: INR 250–500 per day for scooter.
        """,
        "scams": """
            Jaipur scams: Shop commission scams — drivers/guides get 20–40% commission from shops they bring you to.
            Gem stones and carpets: Vendors claim stones are investments — all tourist-grade quality.
            Carpet emporiums: "Government fixed price" is a lie — government shops are clearly marked Rajasthali.
            Guides at Hawa Mahal forcing themselves — hire only those with government photo ID.
            Fake free "blessing" at temples that demand money after.
            Amber Fort elephant ride overpricing — book at the official counter, not from touts.
            Lassi with bhang (cannabis): Sometimes added without consent at local stalls. Be aware.
        """,
        "budget": """
            Jaipur budget per day (solo):
            Budget: Hostel INR 400–700, dhabas INR 150–300, auto-rickshaw INR 100–200. Total INR 650–1200.
            Mid-range: Guesthouse INR 1200–2500, restaurants INR 400–900, auto/cab INR 300–500. Total INR 1900–3900.
            Luxury: Heritage hotel INR 5000–20000, fine dining INR 1500–4000, private car INR 1500–3000. Total INR 8000–27000.
            Monument combo ticket: Fort + Museum + Jantar Mantar INR 300 (Indian) saves money vs individual entry.
        """
    },
    "goa": {
        "attractions": """
            Goa's beaches are divided into North Goa (party, busy) and South Goa (peaceful, scenic).
            North Goa beaches: Baga, Calangute (most touristy), Anjuna (flea market Wed), Vagator (rocky, dramatic).
            South Goa beaches: Palolem (crescent-shaped, beautiful), Agonda (quiet, sea turtles), Cabo de Rama (secluded).
            Old Goa: UNESCO site with basilica of Bom Jesus (Saint Francis Xavier's remains). Free entry. 10km from Panaji.
            Dudhsagar Falls: 4-tiered waterfall, 60m high. Best Oct–Feb. Jeep safari from Mollem INR 400–600.
            Fort Aguada: 17th-century Portuguese fort with lighthouse. Free entry. Great sunset views.
            Anjuna Flea Market: Every Wednesday. Mix of handicrafts, clothes, antiques. Bargain hard.
            Spice plantations: Savoi Plantation tour includes meal — INR 600–800 pp. Book in advance.
            Dolphin-watching: Morning boat trips from Baga or Palolem. INR 400–700. Best Nov–Mar.
        """,
        "food": """
            Goa food: Seafood is the specialty — fish curry rice (local staple), prawn balchão, crab xacuti.
            Local restaurants (shacks): Fresh catch daily, cook-your-choice. Lobster INR 600–1200, prawns INR 250–500.
            Baga Shacks: Britto's and Fiesta are established. Budget INR 600–1500 per meal.
            Panjim Sausage: Goan chorizo pav at Panaji market INR 30–60.
            Bebinca: Traditional Goan layer cake — buy from Betty's or Confeitaria 31 de Janeiro.
            Feni: Local cashew or coconut spirit — INR 100–300 per bottle. Try at a local bar, not tourist shack.
            Vasco da Gama fishing docks: Fresh morning catches sold directly at lowest prices.
            Budget meal at dhabas inland: Fish thali INR 80–150. Tourist shacks on beach: INR 400–800.
        """,
        "transport": """
            Goa transport: Renting a scooter is the best way to explore. INR 300–500 per day.
            Motorbike rental: INR 400–700 per day (need international driving permit or Indian license).
            Local buses (KTC): Cheap INR 10–30 but infrequent and slow. Useful for Panaji–Mapusa–Margao.
            Taxis: No meters — all fixed fares. Negotiate before boarding. Panaji to Baga INR 300–450.
            Ola/Uber not widely available in Goa — rely on local taxis.
            Auto-rickshaws in Panaji city — INR 50–100 for short trips.
            Motorcycle taxi (pilots): Common in Goa — INR 30–80 for short distances.
        """,
        "budget": """
            Goa budget per day (solo):
            Budget: Hostel/dorm INR 500–1000, shack food INR 300–600, scooter INR 350. Total INR 1150–1950.
            Mid-range: Guesthouse INR 1500–3500, beach shack dining INR 700–1500, taxi INR 500–800. Total INR 2700–5800.
            Luxury: Resort INR 8000–25000, fine dining INR 2000–5000, car hire INR 2000–4000. Total INR 12000–34000.
            Best value: South Goa accommodations are 40% cheaper than North Goa for similar quality.
            Peak season Dec–Jan: All prices 2x–3x. Book 3 months in advance.
        """
    },
    "mumbai": {
        "attractions": """
            Mumbai's iconic sights: Gateway of India is the must-see colonial arch on the harbor. Free entry. Arrive early morning.
            Elephanta Caves: UNESCO site accessible by ferry from Gateway (INR 250 return). Carved cave temples from 5th–8th century. Entry INR 40/600.
            Chhatrapati Shivaji Maharaj Terminus (CST): UNESCO listed railway station. Stunning Victorian Gothic architecture.
            Marine Drive (Queen's Necklace): 3.5km promenade along the Arabian Sea. Best at sunset and late evening.
            Dharavi: Asia's largest slum — guided tours available INR 700–1200. 80% of revenue goes to community.
            Haji Ali Dargah: Mosque on a tiny islet connected by causeway (only accessible at low tide). Free entry.
            Sanjay Gandhi National Park: Tiger and leopard territory within city limits. Entry INR 80. Kanheri Caves inside.
            Bandra-Worli Sea Link: Best viewed from Bandra shore at night. Not walkable — take cab across.
        """,
        "food": """
            Mumbai street food: Vada Pav (Mumbai's burger) — best at Anand in Dadar INR 15–25.
            Pav Bhaji at Juhu Beach stalls — vegetable mash with buttered bread rolls INR 60–120.
            Bhel Puri and Sev Puri at Chowpatty Beach — INR 30–60. Be selective about hygiene.
            Leopold Cafe in Colaba: Historical landmark, survived 2008 attacks. Meals INR 400–900.
            Brittania & Co in Ballard Estate: Legendary Parsi restaurant. Berry pulao INR 350–500. Closed Sundays.
            Trishna in Fort: Best seafood in Mumbai. Butter-garlic crab INR 800–1500. Book in advance.
            Bade Miyan near Regal Cinema: Late-night kebabs and rolls. INR 80–200.
            Crawford Market (Mahatma Phule Market): Fresh produce, dry fruits, pets. Best morning visit.
        """,
        "transport": """
            Mumbai local trains: Lifeline of the city. INR 5–60 per trip. Get a day pass for tourists.
            App-based: Ola/Uber widely available. Shorter waits than Delhi. Surge pricing during rush hours.
            BEST buses: INR 5–25, AC buses available on major routes. Cash only.
            Auto-rickshaws: Only in suburbs (not in South Mumbai). Always metered by law.
            Black-yellow taxis: In South Mumbai. Meter + 25% night surcharge. INR 25 minimum.
            Ferry from Gateway of India: Elephanta, Alibaug, Mandwa. Check MTDC schedule.
            Best airport transfer: Uber/Ola to T2 (domestic) INR 400–700 from Andheri. Metro Line 1 for quick access.
        """,
        "scams": """
            Mumbai scams: Fake accommodation "fully booked" followed by directing to overpriced alternatives.
            Taxi meter tampering — insist on meter start at "1" minimum. Download meter chart from Maharashtra govt site.
            At Colaba Causeway: Persistent vendors following tourists. Firm "no" required — do not engage.
            Fake charity workers — no legitimate charity collects on the street randomly.
            ATM helper scams — decline any help at ATMs and cover your PIN.
            Train station porters: Agree on price (INR 50–100 max per bag) before they touch your luggage.
        """
    },
    "agra": {
        "attractions": """
            Agra is home to three UNESCO World Heritage Sites within 50km.
            Taj Mahal: The world's most famous monument. Entry INR 50/1100. Opens sunrise, closes sunset (Fridays closed).
            Best time to visit Taj Mahal: Sunrise (fewer crowds, pink light) or late afternoon (golden light).
            Book tickets online at: asi.payumoney.com — avoid queues.
            Taj Mahal full moon nights (5 nights around full moon): Entry INR 750/750. Book 2 weeks ahead.
            Agra Fort: Red sandstone Mughal fort, 2.5km from Taj. Entry INR 40/600. 2 hours needed.
            Fatehpur Sikri: Abandoned Mughal capital 40km from Agra. Entry INR 40/610. 2 hours needed.
            Itmad-ud-Daula (Baby Taj): First Mughal structure in white marble. Entry INR 30/310. Less crowded than Taj.
            Mehtab Bagh: Garden across Yamuna river from Taj — best view of Taj from outside, especially sunset.
        """,
        "food": """
            Agra food: Petha is the city's famous sweet made from white pumpkin — buy at Panchhi Petha shop near Agra Fort INR 100–300.
            Dal makhani and naan at Pinch of Spice restaurant — popular with tourists, INR 400–800.
            Mama Chicken (Wah Taj Hotel area): Best mughlai food in city INR 200–500.
            Street food near Kinari Bazaar: Jalebi, bedai (fried lentil bread), chai. INR 20–60.
            Rooftop restaurants near Taj: Views of Taj come at 2x price premium — eat for ambience, not value.
            Best breakfast: Near Eastern Gate of Taj, small dhabas serve paratha, chai, omelette INR 50–100.
        """,
        "transport": """
            Agra transport: Pre-paid auto stands at railway stations. Station to Taj INR 60–100.
            E-rickshaws (zero emission): Within 500m of Taj Mahal, only eco vehicles allowed. INR 20–40.
            Cycle-rickshaws for inner city: INR 50–100 per trip.
            Day auto/cab hire for all 3 UNESCO sites: INR 1000–1500 (negotiate before).
            Train from Delhi: Gatimaan Express (1h 40min, INR 755 AC chair). Shatabdi (2h, INR 745).
            Avoid: Taxi touts at Agra Cantonment station — go to pre-paid counter inside.
        """,
        "scams": """
            Agra is the scam capital of India for tourists. Stay alert.
            Marble shop scams: Rickshaw drivers insist on stopping at "government emporium" — it's commission-based.
            Fake guides at Taj: Only hire ASI-registered guides (blue shirts). Ask for license.
            Overpriced "genuine" marble inlay: Taj Mahal souvenirs are mostly Chinese imports. Buy at Kinari Bazaar if shopping.
            Touts claiming Taj is "closed today" or "special holiday" — Taj is only closed Fridays.
            Fake ticket counters near main gate — buy only from official ASI counters or online.
            "Friendship" scam: Friendly locals inviting to shop as a "cultural exchange" then pressuring to buy.
        """
    }
}


def seed_all_cities():
    """Ingest all city knowledge into the FAISS vector store."""
    total_chunks = 0
    for city, categories in CITY_DATA.items():
        for category, content in categories.items():
            content = content.strip()
            if content:
                ingestion_pipeline.ingest_raw_data(
                    source_text=content,
                    city=city,
                    category=category
                )
                logger.info(f"✅ Seeded: {city} / {category}")
                total_chunks += 1

    logger.info(f"\n🎉 RAG seeding complete. Processed {total_chunks} category blocks across {len(CITY_DATA)} cities.")
    return total_chunks


if __name__ == "__main__":
    logger.info("Starting YatraSaathi RAG knowledge base seeding...")
    seed_all_cities()
