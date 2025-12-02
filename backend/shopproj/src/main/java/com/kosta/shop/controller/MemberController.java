package com.kosta.shop.controller;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.kosta.shop.dto.Member;
import com.kosta.shop.service.MemberService;

@Controller
public class MemberController {
	
	@Autowired
	private MemberService memberService;
	
	@Autowired
	private HttpSession session;
	
	@RequestMapping("signUp")
	public String signUp() {
		return "signUpForm";
	}
	
	@RequestMapping(value="signUp", method=RequestMethod.POST)
	public ModelAndView signUp(Member member) {
		ModelAndView mav = new ModelAndView();
		mav.addObject("action", "회원가입");
		mav.setViewName("memberResult");
		try {
			memberService.signUp(member);
			mav.addObject("message", "회원가입 성공");
		} catch(Exception e) {
			e.printStackTrace();
			mav.addObject("message", "회원가입 실패");
		}
		return mav;
	}
	
	@ResponseBody
	@RequestMapping(value="/idCheck", produces = "text/plain;charset=UTF-8")
	public String idCheck(@RequestParam("id") String id, @RequestParam("pw") String pw) {
		try {
			if(memberService.idCheck(id)) {
				return "사용불가능";
			} else {
				return "사용가능";
			}
		} catch(Exception e) {
			e.printStackTrace();
			return "사용불가능";
		}
	}
	
	
	@RequestMapping(value="/login", method=RequestMethod.POST)
	public String login(@RequestParam("userid") String userid, @RequestParam("passwd") String passwd, Model model) {
		try {
			Member member = memberService.login(userid, passwd);
			member.setPasswd(null);
			session.setAttribute("user", member);
			return "redirect:/main";
		} catch(Exception e) {
			model.addAttribute("action", "로그인");
			model.addAttribute("message", e.getMessage());
			return "memberResult";
		}
	}
	
	@RequestMapping("/mypage")
	public String mypage() {
		return "mypage";
	}
	
	@RequestMapping(value="/updateMember", method=RequestMethod.POST)
	public String updateMember(Member member, Model model) {
		model.addAttribute("action", "회원정보수정");
		try {
			memberService.modifyMyPage(member);
			session.removeAttribute("user");
			model.addAttribute("message", "회원정보수정 성공");
		} catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("message", "회원정보수정 실패");
		}
		return "memberResult";
	}
	
	@RequestMapping("/logout")
	public String logout() {
		session.removeAttribute("user");
		return "index";
	}
}
