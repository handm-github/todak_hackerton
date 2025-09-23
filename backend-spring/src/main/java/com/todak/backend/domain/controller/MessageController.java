package com.todak.backend.domain.controller;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import com.todak.backend.domain.entity.message.dto.CreateMessageRequest;
import com.todak.backend.domain.entity.message.dto.GetMessageResponse;
import com.todak.backend.domain.service.MessageService;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class MessageController {

	private final MessageService messageService;

	@MessageMapping("/channels/{channelId}/messages")
	public void sendMessage(@DestinationVariable Long channelId, @Payload CreateMessageRequest request,
		HttpSession session) {

		messageService.saveMessage(channelId, session, request);
	}

	@GetMapping("/api/v1/channels/{channelId}/messages")
	public ResponseEntity<?> getMessages(
		HttpSession session,
		@PathVariable Long channelId,
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "100") int size) {
		Page<GetMessageResponse> response = messageService.getMessages(session, channelId, page, size);
		return ResponseEntity.ok(response);
	}
}
