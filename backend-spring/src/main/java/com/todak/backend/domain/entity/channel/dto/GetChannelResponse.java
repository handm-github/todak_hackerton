package com.todak.backend.domain.entity.channel.dto;

import java.time.LocalDateTime;

import com.todak.backend.domain.entity.channel.Channel;
import com.todak.backend.domain.entity.channel.ChannelStatus;
import com.todak.backend.domain.entity.channel.ChannelType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class GetChannelResponse {

	private Long channelId;
	private String channelName;
	private ChannelType type;
	private ChannelStatus status;
	private LocalDateTime date;

	public static GetChannelResponse fromChannel(Channel channel) {
		return GetChannelResponse.builder()
			.channelId(channel.getId())
			.channelName(channel.getName())
			.type(channel.getType())
			.status(channel.getStatus())
			.date(channel.getCreateAt())
			.build();
	}
}
