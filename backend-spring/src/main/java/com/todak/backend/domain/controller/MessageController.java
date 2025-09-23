package com.todak.backend.domain.controller;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

import com.todak.backend.domain.entity.message.dto.CreateMessageRequest;
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

}
