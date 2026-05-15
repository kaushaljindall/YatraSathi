import logging

logger = logging.getLogger(__name__)

class OCREngine:
    """
    Extracts and interprets text from travel images: menus, signs, tickets, bills.
    Production: integrates Google Cloud Vision API or Tesseract + pre-processing.
    """
    async def extract_text(self, image_bytes: bytes, source_type: str = "menu") -> dict:
        logger.info(f"OCR extraction requested for source_type='{source_type}'")

        # Production implementation:
        # from google.cloud import vision
        # client = vision.ImageAnnotatorClient()
        # image = vision.Image(content=image_bytes)
        # response = client.text_detection(image=image)
        # text = response.text_annotations[0].description

        mock_texts = {
            "menu":    "Dal Makhani ₹180 | Paneer Butter Masala ₹220 | Naan ₹40",
            "sign":    "आगरा फोर्ट — Agra Fort — 3 km",
            "ticket":  "PNR: 4820391827 | Train: 12649 | Seat: S4-43 | DEP 06:15",
            "receipt": "Hotel Stay x2 nights: ₹3,600 | GST 12%: ₹432 | Total: ₹4,032",
        }
        raw_text = mock_texts.get(source_type, "Text extraction result placeholder.")

        return {
            "source_type": source_type,
            "raw_text": raw_text,
            "confidence": 0.94,
        }

ocr_engine = OCREngine()
