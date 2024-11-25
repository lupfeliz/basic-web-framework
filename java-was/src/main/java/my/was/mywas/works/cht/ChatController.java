/**
 * @File        : ChatController.java
 * @Author      : 정재백
 * @Since       : 2024-11-24
 * @Description : 채팅 컨트롤러
 * @Site        : https://devlog.ntiple.com
 **/

package my.was.mywas.works.cht;

import static com.ntiple.commons.ConvertUtil.newMap;
import static com.ntiple.commons.ReflectionUtil.cast;
import static com.ntiple.commons.StringUtil.cat;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;
import org.springframework.util.MultiValueMap;

import lombok.extern.slf4j.Slf4j;
import my.was.mywas.commons.TokenProvider;

@Slf4j @Controller
public class ChatController {

  @Autowired private SimpMessageSendingOperations sender;
  @Autowired private TokenProvider tokenProvider;

  @MessageMapping("/chat/{channel}")
  public void message(@DestinationVariable("channel") String channel, Message<?> msg) {
    
    MultiValueMap<String, List<Object>> headers = cast(msg.getHeaders().get("nativeHeaders"), headers = null);
    if (headers != null) {
      log.debug("TEST:{} / {}", channel, headers.get("test"), msg);
    }
    
    Chat ret = Chat.builder()
      .content(cat("OK:", channel))
      .build();
    sender.convertAndSend(cat("/api/sub/chat/", channel), ret);
  }

  @MessageMapping("/user/{userId}")
  public void user(@DestinationVariable("userId") String userId, Message<?> msg) {
    log.debug("TEST:{} / {}", userId, msg);
    Map<String, Object> map = newMap();
    sender.convertAndSend(cat("/api/sub/user/", userId), map);
  }
}