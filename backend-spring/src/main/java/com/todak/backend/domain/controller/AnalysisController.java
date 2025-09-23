package com.todak.backend.domain.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.todak.backend.domain.service.AnalysisService;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class AnalysisController {

	private final AnalysisService analysisService;

	@GetMapping("/report/monthly")
	public ResponseEntity<?> getAnalysisMonth(HttpSession session,
		@RequestParam(defaultValue = "2025") int year,
		@RequestParam(defaultValue = "9") int month){
		return ResponseEntity.ok(analysisService.getAnalysisMonth(session, year, month));
	}

}
