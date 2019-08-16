package com.bofide.bip.service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.converter.json.MappingJacksonValue;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;

import com.bofide.bip.common.po.RoleType;
import com.bofide.bip.exception.NoUserAssignException;
import com.bofide.bip.mapper.BspUserMapper;
import com.bofide.bip.mapper.CustomerAssignMapper;
import com.bofide.bip.mapper.CustomerMapper;
import com.bofide.bip.mapper.CustomerTraceRecodeMapper;
import com.bofide.bip.mapper.OperationRecordMapper;
import com.bofide.bip.mapper.RenewalingCustomerMapper;
import com.bofide.bip.mapper.RoleMapper;
import com.bofide.bip.mapper.StoreMapper;
import com.bofide.bip.mapper.UserMapper;
import com.bofide.bip.po.BspUser;
import com.bofide.bip.po.Customer;
import com.bofide.bip.po.CustomerAssign;
import com.bofide.bip.po.ModuleSet;
import com.bofide.bip.po.OperationRecord;
import com.bofide.bip.po.RenewalingCustomer;
import com.bofide.bip.po.Role;
import com.bofide.bip.po.Store;
import com.bofide.bip.po.TraceDaySet;
import com.bofide.bip.po.User;
import com.bofide.bip.vo.UserVo;
import com.bofide.common.util.BaseResponse;
import com.bofide.common.util.DateUtil;
import com.bofide.common.util.DealStringUtil;
import com.bofide.common.util.SecurityUtils;
import com.bofide.common.util.SplitListUtil;

import net.sf.json.JSONObject;

@Service(value = "userService")
public class UserService {
	private static Logger logger = Logger.getLogger(UserService.class);
	@Resource(name = "userMapper")
	private UserMapper userMapper;
	@Resource(name = "roleMapper")
	private RoleMapper roleMapper;
	@Resource(name = "renewalingCustomerMapper")
	private RenewalingCustomerMapper renewalingCustomerMapper;
	@Resource(name = "customerAssignMapper")
	private CustomerAssignMapper customerAssignMapper;
	@Resource(name = "customerMapper")
	private CustomerMapper customerMapper;
	@Autowired
	private StoreMapper storeMapper;
	@Autowired
	private AssignCustomerService assignCustomerService;
	@Resource(name = "bspUserMapper")
	private BspUserMapper bspUserMapper;
	@Autowired
	private SysnService sysnService;
	@Autowired
	private CommonService commonService;
	@Autowired
	private SettingService settingService;
	@Resource(name = "operationRecordMapper")
	private OperationRecordMapper operationRecordMapper;
	@Resource(name = "customerTraceRecodeMapper")
	private CustomerTraceRecodeMapper customerTraceRecodeMapper;
	@Autowired
	private CustomerService customerService;
	
	 public List<User> findAllSubordinate(Integer userId,Integer principalId,Integer storeId) throws Exception{
		 return userMapper.findAllSubordinate(userId,principalId,storeId);
	 }
	 
	 public List<User> findSubordinate(Integer userId,Integer storeId) throws Exception{
		 return userMapper.findSubordinate(userId,storeId);
	 }
	 
	 /**
	 * 根据4s店id查询记录
	 * @param storeId
	 * @return
	 * @throws Exception
	 */
	public List<User> selectByStoreId(Integer storeId) throws Exception{
		
		 return userMapper.selectByStoreId(storeId);
	 }
	
	/**
	 * 查询系统用户   --数据分析师
	 * 
	 * @return
	 * @throws Exception
	 */
	public List<User> findUser_xtyh() throws Exception{
		
		 return userMapper.findUser_xtyh();
	 }
	
	/**
	 * 根据4s店id和登录名查询记录
	 * @param storeId
	 * @return
	 * @throws Exception
	 */
	public User selectUserByStoreId(Integer storeId, String loginName) throws Exception{
		
		 return userMapper.selectUserByStoreId(storeId,loginName);
	 }
	
	/**
	 * 新增用户
	 * 
	 * @param storeId
	 * @return
	 * @throws Exception
	 */
	public Integer insertUser(User user) throws Exception {
		// 用户id兼新增结果。-1新增失败,非-1则是用户id
		Integer userId = -1;
		String password = "123456";
		//密码加密
		String serPassword = SecurityUtils.encryptAES(password,SecurityUtils.BOFIDE_KEY);
		user.setPassword(serPassword);
		user.setCreateDate(new Date());
		user.setDeleteDate(null);
		user.setDeleted(0);
		Integer roleId = user.getRoleId();
		Integer storeId = user.getStoreId();
		switch (roleId) {
		case 2:// 续保专员
		{
			//查询上级是否存在
			List<User> userList = userMapper.selectUserByroleId(storeId, 3);
			if(userList.size()>0){
				addLowUser(user, 3);
				userId = user.getId();
			}else{
				userId = -2;
			}
			break;
		}
		case 3:// 续保主管
		{
			boolean isExist = findManageUser(storeId, roleId);
			if (!isExist) {
				addHighUser(user, 2);
				userId = user.getId();
			}
			break;
		}
		case 4:// 客服经理
		{
			boolean isExist = findManageUser(storeId, roleId);
			if (!isExist) {
				addHighUser(user, 5);
				userId = user.getId();
			}
			break;
		}
		case 5:// 客服专员
		{
			//查询上级是否存在
			List<User> userList = userMapper.selectUserByroleId(storeId, 4);
			if(userList.size()>0){
				addLowUser(user, 4);
				userId = user.getId();
			}else{
				userId = -2;
			}
			break;
		}
		case 6:// 销售顾问
		{
			//查询上级是否存在
			List<User> userList = userMapper.selectUserByroleId(storeId, 7);
			if(userList.size()>0){
				addLowUser(user, 7);
				userId = user.getId();
			}else{
				userId = -2;
			}
			break;
		}
		case 7:// 销售经理
		{
			boolean isExist = findManageUser(storeId, roleId);
			if (!isExist) {
				addHighUser(user, 6);
				userId = user.getId();
			}
			break;
		}
		case 8:// 服务顾问
		{
			//查询上级是否存在
			List<User> userList = userMapper.selectUserByroleId(storeId, 9);
			if(userList.size()>0){
				addLowUser(user, 9);
				userId = user.getId();
			}else{
				userId = -2;
			}
			break;
		}
		case 9:// 服务经理
		{
			boolean isExist = findManageUser(storeId, roleId);
			if (!isExist) {
				addHighUser(user, 8);
				userId = user.getId();
			}
			break;
		}
		case 10:// 保险经理
		{
			boolean isExist = findManageUser(storeId, roleId);
			if (!isExist) {
				user.setSuperiorId(null);
				userMapper.insert(user);
				userId = user.getId();
			}
			break;
		}
		case 11:// 总经理
		{
			boolean isExist = findManageUser(storeId, roleId);
			if (!isExist) {
				user.setSuperiorId(null);
				userMapper.insert(user);
				userId = user.getId();
			}
			break;
		}
		case 21:// 信息员
		{
			boolean isExist = findManageUser(storeId, roleId);
			if (!isExist) {
				user.setSuperiorId(null);
				userMapper.insert(user);
				userId = user.getId();
			}
			break;
		}
		default:// 其他角色用户没有上下级关系
			// 没有上级设置当前用户上级id为空
			user.setSuperiorId(null);
			userMapper.insert(user);
			userId = user.getId();
			break;
		}

		return userId;
	}
	
