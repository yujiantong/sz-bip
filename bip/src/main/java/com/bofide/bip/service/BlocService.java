package com.bofide.bip.service;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.bofide.bip.mapper.BlocMapper;
import com.bofide.bip.mapper.StoreMapper;
import com.bofide.bip.mapper.UserMapper;
import com.bofide.bip.po.Bloc;
import com.bofide.bip.po.Store;
import com.bofide.bip.po.User;
import com.bofide.common.util.SecurityUtils;

@Service(value = "blocService")
public class BlocService {
	@Resource(name = "userMapper")
	private UserMapper userMapper;
	@Resource(name = "blocMapper")
	private BlocMapper blocMapper;
	@Resource(name = "storeMapper")
	private StoreMapper storeMapper;
	
	public List<Bloc> findByCondition(Map<String,Object> param) throws Exception{
		return blocMapper.findByCondition(param);
	}
	
	public int insert(Bloc bloc) throws Exception{
		int jtId = -1;
		Map<String, Object> param = new HashMap<>();
		param.put("jtShortName", bloc.getJtShortName());
		param.put("jtDeleted", 0);
		List<Bloc> blocList = blocMapper.findByCondition(param);
		Store exitsStore = storeMapper.selectByShortName(bloc.getJtShortName());
		if(blocList.size() == 0 && exitsStore == null){
			String serPassword = SecurityUtils.encryptAES(bloc.getJtAdminPassword(),SecurityUtils.BOFIDE_KEY);
			bloc.setJtAdminPassword(serPassword);
			blocMapper.insert(bloc);
			jtId = bloc.getJtId();
			//往用户表同步一条用户记录
			User user = new User();
			user.setStoreId(0);
			user.setJtId(jtId);
			user.setLoginName(bloc.getJtAdminAccount());
			user.setPassword(bloc.getJtAdminPassword());
			user.setRoleId(40);// 集团管理员角色id
			user.setUserName(bloc.getJtAdminAccount());
			user.setCreateDate(new Date());
			user.setDeleted(0);
			userMapper.insert(user);
		}
		
		return jtId;
	}
	
	public void updateSelectiveById(Map<String,Object> param) throws Exception{
		blocMapper.updateSelectiveById(param);
	}
	
	public void deleteSoftById(Map<String,Object> param) throws Exception{
		blocMapper.updateSelectiveById(param);
		param.put("deleted", 1);
		param.put("deleteDate", new Date());
		//删除集团下面的所有用户,软删除
		userMapper.deleteUserByJtid(param);
	}
	
	public boolean findExistByCondition(Map<String,Object> param) throws Exception{
		String jtShortName = param.get("jtShortName")==null ? "" : param.get("jtShortName").toString();
		List<Bloc> list = blocMapper.findExistByCondition(param);
		//校验集团中是否已经存在校验项
		if (list.size()>0) {
			return true;
		} else {
			if ("".equals(jtShortName)) {
				return false;
			} else {
				//对于集团缩写名的校验, 还需要校验4s店是不是已经有了该缩写名
				Map<String, Object> storeMap = new HashMap<>();
				storeMap.put("shortStoreName", jtShortName);
				List<Store> storeList = storeMapper.findStoreByCondition(storeMap);
				if (storeList.size() > 0) {
					return true;
				} else {
					return false;
				}
			}
		}
	}
}
