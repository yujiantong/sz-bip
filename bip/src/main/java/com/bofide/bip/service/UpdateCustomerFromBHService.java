package com.bofide.bip.service;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ResourceBundle;
import java.util.concurrent.ExecutorService;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.bofide.bip.common.po.ReturnStatus;
import com.bofide.bip.mapper.CustomerMapper;
import com.bofide.bip.mapper.CustomerUpdateMapper;
import com.bofide.bip.mapper.InsuranceCompMapper;
import com.bofide.bip.mapper.ModuleSetMapper;
import com.bofide.bip.mapper.RenewalingCustomerMapper;
import com.bofide.bip.mapper.StoreMapper;
import com.bofide.bip.po.Customer;
import com.bofide.bip.po.CustomerAssign;
import com.bofide.bip.po.CustomerUpdate;
import com.bofide.bip.po.InsuranceComp;
import com.bofide.bip.po.ModuleSet;
import com.bofide.bip.po.Store;
import com.bofide.bip.vo.BHCarInfoVo;
import com.bofide.bip.vo.BxFromBHInfoVo;
import com.bofide.common.util.BofideTobihuUtils;
import com.bofide.common.util.DealStringUtil;

import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;
import net.sf.json.util.JavaIdentifierTransformer;

@Service(value="updateCustomerFromBHService")
public class UpdateCustomerFromBHService{

	private static Logger logger = Logger.getLogger(UpdateCustomerFromBHService.class);
	
	@Resource(name="customerMapper")
	private CustomerMapper customerMapper;
	@Resource(name="renewalingCustomerMapper")
	private RenewalingCustomerMapper renewalingCustomerMapper;
	@Resource(name="biHuService")
	private BiHuService biHuService;
	@Resource(name="customerUpdateMapper")
	private CustomerUpdateMapper customerUpdateMapper;
	@Resource(name="storeMapper")
	private StoreMapper storeMapper;
	@Resource(name="insuranceCompMapper")
	private InsuranceCompMapper insuranceCompMapper;
	@Resource(name="moduleSetMapper")
	private ModuleSetMapper moduleSetMapper;
	@Resource(name="customerService")
	private CustomerService customerService;
	@Resource(name="customerAssignService")
	private CustomerAssignService customerAssignService;
	@Resource(name="userService")
	private UserService userService;
	
	/**
	 * 开启循环
	 * @param cachedThreadPool
	 */
	public void xunhuan(ExecutorService cachedThreadPool){
		while(true){
			dengdaiStart();//刚刚启动程序要睡眠多久，详情方法里面看
			logger.info("**************BH自动更新开始**************");
			try {
				List<Store> stores = storeMapper.selectAll();//查询所有4S店
				List<InsuranceComp> insuranceComps = insuranceCompMapper.selectAll();//查询所有保险公司，联合下面的方法取得我们需要的保险公司的信息
		    	if(stores!=null&&stores.size()>0){
		        	for(int i=0;i<stores.size();i++){
		        		if(stores.get(i).getBhDock()==0||stores.get(i).getBhDock()==3){
		        			continue;
		        		}
		        		List<ModuleSet> ms = moduleSetMapper.selectByFoursStoreId(stores.get(i).getStoreId());
		        		Integer update = 0;
		        		for(int j=0;j<ms.size();j++){
		        			if(ms.get(j).getModuleName().equals("update")){
		        				update = ms.get(j).getSwitchOn();
		        			}
		        		}
		        		if(update==0){
		        			continue;
		        		}//上面都是判断要不要给这个4S店开线程自动获取续险信息
		        		Store store = storeMapper.selectByPrimaryKey(stores.get(i).getStoreId());//这里查一次是因为下面开线程不能用 i这个变量
		        		cachedThreadPool.execute(new Runnable() {
		        		    public void run() {
		        		    	try {
		        		    		logger.info("**************店ID为"+store.getStoreId()+"的店的自动获取续险信息线程已经开始！**************");
									disposeStore(store,insuranceComps);
									logger.info("**************店ID为"+store.getStoreId()+"的店的自动获取续险信息线程已达到每日上限，已经停止！**************");
								} catch (Exception e) {
									logger.info("**************店ID为"+store.getStoreId()+"的店的自动获取续险信息线程出错，已经停止！**************"+e);
								}
		        		    } 
		        		});
		        	}
		        }
		    } catch (Exception e) {
				logger.info("**************BH自动更新出错xunhuan()**************"+e);
				try {
					Thread.sleep(5000);
				} catch (InterruptedException e1) {
					logger.info("睡眠失败，退出程序！");
					break;
				}
			}
	    	dengdaiEnd();//运行完了之后，要等待多久
	    } 
	}
	
