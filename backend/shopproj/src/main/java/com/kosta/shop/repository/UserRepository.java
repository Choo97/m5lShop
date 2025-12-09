package com.kosta.shop.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kosta.shop.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
	Optional<User> findByProviderIdAndProvider(String providerId, String provider);

	Optional<User> findByEmail(String email);
}
