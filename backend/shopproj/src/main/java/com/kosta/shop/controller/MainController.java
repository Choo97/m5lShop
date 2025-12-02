package com.kosta.shop.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.kosta.shop.dto.Goods;
import com.kosta.shop.service.GoodsService;

@Controller
public class MainController {
	
	@Autowired
	private GoodsService goodsService;
	
	@RequestMapping("/")
	public String index() {
		return "index";
	}
	
	@RequestMapping("/main")
	public ModelAndView main() {
		ModelAndView mav = new ModelAndView();
		try {
			List<Goods> goods = goodsService.goodsList();
			mav.addObject("goods", goods);
			mav.setViewName("shopMain");
		} catch(Exception e) {
			e.printStackTrace();
			mav.addObject("action", "상품목록 조회");
			mav.addObject("message", "상품목록 조회 실패");
			mav.setViewName("memberResult");
		}
		return mav;
	}

}
