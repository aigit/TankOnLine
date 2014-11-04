package com.zaq.tank;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.websocket.Session;

/**
 * 玩家用户池
 * @author zaqzaq
 * 2014年10月29日
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
	public static List<Player> getAllPlayer(){
		List<Player> players=new ArrayList<Player>();
		for(Session session:palyerMap.keySet()){
			players.add(palyerMap.get(session));
		}
		return players;
	}
	
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
