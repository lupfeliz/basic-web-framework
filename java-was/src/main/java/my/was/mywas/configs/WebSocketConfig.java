/**
 * @File        : WebSocketConfig.java
 * @Author      : 정재백
 * @Since       : 2024-11-24
 * @Description : WebSocket 설정파일
 * @Site        : https://devlog.ntiple.com
 **/

package my.was.mywas.configs;

import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocket
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override public void configureMessageBroker(@NonNull MessageBrokerRegistry registry) {
      /** 클라이언트에서 보낸 메세지를 받을 prefix */
      registry.setApplicationDestinationPrefixes("/api/pub")
        ;
      /** 해당 주소를 구독하고 있는 클라이언트들에게 메세지 전달 */
      registry.enableSimpleBroker("/api/sub")
        ;
    }

    @Override public void registerStompEndpoints(@NonNull StompEndpointRegistry registry) {
      /** SockJS 연결주소 : ws://localhost:8080/api/ws */
      registry.addEndpoint("/api/ws")
        .setAllowedOriginPatterns("*")
        /** 버전 낮은 브라우저에서도 적용 가능 */
        .withSockJS()
        .setSuppressCors(true)
        ;
    }
}
