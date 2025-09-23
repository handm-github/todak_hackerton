package com.todak.backend.domain.entity.channel.dto;

import com.todak.backend.domain.entity.channel.Channel;
import com.todak.backend.domain.entity.channel.ChannelStatus;
import com.todak.backend.domain.entity.channel.ChannelType;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class CreateChannelResponse {
	private Long channelId;
	private String channelName;
	private ChannelType channelType;
	private ChannelStatus status;

	public static CreateChannelResponse fromChannel(Channel channel){
		return CreateChannelResponse.builder()
			.channelId(channel.getId())
			.channelName(channel.getName())
			.channelType(channel.getType())
			.status(channel.getStatus())
			.build();
	}
}
