var WS;     
if(!WS) WS ={};
/**
 * 生成一个随机数范围在start，end
 * @param {} start 
 * @param {} end
 * @return {}
 */
WS.random= function(start, end) {
	return Math.round(Math.random() * (end - start) + start);
};
//是否联网
var isNet=false;
//给自己取个名字
var mePlay="";
//自己的等级
var meLevle=1;
//是否活着
var isLive=false;
//var ws = new WebSocket("ws://172.16.62.64:8280/TankOnLine/websocket");
var ws = new WebSocket("ws://"+__hostApp+"/websocket");
//建立连接成功事件
ws.onopen = function(){
	WS.login();
	isNet=true;
};
//接收事件
ws.onmessage = function(messageJsonStr){
	console.log(messageJsonStr.data);
	var resJson=JSON.parse(messageJsonStr.data);
	var player=resJson.p;
	var msg=resJson.m;
	switch(resJson.a){
		case Message.LOGIN:
			Message.showMsg(player+":加入了游戏" + "\n");
			$('#releaseList').append('<span id="player'+player+'">&nbsp&nbsp'+player+'(LV-'+msg+')</span>');
			if(player==mePlay){
				meLevle=msg;
			}
			break;
		case Message.LOGOUT:
			Message.showMsg(player+":退出了游戏" + "\n");
			$('#player'+player+'').remove();
			break;	
		case Message.ERROR:
			 alert(resJson.m);
			 if("昵称不能为空"==msg||"昵称重复"==msg){
			 	 $.cookie("mePlay","",{path:'/'});
				 WS.login();
			 }
			break;
		case Message.SHOT:
			if(player==mePlay){
				heroTank.shotEnemy();
			}else{
				var playerTank=Game.getHero(player);	
				var postion=msg.split(',');
				playerTank.x=Number(postion[0]);
				playerTank.y=Number(postion[1]);
				playerTank.direct=Number(postion[2]);
				playerTank.shot(msg);
			}
			break;
		case Message.KILL:
			var killJsonObj= JSON.parse(msg);
			Kill.dead(killJsonObj);
			break;	
		case Message.W:
		case Message.D:
		case Message.S:
		case Message.A:
			var hero=Game.getHero(player);	
			window.clearInterval(hero.moveTimer);
			var postion=msg.split(',');
			hero.x=Number(postion[0]);
			hero.y=Number(postion[1]);
			if(resJson.a==Message.W){
				hero.moveTimer=window.setInterval("playerTanks["+hero.id+"].moveUp()",hz);
			}else if(resJson.a==Message.D){
				hero.moveTimer=window.setInterval("playerTanks["+hero.id+"].moveRight()",hz);
			}else if(resJson.a==Message.S){
				hero.moveTimer=window.setInterval("playerTanks["+hero.id+"].moveDown()",hz);
			}else if(resJson.a==Message.A){
				hero.moveTimer=window.setInterval("playerTanks["+hero.id+"].moveLeft()",hz);
			}
			break;	
		case Message.CLEARWDSA:
			var hero=Game.getHero(player);	
			window.clearInterval(hero.moveTimer);
			break;	
		case Message.TALK:
			Message.showMsg(player+":"+ msg+ "\n");
			break;	
		case Message.READLY:
		case Message.RELEASE:
			var msgJsonObj= JSON.parse(msg);
			var m=msgJsonObj.m;
			var l=msgJsonObj.l;
			Message.showMsg(player+":"+ m + "\n");
			$('#player'+player+'').remove();
			if(resJson.a==Message.READLY){
				$('#readlyList').append('<span id="player'+player+'">&nbsp&nbsp'+player+'(LV-'+l+')</span>');
			}else{
				$('#releaseList').append('<span id="player'+player+'">&nbsp&nbsp'+player+'(LV-'+l+')</span>');
			}
			
			break;	
		case Message.START:
			$('#gameingList').append($('#readlyList').html());
			$('#readlyList').empty();
			var mp=JSON.parse(msg);
			Message.showMsg("系统提示:"+ mp.m + "\n");
			randomDirect=mp.r;
			gameStart(JSON.parse(mp.p));
			break;		
		case Message.PLAYERSTATUS:	
			if(msg==""||msg==null||msg=='undefined'){//新的其它玩家的游戏开始了
				$('#gameingList').append($('#readlyList').html());
				$('#readlyList').empty();
				return;
			}
			var players= JSON.parse(msg);
			for(var o in players){  
				if(players[o].name==mePlay){
					continue;
				}
				switch(players[o].status){
					case Player.RELEASE:
						$('#releaseList').append('<span id="player'+players[o].name+'">&nbsp&nbsp'+players[o].name+'(LV-'+players[o].level+')</span>');
					break;
					case Player.READLY:
						$('#readlyList').append('<span id="player'+players[o].name+'">&nbsp&nbsp'+players[o].name+'(LV-'+players[o].level+')</span>');
					break;
					case Player.GAMEING:
						$('#gameingList').append('<span id="player'+players[o].name+'">&nbsp&nbsp'+players[o].name+'(LV-'+players[o].level+')</span>');
					break;
				}
			}
			break;	
	}
	
	
};
/**
 * 登陆
 */
WS.login=function(){
	mePlay=$.cookie("mePlay") ; 
	if(""==mePlay||null==mePlay||'null'==mePlay){  
   	 	mePlay=window.prompt("给个用户名就可以玩了", "路人-"+WS.random(1,1000));
   	 	$.cookie("mePlay",mePlay, { path: '/', expires: 10 }) ;
    } 
	WS.sendMessage(new Message(Message.LOGIN,mePlay));
};

//发送消息
WS.sendMessage=function(messageJsonObj){
	ws.send(JSON.stringify(messageJsonObj));
};
//关闭连接
WS.closeConnect=function(){
	ws.close();
};
//发送聊天消息
WS.postToServer=function(){
	var talkMsg=document.getElementById("msg").value;
	if(talkMsg==''){
		return;
	}
	var message=new Message(Message.TALK,talkMsg);
	WS.sendMessage(message);
	
	document.getElementById("msg").value="";
};