	/**
	 * 根据id软删除用户
	 * @param storeId
	 * @return
	 * @throws Exception
	 */
	public int updateById(Integer id,Integer roleId,Integer storeId) throws Exception{
		int result = -1;// -1：下级存在，不删除 0：下级不存在，删除
		switch (roleId) {
		case 3:// 续保主管
		{
			//查询下级是否存在
			List<User> userList = userMapper.selectUserByroleId(storeId, 2);
			if(userList.size()>0){
				//下级存在
			}else{
				//更新用户的删除状态为删除时，如果该用户绑定了bsp用户则清空掉绑定bsp用户的相关数据
				userMapper.updateById(id);
				result = 0;
			}
				
			break;
		}
		case 4://客服经理
		{
			//查询下级是否存在
			List<User> userList = userMapper.selectUserByroleId(storeId, 5);
			if(userList.size()>0){
				//下级存在
			}else{
				userMapper.updateById(id);
				result = 0;
			}
				
			break;
		}
		case 7:// 销售经理
		{
			//查询下级是否存在
			List<User> userList = userMapper.selectUserByroleId(storeId, 6);
			if(userList.size()>0){
				//下级存在
			}else{
				userMapper.updateById(id);
				result = 0;
			}
				
			break;
		}
		case 9:// 服务经理
		{
			//查询下级是否存在
			List<User> userList = userMapper.selectUserByroleId(storeId, 8);
			if(userList.size()>0){
				//下级存在
			}else{
				userMapper.updateById(id);
				result = 0;
			}
				
			break;
		}
		default:// 其他角色用户没有上下级关系
			//直接删除
			userMapper.updateById(id);
			result = 0;
			break;
		}
		return result;
	 }
	

	/**
	 * 修改用户密码
	 * @param storeId
	 * @return
	 * @throws Exception
	 */
	public int updatePassword(Integer id, String password, String oldPassword) throws Exception{
		//修改密码结果 0：修改成功 1：修改失败
		int updateResult = 0;
		//先验证老密码是否正确
		//加密老密码去验证
		String serOldPassword = SecurityUtils.encryptAES(oldPassword,SecurityUtils.BOFIDE_KEY);
		User user = userMapper.verifyPassword(id, serOldPassword);
		if(!ObjectUtils.isEmpty(user)){
			Map<String,Object> param = new HashMap<String,Object>();
			param.put("id", id);
			String serPassword = SecurityUtils.encryptAES(password,SecurityUtils.BOFIDE_KEY);
			if(serOldPassword.equals(serPassword)){
				updateResult = 2;
			}else{
				param.put("password", serPassword);
				userMapper.updatePassword(param);
			}
		}else{
			updateResult = 1;
		}
		
		return updateResult;
		
	 }
	/**
	 * 修改用户密码
	 * @param storeId
	 * @return
	 * @throws Exception
	 */
	public int updatePwd(Integer  id, String password) throws Exception{
		//修改密码结果 0：修改成功 1：修改失败
		int updateResult = 0;
		try {
			Map<String,Object> param = new HashMap<String,Object>();
			param.put("id", id);
			String serPassword = SecurityUtils.encryptAES(password,SecurityUtils.BOFIDE_KEY);
			param.put("password", serPassword);
			userMapper.updatePwd(param);
		} catch (Exception e) {
			e.printStackTrace();
			updateResult =1;
		}
		
		return updateResult;
		
	 }
	
	/**
	 * 修改用户密码
	 * @param user 用户bean
	 * @return
	 * @throws Exception
	 */
	public void updateUser(User user) throws Exception{
		userMapper.updateUser(user);
		
	 }
	
	/**
	 * 重置密码
	 * @param storeId
	 * @return
	 * @throws Exception
	 */
	public void resetPassword(Integer id) throws Exception{
		Map<String,Object> param = new HashMap<String,Object>();
		param.put("id", id);
		String serPassword = SecurityUtils.encryptAES("123456",SecurityUtils.BOFIDE_KEY);
		param.put("password", serPassword);
		userMapper.resetUpdatePassword(param);
	 }
	
	/**
	 * 根据用户名重置密码
	 * @param storeId
	 * @return
	 * @throws Exception
	 */
	public void dglyResetPassword(String loginName) throws Exception{
		Map<String,Object> param = new HashMap<String,Object>();
		param.put("loginName", loginName);
		String serPassword = SecurityUtils.encryptAES("123456",SecurityUtils.BOFIDE_KEY);
		param.put("password", serPassword);
		userMapper.updatePasswordByLoginName(param);
	 }
	
