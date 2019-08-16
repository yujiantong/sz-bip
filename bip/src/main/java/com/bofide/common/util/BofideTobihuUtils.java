package com.bofide.common.util;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.MissingResourceException;
import java.util.ResourceBundle;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import com.bofide.bip.mapper.StoreMapper;
import com.bofide.bip.po.ReportData;
import com.bofide.bip.po.Store;
import com.bofide.bip.service.BiHuService;
import com.bofide.bip.service.StoreService;


/**
 * <p>Title: BofideTobihuUtils</p>
 * <p>Description: 用于与壁虎车险对接时参数与url的拼装，配置信息从bofideTobihuConfig.properties读取
 * </p>
 *
 * @author lixuhua
 * @date 2016年12月05日 下午10:27:33
 */
public class BofideTobihuUtils {
	
	private static Logger logger = Logger.getLogger(BofideTobihuUtils.class);
	
	/**
	 * 从配置文件获取参数
	 * @param bundle_name  资源文件名
	 * @param key 对应的键名
	 * @return  String  返回对应key的value值，查询不到文件或者对应key信息则返回null
	 */
	public static String getLgend(String bundle_name, String key) {
		try {

			return ResourceBundle.getBundle(bundle_name).getString(key);
		} catch (MissingResourceException e) {
			logger.info(bundle_name+"文件中无该key("+key+")信息");
			return null;
		}
	}
	
	 /**
     * 向指定URL发送GET方法的请求
     * 
     * @param urlName 
     * 			  bofideTobihuConfig.properties文件中应的URL key
     * @param param
     *            请求参数，请求参数应该是 name1=value1&name2=value2 的形式。
     * @return URL 所代表远程资源的响应结果
     */
    public static String sendGet(String urlName, String param,String bihuKey) {
    	return HttpRequest.sendGet(urlAssembled(urlName, param,bihuKey));
    }
	

	/**
	 * 从bofideTobihuConfig.properties读取配置信息，然后对与壁虎车险进行访问的url进行拼装
	 * @param urlName bofideTobihuConfig.properties文件中应的URL key
	 * @param param 进行GET请求“？”后面的参数，请求参数，请求参数应该是 name1=value1&name2=value2 的形式。
	 * 				参数中不包括custKey，bihuKey，agent，secCode，这4个参数此方法会自动拼接
	 * @return 返回可以访问壁虎车险的url
	 */
	public static String urlAssembled(String urlName, String urlParam,String bihuKey) {
		BofideTobihuUtils bofideTobihuUtils = new BofideTobihuUtils();
		String url = getLgend("bofideTobihuConfig", urlName);
		if(bihuKey==null){
			return null;
		}
		String secCode = SecurityEncodeUtils.md5("Group=1&"+urlParam+bihuKey);
		url = url+"?"+ urlParamEncoder("Group=1&"+urlParam + "&SecCode="+secCode);	
		return url; 
	}
	
	/**
	 * 对url请求参数进行URL编码
	 * @param urlParam 进行GET请求“？”后面的参数，请求参数，请求参数应该是 name1=value1&name2=value2 的形式。
	 * 
	 * @return 返回URL编码后的字符串
	 */
	public static String urlParamEncoder(String urlParam){
		
		String[] urlArray = urlParam.split("&");
		try {
		for (int i = 0; i < urlArray.length; i++) {
				urlArray[i] = urlArray[i].substring(0,urlArray[i].indexOf("=")+1)
						+URLEncoder.encode(urlArray[i].substring(urlArray[i].indexOf("=")+1),"utf-8");
		}
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			logger.info("URL编码失败，失败参数："+urlArray,e);
		}
		String urlParamEncoder = "";
		
		for (int i = 0; i < urlArray.length; i++) {
			if(i>0){
				urlParamEncoder = urlParamEncoder + "&" + urlArray[i];
			}else {
				urlParamEncoder += urlArray[i];
			}
		}
		
		return urlParamEncoder;
	}	
	
	public static void main(String[] args) {
		//String s = sendGet("getreinfoUrl", "LicenseNo=粤B6706C&CityCode=1");
		/*String s = sendGet("postPrecisePriceUrl", "LicenseNo=粤B6706C&QuoteGroup=2&"
				+ "SubmitGroup=2&CityCode=1&ForceTax=2");*/
		//String s = sendGet("getCreditInfoUrl", "LicenseNo=粤B6706C");
		/*CarVin":"LGXC16AF3B0092419"  "EngineNo":"211043087" "RegisterDate":"2011-08-17""
				+ ""ModleName":"比亚迪QCJ7150A6轿车"*/		
		//String s = sendGet("getPrecisePriceUrl", "LicenseNo=粤B6706C&QuoteGroup=2");
		//String s = sendGet("getSubmitInfoUrl", "LicenseNo=粤B6706C&QuoteGroup=2");
		//System.out.println(s);
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("aa", "aa");
		String b = (String) map.get("bb");
		System.out.println(b);
		
	}
	
}
