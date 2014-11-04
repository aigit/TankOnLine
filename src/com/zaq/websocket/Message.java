package com.zaq.websocket;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.annotations.Expose;
/**
 * 指令集
 * @author 作者：章英杰
 * @link	联系方式：382566697@qq.com
 * @date    2014年11月4日
 *
 */
public class Message {
	public static final int W=0;//上
	public static final int D=1;//右
	public static final int S=2;//下
	public static final int A=3;//左
	public static final int KILL=4;//死亡
	public static final int SHOT=5;//打炮
	public static final int LOGIN=6;//登陆
	public static final int LOGOUT=7;//登出
	public static final int TALK=8;//聊天
	public static final int ERROR=9;//错误提示
	public static final int READLY=10;//准备
	public static final int RELEASE=11;//空闲
	public static final int START=12;//开始游戏
	public static final int PLAYERSTATUS=13;//玩家状态
	public static final int CLEARWDSA=14;//停止移动
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
