package com.bofide.common.util;

import java.util.HashMap;
import java.util.Map;


/**
 * <p>Title: CoverTypeStringUtil</p>
 * <p>Description: </p>
 *	续保类型转换，由Integer类型转为String
 * @author lixuhua
 * @date 2016年10月26日 上午11:02:47
 */
public class CoverTypeStringUtil {
	
	
	/**
	 * 
	 * @param coverType  投保类型（int）
	 * @return  对应投保类型的字符串
	 * 	
	 */
	public static String integerToString(int coverType){
		Map<Integer,String> coverTypeMap = new HashMap<Integer,String>();
		coverTypeMap.put(1,"新保");
		coverTypeMap.put(2,"新转续");
		coverTypeMap.put(3,"续转续");
		coverTypeMap.put(4,"间转续");
		coverTypeMap.put(5,"潜转续");
		coverTypeMap.put(6,"首次");
		
		return coverTypeMap.get(coverType);
	}
	
}
