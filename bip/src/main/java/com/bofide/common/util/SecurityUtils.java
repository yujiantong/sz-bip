package com.bofide.common.util;

import java.security.MessageDigest;
import java.security.SecureRandom;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.apache.log4j.Logger;

public class SecurityUtils {
	
	private static Logger logger = Logger.getLogger(SecurityUtils.class);

    public final static String BOFIDE_KEY = "$BOFIED_KEY_123456$";
    public final static String BOFIED_DELIMITER = "_$BOFIED$_";
    public final static String BOFIED_SPLIT_DELIMITER = "_\\$BOFIED\\$_";
	
	/**
     * AES编码
     * @param encode
     * @param key
     * @return
     */
    public static String encryptAES(String encode,String key) {
        try {
            KeyGenerator kgen = KeyGenerator.getInstance("AES");
            SecureRandom secureRandom = SecureRandom.getInstance("SHA1PRNG" ); 
            secureRandom.setSeed(key.getBytes("UTF-8")); 
            kgen.init(128, secureRandom);
            SecretKey secretKey = kgen.generateKey();
            byte[] encoded = secretKey.getEncoded();
            SecretKeySpec keySpec = new SecretKeySpec(encoded, "AES");

            Cipher cipher = Cipher.getInstance("AES");
            cipher.init(Cipher.ENCRYPT_MODE, keySpec);
            return bytesToHexString(cipher.doFinal(encode.getBytes("UTF-8")));
        } catch (Exception e) {
            logger.error("Can not encode the string " + encode + " to AES!", e);
            return null;
        }
    }

    /**
     * AES解码
     * @param decode
     * @param key
     * @return
     */
    public static String decryptAES(String decode,String key) {
        try {
            KeyGenerator kgen = KeyGenerator.getInstance("AES");
            SecureRandom secureRandom = SecureRandom.getInstance("SHA1PRNG" ); 
            secureRandom.setSeed(key.getBytes("UTF-8")); 
            kgen.init(128, secureRandom);
            SecretKey secretKey = kgen.generateKey();
            byte[] encoded = secretKey.getEncoded();
            SecretKeySpec keySpec = new SecretKeySpec(encoded, "AES");

            Cipher cipher = Cipher.getInstance("AES");
            cipher.init(Cipher.DECRYPT_MODE, keySpec);

            return new String(cipher.doFinal(hexStringToBytes(decode)));
        } catch (Exception e) {
            logger.error("Can not decode the AES bytes to string!", e);
            return null;
        }
    }

    /**
     * 二进制Byte[]转十六进制字符串
     * @param bytes
     * @return
     */
    public static String bytesToHexString(byte[] bytes) {
        StringBuilder hexString = new StringBuilder(32);
        for (int i = 0; i < bytes.length; i++) {
            if (Integer.toHexString(0xFF & bytes[i]).length() == 1)
                hexString.append("0").append(Integer.toHexString(0xFF & bytes[i]));
            else
                hexString.append(Integer.toHexString(0xFF & bytes[i]));
        }
        return hexString.toString().toUpperCase();
    }
    
    /**
     * 十六进制字符串转二进制Byte[]
     * @param hexString
     * @return
     */
    public static byte[] hexStringToBytes(String hexString) {
        hexString = hexString.toUpperCase();
        int len = (hexString.length() / 2);
        byte[] result = new byte[len];

        char[] chars = hexString.toCharArray();
        for (int i = 0; i < len; i++) {
            int pos = i * 2;
            result[i] = (byte) (toByte(chars[pos]) << 4 | toByte(chars[pos + 1]));
        }
        return result;
    }
    
    /**
     * 字符转Byte
     * @param ch
     * @return
     */
    private static byte toByte(char ch) {
        return  (byte)"0123456789ABCDEF".indexOf(ch);
    }
	
    /*** 
     * MD5加密 生成32位md5码
     * @param 待加密字符串
     * @return 返回32位md5码
     */
    public static String md5Encode(String inStr) throws Exception {
        MessageDigest md5 = null;
        try {
            md5 = MessageDigest.getInstance("MD5");
        } catch (Exception e) {
            System.out.println(e.toString());
            e.printStackTrace();
            return "";
        }

        byte[] byteArray = inStr.getBytes("UTF-8");
        byte[] md5Bytes = md5.digest(byteArray);
        StringBuffer hexValue = new StringBuffer();
        for (int i = 0; i < md5Bytes.length; i++) {
            int val = ((int) md5Bytes[i]) & 0xff;
            if (val < 16) {
                hexValue.append("0");
            }
            hexValue.append(Integer.toHexString(val));
        }
        return hexValue.toString();
    }
    
    public static void main(String[] args) {
		String password = "123456";
		String serPass = SecurityUtils.encryptAES(password,BOFIDE_KEY);
		System.out.println(serPass);
		String unserPass = SecurityUtils.decryptAES("6C0B50B26E4914471B1AD6C2173AF986", BOFIDE_KEY);
		System.out.println(unserPass);
		String serPass1 = SecurityUtils.encryptAES(password,BOFIDE_KEY);
		System.out.println(serPass1);
		String unserPass1 = SecurityUtils.decryptAES(serPass, BOFIDE_KEY);
		System.out.println(unserPass1);
	}
}
