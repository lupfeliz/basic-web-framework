/**
 * @File        : Chat.java
 * @Author      : 정재백
 * @Since       : 2024-11-24
 * @Description : 채팅 DTO
 * @Site        : https://devlog.ntiple.com
 **/

package my.was.mywas.works.cht;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Chat {
  private String content;
}