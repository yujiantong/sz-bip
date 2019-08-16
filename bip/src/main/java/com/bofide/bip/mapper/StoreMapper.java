package com.bofide.bip.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import com.bofide.bip.po.Store;

public interface StoreMapper {
	
	/**
     * 查询所有4s店记录
     */
    List<Store> selectAll() throws Exception;
    
    /**
     * 新增4s店记录
     */
    int insert(Store store) throws Exception;
    
    /**
     * 根据主键删除4s店记录
     */
    int deleteByPrimaryKey(@Param("storeId")Integer storeId) throws Exception;
    
    /**
     * 根据主键查询4s店记录
     */
    Store selectByPrimaryKey(@Param("storeId")Integer storeId) throws Exception;
    
    /**
     * 根据主键删除4s店记录(软删除)
     */
    int updateByPrimaryKey(@Param("storeId")Integer storeId) throws Exception;
    
    /**
     * 根据AM账号查询4s店记录
     */
    Store selectByShortName(@Param("shortStoreName")String shortStoreName) throws Exception;
    
    /**
     * 修改4s店记录
     */
    int updateStore(Store store) throws Exception;

	void updateStoreInfoById(Store store)throws Exception;

	void updateStoreImportStatu()throws Exception;

	void updateByStoreId(Map<String, Object> param)throws Exception;
	/**
	 * 查询bip所有的店（如果有绑定则显示联通一起查询出来，没有则不查询bsp店）
	 * @return
	 */
	List<Store> findBandedStore(Map<String, Object> param)throws Exception;

	Store findBipStoreByBspStoreId(Map<String, Object> param)throws Exception;
	
	/**
	 * 根据事业部门ID把店的事业部门的ID赋空
	 * @param unitId
	 * @return
	 * @throws Exception
	 */
	int updateByUnitId (@Param("unitId")Integer unitId) throws Exception;
	
	/**
	 * 根据不同条件查询4s店
	 * @param param
	 * @return
	 * @throws Exception
	 */
	List<Store> findStoreByCondition(Map<String, Object> param) throws Exception;

	/**
	 * 修改充值金额
	 * @param store
	 * @return
	 * @throws Exception
	 */
	int messageRecharge(Store store) throws Exception;

	/**
	 * 修改4S店营销短信开启状态
	 * @param store
	 * @return
	 * @throws Exception
	 */
	int updateStoreMessage(Store store) throws Exception;
}
