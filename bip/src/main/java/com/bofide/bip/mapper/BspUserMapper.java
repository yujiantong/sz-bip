package com.bofide.bip.mapper;

import java.util.List;
import java.util.Map;

import com.bofide.bip.po.BspUser;



public interface BspUserMapper {

	
	List<BspUser> findBspUser(Map<String, Object> param)throws Exception;

	BspUser findBspUserById(Map<String, Object> param)throws Exception;
	
	List<BspUser> findNoBindUser(Map<String, Object> param)throws Exception;

}
