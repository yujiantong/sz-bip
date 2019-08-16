package com.bofide.bip.po;

import java.util.Date;

public class SystemMessage {
	
	/**
     * id
     */
    private Integer sysMessageId;

    /**
     * 内容
     */
    private String content;
    
    /**
     * 消息时间
     */
    private Date messageDate;

    /**
     * 店Id
     * @return
     */
    private Integer fourStoreId;
	public Integer getSysMessageId() {
		return sysMessageId;
	}

	public void setSysMessageId(Integer sysMessageId) {
		this.sysMessageId = sysMessageId;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public Date getMessageDate() {
		return messageDate;
	}

	public void setMessageDate(Date messageDate) {
		this.messageDate = messageDate;
	}

	public Integer getFourStoreId() {
		return fourStoreId;
	}

	public void setFourStoreId(Integer fourStoreId) {
		this.fourStoreId = fourStoreId;
	}
    
    
}
