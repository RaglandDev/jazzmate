from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
import google.generativeai as genai
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pathlib import Path
from fastapi.exceptions import RequestValidationError
from fastapi.responses import HTMLResponse

load_dotenv()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/assets", StaticFiles(directory=Path(__file__).parent.parent / "frontend/dist/assets"), name="assets")

class Message(BaseModel):
    role: str
    content: str

class PromptRequest(BaseModel):
    model: str
    messages: List[Message]
    temperature: float
    stream: bool

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))



@app.post("/generate_routine")
async def generate_routine(req: PromptRequest):
    try:
        full_prompt = "\n\n".join(msg.content for msg in req.messages if msg.role in {"system", "user"})
        model = genai.GenerativeModel("gemini-1.5-flash")
        config = genai.GenerationConfig(
            temperature=req.temperature,
            top_k=64,
            top_p=0.95,
            max_output_tokens=8192,
        )
        response = model.generate_content(full_prompt, generation_config=config)
        if not response.text:
            raise HTTPException(500, "No content generated from Gemini API")
        return {"routine": response.text.strip()}
    except Exception as e:
        err = str(e).lower()
        if "api key" in err or "authentication" in err:
            raise HTTPException(401, "Invalid Gemini API key")
        if any(k in err for k in ["quota", "exceeded", "rate limit"]):
            raise HTTPException(429, "Gemini API quota or rate limit exceeded")
        if any(k in err for k in ["blocked", "safety"]):
            raise HTTPException(400, "Content blocked by safety filters")
        raise HTTPException(500, f"Failed to generate routine: {e}")

@app.get("/{full_path:path}")
async def serve_spa(full_path: str):
    return FileResponse("frontend/dist/index.html")


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return HTMLResponse(content=open("frontend/dist/index.html").read(), status_code=404)
