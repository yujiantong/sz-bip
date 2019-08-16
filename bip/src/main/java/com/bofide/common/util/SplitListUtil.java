package com.bofide.common.util;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

import cn.jiguang.common.utils.StringUtils;



public class SplitListUtil {
	/** 
     * 分割List 
     * 
     * @param list 待分割的list 
     * @param pageSize    每段list的大小 
     * @return List<<List<T>> 
     */ 
	public static <T> List<List<T>> splitList(List<T> list, int pageSize) {  
        int listSize = list.size(); // list的大小  
        int page = (listSize + (pageSize - 1)) / pageSize;// 页数  
        List<List<T>> listArray = new ArrayList<List<T>>();// 创建list数组,用来保存分割后的list  
        for (int i = 0; i < page; i++) { // 按照数组大小遍历  
            List<T> subList = new ArrayList<T>(); // 数组每一位放入一个分割后的list  
            for (int j = 0; j < listSize; j++) {// 遍历待分割的list  
                int pageIndex = ((j + 1) + (pageSize - 1)) / pageSize;// 当前记录的页码(第几页)  
                if (pageIndex == (i + 1)) {// 当前记录的页码等于要放入的页码时  
                    subList.add(list.get(j)); // 放入list中的元素到分割后的list(subList)  
                }  
                if ((j + 1) == ((j + 1) * pageSize)) {// 当放满一页时退出当前循环  
                    break;  
                }  
            }  
            listArray.add(subList);// 将分割后的list放入对应的数组的位中  
        }  
        return listArray;  
    }

	/**
     * 
     * 方法描述 隐藏手机号中间位置字符，显示前三后三个字符
     *
     * @param phoneNo
     * @return
     * 
     * @author yaomy
     * @date 2018年4月3日 上午10:38:51
     */
    public static String hidePhoneNo(String phoneNo) {
        if(StringUtils.isEmpty(phoneNo)) {
            return phoneNo;
        }

        int length = phoneNo.length();
        int beforeLength = 3;
        int afterLength = 3;
        //替换字符串，当前使用“*”
        String replaceSymbol = "*";
        StringBuffer sb = new StringBuffer();
        for(int i=0; i<length; i++) {
            if(i < beforeLength || i >= (length - afterLength)) {
                sb.append(phoneNo.charAt(i));
            } else {
                sb.append(replaceSymbol);
            }
        }

        return sb.toString();
    }
    public static String base64Decode(String data)
    {
    	String pwdDe ="";
    	try {
			Base64.Encoder encoder = Base64.getEncoder();
			Base64.Decoder decoder = Base64.getDecoder();
			 pwdDe = new String(decoder.decode(data),"UTF-8");
			
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
       return pwdDe;
    }
}
