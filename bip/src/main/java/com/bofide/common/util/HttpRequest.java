package com.bofide.common.util;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.ConnectException;
import java.net.HttpURLConnection;
import java.net.SocketTimeoutException;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;
import java.util.MissingResourceException;
import java.util.ResourceBundle;

import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.util.EntityUtils;
import org.apache.log4j.Logger;
import net.sf.json.JSONObject;
import org.apache.http.client.config.RequestConfig;

public class HttpRequest {
	
	private static Logger logger = Logger.getLogger(BofideTobihuUtils.class);
	
    /**
     * 向指定URL发送GET方法的请求
     * 
     * @param url
     *            发送请求的URL
     * @return URL 所代表远程资源的响应结果
     */
	public static String sendGet(String url) {
        String result = "";
        BufferedReader in = null;
        try {
            String urlNameString = url;
            URL realUrl = new URL(urlNameString);
            // 打开和URL之间的连接
            HttpURLConnection connection = (HttpURLConnection) realUrl.openConnection();
            // 设置通用的请求属性
            connection.setRequestProperty("accept", "*/*");
            connection.setRequestProperty("connection", "Keep-Alive");
            connection.setRequestProperty("user-agent",
                    "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1;SV1)");
            connection.setConnectTimeout(60000);
            connection.setReadTimeout(60000);
            // 建立实际的连接
            connection.connect();
            // 获取所有响应头字段
            //Map<String, List<String>> map = connection.getHeaderFields();
            Map<String, Object> map2 = httpResponseCodeDealWith(connection.getResponseCode(),url);
            // 遍历所有的响应头字段
            /*for (String key : map.keySet()) {
                System.out.println(key + "--->" + map.get(key));
            }*/
            if(map2.get("status").equals(true)){
	            // 定义 BufferedReader输入流来读取URL的响应
	            in = new BufferedReader(new InputStreamReader(
	                    connection.getInputStream()));
	            String line;
	            while ((line = in.readLine()) != null) {
	                result += line;
	            }
            }else {
            	result = "{\"BusinessStatus\":-1,\"StatusMessage\":\""+map2.get("message").toString()
						+"\",\"responCode\":\""+connection.getResponseCode()+"\",\"success\":"+false+"}";
            }
        } catch (SocketTimeoutException e) {
        	logger.info("GET请求超时！异常url:"+url);
        	result = "{\"BusinessStatus\":-1,\"StatusMessage\":\""+"GET请求超时！"
					+"\",\"responCode\":\"497\",\"success\":"+false+"}";
        } catch (ConnectException e) {
        	logger.info("GET请求被拒绝！请确认服务器是否正常开启！异常url:"+url);
        	result = "{\"BusinessStatus\":-1,\"StatusMessage\":\""+"GET请求被拒绝！请确认服务器是否正常开启！"
					+"\",\"responCode\":\"498\",\"success\":"+false+"}";
        } catch (Exception e) {
        	logger.info("发送GET请求出现异常！异常url:"+url,e);
        	result = "{\"BusinessStatus\":-1,\"StatusMessage\":\""+"发送GET请求出现异常！"
					+"\",\"responCode\":\"499\",\"success\":"+false+"}";
        }
        // 使用finally块来关闭输入流
        finally {
            try {
                if (in != null) {
                    in.close();
                }
            } catch (Exception e2) {
                e2.printStackTrace();
            }
        }
        return result;
    }

