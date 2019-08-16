package com.bofide.common.util;

import java.util.HashMap;
import java.util.Map;

public class BaseResponse {
	protected boolean success = false;
	protected String message = null;
	protected Map<String,Object> content = new HashMap<String,Object>();
	
	public BaseResponse(){
		
	}
	
	public BaseResponse(boolean success,String message,Map<String,Object> content){
		this.success = success;
		this.message = message;
		if(content!=null){
			this.content = content;
		}
	}

	public boolean isSuccess() {
		return success;
	}
	public void setSuccess(boolean success) {
		this.success = success;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public Map<String, Object> getContent() {
		return content;
	}
	public void setContent(Map<String, Object> content) {
		this.content = content;
	}
	public void addContent(String key,Object value){
		this.content.put(key, value);
	}
}
