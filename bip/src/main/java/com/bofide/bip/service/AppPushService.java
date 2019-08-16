package com.bofide.bip.service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ResourceBundle;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bofide.bip.po.Jpush;
import com.bofide.common.util.JpushClientUtil;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service(value="appPushService")
public class AppPushService implements InitializingBean{
	
	private static Logger logger = Logger.getLogger(AppPushService.class);
	
	@Autowired
	private JpushService JpushService;
	
	@Autowired
	private CommonService commonService;
	
	@Override
	public void afterPropertiesSet() throws Exception{
		String start = ResourceBundle.getBundle("jpushConfig").getString("appStart");//获取开关
		if(start.equals("yes")){
			MyRunnable runnable = new MyRunnable();
		    Thread thread = new Thread(runnable);
		    thread.start();
		}else{
			logger.info("**************推送代办没有开启！**************");
		}
	}
	
	class MyRunnable implements Runnable{
	    @Override
	    public void run() {
	    	try {
				for(;;){
					dengdai();
					logger.info("推送待办开始！");
					/*selectPush();*/
					logger.info("推送待办结束！");
					String waitTime = ResourceBundle.getBundle("jpushConfig").getString("waitTime");//获取间隔时间
					Thread.sleep(Integer.parseInt(waitTime)*60*1000);
				}
			} catch (InterruptedException e) {
				logger.info("线程异常:",e);
			} catch (Exception e) {
				logger.info("程序异常："+e);
			} 
	    }
	    
	    public MyRunnable() {
	         
	    }
	}
	
	/**
	 * 线程启动后计算睡眠多少时间开始推送待办
	 * @throws Exception
	 */
	public void dengdai() throws Exception{
		String startTime = ResourceBundle.getBundle("jpushConfig").getString("appStartTime");//获取线程每天启动的时间点
		String endTime = ResourceBundle.getBundle("jpushConfig").getString("appEndTime");//获取线程每天结束的时间点
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		SimpleDateFormat sdfTime = new SimpleDateFormat("HH:mm:ss");
		SimpleDateFormat sdfDay = new SimpleDateFormat("yyyy-MM-dd");
		String nowTime = sdfTime.format(new Date());//获取现在时间点，HH:mm:ss格式，和每天线程启动的时间点比较
		String nowDate = sdfDay.format(new Date());//获取现在的时间点，yyyy-MM-dd HH:mm:ss格式
		
		String now = nowDate+" "+nowTime;//这里就是拼接现在的时间点，yyyy-MM-dd HH:mm:ss格式
		String nowStart = nowDate+" "+startTime;//拼接每天启动时间点，yyyy-MM-dd HH:mm:ss格式
		if(nowTime.compareTo(startTime)<0||nowTime.compareTo(endTime)>0){//compareTo方法是比较字符串大小，1是大于，0等于，-1是小于
			if(nowTime.compareTo(startTime)<0){
				logger.info("==========================睡眠:"+(sdf.parse(nowStart).getTime()-sdf.parse(now).getTime())+"毫秒！");
				Thread.sleep(sdf.parse(nowStart).getTime()-sdf.parse(now).getTime());
			}else{
				logger.info("==========================睡眠:"+(sdf.parse(nowStart).getTime()-sdf.parse(now).getTime()+24*60*60*1000)+"毫秒！");
				Thread.sleep(sdf.parse(nowStart).getTime()-sdf.parse(now).getTime()+24*60*60*1000);
			}
		}
	}
	
	/**
	 * 查询所有需要推送信息的Jpush信息
	 * @throws Exception
	 */
	public void selectPush() throws Exception{
		Map<String, Object> map = new HashMap<String, Object>();
		List<Jpush> jpushs = JpushService.selectAll(map);
		for(Jpush jpush:jpushs){
			if(!jpush.getRegistrationId().equals("0")){
				push(jpush);
			}
		}
	}
	
