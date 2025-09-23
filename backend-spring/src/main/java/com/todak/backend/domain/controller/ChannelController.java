package com.todak.backend.domain.controller;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.todak.backend.domain.entity.channel.ChannelType;
import com.todak.backend.domain.entity.channel.dto.CreateChannelRequest;
import com.todak.backend.domain.entity.channel.dto.CreateChannelResponse;
import com.todak.backend.domain.entity.channel.dto.GetChannelResponse;
import com.todak.backend.domain.service.ChannelService;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class ChannelController {

	private final ChannelService channelService;

	@PostMapping("/channels")
	public ResponseEntity<?> createChannel(HttpSession session,
		@RequestBody CreateChannelRequest request) {
		CreateChannelResponse response = channelService.createChannel(session, request);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/channels")
	public ResponseEntity<?> getChannels(HttpSession session,
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size,
		@RequestParam(defaultValue = "CHATBOT") ChannelType type) {
		Page<GetChannelResponse> response = channelService.getChannels(session, page, size, type);
		return ResponseEntity.ok(response);
	}
}
