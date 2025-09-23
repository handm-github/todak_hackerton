package com.todak.backend.domain.entity.analysis;

import com.todak.backend.domain.entity.common.Timestamped;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Analysis extends Timestamped {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "channel_id", nullable = false)
	private Long channelId;

	@Column(name = "message_id", nullable = false)
	private Long messageId;

	@Column(name = "content", columnDefinition = "json")
	private String content;

	@Column(name = "anxiety_score")
	private Double anxietyScore;

	@Column(name = "depression_score")
	private Double depressionScore;
}
