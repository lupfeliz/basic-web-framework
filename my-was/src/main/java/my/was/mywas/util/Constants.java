package my.was.mywas.util;

import java.util.LinkedHashMap;
import java.util.Map;

public interface Constants {
  static final Map<String, Object> EMPTY_MAP = new LinkedHashMap<>();
  static final String UTF8 = "UTF-8";
  static final String PBKDF2WithHmacSHA1 = "PBKDF2WithHmacSHA1";
  static final String AES = "AES";
  static final String AES_CBC_PKCS5Padding = "AES/CBC/PKCS5Padding";

  static final String HC_DEF_AES_PASSPHRASE = "e534cf179007db7e6360ebf95fa5d51c";
  static final String HC_DEF_AES_SALT = "deafa8b6802cebcc0bcceaaa5f3461a9"; 
  static final String HC_DEF_AES_IV = "e9d3712c4d5c35093d340733b8c26b92";
}
