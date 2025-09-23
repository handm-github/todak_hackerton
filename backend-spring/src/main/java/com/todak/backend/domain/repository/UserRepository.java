package com.todak.backend.domain.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.todak.backend.domain.entity.user.User;
import com.todak.backend.domain.entity.user.UserRole;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

	boolean existsByUsername(String username);

	Optional<User> findByUsernameAndPw(String username, String pw);
	List<User> findByRole(UserRole role);
}
