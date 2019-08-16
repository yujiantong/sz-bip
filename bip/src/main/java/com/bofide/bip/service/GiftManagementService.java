package com.bofide.bip.service;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.bofide.bip.mapper.GiftManagementMapper;
import com.bofide.bip.mapper.GiftPackageDetailMapper;
import com.bofide.bip.po.GiftManagement;
import com.bofide.bip.po.GiftPackageDetail;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;


@Service(value = "giftManagementService")
public class GiftManagementService {
	@Resource(name="giftManagementMapper")
	private GiftManagementMapper giftManagementMapper;
	@Resource(name="giftPackageDetailMapper")
	private GiftPackageDetailMapper giftPackageDetailMapper;
	/**
	 * 添加赠品
	 * @param giftManagement
	 * @throws Exception
	 */
	public void insertGiftManagement(GiftManagement giftManagement) throws Exception {
		//新增的默认都是2,表示未生效
		giftManagement.setStatus(2);
		giftManagementMapper.insertGiftManagement(giftManagement);
		if(giftManagement.getGiftType()!=null&&giftManagement.getGiftType()==3){
			//若是礼包类赠品,将礼包明细插入礼包明细表
			List<GiftPackageDetail> giftPackageDetails= giftManagement.getGiftPackageDetails();
			for(int i=0; i<giftPackageDetails.size(); i++){
				GiftPackageDetail giftPackageDetail = giftPackageDetails.get(i);
				giftPackageDetail.setPackageId(giftManagement.getId());
				giftPackageDetailMapper.insertPackageDetail(giftPackageDetail);
			}
		}
	}
	
	/**
	 * 根据不同条件查询赠品
	 * @param param
	 * @return 
	 * @throws Exception
	 */
	public List<GiftManagement> findGiftByCondition(Map<String,Object> param) throws Exception {
		List<GiftManagement> giftManagements = giftManagementMapper.findGiftByCondition(param);
		for(int i=0;i<giftManagements.size();i++){
			GiftManagement giftManagement = giftManagements.get(i);
			if(giftManagement!=null){
				List<GiftPackageDetail> giftPackageDetails = giftPackageDetailMapper.findGiftDetailByPackageId(giftManagement.getId());
				giftManagement.setGiftPackageDetails(giftPackageDetails);
			}
		}
		return giftManagements;
	}
	
	/**
	 * 根据赠品编码查询赠品
	 * @param param
	 * @return 
	 * @throws Exception
	 */
	public GiftManagement findGiftByCode(Map<String,Object> param) throws Exception {
		GiftManagement giftManagement = giftManagementMapper.findGiftByCode(param);
		if(giftManagement!=null){
			List<GiftPackageDetail> giftPackageDetails = giftPackageDetailMapper.findGiftDetailByPackageId(giftManagement.getId());
			giftManagement.setGiftPackageDetails(giftPackageDetails);
		}
		return giftManagement;
	}
	
	/**
	 * 修改赠品根据id
	 * @param param
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	public void updateGiftById(Map<String,Object> param) throws Exception {
		List<GiftPackageDetail> giftPackageDetails = null;
		giftManagementMapper.updateGiftById(param);
		Integer giftType = (Integer) param.get("giftType");
		if(giftType!=null&&giftType==3){
			//若是礼包类赠品,先删除礼包明细,再重新插入
			Integer packageId = (Integer) param.get("id");
			giftPackageDetailMapper.deleteGiftByPackageId(packageId);
			List<Map<String,Object>> packageDetails = (List<Map<String, Object>>) param.get("giftPackageDetails");
			ObjectMapper mapper = new ObjectMapper();
			String jsonStr = mapper.writeValueAsString(packageDetails);
			giftPackageDetails = mapper.readValue(jsonStr,new TypeReference<List<GiftPackageDetail>>() {});
			for(int i=0; i<giftPackageDetails.size(); i++){
				GiftPackageDetail giftPackageDetail = giftPackageDetails.get(i);
				giftPackageDetail.setPackageId(packageId);
				giftPackageDetailMapper.insertPackageDetail(giftPackageDetail);
			}
		}
	}
	
	/**
	 * 修改赠品根据code
	 * @param param
	 * @throws Exception
	 */
	public void updateGiftByCode(Map<String,Object> param) throws Exception {
		giftManagementMapper.updateGiftByCode(param);
	}
	
	/**
	 * 根据赠品编码或者名称自动联想查询赠品
	 * @param param
	 * @return 
	 * @throws Exception
	 */
	public List<GiftManagement> findGiftByCodeOrName(Map<String,Object> param) throws Exception {
		List<GiftManagement> giftManagements = giftManagementMapper.findGiftByCodeOrName(param);
		for(int i=0;i<giftManagements.size();i++){
			GiftManagement giftManagement = giftManagements.get(i);
			if(giftManagement!=null){
				List<GiftPackageDetail> giftPackageDetails = giftPackageDetailMapper.findGiftDetailByPackageId(giftManagement.getId());
				giftManagement.setGiftPackageDetails(giftPackageDetails);
			}
		}
		return giftManagements;
	}
}