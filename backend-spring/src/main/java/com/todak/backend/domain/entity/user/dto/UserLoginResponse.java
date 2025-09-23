package com.todak.backend.domain.entity.user.dto;

import com.todak.backend.domain.entity.user.User;
import com.todak.backend.domain.entity.user.UserRole;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserLoginResponse {
	private String username;
	private UserRole role;
	private String nick;

	public static UserLoginResponse from(User user) {
		return UserLoginResponse.builder()
			.username(user.getUsername())
			.nick(user.getNick())
			.role(user.getRole())
			.build();
	}
}
