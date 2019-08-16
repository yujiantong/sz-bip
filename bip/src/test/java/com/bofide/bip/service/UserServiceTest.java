package com.bofide.bip.service;

import org.junit.Before;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.bofide.bip.mapper.UserMapper;
import com.bofide.bip.service.UserService;

public class UserServiceTest {
	private ApplicationContext applicationContext;
	private UserService userService;
	//在setUp这个方法得到spring容器
	@Before
	public void setUp() throws Exception {
		applicationContext = new ClassPathXmlApplicationContext("classpath:spring/applicationContext.xml");
		userService = (UserService) applicationContext.getBean("userService");
	}
	
	@Test
	public void deleteTest(){
		//userService.delete(3);
	}
}
