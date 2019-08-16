package com.bofide.common.util;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import java.text.SimpleDateFormat;
import java.util.Date;

public class JsonDateDeserializerUtil extends JsonDeserializer<Date> {

	@Override
	public Date deserialize(JsonParser jp, DeserializationContext ctxt){
		try {
			SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			String date = jp.getText();
			return format.parse(date);
		} catch (Exception e) {
//			throw new RuntimeException(e);
		}
		return null;
	}

}