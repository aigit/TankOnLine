package com.zaq.websocket;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.annotations.Expose;

public class Message {
	public static final int W=0;
	public static final int D=1;
	public static final int S=2;
	public static final int A=3;
	public static final int KILL=4;
	public static final int SHOT=5;
	public static final int LOGIN=6;
	public static final int LOGOUT=7;
	public static final int TALK=8;
	public static final int ERROR=9;
	public static final int READLY=10;
	public static final int RELEASE=11;
	public static final int START=12;
	public static final int PLAYERSTATUS=13;
	public static final int CLEARWDSA=14;
	@Expose
	private int a;//action : 0(w),1(d),2(s),3(a) 4(kill) 5(SHOT)   6(login) 7(logout) 8(talk)
	@Expose
	private String m;//msg
	@Expose
	private String p;//palyer
	
	public Message(){}
	public Message(int a){
		this.a=a;
	}
	
	public int getA() {
		return a;
	}
	public void setA(int a) {
		this.a = a;
	}
	public String getM() {
		return m;
	}
	public void setM(String m) {
		this.m = m;
	}
	public String getP() {
		return p;
	}
	public void setP(String p) {
		this.p = p;
	}
	@Override
	public String toString() {
		Gson gson=new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();
		return gson.toJson(this);
	}
	
	
}
