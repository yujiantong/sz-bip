package com.bofide.bip.common.po;

public class ReturnStatus {
	/**
	 * 已回退
	 */
	public static int BEENRETURN = 2;
	/**
	 * 待回退
	 */
	public static int CHECKRETURN = 3;
	/**
	 * 待失销
	 */
	public static int CHECKLOST = 4;
	/**
	 * 已失销
	 */
	public static int BEENLOST = 5;
	/**
	 * 已激活
	 */
	public static int BEENWAKE = 6;
	/**
	 * 待延期
	 */
	public static int CHECKDELAY = 7;
	/**
	 * 已延期
	 */
	public static int BEENDELAY = 8;
	/**
	 * 已睡眠
	 */
	public static int SLEEP_RETURN_STATU = 9;
	/**
	 * 已唤醒
	 */
	public static int BEENACTIVE = 10;
	/**
	 * 跟踪完成
	 */
	public static int TRACK_COMPLETE = 11;
}
