package com.zaq.websocket;
import java.io.IOException;
import java.lang.reflect.Type;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import javax.websocket.CloseReason;
import javax.websocket.EncodeException;
import javax.websocket.EndpointConfig;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

import org.apache.commons.lang.StringUtils;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import com.zaq.tank.Player;
import com.zaq.tank.PlayerPool;
/**
 * 
 * @author 作者：章英杰

 * @link	联系方式：382566697@qq.com
 * @date    2014年11月4日
 *
 */
@ServerEndpoint(value="/websocket",encoders={MessageEncoder.class},decoders={MessageDecoder.class})
public class WebSocketListener {
	private Map<Session, Player> playerPool=PlayerPool.getPalyerMap();
	private static final String ADMIN="zaqzaq";
	@OnMessage
	public void onMessage(Message message, Session session) throws IOException, EncodeException {
		System.out.println("onMessage::"+message.toString());
		
		Player player=(Player) session.getUserProperties().get("player");
		if(null!=player){
			message.setP(player.getName());//设置消息发送人
		}
		//后期如果指令太多，可以考滤使用责任链模式
		switch(message.getA()){
			case Message.LOGIN:
				//do palyer login
				String play=message.getM();//简单的用户信息
				
				if(StringUtils.isEmpty(play)){
					message=new Message();
					message.setA(Message.ERROR);
					message.setM("昵称不能为空");
//					session.getBasicRemote().sendObject(message);
					send(session, message);
					return;
				}
				if(PlayerPool.hasPlayer(play)){
					message=new Message();
					message.setA(Message.ERROR);
					message.setM("昵称重复");
//					session.getBasicRemote().sendObject(message);
					send(session, message);
					return;
				}
				
				player=new Player(play, session);
				if(play.equals(ADMIN)){
					player.setLevel((short)8);
				}
				session.getUserProperties().put("player", player);
				playerPool.put(session,player);
				//向在线用户发送新用户加入的信息
				message.setP(play);
				message.setM(player.getLevel().toString());
				sendAll(message);
				//向新用户发送目前用户池的情况
				sendPlayerStatus(session);
				break;
			case Message.LOGOUT:
				playerPool.remove(session);
				break;
			case Message.W:
			case Message.D:
			case Message.S:
			case Message.A:
			case Message.SHOT:
			case Message.CLEARWDSA:
			case Message.TALK:
			case Message.KILL:
				//向在线所有用户转发该信息
				if(null!=player){
					message.setP(player.getName());
					sendAll(message);
				}else{
					session.close();
					playerPool.remove(session);
				}
				
				break;
			case Message.READLY:
			case Message.RELEASE:
				player.setStatus(message.getA()==Message.READLY?Player.READLY:Player.RELEASE);
				Map<String, Object> map=new HashMap<String, Object>();
				map.put("m", message.getM());
				map.put("l", player.getLevel().toString());
				Gson gson=new Gson();
				message.setM(gson.toJson(map));
				sendAll(message);
				break;
			case Message.START:
				if(ADMIN.equals(player.getName())){
					player.setStatus(Player.READLY);
					message=new Message();
					
					message.setA(Message.START);
					List<Player> players=PlayerPool.getAllPlayer(Player.READLY);
					StringBuilder sbPlayerName=new StringBuilder();
					for(Player p:players){
						p.setStatus(Player.GAMEING);
						p.genXY();
						sbPlayerName.append(",【").append(p.getName()).append("】");
					}
					sbPlayerName.deleteCharAt(0);
					message.setM("玩家"+sbPlayerName.toString()+"----开始了游戏");
					Map<String, Object> map1=new HashMap<String, Object>();
					map1.put("m", message.getM());
					map1.put("r", new Random().nextInt(4));
					Gson gson2=new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();
					Type type=new TypeToken<List<Player>>(){}.getType();
					map1.put("p", gson2.toJson(players, type));
					Gson gson1=new Gson();
					message.setM(gson1.toJson(map1));
					
					//给准备好了的玩家发送开始的信息
					sendAll(message,players);
					
					//给未准备好和正在游戏中的玩家发送刚开局的玩家状态
					message=new Message(Message.PLAYERSTATUS);
					
					players=PlayerPool.getAllPlayer(Player.RELEASE);
					players.addAll(PlayerPool.getAllPlayer(Player.GAMEING));
					sendAll(message,players);
					
				}else{
					message=new Message();
					message.setA(Message.ERROR);
					message.setM("您无权开始");
//					session.getBasicRemote().sendObject(message);
					send(session, message);
				}
				
				break;	
		}
		
	}
	@OnOpen
	public void onOpen(Session session,EndpointConfig config) {
		System.out.println("Client connected::"+config.toString());
	}
	@OnClose
	public void onClose(Session session,CloseReason closeReason) {
		System.out.println("Connection closed::"+closeReason.toString());
		playerPool.remove(session);
		Player player=(Player) session.getUserProperties().get("player");
		Message message=new Message();
		message.setA(Message.LOGOUT);
		message.setP(player.getName());
		try {
			sendAll(message);
		} catch (Exception e){
			e.printStackTrace();
		}
	}
	
	@OnError
	public void onError(Session session,Throwable thr) {
		System.out.println("onError::"+thr.getMessage());
	}
	/**
	 * 给所有在线玩家发送消息
	 * @param message
	 * @throws IOException
	 * @throws EncodeException
	 */
	public void sendAll(Message message) throws IOException, EncodeException{
		
		for(Session session:playerPool.keySet()){
//			session.getBasicRemote().sendObject(message);
			send(session, message);
		}
	}
	/**
	 * 给指定在线玩家发送消息
	 * @param message
	 * @param players
	 * @throws IOException
	 * @throws EncodeException
	 */
	public void sendAll(Message message,List<Player> players) throws IOException, EncodeException{
		
		for(Player player:players){
//			player.getSession().getBasicRemote().sendObject(message);
			send(player.getSession(), message);
		}
	}
	/**
	 * 发送玩家的信息
	 * @param session
	 * @throws IOException
	 * @throws EncodeException
	 */
	public void sendPlayerStatus(Session session) throws IOException, EncodeException{
		List<Player> players=PlayerPool.getAllPlayer();
		Gson gson=new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();
		
		Message message=new Message(Message.PLAYERSTATUS);
		Type type=new TypeToken<List<Player>>(){}.getType();
		message.setM(gson.toJson(players, type));
		
//		session.getBasicRemote().sendObject(message);
		send(session, message);
	}
	/**
	 * 发送消息总入口
	 * @param session
	 * @param message
	 * @throws IOException
	 * @throws EncodeException
	 */
	public void send(Session session,Message message) throws IOException, EncodeException{
		synchronized (session) {
		    if (session.isOpen()) {
		        session.getBasicRemote().sendObject(message);
		    }
		}
	}
}