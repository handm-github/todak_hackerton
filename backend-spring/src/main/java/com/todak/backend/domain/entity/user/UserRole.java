package com.todak.backend.domain.entity.user;

import lombok.Getter;

@Getter
public enum UserRole {

	USER("유저"),
	ADMIN("관리자"),
	COUNSELOR("상담사");

	private final String discretion;

	UserRole(String discretion) {
		this.discretion = discretion;
	}
}
