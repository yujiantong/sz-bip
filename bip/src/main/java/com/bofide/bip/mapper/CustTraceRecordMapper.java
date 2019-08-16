package com.bofide.bip.mapper;

import java.util.List;

import com.bofide.bip.po.CustTraceRecodeVO;

public interface CustTraceRecordMapper {
	
	List<CustTraceRecodeVO> selectRecordsByCustId(Integer customerId);

}
