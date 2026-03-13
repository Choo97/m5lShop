package com.kosta.shop.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.data.redis.listener.adapter.MessageListenerAdapter;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import com.kosta.shop.service.RedisSubscriber;

@Configuration
public class RedisConfig {

    // 1. 단일 토픽 설정 (모든 채팅 메시지는 이 "chatroom" 확성기로 모입니다)
    @Bean
    public ChannelTopic channelTopic() {
        return new ChannelTopic("chatroom");
    }

    // 2. Redis Message Listener 설정 (이벤트가 발생하면 캐치하는 역할)
    @Bean
    public RedisMessageListenerContainer redisMessageListener(
            RedisConnectionFactory connectionFactory,
            MessageListenerAdapter listenerAdapter,
            ChannelTopic channelTopic) {
        
        RedisMessageListenerContainer container = new RedisMessageListenerContainer();
        container.setConnectionFactory(connectionFactory);
        // "chatroom" 토픽에서 메시지가 오면 listenerAdapter를 실행해라!
        container.addMessageListener(listenerAdapter, channelTopic);
        return container;
    }

    // 3. 메시지를 받아서 처리할 클래스와 메소드 지정
    @Bean
    public MessageListenerAdapter listenerAdapter(RedisSubscriber subscriber) {
        // RedisSubscriber 클래스의 "sendMessage" 메소드를 실행하라는 뜻
        return new MessageListenerAdapter(subscriber, "sendMessage");
    }

    // 4. 어플리케이션에서 사용할 RedisTemplate 설정 (직렬화 세팅)
    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(connectionFactory);
        
        // 메시지를 주고받을 때 깨지지 않도록 String으로 직렬화
        redisTemplate.setKeySerializer(new StringRedisSerializer());
        redisTemplate.setValueSerializer(new StringRedisSerializer());
        return redisTemplate;
    }
}