	/**
	 * 启动tomcat时，要等待多少秒才能开始启动线程
	 */
	public void dengdaiStart(){
		String startTime = ResourceBundle.getBundle("bofideTobihuConfig").getString("startTime");//获取线程每天启动的时间点
		String endTime = ResourceBundle.getBundle("bofideTobihuConfig").getString("endTime");//获取线程每天结束的时间点
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		SimpleDateFormat sdfTime = new SimpleDateFormat("HH:mm:ss");
		SimpleDateFormat sdfDay = new SimpleDateFormat("yyyy-MM-dd");
		String nowTime = sdfTime.format(new Date());//获取现在时间点，HH:mm:ss格式，和每天线程启动的时间点比较
		String nowDate = sdfDay.format(new Date());//获取现在的时间点，yyyy-MM-dd HH:mm:ss格式
		
		String now = nowDate+" "+nowTime;//这里就是拼接现在的时间点，yyyy-MM-dd HH:mm:ss格式
		String nowStart = nowDate+" "+startTime;//拼接每天启动时间点，yyyy-MM-dd HH:mm:ss格式
		if(nowTime.compareTo(startTime)<0&&nowTime.compareTo(endTime)>0){//compareTo方法是比较字符串大小，1是大于，0等于，-1是小于
			try {
    			try {
    				logger.info("=============================================睡眠:"+(sdf.parse(nowStart).getTime()-sdf.parse(now).getTime())+"毫秒再启动线程！");
					Thread.sleep(sdf.parse(nowStart).getTime()-sdf.parse(now).getTime());//线程开始的时间点的时间戳-现在时间点的时间戳，等待多少秒
				} catch (InterruptedException e) {
					logger.info("dengdai()睡眠失败！"+e);
				};
			} catch (ParseException e) {
				logger.info("dengdai()时间转换出错！"+e);
			}
        }else if(nowTime.compareTo(startTime)<0&&nowTime.compareTo(endTime)<0){
        	if(startTime.compareTo(endTime)<0){
        		try {
        			try {
        				logger.info("============================================睡眠："+(sdf.parse(nowStart).getTime()-sdf.parse(now).getTime())+"毫秒再启动线程！");
    					Thread.sleep(sdf.parse(nowStart).getTime()-sdf.parse(now).getTime());//线程开始的时间点的时间戳-现在时间点的时间戳，等待多少秒
    				} catch (InterruptedException e) {
    					logger.info("dengdai()睡眠失败！"+e);
    				};
    			} catch (ParseException e) {
    				logger.info("dengdai()时间转换出错！"+e);
    			}
        	}
        }else if(nowTime.compareTo(startTime)>0&&nowTime.compareTo(endTime)>0){
        	if(startTime.compareTo(endTime)<0){
        		try {
        			try {
        				logger.info("============================================睡眠："+(sdf.parse(nowStart).getTime()-sdf.parse(now).getTime()+1000*60*60*24)+"毫秒再启动线程！");
    					Thread.sleep(sdf.parse(nowStart).getTime()-sdf.parse(now).getTime()+1000*60*60*24);//线程开始的时间点的时间戳-现在时间点的时间戳，等待多少秒
    				} catch (InterruptedException e) {
    					logger.info("dengdai()睡眠失败！"+e);
    				};
    			} catch (ParseException e) {
    				logger.info("dengdai()时间转换出错！"+e);
    			}
        	}
        }
	}
	
	/**
	 * 线程结束之后，要等待多久重新启动线程
	 */
	public void dengdaiEnd(){
		String startTime = ResourceBundle.getBundle("bofideTobihuConfig").getString("startTime");//获取每天启动的时间点
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		SimpleDateFormat sdfDay = new SimpleDateFormat("yyyy-MM-dd");
		String nowDate = sdfDay.format(new Date());
		String nowStart = nowDate+" "+startTime;
		try {
			try {
				long dengdai = sdf.parse(nowStart).getTime()-new Date().getTime();//获取等待的时间，可能未负
				if(dengdai<0){
					Thread.sleep(dengdai+1000*60*60*24);//为负就加一天的时间咯
				}else{
					Thread.sleep(dengdai);//不为就直接等待这么久咯
				}
			} catch (InterruptedException e) {
				logger.info("dengdaiEnd()睡眠失败！"+e);
			};
		} catch (ParseException e) {
			logger.info("dengdaiEnd()时间转换出错！"+e);
		}
	}
	
	/**
	 * 判断线程是否应该结束，根据设置的每天结束时间点判断
	 * @return
	 */
	public boolean jieshu(){
		boolean boo = false;
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		SimpleDateFormat sdf1 = new SimpleDateFormat("yyyy-MM-dd");
		String startTime = ResourceBundle.getBundle("bofideTobihuConfig").getString("startTime");
		String endTime = ResourceBundle.getBundle("bofideTobihuConfig").getString("endTime");
		String datestart = sdf1.format(new Date())+" "+startTime;
		String dateEnd = sdf1.format(new Date())+" "+endTime;
		long now = new Date().getTime();
		try {
			long a = sdf.parse(datestart).getTime();
			long b = sdf.parse(dateEnd).getTime();
			if(a>b){
				if(now>b&&now<a){
					boo = true;
				}
			}
			if(a<b){
				if(now>b||now<a){
					boo = true;
				}
			}
		} catch (ParseException e) {
			boo = true;
			logger.info("jieshou()时间转换出错！"+e);
		}
		return boo;
	}
	
	/**
	 * 根据店获取潜客续险
	 * @param store
	 * @param insuranceComps
	 * @throws Exception
	 */
	public void disposeStore(Store store,List<InsuranceComp> insuranceComps) throws Exception{
		Integer select = Integer.parseInt(ResourceBundle.getBundle("bofideTobihuConfig").getString("select"));
		int num = 0;
		num = disCustomer1(store,insuranceComps,select,num);
		//num = disCustomer2(store,insuranceComps,select,num);
		num = disCustomer3(store,insuranceComps,select,num);
		while(true){
			if(num>=select){
				break;
			}
			if(jieshu()){
				break;
			}
			logger.info("**************店ID为"+store.getStoreId()+"的店的自动获取续险信息线程已经全部完成，今天只处理第一级别潜客！**************");
			Thread.sleep(1000*60*10);
			num = disCustomer1(store,insuranceComps,select,num);
		}
	}
	
