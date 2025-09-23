package com.todak.backend.domain.entity.user.dto;

import lombok.Getter;

@Getter
public class UserSignupRequest {

	private String username;
	private String pw;
	private String nick;
}
