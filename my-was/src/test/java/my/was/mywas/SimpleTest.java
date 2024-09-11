package my.was.mywas;

import static com.ntiple.commons.Constants.UTF8;
import static com.ntiple.commons.ConvertUtil.cast;
import static org.junit.jupiter.api.Assertions.*;

import java.io.File;
import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.SecureRandom;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.RSAPrivateKeySpec;
import java.security.spec.RSAPublicKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Base64;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import javax.xml.parsers.SAXParser;
import javax.xml.parsers.SAXParserFactory;

import org.junit.jupiter.api.Test;

import com.ntiple.commons.Constants;
import com.ntiple.commons.CryptoUtil;
import com.ntiple.commons.CryptoUtil.AES;
import com.ntiple.commons.CryptoUtil.RSA;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;
import lombok.extern.slf4j.Slf4j;
import my.was.mywas.TestUtil.TestLevel;
import my.was.mywas.commons.JPAExtender;
import my.was.mywas.commons.JPAExtender.OrmXmlHandler;

@Slf4j @SuppressWarnings("static-access")
public class SimpleTest {

  @Test public void testSimple() {
    log.debug("OK");
  }

  @Test public void testJpa() {
    if (!TestUtil.isEnabled("testJpa", TestLevel.MANUAL)) { return; }
    final EntityManagerFactory emf = Persistence.createEntityManagerFactory("default", Map.of());
    final EntityManager em = emf.createEntityManager();
    log.debug("PROPS:{}", em.getProperties());
    // ArticleRepository repo = TestUtil.simpleJpaRepository(em, ArticleRepository.class);
    // Article board = repo.findOneByIdEquals(1L);
    // log.debug("BOARD:{}", board);
  }

  @SuppressWarnings("null")
  @Test public void testJpa2() {
    if (!TestUtil.isEnabled("testJpa2", TestLevel.MANUAL)) { return; }
    final EntityManagerFactory emf = Persistence.createEntityManagerFactory("default", Map.of());
    final EntityManager em = emf.createEntityManager();
    log.debug("PROPS:{}", em.getProperties());
    // ArticleRepository repo = TestUtil.simpleJpaRepository(em, ArticleRepository.class);
    // Article board = null;
    // board = Article.builder()
    //   .id(2L)
    //   .num("2")
    //   .boardId(1L)
    //   .title("article2")
    //   .contents("content2")
    //   .userId("userid")
    //   .userNm("usernm")
    //   .ctime(new Date())
    //   .utime(new Date())
    //   .build();
    // repo.save(board);
  }

  @Test public void testJpa3() {
    if (!TestUtil.isEnabled("testJpa3", TestLevel.MANUAL)) { return; }
    final EntityManagerFactory emf = Persistence.createEntityManagerFactory("jpa-test", Map.of());
    final EntityManager em = emf.createEntityManager();
    log.debug("PROPS:{}", em.getProperties());
    // ArticleRepository repo = TestUtil.simpleJpaRepository(em, ArticleRepository.class);
    // List<Article> list = repo.findByTitleContains("테스트");
    // for (Article article : list) {
    //   log.debug("ARTICLE:{}", article);
    // }
  }

