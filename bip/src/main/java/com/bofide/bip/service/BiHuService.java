package com.bofide.bip.service;

import java.io.IOException;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import com.bofide.bip.mapper.CustomerBJRecodeMapper;
import com.bofide.bip.mapper.CustomerMapper;
import com.bofide.bip.mapper.RenewalingCustomerMapper;
import com.bofide.bip.mapper.SentBihuInfoMapper;
import com.bofide.bip.mapper.StoreMapper;
import com.bofide.bip.mapper.UnderWritingMapper;
import com.bofide.bip.po.Customer;
import com.bofide.bip.po.CustomerBJRecode;
import com.bofide.bip.po.Store;
import com.bofide.common.util.BofideTobihuUtils;
import com.bofide.common.util.HttpRequest;
import com.bofide.common.util.SecurityEncodeUtils;
import com.bofide.common.util.StringUtil;
import com.fasterxml.jackson.databind.ObjectMapper;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

@Service(value = "biHuService")
public class BiHuService {
	@Resource(name="customerBJRecodeMapper")
	private CustomerBJRecodeMapper customerBJRecodeMapper;
	@Resource(name = "underWritingMapper")
	private UnderWritingMapper underWritingMapper;
	@Resource(name = "renewalingCustomerMapper")
	private RenewalingCustomerMapper renewalingCustomerMapper;
	@Resource(name = "storeMapper")
	private StoreMapper storeMapper;
	@Resource(name = "sentBihuInfoMapper")
	private SentBihuInfoMapper sentBihuInfoMapper;
	@Resource(name = "customerMapper")
	private CustomerMapper customerMapper;
	
	
	private static Logger logger = Logger.getLogger(BiHuService.class);
	
	/**
	 * 申请报价
	 * @param param
	 * @return
	 * @throws Exception 
	 */
	@SuppressWarnings("unchecked")
	public Map<String, Object> applyBJ (Map<String,Object> param) throws Exception{
		Map<String, Object> map = (Map<String, Object>) param.get("bjInfo");
		Integer storeId = mapToInt(param, "storeId");
		Integer userId = mapToInt(param, "userId");
		Integer bjType = mapToInt(param, "bjType");
		String random = getRandom20();
		Map<String, Object> xbInfo = new HashMap<String, Object>();
		if(bjType.equals(2)){
			
		}else{
			xbInfo = getreinfo(map,storeId,userId,random);
			if(!xbInfo.get("BusinessStatus").equals(1)){
				return xbInfo;
			};
		}
		
		Map<String, Object> baseMap  = new HashMap<String, Object>();
		baseMap.put("xbInfo", xbInfo);
		
		List<Map<String, Object>> list = new ArrayList<Map<String,Object>>();
		List<Map<String, Object>> sourceList = (List<Map<String, Object>>) param.get("source");
		Map<String, Object> cXinfo = new HashMap<>();
		int quoteGroupSum = 0;
		int cx = 0 ;
		for (int k = 0; k < sourceList.size(); k++){
			Integer quoteGroup = (Integer) sourceList.get(k).get("source");
			quoteGroupSum += quoteGroup;
		}
		Map<String, Object> urlParam = (Map<String, Object>) param.get("bjInfo");
		//申请报价
		Map<String, Object> bjResult = postPrecisePrice(urlParam, quoteGroupSum,storeId,userId,random);
		
		for (int i = 0; i < sourceList.size(); i++) {
			Integer source = (Integer) sourceList.get(i).get("source");
			String insuranceCompName = (String) sourceList.get(i).get("insuranceCompName");
			Integer sfbj = (Integer) sourceList.get(i).get("sfbj");
			Integer sfhb = (Integer) sourceList.get(i).get("sfhb");
			Map<String, Object> bjInfoMap  = new HashMap<String, Object>();
			bjInfoMap.put("source", source);
			bjInfoMap.put("sfbj", sfbj);
			bjInfoMap.put("sfhb", sfhb);
			bjInfoMap.put("insuranceCompName", insuranceCompName);
			bjInfoMap.put("applyBJ", bjResult);
			//是否报价，并获取报价信息
			if (sfbj.equals(1)&&bjResult.get("BusinessStatus").equals(1)) {
				Map<String, Object> bjResultMap = getPrecisePrice(urlParam, source,storeId,userId,random);
				bjInfoMap.put("bJinfo", bjResultMap);
				if(cx==0&&bjResultMap.get("BusinessStatus").equals(1)){
					cXinfo = getCreditInfo(urlParam,storeId,userId,random);
					if(mapToInt(cXinfo, "BusinessStatus")!=null&&mapToInt(cXinfo, "BusinessStatus").equals(1)){
						baseMap.put("cXinfo", cXinfo);
					}
					cx = cx + 1;
				}
			} 
			//是否核保，并获取核保信息
			if (sfhb.equals(1)&&bjResult.get("BusinessStatus").equals(1)) {
				bjInfoMap.put("hBinfo", getSubmitInfo(urlParam, source,storeId,userId,random));
			}
			list.add(bjInfoMap);
		}
		if(cx==0){
			baseMap.put("cXinfo", null);
		}
		baseMap.put("bj", list);
		return baseMap;
	}
	
