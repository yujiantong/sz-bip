package com.bofide.bip.service;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bofide.bip.mapper.FactorageMapper;
import com.bofide.bip.mapper.InsuranceCompMapper;
import com.bofide.bip.mapper.InsuranceTypeMapper;
import com.bofide.bip.mapper.ModuleSetMapper;
import com.bofide.bip.mapper.StoreMapper;
import com.bofide.bip.mapper.TraceDaySetMapper;
import com.bofide.bip.mapper.UpdateSxfRecordMapper;
import com.bofide.bip.mapper.UserMapper;
import com.bofide.bip.po.Factorage;
import com.bofide.bip.po.InsuranceComp;
import com.bofide.bip.po.InsuranceType;
import com.bofide.bip.po.ModuleSet;
import com.bofide.bip.po.Store;
import com.bofide.bip.po.TraceDaySet;
import com.bofide.bip.po.UpdateSxfRecord;
import com.bofide.bip.po.User;

@Service(value = "SettingService")
public class SettingService {
	@Resource(name = "insuranceCompMapper")
	private InsuranceCompMapper insuranceCompMapper;
	@Resource(name = "moduleSetMapper")
	private ModuleSetMapper moduleSetMapper;
	@Resource(name = "traceDaySetMapper")
	private TraceDaySetMapper traceDaySetMapper;
	@Resource(name = "factorageMapper")
	private FactorageMapper factorageMapper;
	@Resource(name = "insuranceTypeMapper")
	private InsuranceTypeMapper insuranceTypeMapper;
	@Resource(name = "storeMapper")
	private StoreMapper storeMapper;
	@Resource(name = "userMapper")
	private UserMapper userMapper;
	@Resource(name = "updateSxfRecordMapper")
	private UpdateSxfRecordMapper updateSxfRecordMapper;
	@Autowired
	private CommonService commonService;
	/**
	 * 初始化页面
	 * @throws Exception 
	 */
	public List<Map<String,Object>> initiInsuranceComp(Integer fourSId) throws Exception {
		List<InsuranceComp> listAll = insuranceCompMapper.findInsuranceComp();
		List<Map<String,Object>> listFourS = findByFourSId(fourSId);
		List<Map<String,Object>> list = compare(listAll,listFourS);
		return list;
	}
	

	private List<Map<String,Object>> compare(List<InsuranceComp> listAll, List<Map<String,Object>> listFourS) {
		List<Map<String,Object>> list = new ArrayList<Map<String,Object>>();
		for(InsuranceComp insuranceComp : listAll){
			Integer insuranceCompId = insuranceComp.getInsuranceCompId();
			Map<String,Object> map = new HashMap<String,Object>();
			for(Map insuranceCompBy4S : listFourS){
				Integer insuranceCompIdBy4S = (Integer)insuranceCompBy4S.get("insuranceCompId");
				if(insuranceCompId == insuranceCompIdBy4S){
					map.put("statu", true);
					Integer fourSId = (Integer)insuranceCompBy4S.get("fourSId");
					map.put("fourSId", fourSId);
					 
				}
			
			}
			map.put("insuranceComp", insuranceComp);
			if(map.get("statu")==null){
				map.put("statu", false);
			}
			
			list.add(map);
		}
		return list;
	}


	/**
	 * 查询4s店选定的保险公司id
	 * @param fourSId
	 * @return
	 * @throws Exception 
	 */
	public List<Map<String,Object>> findByFourSId(Integer storeId) throws Exception {
		List<Map<String,Object>> list = insuranceCompMapper.findByFourSId(storeId);
		return list;
	}
	
	public List<InsuranceComp> findbyInsuranceCompIds(List<Integer> listFourS) {
		List<InsuranceComp> list = insuranceCompMapper.findbyInsuranceCompIds(listFourS);
		return list;
	}
	
