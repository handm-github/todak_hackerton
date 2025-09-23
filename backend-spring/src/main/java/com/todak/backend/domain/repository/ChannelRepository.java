package com.todak.backend.domain.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.todak.backend.domain.entity.channel.Channel;
import com.todak.backend.domain.entity.user.User;

@Repository
public interface ChannelRepository extends JpaRepository<Channel, Long> {

	Optional<Channel> findByUserAndExpert(User user, User expert);
}