	/**
	 * 保存报价
	 * @param param
	 * @return
	 * @throws Exception 
	 */
	@SuppressWarnings("unchecked")
	public Integer saveBJ (Map<String,Object> param) throws Exception{
		Integer storeId = (Integer) param.get("storeId");
		Integer userId = (Integer) param.get("userId");
		Integer cxcs = (Integer) param.get("accidentNumberLY");
		Float lpje = mapToFloat(param,"payAmount");
		String userName = (String) param.get("userName");
		Integer customerId = (Integer) param.get("customerId");
		List<Map<String, Object>> bjInfoList = (List<Map<String, Object>>) param.get("bj");
		Map<String, Object> bjxz = (Map<String, Object>) param.get("bjxz");
		Store store=storeMapper.selectByPrimaryKey(storeId);
		if(store.getShopId()!=null&&store.getToken()!=null){
			saveBofide(param);
		}
		Integer forceTax = (Integer) param.get("forceTax");
		int saveCount = 0;
		for (Map<String, Object> bjInfoAll : bjInfoList) {
			Map<String, Object> bjInfo = (Map<String, Object>) bjInfoAll.get("bJinfo");
			Float yj = mapToFloat(bjInfoAll,"yj");
			Integer source = (Integer) bjInfoAll.get("source");
			Integer sfbj = (Integer) bjInfoAll.get("sfbj");
			Integer sfhb = (Integer) bjInfoAll.get("sfhb");
			String insuranceCompName = (String) bjInfoAll.get("insuranceCompName");
			if(yj>0){
				Map<String, Object> bjItem = (Map<String, Object>)bjInfo.get("Item");
				CustomerBJRecode customerBJRecode = new CustomerBJRecode();
				customerBJRecode.setCustomerId(customerId);
				customerBJRecode.setStoreId(storeId);
				customerBJRecode.setBjrId(userId);
				customerBJRecode.setBjr(userName);
				customerBJRecode.setSource(source);
				customerBJRecode.setBxgs(insuranceCompName);
				customerBJRecode.setJqxje(mapToFloat(bjItem,"ForceTotal"));
				customerBJRecode.setSyxje(mapToFloat(bjItem,"BizTotal"));
				customerBJRecode.setCcsje(mapToFloat(bjItem,"TaxTotal")); 
				customerBJRecode.setJncdzk(mapToFloat(bjItem,"zhekou"));
				customerBJRecode.setRateFactor1(mapToFloat(bjItem,"RateFactor1"));
				customerBJRecode.setRateFactor2(mapToFloat(bjItem,"RateFactor2"));
				customerBJRecode.setRateFactor3(mapToFloat(bjItem,"RateFactor3"));
				customerBJRecode.setRateFactor4(mapToFloat(bjItem,"RateFactor4"));
				customerBJRecode.setBfhj(yj);
				customerBJRecode.setShijize(mapToFloat(bjInfoAll,"shijize"));
				customerBJRecode.setLpje(lpje);
				customerBJRecode.setCxcs(cxcs);
				customerBJRecode.setBjfs(1);
				customerBJRecode.setDcbjrq(new Date());
				customerBJRecode.setYhje(mapToFloat(bjInfoAll,"youhui"));
				customerBJRecode.setXz(bjxzSplice(bjxz, bjItem, forceTax));
				customerBJRecode.setStandardPremium(mapToFloat(bjItem,"standardPremium"));//标准保费
				customerBJRecode.setShopZheKou(Float.parseFloat(bjInfoAll.get("zhekou").toString()));//店端折扣
				int v = customerBJRecodeMapper.insertCustomerBJRecode(customerBJRecode);
				saveCount = saveCount + v;
				if(sfhb!=null&&sfhb.equals(1)){
					Map<String, Object> hBinfo = (Map<String, Object>) bjInfoAll.get("hBinfo");
					Map<String, Object> underWritingInfo = (Map<String, Object>) hBinfo.get("Item");
					underWritingInfo.put("storeId", storeId);
					underWritingInfo.put("source", source);
					underWritingInfo.put("customerId", customerId);
					underWritingInfo.put("bjId", customerBJRecode.getBjId());
					underWritingMapper.insertUnderWriting(underWritingInfo);
				}
				//保存报价时，实时更新潜客信息中的最低折扣
				Map<String,Object> zdZheKouMap = new HashMap<>();
				zdZheKouMap.put("customerId", customerId);
				zdZheKouMap.put("zdZheKou", customerBJRecode.getJncdzk());
				Customer customer = customerMapper.findCustomerById(customerId);
				//潜客信息中的最低折扣大于当前报价中的优惠系数时，就更新为当前报价中的优惠系数，否则不变
				if(customer!=null){
					if((customer.getZdZheKou()!=null && customer.getZdZheKou()> customerBJRecode.getJncdzk() ) || customer.getZdZheKou()==null){
						renewalingCustomerMapper.updateSelectiveByCustomerId(zdZheKouMap);
						customerMapper.updateCustomerInfo(zdZheKouMap);
					}
				}
			}
		}
		Map<String,Object> rcMap = new HashMap<>();
		rcMap.put("customerId", customerId);
		rcMap.put("isQuote", 1);
		rcMap.put("quoteDate", new Date());
		renewalingCustomerMapper.updateSelectiveByCustomerId(rcMap);
		return saveCount;
	}
	/**
	 * 
	 * 博福报价保存报价(险种保额存入)
	 * 
	 * @param param
	 */
	@SuppressWarnings("unchecked")
	public void saveBofide(Map<String,Object> param){
		List<Map<String, Object>> bjInfoList = (List<Map<String, Object>>) param.get("bj");
		Map<String, Object> bjxz = (Map<String, Object>) param.get("bjxz");
		for (Map<String, Object> bjInfoAll : bjInfoList) {
			Map<String, Object> bjInfo = (Map<String, Object>) bjInfoAll.get("bJinfo");
			Map<String, Object> bjItem = (Map<String, Object>)bjInfo.get("Item");
			for(String key : bjxz.keySet()){
				if(key.equals("SiJi")||key.equals("SanZhe")||key.equals("ChengKe")||key.equals("HcHuoWuZeRen")||key.equals("HcFeiYongBuChang")||key.equals("HuaHen")||
						key.equals("HcJingShenSunShi")||key.equals("HcXiuLiChang")||key.equals("HcHuoWuZeRen")){
					if(bjItem.containsKey(key)){
						Map<String, Object> BX = (Map<String, Object>)bjItem.get(key);
						BX.put("BaoE", bjxz.get(key));
					}
				}
			}
		}
	}
	