	/**
	 * 查询角色配置信息
	 * @return
	 * @throws Exception
	 */
	public List<Role> selectRole() throws Exception{
		
		 return roleMapper.selectRole();
	 }
	
	/**
	 * 查询系统用户角色配置信息
	 * @return
	 * @throws Exception
	 */
	public List<Role> selectRole_xtyh() throws Exception{
		
		 return roleMapper.selectRole_xtyh();
	 }
	
	/**

	 * 新增低级用户且设置上级id
	 * 
	 * @param user 用户信息
	 * @param roleId 上级角色id
	 * @throws Exception 
	 */
	public void addLowUser(User user, Integer roleId) throws Exception{
		Integer storeId = user.getStoreId();
		//根据4s店和roleId查询上级
		List<User> userList = userMapper.selectUserByroleId(storeId, roleId);
		if(userList.size()>0){
			//有上级，设置当前用户上级id字段
			User superiorUser = userList.get(0);
			user.setSuperiorId(superiorUser.getId());
			userMapper.insert(user);
		}else{
			//没有上级设置当前用户上级id为空
			user.setSuperiorId(null);
			userMapper.insert(user);
		}
	}
	
	/**
	 * 新增高级用户且设置下级用户的上级id
	 * 
	 * @param user
	 *            用户信息
	 * @param roleId
	 *            下级角色id
	 * @param roleId
	 * @throws Exception 
	 */
	public void addHighUser(User user, Integer roleId) throws Exception {
		Integer storeId = user.getStoreId();
		// 先保存,获取主键id
		userMapper.insert(user);
		Integer userId = user.getId();
		// 根据4s店和roleId查询下级
		List<User> userList = userMapper.selectUserByroleId(storeId, roleId);
		if (userList.size() > 0) {
			// 有下级
			for (int i = 0; i < userList.size(); i++) {
				User juniorUser = userList.get(i);
				//为下级设置上级id
				Map<String,Object> param = new HashMap<String,Object>();
				param.put("id", juniorUser.getId());
				param.put("superiorId", userId);
				userMapper.updateSuperiorId(param);
			}
		}
	}
	
	/**
     * 根据登录名和密码查询用户信息
     */
	public UserVo selectUserInfo(String loginName,String password) throws Exception{

		logger.info("Java端版本号v20180629");
		logger.info("登陆账号："+loginName);
		String serPassword = SecurityUtils.encryptAES(password,SecurityUtils.BOFIDE_KEY);
		UserVo user = userMapper.selectUserInfo(loginName, serPassword);
		if(user != null){
			if(user.getStore() != null){
				List<TraceDaySet> traceDaySets = settingService.findTraceDaySet(user.getStore().getStoreId());
				user.setDaySets(traceDaySets);
				//查询是否启用台帐模块
				Map<String, Object> param = new HashMap<>();
				param.put("storeId", user.getStore().getStoreId());
				param.put("moduleName", "accountModule");
				List<ModuleSet> moduleSets = settingService.selectByCondition(param);
				if(moduleSets.size()>0){
					ModuleSet moduleSet = moduleSets.get(0);
					user.setAccountModule(moduleSet.getSwitchOn());
				}
				
			}
		}
		return user;
	 }
	
	/**
     * 根据登录名查询,验证用户名是否存在
     */
	public int selectByLoginName(String loginName) throws Exception{
		return userMapper.selectByLoginName(loginName);
	}
	/**
     * 根据登录名查询,验证用户名是否存在
	 * @param counts 
     */
	public List<User> selectByLoginNameAjax(String loginName) {
		List<User>  userList = 	userMapper.selectByLoginNameAjax(loginName);
		
		return userList;
	}
	
