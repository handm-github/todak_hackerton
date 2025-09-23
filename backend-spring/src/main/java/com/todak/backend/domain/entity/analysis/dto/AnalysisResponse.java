package com.todak.backend.domain.entity.analysis.dto;

import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class AnalysisResponse {
	private AnalysisData data;

	@Getter
	@NoArgsConstructor
	@AllArgsConstructor
	public static class AnalysisData {
		private int count;
		private String anxiety_score;
		private String depression_score;
		private Map<String, Integer> report;
	}
}
