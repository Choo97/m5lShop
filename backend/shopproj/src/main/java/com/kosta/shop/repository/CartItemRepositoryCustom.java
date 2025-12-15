package com.kosta.shop.repository;

import java.util.List;

import com.kosta.shop.dto.CartDetailDto;

public interface CartItemRepositoryCustom {
   
	List<CartDetailDto> findCartDetailDtoList(Long cartId);

}
