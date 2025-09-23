package com.todak.backend.domain.service;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.todak.backend.domain.repository.AnalysisRepository;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AnalysisService {

	private final AnalysisRepository analysisRepository;

	public Map<String, Object> getAnalysisMonth(HttpSession session, int year, int month) {
		List<Object[]> rows = analysisRepository.getMonthlyReport(year, month);

		Map<String, Object> data = new LinkedHashMap<>();
		for (Object[] row : rows) {
			int day       = ((Number) row[0]).intValue();
			long chatbot  = ((Number) row[1]).longValue();
			long expert   = ((Number) row[2]).longValue();

			Map<String, Object> dayMap = new HashMap<>();
			dayMap.put("chatbot", chatbot);
			dayMap.put("expert", expert);

			data.put("day" + day, dayMap);
		}
		return Map.of("data", data);
	}
}
