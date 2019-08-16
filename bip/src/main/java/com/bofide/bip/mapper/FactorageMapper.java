package com.bofide.bip.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.bofide.bip.po.Factorage;

public interface FactorageMapper {
	
	 /**
     * 根据关联保险公司主id查询记录
     */
    List<Factorage> selectByCompPreId(@Param("compPreId")Integer compPreId, @Param("storeId")Integer storeId);
    
    /**
     * 查询手续费根据险种手续费
     * 
     * @param compPreId 保险公司ID
     * @param storeId 店ID
     * @param insuName 手续费字段
     * @return
     */
    Factorage selectFactorage(@Param("compPreId")Integer compPreId, 
    		@Param("storeId")Integer storeId, @Param("factorageInsuName")String factorageInsuName);
    
    /**
     * 根据主键id更新记录
     */
    int updateFactorage(Factorage factorage);
    
    /**
     * 保存记录
     */
    int insert(Factorage factorage);


}
