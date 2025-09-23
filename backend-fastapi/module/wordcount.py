from collections import Counter
import os, re, unicodedata

USE_KIWI = True
try:
    if USE_KIWI:
        from kiwipiepy import Kiwi
        kiwi = Kiwi()
        def tokenize(text: str):
            toks = []
            for (form, tag, _, _ ) in kiwi.analyze(text, top_n=1)[0][0]:
                if tag.startswith("N") or tag.startswith("V"):  # 명사, 동사
                    toks.append(form)
            return toks
    else:
        raise ImportError
except Exception:
    def tokenize(text: str):
        text = unicodedata.normalize("NFKC", str(text))
        return re.findall(r"[가-힣]{2,}|[A-Za-z]{2,}|[0-9]{2,}", text)

# 불용어 예시(원하면 추가/수정)
STOPWORDS = set("""
그리고 그러나 그런데 그래서 또한 또는 정말 매우 너무 그냥 어떤 이런 저런 그런 정도 조금 거의
상담 병원 증상 치료 검사 결과 문제 상태 환자 선생님 경험 이야기 생각 느낌 오늘 지금 최근 번호 문의
""".split())

# 단일 카운터 (라벨 구분 없음)
counts = Counter()

def count_tokens(text: str):
    """
    주어진 텍스트에서 명사/동사를 추출해 STOPWORDS를 제외하고 단순 카운트
    """
    for tok in tokenize(text):
        if tok in STOPWORDS:
            continue
        counts[tok] += 1
    return counts