	/**
	 * 保存调用壁虎接口信息
	 * @param param po SentBihuInfo的map参数
	 * @return 成功的条数
	 * @throws Exception
	 */
	public int saveSentBihuInfo (Map<String,Object> param) throws Exception{
		String carVin = param.get("carVin")==null ? "" : param.get("carVin").toString();
		if("".equals(carVin)){
			param.put("carVin", null);
		}else{
			param.put("carVin", carVin.toUpperCase());
		}
		
		return sentBihuInfoMapper.insertSentBihuInfo(param);
	}
	
	
	/**
	 * 险种拼接
	 * @param bjxz 申请报价险种的MAP
	 * @param bjInfo 获取报价信息的MAP
	 * @param forceTax 0:单商业 ，1：商业+交强车船，2：单交强+车船
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public String bjxzSplice(Map<String, Object> bjxz,Map<String, Object> bjInfo,Integer forceTax){
		String xz = "";
		bjxz.put("BuJiMianHeJi", 1);//这里添加不计免合计，筛选时按选择框走的，选中时为1
		if(forceTax.equals(1)||forceTax.equals(0)){
			for (String bjxzKey : bjxz.keySet()) {
				if (mapToFloat(bjxz, bjxzKey)!=null&&mapToFloat(bjxz, bjxzKey) > 0) {

					Map<String, Object> map = (Map<String, Object>) bjInfo
							.get(bjxzKey);
					if(map==null){
						
					}else{
						String baoEKey = bjxzKey + "BaoE";
						String baoFeiKey = bjxzKey + "BaoFei";
						Float baoE = mapToFloat(map, "BaoE");
						Float baoFei = mapToFloat(map, "BaoFei");
						if(baoE!=null&&baoFei!=null&&baoE>1){
							String xzNameBE = BofideTobihuUtils.getLgend("xzConfig",baoEKey);
							String xzNameBF = BofideTobihuUtils.getLgend("xzConfig",baoFeiKey);
							xz = xz + xzNameBE + ":" + baoE.toString() + "," + xzNameBF
									+ ":" + baoFei.toString() + ";";
						}else if(baoE==null&&baoFei!=null){
							String xzNameBF = BofideTobihuUtils.getLgend("xzConfig",baoFeiKey);
							xz = xz + xzNameBF + ":" + baoFei.toString() + ";";
						}else if(baoE!=null&&baoFei==null&&baoE>1){
							String xzNameBE = BofideTobihuUtils.getLgend("xzConfig",baoEKey);
							xz = xz + xzNameBE + ":" + baoE.toString() + ";";
						}else if(baoE!=null&&baoFei!=null&&baoE<=1){
							String xzNameBF = BofideTobihuUtils.getLgend("xzConfig",baoFeiKey);
							xz = xz + xzNameBF + ":" + baoFei.toString() + ";";
						}
					}

				}
			}
		}else if(forceTax.equals(2)){
			xz = "单交强+车船";
		}
		
		return xz;
	}

	
	
	/**
	 * 调用壁虎获取用户续保信息
	 * @param urlParamMap 参数Map
	 * @param source 保险资源
	 * @param storeId 4S店ID
	 * @return 用户续保信息
	 * @throws Exception 
	 */
	public Map<String, Object> getreinfo(Map<String, Object> urlParamMap,Integer storeId,
			Integer userId,String random) throws Exception{
		Map<String, Object> param = new HashMap<String, Object>();
		param.put("LicenseNo", urlParamMap.get("LicenseNo"));
		param.put("CityCode", getCityCode(storeId));
		String urlParam = mapToUrlParam(param) + getAgentCustKey(storeId,random);
		saveSentBihuInfo(urlParamToMap(urlParam, storeId, userId, 1));
		String userInfo = BofideTobihuUtils.sendGet("getreinfoUrl",urlParam ,getBiHuKey(storeId));
		logger.info(userInfo);
		return jsonToMap(userInfo);
	}
	