	/**
	 * 获取第一级别潜客的续险信息
	 * @param store
	 * @param insuranceComps
	 * @param select
	 * @param num
	 * @return
	 */
	public Integer disCustomer1(Store store,List<InsuranceComp> insuranceComps,Integer select,Integer num){
		logger.info("=============方法disCustomer1运行开始===============");
		while(true){
			try {
				//检测该店是否有续保专员可以分配
				boolean flag = userService.checkStoreHaveWorker(store.getStoreId());
				if(flag == false){
					logger.info(store.getStoreId()+"=============没有续保专员可分配,请确保续保专员存在或者状态正常===============");
					break;
				}
				Map<String, Object> parm = new HashMap<String, Object>();
				parm.put("storeId", store.getStoreId());
				parm.put("pageNum", 0);
				parm.put("pageSize", 50);
				List<CustomerUpdate> customerUpdates = customerUpdateMapper.select(parm);
				if(customerUpdates!=null&&customerUpdates.size()>0){
					for(int k=0;k<customerUpdates.size();k++){
						long fwStartTime = new Date().getTime();
						Customer customer = customerMapper.selectByPrimaryKey(customerUpdates.get(k).getCustomerId());
						if(customer!=null&&!customer.getCustomerLevel().equals("O")&&!customer.getCustomerLevel().equals("F")&&!customer.getCustomerLevel().equals("S")&&customer.getUpdateStatus()==0){
							if(!StringUtils.isEmpty(customer.getCarLicenseNumber())||!StringUtils.isEmpty(customer.getEngineNumber())){
		    					//上面的条件表示的是：是跟踪状态的潜客，并且车牌号和发动机号不同时为空
								List<String> list = requestBH(customer,0,false);
								String json = list.get(0);
		    					num = num+Integer.parseInt(list.get(1));
		    					if(!StringUtils.isEmpty(json)){
		    						Map<String,Object> map = disposeJson(json,customer,insuranceComps);
		    						if(!map.isEmpty()){
		    							Date bhInsuranceEndDate = (Date)map.get("bhInsuranceEndDate");
		    							if(bhInsuranceEndDate!=null){
		    								Map<String,Object> map1 = new HashMap<>();
		    								map1.put("bhInsuranceEndDate", bhInsuranceEndDate);
		    								map1.put("bhUpdateTime", "yes");
		    								map1.put("customerId", customer.getCustomerId());
		    								map1.put("updateStatus", 1);
		    								Date date = getDate(bhInsuranceEndDate,customer.getVirtualJqxdqr(),1,customer.getCustomerId(),customer.getPrincipalId());
		    								if(date!=null){
		    									map1.put("newVirtualJqxdqr", date);
		        								DateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		        								map1.put("jqxrqEnd", format.format(date));
		        								map1.put("userId", -1);
		        								map1.put("userName", "系统");
		        								map1.put("contactWay", customer.getContactWay());
		        								map1.put("chassisNumber", customer.getChassisNumber());
		        								map1.put("renewalType", customer.getRenewalType());
		        								customerService.updateCustomerInfo(map1, customer, true, customer.getPrincipalId(), customer.getPrincipal());
		    								}else{
		    									disposeUpdate(map1,customer);
		    								}
		    							}else{
		    								zdUpdate(customer.getCustomerId(),1);
		    							}
		    						}else{
		    							zdUpdate(customer.getCustomerId(),1);
		    						}
		    					}
		    					if(jieshu()){
		    						break;
		    					}
		    					if(num>=select){
		    						break;
		    					}
		    					long fwEndTime = new Date().getTime();
								if(fwEndTime-fwStartTime<10000*Integer.parseInt(list.get(1))){
									Thread.sleep(10000*Integer.parseInt(list.get(1))-(fwEndTime-fwStartTime));
								}
		    				}
						}
						customerUpdateMapper.deleteByPrimaryKey(customerUpdates.get(k).getId());
					}
	    		}else{
	    			break;
	    		}
				if(jieshu()){
					break;
				}
				if(num>=select){
					break;
				}
			} catch (Exception e) {
				logger.error("=============方法disCustomer1出错===============", e);
				try {
					Thread.sleep(5000);
				} catch (InterruptedException e1) {
					logger.info("睡眠失败，退出程序！");
					break;
				}
			}
		}
		logger.info("=============方法disCustomer1运行完成===============");
		return num;
	}
	
