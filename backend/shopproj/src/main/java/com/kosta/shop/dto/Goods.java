package com.kosta.shop.dto;

public class Goods {
	private String gCode;
	private String gCategory;
	private String gName;
	private String gContent;
	private Integer gPrice;
	private String gImage;
	public String getgCode() {
		return gCode;
	}
	public void setgCode(String gCode) {
		this.gCode = gCode;
	}
	public String getgCategory() {
		return gCategory;
	}
	public void setgCategory(String gCategory) {
		this.gCategory = gCategory;
	}
	public String getgName() {
		return gName;
	}
	public void setgName(String gName) {
		this.gName = gName;
	}
	public String getgContent() {
		return gContent;
	}
	public void setgContent(String gContent) {
		this.gContent = gContent;
	}
	public Integer getgPrice() {
		return gPrice;
	}
	public void setgPrice(Integer gPrice) {
		this.gPrice = gPrice;
	}
	public String getgImage() {
		return gImage;
	}
	public void setgImage(String gImage) {
		this.gImage = gImage;
	}
	@Override
	public String toString() {
		return "Goods [gCode=" + gCode + ", gCategory=" + gCategory + ", gName=" + gName + ", gContent=" + gContent
				+ ", gPrice=" + gPrice + ", gImage=" + gImage + "]";
	}
}