	/**
	 * 调用壁虎申请报价接口
	 * @param urlParamMap 参数Map
	 * @param source 保险资源
	 * @param storeId 4S店ID
	 * @return 壁虎报价返回的结果
	 * @throws Exception 
	 */
	public Map<String, Object> postPrecisePrice(Map<String, Object> urlParamMap,Integer source,
			Integer storeId,Integer userId,String random) throws Exception{
		String forceTimeStamp = urlParamMap.get("ForceTimeStamp")==null ? "0" : urlParamMap.get("ForceTimeStamp").toString();
		String bizTimeStamp = urlParamMap.get("BizTimeStamp")==null ? "0" : urlParamMap.get("BizTimeStamp").toString();
		if("0".equals(forceTimeStamp)){
			urlParamMap.remove("ForceTimeStamp");
		}
		if("0".equals(bizTimeStamp)){
			urlParamMap.remove("BizTimeStamp");
		}
		urlParamMap.put("QuoteGroup", source);
		//urlParamMap.put("SubmitGroup", source);
		urlParamMap.put("CityCode", getCityCode(storeId));
		//报价并发冲突检查标识：0（默认） 1：检测
		urlParamMap.put("QuoteParalelConflict", 1);
		String urlParam = mapToUrlParam(urlParamMap) + getAgentCustKey(storeId,random);
		saveSentBihuInfo(urlParamToMap(urlParam, storeId, userId, 2));
		String applyBJresult = BofideTobihuUtils.sendGet("postPrecisePriceUrl", urlParam,getBiHuKey(storeId));
		logger.info(applyBJresult);
		return jsonToMap(applyBJresult);
	}
	
	/**
	 * 调用壁虎获取报价接口
	 * @param urlParamMap 参数Map
	 * @param source 保险资源
	 * @param storeId 4S店ID
	 * @return 壁虎返回报价信息
	 * @throws Exception 
	 */
	public Map<String, Object> getPrecisePrice(Map<String, Object> urlParamMap,Integer source,
			Integer storeId,Integer userId,String random) throws Exception{
		Map<String, Object> param = new HashMap<String, Object>();
		param.put("LicenseNo", urlParamMap.get("LicenseNo"));
		param.put("QuoteGroup", source);
		String urlParam = mapToUrlParam(param) + getAgentCustKey(storeId,random);
		saveSentBihuInfo(urlParamToMap(urlParam, storeId, userId, 3));
		String getBJresult = BofideTobihuUtils.sendGet("getPrecisePriceUrl", urlParam,getBiHuKey(storeId));
		logger.info(getBJresult);
		return jsonToMap(getBJresult);
	}
	