  @Test public void testCrypto() throws Exception {
    if (!TestUtil.isEnabled("testCrypto", TestLevel.MANUAL)) { return; }
    Constants C = null;
    String[] keystr = { "", "" };
    String plaintext = "";
    String encrypted = "";
    String decrypted = "";
    // {
    //   keystr[0] = AES.generateKeyStr("test001", "aaaa", 10000, 128);
    //   log.debug("KEY-AES:{}{}", "", keystr);
    //   plaintext = "테스트";
    //   encrypted = AES.encrypt(keystr[0], plaintext);
    //   log.debug("ENCRYPT-AES:{}", encrypted);
    //   decrypted = AES.decrypt(keystr[0], encrypted);
    //   log.debug("DECRYPT-AES:{}", decrypted);
    //   assertEquals(decrypted, plaintext);
    // }
    {
      keystr = RSA.generateKeyStrs(1024);
      log.debug("RSA-KEY-PRIVATE:{}", keystr[0]);
      log.debug("RSA-KEY-PUBLIC:{}", keystr[1]);
      plaintext = "테스트";
      encrypted = RSA.encrypt(0, keystr[0], plaintext);
      log.debug("ENCRYPT-RSA:{}", encrypted);
      decrypted = RSA.decrypt(1, keystr[1], encrypted);
      log.debug("DECRYPT-RSA:{}", decrypted);
      assertEquals(decrypted, plaintext);
      encrypted = RSA.encrypt(1, keystr[1], plaintext);
      log.debug("ENCRYPT-RSA:{}", encrypted);
      decrypted = RSA.decrypt(0, keystr[0], encrypted);
      log.debug("DECRYPT-RSA:{}", decrypted);
      assertEquals(decrypted, plaintext);
    }
    // {
    //   keystr[0] = "QlrgH3V7fxrdkZ2g79kNcw==";
    //   plaintext = "123a";
    //   encrypted = AES.encrypt(keystr[0], plaintext);
    //   log.debug("ENCRYPT-AES:{}", encrypted);
    //   decrypted = AES.decrypt(keystr[0], encrypted);
    //   log.debug("DECRYPT-AES:{}", decrypted);
    //   assertEquals(decrypted, plaintext);
    // }
    // {
    //   keystr[0] = "abc123";
    //   plaintext = "plaintext message";
    //   byte[] keybuf = Arrays.copyOf(keystr[0].getBytes(UTF8), 16);
    //   Key key = new SecretKeySpec(keybuf, C.AES);
    //   encrypted = AES.encrypt(key, plaintext);
    //   log.debug("KEY:{}", Base64.getEncoder().encodeToString(keybuf));
    //   log.debug("ENCRYPT-AES:{}", encrypted);
    //   // decrypted = AES.decrypt(keystr[0], encrypted);
    //   // log.debug("DECRYPT-AES:{}", decrypted);
    //   // assertEquals(decrypted, plaintext);
    // }
    // {
    //   keystr[0] = "MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAJ7hSaVDpxLfO89qow1kztJsojeGVDrQtujnTkgy2wvk78yXi1a17nhpOXEVwztxqg07YPIL1J8PGhmUHG6MvUyxjTus7oVJfhRD1/yq2RtEzF+Vi5KuadmORJuWjz9miVTP79KqdzEvCyVAkd/3S7kcwyNRgII8/zwMSwxvSi0PAgMBAAECgYAAtTsz+tA/OuQwkyHJtpU4987WybhZI2iut56dNqsq8BXSHqY6WXqfrFJILwdTd/HMkeyWynm0Q87eicCnDMjcjJS7kHtNkF5AfrvKvdIAZVyFlbwMLy+KPiaq2dkoa/Z3mml2ld2cs7g77UuxyrNSjl7lYOYxkcIAcSFJsZqW2QJBAKMZ0rK78Gw5lEyFUzrGx0lXHAP9rO13zXIkbGRscJ+wqFzUChWY0KmUZCh4xpHeTagFGykPuq0A/0Lq0UyQMCcCQQD5YAMtrfBn9P14eb5hDYL8v2vEdno5QbUKKwb0DEPVoshZTXaJbcfrZAFCP+uLgrBppcEJPWBnLreAHqcG4UTZAkBPhLeFDLwbB7eV1yrM7T0cNKwkBfnZjR9NFxUBoR0HvklXeMmx3d9dzktGsBuf4pJZ6KNlUZXh4yqQpYuFmIbhAkEAj3PP4EMi/GpONTOzdJkVNNfY4pdVEALgZg0CXvl/PDH8FoMdIUlpq9tHbhjfIs33NY8IUIxiHHkfTjBT3P1RYQJAbFbaqUc7rfeKkAFOhS6AvnhEgwQtD5GuJsx8pC7Q06BwZ/40d9EMyh2QNoSxzuspzHvPicZFhoW1soRnppHNWQ==";
    //   keystr[1] = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCe4UmlQ6cS3zvPaqMNZM7SbKI3hlQ60Lbo505IMtsL5O/Ml4tWte54aTlxFcM7caoNO2DyC9SfDxoZlBxujL1MsY07rO6FSX4UQ9f8qtkbRMxflYuSrmnZjkSblo8/ZolUz+/SqncxLwslQJHf90u5HMMjUYCCPP88DEsMb0otDwIDAQAB";
    //   plaintext = "QlrgH3V7fxrdkZ2g79kNcw==";
    //   encrypted = "cyMUmyvyPdXtfjqgW8IKL6zCHQA1i9puqPnshYD+vwLEhGkUDGO0olU5JW0avFiqcRKFNBIewsPFssuKKyyYbOuVwHetNbC1RObUo6pk7N3f6Nytaw//uVMsasMbiF0IJKHvSu2dO3waJSnyDTm9eSc/x/zo2lTPJpWZwuGkcD4=";
    //   decrypted = RSA.decrypt(1, keystr[1], encrypted);
    //   PublicKey publicKey = cast(RSA.key(1, keystr[1]), publicKey = null);
    //   PrivateKey privateKey = cast(RSA.key(0, keystr[0]), privateKey = null);
    //   KeyFactory keyFactory = KeyFactory.getInstance("RSA");
    //   RSAPublicKeySpec publicSpec = (RSAPublicKeySpec) keyFactory.getKeySpec(publicKey, RSAPublicKeySpec.class);
    //   RSAPrivateKeySpec privateSpec = (RSAPrivateKeySpec) keyFactory.getKeySpec(privateKey, RSAPrivateKeySpec.class);
    //   BigInteger publicModulus = publicSpec.getModulus();
    //   BigInteger publicExponent = publicSpec.getPublicExponent();
    //   BigInteger privateModulus = privateSpec.getModulus();
    //   BigInteger privateExponent = privateSpec.getPrivateExponent();
    //   log.debug("MODULES:{} / EXPONENT:{}", publicModulus.toString(16), publicExponent.toString(16));
    //   log.debug("MODULES:{} / EXPONENT:{}", privateModulus.toString(16), privateExponent.toString(16));
    //   log.debug("DECRYPT-RSA:{}", decrypted);
    //   BigInteger ptest = stringCipher(plaintext);
    //   log.debug("MESSAGE:{}", ptest.toString(16));
    //   log.debug("MESSAGE:{}", cipherToString(ptest));
    //   BigInteger a = ptest.modPow(privateExponent, privateExponent);
    //   BigInteger b = a.modPow(publicModulus, publicExponent);
    //   log.debug("MESSAGE:{}", b.toString(16));
    //   log.debug("MESSAGE:{}", cipherToString(b));
    //   // BigInteger message = new BigInteger(Base64.getDecoder().decode(encrypted));
    //   // // log.debug("MESSAGE:{}", message);
    //   // BigInteger dmessage = message.modPow(publicModulus, publicExponent);
    //   // // BigInteger test = message.modPow(privateModulus, privateExponent);
    //   // log.debug("MESSAGE:{}", message);
    //   // log.debug("MESSAGE:{}", dmessage);
    //   // log.debug("MESSAGE:{}", cipherToString(dmessage));
    // }
  }

