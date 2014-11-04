package com.zaq.tank;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.websocket.Session;

/**
 * 玩家用户池
 * @author 作者：章英杰
 * @link	联系方式：382566697@qq.com
 * @date    2014年11月4日
 *
 */
public class PlayerPool {
	private static Map<Session, Player> palyerMap=new HashMap<Session, Player>();

	public static Map<Session, Player> getPalyerMap() {
		return palyerMap;
	}
	public static List<Player> getAllPlayer(Integer status){
		List<Player> players=new ArrayList<Player>();
		Player player=null;
		for(Session session:palyerMap.keySet()){
			player=palyerMap.get(session);
			if(player.getStatus().intValue()==status.intValue()){
				players.add(player);
			}
		}
		return players;
	}
	/**
	 * 获取所有在线用户
	 * @return
	 */
	public static List<Player> getAllPlayer(){
		List<Player> players=new ArrayList<Player>();
		for(Session session:palyerMap.keySet()){
			players.add(palyerMap.get(session));
		}
		return players;
	}
	/**
	 * 判断用户名是否重复
	 * @param name
	 * @return
	 */
	public static boolean hasPlayer(String name){
		boolean retVal=false;
		Player player=null;
		for(Session session:palyerMap.keySet()){
			player = palyerMap.get(session);
			if(name.equals(player.getName())){
				retVal=true;
				break;
			}
		}
		
		return retVal;
	}
}
