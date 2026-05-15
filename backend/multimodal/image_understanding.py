import logging
from multimodal.ocr_engine import ocr_engine
from multimodal.vision_engine import vision_engine
from translation.translator import translator
from translation.language_detector import language_detector

logger = logging.getLogger(__name__)

class ImageUnderstandingPipeline:
    """
    Unified pipeline combining OCR + Vision + Translation for any travel image.
    """
    async def understand(self, image_bytes: bytes, source_type: str, target_language: str = "en") -> dict:
        logger.info(f"Full image understanding pipeline: source_type={source_type}")

        # 1. Extract text via OCR
        ocr_result = await ocr_engine.extract_text(image_bytes, source_type)

        # 2. Detect language and translate if needed
        detected_lang = await language_detector.detect_language(ocr_result["raw_text"])
        translated_text = ocr_result["raw_text"]
        if detected_lang != target_language:
            translated_text = await translator.translate_text(
                ocr_result["raw_text"], target_lang=target_language, source_lang=detected_lang
            )

        # 3. Scene analysis
        scene = await vision_engine.analyze_scene(image_bytes)

        return {
            "ocr": ocr_result,
            "translated_text": translated_text,
            "detected_language": detected_lang,
            "scene": scene,
        }

image_pipeline = ImageUnderstandingPipeline()
