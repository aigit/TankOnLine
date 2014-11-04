package com.zaq.websocket;
import javax.websocket.DecodeException;
import javax.websocket.Decoder;
import javax.websocket.EndpointConfig;

import org.apache.commons.lang.StringUtils;

import com.google.gson.Gson;
public class MessageDecoder implements Decoder.Text<Message>{
	@Override
	public void destroy() {
		System.out.println("MessageDecoder - destroy method called");
	}
	@Override
	public void init(EndpointConfig arg0) {
		System.out.println("MessageDecoder -init method called");
	}
	@Override
	public Message decode(String jsonMessage) throws DecodeException {
		Gson gson=new Gson();
		return gson.fromJson(jsonMessage, Message.class);
	}
	@Override
	public boolean willDecode(String jsonMessage) {
		System.out.println("接收到："+jsonMessage);
		/** check if incoming message is valid json */
		try{
			if(StringUtils.isEmpty(jsonMessage)||!jsonMessage.startsWith("{")){
				return false;
			}
			return true;
		}catch(Exception e){
			System.out.println(e.getMessage());
			return false;
		}
	}
}
