package com.bofide.bip.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import com.bofide.bip.po.BspUser;
import com.bofide.bip.po.User;
import com.bofide.bip.vo.UserVo;

public interface UserMapper {
	/**
     * 查询指定用户所有的下级,除开特定用户
     */
	List<User> findAllSubordinate(@Param("userId")Integer userId,
			@Param("principalId")Integer principalId,@Param("storeId")Integer storeId)throws Exception;
	/**
     * 查询指定用户所有的下级
     */
	List<User> findSubordinate(@Param("userId")Integer userId,@Param("storeId")Integer storeId)throws Exception;
	
	/**
     * 根据4s店id查询记录
     */
	List<User> selectByStoreId(@Param("storeId")Integer storeId)throws Exception;
	
	/**
     * 查询系统用户   --数据分析师
     */
	List<User> findUser_xtyh()throws Exception;
	/**
     * 根据4s店id和角色id查询记录
     */
	List<User> selectUserByroleId(@Param("storeId")Integer storeId,@Param("roleId")Integer roleId)throws Exception;
	
	/**
     * 软删除用户
     */
	int updateById(@Param("id")Integer id)throws Exception;
	
	/**
     * 修改用户密码
     */
	int updatePassword(Map param)throws Exception;
	/**
     * 修改用户密码
     */
	int updatePwd(Map param)throws Exception;
	/**
     * 根据用户名修改用户密码
     */
	int updatePasswordByLoginName(Map param)throws Exception;
	
	/**
     * 修改用户信息
     */
	int updateUser(User user)throws Exception;
	
	/**
	 * 根据4S店Id解除绑定4S店中的有绑定用户
	 * @param param Map<String, Object> storeId 4S店Id
	 * @return  int 影响的条数
	 * @throws Exception
	 */
	int updateUnbindUserbyStoreId(Map<String, Object> param)throws Exception;
	
	/**
     * 重置密码
     */
	int resetPassword(@Param("userId")Integer userId)throws Exception;
	
	/**
     * 新增用户
     */
	Integer insert(User user)throws Exception;
	
	/**
     * 根据4s店id和用户名查询用户
     */
	User selectUserByStoreId(@Param("storeId")Integer storeId,@Param("loginName")String loginName)throws Exception;

	/**
	 * 找到所有的续保专员
	 * @param roleId
	 * @param fourSStoreId 
	 * @return
	 */
	List<User> findByRoleId(@Param("roleId")Integer roleId, @Param("fourSStoreId")Integer fourSStoreId)throws Exception;

	
	/**

     * 设置用户上级id 
     */
	int updateSuperiorId(Map param)throws Exception;
	
	/**
     * 根据登录名和密码查询用户信息
     */
	UserVo selectUserInfo(@Param("loginName")String loginName,@Param("password")String password)throws Exception;
	
	/**
     * 根据登录名查询,验证用户名是否存在
     */
	int selectByLoginName(@Param("loginName")String loginName)throws Exception;
	
	/**
     * 根据主键查询记录
	 * @param fourSStoreId 
     */
	User selectByPrimaryKey(@Param("id")Integer id, @Param("fourSStoreId")Integer fourSStoreId)throws Exception;
	
	/**
     * 校验密码
     */
	User verifyPassword(@Param("id")Integer id,@Param("password")String password)throws Exception;
	
	
	
	/**
     * 根据4s店id查询所有上级用户
     */
	List<User> selectSuperUser(@Param("storeId")Integer storeId,@Param("roleId")Integer roleId)throws Exception;
	/**
	 * 第一次系统随机分配
	 * @param roleId
	 * @param fourSStoreId 
	 * @return
	 */
	List<User> findFirstAllAssign(@Param("roleId")Integer roleId, @Param("fourSStoreId")Integer fourSStoreId)throws Exception;
	/**
	 * 根据用户id获取正常状态用户
	 * @param workerId
	 * @return
	 */
	User findRoleByUserId(Integer workerId)throws Exception;
	/**
	 * 根据用户id获取正常状态和暂停状态用户
	 * @param workerId
	 * @return
	 * @throws Exception
	 */
	User findRoleByUserId2(Integer workerId)throws Exception;

	List<User> findPrincipal(@Param("storeId") Integer storeId) throws Exception;
	
	/**
     * 更改用户状态0正常1暂停2禁用 
     */
	int updateUserStatus(Map param) throws Exception;
	
	/**
     * 根据4s店id和角色id查询记录
     */
	List<User> selectByStoreIdAndRoleId(@Param("storeId")Integer storeId,@Param("roleId")Integer roleId)throws Exception;
	
	/**
     * 根据4s店id和角色id查询用户, 作为持有人下拉框查询条件数据源 
     */
	List<User> selectUserForHolderSearch(Map<String, Object> map)throws Exception;
	
	/**
     * 根据4s店id查询所有销售顾问和服务顾问
     */
	List<User> selectAdivserByStoreId(@Param("storeId")Integer storeId)throws Exception;

	List<User> findUserByUserIds(List<Integer> list)throws Exception;

	User findSuperiorBySuperiorId(@Param("superiorId")Integer superiorId);
	
