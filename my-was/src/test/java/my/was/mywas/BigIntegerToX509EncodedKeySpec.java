package my.was.mywas;

import java.math.BigInteger;
import java.util.Base64;

public class BigIntegerToX509EncodedKeySpec {

  // ASN.1 DER 인코딩 도우미 함수 (SEQUENCE, INTEGER, BIT STRING 등을 처리)
  private static byte[] derEncodeLength(int length) {
    if (length < 0x80) {
      return new byte[] { (byte) length };
    } else if (length < 0x100) {
      return new byte[] { (byte) 0x81, (byte) length };
    } else {
      return new byte[] { (byte) 0x82, (byte) (length >> 8), (byte) (length & 0xFF) };
    }
  }

  // ASN.1 DER 인코딩 도우미 함수 (INTEGER 인코딩)
  private static byte[] derEncodeInteger(BigInteger value) {
    byte[] valueBytes = value.toByteArray();
    byte[] length = derEncodeLength(valueBytes.length);
    byte[] encodedInteger = new byte[1 + length.length + valueBytes.length];
    encodedInteger[0] = 0x02; // INTEGER 타입
    System.arraycopy(length, 0, encodedInteger, 1, length.length);
    System.arraycopy(valueBytes, 0, encodedInteger, 1 + length.length, valueBytes.length);
    return encodedInteger;
  }

  // 공개 키 (n, e)를 X.509 SubjectPublicKeyInfo 구조로 인코딩
  public static byte[] convertToX509Encoded(BigInteger modulus, BigInteger publicExponent) throws Exception {
    // RSA 공개 키의 modulus(n)와 publicExponent(e)를 DER 인코딩
    byte[] encodedModulus = derEncodeInteger(modulus);
    byte[] encodedPublicExponent = derEncodeInteger(publicExponent);

    // RSA 공개 키 구조: SEQUENCE { modulus, publicExponent }
    byte[] rsaPublicKey = new byte[1 + derEncodeLength(encodedModulus.length + encodedPublicExponent.length).length
        + encodedModulus.length + encodedPublicExponent.length];
    rsaPublicKey[0] = 0x30; // SEQUENCE 타입
    System.arraycopy(derEncodeLength(encodedModulus.length + encodedPublicExponent.length), 0, rsaPublicKey, 1,
        derEncodeLength(encodedModulus.length + encodedPublicExponent.length).length);
    System.arraycopy(encodedModulus, 0, rsaPublicKey,
        1 + derEncodeLength(encodedModulus.length + encodedPublicExponent.length).length, encodedModulus.length);
    System.arraycopy(encodedPublicExponent, 0, rsaPublicKey,
        1 + derEncodeLength(encodedModulus.length + encodedPublicExponent.length).length + encodedModulus.length,
        encodedPublicExponent.length);

    // SubjectPublicKeyInfo 구조: SEQUENCE { algorithm, subjectPublicKey }
    // AlgorithmIdentifier: {rsaEncryption OID (1.2.840.113549.1.1.1), NULL
    // parameter}
    byte[] algorithmIdentifier = new byte[] {
        0x30, 0x0D, // SEQUENCE
        0x06, 0x09, 0x2A, (byte)0x86, 0x48, (byte)0x86, // OID: 1.2.840.113549.1.1.1 (rsaEncryption)
        (byte)0xF7, 0x0D, 0x01, 0x01, 0x01,
        0x05, 0x00 // NULL parameter
    };

    // SubjectPublicKeyInfo SEQUENCE 생성
    byte[] publicKeyInfo = new byte[1 + derEncodeLength(algorithmIdentifier.length + rsaPublicKey.length + 1).length
        + algorithmIdentifier.length + rsaPublicKey.length + 1];
    publicKeyInfo[0] = 0x30; // SEQUENCE 타입
    System.arraycopy(derEncodeLength(algorithmIdentifier.length + rsaPublicKey.length + 1), 0, publicKeyInfo, 1,
        derEncodeLength(algorithmIdentifier.length + rsaPublicKey.length + 1).length);
    System.arraycopy(algorithmIdentifier, 0, publicKeyInfo,
        1 + derEncodeLength(algorithmIdentifier.length + rsaPublicKey.length + 1).length, algorithmIdentifier.length);
    publicKeyInfo[1 + derEncodeLength(algorithmIdentifier.length + rsaPublicKey.length + 1).length
        + algorithmIdentifier.length] = 0x03; // BIT STRING 타입
    publicKeyInfo[1 + derEncodeLength(algorithmIdentifier.length + rsaPublicKey.length + 1).length
        + algorithmIdentifier.length + 1] = (byte) 0x81;
    publicKeyInfo[1 + derEncodeLength(algorithmIdentifier.length + rsaPublicKey.length + 1).length
        + algorithmIdentifier.length + 2] = (byte) (rsaPublicKey.length + 1);
    publicKeyInfo[1 + derEncodeLength(algorithmIdentifier.length + rsaPublicKey.length + 1).length
        + algorithmIdentifier.length + 3] = 0x00; // 무시된 0 비트
    System.arraycopy(rsaPublicKey, 0, publicKeyInfo, 1
        + derEncodeLength(algorithmIdentifier.length + rsaPublicKey.length + 1).length + algorithmIdentifier.length + 4,
        rsaPublicKey.length);

    return publicKeyInfo;
  }

  public static void main(String[] args) throws Exception {
    // 예제 BigInteger n, e (모듈러스와 공개 지수)
    BigInteger n = new BigInteger(
        "00af795adb28a9fda8bff2b7a393f1d3cd7436f71e258d9a982ee1ef27a2b5a1896871cebc014f77b6ed15f36e2fc798a314db02034613d4fc872a8491326b3a7e1f3710d66f289c87b3b68fd4ef5eb9e989e567739d59ec233c198f8f3548c0e9d0cd8c8ff4bdf1b6c37f646b000f7b356bacb5a4b2dbe38fc251897d961",
        16);
    BigInteger e = new BigInteger("010001", 16); // 65537

    // X509EncodedKeySpec 포맷으로 변환
    byte[] x509EncodedKey = convertToX509Encoded(n, e);
    String encodedKey = Base64.getEncoder().encodeToString(x509EncodedKey);

    // X.509 공개 키 출력
    System.out.println("X.509 Encoded Public Key:\n" + encodedKey);
  }
}
