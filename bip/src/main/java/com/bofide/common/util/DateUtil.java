package com.bofide.common.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class DateUtil {
	
	/** 
     * 两个时间之间相差距离多少天 
     * @param one 时间参数 1： 
     * @param two 时间参数 2： 
     * @return 相差天数 
     */  
    public static long getDistanceDays(Date startTime, Date endTime) throws Exception{  
        long days=0;  
        long time1 = startTime.getTime();  
		long time2 = endTime.getTime();  
		long diff ;  
		if(time1<time2) {  
		    diff = time2 - time1;  
		} else {  
		    diff = time1 - time2;  
		}  
		days = diff / (1000 * 60 * 60 * 24);  
        return diff;  
    }  
    
    
    /**
     * 日期字符串格式转日期格式
     * @throws ParseException 
     */
    public static Date toDate(String DateStr) throws ParseException{
    	SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		Date date = sdf.parse(DateStr);
    	return date;
    }
    
    /**
     * 日期格式转字符串格式
     */
    public static String toString(Date date){
    	SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		String dateStr = sdf.format(date);
		return dateStr;
    }
    /**
     * 将当前时间转成yyyy-MM-dd格式
     * @return
     * @throws ParseException
     */
    public static Date formatDate(Calendar cal) throws ParseException{
    	Integer year = cal.get(Calendar.YEAR);
    	Integer month = cal.get(Calendar.MONTH)+1;
		Integer day = cal.get(Calendar.DAY_OF_MONTH);
		StringBuffer sb = new StringBuffer();
    	sb.append(year.toString());
		sb.append("-");
		sb.append(month.toString());
		sb.append("-");
		sb.append(day.toString());
		String curDateStr = sb.toString();
		Date date = toDate(curDateStr);
		return date;
    }
    /**
     * 根据传进来的年月日组装成yyyy-MM-dd格式
     * @param year
     * @param month
     * @param day
     * @return
     * @throws ParseException
     */
    public static Date formatDate(Integer year, Integer month, Integer day) throws ParseException{
		StringBuffer sb = new StringBuffer();
    	sb.append(year.toString());
		sb.append("-");
		sb.append(month.toString());
		sb.append("-");
		sb.append(day.toString());
		String curDateStr = sb.toString();
		Date date = toDate(curDateStr);
		return date;
    }
    /**
     * 根据传进来的年月日组装成yyyy-MM-dd格式
     * @param year
     * @param month
     * @param day
     * @return
     * @throws ParseException
     */
	public static Date formatDate(String year, String month, String day) throws ParseException{
		StringBuffer sb = new StringBuffer();
		sb.append(year);
		sb.append("-");
		sb.append(month);
		sb.append("-");
		sb.append(day);
		String curDateStr = sb.toString();
		Date date = toDate(curDateStr);
		return date;
	}
	/** 
	 * 校验日期(不带时分秒)
	 *  @param 日期字符串
	 */
	public static boolean verifyDate(String date){
		String regex = "^((((19|20)\\d{2})-(0?(1|[3-9])|1[012])-(0?[1-9]|[12]\\d|30))|(((19|20)\\d{2})-(0?[13578]|1[02])-31)|(((19|20)\\d{2})-0?2-(0?[1-9]|1\\d|2[0-8]))|((((19|20)([13579][26]|[2468][048]|0[48]))|(2000))-0?2-29))$";
		Pattern p = Pattern.compile(regex);
		Matcher m = p.matcher(date);
		boolean dateFlag = m.matches();
		return dateFlag;
	}
	
	/** 
	 * 校验日期(带时分秒)
	 *  @param 日期字符串
	 */  
	public static boolean verifyDateTime(String date){
		String regex = "^((((19|20)\\d{2})-(0?(1|[3-9])|1[012])-(0?[1-9]|[12]\\d|30))|(((19|20)\\d{2})-(0?[13578]|1[02])-31)|(((19|20)\\d{2})-0?2-(0?[1-9]|1\\d|2[0-8]))|((((19|20)([13579][26]|[2468][048]|0[48]))|(2000))-0?2-29))\\s([0-1]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$";
		Pattern p = Pattern.compile(regex);
		Matcher m = p.matcher(date);
		boolean dateFlag = m.matches();
		return dateFlag;
	}

	/**
	 * 获取去年日期(不带时分秒)
	 * */
	public static String getLastYear(String endDate) throws ParseException{
		Date date = new SimpleDateFormat("yyyy-MM-dd").parse(endDate);
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.set(Calendar.YEAR, calendar.get(Calendar.YEAR)-1);
		calendar.setTimeInMillis(calendar.getTimeInMillis()+(1000*60*60*24));
		String lastYear = new SimpleDateFormat("yyyy-MM-dd").format(calendar.getTime());
		return lastYear;
	}
	
	/**
	 * 获取去年日期(带时分秒)
	 * */
	public static String getLastYearTime(String endDate) throws ParseException{
		Date date = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(endDate);
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.set(Calendar.YEAR, calendar.get(Calendar.YEAR)-1);
		calendar.setTimeInMillis(calendar.getTimeInMillis()+(1000*60*60*24));
		String lastYear = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(calendar.getTime());
		return lastYear;
	}
	
    /**
     * 将今年以前的日期的年份，设置为当年，今年以后的日期保留不变
     * */
	public static Date convertToCurrentYear(Date date) throws ParseException{
		if(date == null){
			return null;
		}
		Calendar c = Calendar.getInstance();
		c.setTime(date);
		Calendar currCalendar = Calendar.getInstance();
		currCalendar.setTime(new Date());
		if(c.get(Calendar.YEAR) < currCalendar.get(Calendar.YEAR)){
			c.set(Calendar.YEAR, currCalendar.get(Calendar.YEAR));
		}
		return c.getTime();
	}
	
	/**
	 * 返回当前日期-90天的日期的字符串
	 * @return
	 * @throws ParseException
	 */
	public static String dateJS90() throws ParseException{
		Date date = new Date();
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.set(Calendar.DATE, calendar.get(Calendar.DATE)-90);
		calendar.setTimeInMillis(calendar.getTimeInMillis()+(1000*60*60*24));
		String newDate = new SimpleDateFormat("yyyy-MM-dd").format(calendar.getTime());
		return newDate;
	}
	
	/**
	 * 返回指定日期num天的日期
	 * @param date
	 * @param num
	 * @return
	 * @throws ParseException
	 */
	public static Date ziding(Date date,Integer num) throws ParseException{
		Calendar calendar = Calendar.getInstance();
	    calendar.setTime(date);
	    calendar.add(calendar.DATE,num);
	    return calendar.getTime(); 
	}

    /**
     * 校验交强险到期日是否符合该店的下发原则
     * @param jqxrqEnd
     * @param shouCiCount
     * @return
     * @throws ParseException
     */
	public static boolean validJqxrqEnd(String jqxrqEnd,Integer shouCiCount) throws ParseException {
	    Date jqxrqEndDate= toDate(jqxrqEnd);
	    Calendar cal = Calendar.getInstance();     
        cal.setTime(new Date());     
        long time1 = cal.getTimeInMillis();                  
        cal.setTime(jqxrqEndDate);     
        long time2 = cal.getTimeInMillis();          
        long between_days=(time2-time1)/(1000*3600*24); 
        Integer betweenCount= Integer.parseInt(String.valueOf(between_days));
	    System.out.println(betweenCount);
	    if(betweenCount > 0 && betweenCount < shouCiCount ){
	    	return true;
	    }
		return false;
	}

}
