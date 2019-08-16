package com.bofide.bip.service;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.bofide.bip.mapper.ModuleSetMapper;
import com.bofide.bip.po.ModuleSet;

@Service(value = "moduleSetService")
public class ModuleSetService {
	@Resource(name="moduleSetMapper")
	private ModuleSetMapper moduleSetMapper;

	/**
	 * 根据4s店id和模块名称更新记录
	 * @param moduleSet
	 */
	public int updateByFoursIdAndMoName(ModuleSet moduleSet) {
		return moduleSetMapper.updateByFoursIdAndMoName(moduleSet);
	}

}
