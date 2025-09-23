package com.todak.backend.domain.entity.message.dto;

import java.time.LocalDateTime;

import com.todak.backend.domain.entity.message.Message;
import com.todak.backend.domain.entity.user.User;
import com.todak.backend.domain.entity.user.UserRole;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateMessageResponse {

	private Long messageId;
	private Long userId;
	private String nick;
	private String content;
	private UserRole role;
	private LocalDateTime createAt;


	public static CreateMessageResponse from(User user, Message message){
		return CreateMessageResponse.builder()
			.messageId(message.getId())
			.userId(user.getId())
			.nick(user.getNick())
			.role(user.getRole())
			.content(message.getContent())
			.createAt(message.getCreateAt())
			.build();
	}

	public static CreateMessageResponse from(Message message){
		return CreateMessageResponse.builder()
			.messageId(message.getId())
			.userId(null)
			.nick(null)
			.role(null)
			.content(message.getContent())
			.createAt(message.getCreateAt())
			.build();
	}
}
