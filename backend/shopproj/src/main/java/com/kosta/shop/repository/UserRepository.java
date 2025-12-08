package com.kosta.shop.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kosta.board.entity.User;

public interface UserRepository extends JpaRepository<User, String> {
	Optional<User> findByProviderIdAndProvider(String providerId, String provider);
}
