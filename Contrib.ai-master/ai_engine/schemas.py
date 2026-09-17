from pydantic import BaseModel, Field
from typing import List, Optional


class SearchQuery(BaseModel):
    """Schema for search query input"""
    query: str = Field(..., description="User's search query")
    repo_id: str = Field(..., description="Repository ID to search within")


class SearchResult(BaseModel):
    """Schema for individual search result"""
    file_path: str = Field(..., description="Path to the file containing the code")
    name: str = Field(..., description="Function/class name")
    code: str = Field(..., description="Code snippet")
    score: float = Field(..., description="Similarity score from vector search")


class SearchResponse(BaseModel):
    """Schema for search response"""
    answer: str = Field(..., description="Generated answer from the AI")
    search_results: List[SearchResult] = Field(default_factory=list, description="List of search results used to generate the answer")
    results_count: int = Field(..., description="Number of search results found")


class ChatRequest(BaseModel):
    """Schema for chat endpoint request"""
    querry: str = Field(..., description="User's query")
    repo_id: str = Field(..., description="Repository ID")


class ChatResponse(BaseModel):
    """Schema for chat endpoint response"""
    answer: str = Field(..., description="AI-generated answer")