	public void updateInsuranceStatu(List<Integer> listId,Integer fourSId) throws Exception {
		
		//清空原始数据
		int num = insuranceCompMapper.deleteInsuranceComp(fourSId);
		//将选中的数据重新插入
		for(Integer insuranceCompId : listId){
			Map<String,Object> param = new HashMap<String,Object>();
			param.put("insuranceCompId", insuranceCompId);
			param.put("fourSId", fourSId);
			insuranceCompMapper.insertInsuranceComp(param);
			//给选定的保险公司初始化数据
			//初始化手续费之前查询是否本店的该保险公司是否有设置手续费，若有，则不初始化，若无，则初始化
			List<Factorage> factorageList = factorageMapper.selectByCompPreId(insuranceCompId, fourSId);
			if(factorageList == null || factorageList.size() <= 0){
				//没有设置手续费，初始化
				Factorage binsuranceNew = new Factorage();//新商业保
				Factorage cinsuranceNew = new Factorage();//新交强保
				Factorage binsurance = new Factorage();//续商业保
				Factorage cinsurance = new Factorage();//续交强保
				Factorage binsuranceNewLoan = new Factorage();//新商业保贷款
				Factorage cinsuranceNewLoan = new Factorage();//新交强保贷款
				binsuranceNew.setCompPreId(insuranceCompId);
				binsuranceNew.setInsuName("binsuranceNew");
				binsuranceNew.setStoreId(fourSId);
				binsuranceNew.setInsuPercent(Float.valueOf(28));
				
				cinsuranceNew.setCompPreId(insuranceCompId);
				cinsuranceNew.setInsuName("cinsuranceNew");
				cinsuranceNew.setStoreId(fourSId);
				cinsuranceNew.setInsuPercent(Float.valueOf(4));
				
				binsurance.setCompPreId(insuranceCompId);
				binsurance.setInsuName("binsurance");
				binsurance.setStoreId(fourSId);
				binsurance.setInsuPercent(Float.valueOf(23));
				
				cinsurance.setCompPreId(insuranceCompId);
				cinsurance.setInsuName("cinsurance");
				cinsurance.setStoreId(fourSId);
				cinsurance.setInsuPercent(Float.valueOf(4));
				
				binsuranceNewLoan.setCompPreId(insuranceCompId);
				binsuranceNewLoan.setInsuName("binsuranceNewLoan");
				binsuranceNewLoan.setStoreId(fourSId);
				binsuranceNewLoan.setInsuPercent(Float.valueOf(0));
				
				cinsuranceNewLoan.setCompPreId(insuranceCompId);
				cinsuranceNewLoan.setInsuName("cinsuranceNewLoan");
				cinsuranceNewLoan.setStoreId(fourSId);
				cinsuranceNewLoan.setInsuPercent(Float.valueOf(0));
				
				factorageMapper.insert(binsuranceNew);
				factorageMapper.insert(cinsuranceNew);
				factorageMapper.insert(binsurance);
				factorageMapper.insert(cinsurance);
				factorageMapper.insert(binsuranceNewLoan);
				factorageMapper.insert(cinsuranceNewLoan);
			}
		}
		
	}
	
	public void addInsuranceType(Integer insuranceCompId, String bInsuranceType) {
		Map<String,Object> param = new HashMap<String,Object>();
		param.put("insuranceCompId", insuranceCompId);
		param.put("bInsuranceType", bInsuranceType);
		insuranceCompMapper.addInsuranceType(param);
		
	}
	
	
	/**
	 * 查询模块开启设置
	 * @param fourSStoreId
	 * @return
	 * @throws Exception
	 */
	public List<ModuleSet> findModileSet(Integer fourSStoreId) throws Exception{
		
		 List<ModuleSet> moduleSetList = moduleSetMapper.selectByFoursStoreId(fourSStoreId);
		 return moduleSetList;
		
	}
	
	/**
	 * 查询级别跟踪天数设置
	 * @param fourSStoreId
	 * @return
	 * @throws Exception
	 */
	public  List<TraceDaySet> findTraceDaySet(Integer fourSStoreId) throws Exception{
		
		 List<TraceDaySet> traceDaySetList = traceDaySetMapper.selectByFoursStoreId(fourSStoreId);
		 return traceDaySetList;
		
	}
	
