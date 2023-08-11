package my.was.mywas.common;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder @ToString
public class Search {
  public static final int PAGES_DEF = 5;
  public static final int ROWS_DEF = 10;
  public static final int PAGES_MINV = 5;
  public static final int PAGES_MAXV = 10;
  public static final int ROWS_MINV = 10;
  public static final int ROWS_MAXV = 30;

  @Builder.Default
  @NotNull(message = "MUST NOT NULL")
  private String searchType = "";
  private String searchStr;
  private String orderType;
  @Builder.Default
  @Min(value = 0, message = "MUST BIGGER THAN -1")
  private int page = 0;
  @Builder.Default
  @Max(value = PAGES_MAXV, message = "MUST LESS THAN 11")
  @Min(value = PAGES_MINV, message = "MUST BIGGER THAN 4")
  private int pages = PAGES_MINV;
  @Builder.Default
  @Max(value = ROWS_MAXV, message = "MUST LESS THAN 31")
  @Min(value = ROWS_MINV, message = "MUST BIGGER THAN 9")
  private int rows = ROWS_MINV;
}