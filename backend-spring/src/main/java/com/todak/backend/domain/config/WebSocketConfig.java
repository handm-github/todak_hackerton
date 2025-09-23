package com.todak.backend.domain.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.server.support.HttpSessionHandshakeInterceptor;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

	@Override
	public void configureMessageBroker(MessageBrokerRegistry registry) {
		// 클라이언트 -> 서버로 메시지를 보낼 때 사용하는 경로
		registry.setApplicationDestinationPrefixes("/app");

		// 서버 -> 클라이언트로 메시지를 보낼 때 사용하는 경로
		registry.enableSimpleBroker("/topic");
	}

	@Override
	public void registerStompEndpoints(StompEndpointRegistry registry) {
		// 웹소켓 연결을 위한 엔드포인트
		registry.addEndpoint("/ws")
			.addInterceptors(new HttpSessionHandshakeInterceptor())
			.setAllowedOriginPatterns("*") // 모든 Origin 허용
			.withSockJS(); // SockJS 지원 활성화
	}
}
