from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate

# 상담 챗봇 초기화 함수
def get_chatbot_chain():
    # LLM
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.5)

    # 템플릿
    template = """당신은 따뜻하고 공감적인 상담사 역활을 하는 챗봇입니다.
    사용자의 고민을 차분하고 친절하게 들어주고, 조언을 제공합니다.
    조언의 길이는 길지않게 최대 40자 내의 답변을 하며,
    상대방이 더 많은 대화를 할 수 있도록 이끌어 내야합니다.. 
    """
    prompt = ChatPromptTemplate.from_messages([
    ("system", template),
    ("human", "{message}")
])

    # LCEL 방식 체인
    chain = prompt | llm

    return chain