	/**
	 * 获取第二级别的潜客续险信息
	 * @param store
	 * @param insuranceComps
	 * @param select
	 * @param num
	 * @return
	 */
	/*public Integer disCustomer2(Store store,List<InsuranceComp> insuranceComps,Integer select,Integer num){
		logger.info("=============方法disCustomer2运行开始===============");
		Long startTime = new Date().getTime();
		Integer select2 = Integer.parseInt(ResourceBundle.getBundle("bofideTobihuConfig").getString("select2"));
		int num2 = 0;
		if(num2>=select2){
			return num;
		}
		while(true){
			try {
				//检测该店是否有续保专员可以分配
				boolean flag = userService.checkStoreHaveWorker(store.getStoreId());
				if(flag == false){
					logger.info(store.getStoreId()+"=============没有续保专员可分配,请确保续保专员存在或者状态正常===============");
					break;
				}
				Map<String, Object> parm = new HashMap<String, Object>();
				parm.put("storeId", store.getStoreId());
				parm.put("pageNum", 0);
				parm.put("pageSize", 50);
				List<Customer> customers = customerMapper.findAllCustomerByStoreIdYes(parm);
				if(customers!=null&&customers.size()>0){
					for(int k=0;k<customers.size();k++){
						if(!StringUtils.isEmpty(customers.get(k).getCarLicenseNumber())||!StringUtils.isEmpty(customers.get(k).getEngineNumber())){
	    					long fwStartTime = new Date().getTime();
							//上面的条件表示的是：不是跟踪状态的潜客，且车牌号或发动机号不为空
							List<String> list = requestBH(customers.get(k),0);
	    					String json = list.get(0);
	    					num = num+Integer.parseInt(list.get(1));
	    					num2 = num2+Integer.parseInt(list.get(1));
	    					if(!StringUtils.isEmpty(json)){
	    						Map<String,Object> map = disposeJson(json,customers.get(k),insuranceComps);
	    						Date bhInsuranceEndDate = (Date)map.get("bhInsuranceEndDate");
    							if(bhInsuranceEndDate!=null){
    								Map<String,Object> map1 = new HashMap<>();
    								map1.put("bhInsuranceEndDate", bhInsuranceEndDate);
    								map1.put("bhUpdateTime", "yes");
    								map1.put("customerId", customers.get(k).getCustomerId());
    								map1.put("updateStatus", 1);
    								Date date = getDate(bhInsuranceEndDate,customers.get(k).getVirtualJqxdqr(),1);
    								if(date!=null){
    									map1.put("newVirtualJqxdqr", date);
    									map1.put("virtualJqxdqr", date);
        								map1.put("jqxrqEnd", date);
        								map1.put("insuranceEndDate", date);
    								}
    								disposeUpdate(map1,customers.get(k));
    							}else{
	    							zdUpdate(customers.get(k).getCustomerId(),1);
	    						}
	    					}
	    					if(jieshu()){
	    						break;
	    					}
	    					if(num>=select){
	    						break;
	    					}
	    					Long endTime = new Date().getTime();
	    					if((endTime-startTime)>=1000*60*10){
	    						disCustomer1(store,insuranceComps,select,num);
	    						startTime = new Date().getTime();
	    					}
	    					if(num2>=select2){
	    						break;
	    					}
	    					long fwEndTime = new Date().getTime();
	    					if(fwEndTime-fwStartTime<10000*Integer.parseInt(list.get(1))){
	    						Thread.sleep(10000*Integer.parseInt(list.get(1))-(fwEndTime-fwStartTime));
							}
	    				}else{
	    					zdUpdate(customers.get(k).getCustomerId(),1);
	    				}
					}
	    		}else{
	    			customerMapper.updateCustomerByUpdateStatus(store.getStoreId());
	    			break;
	    		}
				if(jieshu()){
					break;
				}
				if(num2>=select2){
					break;
				}
				if(num>=select){
					break;
				}
			} catch (Exception e) {
				logger.error("=============方法disCustomer2出错===============", e);
				try {
					Thread.sleep(5000);
				} catch (InterruptedException e1) {
					logger.info("睡眠失败，退出程序！");
					break;
				}
			}
			
		}
		logger.info("=============方法disCustomer2运行完成===============");
		return num;
	}*/
	
	/**
	 * 获取第三级别的潜客续险信息
	 * @param store
	 * @param insuranceComps
	 * @param select
	 * @param num
	 * @return
	 */
	public Integer disCustomer3(Store store,List<InsuranceComp> insuranceComps,Integer select,Integer num){
		logger.info("=============方法disCustomer3运行开始===============");
		Long startTime = new Date().getTime();
		Integer select3 = Integer.parseInt(ResourceBundle.getBundle("bofideTobihuConfig").getString("select3"));
		int num3 = 0;
		while(true){
			try {
				//检测该店是否有续保专员可以分配
				boolean flag = userService.checkStoreHaveWorker(store.getStoreId());
				if(flag == false){
					logger.info(store.getStoreId()+"=============没有续保专员可分配,请确保续保专员存在或者状态正常===============");
					break;
				}
				Map<String, Object> parm = new HashMap<String, Object>();
				parm.put("storeId", store.getStoreId());
				parm.put("pageNum", 0);
				parm.put("pageSize", 50);
				List<Customer> customers = customerMapper.findAllCustomerByStoreIdNo(parm);
				if(customers!=null&&customers.size()>0){
					for(int k=0;k<customers.size();k++){
						if(!StringUtils.isEmpty(customers.get(k).getCarLicenseNumber())||!StringUtils.isEmpty(customers.get(k).getEngineNumber())){
							long fwStartTime = new Date().getTime();
							//上面的条件表示的是：不是跟踪状态的潜客，且车牌号或发动机号不为空
							List<String> list = requestBH(customers.get(k),0,false);
	    					String json = list.get(0);
	    					num = num+Integer.parseInt(list.get(1));
	    					num3 = num3+Integer.parseInt(list.get(1));
	    					if(!StringUtils.isEmpty(json)){
	    						Map<String,Object> map = disposeJson(json,customers.get(k),insuranceComps);
	    						Date bhInsuranceEndDate = (Date)map.get("bhInsuranceEndDate");
    							if(bhInsuranceEndDate!=null){
    								Map<String,Object> map1 = new HashMap<>();
    								map1.put("bhInsuranceEndDate", bhInsuranceEndDate);
    								map1.put("bhUpdateTime", "yes");
    								map1.put("customerId", customers.get(k).getCustomerId());
    								map1.put("updateStatus", 2);
    								Date date = getDate(bhInsuranceEndDate,customers.get(k).getVirtualJqxdqr(),2,-1,-1);
    								if(date!=null){
    									map1.put("newVirtualJqxdqr", date);
        								DateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        								map1.put("jqxrqEnd", format.format(date));
        								map1.put("userId", -1);
        								map1.put("userName", "系统");
        								map1.put("contactWay", customers.get(k).getContactWay());
        								map1.put("chassisNumber", customers.get(k).getChassisNumber());
        								map1.put("renewalType", customers.get(k).getRenewalType());
        								customerService.updateCustomerInfo(map1, customers.get(k), true, customers.get(k).getPrincipalId(), customers.get(k).getPrincipal());
    								}else{
    									disposeUpdate(map1,customers.get(k));
    								}
    							}else{
	    							zdUpdate(customers.get(k).getCustomerId(),2);
	    						}
	    					}else{
	    						zdUpdate(customers.get(k).getCustomerId(),2);
	    					}
	    					if(jieshu()){
	    						break;
	    					}
	    					if(num>=select){
	    						break;
	    					}
	    					Long endTime = new Date().getTime();
	    					if((endTime-startTime)>=1000*60*10){
	    						disCustomer1(store,insuranceComps,select,num);
	    						startTime = new Date().getTime();
	    					}
	    					if(num3>=select3){
	    						break;
	    					}
	    					long fwEndTime = new Date().getTime();
	    					if(fwEndTime-fwStartTime<10000*Integer.parseInt(list.get(1))){
	    						Thread.sleep(10000*Integer.parseInt(list.get(1))-(fwEndTime-fwStartTime));
							}
	    				}else{
	    					zdUpdate(customers.get(k).getCustomerId(),2);
	    				}
					}
				}else{
	    			customerMapper.updateCustomerByUpdateStatus(store.getStoreId());
	    			break;
	    		}
				if(jieshu()){
					break;
				}
				if(num3>=select3){
					break;
				}
				if(num>=select){
					break;
				}
			} catch (Exception e) {
				logger.error("=============方法disCustomer3出错===============", e);
				try {
					Thread.sleep(5000);
				} catch (InterruptedException e1) {
					logger.info("睡眠失败，退出程序！");
					break;
				}
			}
			
		}
		logger.info("=============方法disCustomer3运行完成===============");
		return num;
	}
	
