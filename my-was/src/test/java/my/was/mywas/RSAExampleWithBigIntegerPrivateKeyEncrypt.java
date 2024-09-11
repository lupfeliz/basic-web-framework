package my.was.mywas;

import java.math.BigInteger;
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.SecureRandom;
import java.security.spec.RSAPrivateKeySpec;
import java.security.spec.RSAPublicKeySpec;
import javax.crypto.Cipher;
import java.util.Base64;

public class RSAExampleWithBigIntegerPrivateKeyEncrypt {

  private BigInteger n, d, e;

  // 키 생성자
  public RSAExampleWithBigIntegerPrivateKeyEncrypt(int bitlen) {
    SecureRandom random = new SecureRandom();
    BigInteger p = new BigInteger(bitlen / 2, 100, random);
    BigInteger q = new BigInteger(bitlen / 2, 100, random);
    n = p.multiply(q);

    BigInteger phi = (p.subtract(BigInteger.ONE)).multiply(q.subtract(BigInteger.ONE));
    e = BigInteger.probablePrime(bitlen / 2, random);

    while (phi.gcd(e).compareTo(BigInteger.ONE) > 0 && e.compareTo(phi) < 0) {
      e = e.add(BigInteger.ONE);
    }

    d = e.modInverse(phi);
  }

  // 공개 키 생성
  public PublicKey generatePublicKey() throws Exception {
    // 모듈러스와 공개 지수를 사용해 공개 키 생성
    RSAPublicKeySpec publicKeySpec = new RSAPublicKeySpec(n, e);
    KeyFactory keyFactory = KeyFactory.getInstance("RSA");
    return keyFactory.generatePublic(publicKeySpec);
  }

  // 개인 키 생성
  public PrivateKey generatePrivateKey() throws Exception {
    RSAPrivateKeySpec privateKeySpec = new RSAPrivateKeySpec(n, d);
    KeyFactory keyFactory = KeyFactory.getInstance("RSA");
    return keyFactory.generatePrivate(privateKeySpec);
  }

  // BigInteger를 사용해 개인 키로 암호화
  public byte[] encryptWithPrivateKey(String message) {
    byte[] messageBytes = message.getBytes();
    BigInteger messageBigInt = new BigInteger(1, messageBytes);

    // 개인 키로 암호화 (message ^ d mod n)
    BigInteger encryptedBigInt = messageBigInt.modPow(d, n);

    return encryptedBigInt.toByteArray(); // 암호화된 바이트 배열 반환
  }

  // Cipher를 사용해 공개 키로 복호화
  public String decryptWithPublicKey(byte[] encryptedBytes, PublicKey publicKey) throws Exception {
    Cipher cipher = Cipher.getInstance("RSA/ECB/PKCS1Padding");
    cipher.init(Cipher.DECRYPT_MODE, publicKey);
    byte[] decryptedBytes = cipher.doFinal(encryptedBytes);
    return new String(decryptedBytes);
  }

  public static void main(String[] args) throws Exception {
    int bitlen = 1024; // RSA 키 길이
    RSAExampleWithBigIntegerPrivateKeyEncrypt rsa = new RSAExampleWithBigIntegerPrivateKeyEncrypt(bitlen);

    // 공개 키 및 개인 키 생성
    PublicKey publicKey = rsa.generatePublicKey();
    PrivateKey privateKey = rsa.generatePrivateKey();

    // 암호화할 메시지
    String message = "안녕하세요, 개인 키로 암호화하고 공개 키로 복호화하는 RSA 예제입니다.";

    // BigInteger로 개인 키로 암호화
    byte[] encryptedBytes = rsa.encryptWithPrivateKey(message);
    System.out.println(
        "Encrypted with Private Key (BigInteger): " + Base64.getEncoder().encodeToString(encryptedBytes));

    // 공개 키로 복호화 (Cipher 사용)
    String decryptedMessage = rsa.decryptWithPublicKey(encryptedBytes, publicKey);
    System.out.println("Decrypted with Public Key (Cipher): " + decryptedMessage);
  }
}