package com.todak.backend.domain.entity.channel;

import lombok.Getter;

@Getter
public enum ChannelType {
	CHATBOT("챗봇"),
	EXPERT("전문"),
	GENERAL("일반");

	private final String name;

	ChannelType(String name) {
		this.name = name;
	}
}
