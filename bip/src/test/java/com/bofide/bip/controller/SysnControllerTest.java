package com.bofide.bip.controller;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.List;
import java.util.Map;

import org.junit.Before;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.bofide.bip.po.BspStore;
import com.bofide.common.util.BaseResponse;


public class SysnControllerTest {
	private ApplicationContext applicationContext;
	private SysnController sysnController;
	@Before
	public void setUp() throws Exception {
		applicationContext = new ClassPathXmlApplicationContext("classpath:spring/applicationContext.xml");
		sysnController = (SysnController) applicationContext.getBean("sysnController");
	}
	
	@Test
	public void findBspStoreTest(){
		BaseResponse response = sysnController.findBspStore();
		Map<String, Object> content = response.getContent();
		List<BspStore> list = (List<BspStore>)content.get("result");
		for(BspStore bspStore : list){
			System.out.println(bspStore);
		}
	}
	
	@Test
	public void sysnBspStoreTest(){
		String storeName = null;
		Integer bspStoreId = 1;
		Integer storeId = 49;
		sysnController.sysnBspStore(storeName, bspStoreId, storeId);
		
	}
	
	
	@Test
	public void checkStoreIsBangTest(){
		Integer storeId = 49;
		BaseResponse response = sysnController.checkStoreIsBang(storeId);
		Map<String, Object> content = response.getContent();
		boolean isBang = (boolean)content.get("result");
		System.out.println(isBang);
	}
	
	
	@Test
	public void sysnBspUserTest(){
		
		String bangParam = "{\"storeId\":49,"
				+"\"bspStoreId\":1,"
				+ "\"bangUsers\":[{\"id\":204,\"bspUserId\":1},{\"id\":208,\"bspUserId\":2}]}";
		sysnController.sysnBspUser(bangParam);
	}
	
	@Test
	public void URLConnectionTest(){
		try{
			long begintime = System.currentTimeMillis();
	          
	        URL url = new URL("http://idemo.91bihu.com/api/CarInsurance/getreinfo?LicenseNo=%E4%BA%ACFF1235&CityCode=1&Agent=102&IsPublic=0&CustKey=123456789654&SecCode=ec433c1ae5bf2627135dcc2ce0425a3c&Group=1");
	        HttpURLConnection urlcon = (HttpURLConnection)url.openConnection();
	        urlcon.connect();         //获取连接
	        InputStream is = urlcon.getInputStream();
	        BufferedReader buffer = new BufferedReader(new InputStreamReader(is));
	        StringBuffer bs = new StringBuffer();
	        String l = null;
	        while((l=buffer.readLine())!=null){
	            bs.append(l).append("/n");
	        }
	        System.out.println(bs.toString());
	        System.out.println("总共执行时间为："+(System.currentTimeMillis()-begintime)+"毫秒");
	     }catch(IOException e){
	    	System.out.println(e);
	     }
	}
}