	/**
	 *更改用户状态(暂停禁用潜客)
	 * @param id 是被禁用的用户id
	 * @param userId 是操作禁用的用户id
	 * @return 
	 */
	public void updateUserStatus(Integer id, Integer status,Integer storeId,Integer roleId, Integer userId) throws Exception {
		String stopOrBiten = "禁用";
		if(status == 1){
			stopOrBiten = "暂停";
			User user = userMapper.selectByPrimaryKey(userId,storeId);
			String content = "你被" + user.getUserName() + "暂停了";
			Map<String,Object> messageMap = new HashMap<String,Object>();
			messageMap.put("storeId", storeId);
			messageMap.put("operatorId", userId);
			messageMap.put("operatorName",user.getUserName());
			messageMap.put("content", content);
			messageMap.put("userId", id);
			commonService.insertMessage(messageMap);
		}
		
		logger.info("---------操作日期"+new Date()+";店id为"+storeId+"，的用户id为"+userId+","+stopOrBiten+"了用户id为"+id+"，开始！---------");
		Map<String, Integer> param = new HashMap<String, Integer>();
		param.put("userId", id);
		param.put("status", status);
		
		userMapper.updateUserStatus(param);
		
		//禁用用户，需要把他手头的潜客分配给其他的用户
		if(status == 2){
			//1.获取该用户手头未跟踪完成的潜客
			List<CustomerAssign> customerAssigns = customerAssignMapper.findCustByUserId(id);
			//2.将该用户的潜客跟踪全部修改为"跟踪完成"状态
			customerAssignMapper.updateTraceStatustByUserId(id, 3);
			//构造分配方法入参数据
			//List<Customer> assignCustomerList = new ArrayList<Customer>();
			List<RenewalingCustomer> renewalingCustomerList = new ArrayList<RenewalingCustomer>();
			for (CustomerAssign customerAssign : customerAssigns) {
				Integer customerId = customerAssign.getCustomerId();
				RenewalingCustomer renewalingCustomer = renewalingCustomerMapper.selectByPrimaryKey(customerId, storeId);
				//Customer customer = customerMapper.selectByPrimaryKey(customerId);
				//assignCustomerList.add(customer);
				renewalingCustomerList.add(renewalingCustomer);
			}
			//3.将这批潜客重新分配
			if(roleId == 5){
				//如果该店少于2个客服专员则不允许禁用
				List<User> list = userMapper.findByRoleId(roleId,storeId);
				if(list.size() <= 0 ){
					Role role = roleMapper.findRoleNameByRoleId(roleId);
					String roleName = role.getRoleName();
					throw new NoUserAssignException("请确保角色为"+roleName+"的用户存在或者不被暂停禁用!");
				}
				for(int i=0;i<renewalingCustomerList.size();i++){
					RenewalingCustomer renewalingCustomer = renewalingCustomerList.get(i);
					Integer customerId = renewalingCustomer.getCustomerId();
					Integer renewalType = renewalingCustomer.getRenewalType();
					//查询目前分配潜客最少的续保专员
					User user = findAssignCustomerUser(roleId,storeId,renewalType);
					//User user = assignCustomerService.findLeastCustomerByWorker(roleId,storeId);
					Map<String,Object> map = new HashMap<String,Object>();
					map.put("userId", user.getId());
					map.put("customerId", customerId);
					//根据潜客id和用户id查询是否存在没有跟踪完成的分配记录
					CustomerAssign findAssignRecode = customerAssignMapper.findIsAssign(map);
					if(findAssignRecode != null){
						//如果不为空，此时不insert新的记录，而是更新该记录
						map.put("customerId", customerId);
						map.put("userId", user.getId());
						map.put("traceStatu", 1);
						map.put("traceDate", null);
						map.put("inviteStatu", null);
						map.put("inviteDate", null);
						map.put("acceptStatu", 1);
						map.put("acceptDate", null);
						map.put("returnStatu", 0);
						map.put("returnDate",null);
						map.put("customerTraceId", null);
						map.put("assignDate", new Date());
						map.put("delayDate",null);
						customerAssignMapper.update2(map);
					}else{
						map.put("customerId",customerId);
						map.put("userId", user.getId());
						map.put("traceStatu", 1);
						map.put("traceDate", null);
						map.put("inviteStatu", null);
						map.put("inviteDate", null);
						map.put("acceptStatu", 1);
						map.put("acceptDate", null);
						map.put("returnStatu", null);
						map.put("returnDate",null);
						map.put("customerTraceId", null);
						map.put("assignDate", new Date());
						map.put("delayDate",null);
						customerAssignMapper.insert(map);
					}
					
					//插入一条跟踪记录
					User proUser = userMapper.findUserByIdIsNoDel(id, storeId);
					User operatUser = userMapper.findUserByIdIsNoDel(userId, storeId);
					String operation = "禁用";
					String context = "潜客从" + proUser.getUserName() + "手中分给" + user.getUserName();
					String traceContext = DealStringUtil.dealTraceRecordContent(operation,context,operatUser.getUserName());
					String lastTraceResult = DealStringUtil.dealLastTraceResult(operation,operatUser.getUserName());
					customerService.addTraceRecord(renewalingCustomer.getPrincipalId(), renewalingCustomer.getPrincipal()
							, customerId, traceContext, lastTraceResult, null, null, userId);
				}
			}else{
				List<List<RenewalingCustomer>> assignListAll = new ArrayList<List<RenewalingCustomer>>();
				if(renewalingCustomerList.size() > 0){
					int assignNum = 0;
					assignListAll = SplitListUtil.splitList(renewalingCustomerList,10);
					for (int i = 0; i < assignListAll.size(); i++) {
						assignCustomerService.systemAssignForbidden(assignListAll.get(i),id,userId);
						assignNum = assignNum + assignListAll.get(i).size();
						logger.info("禁用了"+assignNum+"个潜客！");
					}
					
				}
			}
		}
		logger.info("---------操作日期"+new Date()+";店id为"+storeId+"，的用户id为"+userId+","+stopOrBiten+"了用户id为"+id+"，开始！---------");
	}

	/**
	 * 查询角色配置信息
	 * @return
	 * @throws Exception
	 */
	public Map<String,List<User>> findKindsUser(Integer storeId) throws Exception{
		Map<String,List<User>> users = new HashMap<String,List<User>>();
		//1.查询负责人(此店的所有续保专员)
		List<User> xbUsers = userMapper.selectByStoreIdAndRoleId(storeId, 2);
		//2.查询业务员(此店的所有销售顾问和服务顾问)
		List<User> ywUsers = userMapper.selectAdivserByStoreId(storeId);
		//3.查询所有出单员
		List<User> cdUsers = userMapper.selectByStoreIdAndRoleId(storeId, 1);
		//4.查询所有服务顾问
		List<User> fwUsers = userMapper.selectByStoreIdAndRoleId(storeId, 8);
		//5.查询招揽员(所有此店的续保专员和出单员)
		List<User> zlUsers = new ArrayList<User>();
		zlUsers.addAll(xbUsers);
		zlUsers.addAll(cdUsers);
		
		users.put("principal", xbUsers);
		users.put("salesman", ywUsers);
		users.put("outBillMan", cdUsers);
		users.put("spieler", zlUsers);
		users.put("servicer", fwUsers);
		
		return users;
	 }
	
	/**
	 * 判断4s店某管理岗位是否已存在
	 * @param storeId 4s店id
	 * @param roleId  角色id
	 * @return isExist 是否存在 true存在,false不存在
	 * @throws Exception
	 */
	public boolean findManageUser(Integer storeId,Integer roleId) throws Exception{
		boolean isExist = false;
		List<User>  users = userMapper.selectUserByroleId(storeId, roleId);
		if(!CollectionUtils.isEmpty(users)){
			isExist = true;
		}
		return isExist;
	 }
	