    /**
     * 向指定 URL 发送POST方法的请求
     * 
     * @param url
     *            发送请求的 URL
     * @param param
     *            请求参数，请求参数应该是 name1=value1&name2=value2 的形式。
     * @return 所代表远程资源的响应结果
     */
	public static String sendPost(String url, String param) {
    	OutputStreamWriter out = null;
        BufferedReader in = null;
        String result = "";
        try {
            URL realUrl = new URL(url);
            HttpURLConnection conn = (HttpURLConnection) realUrl.openConnection();

            // 发送POST请求必须设置如下两行
            conn.setDoOutput(true);
            conn.setDoInput(true);
            conn.setRequestMethod("POST");    // POST方法

            // 设置通用的请求属性
            conn.setRequestProperty("accept", "*/*");
            conn.setRequestProperty("connection", "Keep-Alive");
            conn.setRequestProperty("user-agent",
                    "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1;SV1)");
            conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
            conn.connect();
            // 获取URLConnection对象对应的输出流
            out = new OutputStreamWriter(conn.getOutputStream(), "UTF-8");
            // 发送请求参数
            out.write(param);
            // flush输出流的缓冲
            out.flush();
         // 获取所有响应头字段
            //Map<String, List<String>> map = conn.getHeaderFields();
            Map<String, Object> map2 = httpResponseCodeDealWith(conn.getResponseCode(),url);
            if(map2.get("status").equals(true)){
	            // 定义 BufferedReader输入流来读取URL的响应
	            in = new BufferedReader(new InputStreamReader(
	            		conn.getInputStream()));
	            String line;
	            while ((line = in.readLine()) != null) {
	                result += line;
	            }
            }else {
            	result = "{\"BusinessStatus\":-1,\"StatusMessage\":\""+map2.get("message").toString()
						+"\",\"responCode\":\""+conn.getResponseCode()+"\",\"success\":"+false+"}";
			}
      
        } catch (SocketTimeoutException e) {
        	logger.info("POST请求超时！异常url:"+url);
        	result = "{\"BusinessStatus\":-1,\"StatusMessage\":\""+"POST请求超时！"
					+"\",\"responCode\":\"497\",\"success\":"+false+"}";
        } catch (ConnectException e) {
        	logger.info("POST请求被拒绝！请确认服务器是否正常开启！异常url:"+url);
        	result = "{\"BusinessStatus\":-1,\"StatusMessage\":\""+"POST请求被拒绝！请确认服务器是否正常开启！"
					+"\",\"responCode\":\"498\",\"success\":"+false+"}";
        } catch (Exception e) {
        	logger.info("发送POST请求出现异常！异常url:"+url,e);
        	result = "{\"BusinessStatus\":-1,\"StatusMessage\":\""+"发送POST请求出现异常！"
					+"\",\"responCode\":\"499\",\"success\":"+false+"}";
        }
        //使用finally块来关闭输出流、输入流
        finally{
            try{
                if(out!=null){
                    out.close();
                }
                if(in!=null){
                    in.close();
                }
            }
            catch(IOException ex){
                ex.printStackTrace();
            }
        }
        return result;
    }    
    
