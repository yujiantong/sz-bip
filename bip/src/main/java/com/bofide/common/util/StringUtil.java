package com.bofide.common.util;

import java.util.regex.Pattern;

public class StringUtil {
	public static boolean isNumeric(String str) {
		if (str == null || "".equals(str)) {
			return false;
		}
		Pattern pattern = Pattern.compile("[0-9]*(\\.?)[0-9]*");
		return pattern.matcher(str).matches();
	}

	/**
	 * 首字母转小写
	 * 
	 * @param s
	 * @return
	 */
	public static String toLowerCaseFirstOne(String s) {
		if (Character.isLowerCase(s.charAt(0)))
			return s;
		else
			return (new StringBuilder()).append(Character.toLowerCase(s.charAt(0))).append(s.substring(1)).toString();
	}

	/**
	 * 首字母转大写
	 * 
	 * @param s
	 * @return
	 */
	public static String toUpperCaseFirstOne(String s) {
		if (Character.isUpperCase(s.charAt(0)))
			return s;
		else
			return (new StringBuilder()).append(Character.toUpperCase(s.charAt(0))).append(s.substring(1)).toString();
	}

	/**
	 * 手机电话加密
	 * 
	 * @param tel
	 * @return
	 */
	public static String turnTelF(String tel) {
		if (tel == null) {
			return "";
		}
		if (tel.length() <= 6) {
			return tel;
		}
		String telText = tel.substring(0, 3) + "****" + tel.substring(tel.length() - 4, tel.length());
		return telText;

	}
/**
 * 检验联系方式
 * @param mobile
 * @return
 */
	public static Boolean telephoneCheckout(String mobile) {
		/** 
	     * 验证手机号码（支持国际格式，+86135xxxx...（中国内地），+00852137xxxx...（中国香港）） 
	     * @param mobile 移动、联通、电信运营商的号码段 
	     *<p>移动的号段：134(0-8)、135、136、137、138、139、147（预计用于TD上网卡） 
	     *、150、151、152、157（TD专用）、158、159、187（未启用）、188（TD专用）</p> 
	     *<p>联通的号段：130、131、132、155、156（世界风专用）、185（未启用）、186（3g）</p> 
	     *<p>电信的号段：133、153、180（未启用）、189</p> 
	     * @return 验证成功返回true，验证失败返回false 
	     */  

		String regex = "(\\+\\d+)?1[3458]\\d{9}$";
		boolean matches = Pattern.matches(regex, mobile);
		/**
		 * 区号+座机号码+分机号码
		 */
		String reg = "(?:(\\(\\+?86\\))(0[0-9]{2,3}\\-?)?([2-9][0-9]{6,7})+(\\-[0-9]{1,4})?)|"
				+ "(?:(86-?)?(0[0-9]{2,3}\\-?)?([2-9][0-9]{6,7})+(\\-[0-9]{1,4})?)";
		boolean matches2 = Pattern.matches(reg, mobile);

		return matches || matches2 ? true : false;

	}

	public static void main(String[] args) {
		boolean flag = telephoneCheckout("053128374653");
		System.out.println(flag);
	}
}
