package com.todak.backend.domain.entity.message;

import lombok.Getter;

@Getter
public enum MessageType {

	BOT("챗봇"),
	USER("유저"),
	EXPERT("전문가");

	private final String value;
	MessageType(String value) {
		this.value = value;
	}
}
