package com.bofide.bip.service;

import java.util.ResourceBundle;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.stereotype.Service;


@Service(value="bHLoopRealizeService")
public class BHLoopRealizeService implements InitializingBean{
	private static Logger logger = Logger.getLogger(BHLoopRealizeService.class);

	@Resource(name="updateCustomerFromBHService")
	private UpdateCustomerFromBHService updateCustomerFromBHService;
	
	@Override
	public void afterPropertiesSet() throws Exception {
		String start = ResourceBundle.getBundle("bofideTobihuConfig").getString("start");//获取开关
		if(start.equals("yes")){
			ExecutorService cachedThreadPool = Executors.newCachedThreadPool();//创建线程池
			cachedThreadPool.execute(new Runnable() {
    		    public void run() {
    		    	try {
    		    		updateCustomerFromBHService.xunhuan(cachedThreadPool);//进入循环
					} catch (Exception e) {
						logger.info("**************壁虎循环出错，bHLoopRealizeService**************"+e);
					}
    		    } 
    		});
		}else{
			logger.info("**************BH自动更新没有开启！**************");
		}
	}
}