	/**
	 * 获取保险到期日和虚拟保险到期日
	 * @param bhDate
	 * @param virtualJqxdqr
	 * @param num
	 * @return
	 */
	public Date getDate(Date bhDate,Date virtualJqxdqr,Integer num,Integer customerId,Integer userId){
		Date date = null;
		try {
			CustomerAssign customerAssign = null;
			try {
				if(userId>0){
					customerAssign = customerAssignService.findCustomerAssign(customerId,userId);
				}
				if(customerAssign != null){
					Integer returnStatu = customerAssign.getReturnStatu();
					if(returnStatu != null && returnStatu == ReturnStatus.CHECKDELAY){
						return date;
					}
				}
			} catch (Exception e) {
				logger.info("UpdateCustomerFromBHService类的574行报的错！"+e);
			}
			SimpleDateFormat sdf1 = new SimpleDateFormat("yyyy");
			SimpleDateFormat sdf2 = new SimpleDateFormat("MM-dd");
			SimpleDateFormat sdf3 = new SimpleDateFormat("yyyy-MM-dd");
			SimpleDateFormat sdf4 = new SimpleDateFormat("MMdd");
			String newNian = sdf1.format(new Date());
			String newNian1 = String.valueOf(Integer.parseInt(newNian)+1);
			String bhYue = sdf2.format(bhDate);
			if(num==1){
				if(bhDate.getTime()>virtualJqxdqr.getTime()){
					date = bhDate;
				}else if(bhDate.getTime()<virtualJqxdqr.getTime()){
					date = sdf3.parse(newNian+"-"+bhYue);
				}
			}else if(num==2){
				int bh = Integer.parseInt(sdf4.format(bhDate));
				int vir = Integer.parseInt(sdf4.format(virtualJqxdqr));
				long nowDateTime = sdf3.parse(sdf3.format(new Date())).getTime();
				if(bh!=vir){
					if(bhDate.getTime()>=nowDateTime){
						date = bhDate;
					}else{
						date = sdf3.parse(newNian+"-"+bhYue);
					}
					if(date.getTime()<nowDateTime){
						date = sdf3.parse(newNian1+"-"+bhYue);
					}
				}
			}
			if(date!=null){
				long nowDateTime = sdf3.parse(sdf3.format(new Date())).getTime();
				if(date.getTime()<nowDateTime){
					date = null;
				}
			}
		} catch (ParseException e) {
			logger.info("转换日期出错！");
		}
		return date;
	}
	
	/**
	 * 添加跟踪记录
	 * @param oldJqxdqrEndStr
	 * @param jqxrqEnd
	 * @param principalId
	 * @param principal
	 * @param customerId
	 */
	public void addGenZong(String newJqxrqEnd,Customer cus){
		DateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		String operation = "修改潜客信息";
		String activateContent = "修改交强险日期由'"+format.format(cus.getJqxrqEnd())+"'改为'"+newJqxrqEnd+"'；";
		String dealActivateReason = DealStringUtil.dealTraceRecordContent(operation, activateContent, "系统");
		String lastTraceResult = DealStringUtil.dealLastTraceResult(operation, "系统");
		//添加跟踪记录
		try {
			customerService.addTraceRecord(cus.getPrincipalId(), cus.getPrincipal(), cus.getCustomerId(), dealActivateReason, lastTraceResult,null,null,-1);
		} catch (Exception e) {
			logger.info("壁虎自动更新添加跟踪记录失败！"+e);
		}
	}
	
	/**
	 * 把获取过续险信息的潜客变一下状态，防止重复获取
	 * @param customerId
	 * @param num
	 * @return
	 */
	public boolean zdUpdate(Integer customerId,Integer num){
		try {
			Map<String,Object> map = new HashMap<String,Object>();
			map.put("customerId", customerId);
			map.put("updateStatus", num);
			customerMapper.updateCustomerInfo(map);//修改数据
			return true;
		} catch (Exception e){
			logger.info("新增或修改潜客出错："+e);
			return false;
		}
	}
	
