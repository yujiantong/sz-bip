package com.bofide.bip.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.bofide.bip.common.po.RoleType;
import com.bofide.bip.exception.NoUserAssignException;
import com.bofide.bip.po.CustomerAssign;
import com.bofide.bip.po.Role;
import com.bofide.bip.po.Store;
import com.bofide.bip.po.User;
import com.bofide.bip.service.StoreService;
import com.bofide.bip.service.UserService;
import com.bofide.bip.vo.UserVo;
import com.bofide.common.util.BaseResponse;
import com.fasterxml.jackson.databind.ObjectMapper;

import net.sf.json.JSONObject;

@Controller
@RequestMapping(value = "/user")
public class UserController extends BaseResponse {
	private static Logger logger = Logger.getLogger(UserController.class);
	
	@Autowired
	private UserService userService;
	
	@Autowired
	private StoreService storeService;
	
	/**
	 *  查询指定用户所有的下级,除开特定用户
	 * @return 
	 */
	@RequestMapping(value="/findAllSubordinate",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findAllSubordinate(@RequestParam(name="userId") Integer userId,
			@RequestParam(name="principalId") Integer principalId,
			@RequestParam(name="storeId") Integer storeId){
		BaseResponse rs = new BaseResponse();
		try {
			List<User> users = userService.findAllSubordinate(userId,principalId,storeId);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("results", users);
			return rs; 
		} catch (Exception e) {
			logger.error("查询所有下级失败: ", e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			return rs; 
		}
	}
	
	/**
	 *  查询指定用户所有的下级
	 * @return 
	 */
	@RequestMapping(value="/findSubordinate",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findSubordinate(@RequestParam(name="userId") Integer userId,
			@RequestParam(name="storeId") Integer storeId){
		BaseResponse rs = new BaseResponse();
		try {
			List<User> users = userService.findSubordinate(userId,storeId);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("results", users);
			return rs; 
		} catch (Exception e) {
			logger.error("查询下级失败: ", e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			return rs; 
		}
	}
	
	/**

	 * 查询用户
	 * @return 
	 */
	@RequestMapping(value="/findUser",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findUser(@RequestParam(name="storeId") Integer storeId){
		BaseResponse rs = new BaseResponse();
		
		try {
			//查询用户
			List<User>  userList = userService.selectByStoreId(storeId);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("result", userList);
			rs.setMessage("查询用户成功");
			
		} catch (Exception e) {
			logger.error(e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("查询用户信息失败,程序异常:"+e.getMessage());
			return rs; 
		}
		return rs;
	}
	
	/**
	 * 查询系统用户   --数据分析师
	 * @return 
	 */
	@RequestMapping(value="/findUser_xtyh",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findUser_xtyh(@RequestParam(name="storeId") Integer storeId){
		BaseResponse rs = new BaseResponse();
		
		try {
			//查询系统用户
			List<User>  userList = userService.findUser_xtyh();
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("result", userList);
			rs.setMessage("查询系统用户成功");
			
		} catch (Exception e) {
			logger.error(e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("查询系统用户信息失败,程序异常:"+e.getMessage());
			return rs; 
		}
		return rs;
	}
	
	/**
	 * 查询系统用户   --行政建店
	 * @return 
	 */
	@RequestMapping(value="/findUser_xzjd",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findUser_xzjd(){
		BaseResponse rs = new BaseResponse();
		
		try {
			//查询系统用户
			List<User>  userList = userService.findUser_xzjd();
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("result", userList);
			rs.setMessage("查询系统用户成功");
			
		} catch (Exception e) {
			logger.error(e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("查询系统用户信息失败,程序异常:"+e.getMessage());
			return rs; 
		}
		return rs;
	}
	
	/** 
	 * 新增用户
	 * 
	 * @return
	 */
	@RequestMapping(value = "/addUser", method = { RequestMethod.POST })
	@ResponseBody
	public BaseResponse addUser(HttpServletRequest request, HttpServletResponse response) {
		BaseResponse rs = new BaseResponse();
		// 获取级别跟踪天数设置信息
		String userInfo = request.getParameter("userInfo");
		if (StringUtils.isEmpty(userInfo)) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("用户信息为空,新增用户失败!");
			return rs;
		}
		JSONObject jsonObj = JSONObject.fromObject(userInfo);
		User user = (User)JSONObject.toBean(jsonObj,User.class);
		try {
			//判断当前用户是否存在
			Integer storeId = user.getStoreId();
			String loginName = user.getLoginName();
			User userOld = userService.selectUserByStoreId(storeId, loginName);
			if(ObjectUtils.isEmpty(userOld)){
				if(user.getJtId()!=null){
					List<User> users = userService.selectUserByPhone(user.getPhone());
					if(users.size()>0){
						rs.setSuccess(false);
						rs.addContent("status", "BAD");
						rs.setMessage("电话号码重复,新增用户失败!");
						return rs;
					}
				}
				// 新增用户
				int userId = userService.insertUser(user);;
				if(userId == -1){
					rs.setSuccess(false);
					rs.addContent("status", "BAD");
					rs.setMessage("新增用户失败,角色已存在");
				}else if(userId == -2){
					rs.setSuccess(false);
					rs.addContent("status", "BAD");
					rs.setMessage("新增用户失败,该角色上级不存在,请先创建上级角色");
				}else{
					rs.setSuccess(true);
					rs.addContent("status", "OK");
					rs.addContent("userId", userId);
					rs.setMessage("新增用户成功");
				}
				
			}else{
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				rs.setMessage("新增用户失败,用户名已存在");
			}

		} catch (Exception e) {
			logger.error(e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("新增用户失败,程序异常:" + e.getMessage());
			return rs;
		}
		return rs;
	}	
	
	/**

	 * 删除用户(软删除)
	 * @return 
	 */
	@RequestMapping(value="/deleteUser",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse deleteUser(@RequestParam(name="id") Integer id,
			@RequestParam(name="roleId") Integer roleId,
			@RequestParam(name="storeId") Integer storeId){
		BaseResponse rs = new BaseResponse();
		try {
			if(roleId == 2 || roleId == 5 || roleId == 6 || roleId == 8){
				List<CustomerAssign> customerAssigns = userService.findCustByUserId(id);
				if(customerAssigns.size() >0){
					logger.info("删除用户失败,该用户名下还有潜客,不能删除");
					rs.setSuccess(false);
					rs.addContent("status", "BAD");
					rs.setMessage("删除用户失败,该用户名下还有潜客,不能删除");
					return rs; 
				}
			}
			//删除用户
			int result = userService.updateById(id,roleId,storeId);
			if(result != -1){
				rs.setSuccess(true);
				rs.addContent("status", "OK");
				rs.setMessage("删除用户成功");
			}else{
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				rs.setMessage("删除用户失败,该角色存在下级，请先删除下级");
			}
			
		} catch (Exception e) {
			logger.info("删除用户失败,程序异常:", e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("删除用户失败,程序异常");
			return rs; 
		}
		return rs;
	}	
	
	/**
	 * 修改用户密码
	 * @return 
	 */
	@RequestMapping(value="/updatePassword",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse updatePassword(@RequestParam(name="id") Integer id,
			@RequestParam(name="password") String password,
			@RequestParam(name="oldPassword") String oldPassword){
		BaseResponse rs = new BaseResponse();
		if (StringUtils.isEmpty(password)) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("用户密码为空,修改密码失败!");
			return rs;
		}
		try {
			//修改用户密码
			int result = userService.updatePassword(id, password, oldPassword);
			if(result == 0){
				rs.setSuccess(true);
				rs.addContent("status", "OK");
				rs.setMessage("修改用户密码成功");
			}else if(result == 1){
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				rs.setMessage("修改用户密码失败,原密码错误");
			}else{
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				rs.setMessage("修改用户密码失败,新密码不能和原密码相同");
			}
			
		} catch (Exception e) {
			logger.error(e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("修改用户密码失败,程序异常:"+e.getMessage());
			return rs; 
		}
		return rs;
	}
	
	/**
	 * 更新用户
	 * 
	 * @return
	 */
	@RequestMapping(value = "/updateUser", method = { RequestMethod.POST })
	@ResponseBody
	public BaseResponse updateUser(HttpServletRequest request, HttpServletResponse response) {
		BaseResponse rs = new BaseResponse();
		String userInfo = request.getParameter("userInfo");
		if (StringUtils.isEmpty(userInfo)) {
			logger.info("用户信息为空,更新用户失败!");
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("用户信息为空,更新用户失败!");
			return rs;
		}
		JSONObject jsonObj = JSONObject.fromObject(userInfo);
		User user = (User) JSONObject.toBean(jsonObj, User.class);
		try {
			// 判断当前用户名是否存在
			Integer storeId = user.getStoreId();
			String loginName = user.getLoginName();
			User userOld = userService.selectUserByStoreId(storeId, loginName);
			String jtId = request.getParameter("jtId");
			if(!StringUtils.isEmpty(jtId)){
				List<User> users = userService.selectUserByPhone(user.getPhone());
				if(users.size()>0){
					Integer j = 0;
					for(int i=0;i<users.size();i++){
						if(users.get(i).getId().equals(user.getId())){
							j = 1;
						}
					}
					if(j==0){
						rs.setSuccess(false);
						rs.addContent("status", "BAD");
						rs.setMessage("电话号码重复,更新用户失败!");
						return rs;
					}
				}
			}
			if (ObjectUtils.isEmpty(userOld)) {
				// 更新用户
				userService.updateUser(user);
				rs.setSuccess(true);
				rs.addContent("status", "OK");
				rs.setMessage("更新用户成功");

			} else {
				Integer oldUserId = userOld.getId();
				Integer userId = user.getId();
				if(userId.equals(oldUserId)){//重名的是自己，更新
					// 更新用户
					userService.updateUser(user);
					rs.setSuccess(true);
					rs.addContent("status", "OK");
					rs.setMessage("更新用户成功");
				}else{//与其他用户重名，更新失败
					logger.info("更新用户失败,用户名已存在");
					rs.setSuccess(false);
					rs.addContent("status", "BAD");
					rs.setMessage("更新用户失败,用户名已存在");
				}
			}

		} catch (Exception e) {
			logger.error("更新用户失败,程序异常:", e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("更新用户失败,程序异常");
			return rs;
		}
		return rs;
	}	
	
	/**

	 *重置用户密码
	 * @return 
	 */
	@RequestMapping(value="/resetPassword",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse resetPassword(@RequestParam(name="id") Integer id){
		BaseResponse rs = new BaseResponse();
		try {
			//修改用户密码
			userService.resetPassword(id);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.setMessage("重置用户密码成功");
			
		} catch (Exception e) {
			logger.error(e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("重置用户密码失败,程序异常:"+e.getMessage());
			return rs; 
		}
		return rs;
	}
	
	/**

	 *根据用户名重置用户密码
	 * @return 
	 */
	@RequestMapping(value="/dglyResetPassword",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse dglyResetPassword(@RequestParam(name="loginName") String loginName){
		BaseResponse rs = new BaseResponse();
		try {
			//修改用户密码
			userService.dglyResetPassword(loginName);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.setMessage("重置用户密码成功");
			
		} catch (Exception e) {
			logger.error(e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("重置用户密码失败,程序异常:"+e.getMessage());
			return rs; 
		}
		return rs;
	}
	
	/**

	 * 查询角色信息
	 * @return 
	 */
	@RequestMapping(value="/findRole",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findRole(HttpServletRequest request, HttpServletResponse response){
		BaseResponse rs = new BaseResponse();
		try {
			//查询用户
			List<Role>  roleList = userService.selectRole();
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("result", roleList);
			rs.setMessage("查询角色信息成功");
			
		} catch (Exception e) {
			logger.error(e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("查询角色信息失败,程序异常:"+e.getMessage());
			return rs; 
		}
		return rs;
	}	
	
	/**
	 * 查询系统用户角色
	 * @return 
	 */
	@RequestMapping(value="/findRole_xtyh",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findRole_xtyh(HttpServletRequest request, HttpServletResponse response){
		BaseResponse rs = new BaseResponse();
		try {
			//查询系统用户角色
			List<Role>  roleList = userService.selectRole_xtyh();
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("result", roleList);
			rs.setMessage("查询角色信息成功");
			
		} catch (Exception e) {
			logger.error(e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("查询角色信息失败,程序异常:"+e.getMessage());
			return rs; 
		}
		return rs;
	}
	
	/**
	 * 查询系统用户角色--行政建店
	 * @return 
	 */
	@RequestMapping(value="/findRole_xzjd",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findRole_xzjd(HttpServletRequest request, HttpServletResponse response){
		BaseResponse rs = new BaseResponse();
		try {
			//查询系统用户角色
			List<Role>  roleList = userService.selectRole_xzjd();
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("result", roleList);
			rs.setMessage("查询角色信息成功");
			
		} catch (Exception e) {
			logger.error(e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("查询角色信息失败,程序异常:"+e.getMessage());
			return rs; 
		}
		return rs;
	}
	
	/**
	 * 根据登录名和密码查询用户信息
	 * @return 
	 */
	@RequestMapping(value="/selectUserInfo",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse selectUserInfo(@RequestParam(name = "loginName") String loginName,
			@RequestParam(name = "password") String password) {
		BaseResponse rs = new BaseResponse();
		try {
			UserVo user = userService.selectUserInfo(loginName, password);
			if(user != null){
				rs.setSuccess(true);
				rs.addContent("status", "OK");
				rs.addContent("result", user);
			}else{
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				rs.addContent("result", user);			
			}
		} catch (Exception e) {
			logger.info("查询用户信息失败,程序异常:", e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("查询用户信息失败,程序异常");
			return rs; 
		}
		return rs;

	}	
	
	/**
	 * 根据登录名查询查询,检验用户名存在
	 * @return 
	 */
	@RequestMapping(value="/selectByLoginName",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse selectByLoginName(@RequestParam(name = "loginName") String loginName) {
		BaseResponse rs = new BaseResponse();
		try {
			int count = userService.selectByLoginName(loginName);
			rs.setSuccess(true);
			rs.addContent("result", count);	
			if(count==0){
				rs.addContent("status", "NO");
			}else{
				rs.addContent("status", "OK");
			}
			return rs;
		} catch (Exception e) {
			logger.info("验证用户名存在与否失败,程序异常:", e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("验证用户名存在与否失败,程序异常:"+e.getMessage());
			return rs; 
		}
	}	
	
	/**
	 *更改用户状态(暂停禁用潜客)
	 * param id 是被禁用的用户id
	 * param userId 是操作禁用的用户id
	 * @return 
	 */
	@RequestMapping(value="/updateUserStatus",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse updateUserStatus(@RequestParam(name="id") Integer id,
			@RequestParam(name="status") Integer status,
			@RequestParam(name="storeId") Integer storeId,
			@RequestParam(name="roleId") Integer roleId,
			@RequestParam(name="userId") Integer userId){
		BaseResponse rs = new BaseResponse();
		try {
			Integer xbzyRoleId = RoleType.XBZY;
			if(status == 2){
				// 校验是否有续保专员
				List<User> list = userService.findByRoleId(xbzyRoleId,storeId);
				if(list.size() < 0){
					logger.error("禁用失败,没有续保专员可分配");
					rs.setSuccess(false);
					rs.addContent("status", "BAD");
					rs.setMessage("禁用失败,没有续保专员可分配");
					return rs; 
				}
			}
			//修改用户状态
			userService.updateUserStatus(id, status,storeId,roleId,userId);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.setMessage("更改用户状态成功");
		}catch (NoUserAssignException e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage(e.getMessage());
			return rs; 
		}catch (Exception e) {
			logger.error("更改用户状态失败,程序异常",e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("更改用户状态失败");
			return rs; 
		}
		return rs;
	}
	
	/**
	 * 查询各种用户
	 * @return 
	 */
	@RequestMapping(value="/findKindsUser",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findKindsUser(@RequestParam(name="storeId") Integer storeId){
		BaseResponse rs = new BaseResponse();
		try {
			//查询用户
			Map<String,List<User>>  users = userService.findKindsUser(storeId);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("result", users);
			rs.setMessage("查询角色信息成功");
			
		} catch (Exception e) {
			logger.error(e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("查询角色信息失败,程序异常:"+e.getMessage());
			return rs; 
		}
		return rs;
	}	
	
	/**
	 * 给用户设置登录uuid
	 * @return 
	 */
	@RequestMapping(value="/updateUserUuId",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse updateUserUuId(@RequestParam(name="userId") Integer userId,
			@RequestParam(name="loginUuId") String loginUuId,
			@RequestParam(name="loginAppUuId") String loginAppUuId){
		BaseResponse rs = new BaseResponse();
		try {
			//更新用户,给用户设置登录uuid
			User user = new User();
			user.setId(userId);
			user.setLoginUuId(loginUuId);
			user.setLoginAppUuId(loginAppUuId);
			userService.updateUser(user);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
		} catch (Exception e) {
			logger.error("设置登录uuid失败",e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("设置登录uuid失败,程序异常");
			return rs; 
		}
		return rs;
	}	
	
	/**
	 * 根据用户id查询用户
	 * @return 
	 */
	@RequestMapping(value="/findUserById",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findUserById(@RequestParam(name="userId") Integer userId){
		BaseResponse rs = new BaseResponse();
		try {
			//查询用户
			User user = userService.findUserById(userId);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("result", user);	
			return rs;
		} catch (Exception e) {
			logger.error("根据用户id查询用户失败", e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("根据用户id查询用户失败,程序异常");
			return rs; 
		}
	}
	
	
	/**
	 * 根据4s店id和角色id查询用户, 作为持有人下拉框查询条件数据源 
	 * @return 
	 */
	@RequestMapping(value="/selectUserForHolderSearch",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse selectUserForHolderSearch(@RequestParam(name="storeId") Integer storeId,
			@RequestParam(name="roleId") Integer roleId){
		BaseResponse rs = new BaseResponse();
		try {
			Map<String, Object> map = new HashMap<String, Object>();
			map.put("storeId", storeId);
			map.put("roleId", roleId);
			//查询用户
			List<User> users = userService.selectUserForHolderSearch(map);
			
			if(roleId==null||(roleId==1||roleId==3||roleId==10||roleId==11||roleId==16||roleId==22)){
				//添加几个角色全部查询
				List<User> us = new ArrayList<User>();
				User user = new User();
				user.setUserName("全部续保专员");
				us.add(user);
				User user1 = new User();
				user1.setUserName("全部销售顾问");
				us.add(user1);
				User user2 = new User();
				user2.setUserName("全部服务顾问");
				us.add(user2);
				User user3 = new User();
				user3.setUserName("全部客服专员");
				us.add(user3);
				users.addAll(0, us);
			}
			
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("result", users);	
			return rs;
		} catch (Exception e) {
			logger.error("根据店id查询用户失败", e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("根据店id查询用户失败,程序异常");
			return rs; 
		}
	}
	
	/**
	 * 查询系统用户角色--集团管理员
	 * @return 
	 */
	@RequestMapping(value="/findRoleByBloc",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findRoleByBloc(@RequestParam(name="condition") String condition,
			@RequestParam(name="jtId") Integer jtId){
		BaseResponse rs = new BaseResponse();
		try {
			Map<String, Object> map = new HashMap<String, Object>();
			if(jtId==null){
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				rs.setMessage("集团ID为空，非法登录！");
				return rs;
			}
			map.put("jtId", jtId);
			ObjectMapper  objectMapper = new ObjectMapper();
			@SuppressWarnings("unchecked")
			Map<String,Object> param = (Map<String,Object>)objectMapper.readValue(condition, Map.class);
			String type = (String)param.get("type");
			Integer unitId = (Integer)param.get("unitId");
			map.put("unitId", unitId);
			String ids = "";
			String idsAll = "";
			if(unitId!=null){
				if(type.equals("事业部总经理")){
					ids = "51";
					idsAll = "51";
				}else if(type.equals("销售部")){
					ids = "52";
					idsAll = "52,53";
				}else if(type.equals("市场部")){
					ids = "54";
					idsAll = "54,55";
				}else if(type.equals("售后部")){
					ids = "56";
					idsAll = "56,57";
				}else if(type.equals("衍生部")){
					ids = "58";
					idsAll = "58,59";
				}
			}else{
				if(type.equals("集团总")){
					ids = "41";
					idsAll = "41";
				}else if(type.equals("运营部")){
					ids = "42,43,44";
					idsAll = "42,43,44";
				}else if(type.equals("市场部")){
					ids = "45,46";
					idsAll = "45,46,47";
				}else if(type.equals("衍生部")){
					ids = "48,49";
					idsAll = "48,49,50";
				}
			}
			map.put("ids", ids);
			map.put("idsAll", idsAll);
			
			//查询系统用户角色
			List<Role>  roleList = userService.findRoleByBloc(map);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("result", roleList);
			rs.setMessage("查询角色信息成功");
			
		} catch (Exception e) {
			logger.error(e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("查询角色信息失败,程序异常:"+e.getMessage());
			return rs;
		}
		return rs;
	}
	
	/**
	 * 集团管理员能查到的用户
	 * @param jtId
	 * @return
	 */
	@RequestMapping(value="/findUser_jtgl",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findUser_jtgl(@RequestParam(name="jtId") Integer jtId,
			@RequestParam(name="condition") String condition){
		BaseResponse rs = new BaseResponse();
		try {
			if(jtId==null){
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				rs.setMessage("集团ID为空，查询集团用户信息失败");
				return rs;
			}
			
			Map<String,Object> param = new HashMap<String, Object>();
			if(condition!=null&&condition.length()>0){
				ObjectMapper objectMapper = new ObjectMapper();
				param = (Map<String,Object>)objectMapper.readValue(condition, Map.class);
			}
			param.put("jtId", jtId);
			//查询集团用户
			List<User> userList = userService.findUser_jtgl(param);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("result", userList);
			rs.setMessage("查询集团用户成功");
			
		} catch (Exception e) {
			logger.error(e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("查询集团用户信息失败,程序异常:"+e.getMessage());
			return rs; 
		}
		return rs;
	}
	
	/**
	 * 建档人下拉框的数据源
	 * @param storeId
	 * @return
	 */
	@RequestMapping(value="/selectUserForJdrDataSource",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse selectUserForJdrDataSource(@RequestParam(name="storeId") Integer storeId){
		BaseResponse rs = new BaseResponse();
		try {
			List<User> userList = userService.selectUserForJdrDataSource(storeId);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("result", userList);
			rs.setMessage("查询用户成功");
			
		} catch (Exception e) {
			logger.error("建档人下拉框的数据源查询失败,程序异常:", e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("建档人下拉框的数据源查询失败,程序异常");
			return rs; 
		}
		return rs;
	}
	
	/**
	 * 查询区域分析师和店的关系-行政建店
	 * @param roleId
	 * @return
	 */
	@RequestMapping(value="/findUser_xzjd_store",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findUser_xzjd_store(@RequestParam(name="roleId") Integer roleId){
		BaseResponse rs = new BaseResponse();
		try {
			if(roleId!=null&&roleId==17){
				List<User> userList = userService.findUser_xzjd_store();
				rs.setSuccess(true);
				rs.addContent("status", "OK");
				rs.addContent("result", userList);
				rs.setMessage("查询用户成功");
			}else{
				rs.setSuccess(false);
				rs.addContent("status", "BAD");
				rs.setMessage("不是店管理员，查询用户失败！"); 
			}
		} catch (Exception e) {
			logger.error("查询用户失败,程序异常:", e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("查询用户失败,程序异常"); 
		}
		return rs;
	}
	
	/**
	 * 根据区域分析师的ID查询绑定的店
	 * @param dataAnalystId
	 * @return
	 */
	@RequestMapping(value="/findStoreByUser",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse findStoreByUser(@RequestParam(name="dataAnalystId")Integer dataAnalystId){
		BaseResponse rs = new BaseResponse();
		try {
			Map<String,Object> param = new HashMap<String,Object>();
			List<Store> stores = storeService.findStoreByCondition(param);
			Map<String,Object> map = new HashMap<String,Object>();
			map.put("dataAnalystId", dataAnalystId+"");
			List<Store> stores1 = storeService.findStoreByCondition(map);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.addContent("result", stores);
			rs.addContent("result1", stores1);
			return rs;
		} catch (Exception e) {
			logger.error("根据用户id查询用户失败", e);
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("根据用户id查询用户失败,程序异常");
			return rs; 
		}
	}
	
	/**
	 * 修改区域分析和店之间的关联
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping(value="/updateUserAndStore",method={RequestMethod.POST})
	@ResponseBody 
	public BaseResponse updateUserAndStore(HttpServletRequest request, HttpServletResponse response){
		BaseResponse rs = new BaseResponse();
		String condition = request.getParameter("condition");
		if(StringUtils.isEmpty(condition)){
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("区域分析师信息为空,修改事业部门和店之间的关联失败!");
			return rs; 
		}
		try {
			ObjectMapper objectMapper = new ObjectMapper();
			@SuppressWarnings("unchecked")
			Map<String,Object> param = (Map<String,Object>)objectMapper.readValue(condition, Map.class);
			//调用service修改事业部门和店之间的关联
			userService.updateUserAndStore(param);
			rs.setSuccess(true);
			rs.addContent("status", "OK");
			rs.setMessage("修改区域分析师和店之间的关联成功");
			return rs;
		} catch (Exception e) {
			rs.setSuccess(false);
			rs.addContent("status", "BAD");
			rs.setMessage("修改区域分析师和店之间的关联失败,程序异常");
			logger.info("修改区域分析师和店之间的关联失败,程序异常:", e);
			return rs; 
		}
	}
	
}
