var Kill;     
if(!Kill) Kill = function(tId,tName,bId,bName){
	this.t=tId;
	this.tn=tName;
	this.b=bId;
	this.bn=bName;
	this.send=function(){
		var msg=JSON.stringify(this);
		var message=new Message(Message.KILL,msg);
		WS.sendMessage(message);
	};
};

//坦克死亡
Kill.dead=function(killJsonObj){
	var tId=killJsonObj.t;
	var tName=killJsonObj.tn;
	var bId=killJsonObj.b;
	var bName=killJsonObj.bn;
	
	var tank=getTank(tId,tName);
	var bullet=getBullet(bId,bName);
	if(tName==mePlay){
		isLive=false;
		Message.showMsg('提示：你中弹了，挂了。。。。');
		document.getElementById("aa").innerText="你中弹了，GAME  OVER。。。。";
	}
	if(null!=tank){
		tank.dead();
		//创建一颗炸弹
		var bomb=new Bomb(tank.x,tank.y,tName==mePlay);
		//然后把该炸弹放入到bombs数组中
		bombs.push(bomb);
	}
	if(null!=bullet){
		bullet.dead();;
	}
	
};