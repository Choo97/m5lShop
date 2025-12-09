package com.kosta.shop.entity.convertor;

// converter/RrnConverter.java
import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

import com.kosta.shop.util.AesUtil;

import lombok.RequiredArgsConstructor;

@Converter
@RequiredArgsConstructor
public class RrnConverter implements AttributeConverter<String, String> {

    private final AesUtil aesUtil; // 위에서 만든 유틸

    @Override
    public String convertToDatabaseColumn(String attribute) {
        // DB에 저장할 때 (암호화)
        if (attribute == null) return null;
        return aesUtil.encrypt(attribute);
    }

    @Override
    public String convertToEntityAttribute(String dbData) {
        // DB에서 꺼낼 때 (복호화)
        if (dbData == null) return null;
        return aesUtil.decrypt(dbData);
    }
}
