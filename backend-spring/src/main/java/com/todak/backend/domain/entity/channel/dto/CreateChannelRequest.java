package com.todak.backend.domain.entity.channel.dto;

import com.todak.backend.domain.entity.channel.ChannelType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CreateChannelRequest {
	private Long userId;
	private String channelName;
	private ChannelType type;
}
