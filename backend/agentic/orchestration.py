import logging
from agentic.planner_agent import planner_agent
from agentic.budget_agent import budget_agent
from agentic.recommendation_agent import recommendation_agent
from agentic.safety_agent import safety_agent
from agentic.booking_agent import booking_agent
from agentic.translation_agent import translation_agent
from ai.llm_service import llm_service

logger = logging.getLogger(__name__)

class AgentOrchestrator:
    """Routes tasks to the correct specialized agent based on detected intent."""
    
    async def dispatch(self, user_id: int, dialogue_state: dict) -> str:
        intent = dialogue_state["intent"]
        logger.info(f"Dispatching intent '{intent}' for user {user_id}")
        
        if intent == "planner":
            return await planner_agent.execute(dialogue_state)
        elif intent == "budget":
            return await budget_agent.execute(dialogue_state)
        elif intent == "recommendation":
            return await recommendation_agent.execute(dialogue_state, user_id)
        elif intent == "safety":
            return await safety_agent.execute(dialogue_state)
        elif intent == "booking":
            return await booking_agent.execute(dialogue_state)
        elif intent == "translation":
            return await translation_agent.execute(dialogue_state)
        else:
            # General travel chat fallback
            context = dialogue_state["context"]
            memory = dialogue_state.get("memory", "")
            system_prompt = (
                f"You are YatraSaathi, a warm, intelligent AI travel companion. "
                f"The user is currently in {context.get('current_city', 'their destination')}. "
                f"Be helpful, concise, and contextually aware.\n\n"
                f"Conversation History:\n{memory}"
            )
            return await llm_service.generate_response(system_prompt, dialogue_state["query"], temperature=0.6)

agent_orchestrator = AgentOrchestrator()