	/**
     * 根据4s店id和用户id查询用户名
     */
	String findUserNameByStoreIdAndUserId(@Param("storeId") Integer storeId,
			@Param("userId") Integer userId) throws Exception;
	
	/**
     * 根据4s店id和用户名及角色查询用户id
     */
	List<User> findUserIdByUserName(@Param("storeId") Integer storeId,
			@Param("userName") String userName, @Param("roleId") Integer roleId) throws Exception;
	
	/**
     * 根据4s店id和用户名查询业务员id
     */
	List<User> findClerkIdByUserName(@Param("storeId") Integer storeId,
			@Param("userName") String userName) throws Exception;

	List<User> findSuperiorByRoleId(@Param("roleId")Integer roleId, @Param("storeId")Integer storeId)throws Exception;

	List<User> findAllPrincipal(Map<String, Object> param)throws Exception;

	List<User> findUndering(@Param("roleId")Integer roleId, @Param("storeId")Integer storeId)throws Exception;
	
	/**
     * 根据4s店id和用户名及角色查询用户id
     */
	List<User> findUsersByStoreIdAndRoleId(@Param("storeId") Integer storeId,
		@Param("roleId") Integer roleId) throws Exception;

	List<User> findStatisticaUndering(@Param("roleId")Integer roleId, @Param("storeId")Integer storeId) throws Exception;

	List<User> findUsersByStoreIdAndRoleId2(@Param("storeId") Integer storeId,
			@Param("roleId") Integer roleId)throws Exception;
	/**

     * 更改用户系统消息id
     */
	int updateSysMessageId(@Param("sysMessageId") Integer sysMessageId,
			@Param("userId") Integer userId)throws Exception;
	
	/**
     * 根据用户id查询用户信息
     */
	User findUserById(@Param("userId") Integer userId) throws Exception;

	List<User> findBangedUser(Map<String, Object> param)throws Exception;

	List<User> findBipUser(Map<String, Object> param)throws Exception;

	


	User findBindUserById(Map<String, Object> param)throws Exception;

	User findBindUserByBspUserId(Map<String, Object> param)throws Exception;

	UserVo selectUserInfoByBipUserId(Map<String, Object> param)throws Exception;

	User findUserByIdIsNoDel(@Param("userId")Integer userId,@Param("storeId") Integer storeId)throws Exception;

	List<User> findSubordinates(@Param("roleId")Integer roleId, @Param("storeId")Integer storeId)throws Exception;

	User findFixData(Map<String, Object> param)throws Exception;
	
	/**
	 * 根据4s店id查询续保主管
	 * @param storeId 4S店Id
	 * @return
	 * @throws Exception
	 */
	User findXBZGByStoreId(@Param("storeId") Integer storeId)throws Exception;
	
	/**
	 * 根据潜客id查询持有人
	 * @param customerId 潜客店Id
	 * @return
	 * @throws Exception
	 */
	User findHolderByCustomerId(@Param("customerId") Integer customerId)throws Exception;

	List<Map<String, Object>> findUserHoldCustomerNum(Map<String, Object> param)throws Exception;
	
	List<User> findUsersByStoreId(@Param("storeId") Integer storeId)throws Exception;
	//行政建店人员可以查询的用户
	List<User> findUser_xzjd()throws Exception;
	
	/**
	 * 用于平均分配查询用户
	 * @param param
	 * @return
	 * @throws Exception
	 */
	List<User> findUserByDistribution(Map<String, Object> param)throws Exception;
	/**
	 * 用于解决死锁先查询后更新(查询)
	 * @param param
	 * @return
	 * @throws Exception
	 */
	List<User> findUserByResolveDeadlock(Map<String, Object> param)throws Exception;
	
	
	/**
	 * 用于平均分配修改用户
	 * @param param
	 * @return
	 * @throws Exception
	 */
	int updateUserByDistribution(Map<String, Object> param)throws Exception;
	/**
	 * 用于解决死锁先查询后更新(更新)
	 * @param param
	 * @return
	 * @throws Exception
	 */
	int updateUserByResolveDeadlock(Map<String, Object> param)throws Exception;
	/**
	 * 集团管理员能查到的用户
	 * @return
	 * @throws Exception
	 */
	List<User> findUser_jtgl(Map<String, Object> param)throws Exception;
	
	/**
	 * 根据电话号码查询 
	 * @param phone
	 * @return
	 * @throws Exception
	 */
	List<User> selectUserByPhone(@Param("phone")String phone)throws Exception;
	/**
	 * 出单员禁用时校验出单员是否存在
	 * @param param
	 * @return
	 * @throws Exception
	 */
	Integer findCountByUserCdy(Map<String, Object> param)throws Exception;

	void deleteUserByJtid(Map<String, Object> param)throws Exception;
	
	/**
	 * 查询区域分析师和店的关系-行政建店
	 * @return
	 * @throws Exception
	 */
	List<User> findUser_xzjd_store()throws Exception;
	/**
	 * 通过用户名查询出手机号
	 * @param loginName
	 * @return
	 */
	List<User> selectByLoginNameAjax(@Param("loginName")String loginName);
	int resetUpdatePassword(Map<String, Object> param);
}
