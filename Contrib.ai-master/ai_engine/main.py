from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from search_agent import search_and_answer
from schemas import ChatRequest, ChatResponse
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

client_url = os.getenv("CLIENT_URL", "*")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[client_url] if client_url != "*" else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "ai-engine"}

@app.post("/chat")
def chat(data: ChatRequest) -> ChatResponse:
   try:
       logger.info(f"Received chat request - Query: {data.querry}, Repo ID: {data.repo_id}")
       response = search_and_answer(data.querry, data.repo_id)
       logger.info("Chat request processed successfully")
       return ChatResponse(answer=response.answer)
   except Exception as e:
       logger.error(f"Error processing chat request: {str(e)}")
       return ChatResponse(answer=f"Error processing your request: {str(e)}")


