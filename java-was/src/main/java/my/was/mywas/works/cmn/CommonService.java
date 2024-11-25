/**
 * @File        : CommonService.java
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 공통 서비스, 환경정보 및 암복호화 키 교환 등을 담당한다.
 * @Site        : https://devlog.ntiple.com
 **/
package my.was.mywas.works.cmn;

import static com.ntiple.commons.Constants.UTF8;
import static com.ntiple.commons.ConvertUtil.isPrimeType;
import static com.ntiple.commons.ReflectionUtil.cast;
import static com.ntiple.commons.ReflectionUtil.EMPTY_CLS;
import static com.ntiple.commons.ReflectionUtil.EMPTY_OBJ;
import static com.ntiple.commons.StringUtil.capitalize;
import static com.ntiple.commons.StringUtil.cat;
import static com.ntiple.commons.WebUtil.curRequest;
import static my.was.mywas.commons.Constants.AUTHORIZATION;
import static my.was.mywas.commons.Constants.BEARER;
import static my.was.mywas.commons.Constants.KOKR;
import static my.was.mywas.commons.Constants.RESCD_FAIL;
import static my.was.mywas.commons.Constants.RESCD_OK;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ntiple.commons.CryptoUtil.AES;
import com.ntiple.commons.CryptoUtil.RSA;

import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import my.was.mywas.commons.CommonEntity.InitObj;
import my.was.mywas.commons.CommonEntity.Result;
import my.was.mywas.commons.CommonEntity.SecureOut;
import my.was.mywas.commons.SystemSettings;

@Slf4j @Service
public class CommonService {

  private static CommonService instance;

  @Autowired private SystemSettings settings;

  @Autowired private CommonRepository repository;

  // @Autowired private SimpMessageSendingOperations sender;

  @PostConstruct public void init() {
    log.trace("INIT:{}", CommonService.class);
    instance = this;
  }

  public static CommonService getInstance() {
    return instance;
  }

  /** 시스템 활성화 여부 체크 */
  public Result cmn00000000() throws Exception {
    String rescd = RESCD_OK;
    if (!settings.isAlive()) { rescd = RESCD_FAIL; }
    Result ret = Result.builder()
      .rescd(rescd)
      .build();
    return ret;
  }

  /** 최초 접속 환경정보 조회 */
  public InitObj cmn01001a01() throws Exception {
    long timestamp = System.currentTimeMillis();
    JSONObject objkey = new JSONObject();
    objkey.put("k", settings.getKeySecret());
    objkey.put("t", timestamp);

    // {
    //   String channel = "test2";
    //   Chat ret = Chat.builder()
    //     .content(cat("OK:", channel))
    //     .build();
    //   sender.convertAndSend(cat("/api/sub/chat/", channel), ret);
    // }

    return InitObj.builder()
      .current(new Date(timestamp))
      .locale(KOKR)
      .encoding(UTF8)
      .expirecon(settings.getExprAcc())
      .check(rsaEncrypt(String.valueOf(objkey)))
      .build();
  }

  /** DB 암호화 */
  public String dbEncrypt(String value) {
    return repository.dbEncrypt(value);
  }

  /** AES 암호화 */
  public String aesEncrypt(String value) {
    try {
      return AES.encrypt(settings.getKeySecret(), value);
    } catch (Exception e) {
      log.debug("E:{}", e.getMessage());
    }
    return "";
  }

  /** AES 복호화 */
  public String aesDecrypt(String value) {
    try {
      return AES.decrypt(settings.getKeySecret(), value);
    } catch (Exception e) {
      log.debug("E:{}", e.getMessage());
    }
    return "";
  }

  /** RSA 암호화 (AES 키 전송용) */
  public String rsaEncrypt(String value) {
    try {
      return RSA.encrypt(0, settings.getKeyPrivate(), value);
    } catch (Exception e) {
      log.debug("E:{}", e.getMessage());
    }
    return "";
  }

  /** RSA 복호화 (AES 키 전송용) */
  public String rsaDecrypt(String value) {
    try {
      return RSA.decrypt(0, settings.getKeyPrivate(), value);
    } catch (Exception e) {
      log.debug("E:{}", e.getMessage());
    }
    return "";
  }

  static final String PTN_SCHEM_HTTP = "^http[s]{0,1}[:][/][/]";

  /** 토큰정보 읽어오기 */
  public static String getAuthToken() { return getAuthToken(curRequest(HttpServletRequest.class)); }
  public static String getAuthToken(HttpServletRequest req) {
    String hval = req.getHeader(AUTHORIZATION);
    log.trace("AUTH-HEADER:{}", hval);
    if (hval != null && hval.startsWith(BEARER) && hval.length() > BEARER.length() + 2) {
      return hval.substring(BEARER.length() + 1);
    }
    return null;
  }

  /** @SecureOut 으로 어노테이션 된 필드는 RestResponse 에서 삭제되도록 처리 */
  public static <T> T secureOut(T prm) {
    if (prm == null) { return prm; }
    T ret = prm;
    Class<?> cls = prm.getClass();
    if (isPrimeType(cls)) { return prm; }
    log.trace("CHECK1:{} : {}", cls.getSimpleName(), cls.isAnnotationPresent(SecureOut.class));
    if (cls.isAnnotationPresent(SecureOut.class)) {
      Field[] fields = cls.getDeclaredFields();
      for (Field field : fields) {
        log.trace("CHECK2:{}.{} : {}", cls.getSimpleName(), field.getName(), field.isAnnotationPresent(SecureOut.class));
        if (field.isAnnotationPresent(SecureOut.class)) {
          try {
            Method setter = cls.getDeclaredMethod(cat("set", capitalize(field.getName())), field.getType());
            if (setter != null) {
              setter.invoke(prm, new Object[]{ null });
            }
          } catch (Exception ignore) { }
        } else {
          Object val = null;
            Method mtd = null;
            try {
              mtd = cls.getMethod(cat("get", capitalize(field.getName())), EMPTY_CLS);
              if (mtd != null) { val = mtd.invoke(prm, EMPTY_OBJ); }
            } catch (Exception e) {
              log.debug("E:{}", e);
            }
          if (val != null) {
            if (val instanceof List) {
              List<?> list = cast(val, list = null);
              for (Object itm : list) {
                secureOut(itm);
              }
            } else if (val instanceof Map) {
              Map<String, Object> map = cast(val, map = null);
              for (String key : map.keySet()) {
                secureOut(map.get(key));
              }
            } else {
              secureOut(val);
            }
          }
        }
      }
    }
    return ret;
  }
}
