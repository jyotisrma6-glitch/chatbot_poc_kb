from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow frontend to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str


# 🔥 Replace this function with your LLM call
def call_my_llm(user_message: str) -> str:
    # Example dummy response
    return f"LLM says: {user_message}"

# def call_my_llm(user_message: str):
#     response = my_model.generate(user_message)
#     return response

# import requests

# def call_my_llm(user_message: str):
#     r = requests.post("YOUR_LLM_API", json={"msg": user_message})
#     return r.json()["reply"]


@app.post("/chat")
def chat(req: ChatRequest):
    reply = call_my_llm(req.message)
    return {"reply": reply}
