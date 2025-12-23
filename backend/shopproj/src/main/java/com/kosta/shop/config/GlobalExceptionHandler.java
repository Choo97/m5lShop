package com.kosta.shop.config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import javax.persistence.EntityNotFoundException;

// ★ 이 어노테이션이 "전역 예외 처리기"임을 선언합니다.
@RestControllerAdvice 
public class GlobalExceptionHandler {

    // 1. 특정 에러(EntityNotFoundException)가 터지면 얘가 잡습니다.
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<String> handleNotFound(EntityNotFoundException e) {
        // 클라이언트에게 404 상태코드와 에러 메시지를 보냄
        return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
    }

    // 2. 위에서 안 잡힌 나머지 모든 에러(Exception)는 얘가 잡습니다. (최후의 보루)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleAll(Exception e) {
        e.printStackTrace(); // 서버 로그에는 에러 내용을 남겨야 함
        return new ResponseEntity<>("알 수 없는 오류가 발생했습니다.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
}