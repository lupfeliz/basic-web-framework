package my.was.mywas;

import static com.ntiple.commons.Constants.UTF8;
import static com.ntiple.commons.ConvertUtil.cast;
import static org.junit.jupiter.api.Assertions.*;

import java.io.File;
import java.math.BigInteger;
import java.security.Key;
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.spec.RSAPrivateKeySpec;
import java.security.spec.RSAPublicKeySpec;
import java.util.Arrays;
import java.util.Base64;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import javax.xml.parsers.SAXParser;
import javax.xml.parsers.SAXParserFactory;

import org.junit.jupiter.api.Test;

import com.ntiple.commons.Constants;
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

  @Test
  public void jwtSecurityDecryptTest() throws Exception {
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
}