	/**
	 * 根据车架号+发动机号或者车牌号获取续险信息
	 * @param customer
	 * @param userId
	 * @return
	 * @throws Exception
	 */
	public List<String> requestBH(Customer customer,Integer userId,boolean boo) throws Exception{
		String json = "";
		String agentCustKey = "";
		int num = 0;
		String biHuKey = "";
		String start = ResourceBundle.getBundle("bofideTobihuConfig").getString("start");
		logger.info(customer.getFourSStoreId()+"========================================开始请求"+new Date().getTime());
		if(!StringUtils.isEmpty(customer.getEngineNumber())&&customer.getEngineNumber().matches("[a-z_A-Z_0-9]+")){
			if(start.equals("yes")){
				agentCustKey = biHuService.getAgentCustKey(customer.getFourSStoreId(),"random"+getKeyValue(customer.getFourSStoreId()));
				biHuKey = biHuService.getBiHuKey(customer.getFourSStoreId());
			}else{
				if(boo){
					agentCustKey = getAgentCustKey66650();
					biHuKey = ResourceBundle.getBundle("bofideTobihuConfig").getString("bihuKey");
				}else{
					agentCustKey = biHuService.getAgentCustKey(customer.getFourSStoreId(),BiHuService.getRandom20());
					biHuKey = biHuService.getBiHuKey(customer.getFourSStoreId());
				}
			}
			json = BofideTobihuUtils.sendGet("getreinfoUrl", "CityCode="+biHuService.getCityCode(customer.getFourSStoreId())+"&ShowXiuLiChangType=1"+"&EngineNo="+customer.getEngineNumber()+"&CarVin="+customer.getChassisNumber()+agentCustKey,biHuKey);
			num++;
			baocun(customer,agentCustKey,userId,1);
			if(json.length()>0){
				JSONObject jsonObject = JSONObject.fromObject(json);
				String businessStatus = jsonObject.getString("BusinessStatus");
				if(!businessStatus.equals("1")){
					if(!StringUtils.isEmpty(customer.getCarLicenseNumber())&&customer.getCarLicenseNumber().matches("^[\\u4e00-\\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{4,5}$")){
						if(start.equals("yes")){
							agentCustKey = biHuService.getAgentCustKey(customer.getFourSStoreId(),"random"+getKeyValue(customer.getFourSStoreId()));
							biHuKey = biHuService.getBiHuKey(customer.getFourSStoreId());
						}else{
							if(boo){
								agentCustKey = getAgentCustKey66650();
								biHuKey = ResourceBundle.getBundle("bofideTobihuConfig").getString("bihuKey");
							}else{
								agentCustKey = biHuService.getAgentCustKey(customer.getFourSStoreId(),BiHuService.getRandom20());
								biHuKey = biHuService.getBiHuKey(customer.getFourSStoreId());
							}
						}
						json = BofideTobihuUtils.sendGet("getreinfoUrl", "CityCode="+biHuService.getCityCode(customer.getFourSStoreId())+"&ShowXiuLiChangType=1"+"&LicenseNo="+customer.getCarLicenseNumber()+agentCustKey,biHuKey);
						num++;
						baocun(customer,agentCustKey,userId,2);
					}
				}
			}else{
				if(!StringUtils.isEmpty(customer.getCarLicenseNumber())&&customer.getCarLicenseNumber().matches("^[\\u4e00-\\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{4,5}$")){
					if(start.equals("yes")){
						agentCustKey = biHuService.getAgentCustKey(customer.getFourSStoreId(),"random"+getKeyValue(customer.getFourSStoreId()));
						biHuKey = biHuService.getBiHuKey(customer.getFourSStoreId());
					}else{
						if(boo){
							agentCustKey = getAgentCustKey66650();
							biHuKey = ResourceBundle.getBundle("bofideTobihuConfig").getString("bihuKey");
						}else{
							agentCustKey = biHuService.getAgentCustKey(customer.getFourSStoreId(),BiHuService.getRandom20());
							biHuKey = biHuService.getBiHuKey(customer.getFourSStoreId());
						}
					}
					json = BofideTobihuUtils.sendGet("getreinfoUrl", "CityCode="+biHuService.getCityCode(customer.getFourSStoreId())+"&ShowXiuLiChangType=1"+"&LicenseNo="+customer.getCarLicenseNumber()+agentCustKey,biHuKey);
					num++;
					baocun(customer,agentCustKey,userId,2);
				}
			}
		}else{
			if(!StringUtils.isEmpty(customer.getCarLicenseNumber())&&customer.getCarLicenseNumber().matches("^[\\u4e00-\\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{4,5}$")){
				if(start.equals("yes")){
					agentCustKey = biHuService.getAgentCustKey(customer.getFourSStoreId(),"random"+getKeyValue(customer.getFourSStoreId()));
					biHuKey = biHuService.getBiHuKey(customer.getFourSStoreId());
				}else{
					if(boo){
						agentCustKey = getAgentCustKey66650();
						biHuKey = ResourceBundle.getBundle("bofideTobihuConfig").getString("bihuKey");
					}else{
						agentCustKey = biHuService.getAgentCustKey(customer.getFourSStoreId(),BiHuService.getRandom20());
						biHuKey = biHuService.getBiHuKey(customer.getFourSStoreId());
					}
				}
				json = BofideTobihuUtils.sendGet("getreinfoUrl", "CityCode="+biHuService.getCityCode(customer.getFourSStoreId())+"&ShowXiuLiChangType=1"+"&LicenseNo="+customer.getCarLicenseNumber()+agentCustKey,biHuKey);
				num++;
				baocun(customer,agentCustKey,userId,2);
			}
		}
		logger.info(customer.getFourSStoreId()+"-------"+num+"========================================结束请求"+new Date().getTime());
		List<String> list = new ArrayList<String>();
		list.add(json);
		list.add(num+"");
		return list;
	}
	
	public String getAgentCustKey66650(){
		String agent = ResourceBundle.getBundle("bofideTobihuConfig").getString("agent");
		String random = BiHuService.getRandom20();
		String custKey = biHuService.getCustKey(50,random);
		return "&Agent="+agent+ "&CustKey="+custKey;
	}
	
