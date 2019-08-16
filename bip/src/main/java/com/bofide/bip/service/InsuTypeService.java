package com.bofide.bip.service;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.bofide.bip.mapper.InsuTypeMapper;
import com.bofide.bip.po.InsuType;

@Service(value = "insuTypeService")
public class InsuTypeService {
	
	@Resource(name = "insuTypeMapper")
	private InsuTypeMapper insuTypeMapper;
	
	public List<InsuType> findByCondition(Map<String,Object> param) throws Exception{
		return insuTypeMapper.selectByCondition(param);
	}
	
}
