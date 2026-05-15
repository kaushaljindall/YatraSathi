import logging
from typing import Dict, Any
from super_ai.emotional_ai import emotional_ai
from super_ai.adaptive_learning import adaptive_learning
from super_ai.predictive_core import predictive_core
from agentic.orchestration import agent_orchestrator
from conversation.dialogue_manager import dialogue_manager
from conversation.memory_engine import memory_engine
from monitoring.logging_engine import app_logger

logger = logging.getLogger(__name__)

class GlobalAIOrchestrator:
    """
    The master intelligence coordinator for the entire YatraSaathi ecosystem.
    Integrates emotional awareness, adaptive learning, predictive signals,
    and agent dispatch into a single, coherent intelligent response.
    """

    async def process(self, user_id: int, text: str, trip_context: Dict = None) -> Dict[str, Any]:
        app_logger.info("global_ai_orchestrator", user_id=user_id, query_preview=text[:50])

        # 1. Emotional intelligence — adapt tone before anything else
        emotion = emotional_ai.analyze_stress(text)

        # 2. Adaptive learning — update profile and get bias modifier
        if trip_context:
            adaptive_learning.record_interaction(user_id, "general", trip_context)
        bias = adaptive_learning.get_recommendation_bias(user_id)

        # 3. Build dialogue state (intent + memory + context)
        state = await dialogue_manager.prepare_dialogue_state(user_id, text)

        # 4. Inject emotional note + bias into the agent context
        if emotion["system_note"]:
            state["emotional_override"] = emotion["system_note"]
        state["preference_bias"] = bias

        # 5. Dispatch to the correct specialist agent
        raw_response = await agent_orchestrator.dispatch(user_id, state)

        # 6. Update memory
        memory_engine.add_interaction(user_id, text, raw_response)

        # 7. Record intent for learning
        adaptive_learning.record_interaction(user_id, state["intent"])

        return {
            "response": raw_response,
            "intent": state["intent"],
            "stress_level": emotion["stress_level"],
            "ai_tone": emotion["tone"],
            "user_profile": adaptive_learning.get_profile(user_id),
        }

global_ai_orchestrator = GlobalAIOrchestrator()