	/**
	 * 根据4s店id和用户名及角色查询用户id
	 * @param storeId 4s店id
	 * @param userName 用户名
	 * @param roleId  角色id
	 * @throws Exception
	 */
	public List<User> findUserIdByUserName(Integer storeId,String userName, Integer roleId) throws Exception{
		return userMapper.findUserIdByUserName(storeId, userName, roleId);
	}
	
	/**
	 * 根据4s店id和用户名查询业务员id
	 * @param storeId 4s店id
	 * @param userName 用户名
	 * @param roleId  角色id
	 * @throws Exception
	 */
	public List<User> findClerkIdByUserName(Integer storeId,String userName) throws Exception{
		List<User> list = userMapper.findClerkIdByUserName(storeId, userName);
		return list;
	}
	//续保主管、保险经理、总经理查询所有下级
	public List<User> findAllPrincipal(Integer storeId, Integer userId, Integer[] roleIds) throws Exception {
		User user = userMapper.findRoleByUserId2(userId);
		Map<String,Object> param = new HashMap<String,Object>();
		List<User> users = new ArrayList<User>();
		if(user != null){
			Integer superiorId = user.getSuperiorId();
			if(superiorId == null){
				param.put("storeId", storeId);
				param.put("roleIds", roleIds);
				users = userMapper.findAllPrincipal(param);
			}else{
				users.add(user);
			}
		}
		
		
		return users;
	}
	//出单员查询客户专员的工作人员
	public List<User> findCSCIsLost(Integer storeId) throws Exception {
		List<User> list = userMapper.findByRoleId(5, storeId);
		List<User> list1 = userMapper.findByRoleId(2, storeId);
		list.addAll(list1);
		return list;
	}
	/**
	 * 客户经理、销售经理、服务经理查询其部门下属的工作人员
	 * @param roleId 是上级的角色id
	 * @param storeId
	 * @return
	 * @throws Exception
	 */
	public List<User> findUnderling(Integer roleId, Integer storeId) throws Exception {
		List<User> list = userMapper.findUndering(roleId,storeId);
		return list;
	}

	public User findUserByUserId(Integer userId, Integer storeId) throws Exception {
		User user = userMapper.findRoleByUserId2(userId);
		return user;
	}
	
	/**
	 * 根据4s店id和角色id查询用户
	 * @param storeId 4s店id
	 * @param roleId  角色id
	 * @throws Exception
	 */
	public List<User> findUsersByStoreIdAndRoleId(Integer storeId, Integer roleId) throws Exception{
		List<User> users = userMapper.findUsersByStoreIdAndRoleId(storeId, roleId);
		return users;
	}

	public List<User> findAllUnacceptUser(Integer storeId, Integer userId) throws Exception {
		User user = userMapper.findRoleByUserId(userId);
		Map<String,Object> param = new HashMap<String,Object>();
		List<User> users = new ArrayList<User>();
		if(user != null){
			Integer superiorId = user.getSuperiorId();
			if(superiorId == null){
				Integer[] roleIds = {2,5,6,8};
				param.put("storeId", storeId);
				param.put("roleIds", roleIds);
				users = userMapper.findAllPrincipal(param);
			}else{
				users.add(user);
			}
		}
		return users;
	}
	/**
	 * 查询用户名下未跟踪完成的分配记录
	 * @param userId 用户id
	 * @throws Exception
	 */
	public List<CustomerAssign> findCustByUserId(Integer userId) throws Exception{
		List<CustomerAssign> customerAssigns = customerAssignMapper.findCustByUserId(userId);
		return customerAssigns;
	}

	public List<User> findUsersByStoreIdAndRoleId2(Integer storeId, Integer roleId) throws Exception {
		List<User> users = userMapper.findUsersByStoreIdAndRoleId2(storeId, roleId);
		return users;
	}

	public User findUserById(Integer userId) throws Exception {
		return userMapper.findUserById(userId);
	}
	
	public List<User> findByRoleId(Integer roleId,Integer storeId) throws Exception {
		return userMapper.findByRoleId(roleId,storeId);
	}

	public List<Map<String, Object>> updateBang(List<Map<String, Object>> bindUsers, Integer bipStoreId) throws Exception{
		List<Map<String, Object>> messageList = new ArrayList<Map<String,Object>>();
		
		for(Map<String,Object> bindUser : bindUsers){
			Map<String,Object> message = new HashMap<String,Object>();
			User user = new User();
			Integer bipUserId = (Integer)bindUser.get("bipUserId");
			Integer bspUserId = (Integer)bindUser.get("bspUserId");
			//校验bipUserId对应的user或者bspUserId对应的User是否绑定过
			Map<String,Object> bindMessage = sysnService.findCheckBipBspUserIsBind(bipUserId, bspUserId,bipStoreId);
			boolean canBind = (boolean)bindMessage.get("canBind");
			if(canBind == true){
				user.setId(bipUserId);
				user.setBspUserId(bspUserId);
				user.setBangTime(new Date());
				user.setBangStatu(1);
				userMapper.updateUser(user);
			}else{
				String bipUserMessage = (String)bindMessage.get("bipUserMessage");
				String bspUserMessage = (String)bindMessage.get("bspUserMessage");
				if(bipUserMessage != null){
					message.put("bipUserMessage", bipUserMessage);
				}
				if(bipUserMessage != null){
					message.put("bspUserMessage", bspUserMessage);
				}
				messageList.add(message);
			}
		}
		return messageList;
	}

