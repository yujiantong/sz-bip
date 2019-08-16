package com.bofide.bip.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import com.bofide.bip.mapper.StoreMapper;
import com.bofide.bip.mapper.UnitMapper;
import com.bofide.bip.po.Unit;

@Service(value = "unitService")
public class UnitService {
	@Resource(name = "unitMapper")
	private UnitMapper unitMapper;
	@Resource(name = "storeMapper")
	private StoreMapper storeMapper;
	
	/**
	 * 新增事业部门
	 * @param unit
	 * @throws Exception
	 */
	public int insert(Unit unit) throws Exception{
		int unitId = 0;//事业部门id  为-1时，表示该事业部门已存在，新增失败
		String unitName = unit.getUnitName();
		Integer jtId = unit.getJtId();
		Unit un = unitMapper.selectByUnitName(unitName,jtId);
		if(ObjectUtils.isEmpty(un)){
			unitMapper.insert(unit);
			unitId = unit.getId();
		}else{
			unitId = -1;
		}
		return unitId;
	}
	
	/**
	 * 按条件查询事业部门
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public List<Unit> findUnitByCondition(Map<String, Object> param) throws Exception{
		List<Unit> units = unitMapper.findUnitByCondition(param);
		return units;
	}
	
	/**
	 * 修改事业部门和店之间的关联
	 * @param map
	 * @return
	 * @throws Exception
	 */
	public void updateUnitAndStore(Map<String,Object> map) throws Exception{
		Integer unitId = (Integer)map.get("unitId");
		if(unitId!=null){
			storeMapper.updateByUnitId(unitId);
		}
		String storeIds = (String)map.get("storeIds");
		String storeId[] = storeIds.split(",");
		Map<String,Object> param = new HashMap<String,Object>();
		param.put("unitId", unitId);
		for(int i=0;i<storeId.length;i++){
			if(storeId[i]!=null&&storeId[i].length()>0){
				param.put("storeId", storeId[i]);
				storeMapper.updateByStoreId(param);
			}
		}
	}
}
