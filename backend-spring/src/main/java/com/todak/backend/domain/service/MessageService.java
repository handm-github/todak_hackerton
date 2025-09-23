package com.todak.backend.domain.service;

import java.util.Objects;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import com.todak.backend.domain.entity.analysis.Analysis;
import com.todak.backend.domain.entity.analysis.dto.AnalysisRequest;
import com.todak.backend.domain.entity.analysis.dto.AnalysisResponse;
import com.todak.backend.domain.entity.channel.Channel;
import com.todak.backend.domain.entity.channel.ChannelStatus;
import com.todak.backend.domain.entity.channel.ChannelType;
import com.todak.backend.domain.entity.message.Message;
import com.todak.backend.domain.entity.message.dto.CreateMessageRequest;
import com.todak.backend.domain.entity.message.dto.CreateMessageResponse;
import com.todak.backend.domain.entity.message.dto.GetMessageResponse;
import com.todak.backend.domain.entity.user.User;
import com.todak.backend.domain.entity.user.UserRole;
import com.todak.backend.domain.entity.user.dto.UserLoginResponse;
import com.todak.backend.domain.repository.AnalysisRepository;
import com.todak.backend.domain.repository.MessageRepository;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MessageService {

	private final MessageRepository messageRepository;
	private final AnalysisRepository analysisRepository;
	private final UserService userService;
	private final ChannelService channelService;

	private final WebClient fastapiWebClient;
	private final SimpMessageSendingOperations messagingTemplate;

	@Transactional
	public void saveMessage(Long channelId, SimpMessageHeaderAccessor session, CreateMessageRequest request) {
		UserLoginResponse sessionUserResponse =
			(UserLoginResponse) Objects.requireNonNull(session.getSessionAttributes()).get("user");
		User user = userService.findById(sessionUserResponse.getUserId());

		Channel channel = channelService.findById(channelId);
		if (channel.getStatus().equals(ChannelStatus.UNACTIVATE)) {
			throw new RuntimeException(channelId + " 채널이 비활성화!! 메세지 보낼 수 없습니다.");
		}

		Message savedMessage = messageRepository.save(Message.builder()
			.channel(channel)
			.content(request.getContent())
			.user(user)
			.build());

		messagingTemplate.convertAndSend("/topic/channels/" + channelId + "/messages",
			CreateMessageResponse.from(user, savedMessage));

		new Thread(() -> {
			try {
				if (user.getRole().equals(UserRole.USER)) {
					analyzeMessage(request.getContent(), channelId, savedMessage.getId());
				}
				if (channel.getType().equals(ChannelType.CHATBOT)) {
					chatBotMessage(request.getContent(), channelId);
				}
			} catch (Exception e) {
				throw new RuntimeException(e);
			}
		}).start();
	}

	@Transactional(readOnly = true)
	public Page<GetMessageResponse> getMessages(HttpSession session, Long channelId, int page, int size) {
		var sessionUserResponse = (UserLoginResponse)session.getAttribute("user");
		User user = userService.findById(sessionUserResponse.getUserId());
		Pageable pageable = PageRequest.of(page, size, Sort.by("createAt").descending());
		Channel channel = channelService.findById(channelId);

		if (!channel.getUser().equals(user) && !channel.getExpert().equals(user)) {
			throw new RuntimeException("메시지를 조회 할 권한이 없습니다.");
		}

		return messageRepository.findByChannelId(channelId, pageable)
			.map(GetMessageResponse::from);
	}

	private void chatBotMessage(String message, Long channelId) {
		String chatbotResponse = fastapiWebClient.post()
			.uri("/api/v1/chatbot")
			.bodyValue(message)
			.retrieve()
			.bodyToMono(String.class)
			.block();

		Message chatbotMessage = Message.builder()
			.channel(channelService.findById(channelId))
			.content(chatbotResponse)
			.user(null)
			.build();

		messageRepository.save(chatbotMessage);

		messagingTemplate.convertAndSend("/topic/channels/" + channelId + "/messages",
			CreateMessageResponse.from(chatbotMessage));
	}

	// 메시지 분석
	private void analyzeMessage(String content, Long channelId, Long messageId) {
		AnalysisRequest request = AnalysisRequest.builder()
			.content(content)
			.build();

		AnalysisResponse response = fastapiWebClient.post()
			.uri("/api/v1/channels/{channelId}/reports/frequency", channelId)
			.bodyValue(request)
			.retrieve()
			.bodyToMono(AnalysisResponse.class)
			.block();

		if (response != null && response.getData() != null) {
			AnalysisResponse.AnalysisData data = response.getData();
			Analysis analysis = new Analysis();
			analysis.setChannelId(channelId);
			analysis.setMessageId(messageId);
			analysis.setAnxietyScore(Double.parseDouble(data.getAnxiety_score()));
			analysis.setDepressionScore(Double.parseDouble(data.getDepression_score()));
			analysis.setContent(data.getReport().toString());

			analysisRepository.save(analysis);
		}
	}
}