	/**
	 * 每请求一次壁虎，需要把请求的信息保存，
	 * @param customer
	 * @param agentCustKey
	 * @param userId
	 * @param num
	 * @throws Exception
	 */
	public void baocun(Customer customer,String agentCustKey,Integer userId,Integer num) throws Exception{
		try {
			Map<String, Object> map = new HashMap<>();
			map.put("storeId", customer.getFourSStoreId());
			map.put("userId", userId);
			map.put("agent", agentCustKey.split("&")[1].split("=")[1]);
			map.put("custKey", agentCustKey.split("&")[2].split("=")[1]);
			map.put("transferType", 1);
			if(num==1){
				map.put("engineNo", customer.getEngineNumber());
				map.put("carVin", customer.getChassisNumber());
			}else{
				map.put("licenseNo", customer.getCarLicenseNumber());
			}
			map.put("source", -1);
			biHuService.saveSentBihuInfo(map);
		} catch (Exception e){
			logger.info("新增访问次数时出错："+e);
		}
	}
	
	/**
	 * 处理从壁虎获取的续险信息
	 * @param json
	 * @param customer
	 * @param insuranceComps
	 * @param cover
	 * @return
	 * @throws Exception
	 */
	public Map<String,Object> disposeJson(String json,Customer customer,List<InsuranceComp> insuranceComps) throws Exception{
		JSONObject jsonObject = JSONObject.fromObject(json);
		String businessStatus = jsonObject.getString("BusinessStatus");
		Map<String, Object> map = new HashMap<>();
		if(businessStatus.equals("1")){
			logger.info("返回数据："+json+" 潜客ID："+customer.getCustomerId()+" 店ID："+customer.getFourSStoreId());
			String userInfo = jsonObject.getString("UserInfo");
			String saveQuote = jsonObject.getString("SaveQuote");
			Map<String, Object> map1 = new HashMap<>();
			map1.put("customerId", customer.getCustomerId());
			map1.put("bxInfo", saveQuote);
			customerMapper.updateCustomerInfo(map1);//修改数据
			JSONObject jsonObj = JSONObject.fromObject(userInfo);
			JSONObject jsonObj1 = JSONObject.fromObject(saveQuote);
			JsonConfig config = new JsonConfig();
	        config.setJavaIdentifierTransformer(new JavaIdentifierTransformer() {

	            @Override
	            public String transformToJavaIdentifier(String str) {
	                char[] chars = str.toCharArray();
	                chars[0] = Character.toLowerCase(chars[0]);
	                return new String(chars);
	            }

	        });
	        config.setRootClass(BHCarInfoVo.class);
			BHCarInfoVo info = (BHCarInfoVo)JSONObject.toBean(jsonObj,config);
			config.setRootClass(BxFromBHInfoVo.class);
			BxFromBHInfoVo bxInfo = (BxFromBHInfoVo)JSONObject.toBean(jsonObj1,config);
			if(bxInfo.getSource()!=null&&bxInfo.getSource()>0){
				if(insuranceComps!=null&&insuranceComps.size()>0){
					for(int l=0;l<insuranceComps.size();l++){
						if(insuranceComps.get(l).getSource()!=null&&insuranceComps.get(l).getSource()==bxInfo.getSource()){
							if(!StringUtils.isEmpty(insuranceComps.get(l).getInsuranceCompName())){
								map.put("insuranceCompLY", insuranceComps.get(l).getInsuranceCompName());
								break;
							}
						}
					}
				}
			}
			if(!StringUtils.isEmpty(bxInfo.toStr())){
				map.put("bxInfo", saveQuote);
				map.put("insuranceTypeLY", bxInfo.toStr());
			}
			
			SimpleDateFormat sdft = new SimpleDateFormat("yyyy-MM-dd");
			if(!StringUtils.isEmpty(info.getForceExpireDate())){
				map.put("bhInsuranceEndDate", sdft.parse(info.getForceExpireDate()));
			}
			if(!StringUtils.isEmpty(info.getLicenseNo())&&info.getLicenseNo().matches("^[\\u4e00-\\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{4,5}$")){
				map.put("carLicenseNumber", info.getLicenseNo());
			}
			if(!StringUtils.isEmpty(info.getEngineNo())){
				map.put("engineNumber", info.getEngineNo());
			}
			
			if(!StringUtils.isEmpty(info.getBusinessExpireDate())){
				map.put("syxrqEnd", sdft.parse(info.getBusinessExpireDate()));
			}
			
			if(!StringUtils.isEmpty(info.getLicenseOwner())){
				map.put("carOwner", info.getLicenseOwner());
			}
			if(!StringUtils.isEmpty(info.getInsuredName())){
				map.put("insured", info.getInsuredName());
			}
			
			if(!StringUtils.isEmpty(info.getInsuredIdCard())){
				map.put("certificateNumber", info.getInsuredIdCard());
			}
			if(!StringUtils.isEmpty(info.carUsedTypeToString())){
				map.put("customerCharacter", info.carUsedTypeToString());
			}
			if(!StringUtils.isEmpty(info.getCarVin())){
				map.put("chejiahao", info.getCarVin());//因为前台新增页面刷新需要这个数据，而我又不需要修改这个数据，所以字段名搞成和数据库不一样
			}
			if(!StringUtils.isEmpty(info.getModleName())){
				map.put("modleName", info.getModleName());
			}
			if(!StringUtils.isEmpty(info.getRegisterDate())){
				map.put("registerDate", info.getRegisterDate());
			}
			map.put("customerId", customer.getCustomerId());
		}else{
			logger.info("错误原因："+json+" 错误潜客ID："+customer.getCustomerId()+" 错误店ID："+customer.getFourSStoreId());
		}
		return map;
	}
	
