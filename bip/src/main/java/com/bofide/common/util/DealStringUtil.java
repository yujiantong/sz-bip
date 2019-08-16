package com.bofide.common.util;

public class DealStringUtil {
	
	/**
	 * 
	 * @param operation  操作动作
	 * @param reason  理由
	 * @param userName 操作人
	 * @return  返回拼接信息 ，结果如下：<br/>
	 * 			操作人:userName；操作:operation；理由:reason
	 */
	public static String dealTraceRecordReason(String operation,String reason,String userName){
		StringBuffer sb = new StringBuffer();
		sb.append("操作人：");
		sb.append(userName+"；");
		sb.append("操作：");
		sb.append(operation);
		if(reason != null){
			sb.append("；理由：");
			sb.append(reason);
		}
		String dealReturnReason = sb.toString();
		return dealReturnReason;
	}
	
	/**
	 * 
	 * @param operation  操作动作
	 * @param content  内容
	 * @param userName 操作人
	 * @return  返回拼接信息 ，结果如下：<br/>
	 * 			操作人:userName；操作:operation；内容:content
	 */
	public static String dealTraceRecordContent(String operation,String content,String userName){
		StringBuffer sb = new StringBuffer();
		sb.append("操作人：");
		sb.append(userName+"；");
		sb.append("操作：");
		sb.append(operation);
		if(content != null){
			sb.append("；内容：");
			sb.append(content);
		}
		String dealReturnReason = sb.toString();
		return dealReturnReason;
	}

	/**
	 * 
	 * @param operation  操作动作
	 * @param userName 操作人
	 * @return  返回拼接信息 ，结果如下：<br/>
	 * 			操作人:userName；操作:operation；
	 */
	public static String dealLastTraceResult(String operation, String userName) {
		StringBuffer sb = new StringBuffer();
		sb.append("操作人：");
		sb.append(userName+"；");
		sb.append("操作：");
		sb.append(operation);
		String lastTraceResult = sb.toString();
		return lastTraceResult;
	}
	
	/**
	 * @param coverType  投保类型id
	 * @return  返回投保类型名称
	 */
	public static String getCoverTypeName(Integer coverType) {
		String getCoverTypeName = null;
		if(coverType==null){
			return getCoverTypeName;
		}
		if(coverType==1){
			getCoverTypeName = "新保";
		}else if(coverType==2){
			getCoverTypeName = "新转续";
		}else if(coverType==3){
			getCoverTypeName = "续转续";
		}else if(coverType==4){
			getCoverTypeName = "间转续";
		}else if(coverType==5){
			getCoverTypeName = "潜转续";
		}else if(coverType==6){
			getCoverTypeName = "首次";
		}
		return getCoverTypeName;
	}
}
