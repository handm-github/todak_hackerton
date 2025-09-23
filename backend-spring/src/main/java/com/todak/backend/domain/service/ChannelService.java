package com.todak.backend.domain.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.todak.backend.domain.entity.channel.Channel;
import com.todak.backend.domain.entity.channel.ChannelStatus;
import com.todak.backend.domain.entity.channel.ChannelType;
import com.todak.backend.domain.entity.channel.dto.CreateChannelRequest;
import com.todak.backend.domain.entity.channel.dto.CreateChannelResponse;
import com.todak.backend.domain.entity.user.User;
import com.todak.backend.domain.entity.user.UserRole;
import com.todak.backend.domain.entity.user.dto.UserLoginResponse;
import com.todak.backend.domain.repository.ChannelRepository;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChannelService {

	private final ChannelRepository channelRepository;
	private final UserService userService;

	@Transactional
	public CreateChannelResponse createChannel(HttpSession session, CreateChannelRequest request) {
		var sessionUserResponse = (UserLoginResponse)session.getAttribute("user");

		User user = userService.findById(sessionUserResponse.getUserId());
		User expertUser = null;
		if (request.getType().equals(ChannelType.EXPERT)) {
			expertUser = userService.findById(request.getUserId());
			if (!expertUser.getRole().equals(UserRole.COUNSELOR)) {
				throw new RuntimeException("상담사가 아닙니다.");
			}

			findByUserAndExpert(user, expertUser);
		}

		return CreateChannelResponse.fromChannel(
			channelRepository.save(Channel.builder()
				.name(request.getChannelName())
				.type(request.getType())
				.user(user)
				.expert(expertUser)
				.status(ChannelStatus.ACTIVATE)
				.build()));
	}

	public void findByUserAndExpert(User user, User expert) {
		channelRepository.findByUserAndExpert(user, expert).ifPresent(channel -> {
			if (channel.getStatus().equals(ChannelStatus.ACTIVATE)) {
				throw new RuntimeException(channel.getId() + "번 채널이 이미 존재 합니다.");
			}
		});
	}
}
