package com.todak.backend.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.todak.backend.domain.entity.analysis.Analysis;

@Repository
public interface AnalysisRepository extends JpaRepository<Analysis, Long> {
}
