package my.was.mywas.util;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.spec.KeySpec;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.spec.SecretKeySpec;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.codec.binary.Hex;

import static my.was.mywas.util.Constants.PBKDF2WithHmacSHA1;
import static my.was.mywas.util.Constants.AES;
import static my.was.mywas.util.Constants.AES_CBC_PKCS5Padding;
import static my.was.mywas.util.Constants.UTF8;
import static my.was.mywas.util.Constants.HC_DEF_AES_IV;
import static my.was.mywas.util.Constants.HC_DEF_AES_PASSPHRASE;
import static my.was.mywas.util.Constants.HC_DEF_AES_SALT;

public class CryptoUtil {

  public static String decrypt(String salt, String iv, String passphrase, String ciphertext, int iterations, int keysize) throws Exception {
    SecretKeyFactory factory = SecretKeyFactory.getInstance(PBKDF2WithHmacSHA1);
    KeySpec spec = new PBEKeySpec(passphrase.toCharArray(), Hex.decodeHex(salt.toCharArray()), iterations, keysize);
    SecretKey key = new SecretKeySpec(factory.generateSecret(spec).getEncoded(), AES);
    Cipher cipher = Cipher.getInstance(AES_CBC_PKCS5Padding);
    cipher.init(Cipher.DECRYPT_MODE, key, new IvParameterSpec(Hex.decodeHex(iv.toCharArray())));
    byte[] decrypted = cipher.doFinal(Base64.decodeBase64(ciphertext));
    String ret = new String(decrypted, UTF8);
    return ret;
  }

  public static String encrypt(String salt, String iv, String passphrase, String plaintext, int iterations, int keysize) throws Exception {
    SecretKeyFactory factory = SecretKeyFactory.getInstance(PBKDF2WithHmacSHA1);
    KeySpec spec = new PBEKeySpec(passphrase.toCharArray(), Hex.decodeHex(salt.toCharArray()), iterations, keysize);
    SecretKey key = new SecretKeySpec(factory.generateSecret(spec).getEncoded(), AES);
    Cipher cipher = Cipher.getInstance(AES_CBC_PKCS5Padding);
    cipher.init(Cipher.ENCRYPT_MODE, key, new IvParameterSpec(Hex.decodeHex(iv.toCharArray())));
    byte[] encrypted = cipher.doFinal(plaintext.getBytes(UTF8));
    return new String(Base64.encodeBase64(encrypted));
  }

  public static String enc(String plaintext, String def) {
    try {
      return encrypt(HC_DEF_AES_SALT, HC_DEF_AES_IV, HC_DEF_AES_PASSPHRASE, plaintext, 1000, 128);
    } catch (Exception ignore) {
      return def;
    }
  }

  public static String dec(String ciphertext, String def) {
    try {
      return decrypt(HC_DEF_AES_SALT, HC_DEF_AES_IV, HC_DEF_AES_PASSPHRASE, ciphertext, 1000, 128);
    } catch (Exception ignore) {
      return def;
    }
  }

  public static byte[] evpkdf(byte[] password, int keysize, int ivsize, byte[] salt, byte[] keybuf, byte[] ivbuf) throws NoSuchAlgorithmException {
    return evpkdf(password, keysize, ivsize, salt, 1, "MD5", keybuf, ivbuf);
  }
 
  public static byte[] evpkdf(byte[] password, int keysize, int ivsize, byte[] salt, int iterations, String algorithm, byte[] keybuf, byte[] ivbuf) throws NoSuchAlgorithmException {
    keysize = keysize / 32;
    ivsize = ivsize / 32;
    int targetKeySize = keysize + ivsize;
    byte[] ret = new byte[targetKeySize * 4];
    int numberOfDerivedWords = 0;
    byte[] block = null;
    MessageDigest hasher = MessageDigest.getInstance(algorithm);
    while (numberOfDerivedWords < targetKeySize) {
      if (block != null) {
        hasher.update(block);
      }
      hasher.update(password);
      /** Salting */  
      block = hasher.digest(salt);
      hasher.reset();
      /** Iterations : 키 스트레칭(key stretching) */
      for (int inx = 1; inx < iterations; inx++) {
        block = hasher.digest(block);
        hasher.reset();
      }
      System.arraycopy(block, 0, ret, numberOfDerivedWords * 4, Math.min(block.length, (targetKeySize - numberOfDerivedWords) * 4));
      numberOfDerivedWords += block.length / 4;
    }
    System.arraycopy(ret, 0, keybuf, 0, keysize * 4);
    System.arraycopy(ret, keysize * 4, ivbuf, 0, ivsize * 4);
    /** key + iv */
    return ret; 
  }
}