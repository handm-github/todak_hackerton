package com.todak.backend.domain.entity.channel;

import lombok.Getter;

@Getter
public enum ChannelStatus {
	ACTIVATE("활성화"),
	UNACTIVATE("비활성화");

	private final String value;

	private ChannelStatus(String value) {
		this.value = value;
	}
}
