package com.todak.backend.domain.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.todak.backend.domain.entity.user.User;
import com.todak.backend.domain.entity.user.UserRole;
import com.todak.backend.domain.entity.user.dto.UserLoginRequest;
import com.todak.backend.domain.entity.user.dto.UserLoginResponse;
import com.todak.backend.domain.entity.user.dto.UserSignupRequest;
import com.todak.backend.domain.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

	private final UserRepository userRepository;

	@Transactional
	public void signUp(UserSignupRequest request) {
		existsByUsername(request.getUsername());
		userRepository.save(User.builder()
			.username(request.getUsername())
			.pw(request.getPw())
			.nick(request.getNick())
			.role(UserRole.USER)
			.build());
	}

	public UserLoginResponse login(UserLoginRequest request) {
		User user = findByUser(request.getUsername(), request.getPw());
		return UserLoginResponse.from(user);
	}

	public void existsByUsername(String username) {
		if (userRepository.existsByUsername(username)) {
			throw new RuntimeException("이미 존재하는 유저아이디입니다.");
		}
	}

	public User findByUser(String username, String pw) {
		return userRepository.findByUsernameAndPw(username, pw).orElseThrow(()-> new RuntimeException("아이디 또는 비밀번호가 틀렸습니다."));
	}

	public User findById(Long id) {
		return userRepository.findById(id).orElseThrow(()-> new RuntimeException("존재 하지 않는 유저입니다."));
	}
}
