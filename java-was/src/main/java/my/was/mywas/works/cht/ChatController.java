/**
 * @File        : ChatController.java
 * @Author      : 정재백
 * @Since       : 2024-11-24
 * @Description : 채팅 컨트롤러
 * @Site        : https://devlog.ntiple.com
 **/

package my.was.mywas.works.cht;

import static com.ntiple.commons.StringUtil.cat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;

import lombok.extern.slf4j.Slf4j;

@Slf4j @Controller
public class ChatController {

  @Autowired private SimpMessageSendingOperations sender;

  @MessageMapping("/chat/{topic}")
  public void message(@DestinationVariable("topic") String topic, Message<?> msg) {
    log.debug("TEST:{}", msg);
    Chat ret = Chat.builder()
      .content("OK")
      .build();
    sender.convertAndSend(cat("/api/sub/chat/", topic), ret);
  }
}