	/**
	 * 根据从壁虎获取的续险信息修改潜客信息
	 * @param map
	 * @param customer
	 * @return
	 * @throws Exception
	 */
	public boolean disposeUpdate(Map<String,Object> map,Customer customer) throws Exception{
		try {
			customerMapper.insertCustomerToBihu(customer);//保存修改前的数据
			customerMapper.updateCustomerInfo(map);//修改数据
			renewalingCustomerMapper.updateSelectiveByCustomerId(map);
			return true;
		} catch (Exception e){
			logger.info("新增或修改潜客出错："+e);
			return false;
		}
	}
	
	static Map<Integer,Object> mapKey = new HashMap<Integer,Object>();
	/**
	 * 获取custKey的数值
	 * @param storeId
	 * @return
	 */
	public Integer getKeyValue(Integer storeId){
		String value = (String) mapKey.get(storeId);
		Integer zhi = 0;
		if(value==null){
			mapKey.put(storeId, "100"+","+"1");
			zhi = 100;
		}else{
			zhi = Integer.parseInt(value.split(",")[0]);
			Integer num = Integer.parseInt(value.split(",")[1]);
			if(num<5){
				num++;
			}else{
				zhi++;
				num = 1;
			}
			if(zhi>599){
				zhi = 100;
				num = 1;
			}
			mapKey.put(storeId, zhi+","+num);
		}
		return zhi;
	}
	
	/**
	 * 
	 
	static Map<Integer,Object> map1 = new HashMap<Integer,Object>();
	static Map<Integer,Object> map2 = new HashMap<Integer,Object>();
	static Map<Integer,Object> map3 = new HashMap<Integer,Object>();
	
	public Integer getValue(String storeId,Integer num){
		Integer value = -2;
		if(num == 2){
			updateCustKey2(storeId);
		}
		if(num == 3){
			updateCustKey3(storeId);
		}
		if(num == 0){
			value = getCustKeyNum(storeId);
		}
		return value;
	}
	
	public void updateCustKey2(String storeIds){
		if(storeIds!=null&&storeIds.length()>0){
			String[] storeIdNums = storeIds.split(",");
			for(int j=0;j<storeIdNums.length;j++){
				Integer storeId = Integer.parseInt(storeIdNums[j]);
				long nowTime = new Date().getTime();
				String b = (String) map2.get(storeId);
				if(b!=null&&b.length()>0){
					String[] b1 = b.split(",");
					if(b1!=null&&b1.length>0){
						for(int i=0;i<b1.length;i++){
							if(b1[i].length()>0){
								long time = Long.parseLong(b1[i].split("-")[1]);
								if(nowTime-time>=1000*60*60){
									b = b.replace(b1[i]+",", "");
								}else{
									break;
								}
							}
						}
						map2.put(storeId, b);
					}
				}
			}
		}
	}
	
	public void updateCustKey3(String storeIds){
		if(storeIds!=null&&storeIds.length()>0){
			String[] storeIdNums = storeIds.split(",");
			for(int j=0;j<storeIdNums.length;j++){
				Integer storeId = Integer.parseInt(storeIdNums[j]);
				long nowTime = new Date().getTime();
				String c = (String) map3.get(storeId);
				if(c!=null&&c.length()>0){
					String[] c1 = c.split(",");
					if(c1!=null&&c1.length>0){
						for(int i=0;i<c1.length;i++){
							if(c1[i].length()>0){
								long time = Long.parseLong(c1[i].split("-")[1]);
								if(nowTime-time>=1000*60){
									c = c.replace(c1[i]+",", "");
								}else{
									break;
								}
							}
						}
						map3.put(storeId, c);
					}
				}
			}
		}
	}
	
	public int getCustKeyNum(String storeIds){
		Integer storeId = Integer.parseInt(storeIds);
		String a = (String) map1.get(storeId);
		int zhi = -1;
		if(a==null){
			long nowTime = new Date().getTime();
			map1.put(storeId, "0"+"-"+nowTime+",");
			map2.put(storeId, "0"+"-"+nowTime+",");
			map3.put(storeId, "0"+"-"+nowTime+",");
			zhi = 0;
		}else{
			String b = (String) map2.get(storeId);
			String c = (String) map3.get(storeId);
			String[] a1 = a.split(",");
			String[] b1 = b.split(",");
			String[] c1 = c.split(",");
			int k = 0;
			for(int i=0;i<599;i++){
				if(a1.length>=18000){
					break;
				}
				for(int j=0;j<a1.length;j++){
					if(a1[j].split("-")[0].equals(i+"")){
						k++;
					}
				}
				if(k<30){
					if(b1.length>=600){
						break;
					}
					k = 0;
					for(int j=0;j<b1.length;j++){
						if(b1[j].split("-")[0].equals(i+"")){
							k++;
						}
					}
					if(k<10){
						if(c1.length>=100){
							break;
						}
						k = 0;
						for(int j=0;j<c1.length;j++){
							if(c1[j].split("-")[0].equals(i+"")){
								k++;
							}
						}
						if(k<5){
							zhi = i;
							break;
						}
					}
				}
			}
			if(zhi>-1){
				long nowTime = new Date().getTime();
				a = a+zhi+"-"+nowTime+",";
				b = b+zhi+"-"+nowTime+",";
				c = c+zhi+"-"+nowTime+",";
				map1.put(storeId, a);
				map2.put(storeId, b);
				map3.put(storeId, c);
			}
		}
		return zhi;
	}
	
	public String getRandom(Integer storeId){
		Integer num = getCustKeyNum(storeId.toString());
		if(num<0){
			try {
				Thread.sleep(5000);
				getRandom(storeId);
			} catch (InterruptedException e) {
				logger.info("方法getRandom睡眠出错！"+e);
			}
		}
		return "random" + num;
	}
	*/
}
