package com.todak.backend.domain.entity.analysis.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AnalysisRequest {
	private String content;
}
