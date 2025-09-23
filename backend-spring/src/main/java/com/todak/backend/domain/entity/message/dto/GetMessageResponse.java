package com.todak.backend.domain.entity.message.dto;

import java.time.LocalDateTime;

import com.todak.backend.domain.entity.message.Message;
import com.todak.backend.domain.entity.user.UserRole;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GetMessageResponse {

	private Long messageId;
	private Long userId;
	private String nick;
	private String content;
	private UserRole role;
	private LocalDateTime create_at;

	public static GetMessageResponse from(Message message) {
		var user = message.getUser();

		return GetMessageResponse.builder()
			.messageId(message.getId())
			.userId(user != null ? user.getId() : null)
			.nick(user != null ? user.getNick() : "챗봇")
			.content(message.getContent())
			.role(user != null ? user.getRole() : null)
			.create_at(message.getCreateAt())
			.build();
	}

}
