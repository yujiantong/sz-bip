package com.bofide.bip.mapper;

import java.util.List;
import java.util.Map;

import com.bofide.bip.po.Reason;

public interface ReasonMapper {
	/**
	 * 新增回退失销原因
	 * @param reason
	 * @return
	 * @throws Exception
	 */
	int insert(Reason reason) throws Exception;
	
	/**
	 * 修改回退失销原因
	 * @param param
	 * @throws Exception
	 */
	void update(Map<String, Object> param) throws Exception;
	
	/**
	 *  删除回退失销原因
	 * @param param
	 * @throws Exception
	 */
	void deleteById(Map<String, Object> param) throws Exception;
	
	/**
	 * 按条件查询回退失销原因
	 * @param param
	 * @return
	 * @throws Exception
	 */
	List<Map<String, Object>> findReasonByCondition(Map<String, Object> param) throws Exception;
	
	/**
	 * 查询回退失销原因的下拉框 
	 * @param param
	 * @return
	 * @throws Exception
	 */
	List<Map<String, Object>> findForSelectData(Map<String, Object> param) throws Exception;
}