  public static BigInteger stringCipher(String message) {
    message = message.toUpperCase();
    String cipherString = "";
    for (int inx = 0; inx < message.length(); inx++) {
      cipherString = cipherString + ((int) message.charAt(inx));
    }
    BigInteger cipherBig = new BigInteger(String.valueOf(cipherString));
    return cipherBig;
  }

  public static String cipherToString(BigInteger message) {
    String cipherString = message.toString();
    String output = "";
    for (int inx = 0; inx < cipherString.length(); inx += 2) {
      int temp = Integer.parseInt(cipherString.substring(inx, inx + 2));
      char ch = (char) temp;
      output = output + ch;
    }
    return output;
  }

  @Test public void testQueryAccess() throws Exception {
    if (!TestUtil.isEnabled("testQueryAccess", TestLevel.MANUAL)) { return; }
    String path = "";
    path = JPAExtender.class.getClassLoader()
        .getResource("mappings").getFile();
    log.debug("CHECK:{}", path);
    path = JPAExtender.class.getClassLoader()
        .getResource("mappings/orm-user.xml").getFile();
    log.debug("CHECK:{}", path);
    SAXParserFactory spf = SAXParserFactory.newInstance();
    spf.setNamespaceAware(true);
    SAXParser parser = spf.newSAXParser();
    Map<String, String> quries = new LinkedHashMap<>();
    parser.parse(new File(path), new OrmXmlHandler(quries));

    // Class<?> cls = JPAExtender.class;
    // int depth = cls.getPackage().getName().split("[.]").length;
    // log.debug("CHECK:{}", "../".repeat(depth));
    // openResourceStream(JPAExtender.class, null)
  }