	/**
	 * 更新模块开启设置
	 * @param moduleSetList 模块设置信息list
	 * @return
	 * @throws Exception
	 */
	public void updateModuleSet(List<ModuleSet> moduleSetList) throws Exception{
		for (ModuleSet moduleSet : moduleSetList) {
			if ("csModule".equals(moduleSet.getModuleName())) {
				Integer storeId = moduleSet.getFourSStoreId();
				Store store = storeMapper.selectByPrimaryKey(storeId);
				// 检测客服模块的开关是否变化
				if (!moduleSet.getSwitchOn().equals(store.getCsModuleFlag())) {
					// 检测到开关变化,如果传过来的标识是0,则表示开关由开启变关闭;反之,则表示开关由关闭变开启
					// 将店的客服模块标志修改为传过来的最新标志
					Map<String, Object> paramMap = new HashMap<>();
					paramMap.put("storeId", storeId);
					paramMap.put("csModuleFlag", moduleSet.getSwitchOn());
					storeMapper.updateByStoreId(paramMap);
				}
			}else if ("asmModule".equals(moduleSet.getModuleName())) {
				Integer storeId = moduleSet.getFourSStoreId();
				Store store = storeMapper.selectByPrimaryKey(storeId);
				// 检测出单员模块的开关是否变化
				if (!moduleSet.getSwitchOn().equals(store.getAsmModuleFlag())) {
					// 检测到开关变化,如果传过来的标识是0,则表示开关由开启变关闭;反之,则表示开关由关闭变开启
					// 将店的出单员模块标志修改为传过来的最新标志
					Map<String, Object> paramMap = new HashMap<>();
					paramMap.put("storeId", storeId);
					paramMap.put("asmModuleFlag", moduleSet.getSwitchOn());
					storeMapper.updateByStoreId(paramMap);
				}
			}else if ("sale".equals(moduleSet.getModuleName())) {
				Integer storeId = moduleSet.getFourSStoreId();
				Store store = storeMapper.selectByPrimaryKey(storeId);
				// 检测销售模块的开关是否变化
				if (!moduleSet.getSwitchOn().equals(store.getSaleFlag())) {
					// 检测到开关变化,如果传过来的标识是0,则表示开关由开启变关闭;反之,则表示开关由关闭变开启
					// 将店的销售模块标志修改为传过来的最新标志
					Map<String, Object> paramMap = new HashMap<>();
					paramMap.put("storeId", storeId);
					paramMap.put("saleFlag", moduleSet.getSwitchOn());
					storeMapper.updateByStoreId(paramMap);
				}
			}else if ("afterSale".equals(moduleSet.getModuleName())) {
				Integer storeId = moduleSet.getFourSStoreId();
				Store store = storeMapper.selectByPrimaryKey(storeId);
				// 检测服务顾问模块的开关是否变化
				if (!moduleSet.getSwitchOn().equals(store.getAfterSaleFlag())) {
					// 检测到开关变化,如果传过来的标识是0,则表示开关由开启变关闭;反之,则表示开关由关闭变开启
					// 将店的服务顾问模块标志修改为传过来的最新标志
					Map<String, Object> paramMap = new HashMap<>();
					paramMap.put("storeId", storeId);
					paramMap.put("afterSaleFlag", moduleSet.getSwitchOn());
					storeMapper.updateByStoreId(paramMap);
				}
			}
			moduleSetMapper.updateByFoursIdAndMoName(moduleSet);
		}
	}
	
	/**
	 * 更新级别跟踪天数设置
	 * @param traceDayList 级别跟踪天数设置信息list
	 * @return
	 * @throws Exception
	 */
	public void updateTraceDaySet(List<TraceDaySet>  traceDayList) throws Exception{
		for (TraceDaySet traceDaySet : traceDayList) {
			traceDaySetMapper.updateByFoursIdAndCuLevel(traceDaySet);
		}
	}

	
	/**
	 * 插入级别跟踪天数设置信息
	 * @param factorageList 级别跟踪天数设置信息list
	 * @return
	 * @throws Exception
	 */
	public void insertTraceDaySet(List<TraceDaySet>  traceDayList) throws Exception{
		for (TraceDaySet traceDaySet : traceDayList) {
			traceDaySetMapper.insert(traceDaySet);
		}
	}
	
	/**
	 * 插入模块开启设置信息
	 * @param factorageList 模块开启设置信息list
	 * @return
	 * @throws Exception
	 */
	public void insertModuleSet(List<ModuleSet> moduleSetList) throws Exception{
		for (ModuleSet moduleSet : moduleSetList) {
			moduleSetMapper.insert(moduleSet);
		}
	}
	
