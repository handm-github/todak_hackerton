package com.todak.backend.domain.service;

import org.springframework.stereotype.Service;

import com.todak.backend.domain.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

	private final UserRepository userRepository;


}
