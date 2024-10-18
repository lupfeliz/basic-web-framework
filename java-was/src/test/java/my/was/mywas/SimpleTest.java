package my.was.mywas;

import static com.ntiple.commons.Constants.UTF8;
import static com.ntiple.commons.ConvertUtil.cast;
import static com.ntiple.commons.ConvertUtil.cat;
import static org.junit.jupiter.api.Assertions.*;

import java.io.File;
import java.io.FileFilter;
import java.math.BigInteger;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.SecureRandom;
import java.security.Signature;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.RSAPrivateCrtKeySpec;
import java.security.spec.RSAPrivateKeySpec;
import java.security.spec.RSAPublicKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Base64;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import javax.xml.parsers.SAXParser;
import javax.xml.parsers.SAXParserFactory;

import org.apache.commons.codec.binary.Hex;
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
    if (!TestUtil.isEnabled("testSimpleRSA", TestLevel.MANUAL)) { return; }
    /** RSA 키 길이 설정 (예: 1024 비트) */
    int bitlen = 2048;
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
      String prvk = "MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBALtGiOfF8bU5niMiMssH312DKh0inqEZInz5DKVtupphjK+sQat25cMtUp7z4dhOd9ZtVcWdjSFvIDldKSJfatArS5ZcuLr1U/Ltrro69+2aA3iNwT0Z8psFyLaZgRt/BNKul4tTiit9xoFsLkFqX/PlY4hPiY3/ZKjJjae5g8vtAgMBAAECgYAY0+6Vj6wOQx/Ad6m1Ogt2WcvNBghywiLM37W5/tSk3/bnWVZxdXdbi1gvQ5T2+NwxXNhotQz/WDy07jFkYbMGwPgI1imK1kOddThLE6VIBbVVbmZp9P3aeiHE8+oV7iXd9L2nAUk8KfX/waLU7WsOrf1mCsDTRf5Js0PiHFj5UQJBAOfDOgFEXhz4R/zBnzeaa1ZI3hoRW/h+K66vV+pMVMi0Y7FeKunj1dnbwCvc3v7O8Fx/d/PdCJHUCUiEtZuG92UCQQDO3EudooDxzUZ5ErFx0O4W2CqkmisiBS3MJzr0HzLAKUXD+NAv5Iy7jqhz/t408LIuviR6Sol/2H7P2WxyIo3pAkEAuFKCHWPcXbnwtsre7//2Aget7JmFxdnCsAlwKD1Q6Nbeur+j7aRv/fZRnhDpoUm/zDDsm5xdJm22fGBfdzQeKQJAXecW1EoOarWahh98OYR0cB5UzT/G0Ly1G3W7h1IaQaz6pIlwSC1hzUpnIbDSwgl5eUqLWJA5drWaa1PxrKYO8QJANNSD0e6/VSMSshZU7OddhX+UXGw4vzYE9/DCYX7XrUUb3G0J+FMpmweSr1dPveqCcz5i0Zm101kz9CFzdzMvOA==";
      String pubk = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC7RojnxfG1OZ4jIjLLB99dgyodIp6hGSJ8+QylbbqaYYyvrEGrduXDLVKe8+HYTnfWbVXFnY0hbyA5XSkiX2rQK0uWXLi69VPy7a66OvftmgN4jcE9GfKbBci2mYEbfwTSrpeLU4orfcaBbC5Bal/z5WOIT4mN/2SoyY2nuYPL7QIDAQAB";
      String N = "00bb4688e7c5f1b5399e232232cb07df5d832a1d229ea119227cf90ca56dba9a618cafac41ab76e5c32d529ef3e1d84e77d66d55c59d8d216f20395d29225f6ad02b4b965cb8baf553f2edaeba3af7ed9a03788dc13d19f29b05c8b699811b7f04d2ae978b538a2b7dc6816c2e416a5ff3e563884f898dff64a8c98da7b983cbed";
      String D = "18d3ee958fac0e431fc077a9b53a0b7659cbcd060872c222ccdfb5b9fed4a4dff6e759567175775b8b582f4394f6f8dc315cd868b50cff583cb4ee316461b306c0f808d6298ad6439d75384b13a54805b5556e6669f4fdda7a21c4f3ea15ee25ddf4bda701493c29f5ffc1a2d4ed6b0eadfd660ac0d345fe49b343e21c58f951";
      String E = "010001";
      BigInteger modv = new BigInteger(N, 16);
      BigInteger prve = new BigInteger(D, 16);
      BigInteger pube = new BigInteger(E, 16);
      
      KeyFactory keyFactory = KeyFactory.getInstance("RSA");
      Key privateKey = keyFactory.generatePrivate(new RSAPrivateKeySpec(modv, prve));
      Key publicKey = keyFactory.generatePublic(new RSAPublicKeySpec(modv, pube));
      // Key privateKey = cast(CryptoUtil.RSA.key(0, prvk), privateKey = null);
      // Key publicKey = cast(CryptoUtil.RSA.key(1, pubk), publicKey = null);
      String privateKeyStr = Base64.getEncoder().encodeToString(privateKey.getEncoded());
      String publicKeyStr = Base64.getEncoder().encodeToString(publicKey.getEncoded());

      {
        rsa.n = ((RSAPrivateKey) privateKey).getModulus();
        rsa.d = ((RSAPrivateKey) privateKey).getPrivateExponent();
        rsa.e = ((RSAPublicKey) publicKey).getPublicExponent();
      }

      log.debug("PRIVATEKEY:{}", privateKeyStr);
      // log.debug("PRIVATEKEY:{}", rsa.convertPrivateKeyToPKCS8());
      log.debug("PUBLICKEY:{}", publicKeyStr);
      // log.debug("PUBLICKEY:{}", rsa.convertPublicKeyToX509());

      log.debug("N:{}", new String(Hex.encodeHex(rsa.n.toByteArray())));
      log.debug("D:{}", new String(Hex.encodeHex(rsa.d.toByteArray())));
      log.debug("E:{}", new String(Hex.encodeHex(rsa.e.toByteArray())));

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
      // {
      //   decryptedMessage = rsa.decryptWithPad(encryptedBytes, rsa.d, rsa.n, 0);
      //   log.debug("[0]Decrypted Message: {}", decryptedMessage);
      // }
      /** RSA로 암호화 (BigInteger 기반) */
      // encryptedBytes = rsa.encryptWithPad(message, rsa.e, rsa.n, 1);
      // log.debug("[0]Encrypted Message: {}", Base64.getEncoder().encodeToString(encryptedBytes));
      // {
      //   decryptedMessage = rsa.decryptWithPad(encryptedBytes, rsa.d, rsa.n, 0);
      //   log.debug("[0]Decrypted Message: {}", decryptedMessage);
      // }
      // decryptedMessage = rsa.decryptWithPad(encryptedBytes, rsa.d, rsa.n);
      // decryptedMessage = rsa.decryptWithPad(encryptedBytes, rsa.e, rsa.n);
      // log.debug("Decrypted Message: {}", decryptedMessage);

    }
  }

  @Test public void testSimpleRSA2() throws Exception {
    if (!TestUtil.isEnabled("testSimpleRSA2", TestLevel.MANUAL)) { return; }
    String privKeyStr = "";
    String pubKeyStr =  "";
    String pln = "", enc = "", dec = "";
    pln = "gvqmcserjsbwopctwijjblupauxywlRSA 암복호화 테스트 중입니다";
    // {
    //   String[] keys = CryptoUtil.RSA.generateKeyStrs(1024);
    //   privKeyStr = keys[0];
    //   pubKeyStr = keys[1];
    //   log.debug("PRV:{}", privKeyStr);
    //   log.debug("PUB:{}", pubKeyStr);
    //   enc = CryptoUtil.RSA.encrypt(1, pubKeyStr, pln);
    //   log.debug("ENC1:{}", enc);
    //   dec = CryptoUtil.RSA.decrypt(0, privKeyStr, enc);
    //   log.debug("DEC1:{}", dec);
    //   enc = CryptoUtil.RSA.encrypt(0, privKeyStr, pln);
    //   log.debug("ENC2:{}", enc);
    //   dec = CryptoUtil.RSA.decrypt(1, pubKeyStr, enc);
    //   log.debug("DEC2:{}", dec);
    // }
    // {
    //   /** PUBLIC-KEY-ENC */
    //   enc = "X6P9/aFJDtqInxSlYsFvDfE//ZK4KY4cNoZQgOzKeeh3JhCHjNfdkjO/NLphIhVYCfHZ3ZBLIsOwuhbLxX+z0kT+HUwvVyWCoaKZ3/CriTg/6RpgLF7IB3HOYX1anzp8QbVSdtNzwGvr4775nVMStRDb3qWxxUo0kWmQBAG3BfI=";
    //   dec = CryptoUtil.RSA.decrypt(1, pubKeyStr, enc);
    //   log.debug("DEC:{}", dec);
    // }
    // {
    //   privKeyStr = "MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAMhfVP50PfMYry6YsMYpEdTPjWRHflvUNDhzhrgyO5gEiTIj2lK6S95XRggsU/NGTbRqRouBmFlV4+KHL9LLKhXszqlDRDWf1jZJBNdI4/GpRlQU/MkByji+2lv9894gJPXpExDLO/bM+PTZ16HMAMyZJ6DNw5hD/GMEudZk6U1lAgMBAAECgYAD/17nOrN3s6DfGZ3BPlWEPOXRv9lmBJxMGgXwi9QDiuefz/ZNmzjjRTN4+0Vrf5YSSOKCawH6mkuTG+ZY2sPKpiIBSX4SXewMIKRhbxOj19iwrNp1gBDK3s/kpHy9+x8b7tuEIITNYreuadYAvVgSMlaJVPdh7uUm39sMnn/aqwJBANRWQBpaOfw3iQ+g7jBrBJz+e5QbmsNZeNUPrk9WbMuhKQkLUP2E4U5noFKV8SZFGo48YPKsC32DxFF3e8kw2fsCQQDxk0ALLlepzdpqVkm6YQ4KtTEweug+L/RdjU5apGZLZI+AGfYIE1JIzyzgdPke92ePnw1wPqFgi0PyzyJn8DgfAkAq5M2IRUfHapSWgqT7RPMmn8XpEnZ+Ffnx2HwW7NeHfyPh/tY6kHhPNWHOrRmM6JLHvuy6uQSNM2waJO/toZ+3AkEAo4WzUl46RNztPhHOsnTEFod0Fob78ixv02u1YDHsdJhLcsEgA3NgvZxPmlhT0ZxS46scY6BhiIJ8qj1/4q9+rQJAbZj4vsQB5SrKcYNR8VVYMP9EYXnFax66QgSjGI3zPJhjAcbdyhDVshFKHcsI3R1dxegLFTbvjYKejzWfHBcBUQ==";
    //   enc = "h3IfqQoLwdAaJTeE30jlesbm0UGCFRBirLFe3lXzi4KzUGpzEr7pb6L+9G4zE1YSHyf2KSUIfH6vePG/Fl8CRZoJZ6FQCC9MYzhxpGk377Z2OVBepz33wgOKKzFz9s7Bk8uxL8ubJUQPl9IZLhcVvbl4ruVc00wGa66lWeMjW1s=";
    //   dec = CryptoUtil.RSA.decrypt(0, privKeyStr, enc);
    //   log.debug("DEC:{}", dec);
    // }
    // {
    //   privKeyStr = "MIIBNQIBADANBgkqhkiG9w0BAQEFAASCAR8wggEbAgEAAoGAcGoKevNOQp3+kqWi/oToqae4Y8F+nqIE8KcMWaUvHtIIMKI03gM7Ig832+RWB6Na1vRQpjHsY/YL02S2ifcj3VXyCbnWpcg5+yK1RIgT6MX9GuBY29YICTo3kLn/JFxRbRhSu4QFdik2wsrtLkAirs02jfc1SqXiSBN7eSbWxk0CAQACgYBDpkusC7JDeXwTNhRFf9GiUUMd7LOSHQ/fvB2Et5juYmMqnonhc9l5fUBa4RUFfDvGRkzUcl0ocnldTQq2pIj+DLvi6Pp+ye7uKecTz0R27oe0IYOA5mtXptU7PmcDQCXmIHVfgy8WNblKrFQsrecwemfuvcWTNu8oU5rRC50lvQIBAAIBAAIBAAIBAAIBAA==";
    //   enc = "X6P9/aFJDtqInxSlYsFvDfE//ZK4KY4cNoZQgOzKeeh3JhCHjNfdkjO/NLphIhVYCfHZ3ZBLIsOwuhbLxX+z0kT+HUwvVyWCoaKZ3/CriTg/6RpgLF7IB3HOYX1anzp8QbVSdtNzwGvr4775nVMStRDb3qWxxUo0kWmQBAG3BfI=";
    //   dec = CryptoUtil.RSA.decrypt(0, privKeyStr, enc);
    //   log.debug("DEC:{}", dec);
    // }
    {
      privKeyStr = "MIICdQIBADANBgkqhkiG9w0BAQEFAASCAl8wggJbAgEAAoGBAIklL0trECmxNh3gBScQAGa5hqILaLXyxFg4VAh6MktDTdZbbvpHeMq4owGF0i1RWgTsudOjcT1Su6Jp+2+bQGEGdjow37qOHPuErQXtDXWxAJmnn8RBTpO/w96DZatzg9fU2Ib0fSGDlXTHaRbvSInCpbEwM5h7efnuKjA11VBXAgMBAAECgYAXeaf4zuC7YjwTLQ90ukZ3TvZ+sllAG8gEGdA4i0Iko+ak9I2whZ9lg+lTD2cEntI72ZGNaoKtroWzrVR+rCJ+uLbSVB8n0JAkrtd1eg/dbxIQNFkaFGpwkC0AtQSpgsLly7HjVQ5MrIAlP63ZiK9JdTBdXyajsLJX+R7Dyll6MQJBAKmPt/ZY0rKj21KirA8T4afW2qMVpMyIRTvbvaW7BU69pxyBwJEY3okwNCE4SK94GebVaXR2B7vANCI64NizBw0CQQDPDw9IgT9nLlZk+PRfYcm729qHotm6Uc8GrY0Iz8nkxrmszIz+/XBTsjV4na1gJ6dNMJHdg7gbR9ZsEm7I9FvzAkBsk7krKGmTNtXErqIa7ZI8FZrff4aN6lzbHbTtITse1tbhrDyRLSmjE5juBMqWggOkCtiCWOpO0Z8QpD9CxDEpAkABYXNTo3D9yiRPVg2jGS7ULtodL2vOPz9nJv8awO/ys5SHX3HNPXljRXvvyvVd/8Ww0RMX7AntPKRkYhcVBfQbAkAfups6liYVJLHON6vcVQTh0G9EaSZWDyFdxn+QVNA1BTgyqyA76VUywkiDviDbjWK1gv3UtiF19aQBlDFsvzcq";
      pubKeyStr = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCJJS9LaxApsTYd4AUnEABmuYaiC2i18sRYOFQIejJLQ03WW276R3jKuKMBhdItUVoE7LnTo3E9Uruiaftvm0BhBnY6MN+6jhz7hK0F7Q11sQCZp5/EQU6Tv8Peg2Wrc4PX1NiG9H0hg5V0x2kW70iJwqWxMDOYe3n57iowNdVQVwIDAQAB";
      enc = "D9ewtzaCH5QB30IjnOxhkKlmgGvSejd0LMsdRL800koXEY+b+H7NHvTfXugXYJs+WAoPvdalF5T3nTv63BTdPh/6Nkdk9avIH3q1bj0lYtp3s3wgi3obJSsmRQSqYc9FfPSb+mjWVLKBVpC0HHiPT09D6ruNijkSePjAXMXGVjw=";
      // enc = "GwWIearfTUxjC/oBV0ySdEEy/0wPEcsNzScDGdyXc976nRLmPYXmLDbCWX1UkeMNBHdnrvre7o5kZSIZTKo+YRdAPzsekVQ2KHh0tfmQbRZ26VgYTG6+Ksnbx84RnSWuHYPzY6m01O5WQyrNQChqAzUJyl8L6OV1OyQ1TaVTp/4=";
      dec = CryptoUtil.RSA.decrypt(0, privKeyStr, enc);
      // dec = CryptoUtil.RSA.decrypt(1, pubKeyStr, enc);
      log.debug("DEC:{}", dec);
      enc = CryptoUtil.RSA.encrypt(0, privKeyStr, dec);
      log.debug("ENC:{}", enc);

      enc = "Qgk6W4v0yDYlqiX3U2xI9iO2BnT9lqmZXVZNR8q/3SlPg2+8bbuAF+FcWkkDVyy20TcSdhtHvUdRak7lBxg6tSF+8R/ZOiw64+df3KKgNgTjl3U2p0Y8i4umfOMw7J4m9MRp94xopnkvv1O9P4+179nVmwiyVYpgVP34G00UpTU=";
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
  

  @Test public void testSimpleRSA3() throws Exception {
    if (!TestUtil.isEnabled("testSimpleRSA3", TestLevel.MANUAL)) { return; }
    String pln, enc, dec;
    String[] keys = CryptoUtil.RSA.generateKeyStrs(1024);
    log.debug("PRV:{}", keys[0]);
    log.debug("PUB:{}", keys[1]);
    pln = "테스트중입니다.";
      enc = CryptoUtil.RSA.encrypt(1, keys[1], pln);
    dec = CryptoUtil.RSA.decrypt(0, keys[0], enc);
    log.debug("ENC1:{}", enc);
    log.debug("DEC1:{}", dec);
    enc = CryptoUtil.RSA.encrypt(0, keys[0], pln);
    dec = CryptoUtil.RSA.decrypt(1, keys[1], enc);
    log.debug("ENC2:{}", enc);
    log.debug("DEC2:{}", dec);
  }

  @Test public void testSimpleRSA4() throws Exception {
    if (!TestUtil.isEnabled("testSimpleRSA4", TestLevel.MANUAL)) { return; }
    // publicKey = GenerateRSAKeys().public;
    // keyBytes = BinaryDecode( publicKey, "base64" );
    // keyFactory = CreateObject( "java", "java.security.KeyFactory" ).getInstance( "RSA" );
    // spec = CreateObject( "java", "java.security.spec.X509EncodedKeySpec" ).init( keyBytes );
    // rsaPublicKey = keyFactory.generatePublic( spec );
    // result.publicKeyModulus = rsaPublicKey.getModulus();
    // result.publicKeyExponent = rsaPublicKey.getPublicExponent();
    // dump( result );

    // kpg = CreateObject( "java", "java.security.KeyPairGenerator" ).getInstance( "RSA" );
    // kpg.initialize( 2048 );
    // kp = kpg.genKeyPair();
    // publicKey = kp.getPublic();
    // rsaPublicKey = JavaCast( "java.security.interfaces.RSAPublicKey", publicKey );
    // result.publicKeyModulus = rsaPublicKey.getModulus();
    // result.publicKeyExponent = rsaPublicKey.getPublicExponent();
    // dump( result );
    String res = "1ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00ed858cec8aa4ed8ab8eca491ec9e85eb8b88eb8ba42e";
    res = "ed858cec8aa4ed8ab8eca491ec9e85eb8b88eb8ba42e";
    byte[] buf = Hex.decodeHex(res);
    log.debug("RESTORED:{}", new String(buf));
  }

  @Test public void testSimpleRSAManyTime() throws Exception {
    if (!TestUtil.isEnabled("testSimpleRSAManyTime", TestLevel.MANUAL)) { return; }
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
      log.debug("KEY-SIZE:{}", this.keySize);
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

  // static class RSA {
  //   private PublicKey internalPublicKey;
  //   private PrivateKey internalPrivateKey;
  //   private KeyPairGenerator kpg = null;
  //   private int SIZE = 4096;

  //   public RSA(int size) {
  //     try {
  //       SIZE = size;
  //       kpg = KeyPairGenerator.getInstance("RSA");
  //       init();
  //     } catch (Exception e) {
  //     }
  //   }

  //   public RSA() {
  //     this(1024);
  //   }

  //   private void init() {
  //     kpg.initialize(SIZE, new SecureRandom());

  //     KeyPair kp = kpg.genKeyPair();
  //     internalPublicKey = kp.getPublic();
  //     internalPrivateKey = kp.getPrivate();
  //   }

  //   public int getSize() {
  //     return SIZE;
  //   }

  //   public PublicKey getPublic() {
  //     return internalPublicKey;
  //   }

  //   public PrivateKey getPrivate() {
  //     return internalPrivateKey;
  //   }

  //   public String getPublicModule() {
  //     String s = internalPublicKey.toString();
  //     return s.substring(s.indexOf("modulus") + 8, s.indexOf(",publicExponent"));
  //   }

  //   public String getPublicExponent() {
  //     String s = internalPublicKey.toString();
  //     // {
  //     return s.substring(s.indexOf("publicExponent") + 15, s.lastIndexOf("}"));
  //   }

  //   public String getPrivateExponent() {
  //     String s = internalPrivateKey.toString();
  //     return s.substring(s.indexOf("privateExponent") + 16, s.indexOf(",primeP"));
  //   }

  //   public String getPrivatePrimP() {
  //     String s = internalPrivateKey.toString();
  //     return s.substring(s.indexOf("primeP=") + 7, s.indexOf(",primeQ"));
  //   }

  //   public String getPrivatePrimQ() {
  //     String s = internalPrivateKey.toString();
  //     return s.substring(s.indexOf("primeQ=") + 7, s.indexOf(",primeExponentP"));
  //   }

  //   public String getPrivatePrimExponentP() {
  //     String s = internalPrivateKey.toString();
  //     return s.substring(s.indexOf("primeExponentP=") + 15, s.indexOf(",primeExponentQ"));
  //   }

  //   public String getPrivatePrimExponentQ() {
  //     String s = internalPrivateKey.toString();
  //     return s.substring(s.indexOf("primeExponentQ=") + 15, s.indexOf(",crtCoefficient"));
  //   }

  //   public String getPrivateCrtCoefficient() {
  //     String s = internalPrivateKey.toString();
  //     return s.substring(s.indexOf("crtCoefficient=") + 15, s.lastIndexOf(","));
  //   }

  //   public byte[] getPublicKey() {
  //     return internalPublicKey.getEncoded();
  //   }

  //   public byte[] getPrivateKey() {
  //     return internalPrivateKey.getEncoded();
  //   }

  //   public String getPublicKeyAsString() {
  //     return Base64.encodeToString(internalPublicKey.getEncoded(), Base64.DEFAULT);
  //   }

  //   public String getPrivateKeyAsString() {
  //     return Base64.encodeToString(internalPrivateKey.getEncoded(), Base64.DEFAULT);
  //   }

  //   public byte[] getEncrypt(String plain) {
  //     try {
  //       // Cipher cipher = Cipher.getInstance("RSA/ECB/OAEPWithSHA-256AndMGF1Padding");
  //       Cipher cipher = Cipher.getInstance("RSA");
  //       cipher.init(Cipher.ENCRYPT_MODE, internalPublicKey);

  //       return cipher.doFinal(plain.getBytes("UTF-8"));
  //     } catch (Exception e) {
  //       log.debug("E:{}", e);
  //     }

  //     return null;
  //   }

  //   public String getStringEncrypt(String plain) {
  //     return new String(getEncrypt(plain), Charset.forName("UTF-8"));
  //   }

  //   public byte[] getDecrypt(byte[] encryptedBytes) {
  //     try {
  //       Cipher cipher = Cipher.getInstance("RSA");
  //       cipher.init(Cipher.DECRYPT_MODE, internalPrivateKey);

  //       return cipher.doFinal(encryptedBytes);
  //     } catch (Exception e) {
  //       log.debug("E:{}", e);
  //     }

  //     return null;
  //   }

  //   public byte[] getDecrypt(String encrypted) {
  //     return getDecrypt(encrypted.getBytes());
  //   }

  //   public String getStringDecrypt(byte[] encryptedBytes) {
  //     return new String(getDecrypt(encryptedBytes), Charset.forName("UTF-8"));
  //   }

  //   public String getStringDecrypt(String encrypted) {
  //     return new String(getDecrypt(encrypted), Charset.forName("UTF-8"));
  //   }

  //   public static byte[] getEncrypt(String plain, String modulus, String exponent) {
  //     try {
  //       BigInteger modBigInteger = new BigInteger(modulus, 16);
  //       BigInteger exBigInteger = new BigInteger(exponent, 16);
  //       RSAPublicKeySpec spec = new RSAPublicKeySpec(modBigInteger, exBigInteger);

  //       KeyFactory factory = KeyFactory.getInstance("RSA");
  //       PublicKey pk = factory.generatePublic(spec);

  //       Cipher cipher = Cipher.getInstance("RSA");
  //       cipher.init(Cipher.ENCRYPT_MODE, pk);

  //       return cipher.doFinal(plain.getBytes("UTF-8"));
  //     } catch (Exception e) {
  //       log.debug("E:{}", e);
  //     }

  //     return null;
  //   }

  //   public static String getStringEncrypt(final String plain, String modulus, String exponent) {
  //     return Base64.encodeToString(getEncrypt(plain, modulus, exponent), Base64.DEFAULT);
  //   }

  //   public static byte[] getDecrypt(byte[] encryptedBytes, String modulus, String publicExpo, String privateExpo,
  //       String primP, String primQ, String ePrimP, String ePrimQ, String cof) {
  //     try {
  //       BigInteger module = new BigInteger(modulus, 16);
  //       BigInteger expo1 = new BigInteger(publicExpo, 16);
  //       BigInteger expo2 = new BigInteger(privateExpo, 16);
  //       BigInteger prim_P = new BigInteger(primP, 16);
  //       BigInteger prim_Q = new BigInteger(primQ, 16);
  //       BigInteger prim_EP = new BigInteger(ePrimP, 16);
  //       BigInteger prim_EQ = new BigInteger(ePrimQ, 16);
  //       BigInteger coefficient = new BigInteger(cof, 16);
  //       /*
  //       * BigInteger module = new BigInteger(1, Base64.encode(modulus.getBytes(),
  //       * Base64.DEFAULT));
  //       * BigInteger expo1 = new BigInteger(1, Base64.encode(publicExpo.getBytes(),
  //       * Base64.DEFAULT));
  //       * BigInteger expo2 = new BigInteger(1, Base64.encode(privateExpo.getBytes(),
  //       * Base64.DEFAULT));
  //       * BigInteger prim_P = new BigInteger(1, Base64.encode(primP.getBytes(),
  //       * Base64.DEFAULT));
  //       * BigInteger prim_Q = new BigInteger(1, Base64.encode(primQ.getBytes(),
  //       * Base64.DEFAULT));
  //       * BigInteger prim_EP = new BigInteger(1, Base64.encode(ePrimP.getBytes(),
  //       * Base64.DEFAULT));
  //       * BigInteger prim_EQ = new BigInteger(1, Base64.encode(ePrimQ.getBytes(),
  //       * Base64.DEFAULT));
  //       * BigInteger coefficient = new BigInteger(1, Base64.encode(cof.getBytes(),
  //       * Base64.DEFAULT));
  //       */

  //       RSAPrivateCrtKeySpec spec = new RSAPrivateCrtKeySpec(module, expo1, expo2, prim_P, prim_Q, prim_EP, prim_EQ,
  //           coefficient);

  //       KeyFactory factory = KeyFactory.getInstance("RSA");
  //       PrivateKey pk = factory.generatePrivate(spec);

  //       Cipher cipher1 = Cipher.getInstance("RSA");
  //       cipher1.init(Cipher.DECRYPT_MODE, pk);

  //       // return cipher1.doFinal(Base64.decode(encryptedBytes, Base64.DEFAULT));
  //       return cipher1.doFinal(encryptedBytes);
  //     } catch (Exception e) {
  //       log.debug("E:{}", e);
  //     }

  //     return null;
  //   }

  //   public static String getStringDecrypt(byte[] encryptedBytes, String modulus, String publicExpo, String privateExpo,
  //       String primP, String primQ, String ePrimP, String ePrimQ, String cof) {
  //     return Converter.byteToString_UTF8(
  //         getDecrypt(encryptedBytes, modulus, publicExpo, privateExpo, primP, primQ, ePrimP, ePrimQ, cof));
  //   }

  //   public static byte[] getDecrypt(final byte[] encryptedBytes, byte[] privateKey) {
  //     try {
  //       KeyFactory keyFac = KeyFactory.getInstance("RSA");
  //       KeySpec keySpec = new PKCS8EncodedKeySpec(privateKey);
  //       PrivateKey pk = keyFac.generatePrivate(keySpec);

  //       Cipher cipher1 = Cipher.getInstance("RSA");
  //       cipher1.init(Cipher.DECRYPT_MODE, pk);
  //       return cipher1.doFinal(encryptedBytes);
  //     } catch (Exception e) {
  //       log.debug("E:{}", e);
  //     }

  //     return null;
  //   }

  //   public static String getStringDecrypt(final byte[] encryptedBytes, byte[] privateKey) {
  //     return Converter.byteToString_UTF8(getDecrypt(encryptedBytes, privateKey));
  //   }

  //   public static String sign(String plainText, PrivateKey privateKey) {
  //     try {
  //       Signature privateSignature = Signature.getInstance("SHA256withRSA");
  //       privateSignature.initSign(privateKey);
  //       privateSignature.update(plainText.getBytes());

  //       byte[] signature = privateSignature.sign();

  //       return Base64.encodeToString(signature, Base64.DEFAULT);
  //     } catch (Exception e) {
  //       log.debug("E:{}", e);
  //     }

  //     return null;
  //   }

  //   public static boolean verify(String plainText, String signature, PublicKey publicKey) {
  //     Signature publicSignature;

  //     try {
  //       publicSignature = Signature.getInstance("SHA256withRSA");
  //       publicSignature.initVerify(publicKey);
  //       publicSignature.update(plainText.getBytes());

  //       byte[] signatureBytes = Base64.decode(signature, Base64.DEFAULT);

  //       return publicSignature.verify(signatureBytes);
  //     } catch (Exception e) {
  //       log.debug("E:{}", e);
  //     }

  //     return false;
  //   }
  // }
}