	/**
	 * 插入手续费设置信息
	 * @param factorageList 手续费设置信息list
	 * @return
	 * @throws Exception
	 */
	public void insertFactorage(List<Factorage>  factorageList) throws Exception{
		for (Factorage factorage : factorageList) {
			factorageMapper.insert(factorage);
		}
	}
	
	/**
	 * 查询手续费设置
	 * @param compPreId 关联保险公司主id
	 * @return
	 * @throws Exception
	 */
	public List<Factorage> findFactorage(Integer compPreId,Integer storeId) throws Exception{
		
		List<Factorage>  factorageList = factorageMapper.selectByCompPreId(compPreId, storeId);
		 return factorageList;
		
	}
	
	/**
	 * 更新手续费设置
	 * 
	 * @param factorageList
	 *            手续费设置信息list
	 * @return
	 * @throws Exception
	 */
	public void updateFactorage(List<Factorage> factorageList,Integer userId,String userName) throws Exception {
		Integer compPreId = factorageList.get(0).getCompPreId();
		Integer storeId = factorageList.get(0).getStoreId();
		// 查询是否已经存在手续费设置
		for (Factorage factorage : factorageList) {
			Factorage factRecod = factorageMapper.selectFactorage(compPreId, storeId, factorage.getInsuName());
			InsuranceComp insuranceComp = insuranceCompMapper.selectByCompanyId(factorage.getCompPreId());
			List<User> zjlUsers = userMapper.selectUserByroleId(storeId,11);
			List<User> bxjlUsers = userMapper.selectUserByroleId(storeId,10);
			List<User> xbzgUsers = userMapper.selectUserByroleId(storeId,3);
			String content = "";
			String dateStr = new SimpleDateFormat("yyyy年MM月dd日").format(new Date());
			String insuranceName = "";
			if("binsuranceNew".equals(factorage.getInsuName())){
				insuranceName = "【新保商业险手续费(全款)】";
			}else if("cinsuranceNew".equals(factorage.getInsuName())){
				insuranceName = "【 新保交强险手续费(全款)】";
			}else if("binsurance".equals(factorage.getInsuName())){
				insuranceName = "【商业险手续费】";
			}else if("cinsurance".equals(factorage.getInsuName())){
				insuranceName = "【交强险手续费】";
			}else if("binsuranceNewLoan".equals(factorage.getInsuName())){
				insuranceName = "【新保商业险手续费(贷款)】";
			}else if("cinsuranceNewLoan".equals(factorage.getInsuName())){
				insuranceName = "【新保交强险手续费(贷款)】";
			}
			if(factRecod==null){
				// 为空则新增
				factorageMapper.insert(factorage);
				if(factorage.getInsuPercent()>0){
					content = dateStr + " " + insuranceComp.getInsuranceCompName() + "的" + insuranceName + "的手续费率从0%设置为"+ factorage.getInsuPercent() +"%,请知悉！";
					//新增未读消息
					Map<String,Object> param = new HashMap<String,Object>();
					param.put("storeId", storeId);
					param.put("operatorId", userId);
					param.put("operatorName",userName);
					param.put("content", content);
					//给总经理发个人消息
					param.put("userId", zjlUsers.size()>0 ? zjlUsers.get(0).getId() : 0);
					commonService.insertMessage(param);
					//给保险经理发个人消息
					param.put("userId", bxjlUsers.size()>0 ? bxjlUsers.get(0).getId() : 0);
					commonService.insertMessage(param);
					//给续保主管发个人消息
					param.put("userId", xbzgUsers.size()>0 ? xbzgUsers.get(0).getId() : 0);
					commonService.insertMessage(param);
					
					//添加手续费修改记录
					UpdateSxfRecord updateSxfRecord = new UpdateSxfRecord();
					updateSxfRecord.setStoreId(storeId);
					updateSxfRecord.setInsurerComId(factorage.getCompPreId());
					updateSxfRecord.setInsuranceName(factorage.getInsuName());
					updateSxfRecord.setPercentBefore(0.0f);
					updateSxfRecord.setPercentAfter(factorage.getInsuPercent());
					updateSxfRecord.setChanger(userName);
					updateSxfRecord.setChangerId(userId);
					updateSxfRecord.setChangeTime(new Date());
					updateSxfRecordMapper.insert(updateSxfRecord);
				}
			}else{
				//不为空则修改
				factorageMapper.updateFactorage(factorage);
				if(!factRecod.getInsuPercent().equals(factorage.getInsuPercent())){
					content = dateStr + " " + insuranceComp.getInsuranceCompName() + "的" + insuranceName + "的手续费率从" + factRecod.getInsuPercent() + "%设置为" + factorage.getInsuPercent() + "%,请知悉！";
					//新增未读消息
					Map<String,Object> param = new HashMap<String,Object>();
					param.put("storeId", storeId);
					param.put("operatorId", userId);
					param.put("operatorName",userName);
					param.put("content", content);
					//给总经理发个人消息
					param.put("userId", zjlUsers.size()>0 ? zjlUsers.get(0).getId() : 0);
					commonService.insertMessage(param);
					//给保险经理发个人消息
					param.put("userId", bxjlUsers.size()>0 ? bxjlUsers.get(0).getId() : 0);
					commonService.insertMessage(param);
					//给续保主管发个人消息
					param.put("userId", xbzgUsers.size()>0 ? xbzgUsers.get(0).getId() : 0);
					commonService.insertMessage(param);
					
					//添加手续费修改记录
					UpdateSxfRecord updateSxfRecord = new UpdateSxfRecord();
					updateSxfRecord.setStoreId(storeId);
					updateSxfRecord.setInsurerComId(factorage.getCompPreId());
					updateSxfRecord.setInsuranceName(factorage.getInsuName());
					updateSxfRecord.setPercentBefore(factRecod.getInsuPercent());
					updateSxfRecord.setPercentAfter(factorage.getInsuPercent());
					updateSxfRecord.setChanger(userName);
					updateSxfRecord.setChangerId(userId);
					updateSxfRecord.setChangeTime(new Date());
					updateSxfRecordMapper.insert(updateSxfRecord);
				}
			}
			
		}

	}
	
