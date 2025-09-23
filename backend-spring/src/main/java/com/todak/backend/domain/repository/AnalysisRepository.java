package com.todak.backend.domain.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.todak.backend.domain.entity.analysis.Analysis;

@Repository
public interface AnalysisRepository extends JpaRepository<Analysis, Long> {

	@Query("""
        SELECT 
            DAY(a.createdAt) AS day,
            SUM(CASE WHEN c.type = 'CHATBOT' AND a.anxietyScore >= 2 THEN 1 ELSE 0 END) AS chatbotCount,
            SUM(CASE WHEN c.type = 'EXPERT'  AND a.anxietyScore >= 2 THEN 1 ELSE 0 END) AS expertCount
        FROM Analysis a
        JOIN Channel c ON a.channelId = c.id
        WHERE YEAR(a.createdAt) = :year
          AND MONTH(a.createdAt) = :month
        GROUP BY DAY(a.createdAt)
        ORDER BY DAY(a.createdAt) DESC
    """)
	List<Object[]> getMonthlyReport(@Param("year") int year,
		@Param("month") int month);
}
