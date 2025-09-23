# api 설치
import subprocess
import sys
import os

def install_requirements():
    req_path = os.path.join(os.path.dirname(__file__), "requirements.txt")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", req_path])

# 실행 시 패키지 설치
install_requirements()

# api 적용
from fastapi import FastAPI
from pydantic import BaseModel
from contextlib import asynccontextmanager
from module.model import load_models, predict
from module.chatbot import get_chatbot_chain
from module.wordcount import count_tokens

# lifespan으로 모델 로드 관리
@asynccontextmanager
async def lifespan(app: FastAPI):
    global models, tokenizers, device
    models, tokenizers, device = load_models()
    yield
    models.clear()
    tokenizers.clear()
app = FastAPI(lifespan=lifespan)

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str

@app.get("/api/v1/chatbot", response_model=ChatResponse)
def chat(req: ChatRequest):
    response = get_chatbot_chain.run(message=req.message)
    return ChatResponse(reply=response)
"""
- 응답예시{json 형식}  
{
  "reply": "오늘 하루 많이 힘드셨겠어요."
}
"""
class TextInput(BaseModel):
    text: str

@app.get("/api/v1/channels/{channelId}/reports/frequency")
def analyze_text(channelId: str, data: TextInput):
    # 1) 단어 카운트
    counter = count_tokens(data.text)
    token_freqs = [{"token": tok, "count": cnt} for tok, cnt in counter.most_common()]

    # 2) 감지 모델 예측
    results = {}
    for disease in ["depression", "anxiety"]:
        results[disease] = predict(data.text, models[disease], tokenizers[disease], device)

    # 3) 통합 Response
    return {
        "channelId": channelId,
        "input": data.text,
        "tokens": token_freqs,
        "predictions": results
    }

""" 
- 응답예시(json형식)  
{
  "channelId": "123",  
  "input": "오늘은 기분이 우울하고 불안하다.",  
  "tokens": [  
    {"token": "기분", "count": 1},  
    {"token": "우울하고", "count": 1},  
    {"token": "불안하다", "count": 1}  
  ],  
  "predictions": {  
    "depression": 2,  
    "anxiety": 1  
  }  
} """

# 직동확인 부분(최종 확인후 주석처리 혹은 삭제할 것)
@app.get("/")
def root():
    return {"message": "KLUEBERT API is running", "models": ["depression", "anxiety"]}