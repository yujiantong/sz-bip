package com.bofide.bip.service;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.bofide.bip.mapper.StoreMapper;
import com.bofide.bip.mapper.UserMapper;
import com.bofide.bip.po.Store;

@Service(value = "storeService")
public class StoreService {
	@Resource(name="storeMapper")
	private StoreMapper storeMapper;
	@Resource(name = "userMapper")
	private UserMapper userMapper;
	public List<Store> findAllStore() throws Exception {
		List<Store> list = storeMapper.selectAll();
		return list;
	}
	
	//根据店的id去查询店的信息
	public Store findStoreById(Integer storeId) throws Exception{
		Store store = storeMapper.selectByPrimaryKey(storeId);
		return store;
	}
	//根据店的id去更新的店的信息
	public void updateStoreInfoById(Store store) throws Exception{
		storeMapper.updateStoreInfoById(store);
	}
	
	/**
	 * tomcat启动时初始化店导入状态
	 * */
	public void updateStoreImportStatu() throws Exception{
		storeMapper.updateStoreImportStatu();
	}
	/**
	 * bsp,bip同步店
	 * @param bspStoreId
	 * @param storeId
	 * @throws Exception 
	 */
	public void updateBipStore(Integer bspStoreId, Integer storeId) throws Exception {
		Map<String,Object> param = new HashMap<String,Object>();
		param.put("storeId", storeId);
		param.put("bspStoreId", bspStoreId);
		param.put("bangTime", new Date());
		param.put("bangStatu", 1);
		storeMapper.updateByStoreId(param);
	}
	/**
	 * 校验bip系统的店是否有被绑定
	 * @param storeId
	 * @return
	 * @throws Exception
	 */
	public boolean findCheckIsBang(Integer storeId) throws Exception {
		boolean isBind = false;
		Store store = storeMapper.selectByPrimaryKey(storeId);
		Integer bspStoreId = store.getBspStoreId();
		Integer bangStatu = store.getBangStatu();
		if(bspStoreId != null && bangStatu == 1){
			isBind = true;
		}
		return isBind;
	}

	public void delBangedBspStore(Integer storeId) throws Exception {
		Map<String,Object> param = new HashMap<String,Object>();
		param.put("storeId", storeId);
		param.put("bangTime", new Date());
		param.put("bangStatu", 0);
		storeMapper.updateByStoreId(param);
		userMapper.updateUnbindUserbyStoreId(param);
	}

	public boolean findCheckBspStoreIsBang(Integer bspStoreId) throws Exception {
		boolean isBind = false;
		Map<String,Object> param = new HashMap<String,Object>();
		param.put("bspStoreId", bspStoreId);
		param.put("bangStatu", 1);
		Store store = storeMapper.findBipStoreByBspStoreId(param);
		if(store != null){
			isBind = true;
		}
		return isBind;
		
	}

	public boolean findCheckBipStoreIsBang(Integer storeId) throws Exception {
		boolean isBind = false;
		Store store = storeMapper.selectByPrimaryKey(storeId);
		Integer bspStoreId = store.getBspStoreId();
		Integer bangStatu = store.getBangStatu();
		if(bspStoreId != null && bangStatu == 1){
			isBind = true;
		}
		return isBind;
	}
	
	/**
	 * 根据不同条件查询4s店
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public List<Store> findStoreByCondition(Map<String, Object> param) throws Exception{
		return storeMapper.findStoreByCondition(param);
	}
	/**
	 * 调用service修改4S店营销短信开启状态
	 * @param s
	 * @throws Exception 
	 */
	public void updateStoreMessage(Store store) throws Exception {
		storeMapper.updateStoreMessage(store);
	}
}
