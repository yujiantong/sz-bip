package com.bofide.bip.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.bofide.bip.po.GiftPackageDetail;

public interface GiftPackageDetailMapper {
	
	/**
	 * 添加礼包明细表信息
	 * */
	int insertPackageDetail(GiftPackageDetail giftPackageDetail) throws Exception;
	
	/**
	 * 查询礼包中的赠品明细
	 * */
	List<GiftPackageDetail> findGiftDetailByPackageId(@Param("packageId")Integer packageId) throws Exception;
	
	/**
	 * 删除礼包明细
	 * */
	void deleteGiftByPackageId(@Param("packageId")Integer packageId) throws Exception;
	
}
