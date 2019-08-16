package com.bofide.bip.mapper;

import java.util.Map;

public interface SentBihuInfoMapper {

	/**
	 * 保存调用壁虎接口信息
	 * @param param po SentBihuInfo的map参数
	 * @return 成功的条数
	 * @throws Exception
	 */
	int insertSentBihuInfo(Map<String,Object> param)throws Exception;

}
