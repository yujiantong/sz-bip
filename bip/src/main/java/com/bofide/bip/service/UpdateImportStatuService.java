package com.bofide.bip.service;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.stereotype.Service;

import com.bofide.bip.mapper.StoreMapper;

@Service(value="updateImportStatuService")
public class UpdateImportStatuService implements InitializingBean {
	private static Logger logger = Logger.getLogger(UpdateImportStatuService.class);

	@Resource(name="storeMapper")
	private StoreMapper storeMapper;
	@Override
	public void afterPropertiesSet() throws Exception {
		logger.info("**************更改状态开始**************");
		Thread thread = new Thread(new Runnable() {
			@Override
			public void run() {
				try {
					storeMapper.updateStoreImportStatu();
				} catch (Exception e) {
					logger.error("初始化店导入状态失败", e);
				}
			}
		});
		thread.start();
		logger.info("**************更改状态结束**************");
	}

}
