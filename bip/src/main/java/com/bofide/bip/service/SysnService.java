package com.bofide.bip.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bofide.bip.common.po.RoleType;
import com.bofide.bip.mapper.BspStoreMapper;
import com.bofide.bip.mapper.BspUserMapper;
import com.bofide.bip.mapper.RenewalingCustomerMapper;
import com.bofide.bip.mapper.UserMapper;
import com.bofide.bip.po.BspStore;
import com.bofide.bip.po.BspUser;
import com.bofide.bip.po.User;

@Service
public class SysnService {
	@Resource(name="bspStoreMapper")
	private BspStoreMapper bspStoreMapper;
	
	@Resource(name="renewalingCustomerMapper")
	private RenewalingCustomerMapper renewalingCustomerMapper;
	
	@Resource(name="userMapper")
	private UserMapper userMapper;
	
	@Resource(name="bspUserMapper")
	private BspUserMapper bspUserMapper;
	
	@Autowired
	private StoreService storeService;
	
	public List<BspStore> findBspStore() throws Exception {
		List<BspStore> list = bspStoreMapper.findBspStore();
		return list;
	}


	public Map<String, Object> findBipWork(Integer bspStoreId, Integer bspUserId) throws Exception {
		Map<String, Object> info = new HashMap<String, Object>();
		boolean flag = false;
		int shouldTraceNum = 0;//应跟踪数量
		int accpetNum = 0;//未接受数量
		int approveNum = 0;//待审批数量
		int outedNum = 0;//已脱保数量
		Map<String, Object> bindInfo = findCheckIsBind(bspStoreId,bspUserId);
		Integer loginStatus = (Integer)bindInfo.get("loginStatus");
		String bindMessage = (String)bindInfo.get("bindMessage");
		//确定传过来的bspStoreId和bspUserId对应的店和用户是已经绑定过了
		if(loginStatus == 1){
			Map<String, Object> param = new HashMap<String, Object>();
			//判断该bspUserId用户对于bip绑定的用户是销售顾问还是销售经理
			param.put("bspStoreId", bspStoreId);
			param.put("bspUserId", bspUserId);
			User bipUser = userMapper.findBindUserByBspUserId(param);
			List<User> users = null;
			Integer roleId = bipUser.getRoleId();
			Integer storeId = bipUser.getStoreId();
			param.put("storeId", storeId);
			if(roleId == RoleType.XSGW){//获取销售顾问未接受和应跟踪数量
				users = new ArrayList<User>();
				users.add(bipUser);
				param.put("users", users);
				param.put("traceStatu", 1);
				param.put("acceptStatu", 1);
				// 查询应跟踪
				shouldTraceNum = renewalingCustomerMapper.countFindByTraceStatu(param);
				// 查询未接收数量
				accpetNum = renewalingCustomerMapper.countFindByAcceptStatu(param);
				// 已脱保数量
				param.put("cusLostInsurStatu", 2);// 已脱保traceStatu为2
				outedNum = renewalingCustomerMapper.countFindByCusLostInsurStatu2(param);
			}else if(roleId == RoleType.XSJL){//获取销售经理待审批数量
				users = userMapper.findUndering(roleId, storeId);
				param.put("users", users);
				param.put("returnStatu", 3);
				// 查询待审批数量
				approveNum = renewalingCustomerMapper.countFindByReturnStatu(param);
			}
			
			if(outedNum > 0 || shouldTraceNum > 0 || accpetNum > 0 || approveNum > 0){
				flag = true;
				info.put("hasToDo", flag);
				info.put("bindMessage", "查询成功！");
				info.put("loginStatus", loginStatus);
			}else{
				flag = false;
				info.put("hasToDo", flag);
				info.put("bindMessage", "查询成功！");
				info.put("loginStatus", loginStatus);
			}
			
		}else{
			flag = false;
			info.put("hasToDo", flag);
			info.put("bindMessage", bindMessage);
			info.put("loginStatus", loginStatus);
		}
		return info;
	}

	/**
	 * loginStatus 为0则说明检验失败，不可以直接登录bip系统，为1时则说明校验成功
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public Map<String,Object> findBipUserByBspUserId(Map<String, Object> map) throws Exception {
		//店是否绑定的校验
		Object bspStoreId_o = map.get("bsp_storeId");
		Integer bspStoreId = Integer.parseInt(bspStoreId_o==null?"-1":bspStoreId_o.toString());
		Object bspUserId_o = map.get("bsp_userId");
		Integer bspUserId = Integer.parseInt(bspUserId_o==null?"-1":bspUserId_o.toString());
		Map<String, Object> bindInfo = findCheckIsBind(bspStoreId,bspUserId);
		return bindInfo;
	}
	
	public Map<String,Object> findCheckIsBind(Integer bspStoreId, Integer bspUserId) throws Exception{
		boolean storeIsBind = storeService.findCheckBspStoreIsBang(bspStoreId);
		Map<String,Object> bindInfo = new HashMap<String,Object>();
		if(storeIsBind == true){
			Map<String,Object> param = new HashMap<String,Object>();
			param.put("bspUserId", bspUserId);
			//用户是否绑定的校验
			User bipUser = userMapper.findBindUserByBspUserId(param);
			if(bipUser == null){
				bindInfo.put("loginStatus", 0);
				bindInfo.put("bindMessage", "该用户在BIP系统中没有绑定，请先进行用户绑定！");
				bindInfo.put("bipUser", bipUser);
			}else{
				bindInfo.put("loginStatus", 1);
				bindInfo.put("bindMessage", "登录BIP成功！");
				bindInfo.put("bipUser", bipUser);
			}
			
		} else{
			bindInfo.put("loginStatus", 0);
			bindInfo.put("bindMessage", "该店没有与BIP系统进行绑定，请先店绑定！");
		}
		return bindInfo;
	}
	//校验bipUserId对应的user或者bspUserId对应的User是否绑定过，并返回哪些用户绑定了
	public Map<String,Object> findCheckBipBspUserIsBind(Integer bipUserId, Integer bspUserId, Integer bipStoreId) throws Exception{
		boolean bipUserIsBind = false;
		boolean bspUserIdIsBind = false;
		boolean canBind = true;
		Map<String,Object> message = new HashMap<String,Object>();
		User bipUser = userMapper.findUserByIdIsNoDel(bipUserId,bipStoreId);
		Integer bangStatu = bipUser.getBangStatu();
		Integer bipBspUserId = bipUser.getBspUserId();
		if(bangStatu == 1 && bipBspUserId != null){
			bipUserIsBind = true;
			message.put("bipUserMessage", "名字为："+bipUser.getUserName()+"的用户已经绑定过了");
		}else{
			message.put("bipUserMessage", "");
		}
		Map<String,Object> param = new HashMap<String,Object>();
		param.put("bspUserId", bspUserId);
		User user = userMapper.findBindUserByBspUserId(param);
		if(user != null){
			bspUserIdIsBind = true;
			
			BspUser bspUser = bspUserMapper.findBspUserById(param);
			message.put("bspUserMessage", "名字为："+bspUser.getBspUserName()+"的用户已经绑定过了");
		}else{
			message.put("bspUserMessage", "");
		}
		//只有任意一方是绑定过的都不能在绑定
		if(bspUserIdIsBind == true || bipUserIsBind == true){
			canBind = false;
			message.put("canBind", canBind);
		}else{
			message.put("canBind", canBind);
		}
		return message;
	}
}
