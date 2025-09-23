package com.todak.backend.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.todak.backend.domain.entity.user.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
}
