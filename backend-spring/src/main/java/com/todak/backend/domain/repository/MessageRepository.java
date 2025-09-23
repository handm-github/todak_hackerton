package com.todak.backend.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.todak.backend.domain.entity.message.Message;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
}
