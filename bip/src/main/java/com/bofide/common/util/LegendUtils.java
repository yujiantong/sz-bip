package com.bofide.common.util;

import java.util.ArrayList;
import java.util.List;
import java.util.MissingResourceException;
import java.util.ResourceBundle;

import org.apache.log4j.Logger;

import com.bofide.bip.po.ReportData;


/**
 * <p>Title: LegendUtils</p>
 * <p>Description: 用于图例legend名称的转换，也就yName名字从legendConfig.properties读取
 * 排序从legendSortConfig.properties读取
 * </p>
 *
 * @author lixuhua
 * @date 2016年11月16日 下午6:27:34
 */
public class LegendUtils {
	
	private static Logger logger = Logger.getLogger(SecurityEncodeUtils.class);
	
	/**
	 * 从配置文件获取参数
	 * @param bundle_name  资源文件名
	 * @param key 对应的键名
	 * @return  String  返回对应key的value值，查询不到文件或者对应key信息则返回null
	 */
	public static String getLgend(String bundle_name, String key) {
		try {

			return ResourceBundle.getBundle(bundle_name).getString(key);
		} catch (MissingResourceException e) {
			logger.info(bundle_name+"文件中无该key("+key+")信息");
			return null;
		}
	}
	
	/**
	 * 用于图例yName的数字替换legendConfig.properties中对就的配置名
	 * 
	 * @param list<ReportData> 未替换前的对象ReportData的list信息
	 * @param legendName  在legendConfig.properties中对应的键，指在“.”之前的部分
	 * @return list<ReportData> 替换后的对象ReportData的list信息
	 */
	public static List<ReportData> replaceLegend(List<ReportData> list, String legendName) {

		String[] legendSort = getLgend("legendSortConfig", legendName).split(",");
		String[] sortNameKey = new String[legendSort.length];
		String[] legendNameValue = new String[legendSort.length];
		for (int i = 0; i < sortNameKey.length; i++) {
			sortNameKey[i] = legendName +"."+ legendSort[i];
			legendNameValue[i] = getLgend("legendConfig", sortNameKey[i]);
			if (legendNameValue[i] != null) {
				for (int j = 0; j < list.size(); j++) {
					if (list.get(j).getyName().equals(legendSort[i])) {
						list.get(j).setyName(legendNameValue[i]);
					}
				}
			}else{
				logger.info("没有找对对应key("+sortNameKey[i]+")的vlaue值");
			}
		}
		return list;
	}
	
	/**
	 * 用于图例的自定义排序
	 * 
	 * @param list<ReportData> 未排序之前的对象ReportData的list信息
	 * @param sortName  在legendSortConfig.properties中对应的键
	 * @return listSort<ReportData> 排序之后的对象ReportData的list信息
	 */
	public static List<ReportData> sortLegend(List<ReportData> list,String sortName){
		
		List<ReportData> listXSort = new ArrayList<ReportData>();
		List<ReportData> listX = new ArrayList<ReportData>();
	
		for (int i = 0; i < list.size(); i++) {
			if(list.get(i).getxId().equals(0)){
				listXSort.add(list.get(i));
			}else{
				listX.add(list.get(i));
			}
		}
		listXSort.addAll(listX);
		
		String[] legendSort = getLgend("legendSortConfig", sortName).split(",");
		List<ReportData> listSort = new ArrayList<ReportData>();
		
		for (int i = 0; i < legendSort.length; i++) {
			for (int j = 0; j < listXSort.size(); j++) {
				if(listXSort.get(j).getyName().equals(legendSort[i])){
					listSort.add(listXSort.get(j));
				}
			}
		}
		return listSort;
	}
	
	/**
	 * 1.用于图例yName的数字替换legendConfig.properties中对就的配置名<br/>
	 * 2.用于图例的自定义排序<br/>
	 * 注：使用此方法要求legendConfig.properties中对应的键，指在“.”之前的部分
	 * 与legendSortConfig.properties中对应的键一致。
	 * 
	 * @param list<ReportData> 未替换前的对象ReportData的list信息
	 * @param legendName  在legendConfig.properties中对应的键，指在“.”之前的部分
	 * @return list<ReportData> 替换后的对象ReportData的list信息
	 */
	public static List<ReportData> legendSortAndReplace(List<ReportData> list, String legendName){
		
		return LegendUtils.replaceLegend(LegendUtils.sortLegend(list, legendName), legendName);
	}
	
}