	/**
	 * 调用壁虎获取核保接口
	 * @param urlParamMap 参数Map
	 * @param source 保险资源
	 * @param storeId 4S店ID
	 * @return 壁虎返回核保信息
	 * @throws Exception 
	 */
	public Map<String, Object> getSubmitInfo(Map<String, Object> urlParamMap,Integer source,
			Integer storeId,Integer userId,String random) throws Exception{
		Map<String, Object> param = new HashMap<String, Object>();
		param.put("LicenseNo", urlParamMap.get("LicenseNo"));
		param.put("SubmitGroup", source);
		String urlParam = mapToUrlParam(param) + getAgentCustKey(storeId,random);
		saveSentBihuInfo(urlParamToMap(urlParam, storeId, userId, 4));
		String getHBresult = BofideTobihuUtils.sendGet("getSubmitInfoUrl", urlParam,getBiHuKey(storeId));
		logger.info(getHBresult);
		return jsonToMap(getHBresult);
	}
	
	/**
	 * 调用壁虎获取车辆出险信息
	 * @param urlParamMap 参数Map
	 * @param storeId 4S店ID
	 * @return 壁虎返回车辆出险信息
	 * @throws Exception 
	 */
	public Map<String, Object> getCreditInfo(Map<String, Object> urlParamMap,Integer storeId,
			Integer userId,String random) throws Exception{
		Map<String, Object> param = new HashMap<String, Object>();
		param.put("LicenseNo", urlParamMap.get("LicenseNo"));
		String urlParam = mapToUrlParam(param) + getAgentCustKey(storeId,random);
		saveSentBihuInfo(urlParamToMap(urlParam, storeId, userId, 5));
		String getCXresult = BofideTobihuUtils.sendGet("getCreditDetailInfo", urlParam,getBiHuKey(storeId));
		logger.info(getCXresult);
		return jsonToMap(getCXresult);
	}
	
	/**
	 * 调用壁虎获取代理人UKey列表,同步保险公司密码功能用
	 * @param urlParamMap 参数Map
	 * @param storeId 4S店ID
	 * @return UKey列表
	 * @throws Exception 
	 */
	public Map<String, Object> getUKeyList(Map<String, Object> urlParamMap,Integer storeId) throws Exception{
		Map<String, Object> param = new HashMap<String, Object>();
		param.put("Source", urlParamMap.get("source"));
		String agent = getAgent(storeId);
		String bihuKey = getBiHuKey(storeId);
		String urlParam = mapToUrlParam(param) + "&Agent=" + agent;
		String secCode = SecurityEncodeUtils.md5(urlParam + bihuKey);
		String requestUrl = BofideTobihuUtils.getLgend("bofideTobihuConfig", "getUKeyList");
		requestUrl = requestUrl + "?" + urlParam + "&SecCode="+secCode;
		//requestUrl = requestUrl + "?agent=74324&SecCode=fe25bde7d7d2c9f9bbfe26e349d3c7e2";
		logger.info("获取uKey列表接口请求的URL: " + requestUrl);
		String uKeyListResult = HttpRequest.sendGet(requestUrl);
		logger.info("获取uKey列表接口返回结果: " + uKeyListResult);
		return jsonToMap(uKeyListResult);
	}
	
	/**
	 * 修改代理人UKey密码,同步保险公司密码功能用
	 * @param urlParamMap 参数Map
	 * @param storeId 4S店ID
	 * @return 修改密码返回结果
	 * @throws Exception 
	 */
	public Map<String, Object> editAgentUKey(Map<String, Object> urlParamMap,Integer storeId) throws Exception{
		Map<String, Object> param = new TreeMap<String, Object>();
		param.put("UserCode", urlParamMap.get("userName"));
		param.put("UkeyId", urlParamMap.get("UkeyId"));
		param.put("OldPassWord", urlParamMap.get("oldPassword"));
		param.put("NewPassWord", urlParamMap.get("newPassword"));
		String agent = getAgent(storeId);
		param.put("Agent", agent);
		String urlParamTemp = mapToUrlParam(param);
		String bihuKey = getBiHuKey(storeId);
		String secCode = SecurityEncodeUtils.md5(urlParamTemp + bihuKey);
		param.put("SecCode", secCode);
		String urlParam = mapToUrlParam(param);
		logger.info("修改保险公司密码接口传递的参数: " + urlParam);
		String requestUrl = BofideTobihuUtils.getLgend("bofideTobihuConfig", "editAgentUKey");
		String editAgentUKeyResult = HttpRequest.sendPost(requestUrl,urlParam);
		logger.info("修改保险公司密码接口返回结果: " + editAgentUKeyResult);
		return jsonToMap(editAgentUKeyResult); 
	}
	