  @Test String[] jwtSecurityKeyGenTest() throws Exception {
    if (!TestUtil.isEnabled("jwtSecurityKeyGenTest", TestLevel.SIMPLE)) { return null; }
    String algorithm = SignatureAlgorithm.HS512.getJcaName();
    log.info("ALGORITHM:{}", algorithm);
    KeyGenerator keyGen = KeyGenerator.getInstance(algorithm);
    SecretKey key = keyGen.generateKey();
    // key = Keys.hmacShaKeyFor("제블로그에오신여러분을환영합니다".getBytes(UTF8));
    String secret = Base64.getEncoder().encodeToString(key.getEncoded());
    String token = Jwts.builder()
        .setSubject("subject")
        .claim("auth", "ROLE_AUTH,ROLE_BOARD_WRITE")
        .signWith(key, SignatureAlgorithm.HS512)
        .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60))
        .compact();

    Claims claims = Jwts
        .parserBuilder()
        .setSigningKey(key)
        .build()
        .parseClaimsJws(token)
        .getBody();

    log.info("KEY:{}", secret);
    log.info("TOKEN:{}", token);
    log.info("CLAIMS:{}", claims);
    assertTrue(true);
    return new String[] {
        secret,
        token
    };
  }

  @Test public void jwtSecurityDecryptTest() throws Exception {
    if (!TestUtil.isEnabled("jwtSecurityDecryptTest", TestLevel.SIMPLE)) { return; }
    String[] res = this.jwtSecurityKeyGenTest();
    String secret = res[0];
    String token = res[1];
    SecretKey key = Keys.hmacShaKeyFor(Base64.getDecoder().decode(secret));
    Claims claims = Jwts
        .parserBuilder()
        .setSigningKey(key)
        .build()
        .parseClaimsJws(token)
        .getBody();

    log.info("KEY:{}", Base64.getEncoder().encode(key.getEncoded()));
    log.info("TOKEN:{}", token);
    log.info("CLAIMS:{}", claims);
    assertTrue(true);
  }

  @Test public void testSimpleRSA() throws Exception {
    if (!TestUtil.isEnabled("testSimpleRSA", TestLevel.SIMPLE)) { return; }
    // {
    //   String sig, enc, dec, pln;
    //   String prvk = "MIIBNgIBADANBgkqhkiG9w0BAQEFAASCASAwggEcAgEAAoGBAJo+bwVoghs7lEOlXXCEJp9V0EHF7PPR1fp3/r9Cv/i1blxfYYKue+SdLje0UO6eWqpwqrKA9liL0NlpPqUoGd3EovKtf8ll55x+FPeEJ+vKaYmsDF3AQ7TrYK++/unRdOmWGv05CpM5gz7QYcsqqxfuR9Rk+sVV+ZrUCLzXUXFtAgEAAoGANoIljM0hZ18bk/JwYgDiHaAKVJZUWZS4hpJsM0BKSG4WLaHrf7R2EEAF43DPVzmHk0XVqJNUwHsmcxQnG8hsI7sLPsUw0DN+nTUILEJHqkKyPi5Nq8Yraemo6SVSsfphUI9F8Jpazx8/X14FiZKn5ClBCzPk9ifI17xDAqNnoJsCAQACAQACAQACAQACAQA=";
    //   String pubk = "MIHdMA0GCSqGSIb3DQEBAQUAA4HLADCBxwKBgQCaPm8FaIIbO5RDpV1whCafVdBBxezz0dX6d/6/Qr/4tW5cX2GCrnvknS43tFDunlqqcKqygPZYi9DZaT6lKBndxKLyrX/JZeecfhT3hCfrymmJrAxdwEO062Cvvv7p0XTplhr9OQqTOYM+0GHLKqsX7kfUZPrFVfma1Ai811FxbQJBAOuBLXEFD+WFTUAbq+Jf/85hvOGJVC2HzfnGvlJmezf5pEnDC2GccD3qQiajD9S/5oAZBr6mzFj24I7DHxOyC2M=";
    //   enc = "GYGvI8Pr/yIybgtnLKo85HtXQoliYvypS00WxPRUhJq/9sK5nBKrQ7ElSved7zZ6hL1sSbztSDBeKMck60OvJpzMpV33231BkBnA2QvwXDvvwesfZ6yDaixkmi/ImcfEF/UZQ5HTwYrL1PhAKMvR217waEXOucT5T50Cw369TX8=";
    //   // enc = "NpaRR9+hzNA34tVIlwNoYWA7GWU2g/0yOzpIXyHZtojmwhBMwX5LiNuU60Jm2ycq/7ZzaBspBYlvG9spX4cewjoGKMYTRYVkaS/oGLPesfkZCjgVWPnhRkw5yeuGMZOFlhG6B2zjsvuDiU61f+pzWPj+SPl8qh/r7WriFVlxkg8=";
    //   // enc = "NpaRR9+hzNA34tVIlwNoYWA7GWU2g/0yOzpIXyHZtojmwhBMwX5LiNuU60Jm2ycq/7ZzaBspBYlvG9spX4cewjoGKMYTRYVkaS/oGLPesfkZCjgVWPnhRkw5yeuGMZOFlhG6B2zjsvuDiU61f+pzWPj+SPl8qh/r7WriFVlxkg8=";
    //   dec = CryptoUtil.RSA.decrypt(0, prvk, enc);
    //   log.debug("CHECK:{}", dec);

    // }
    /** RSA 키 길이 설정 (예: 1024 비트) */
    int bitlen = 1024;
    SimpleRSAExample rsa = new SimpleRSAExample(bitlen);
    String message = "RSA 암복호화 테스트 중입니다";

    String head = "";
    for (int inx = 0; inx < 30; inx++) {
      int v = 'a';
      int c = 'z' - 'a';
      head += (char) (v + new Random().nextInt(c));
    }
    message = head + message;
    {
      KeyFactory keyFactory = KeyFactory.getInstance("RSA");
      PublicKey publicKey = keyFactory.generatePublic(new RSAPublicKeySpec(rsa.getModulus(), rsa.getPublicKey()));
      PrivateKey privateKey = keyFactory.generatePrivate(new RSAPrivateKeySpec(rsa.getModulus(), rsa.getPrivateKey()));
      String privateKeyStr = Base64.getEncoder().encodeToString(privateKey.getEncoded());
      String publicKeyStr = Base64.getEncoder().encodeToString(publicKey.getEncoded());

      log.debug("PRIVATEKEY:{}", privateKeyStr);
      // log.debug("PRIVATEKEY:{}", rsa.convertPrivateKeyToPKCS8());
      log.debug("PUBLICKEY:{}", publicKeyStr);
      // log.debug("PUBLICKEY:{}", rsa.convertPublicKeyToX509());

      String decryptedMessage = "";
      byte[] encryptedBytes = null;

      /** javax.crypto.Cipher를 사용해 암호화 */
      encryptedBytes = rsa.encryptWithCipher(message.getBytes(), publicKey);
      // encryptedBytes = rsa.encryptWithCipher(message.getBytes(), privateKey);
      log.debug("[0]Encrypted Message: {}", Base64.getEncoder().encodeToString(encryptedBytes));
      /** javax.crypto.Cipher를 사용해 복호화 */
      {
        decryptedMessage = rsa.decryptWithCipher(encryptedBytes, privateKey);
        // decryptedMessage = rsa.decryptWithCipher(encryptedBytes, publicKey);
        log.debug("[0]Decrypted Message: {}", decryptedMessage);
      }
      {
        // String enc = CryptoUtil.RSA.encrypt(1, publicKeyStr, message);
        // String dec = CryptoUtil.RSA.decrypt(0, privateKeyStr, enc);
        String dec = CryptoUtil.RSA.decrypt(0, privateKeyStr, Base64.getEncoder().encodeToString(encryptedBytes));
        // String dec = CryptoUtil.RSA.decrypt(1, publicKeyStr, Base64.getEncoder().encodeToString(encryptedBytes));
        log.debug("[0]Decrypted Message: {}", dec);
        // Key key = CryptoUtil.RSA.key(0, privateKeyStr);
        // javax.crypto.Cipher cipher = javax.crypto.Cipher.getInstance("RSA/ECB/PKCS1Padding");
        // javax.crypto.Cipher cipher = javax.crypto.Cipher.getInstance("RSA");
        // cipher.init(javax.crypto.Cipher.DECRYPT_MODE, key);
        // byte[] decryptedBytes = cipher.doFinal(encryptedBytes);
        // log.debug("[1]Decrypted Message: {}", new String(decryptedBytes));
      }
      {
        decryptedMessage = rsa.decryptWithPad(encryptedBytes, rsa.d, rsa.n, 1);
        log.debug("[0]Decrypted Message: {}", decryptedMessage);
      }

      /** RSA로 암호화 (BigInteger 기반) */
      encryptedBytes = rsa.encryptWithPad(message, rsa.e, rsa.n, 0);
      log.debug("[0]Encrypted Message: {}", Base64.getEncoder().encodeToString(encryptedBytes));
      {
        decryptedMessage = rsa.decryptWithPad(encryptedBytes, rsa.d, rsa.n, 1);
        log.debug("[0]Decrypted Message: {}", decryptedMessage);
      }

      // decryptedMessage = rsa.decryptWithPad(encryptedBytes, rsa.d, rsa.n);
      // decryptedMessage = rsa.decryptWithPad(encryptedBytes, rsa.e, rsa.n);
      // log.debug("Decrypted Message: {}", decryptedMessage);

    }
  }

  @Test public void testSimpleRSA2() throws Exception {
    String privKeyStr = "MIIBNQIBADANBgkqhkiG9w0BAQEFAASCAR8wggEbAgEAAoGAcGoKevNOQp3+kqWi/oToqae4Y8F+nqIE8KcMWaUvHtIIMKI03gM7Ig832+RWB6Na1vRQpjHsY/YL02S2ifcj3VXyCbnWpcg5+yK1RIgT6MX9GuBY29YICTo3kLn/JFxRbRhSu4QFdik2wsrtLkAirs02jfc1SqXiSBN7eSbWxk0CAQACgYBDpkusC7JDeXwTNhRFf9GiUUMd7LOSHQ/fvB2Et5juYmMqnonhc9l5fUBa4RUFfDvGRkzUcl0ocnldTQq2pIj+DLvi6Pp+ye7uKecTz0R27oe0IYOA5mtXptU7PmcDQCXmIHVfgy8WNblKrFQsrecwemfuvcWTNu8oU5rRC50lvQIBAAIBAAIBAAIBAAIBAA==";
    String pubKeyStr =  "MIHcMA0GCSqGSIb3DQEBAQUAA4HKADCBxgKBgHBqCnrzTkKd/pKlov6E6KmnuGPBfp6iBPCnDFmlLx7SCDCiNN4DOyIPN9vkVgejWtb0UKYx7GP2C9Nkton3I91V8gm51qXIOfsitUSIE+jF/RrgWNvWCAk6N5C5/yRcUW0YUruEBXYpNsLK7S5AIq7NNo33NUql4kgTe3km1sZNAkEAyVbWQ6feX6jEzGw4IaH1Ha+zsXyDP/uT+pqRGN8jHkB9W9hx1V9kmX4qZmsyRMHuzNKI5zMoTMeLn65Gq321TQ==";
    String pln = "", enc = "", dec = "";
    pln = "gvqmcserjsbwopctwijjblupauxywlRSA 암복호화 테스트 중입니다";
    {
      /** PUBLIC-KEY-ENC */
      enc = "X6P9/aFJDtqInxSlYsFvDfE//ZK4KY4cNoZQgOzKeeh3JhCHjNfdkjO/NLphIhVYCfHZ3ZBLIsOwuhbLxX+z0kT+HUwvVyWCoaKZ3/CriTg/6RpgLF7IB3HOYX1anzp8QbVSdtNzwGvr4775nVMStRDb3qWxxUo0kWmQBAG3BfI=";
      dec = CryptoUtil.RSA.decrypt(1, pubKeyStr, enc);
      log.debug("DEC:{}", dec);
    }
    // {
    //   /** PRIVATE-KEY-ENC */
    //   enc = "YtY6DkEsPlw8dhoLAPJS7885nvU1bi1phhVvy/4ooR/vuqmFYsE+NssDr0h2+wcqKs2BS/hiXj2axKKxLnZVCT5zvPjzWfjSdexf+DIYgbswzG5uQtCcFXIGQK3nN7E+BGgA+qWMVuOhXFF/pBVdpYvJPyrCBvrBhlornHub7Zc=";
    //   dec = CryptoUtil.RSA.decrypt(0, privKeyStr, enc);
    //   log.debug("DEC:{}", dec);
    // }
  }

  @Test public void testSimpleRSAManyTime() throws Exception {
    for (int inx = 0; inx < 500; inx++) {
      this.testSimpleRSA();
    }
  }

  public static class SimpleRSAExample {

    private BigInteger n, d, e;
    private final int keySize;

    /** 키 생성자 */
    public SimpleRSAExample(int bitlen) {
      SecureRandom random = new SecureRandom();
      BigInteger p = new BigInteger(bitlen / 2, 100, random);
      BigInteger q = new BigInteger(bitlen / 2, 100, random);
      n = p.multiply(q);

      BigInteger phi = (p.subtract(BigInteger.ONE)).multiply(q.subtract(BigInteger.ONE));
      e = BigInteger.probablePrime(bitlen / 2, random);

      /** gcd(e, phi(n)) == 1 인 e 를 찾아서 설정 */
      while (phi.gcd(e).compareTo(BigInteger.ONE) > 0 && e.compareTo(phi) < 0) {
        e.add(BigInteger.ONE);
      }

      d = e.modInverse(phi);
      /** RSA에서 바이트 단위의 키 크기 */
      this.keySize = bitlen / 8;
    }

    /** 공개 키 가져오기 */
    public BigInteger getPublicKey() { return e; }

    /** 모듈러스(n) 가져오기 */
    public BigInteger getModulus() { return n; }

    /** 개인 키 가져오기 */
    public BigInteger getPrivateKey() { return d; }

    /** javax.crypto.Cipher 기반 복호화 함수 */
    public byte[] encryptWithCipher(byte[] message, Key key) throws Exception {
      javax.crypto.Cipher cipher = javax.crypto.Cipher.getInstance("RSA/ECB/PKCS1Padding");
      // javax.crypto.Cipher cipher = javax.crypto.Cipher.getInstance("RSA");
      cipher.init(javax.crypto.Cipher.ENCRYPT_MODE, key);
      byte[] encryptedBytes = cipher.doFinal(message);
      return encryptedBytes;
    }

    /** javax.crypto.Cipher 기반 암호화 함수 */
    public String decryptWithCipher(byte[] encryptedBytes, Key key) throws Exception {
      javax.crypto.Cipher cipher = javax.crypto.Cipher.getInstance("RSA/ECB/PKCS1Padding");
      // javax.crypto.Cipher cipher = javax.crypto.Cipher.getInstance("RSA");
      cipher.init(javax.crypto.Cipher.DECRYPT_MODE, key);
      byte[] decryptedBytes = cipher.doFinal(encryptedBytes);
      return new String(decryptedBytes);
    }


    /** 수동으로 PKCS#1 v1.5 패딩을 추가하여 암호화 */
    public byte[] encryptWithPad(String message, BigInteger k, BigInteger n, int type) throws Exception {
      byte[] messageBytes = message.getBytes();
      /** 메시지가 패딩을 포함하여 암호화 가능한 최대 길이를 초과하는지 확인 */
      if (messageBytes.length > keySize - 11) {
        throw new IllegalArgumentException("Message too long for RSA encryption");
      }
      /** PKCS#1 v1.5 패딩 적용 */
      byte[] paddedMessage = applyPKCS1Padding(messageBytes, type);

      /** 패딩된 메시지를 BigInteger로 변환하여 암호화 */
      BigInteger messageBigInt = new BigInteger(1, paddedMessage);
      BigInteger encryptedBigInt = messageBigInt.modPow(k, n);

      /** 암호화된 값을 바이트 배열로 반환 */
      return encryptedBigInt.toByteArray();
    }

    /** 수동으로 패딩을 제거하여 복호화 */
    public String decryptWithPad(byte[] encryptedBytes, BigInteger k, BigInteger n, int type) throws Exception {
      /** 암호화된 데이터를 BigInteger로 변환하여 복호화 */
      BigInteger encryptedBigInt = new BigInteger(1, encryptedBytes);
      BigInteger decryptedBigInt = encryptedBigInt.modPow(k, n);
      /** 복호화된 바이트 배열 */
      byte[] decryptedBytes = decryptedBigInt.toByteArray();
      /** PKCS#1 v1.5 패딩 제거 */
      byte[] unpaddedMessage = removePKCS1Padding(decryptedBytes, type);
      /** 복호화된 메시지를 문자열로 변환 */
      return new String(unpaddedMessage);
    }

    /** PKCS#1 v1.5 패딩 적용 */
    private byte[] applyPKCS1Padding(byte[] messageBytes, int type) {
      /** RSA 키 크기에 맞게 바이트 배열 생성 */
      byte[] paddedMessage = new byte[keySize];
      SecureRandom random = new SecureRandom();

      /** 0x00 || 0x02 || PS || 0x00 || D 구조 생성 */
      paddedMessage[0] = 0x00;
      /** FIXME: publicKey-encrypt 이면 2, privateKey-encrypt 이면 1 인 듯함. */
      if (type == 0) {
        paddedMessage[1] = 0x02;
      } else {
        paddedMessage[1] = 0x01;
      }

      /** 패딩 부분 (PS)를 무작위 값으로 채우기 (0x00이 아닌 값으로) */
      int paddingLength = keySize - messageBytes.length - 3;
      for (int i = 2; i < 2 + paddingLength; i++) {
        byte randomByte;
        do {
          randomByte = (byte) random.nextInt(256);
          /** 0x00은 사용할 수 없음 */
        } while (randomByte == 0);
        paddedMessage[i] = randomByte;
      }

      /** 패딩과 데이터 사이에 0x00 구분자를 삽입 */
      paddedMessage[2 + paddingLength] = 0x00;

      /** 메시지를 패딩된 메시지의 끝에 복사 */
      System.arraycopy(messageBytes, 0, paddedMessage, 3 + paddingLength, messageBytes.length);
      return paddedMessage;
    }

    /** PKCS#1 v1.5 패딩 제거 */
    private byte[] removePKCS1Padding(byte[] paddedMessage, int type) throws Exception {
      log.debug("CHECK:[{},{}]", paddedMessage[0], paddedMessage[1]);
      // if (paddedMessage[0] != 0x00 || paddedMessage[1] != 0x02) { throw new Exception("Decryption error: invalid padding"); }
      /** FIXME: publicKey-encrypt 이면 2, privateKey-encrypt 이면 1 인 듯함. */
      // if (paddedMessage[0] != 0x02) { throw new Exception("Decryption error: invalid padding"); }
      // if (paddedMessage[0] != 0x01) { throw new Exception("Decryption error: invalid padding"); }

      /** 0x00을 찾을 때까지 패딩 건너뛰기 */
      int index = 2;
      while (paddedMessage[index] != 0x00 && index < paddedMessage.length) {
        index++;
      }

      /** 패딩 후 메시지 추출 */
      if (index >= paddedMessage.length) {
        throw new Exception("Decryption error: no data found after padding");
      }
      return Arrays.copyOfRange(paddedMessage, index + 1, paddedMessage.length);
    }
    
    /** 공개 키를 X509EncodedKeySpec 으로 변환 */
    public String convertPublicKeyToX509() throws Exception {
      RSAPublicKeySpec pubKeySpec = new RSAPublicKeySpec(n, e);
      KeyFactory keyFactory = KeyFactory.getInstance("RSA");
      PublicKey publicKey = keyFactory.generatePublic(pubKeySpec);
      X509EncodedKeySpec x509EncodedKeySpec = new X509EncodedKeySpec(publicKey.getEncoded());
      /** Base64로 인코딩하여 출력 */
      return Base64.getEncoder().encodeToString(x509EncodedKeySpec.getEncoded());
    }

    /** 개인 키를 PKCS8EncodedKeySpec 으로 변환 */
    public String convertPrivateKeyToPKCS8() throws Exception {
      RSAPrivateKeySpec privKeySpec = new RSAPrivateKeySpec(n, d);
      KeyFactory keyFactory = KeyFactory.getInstance("RSA");
      PrivateKey privateKey = keyFactory.generatePrivate(privKeySpec);
      PKCS8EncodedKeySpec pkcs8EncodedKeySpec = new PKCS8EncodedKeySpec(privateKey.getEncoded());

      /** Base64로 인코딩하여 출력 */
      return Base64.getEncoder().encodeToString(pkcs8EncodedKeySpec.getEncoded());
    }

    // /** RSA 복호화 함수 (BigInteger 기반 복호화) */
    // public byte[] decrypt(byte[] encryptedBytes, PrivateKey privateKey) throws Exception {
    //   BigInteger encryptedBigInt = new BigInteger(1, encryptedBytes);

    //   /** 개인 키로 RSA 복호화 (encrypted ^ d mod n) */
    //   BigInteger decryptedBigInt = encryptedBigInt.modPow(d, n);
    //   return decryptedBigInt.toByteArray();
    // }

    // /** 암호화 함수 */
    // public BigInteger doPrivate(BigInteger value) { return value.modPow(e, n); }

    // /** 복호화 함수 */
    // public BigInteger doPublic(BigInteger value) { return value.modPow(d, n); }

    // // /** 암호화 함수 (BigInteger로 암호화하고 byte[] 반환) */
    // // public byte[] encrypt(String message, PublicKey publicKey) throws Exception {
    // //   byte[] messageBytes = message.getBytes();
    // //   BigInteger messageBigInt = new BigInteger(1, messageBytes);

    // //   /** 공개 키로 RSA 암호화 (message ^ e mod n) */
    // //   BigInteger encryptedBigInt = messageBigInt.modPow(e, n);
    // //   return encryptedBigInt.toByteArray();
    // // }

    // // /** 암호화 함수 (메시지 분할 적용) */
    // // public List<BigInteger> encryptStr(String message) {
    // //   byte[] messageBytes = message.getBytes(StandardCharsets.UTF_8);
    // //    /** PKCS#1 패딩을 위한 공간을 고려한 최대 청크 크기 */
    // //   int chunkSize = (n.bitLength() / 8) - 11;
    // //   List<BigInteger> encryptedChunks = new ArrayList<>();
    // //   for (int i = 0; i < messageBytes.length; i += chunkSize) {
    // //     /** 청크 추출 */
    // //     int length = Math.min(chunkSize, messageBytes.length - i);
    // //     byte[] chunk = new byte[length];
    // //     System.arraycopy(messageBytes, i, chunk, 0, length);
    // //     /** 각 청크를 암호화, 부호가 있는 문제 방지 */
    // //     BigInteger chunkBigInt = new BigInteger(1, chunk);
    // //     BigInteger encryptedChunk = chunkBigInt.modPow(e, n);
    // //     encryptedChunks.add(encryptedChunk);
    // //   }
    // //   return encryptedChunks;
    // // }

    // // /** 복호화 함수 (메시지 병합 적용) */
    // // public String decryptStr(List<BigInteger> encryptedChunks) {
    // //   StringBuilder decryptedMessage = new StringBuilder();
    // //   for (BigInteger encryptedChunk : encryptedChunks) {
    // //     /** 각 청크를 복호화 */
    // //     BigInteger decryptedChunk = encryptedChunk.modPow(d, n);
    // //     byte[] chunkBytes = decryptedChunk.toByteArray();
    // //     /** 복호화된 청크를 문자열로 변환하여 메시지에 추가 */ 
    // //     decryptedMessage.append(new String(chunkBytes, StandardCharsets.UTF_8));
    // //   }
    // //   return decryptedMessage.toString();
    // // }

  }
}
