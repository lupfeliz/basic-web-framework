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
@Table(name="a0000_board")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder @ToString
public class Board implements Serializable {
  @Id
  @GeneratedValue(strategy=GenerationType.AUTO)
  private Long id;

  @Column(name = "num")
  private String num;

  @Column(name = "title")
  private String title;
  
  @Column(name = "user_id")
  private String userId;

  @Column(name = "user_nm")
  private String userNm;

  @Column(name = "contents")
  private String contents;

  @Column(name = "ctime")
  @Convert(converter = DateConverter.class)
  private String ctime;

  @Column(name = "utime")
  @Convert(converter = DateConverter.class)
  private String utime;
}