package my.was.mywas.board;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import my.was.mywas.util.DateConverter;

@Entity
@Table(name = "a0000_board")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder @ToString
public class Board implements Serializable {
  @Id
  @GeneratedValue(strategy=GenerationType.AUTO)
  private Long id;

  @Column(name = "num", length = 32)
  private String num;

  @Column(name = "title", length = 128)
  private String title;
  
  @Column(name = "user_id", length = 32)
  private String userId;

  @Column(name = "user_nm", length = 32)
  private String userNm;

  @Column(name = "contents", length = 99999)
  private String contents;

  @Column(name = "ctime")
  @Convert(converter = DateConverter.class)
  private String ctime;

  @Column(name = "utime")
  @Convert(converter = DateConverter.class)
  private String utime;
}