	/**
	 * 调用博福接口获取车辆出险信息
	 * @param argsMap 参数Map
	 * @param storeId 4S店ID
	 * @return 博福返回车辆出险信息
	 * @throws Exception 
	 */
	public Map<String, Object> getCarInfo(Map<String, Object> argsMap,Integer storeId) throws Exception{
		Map<String, Object> param = new HashMap<String, Object>();
		Store store = storeMapper.selectByPrimaryKey(storeId);
		param.put("shopId", store.getShopId());
		param.put("token", store.getToken());
		String urlParam = mapToUrlParam(param);
		//String args = (String) urlParamMap.get("args");
		ObjectMapper o = new ObjectMapper();
		String args = o.writeValueAsString(argsMap);
		String requestUrl = BofideTobihuUtils.getLgend("bofideTobihuConfig", "getCarInfo");
		requestUrl = requestUrl +"?"+ urlParam +"&args="+ URLEncoder.encode(args,"utf-8");
		String getCarInfoResult = HttpRequest.sendGetRequest(requestUrl);
		logger.info(getCarInfoResult);
		return jsonToMap(getCarInfoResult);
	}
	
	/**
	 * 调用博福接口获取车辆报价信息
	 * @param carInfoMap 查询接口返回的Map
	 * @param storeId 4S店ID
	 * @return 博福返回车辆报价信息
	 * @throws Exception 
	 */
	public Map<String, Object> getBxPrice(Map<String, Object> carInfoMap,Integer storeId) throws Exception{
		Map<String, Object> param = new HashMap<String, Object>();
		Store store = storeMapper.selectByPrimaryKey(storeId);
		param.put("shopId", store.getShopId());
		param.put("token", store.getToken());
		String urlParam = mapToUrlParam(param);
		Map<String, Object> argsMap = new HashMap<String, Object>();
		argsMap.put("plateNo", carInfoMap.get("vehicleLicenceCode"));//车牌号
		argsMap.put("carVIN", carInfoMap.get("vehicleFrameNo"));//车架号
		argsMap.put("engineNo", carInfoMap.get("engineNo"));//发动机号
		
		
		//客户类型
		if(carInfoMap.get("taxCustomerType")==null){
			argsMap.put("taxCustomerType", "0");
		}else{
			argsMap.put("taxCustomerType", carInfoMap.get("taxCustomerType"));
		}
		//车型编码
		if(carInfoMap.get("moldCharacterCode")==null){
			argsMap.put("moldCharacterCode", "");
		}else{
			argsMap.put("moldCharacterCode", carInfoMap.get("moldCharacterCode"));
		}
		
		argsMap.put("compulsory", carInfoMap.get("compulsory"));//是否选交险
		argsMap.put("commercial", carInfoMap.get("commercial"));//是否选商业险
		argsMap.put("stRegisterDate", carInfoMap.get("createdDate"));//初次登录日期
		//姓名, 取被保人
		if(carInfoMap.get("taxpayerName")==null){
			argsMap.put("ownerName", "");
		}else{
			argsMap.put("ownerName", carInfoMap.get("taxpayerName"));
		}
		//证件号码, 取被保人证件号码
		if(carInfoMap.get("taxpayerNo")==null){
			argsMap.put("certNo", "");
		}else{
			argsMap.put("certNo", carInfoMap.get("taxpayerNo"));
		}
		//证件类型, 取被保人证件类型
		if(carInfoMap.get("taxpayerType")==null){
			argsMap.put("certType", "");
		}else{
			argsMap.put("certType", carInfoMap.get("taxpayerType"));
		}
		
		argsMap.put("usage", carInfoMap.get("usage"));//车辆使用性质
		argsMap.put("plateType", "02");//车牌号类型
		argsMap.put("loan", "0");//是否有多年车贷
		//车主性质
		if(carInfoMap.get("ownerProp")==null){
			argsMap.put("ownerProp", "1");
		}else{
			argsMap.put("ownerProp", carInfoMap.get("ownerProp"));
		}
		
		//车辆类型
		if(carInfoMap.get("taxVehicleType")==null){
			argsMap.put("taxVehicleType", "");
		}else{
			argsMap.put("taxVehicleType", carInfoMap.get("taxVehicleType"));
		}
		
		//能源类型
		if(carInfoMap.get("fuelType")==null){
			argsMap.put("fuelType", "A");
		}else{
			argsMap.put("fuelType", carInfoMap.get("fuelType"));
		}
		
		
		String insuranceEndTime = carInfoMap.get("insuranceEndTime") == null
				|| "".equals(carInfoMap.get("insuranceEndTime")) ? "" : carInfoMap.get("insuranceEndTime").toString();
		String businessEndTime = carInfoMap.get("businessEndTime") == null
				|| "".equals(carInfoMap.get("businessEndTime")) ? "" : carInfoMap.get("businessEndTime").toString();
		String currentTime = new SimpleDateFormat("yyyy-MM-dd").format(new Date());
		// 日期取值规则: 自己的规范就取自己的, 如果不规范就看别的, 别的规范就取别的, 别的不规范就取当前
		// 交险到期时间
		if ("".equals(insuranceEndTime)||currentTime.compareTo(insuranceEndTime) > 0) {
			if("".equals(businessEndTime)||currentTime.compareTo(businessEndTime) > 0){
				argsMap.put("maturityDate", currentTime);
			}else{
				argsMap.put("maturityDate", businessEndTime);
			}
		} else {
			argsMap.put("maturityDate", insuranceEndTime);
		}
		// 商险到期时间
		if ("".equals(businessEndTime)||currentTime.compareTo(businessEndTime) > 0) {
			if("".equals(insuranceEndTime)||currentTime.compareTo(insuranceEndTime) > 0){
				argsMap.put("businessEndTime", currentTime);
			}else{
				argsMap.put("businessEndTime", insuranceEndTime);
			}
		} else {
			argsMap.put("businessEndTime", businessEndTime);
		}
		//新车购买价格
		argsMap.put("newCarPrice", carInfoMap.get("newCarPrice").toString());
		argsMap.put("modelType", carInfoMap.get("modelType"));//厂牌车型号
		argsMap.put("insuranceCompanys", carInfoMap.get("insuranceCompanys"));//保险公司数组,如:"picc,cpic"
		argsMap.put("quoteInsuranceVos", carInfoMap.get("quoteInsuranceVos"));//多种保险组合

		ObjectMapper o = new ObjectMapper();
		String args = o.writeValueAsString(argsMap);
		String requestUrl = BofideTobihuUtils.getLgend("bofideTobihuConfig", "getBxPrice");
		requestUrl = requestUrl +"?"+ urlParam +"&args="+ URLEncoder.encode(args,"utf-8");
		String getCarInfoResult = HttpRequest.sendGetRequest(requestUrl);
		logger.info(getCarInfoResult);
		return jsonToMap(getCarInfoResult);
	}
	
