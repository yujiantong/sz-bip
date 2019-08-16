package com.bofide.bip.service;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import com.bofide.bip.mapper.VenderMapper;
import com.bofide.bip.po.Vender;

@Service(value = "venderService")
public class VenderService {
	@Resource(name = "venderMapper")
	private VenderMapper venderMapper;
	
	/**
	 * 新增厂家
	 * @param vender
	 * @return
	 * @throws Exception
	 */
	public int insert(Vender vender) throws Exception{
		int venderId = 0;//厂家id  为-1时，表示该厂家已存在，新增失败
		String venderName = vender.getVenderName();
		Vender ve = venderMapper.selectByVenderName(venderName);
		if(ObjectUtils.isEmpty(ve)){
			venderMapper.insert(vender);
			venderId = vender.getId();
		}else{
			venderId = -1;
		}
		return venderId;
	}
	
	/**
	 * 修改厂家
	 * @param vender
	 * @return
	 * @throws Exception
	 */
	public void update(Vender vender) throws Exception{
		venderMapper.update(vender);
	}
	
	/**
	 * 按条件查询厂家
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> findVenderByCondition(Map<String, Object> map) throws Exception {
		List<Map<String, Object>> lists = venderMapper.findVenderByCondition(map);
		return lists;
	}

}