	public List<BspUser> findNoBangedUser(Integer storeId)throws Exception {
		//根据bipstoreId查询绑定好的bsp店的id
		Store store = storeMapper.selectByPrimaryKey(storeId);
		Integer bspStoreId = store.getBspStoreId();
		//获取已经跟bsp绑定好的用户
		Map<String,Object> param = new HashMap<String,Object>();
		param.put("storeId", storeId);
		param.put("bangStatu", 1);
		/*List<User> list = userMapper.findBangedUser(param);
		//获取跟bip用户绑定好的bsp用户id
		List<Integer> bspUserIdlist = new ArrayList<Integer>();
		for(User bspUser : list){
			Integer bspUserId = bspUser.getBspUserId();
			bspUserIdlist.add(bspUserId);
		}*/
		//排除bspUserIdlist的id则是没有跟bip绑定的bsp用户
		List<BspUser> noBindBspUserList = null;
		param.put("bspStoreId", bspStoreId);
		noBindBspUserList = bspUserMapper.findNoBindUser(param);
		/*if(bspUserIdlist.size() <= 0){//如果一个都没有绑定则查询所有bsp用户
			param.put("bspStoreId", bspStoreId);
			noBindBspUserList = bspUserMapper.findBspUser(param);
		}else{
			noBindBspUserList = bspUserMapper.findNoBindUser(bspUserIdlist);
		}*/
		return noBindBspUserList;
	}

	public void delBangedBspUser(Map<String, Object> delBangParamMap) throws Exception {
		Integer id = (Integer)delBangParamMap.get("id");
		User user = new User();
		user.setBangStatu(0);
		user.setId(id);
		userMapper.updateUser(user);
	}
	/**
	 * 判断principalId对应的user状态是否正常
	 * @param principalId
	 * @return
	 * @throws Exception
	 */
	public boolean findCheckUserStatu(Integer principalId) throws Exception {
		User user = userMapper.findRoleByUserId(principalId);
		boolean isNormal = false;
		if(user == null){
			isNormal = false;
		}else{
			isNormal = true;
		}
		return isNormal;
	}

	public Map<String,Object> findBipBspUser(Integer storeId) throws Exception {
		Store store = storeMapper.selectByPrimaryKey(storeId);
		int xsgwRole = RoleType.XSGW;
		int xsjlRole = RoleType.XSJL;
		Integer bspStoreId = store.getBspStoreId();
		Integer bipStoreId = store.getStoreId();
		Integer bangStatu = store.getBangStatu();
		Map<String,Object> map = new HashMap<String,Object>();
		
		if(bspStoreId != null && bangStatu == 1){
			Map<String,Object> param = new HashMap<String,Object>();
			param.put("xsgwRole", xsgwRole);
			param.put("xsjlRole", xsjlRole);
			param.put("bspStoreId", bspStoreId);
			param.put("bipStoreId", bipStoreId);
			List<User> bipUsers = userMapper.findBipUser(param);
			List<BspUser> bspUsers = bspUserMapper.findBspUser(param);
			map.put("bipUsers", bipUsers);
			map.put("bspUsers", bspUsers);
		}
		return map;
	}

	public User findBindUserById(Integer storeId, Integer userId) throws Exception {
		Map<String,Object> param = new HashMap<String,Object>();
		param.put("storeId", storeId);
		param.put("userId", userId);
		User user = userMapper.findBindUserById(param);
		return user;
	}

	public UserVo selectUserInfoByBipUserId(Integer bipUserId) throws Exception {
		Map<String,Object> param = new HashMap<String,Object>();
		param.put("bipUserId", bipUserId);
		UserVo user = userMapper.selectUserInfoByBipUserId(param);
		if(user != null){
			if(user.getStore() != null){
				List<TraceDaySet> traceDaySets = settingService.findTraceDaySet(user.getStore().getStoreId());
				user.setDaySets(traceDaySets);
				//查询是否启用台帐模块
				param.put("storeId", user.getStore().getStoreId());
				param.put("moduleName", "accountModule");
				List<ModuleSet> moduleSets = settingService.selectByCondition(param);
				ModuleSet moduleSet = moduleSets.get(0);
				user.setAccountModule(moduleSet.getSwitchOn());
			}
		}
		return user;
	}
	/**
	 * 查询分配潜客的用户
	 * @param roleId
	 * @param renewalType 
	 * @param fourSStoreId
	 * @return
	 * @throws Exception
	 */
	public User findAssignCustomerUser(Integer roleId, Integer storeId, Integer renewalType) throws Exception{
		User user = assignCustomerService.findLeastCustomerByWorker(roleId,storeId,renewalType);
		if(user == null){
			Role role = roleMapper.findRoleNameByRoleId(roleId);
			String roleName = role.getRoleName();
			throw new NoUserAssignException("请确保角色为"+roleName+"的用户存在或者不被暂停禁用！");
		}
		return user;
	}
	/**
	 * 根据上级角色id查询其下属人员（包含删除和禁用的）
	 * @param storeId 
	 * @param roleId(管理人员的角色id)
	 * @throws Exception 
	 */
	public List<User> findSubordinates(Integer roleId, Integer storeId) throws Exception {
		List<User> list = userMapper.findSubordinates(roleId, storeId);
		return list;
	}
	/**
	 * 根据店的id和角色id判断该角色是否管理人员
	 * @param storeId
	 * @param roleId
	 * @return
	 * @throws Exception 
	 */
	public boolean isManager(Integer roleId, Integer userId) throws Exception {
		boolean isManager = false;
		//如果角色id是出单员则直接返回false
		if(roleId == RoleType.CDY){
			return isManager;
		}else{
			User user = userMapper.findRoleByUserId2(userId);
			if(user != null){
				//如果上级id不为空和不为0说明不是上级（），返回false，反之返回true
				Integer superiorId = user.getSuperiorId();
				if(superiorId != null && superiorId != 0){
					isManager = false;
				}else{
					isManager = true;
				}
			}
		}
		return isManager;
	}
		

