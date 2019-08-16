package com.bofide.common.util;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class StatisticsUtil {
	/**
	 * 统计计算合计
	 * @param mapList
	 * @return Map<String, Object>
	 */
	public static Map<String, Object> getStatisticsSum(List<Map<String, Object>> mapList){
		int allCustomerSum = 0;//全部潜客数合计
		int monthCustomerSum = 0;//当期潜客数合计
		int traceCountSum = 0;//跟踪次数合计
		int jtbCountSum = 0;//将脱保数合计
		int ytbCountSum = 0;//已脱保数合计
		int moveOutCountSum = 0;//经理转出数合计
		int moveIntoCountSum = 0;//经理转入数合计
		long delayCountSum = 0;//延期数合计
		int returnCountSum = 0;//回退数合计
		int awakenCountSum = 0;//唤醒数合计
		int billCountSum = 0;//出单数合计
		int newBillCountSum = 0;//新保出单数合计
		int newToContinueBillCountSum = 0;//新转续出单数合计
		int lostCountSum = 0; //失销数合计
		int sleepCountSum = 0; //睡眠数合计
		int cscAwakenCountSum = 0; //客服唤醒数合计
		int generateCountSum = 0; //生成潜客数合计
		Map<String, Object> sumMap = new HashMap<String, Object>();
		sumMap.put("userName", "合计");
		for(Map<String, Object> map : mapList){
			int roleId = (int) map.get("roleId");
			if(roleId == 2){
				int allCustomer = (int) map.get("allCustomer");
				int monthCustomer = (int) map.get("monthCustomer");
				//int traceCount = (int)map.get("traceCount");
				BigDecimal traceCount = (BigDecimal) map.get("traceCount");
				BigDecimal jtbCount = (BigDecimal) map.get("jtbCount");
				BigDecimal ytbCount = (BigDecimal) map.get("ytbCount");
				BigDecimal moveOutCount = (BigDecimal) map.get("moveOutCount");
				BigDecimal moveIntoCount = (BigDecimal) map.get("moveIntoCount");
				long delayCount = (long) map.get("delayCount");
				BigDecimal returnCount = (BigDecimal) map.get("returnCount");
				BigDecimal awakenCount = (BigDecimal) map.get("awakenCount");
				int billCount = (int) map.get("billCount");
				BigDecimal lostCount = (BigDecimal) map.get("lostCount");
				BigDecimal sleepCount = (BigDecimal) map.get("sleepCount");
				BigDecimal generateCount = (BigDecimal) map.get("generateCount");
				allCustomerSum += allCustomer;
				monthCustomerSum += monthCustomer;
				traceCountSum += traceCount.doubleValue();
				//traceCountSum += traceCount;
				jtbCountSum += jtbCount.intValue();
				ytbCountSum += ytbCount.intValue();
				moveOutCountSum += moveOutCount.intValue();
				moveIntoCountSum += moveIntoCount.intValue();
				delayCountSum += delayCount;
				returnCountSum += returnCount.intValue();
				awakenCountSum += awakenCount.intValue();
				billCountSum += billCount;
				lostCountSum += lostCount.intValue();
				sleepCountSum += sleepCount.intValue();
				generateCountSum += generateCount.intValue();
				sumMap.put("allCustomer", allCustomerSum);
				sumMap.put("monthCustomer", monthCustomerSum);
				sumMap.put("traceCount", traceCountSum);
				sumMap.put("jtbCount", jtbCountSum);
				sumMap.put("ytbCount", ytbCountSum);
				sumMap.put("moveOutCount", moveOutCountSum);
				sumMap.put("moveIntoCount", moveIntoCountSum);
				sumMap.put("delayCount", delayCountSum);
				sumMap.put("returnCount", returnCountSum);
				sumMap.put("awakenCount", awakenCountSum);
				sumMap.put("billCount", billCountSum);
				sumMap.put("lostCount", lostCountSum);
				sumMap.put("sleepCount", sleepCountSum);
				sumMap.put("generateCount", generateCountSum);
			} else if(roleId == 5) {
				int monthCustomer = (int) map.get("monthCustomer");
				BigDecimal lostCount = (BigDecimal) map.get("lostCount");
				BigDecimal sleepCount = (BigDecimal) map.get("sleepCount");
				BigDecimal awakenCount = (BigDecimal) map.get("awakenCount");
				BigDecimal generateCount = (BigDecimal) map.get("generateCount");
				monthCustomerSum += monthCustomer;
				lostCountSum += lostCount.intValue();
				sleepCountSum += sleepCount.intValue();
				cscAwakenCountSum += awakenCount.intValue();
				generateCountSum += generateCount.intValue();
				sumMap.put("monthCustomer", monthCustomerSum);
				sumMap.put("lostCount", lostCountSum);
				sumMap.put("sleepCount", sleepCountSum);
				sumMap.put("awakenCount", cscAwakenCountSum);
				sumMap.put("generateCount", generateCountSum);
			} else if(roleId == 6) {
				int allCustomer = (int) map.get("allCustomer");
				int monthCustomer = (int) map.get("monthCustomer");
				BigDecimal traceCount = (BigDecimal) map.get("traceCount");
				BigDecimal moveOutCount = (BigDecimal) map.get("moveOutCount");
				BigDecimal moveIntoCount = (BigDecimal) map.get("moveIntoCount");
				BigDecimal returnCount = (BigDecimal) map.get("returnCount");
				int newBillCount = (int) map.get("newBillCount");
				int newToContinueBillCount = (int) map.get("newToContinueBillCount");
				allCustomerSum += allCustomer;
				monthCustomerSum += monthCustomer;
				traceCountSum += traceCount.intValue();
				moveOutCountSum += moveOutCount.intValue();
				moveIntoCountSum += moveIntoCount.intValue();
				returnCountSum += returnCount.intValue();
				newBillCountSum += newBillCount;
				newToContinueBillCountSum += newToContinueBillCount;
				sumMap.put("allCustomer", allCustomerSum);
				sumMap.put("monthCustomer", monthCustomerSum);
				sumMap.put("traceCount", traceCountSum);
				sumMap.put("moveOutCount", moveOutCountSum);
				sumMap.put("moveIntoCount", moveIntoCountSum);
				sumMap.put("returnCount", returnCountSum);
				sumMap.put("newBillCount", newBillCountSum);
				sumMap.put("newToContinueBillCount", newToContinueBillCountSum);
			} else if(roleId == 8) {
				int allCustomer = (int) map.get("allCustomer");
				int monthCustomer = (int) map.get("monthCustomer");
				BigDecimal traceCount = (BigDecimal) map.get("traceCount");
				BigDecimal moveOutCount = (BigDecimal) map.get("moveOutCount");
				BigDecimal moveIntoCount = (BigDecimal) map.get("moveIntoCount");
				BigDecimal returnCount = (BigDecimal) map.get("returnCount");
				int billCount = (int) map.get("billCount");
				allCustomerSum += allCustomer;
				monthCustomerSum += monthCustomer;
				traceCountSum += traceCount.intValue();
				moveOutCountSum += moveOutCount.intValue();
				moveIntoCountSum += moveIntoCount.intValue();
				returnCountSum += returnCount.intValue();
				billCountSum += billCount;
				sumMap.put("allCustomer", allCustomerSum);
				sumMap.put("monthCustomer", monthCustomerSum);
				sumMap.put("traceCount", traceCountSum);
				sumMap.put("moveOutCount", moveOutCountSum);
				sumMap.put("moveIntoCount", moveIntoCountSum);
				sumMap.put("returnCount", returnCountSum);
				sumMap.put("billCount", billCountSum);
			}
		}
		return sumMap;
	}

}