	/**
	 * 根据jpush信息，推送待办
	 * @param jpush
	 * @throws Exception
	 */
	public void push(Jpush jpush) throws Exception{
		Map<String, Object> map = JpushService.findUserstau(jpush.getUserId());
		if(map != null){
			Integer roleId = (Integer)map.get("roleId");
			Integer switchOn = (Integer)map.get("switchOn");
			Map<String, Integer> resultMap = commonService.findHomePageCount(jpush.getUserId(), jpush.getStoreId(), roleId);
			Integer returnApproveNum = (Integer)resultMap.get("returnApproveNum");//回退待审批
			Integer delayApproveNum = (Integer)resultMap.get("delayApproveNum");//延期待审批
			Integer activeNum = (Integer)resultMap.get("activeNum");//唤醒未分配
			Integer sleepApproveNum = (Integer)resultMap.get("sleepApproveNum");//睡眠待审批
			Integer lostApproveNum = (Integer)resultMap.get("lostApproveNum");//失销待审批
			Integer shouldTraceNum = (Integer)resultMap.get("shouldTraceNum");//应跟踪
			Integer accpetNum = (Integer)resultMap.get("accpetNum");//未接收
			Integer willOutNum = (Integer)resultMap.get("willOutNum");//将脱保
			Integer defeatNum = (Integer)resultMap.get("defeatNum");//销售战败线索
			Integer approveNum = (Integer)resultMap.get("approveNum");//待审批
			Integer num = 0;
			if(roleId == 3){
				if(switchOn == 0){
					//mess = mess+returnApproveNum+"个回退待审批，"+delayApproveNum+"个延期待审批，"+sleepApproveNum+"个睡眠待审批，"+lostApproveNum+"个失销待审批未处理！";
					num = returnApproveNum+delayApproveNum+sleepApproveNum+lostApproveNum;
				}else{
					//mess = mess+returnApproveNum+"个回退待审批，"+delayApproveNum+"个延期待审批，"+activeNum+"个唤醒未分配未处理！";
					num = returnApproveNum+delayApproveNum+activeNum;
				}
			}else if(roleId == 2){
				//mess = mess+shouldTraceNum+"个应跟踪，"+accpetNum+"个未接收，"+willOutNum+"个将脱保，"+defeatNum+"个销售战败线索未处理！";
				num = shouldTraceNum+accpetNum+willOutNum+defeatNum;
			}else if(roleId == 6){
				//mess = mess+shouldTraceNum+"个应跟踪，"+accpetNum+"个未接收，"+willOutNum+"个将脱保未处理！";
				num = shouldTraceNum+accpetNum+willOutNum;
			}else if(roleId == 7){
				//mess = mess+approveNum+"个待审批需要处理！";
				num = approveNum;
			}else if(roleId == 8){
				//mess = mess+shouldTraceNum+"个应跟踪，"+accpetNum+"个未接收，"+willOutNum+"个将脱保未处理！";
				num = shouldTraceNum+accpetNum+willOutNum;
			}else if(roleId == 9){
				//mess = mess+approveNum+"个待审批未处理！";
				num = approveNum;
			}
			//调用的第三方接口
			if(num>0){
				Map<String,Object> jsMap = new HashMap<String, Object>();
				jsMap.put("pending", num);
		    	ObjectMapper o = new ObjectMapper();
		    	String jsonString = o.writeValueAsString(jsMap);
				String masterSecret = "";
				String appKey = "";
				if(jpush.getLogoFlag()==1){
					masterSecret = ResourceBundle.getBundle("jpushConfig").getString("bipMasterSecret");
					appKey = ResourceBundle.getBundle("jpushConfig").getString("bipAppKey");
				}else{
					masterSecret = ResourceBundle.getBundle("jpushConfig").getString("chipMasterSecret");
					appKey = ResourceBundle.getBundle("jpushConfig").getString("chipAppKey");
				}
				logger.info("开始给ID为："+jpush.getUserId()+"的用户推送待办！");
				JpushClientUtil.sendToRegistrationId(masterSecret,appKey,jpush.getRegistrationId(),"您有新的待办","您有"+num+"条待办未处理",jsonString,"");
			}
		}
	}
}