    /**
     * 对http状态码进行处理
     * @param httpResponseCode http状态码
     * @return
     */
    public static Map<String, Object> httpResponseCodeDealWith(Integer httpResponseCode,String url){
    	Map<String, Object> map = new HashMap<String, Object>();
    	String responCode = httpResponseCode.toString();
    	if(responCode.equals("200")){
    		map.put("status", true);
    		map.put("message", getLgend("httpResponseCode", responCode));
    		logger.info("状态码:"+responCode+";url:"+url);
    	}else if (responCode.equals("202")) {
    		map.put("status", true);
    		map.put("message", getLgend("httpResponseCode", responCode));
    		logger.info("异常码:"+responCode+";异常url:"+url);
		}else if (responCode.equals("429")) {
    		map.put("status", false);
    		map.put("message", getLgend("httpResponseCode", responCode));
    		logger.info("异常码:"+responCode+";异常url:"+url);
		}else {
			map.put("status", false);
    		map.put("message", getLgend("httpResponseCode", responCode));
    		logger.info("异常码:"+responCode+";异常url:"+url);
		}
    	return map;
    }
    
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
	 * 云之讯短信(模板)发送请求(最新请求方式)
	 * @param to 接收短信方的号码
	 * @param params 短信模板里面的参数
	 */
	public static String sendMessagePost(String to,String params,String templateId){
		String accountSid = BofideTobihuUtils.getLgend("messageConfig", "accountSid");
		String authToken = BofideTobihuUtils.getLgend("messageConfig", "authToken");
		String server = BofideTobihuUtils.getLgend("messageConfig", "server");
		String appId = BofideTobihuUtils.getLgend("messageConfig", "appId");
		//组装参数
		JSONObject body = new JSONObject();
		body.put("sid", accountSid);
		body.put("token", authToken);
		body.put("appid", appId);
		body.put("templateid", templateId);
		body.put("param", params);
		body.put("mobile", to);
		String result ="";
		String charset = "UTF-8";
			CloseableHttpClient httpClient = null;
			HttpPost httpPost = null;
			try {
				//拼接请求路径
				StringBuffer sb = new StringBuffer("https://");
				String url = sb.append(server).toString();
				httpClient = HttpConnectionManager.getInstance().getHttpClient();
				httpPost = new HttpPost(url);
				
				// 设置连接超时,设置读取超时
				RequestConfig requestConfig = RequestConfig.custom()
						.setConnectTimeout(10000)	
		                .setSocketTimeout(10000)	
		                .build();
				httpPost.setConfig(requestConfig);
				httpPost.setHeader("Accept", "application/json");
				httpPost.setHeader("Content-Type", "application/json;charset=utf-8");
				
				// 设置参数
				String bodyJson = body.toString();
				logger.info("定时任务营销短信请求参数："+bodyJson);
				StringEntity se = new StringEntity(bodyJson, "UTF-8");
				httpPost.setEntity(se);
				CloseableHttpResponse response = httpClient.execute(httpPost);
				if (response != null) {
					HttpEntity resEntity = response.getEntity();
					if (resEntity != null) {
						result = EntityUtils.toString(resEntity, charset);
					}
				}
			} catch (Exception e) {
				logger.info("发送短信时出现异常",e);
			}
		return result;
	}
	/**
     * 向指定URL发送GET方法的请求
     * @param url 发送请求的URL
     * @return String 所代表远程资源的响应结果
     */
	public static String sendGetRequest(String url) {
        String result = "";
        BufferedReader in = null;
        try {
            String urlNameString = url;
            URL realUrl = new URL(urlNameString);
            // 打开和URL之间的连接
            HttpURLConnection connection = (HttpURLConnection) realUrl.openConnection();
            // 设置通用的请求属性
            connection.setRequestProperty("accept", "*/*");
            connection.setRequestProperty("connection", "Keep-Alive");
            connection.setRequestProperty("user-agent",
                    "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1;SV1)");
            connection.setConnectTimeout(60000);
            connection.setReadTimeout(60000);
            // 建立实际的连接
            connection.connect();
            // 获取所有响应头字段
            Map<String, Object> map2 = httpResponseCodeDealWith(connection.getResponseCode(),url);
            if(map2.get("status").equals(true)){
	            // 定义 BufferedReader输入流来读取URL的响应
	            in = new BufferedReader(new InputStreamReader(
	                    connection.getInputStream()));
	            String line;
	            while ((line = in.readLine()) != null) {
	                result += line;
	            }
            }else {
            	result = "{\"message\":\""+map2.get("message").toString()
						+"\",\"responCode\":\""+connection.getResponseCode()+"\",\"success\":"+false+"}";
            }
        } catch (SocketTimeoutException e) {
        	logger.info("GET请求超时！异常url:"+url);
        	result = "{\"message\":\""+"GET请求超时！"
					+"\",\"responCode\":\"497\",\"success\":"+false+"}";
        } catch (ConnectException e) {
        	logger.info("GET请求被拒绝！请确认服务器是否正常开启！异常url:"+url);
        	result = "{\"message\":\""+"GET请求被拒绝！请确认服务器是否正常开启！"
					+"\",\"responCode\":\"498\",\"success\":"+false+"}";
        } catch (Exception e) {
        	logger.info("发送GET请求出现异常！异常url:"+url,e);
        	result = "{\"message\":\""+"发送GET请求出现异常！"
					+"\",\"responCode\":\"499\",\"success\":"+false+"}";
        }
        // 使用finally块来关闭输入流
        finally {
            try {
                if (in != null) {
                    in.close();
                }
            } catch (Exception e2) {
                e2.printStackTrace();
            }
        }
        return result;
    }
	
    public static void main(String[] args) {
        //发送 GET 请求
//        String s=HttpRequest.sendGet("http://iu.91bihu.com/api/CarInsurance/getreinfo?LicenseNo=%E4%BA%ACNGN692&CityCode=1&agent=66650&CustKey=bofideToBiHu&SecCode=50958e32ba7b9b84ee382d0fe92898ac");
//        System.out.println(s);
        
        //发送 POST 请求
        //String sr=HttpRequest.sendPost("http://localhost:6144/Home/RequestPostString", "key=123&v=456");
        //System.out.println(sr);
    	String result = sendMessagePost("18146681129","隔壁老王,BJBF,http://www.baidu.com","237913");
		//String result = sendMessagePost("18146681129,13247638585","隔壁老王,BJBF,index");
		System.out.println(result);
		
    }
}