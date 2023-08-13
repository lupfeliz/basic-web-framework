package my.was.mywas.user;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import my.was.mywas.util.DateConverter;

@Entity
@Table(name="a0000_user")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder @ToString
public class User implements Serializable {
  @Id
  @GeneratedValue(strategy=GenerationType.AUTO)
  private Long id;

  @Column(name = "user_id", length = 32, unique = true)
  private String userId;

  @Column(name = "user_nm", length = 32)
  private String userNm;

  @Column(name = "passwd", length = 128)
  private String passwd;

  @Column(name = "ctime")
  @Convert(converter = DateConverter.class)
  private String ctime;

  @Column(name = "utime")
  @Convert(converter = DateConverter.class)
  private String utime;
}