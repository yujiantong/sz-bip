package com.bofide.bip.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.bofide.bip.mapper.ReasonMapper;
import com.bofide.bip.po.Reason;

@Service(value = "reasonService")
public class ReasonService {
	@Resource(name = "reasonMapper")
	private ReasonMapper reasonMapper;
	
	/**
	 * 新增回退失销原因
	 * @param reason
	 * @return
	 * @throws Exception
	 */
	public int insert(Reason reason) throws Exception{
		//原因id,为-1时，表示该原因已存在，新增失败
		int id = 0;
		String reasonName = reason.getReason();
		Integer storeId = reason.getStoreId();
		Map<String, Object> param = new HashMap<>();
		param.put("storeId", storeId);
		param.put("reason", reasonName);
		List<Map<String, Object>> reasonList = reasonMapper.findReasonByCondition(param);
		if(reasonList != null && reasonList.size() > 0){
			id = -1;
		}else{
			reasonMapper.insert(reason);
			id = reason.getId();
		}
		return id;
	}
	
	/**
	 * 修改回退失销原因
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public void update(Map<String, Object> param) throws Exception{
		reasonMapper.update(param);
	}
	
	/**
	 * 删除回退失销原因
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public void deleteById(Map<String, Object> param) throws Exception{
		reasonMapper.deleteById(param);
	}
	
	/**
	 * 按条件查询回退失销原因
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> findReasonByCondition(Map<String, Object> map) throws Exception {
		List<Map<String, Object>> lists = reasonMapper.findReasonByCondition(map);
		return lists;
	}
	
	/**
	 * 查询回退失销原因的下拉框 
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> findForSelectData(Map<String, Object> map) throws Exception {
		List<Map<String, Object>> lists = reasonMapper.findForSelectData(map);
		return lists;
	}

}
