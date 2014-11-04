package com.zaq.websocket;
import javax.websocket.EncodeException;
import javax.websocket.Encoder;
import javax.websocket.EndpointConfig;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
public class MessageEncoder implements Encoder.Text<Message>{
	@Override
	public void destroy() {
		System.out.println("MessageEncoder - destroy method called");
	}
	@Override
	public void init(EndpointConfig arg0) {
		System.out.println("MessageEncoder - init method called");		
	}
	@Override
	public String encode(Message message) throws EncodeException {
		Gson gson=new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();
		return gson.toJson(message);
	}
}
