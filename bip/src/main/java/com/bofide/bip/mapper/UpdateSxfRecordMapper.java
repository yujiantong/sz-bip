package com.bofide.bip.mapper;

import com.bofide.bip.po.UpdateSxfRecord;

public interface UpdateSxfRecordMapper {
	/**
	 * 新增手续费修改记录
	 * @param updateSxfRecord
	 * @return
	 * @throws Exception
	 */
	int insert(UpdateSxfRecord updateSxfRecord) throws Exception;
	
}
