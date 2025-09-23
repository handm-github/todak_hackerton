package com.todak.backend.domain.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.todak.backend.domain.entity.channel.Channel;
import com.todak.backend.domain.entity.channel.ChannelType;
import com.todak.backend.domain.entity.user.User;

@Repository
public interface ChannelRepository extends JpaRepository<Channel, Long> {

	Optional<Channel> findByUserAndExpert(User user, User expert);

	@Query("SELECT c FROM Channel c WHERE (c.user = :user OR c.expert = :user) AND c.type = :type")
	Page<Channel> findByUserOrExpertAndType(User user,User expert, ChannelType type, Pageable pageable);
}