	public void  fixData() throws Exception{
		logger.info("------------------修复数据开始-------------------！");
		//获取201612月份的分配操作记录
		String startTimeStr = "2016-8-31";
		String endTimeStr = "2017-02-28";
		Date startTime = DateUtil.toDate(startTimeStr);
		Date endTime = DateUtil.toDate(endTimeStr);
		Calendar startCal = Calendar.getInstance();
		Calendar endCal = Calendar.getInstance();
		startCal.setTime(startTime);
		endCal.setTime(endTime);
		long time1 = startCal.getTimeInMillis();
		long time2 = endCal.getTimeInMillis();   
	    int between_days = new Long((time2-time1)/(1000*3600*24)).intValue();  
		for(int i = 0; i <= between_days; i++){
			int startDay = startCal.get(Calendar.DAY_OF_MONTH);
			startCal.set(Calendar.DAY_OF_MONTH, startDay+1);
			String operationDate = DateUtil.toString(startCal.getTime());
			Map<String,Object> param = new HashMap<String,Object>();
			param.put("operationFlag", 6);
			param.put("operationDateStart", operationDate);
			param.put("operationDateEnd", operationDate);
			List<OperationRecord> operationRecordList = operationRecordMapper.findOperationRecord2(param);
			logger.info(operationDate+"总共有"+operationRecordList.size()+"条数据要修复，目前正在修复"+operationDate+"的数据！");
			List<List<OperationRecord>> splitList = SplitListUtil.splitList(operationRecordList, 500);
			
			for(List<OperationRecord> list : splitList){
				List<Map<String,Object>> paramList = new ArrayList<Map<String,Object>>();
				
				for(OperationRecord operationRecord : list){
					Integer customerId = operationRecord.getCustomerId();
					Customer customer = customerMapper.findCustomerById(customerId);
					if(customer != null){
						
						String customerLevel = customer.getCustomerLevel();
						Date virtualJqxdqr = customer.getVirtualJqxdqr();
						Map<String,Object> map = new HashMap<String,Object>();
						if(customerLevel.equals("O")){
							Calendar calendar = Calendar.getInstance();
							calendar.setTime(virtualJqxdqr);
							int year = calendar.get(Calendar.YEAR)-1;
							int month = calendar.get(Calendar.MONTH)+1;
							int day = calendar.get(Calendar.DAY_OF_MONTH);
							Date formatDate = DateUtil.formatDate(year, month, day);
							map.put("virtualJqxdqr", DateUtil.toString(formatDate));
							map.put("customerId", customerId);
							paramList.add(map);
							//operationRecordMapper.update(map);
							
						}else if(customerLevel.equals("F") || customerLevel.equals("S")){
							Calendar calendar = Calendar.getInstance();
							calendar.setTime(virtualJqxdqr);
							int year = calendar.get(Calendar.YEAR);
							int newYear = 0;
							if(year == 2018){
								newYear = calendar.get(Calendar.YEAR)-1;
							}else{
								newYear = calendar.get(Calendar.YEAR);
							}
							int month = calendar.get(Calendar.MONTH)+1;
							int day = calendar.get(Calendar.DAY_OF_MONTH);
							Date formatDate = DateUtil.formatDate(newYear, month, day);
							map.put("virtualJqxdqr", DateUtil.toString(formatDate));
							map.put("customerId", customerId);
							paramList.add(map);
							//operationRecordMapper.update(map);
						}else{
							map.put("virtualJqxdqr", DateUtil.toString(virtualJqxdqr));
							map.put("customerId", customerId);
							paramList.add(map);
							//operationRecordMapper.update(map);
						}
					}
				}
				if(paramList != null && paramList.size() > 0){
					operationRecordMapper.update2(paramList);
				}
			}
		}
		logger.info("------------------修复数据结束-------------------！");
	}
	
	/**
	 * 根据4s店id和角色id查询用户, 作为持有人下拉框查询条件数据源 
	 * @param storeId
	 * @return
	 * @throws Exception 
	 */
	public List<User> selectUserForHolderSearch(Map<String, Object> map) throws Exception {
		List<User> users = userMapper.selectUserForHolderSearch(map);
		return users;
	}
	
	/**
	 * 根据4s店id查询续保主管 
	 * @param storeId 4s店id
	 * @return  续保主管
	 * @throws Exception 
	 */
	public User findXBZGByStoreId(Integer storeId) throws Exception {
		User user = userMapper.findXBZGByStoreId(storeId);
		return user;
	}
	
	/**
	 * 根据潜客id查询持有人
	 * @param customerId 潜客id
	 * @return  持有人
	 * @throws Exception 
	 */
	public User findHolderByCustomerId(Integer customerId) throws Exception {
		User user = userMapper.findHolderByCustomerId(customerId);
		return user;
	}
	/**
	 * 检测该店是否有工作的下属
	 * @param fourSStoreId
	 * @throws Exception
	 */
	public boolean checkStoreHaveWorker(Integer fourSStoreId) throws Exception {
		boolean flag = false;
		//根据店id查询用户
		List<User> userList = userMapper.findUsersByStoreId(fourSStoreId);
		List<User> workerList = new ArrayList<User>();
		for(User user : userList){
			Integer roleId = user.getRoleId();
			Integer superiorId = user.getSuperiorId();
			//如果用户没有上级id且不是客服人员，则属于工作用户
			if(superiorId != null && roleId != RoleType.KFZY){
				workerList.add(user);
			}
		}
		if(workerList.size() > 0){
			flag = true;
		}
		
		return flag;
	}
	
	/**
	 *  根据4s店id查询所有用户
	 */
	public List<User> selectByStoreIdAndRoleId(Integer storeId,Integer roleId) throws Exception {
		List<User> users = userMapper.selectByStoreIdAndRoleId(storeId,roleId);
		return users;
	}
	
	/**
	 *  行政建店人员可以查询的用户
	 */
	public List<User> findUser_xzjd() throws Exception {
		List<User> users = userMapper.findUser_xzjd();
		return users;
	}
	
	/**
	 *  查询行政建店人员能新建的系统人员
	 */
	public List<Role> selectRole_xzjd() throws Exception {
		List<Role> roles = roleMapper.selectRole_xzjd();
		return roles;
	}
	
