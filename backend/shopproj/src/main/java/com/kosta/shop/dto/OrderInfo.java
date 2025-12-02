package com.kosta.shop.dto;

import java.sql.Date;

public class OrderInfo {
	private Integer num;
	private String userid;
	private String orderName;
	private String post;
	private String addr1;
	private String addr2;
	private String phone;
	private String payMethod;
	private Date oderDay;
	public Integer getNum() {
		return num;
	}
	public void setNum(Integer num) {
		this.num = num;
	}
	public String getUserid() {
		return userid;
	}
	public void setUserid(String userid) {
		this.userid = userid;
	}
	public String getOrderName() {
		return orderName;
	}
	public void setOrderName(String orderName) {
		this.orderName = orderName;
	}
	public String getPost() {
		return post;
	}
	public void setPost(String post) {
		this.post = post;
	}
	public String getAddr1() {
		return addr1;
	}
	public void setAddr1(String addr1) {
		this.addr1 = addr1;
	}
	public String getAddr2() {
		return addr2;
	}
	public void setAddr2(String addr2) {
		this.addr2 = addr2;
	}
	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}
	public String getPayMethod() {
		return payMethod;
	}
	public void setPayMethod(String payMethod) {
		this.payMethod = payMethod;
	}
	public Date getOderDay() {
		return oderDay;
	}
	public void setOderDay(Date oderDay) {
		this.oderDay = oderDay;
	}
	@Override
	public String toString() {
		return "OrderInfo [num=" + num + ", userid=" + userid + ", orderName=" + orderName + ", post=" + post
				+ ", addr1=" + addr1 + ", addr2=" + addr2 + ", phone=" + phone + ", payMethod=" + payMethod
				+ ", oderDay=" + oderDay + "]";
	}
}
