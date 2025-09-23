package com.todak.backend.domain.entity.user.dto;

import com.todak.backend.domain.entity.user.User;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CounselorUserResponse {

	private Long id;
	private String username;
	private String nick;

	public static CounselorUserResponse from(User user){
		return CounselorUserResponse.builder()
			.id(user.getId())
			.username(user.getUsername())
			.nick(user.getNick())
			.build();
	}
}
