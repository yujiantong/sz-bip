package com.bofide.bip.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import com.bofide.bip.po.Role;

public interface RoleMapper {
	
	/**
     * 查询角色记录(除了集团，厂家，超级管理员，4s店管理员)
     */
    List<Role> selectRole();
    
    /**
     * 查询角色记录(只查系统用户，当前只查系统分析员)
     */
    List<Role> selectRole_xtyh();
    //查询行政建店人员能新建的系统人员
    List<Role> selectRole_xzjd();

	Role findRoleNameByRoleId(@Param("roleId")Integer roleId);
	
	/**
	 * 查询集团管理人员能新建的角色
	 * @param param
	 * @return
	 * @throws Exception
	 */
	List<Role> findRoleByBloc(Map<String, Object> param) throws Exception;

}
