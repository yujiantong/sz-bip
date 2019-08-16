package com.bofide.bip.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.Before;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.fasterxml.jackson.databind.ObjectMapper;

public class BiHuServiceTest {
	private ApplicationContext applicationContext;
	private BiHuService biHuService;
	//在setUp这个方法得到spring容器
	@Before
	public void setUp() throws Exception {
		applicationContext = new ClassPathXmlApplicationContext("classpath:spring/applicationContext.xml");
		biHuService = (BiHuService) applicationContext.getBean("biHuService");
	}
	
	@Test
	public void getUKeyListTest(){
		Map<String,Object> map = new HashMap<>();
		map.put("Source", 1);
		try {
			biHuService.getUKeyList(map,50);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		};
	}
	
	@Test
	public void editAgentUKeyTest(){
		Map<String,Object> map = new HashMap<>();
		map.put("UserCode", "zky");
		map.put("UkeyId", "400");
		map.put("OldPassWord", "123456");
		map.put("NewPassWord", "12345678");
		try {
			biHuService.editAgentUKey(map, 50);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		};
	}
	
	@Test
	public void getCarInfoTest(){
		Map<String,Object> map1 = new HashMap<>();
		map1.put("vehicleLicenceCode", "");
		map1.put("vehicleFrameNo", "LVHFA163985032287");
		map1.put("engineNo", "3032306");
		map1.put("vin", "");
		map1.put("plateType", "02");
		try {
			Map<String, Object> result = biHuService.getCarInfo(map1, 50);
			//取出查询出的数据
			Map<String, Object> result1 = (Map<String, Object>) result.get("data");
			Map<String,Object> map2 = new HashMap<>();
			map2.put("insuranceCode", "01");
			map2.put("isDeductible", true);
			map2.put("isLossDeductible", true);
			map2.put("deductiblesAmount", 10000);
			List<Map<String,Object>> list = new ArrayList<>();
			list.add(map2);
			//加上前台传输的参数
			result1.put("quoteInsuranceVos", list);//选择的商业险险种集合
			result1.put("compulsory", true);//是否选交强险
			result1.put("commercial", true);//是否选商业险
			
			biHuService.getBxPrice(result1, 50);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		};
	}
}