	/**
	 * 调用博福接口获取车辆已投保信息
	 * @param map 查询参数
	 * @param storeId 4S店ID
	 * @return 博福返回车辆已投保信息
	 * @throws Exception 
	 */
	public Map<String, Object> getCarInsuranceInfo(Map<String, Object> map,Integer storeId) throws Exception{
		Map<String, Object> param = new HashMap<String, Object>();
		Store store = storeMapper.selectByPrimaryKey(storeId);
		param.put("shopId", store.getShopId());
		param.put("token", store.getToken());
		String urlParam = mapToUrlParam(param);
		Map<String, Object> argsMap = new HashMap<String, Object>();
		String vehicleLicenceCode = map.get("vehicleLicenceCode")==null ? "" : map.get("vehicleLicenceCode").toString().trim();
		argsMap.put("vehicleLicenceCode", vehicleLicenceCode);//车牌号
		String vehicleFrameNo = map.get("vehicleFrameNo")==null ? "" : map.get("vehicleFrameNo").toString().trim();
		argsMap.put("vehicleFrameNo", vehicleFrameNo);//车架号
		argsMap.put("bxId", map.get("bxId"));//保险id,如: pingan

		ObjectMapper o = new ObjectMapper();
		String args = o.writeValueAsString(argsMap);
		String requestUrl = BofideTobihuUtils.getLgend("bofideTobihuConfig", "getCarInsuranceInfo");
		requestUrl = requestUrl +"?"+ urlParam +"&args="+ URLEncoder.encode(args,"utf-8");
		String carInsuranceInfoResult = HttpRequest.sendGetRequest(requestUrl);
		logger.info(carInsuranceInfoResult);
		return jsonToMap(carInsuranceInfoResult);
	}
	
	/**
	 * url参数由MAP转成String
	 * 
	 * @param param url所需参数
	 * @return urlParam url参数的字符串
	 */
	public String mapToUrlParam(Map<String, Object> param) {

		String urlParam = "";
		int i = 0;
		for (String key : param.keySet()) {
			if (i == 0) {
				urlParam = key + "=" + param.get(key);
			}else{
				urlParam = urlParam +"&"+ key + "=" + param.get(key);
			}
			i++;
		}
		return urlParam;
	}
	