	/**
	 * 根据4s店id查询保险公司信息
	 * @param storeId 4s店id
	 * @return
	 * @throws Exception
	 */
	public List<InsuranceComp> findCompInfoByStoreId(Integer storeId) throws Exception{
		List<InsuranceComp> companys = new ArrayList<InsuranceComp>();
		//1.查询该4s店关联的保险公司
		List<Map<String,Object>> list = insuranceCompMapper.findByFourSId(storeId);
		for (Map<String, Object> map : list) {
			Integer insuranceCompId = (Integer)map.get("insuranceCompId");
			String insuranceCompName = (String)map.get("insuranceCompName");
			String typeNameStr = (String)map.get("typeName");
			Integer source = (Integer)map.get("source");
			String insuranceKey = map.get("insuranceKey") == null ? null : map.get("insuranceKey").toString();
			String[] typeNameArr = typeNameStr.split("/");
			//2.根据4S店id和保险公司id查询手续费设置
			List<Factorage> factorages = factorageMapper.selectByCompPreId(insuranceCompId, storeId);
			//3.根据保险公司id查询商业险设置
			List<InsuranceType> insuranceTypes = new ArrayList<InsuranceType>();
			for (int i = 0; i < typeNameArr.length; i++) {
				String typeName = typeNameArr[i];
				//根据险种名字查询险种记录
				InsuranceType insuranceType = insuranceTypeMapper.selectByTypeName(typeName);
				if(insuranceType != null){
					insuranceTypes.add(insuranceType);
				}
			}
			InsuranceComp company = new InsuranceComp();
			company.setInsuranceCompId(insuranceCompId);
			company.setInsuranceCompName(insuranceCompName);
			company.setTypeName(typeNameStr);
			company.setFactorages(factorages);
			company.setInsuranceTypes(insuranceTypes);
			company.setSource(source);
			company.setInsuranceKey(insuranceKey);
			companys.add(company);
		}
		 return companys;
		
	}

	/**
	 * 锁死客户级别
	 * @throws Exception
	 */
	public void updateStoreLockLevel(Map<String, Object> map) throws Exception {
		storeMapper.updateByStoreId(map);
	}
	
	/**
	 * 根据条件查询ModuleSet
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public List<ModuleSet> selectByCondition(Map<String, Object> param) throws Exception {
		List<ModuleSet> lists = moduleSetMapper.selectByCondition(param);
		return lists;
	}
	
}
