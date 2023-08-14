package my.was.mywas.util;

import jakarta.persistence.AttributeConverter;
import java.text.SimpleDateFormat;
import java.util.Date;

public class DateConverter implements AttributeConverter<String, Date> {

  private static final String FORMAT_DF = "yyyyMMddHHmmss";

  @Override public Date convertToDatabaseColumn(String data) { return strToDate(data); }
  @Override public String convertToEntityAttribute(Date data) { return dateToStr(data); }

  public static Date strToDate(String data) {
    try {
      return new SimpleDateFormat(FORMAT_DF).parse(data);
    } catch (Exception ignore) { }
    return null;
  }

  public static String dateToStr(Date data) {
    try {
      return new SimpleDateFormat(FORMAT_DF).format(data);
    } catch (Exception ignore) { }
    return "";
  }
}