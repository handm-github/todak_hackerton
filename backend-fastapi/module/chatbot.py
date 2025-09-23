from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.memory import ConversationBufferWindowMemory
from langchain.chains import ConversationChain

import os
api_key = ''
os.environ['OPENAI_API_KEY'] = api_key
# 상담 챗봇 초기화 함수
def get_chatbot_chain():
    # LLM
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.7)

    # 템플릿
    template = """당신은 따뜻하고 공감적인 상담사 역활을 하는 챗봇입니다.
    사용자의 고민을 차분하고 친절하게 들어주고, 조언을 제공합니다.
    조언의 길이는 길지않게 최대 40자 내의 답변을 하며,
    상대방이 더 많은 대화를 할 수 있도록 이끌어 내야합니다.. 
    """
    # 프롬프트
    prompt = ChatPromptTemplate.from_messages([
        ("system", template), ("ai", "{chat_history}"), ("human", "{message}")
    ])

    # 대화 내용을 기억하는 메모리
    memory = ConversationBufferWindowMemory(k=2,
        memory_key="chat_history", 
        return_messages=True
    )

    # LLM 체인
    chain = ConversationChain(
        llm=llm,
        prompt=prompt,
        memory=memory
    )

    return chain