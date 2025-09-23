package com.todak.backend.domain.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.todak.backend.domain.entity.message.Message;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {


	@Query(
		value = "SELECT m FROM Message m JOIN FETCH m.user WHERE m.channel.id = :channelId",
		countQuery = "SELECT count(m) FROM Message m WHERE m.channel.id = :channelId"
	)
	Page<Message> findByChannelId(@Param("channelId") Long channelId, Pageable pageable);

}
