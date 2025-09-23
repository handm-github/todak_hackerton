package com.todak.backend.domain.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.todak.backend.domain.entity.user.dto.UserLoginRequest;
import com.todak.backend.domain.entity.user.dto.UserLoginResponse;
import com.todak.backend.domain.entity.user.dto.UserSignupRequest;
import com.todak.backend.domain.service.UserService;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class UserController {

	private final UserService userService;

	@PostMapping("/users")
	public ResponseEntity<?> signUp(@RequestBody UserSignupRequest request) {
		userService.signUp(request);
		return ResponseEntity.ok("회원 가입 성공");
	}

	@PostMapping("/users/login")
	public ResponseEntity<?> login(@RequestBody UserLoginRequest request, HttpSession session) {
		try {
			UserLoginResponse response = userService.login(request);
			session.setAttribute("user", response);
			return ResponseEntity.ok(response);
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@GetMapping("/users/info")
	public ResponseEntity<?> details(HttpSession session) {
		UserLoginResponse userResponse = (UserLoginResponse)session.getAttribute("user");
		// 세션 정보가 있는지 확인
		if (userResponse != null) {
			return ResponseEntity.ok(userResponse);
		} else {
			return ResponseEntity.status(401).build();
		}
	}

	@PostMapping("/users/logout")
	public ResponseEntity<?> logout(HttpSession session) {
		session.removeAttribute("user");
		return ResponseEntity.ok("로그아웃 성공");
	}
}
