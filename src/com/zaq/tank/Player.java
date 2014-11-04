package com.zaq.tank;

import java.util.Random;

import javax.websocket.Session;

import com.google.gson.annotations.Expose;

public class Player {
	private static final Random random=new Random();
	public static final Integer READLY=0;
	public static final Integer GAMEING=1;
	public static final Integer RELEASE=2;
	@Expose
	private String name;
	private Session session;
	@Expose
	private Short level;
	@Expose
	private Integer status;
	@Expose
	private int x;
	@Expose
	private int y;
	
	public void genXY(){
		this.x=random.nextInt(750);
		this.y=random.nextInt(450);
	}
	
	public int getX() {
		return x;
	}

	public void setX(int x) {
		this.x = x;
	}

	public int getY() {
		return y;
	}

	public void setY(int y) {
		this.y = y;
	}

	public Player(String name, Session session) {
		super();
		this.name = name;
		this.session = session;
		this.level = 5;
		status=RELEASE;
	}
	
	public Integer getStatus() {
		return status;
	}

	public void setStatus(Integer status) {
		this.status = status;
	}

	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public Session getSession() {
		return session;
	}
	public void setSession(Session session) {
		this.session = session;
	}
	public Short getLevel() {
		return level;
	}
	public void setLevel(Short level) {
		this.level = level;
	}
	
}