	/**
	 * url参数的字符串转换成保存记录所用的MAP参数
	 * @param urlParam url参数的字符串
	 * @param storeId 店id
	 * @param userId 用户id
	 * @param transferType 调用类型,默认为0,1:查询续保,2:发起报价,3:获取报价,4:获取核保,5:获取出险'
	 * @return
	 */
	public Map<String, Object> urlParamToMap(String urlParam,Integer storeId,Integer userId,
			Integer transferType){
		String[] urlArray = urlParam.split("&");
		String[] keys = {"Agent","LicenseNo","EngineNo","CarVin","CustKey"};
		String[] keyPostBJ = {"QuoteGroup","SubmitGroup"};
		Map<String,Object> map = new HashMap<String,Object>();
		for (int i = 0; i < urlArray.length; i++) {
			String key = urlArray[i].substring(0,urlArray[i].indexOf("="));
			if(key!=null&&Arrays.asList(keys).contains(key)){
				map.put(StringUtil.toLowerCaseFirstOne(urlArray[i].substring(0,urlArray[i].indexOf("="))),
						urlArray[i].substring(urlArray[i].indexOf("=")+1));
			}
			if(key!=null&&Arrays.asList(keyPostBJ).contains(key)){
				if(map.get("source")==null){
					map.put("source",urlArray[i].substring(urlArray[i].indexOf("=")+1));
				}
			}
		}
		map.put("storeId", storeId);
		map.put("userId", userId);
		map.put("transferType", transferType);
		return map;
	}
	
	/**
	 * 由json转成Map
	 * @param param
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public Map<String, Object> jsonToMap(String jsonParam) {
		ObjectMapper  objectMapper = new ObjectMapper();
		try {
			return (Map<String,Object>)objectMapper.readValue(jsonParam, Map.class);
		} catch (IOException e) {
			
		}
		return null;
	}
	
	/**
	 * map 转 float
	 * @param map map集合
	 * @param key  键
	 * @return vlaue 值
	 */
	public Float mapToFloat(Map<String, Object> map , String key){
		if(map.get(key)==null){
			return null;
		}
		String vlaueString = map.get(key).toString();
		return Float.parseFloat(vlaueString);
	}
	
	/**
	 * map 转int
	 * @param map map集合
	 * @param key 键
	 * @return vlaue 值
	 */
	public Integer mapToInt(Map<String, Object> map , String key){
		if(map.get(key)==null){
			return null;
		}
		return Integer.parseInt(map.get(key).toString());
	}
	/**
	 * 调用平台标识agent
	 * @param storeId 4S店ID
	 * @return
	 * @throws Exception
	 */
	public String getAgent(Integer storeId){
		
		Store store = new Store();
		try {
			store = getStore(storeId);
			if(store==null){
				return null;
			}
		} catch (Exception e) {
			logger.info("获取调用平台标识agent失败",e);
			return null;
		}
		return store.getAgent();
	}
	
	/**
	 * 调用平台标识agent
	 * @param storeId 4S店ID
	 * @return
	 * @throws Exception
	 */
	public String getBiHuKey(Integer storeId){
		
		Store store = new Store();
		try {
			store = getStore(storeId);
			if(store==null){
				return null;
			}
		} catch (Exception e) {
			logger.info("获取密钥失败",e);
			return null;
		}
		return store.getBihuKey();
	}
	
	/**
	 * 返回4S店信息
	 * @param storeId 4S店ID
	 * @return
	 * @throws Exception
	 */
	public Store getStore(Integer storeId){
		
		Store store = new Store();
		try {
			store = storeMapper.selectByPrimaryKey(storeId);
			if(store==null){
				return null;
			}
		} catch (Exception e) {
			logger.info("查询4S店信息失败",e);
			return null;
		}
		return store;
	}
	
	/**
	 * 城市码cityCode
	 * @param storeId 4s店id
	 * @return
	 * @throws Exception
	 */
	public String getCityCode(Integer storeId){
		
		Store store = new Store();
		try {
			store = getStore(storeId);
			if(store==null){
				return null;
			}
		} catch (Exception e) {
			logger.info("城市码失败",e);
			return null;
		}
		
		return store.getCityCode();
	}
	
	/**
	 * 客户端标识custKey
	 * @param storeId 4s店id
	 * @return
	 * @throws Exception
	 */
	public String getCustKey(Integer storeId,String random){
		
		String custKey = BofideTobihuUtils.getLgend("bofideTobihuConfig", "CustKey");
		Integer x=(int)(Math.random()*20);
		return custKey+storeId.toString()+random;
	}
	
	/**
	 * 随机数20
	 * @return
	 */
	public static String getRandom20(){
		Integer x=(int)(Math.random()*20);
		return "random" + x.toString();
	}
	
	/**
	 * 返回调用平台标识agent和客户端标识custKey
	 * @param storeId
	 * @return 拼接好的标识字符串，如：&agent=8888&CustKey=bofi
	 */
	public String getAgentCustKey(Integer storeId,String random){
		
		String agent = getAgent(storeId);
		String custKey = getCustKey(storeId,random);
		if(agent==null){
			logger.info("获取调用平台标识agent失败");
			return null;
		}
		return "&Agent="+agent+ "&CustKey="+custKey;
	}
}
