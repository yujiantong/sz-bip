package com.bofide.common.util;


import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Date;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;

import org.apache.log4j.Logger;

import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;


/**
 * <p>Title: SecurityEncodeUtils</p>
 * <p>Description:用于java与node信息加密传输，解密两端传输的加密信息</p>
 *
 * @author lixuhua
 * @date 2016年9月22日 下午4:09:59
 */
public class SecurityEncodeUtils {
	
	private static Logger logger = Logger.getLogger(SecurityEncodeUtils.class);
	
	/**
	 * 密钥
	 */
	public final static String BOFIDE_KEY = "BspAndBip";
	private final static String UTF8 = "utf-8";
	/**
	 * AES解码
	 * 
	 * @param bofide_key  解密密钥
	 * @param ciphertext  密文（待解密内容）
	 * @return  明文
	 * @throws Exception
	 */
	public static String decryptAES(String bofide_key, String ciphertext ) throws Exception {
		byte[] keyb = bofide_key.getBytes("utf-8");
		MessageDigest md = MessageDigest.getInstance("MD5");
		byte[] thedigest = md.digest(keyb);
		SecretKeySpec skey = new SecretKeySpec(thedigest, "AES");
		Cipher dcipher = Cipher.getInstance("AES");
		dcipher.init(Cipher.DECRYPT_MODE, skey);
		byte[] clearbyte = dcipher.doFinal(hexStringToBytes(ciphertext ));
		return new String(clearbyte);
	}
	
	/**
	 * AES编码
	 * 
	 * @param bofide_key  加密密钥
	 * @param cleartext	      明文（待加密内容）
	 * @return  密文
	 * @throws Exception
	 */
	public static String encryptAES(String bofide_key, String cleartext) throws Exception {
		byte[] keyb = bofide_key.getBytes("utf-8");
		MessageDigest md = MessageDigest.getInstance("MD5");
		byte[] thedigest = md.digest(keyb);
		SecretKeySpec skey = new SecretKeySpec(thedigest, "AES");
		Cipher dcipher = Cipher.getInstance("AES");
		dcipher.init(Cipher.ENCRYPT_MODE, skey);
		byte[] clearbyte = dcipher.doFinal(cleartext.getBytes("utf-8"));
		return bytesToHexString(clearbyte);
	}
	
	
	/**
     * 字符转Byte
     * @param ch
     * @return
     */
    private static byte toByte(char ch) {
        return  (byte)"0123456789ABCDEF".indexOf(ch);
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
     * 用于32位小写md5加密
     * @param sourceStr 待加密字符串
     * @return 32位小的的md5密文
     */
    public static String md5(String sourceStr) {
        String result = "";
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            md.update(sourceStr.getBytes());
            byte b[] = md.digest();
            int i;
            StringBuffer buf = new StringBuffer("");
            for (int offset = 0; offset < b.length; offset++) {
                i = b[offset];
                if (i < 0)
                    i += 256;
                if (i < 16)
                    buf.append("0");
                buf.append(Integer.toHexString(i));
            }
            result = buf.toString();
        } catch (NoSuchAlgorithmException e) {
            logger.info("MD5加密失败");
        }
        return result;
    }
    
    /**
     * 用于16位小写md5加密
     * @param sourceStr 待加密字符串
     * @return 32位小的的md5密文
     */
    public static String md5LowerCase16(String sourceStr){
    	return md5(sourceStr).substring(8, 24);
    }
    
    /** 
     * MD5数字签名 
     * @param src 
     * @return 
     * @throws Exception 
     */  
    public static String md5Digest(String src) throws Exception {  
       // 定义数字签名方法, 可用：MD5, SHA-1  
       MessageDigest md = MessageDigest.getInstance("MD5");  
       byte[] b = md.digest(src.getBytes(UTF8));  
       return byte2HexStr(b);  
    }  
      
    /** 
     * BASE64编码
     * @param src 
     * @return 
     * @throws Exception 
     */  
    public static String base64Encoder(String src) throws Exception {  
        BASE64Encoder encoder = new BASE64Encoder();  
        return encoder.encode(src.getBytes(UTF8));  
    }  
      
    /** 
     * BASE64解码
     * @param dest 
     * @return 
     * @throws Exception 
     */  
    public static String base64Decoder(String dest) throws Exception {  
        BASE64Decoder decoder = new BASE64Decoder();  
        return new String(decoder.decodeBuffer(dest), UTF8);  
    }  
      
    /** 
     * 字节数组转化为大写16进制字符串 
     * @param b 
     * @return 
     */  
    private static String byte2HexStr(byte[] b) {  
        StringBuilder sb = new StringBuilder();  
        for (int i = 0; i < b.length; i++) {  
            String s = Integer.toHexString(b[i] & 0xFF);  
            if (s.length() == 1) {  
                sb.append("0");  
            }  
            sb.append(s.toUpperCase());  
        }  
        return sb.toString();  
    }  
    
    public static void main(String[] args) {
		String nodeCiphertext = "67418b1385ba88299b00bcbb9c71b55793fa925dc8aeca2e15df31b590d"
				+ "032f97bd9638a42e807d71720717e0b41695ef4a832707fbeccc9ab4c480353694883";
    	String cleartext = "{\"time\":\"1476408036140\",\"bsp_storeId\":3,\"bsp_userId\":2}";
    	String md5text = "LicenseNo=京NGN692&CityCode=1&agent=66650&CustKey=bofideToBiHu31d45a74144";
    	String ciphertext ;
		try {
			System.out.println(new Date().getTime()+":"+new Date(1476408310144L));
			ciphertext  = SecurityEncodeUtils.encryptAES(SecurityEncodeUtils.BOFIDE_KEY,cleartext);
			System.out.println(ciphertext );
			String cleartext2  = SecurityEncodeUtils.decryptAES(SecurityEncodeUtils.BOFIDE_KEY,ciphertext);
			System.out.println(cleartext2);
			String cleartext3  = SecurityEncodeUtils.decryptAES(SecurityEncodeUtils.BOFIDE_KEY,nodeCiphertext);
			System.out.println(cleartext3);
			logger.info(md5(md5text));
			logger.info(md5LowerCase16(md5text));
			logger.info("测试加密解密成功！");
			
		}catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}
}
