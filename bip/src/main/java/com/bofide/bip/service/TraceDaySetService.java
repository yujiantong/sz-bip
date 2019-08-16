package com.bofide.bip.service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.bofide.bip.mapper.TraceDaySetMapper;
import com.bofide.bip.po.TraceDaySet;

@Service(value = "traceDaySetService")
public class TraceDaySetService {
	@Resource(name="traceDaySetMapper")
	private TraceDaySetMapper traceDaySetMapper;
	public TraceDaySet findTraceTimeByCl(String customerLevel, Integer storeId) throws Exception {
		Map<String,Object> param = new HashMap<String,Object>();
		param.put("customerLevel", customerLevel);
		param.put("storeId", storeId);
		TraceDaySet traceDaySet = traceDaySetMapper.findTraceTimeByCl(param);
		return traceDaySet;
	}
	
	//查询每家店设置的首次跟踪天数（即捞取天数）
	public List<Map<String,Integer>> findStoreSetTraceDay() throws Exception{
		List<TraceDaySet> traceDaySetList = traceDaySetMapper.findTraceDaySet();
		List<Map<String,Integer>> listMap = new ArrayList<Map<String,Integer>>();
		for(TraceDaySet traceDaySet : traceDaySetList){
			Map<String,Integer> map = new HashMap<String,Integer>();
			Integer fourSStoreId = traceDaySet.getFourSStoreId();
			Integer dayNumber = traceDaySet.getDayNumber();
			Calendar calenda = Calendar.getInstance();
			int year = calenda.get(Calendar.YEAR);
			calenda.set(year,Calendar.DECEMBER,31);
			int yearNum = calenda.get(Calendar.DAY_OF_YEAR);
			map.put("fourSStoreId", fourSStoreId);
			map.put("nextGetCusDayNum", yearNum-dayNumber);
			map.put("dayNumber", dayNumber);
			listMap.add(map);
		}
		return listMap;
	}
	
	//查询传递过来的店设置的首次跟踪天数（即捞取天数）
	public Map<String,Integer> findStoreSetTraceDay(Integer storeId) throws Exception{
		Map<String,Object> param = new HashMap<String,Object>();
		param.put("storeId", storeId);
		param.put("customerLevel", "Z");
		TraceDaySet traceDaySet = traceDaySetMapper.findTraceTimeByCl(param);
		Integer dayNumber = traceDaySet.getDayNumber();
		//将查询重置潜客和分配潜客的天数封装在map中
		Map<String,Integer> map = new HashMap<String,Integer>();
		Calendar calenda = Calendar.getInstance();
		int year = calenda.get(Calendar.YEAR);
		calenda.set(year,Calendar.DECEMBER,31);
		int yearNum = calenda.get(Calendar.DAY_OF_YEAR);
		map.put("fourSStoreId", storeId);
		map.put("nextGetCusDayNum", yearNum-dayNumber);
		map.put("dayNumber", dayNumber);
		return map;
	}
}