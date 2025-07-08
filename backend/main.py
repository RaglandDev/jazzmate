from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

class Message(BaseModel):
    role: str
    content: str

class PromptRequest(BaseModel):
    model: str
    messages: List[Message]
    temperature: float
    stream: bool

# Map your model names to Gemini model names
MODEL_MAPPING = {
    "gpt-4.1-nano": "gemini-1.5-flash",
    "gpt-4": "gemini-1.5-pro",
    "gpt-3.5-turbo": "gemini-1.5-flash",
    "gemini-1.5-flash": "gemini-1.5-flash",
    "gemini-1.5-pro": "gemini-1.5-pro",
    "gemini-1.0-pro": "gemini-1.0-pro"
}

# Configure the Gemini API on startup
def configure_gemini():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=500, 
            detail="Gemini API key not found. Please set GEMINI_API_KEY environment variable."
        )
    genai.configure(api_key=api_key)
    print("Gemini API configured successfully")

@app.on_event("startup")
async def startup_event():
    configure_gemini()

@app.post("/generate_routine")
async def generate_routine(req: PromptRequest):
    try:
        # Extract the user's prompt from messages
        user_prompt = ""
        system_prompt = ""
        
        for msg in req.messages:
            if msg.role == "user":
                user_prompt = msg.content
            elif msg.role == "system":
                system_prompt = msg.content
        
        # Combine system and user prompts
        full_prompt = f"{system_prompt}\n\n{user_prompt}" if system_prompt else user_prompt
        
        # Map the requested model to a Gemini model
        gemini_model = MODEL_MAPPING.get(req.model, "gemini-1.5-flash")
        
        print(f"Using Gemini model: {gemini_model}")
        print(f"Generating routine with prompt: {full_prompt}")
        
        # Initialize the model
        model = genai.GenerativeModel(gemini_model)
        
        # Configure generation parameters
        generation_config = genai.GenerationConfig(
            temperature=req.temperature,
            top_k=64,
            top_p=0.95,
            max_output_tokens=8192,
        )
        
        # Generate content
        response = model.generate_content(
            full_prompt,
            generation_config=generation_config
        )
        
        # Check if response was blocked
        if response.candidates[0].finish_reason.name == "SAFETY":
            raise HTTPException(
                status_code=400,
                detail="Content was blocked by safety filters"
            )
        
        # Extract the generated text
        if response.text:
            routine = response.text.strip()
            return {"routine": routine}
        else:
            raise HTTPException(
                status_code=500,
                detail="No content generated from Gemini API"
            )
        
    except Exception as e:
        print(f"Error generating routine: {e}")
        
        # Handle specific Gemini API errors
        error_str = str(e).lower()
        
        if "api key" in error_str or "authentication" in error_str:
            raise HTTPException(
                status_code=401,
                detail="Invalid Gemini API key"
            )
        elif "quota" in error_str or "exceeded" in error_str:
            raise HTTPException(
                status_code=429,
                detail="Gemini API quota exceeded"
            )
        elif "rate limit" in error_str:
            raise HTTPException(
                status_code=429,
                detail="Gemini API rate limit exceeded"
            )
        elif "blocked" in error_str or "safety" in error_str:
            raise HTTPException(
                status_code=400,
                detail="Content was blocked by safety filters"
            )
        else:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to generate routine: {str(e)}"
            )

@app.get("/available_models")
async def get_available_models():
    """Endpoint to get available models"""
    return {
        "models": list(MODEL_MAPPING.keys()),
        "default": "gemini-1.5-flash"
    }