	/**
	 * 查询集团管理人员能新建的角色
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public List<Role> findRoleByBloc(Map<String, Object> param) throws Exception {
		List<Role> roles = roleMapper.findRoleByBloc(param);
		return roles;
	}
	
	/**
	 * 集团管理员能查到的用户
	 * @return
	 * @throws Exception
	 */
	public List<User> findUser_jtgl(Map<String, Object> param) throws Exception {
		List<User> users = userMapper.findUser_jtgl(param);
		return users;
	}
	
	/**
	 * 根据电话号码查询 
	 * @param phone
	 * @return
	 * @throws Exception
	 */
	public List<User> selectUserByPhone(String phone) throws Exception {
		List<User> users = userMapper.selectUserByPhone(phone);
		return users;
	}
	/**
	 * 出单员禁用时校验出单员是否存在
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public Integer findCountByUserCdy(Map<String, Object> param) throws Exception {
		return userMapper.findCountByUserCdy(param);
	}

	public boolean findExistUserByRole(Integer storeId, Integer roleId) throws Exception {
		List<User> users = userMapper.findUsersByStoreIdAndRoleId(storeId,roleId);
		if(users != null && users.size() > 0){
			return true;
		} else {
			return false;
		}
	}
	
	/**
	 * 建档人下拉框数据源
	 * @param storeId
	 * @return
	 * @throws Exception
	 */
	public List<User> selectUserForJdrDataSource(Integer storeId) throws Exception {
		List<User> userList = new ArrayList<>();
		List<User> cdyUsers = userMapper.selectUserByroleId(storeId,1);
		List<User> xbzyUsers = userMapper.selectUserByroleId(storeId,2);
		List<User> kfzyUsers = userMapper.selectUserByroleId(storeId,5);
		userList.addAll(xbzyUsers);
		userList.addAll(kfzyUsers);
		userList.addAll(cdyUsers);
		return userList;
	}
	
	/**
	 * 查询区域分析师和店的关系-行政建店
	 * @return
	 * @throws Exception
	 */
	public List<User> findUser_xzjd_store() throws Exception {
		List<User> users = userMapper.findUser_xzjd_store();
		return users;
	}
	
	/**
	 * 修改区域分析师和店之间的关联
	 * @param map
	 * @throws Exception
	 */
	public void updateUserAndStore(Map<String,Object> map) throws Exception{
		Integer dataAnalystId = (Integer)map.get("dataAnalystId");
		String storeIds = (String)map.get("storeIds");
		String storeId[] = storeIds.split(",");
		Map<String,Object> param = new HashMap<String,Object>();
		param.put("dataAnalystId", dataAnalystId);
		List<Store> stores = storeMapper.findStoreByCondition(param);
		if(stores!=null&&stores.size()>0){
			for(int i=0;i<stores.size();i++){
				String dataAnalystIds[] = stores.get(i).getDataAnalystIds().split(",");
				String id = "";
				for(int j=0;j<dataAnalystIds.length;j++){
					if(dataAnalystIds[j].equals(""+dataAnalystId)){
						continue;
					}
					if(id.length()==0){
						id = dataAnalystIds[j];
					}else{
						id = id+","+dataAnalystIds[j];
					}
				}
				param.put("dataAnalystIds", id);
				param.put("crltj", "yes");
				param.put("storeId", stores.get(i).getStoreId());
				storeMapper.updateByStoreId(param);
			}
		}
		for(int i=0;i<storeId.length;i++){
			if(storeId[i]!=null&&storeId[i].length()>0){
				Store store = storeMapper.selectByPrimaryKey(Integer.parseInt(storeId[i]));
				String dataAnalystIds = store.getDataAnalystIds();
				if(dataAnalystIds!=null&&dataAnalystIds.length()>0){
					dataAnalystIds = dataAnalystIds+","+dataAnalystId;
				}else{
					dataAnalystIds = ""+dataAnalystId;
				}
				param.put("crltj", "yes");
				param.put("dataAnalystIds", dataAnalystIds);
				param.put("storeId", storeId[i]);
				storeMapper.updateByStoreId(param);
			}
		}
	}

	public MappingJacksonValue checkCode( String codes, String callback, String code) {
		MappingJacksonValue mappingJacksonValue =null;
		JSONObject resultJson = new JSONObject();
		 if(codes == null){
			 resultJson.put("status", "error");
			 resultJson.put("msg", "校验码失效，请重新获取");
			 mappingJacksonValue = new MappingJacksonValue(resultJson);
				
		 }else{
			 if(codes.equals(code)){
				 resultJson.put("status", "ok");
				 mappingJacksonValue = new MappingJacksonValue(resultJson);
			 }else{
				 resultJson.put("status", "error");
				 resultJson.put("msg", "手机验证码错误");
				 mappingJacksonValue = new MappingJacksonValue(resultJson);
			 }
		 }
		 if(callback!=null){
				mappingJacksonValue.setJsonpFunction(callback);
				
			}
		 return mappingJacksonValue;
	
	}

	public BaseResponse selectByLoginNameByAjax(String loginName, int counts) {
		
		List<User>  userList = 	userMapper.selectByLoginNameAjax(loginName);
		BaseResponse rs = new BaseResponse();
		int count =userList.size();
		if(counts > 0){
			if(userList != null && count >0){
				if(count==0){
					rs.addContent("status", "NO");
					rs.addContent("msg", "此账号不是4s店管理员");
				}else{
					rs.addContent("status", "OK");
					rs.addContent("phone", SplitListUtil.hidePhoneNo(userList.get(0).getPhone()));
				}
			}else{
				rs.addContent("status", "NO");
				rs.addContent("msg", "此账号不是4s店管理员");
			}
		}else{
			rs.addContent("status", "NO");
			rs.addContent("msg", "账号不存在");
		}
		return rs;
	}
	
}
