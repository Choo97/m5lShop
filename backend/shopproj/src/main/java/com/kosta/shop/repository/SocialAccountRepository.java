package com.kosta.shop.repository;

import com.kosta.shop.entity.SocialAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SocialAccountRepository extends JpaRepository<SocialAccount, Long> {
    // 이미 연동된 계정인지 확인용
    Optional<SocialAccount> findByProviderAndProviderId(String provider, String providerId);

    List<SocialAccount> findByUserId(Long userId);

}