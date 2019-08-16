package com.bofide.bip.controller;

import org.junit.Before;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class AssignControllerTest {
	private ApplicationContext applicationContext;
	private AssignController assignController;
	@Before
	public void setUp() throws Exception {
		applicationContext = new ClassPathXmlApplicationContext("classpath:spring/applicationContext.xml");
		assignController = (AssignController) applicationContext.getBean("assignController");
	}
	
	@Test
	public void systemAssignRenewalCustomerTest(){
		try {
			assignController.systemAssignRenewalCustomerForTest();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	
}
