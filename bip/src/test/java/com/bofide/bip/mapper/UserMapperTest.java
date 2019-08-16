package com.bofide.bip.mapper;

import org.junit.Before;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.bofide.bip.mapper.UserMapper;

public class UserMapperTest {
	private ApplicationContext applicationContext;
	private UserMapper userMapper;
	//在setUp这个方法得到spring容器
	@Before
	public void setUp() throws Exception {
		applicationContext = new ClassPathXmlApplicationContext("classpath:spring/applicationContext.xml");
		userMapper = (UserMapper) applicationContext.getBean("userMapper");
	}
	@Test
	public void  deleteTest(){
		//userMapper.delete(5);
	}
	
}
