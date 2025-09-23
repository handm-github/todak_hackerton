# api 적용
import torch
import torch.nn as nn
from transformers import AutoModelForSequenceClassification, AutoTokenizer
MODEL_REPOS = {
    "depression": "harkase/kluebert-depression",
    "anxiety": "harkase/kluebert-anxiety"
}
# 허깅페이스에서 모델 불러오기

def load_models():
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    models, tokenizers = {}, {}

    for name, repo in MODEL_REPOS.items():
        models[name] = AutoModelForSequenceClassification.from_pretrained(repo).to(device)
        tokenizers[name] = AutoTokenizer.from_pretrained(repo)
        models[name].eval()

    return models, tokenizers, device

# 모델 정의
class CustomBertForSequenceRegression(AutoModelForSequenceClassification):
    def __init__(self, config):
        super().__init__(config)
        self.num_labels = 1
        self.regressor = nn.Linear(config.hidden_size, self.num_labels)

    def forward(self, input_ids=None, attention_mask=None, token_type_ids=None, labels=None, **kwargs):
        outputs = self.bert(
            input_ids,
            attention_mask=attention_mask,
            token_type_ids=token_type_ids,
            **kwargs
        )
        sequence_output = outputs[0]
        pooled_output = sequence_output[:, 0, :]
        logits = self.regressor(pooled_output)

        loss = None
        if labels is not None:
            loss_fct = nn.MSELoss()
            loss = loss_fct(logits, labels)
        return (loss, logits) if loss is not None else logits
    
# 유틸 함수
def closest_integer(predictions: float): # 0~3 사이에서 가장 가까운 정수 설정
    return min(max(round(predictions), 0), 3)

def predict(sentence: str, model, tokenizer, device): # 모델 예측
    inputs = tokenizer(sentence, return_tensors="pt", padding=True, truncation=True)
    inputs = {k: v.to(device) for k, v in inputs.items()}
    model.to(device)

    with torch.no_grad():
        outputs = model(**inputs)

    logits = outputs[1] if isinstance(outputs, tuple) else outputs
    pred = logits.squeeze().tolist()
    return closest_integer(pred)