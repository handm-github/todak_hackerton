# api 적용
import torch
import torch.nn as nn
from transformers import AutoModel, AutoTokenizer

MODEL_REPOS = {
    "depression": "harkase/kluebert-depression",
    "anxiety":   "harkase/kluebert-anxiety",
}

# --- 얇은 회귀 헤드 (인코더 위에만 얹음) ---
class BertRegressor(nn.Module):
    def __init__(self, base_model, out_dim=1):
        super().__init__()
        self.base = base_model  # AutoModel (encoder only)
        hs = self.base.config.hidden_size
        self.regressor = nn.Linear(hs, out_dim)

    def forward(self, input_ids=None, attention_mask=None, token_type_ids=None, **kwargs):
        outputs = self.base(
            input_ids=input_ids,
            attention_mask=attention_mask,
            token_type_ids=token_type_ids,
            **kwargs
        )
        # BERT류면 pooler_output이 있고, 없으면 [CLS] 사용
        if getattr(outputs, "pooler_output", None) is not None:
            pooled = outputs.pooler_output               
        else:
            pooled = outputs.last_hidden_state[:, 0, :]
        logits = self.regressor(pooled)                  
        return logits

# --- 모델/토크나이저 로딩 ---
def load_models():
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    models, tokenizers = {}, {}
    for name, repo in MODEL_REPOS.items():
        encoder = AutoModel.from_pretrained(repo).to(device)   # <- 인코더만!
        model = BertRegressor(encoder, out_dim=1).to(device)
        model.eval()
        models[name] = model
        tokenizers[name] = AutoTokenizer.from_pretrained(repo)
    return models, tokenizers, device

# --- 유틸 ---
def closest_integer(x: float):     # 0~3 클램프
    return min(max(round(float(x)), 0), 3)

def predict(sentence: str, model, tokenizer, device):
    inputs = tokenizer(sentence, return_tensors="pt", padding=True, truncation=True)
    inputs = {k: v.to(device) for k, v in inputs.items()}

    with torch.no_grad():
        logits = model(**inputs)           # Tensor [B, 1]
    pred = logits.squeeze().item()         # float
    return closest_integer(pred)