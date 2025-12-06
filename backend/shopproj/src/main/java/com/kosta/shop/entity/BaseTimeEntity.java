package com.kosta.shop.entity;

import java.time.LocalDateTime;

import lombok.Getter;

@Getter
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public class BaseTimeEntity {
	 @CreatedDate
	    private LocalDateTime createdAt;

	    @LastModifiedDate
	    private LocalDateTime updatedAt;
}
