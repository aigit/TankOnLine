var Game;     
if(!Game) Game ={};
//准备
Game.readly=function(){
	isStart=false;
	WS.sendMessage(new Message(Message.READLY,"准备好了"));
};
//开始
Game.start=function(){
	isStart=false;
	WS.sendMessage(new Message(Message.START));
};
//生成子弹下标
Game.getBulletArrayId=function(){
	if(heroBullets.length<meLevle){
		return heroBullets.length;
	}
	for(o in heroBullets){
		if(null==heroBullets[o]){
			return o;
		}
	}
	return -1;
};
//找到坦克信息
Game.getHero=function(name){
	for(var i=0;i<playerTanks.length;i++){
		if(playerTanks[i].name==name){
			return playerTanks[i];
		}
	}
};
	var randomDirect;
	//得到画布
	var canvas1=document.getElementById("tankMap");
	//得到绘图上下文(你可以理解是画笔)
	var cxt=canvas1.getContext("2d");
	//定时器刷新频率
	var hz=50;
	//是否开始了游戏
	var isStart=false;
	//定义一个炸弹数组(可以存放很多炸弹,)
	var bombs;
	//计算刷新次数	
	var hasFlashCount=0;

	//专门写一个函数，用于定时刷新我们的作战区，把要在作战区出现的元素(自己坦克，敌人坦克，子弹，炸弹，
	//障碍物...)
	function flashTankMap(){
		hasFlashCount++;
		//把画布清理
		cxt.clearRect(0,0,800,500); 

		//我的坦克
		drawTank(heroTank);

		//画出自己的子弹
		//子弹飞效果是怎么出现的?[答 ： 首先我们应该每隔一定时间(setInterval)就去刷新作战区,如果在刷新的时候，子弹坐标变换了，给人的感觉就是子弹在飞!]
		drawHeroBullet();

		//判断一下敌人坦克是否击中
		isHitEnemyTank();
		//判断一下我的坦克是否被击中
		isHitMeTank();
		drawEnemyBomb();
		drawEnemyBullet();
		
		
		//画出所有敌人坦克
		for(var i=0;i<enemyTanks.length;i++){
			drawTank(enemyTanks[i]);
		}
		//画出玩家的坦克
		for(var i=0;i<playerTanks.length;i++){
			drawTank(playerTanks[i]);
		}
		
	}

	//当前按下的键
	var nowKeyDown;
	//移动定时器
	var moveTimer;
	//这是一个接受用户按键函数
	function getCommandDown(){
		//游戏没有开始或坦克挂掉了
		if(!isStart||!isLive){
			return;
		}
		//我怎么知道，玩家按下的是什么键
		//说明当按下键后 事件--->event对象----->事件处理函数()
		var code=event.keyCode;
		if(nowKeyDown==code&&code!=74){
			return;
		}else{
			nowKeyDown=code;
		}
		switch(code){
			case 87://上
				//hero.moveUp();
				if(!isNet){
					window.clearInterval(moveTimer);
					moveTimer=window.setInterval("heroTank.moveUp()",hz);
				}else{
					var message=new Message(Message.W,heroTank.x+","+heroTank.y);
					WS.sendMessage(message);
				}
				
			   break;
			case 68:
			  //hero.moveRight();
				if(!isNet){
			 		window.clearInterval(moveTimer);
			 	 	moveTimer=window.setInterval("heroTank.moveRight()",hz);
			 	}else{
					var message=new Message(Message.D,heroTank.x+","+heroTank.y);
					WS.sendMessage(message);
				}
			   break;
			 case 83:
				//hero.moveDown();
			 	if(!isNet){
					window.clearInterval(moveTimer);
					moveTimer=window.setInterval("hero.moveDown()",hz);
				}else{
					var message=new Message(Message.S,heroTank.x+","+heroTank.y);
					WS.sendMessage(message);
				}
				break;
			case 65:
				//hero.moveLeft();
				if(!isNet){
					window.clearInterval(moveTimer);
					moveTimer=window.setInterval("heroTank.moveLeft()",hz);
				}else{
					var message=new Message(Message.A,heroTank.x+","+heroTank.y);
					WS.sendMessage(message);
				}
				break;
			case 74:
				var arrayId=Game.getBulletArrayId();
				if(arrayId==-1){
					document.getElementById("chatlog").textContent +="提示:子弹打完了，请稍等！" + "\n";
					return ;
				}
				heroBulletSeqId++;
				if(!isNet){
					heroTank.shotEnemy();
				}else{
					var message=new Message(Message.SHOT,heroTank.x+","+heroTank.y+","+heroTank.direct);
					WS.sendMessage(message,heroBulletSeqId);
				}
				break;
		}
		
		//触发这个函数 flashTankMap();
		flashTankMap();

		//重新绘制所有的敌人的坦克.你可以在这里写代码(思想,我们干脆些一个函数，专门用于定时刷新我们的画布[作战区])
	}
	/*用户输入完毕
	*/
	function getCommandUp(){
		var code=event.keyCode;//对应字母的ascii码->我们看码表
		//清空当前按键
		switch(code){
			case 87://上
			case 68:
			case 83:
			case 65:
				//停止移动
				nowKeyDown=null;
				if(!isNet){
					window.clearInterval(moveTimer);
				}else{
					if(!isStart||!isLive){
						return;
					}
					var message=new Message(Message.CLEARWDSA);
					WS.sendMessage(message);
				}
				break;
			case 13:
				WS.postToServer();
				break;	
		}
		
	}
		
	function gameStart(playerJsonObj){
		isLive=true;
		heroBulletSeqId=0;
		playerTanks=new Array();
		for(o in playerJsonObj){
			
			var tank;
			if(playerJsonObj[o].name==mePlay){
				tank=new Hero(playerJsonObj[o].x,playerJsonObj[o].y,0,heroColor,playerJsonObj[o].name,o);
				heroTank=tank;
			}else{
				tank=new Hero(playerJsonObj[o].x,playerJsonObj[o].y,0,playerColor,playerJsonObj[o].name,o);
			}
			
			playerTanks[o]=tank;
		}
		
		
	//定义子弹数组
		heroBullets=new Array();

	//定义敌人的坦克
		enemyTanks=new Array();

	//定义敌人子弹的数组

		enemyBullets=new Array();
	

	//定义一个炸弹数组(可以存放很多炸弹,)
	
		bombs=new Array();
		//先死后活 ，定3个，后面我们把敌人坦克的数量，作出变量
		//0->上, 1->右, 2->下 3->左
		for(var i=0;i<enemyCount;i++){
			var direct=(randomDirect+i)%4;
			//创建一个坦克
			var enemyTank=new EnemyTank((i+1)*50,200,direct,enmeyColor,'enemy',i);
			//把这个坦克放入数组
			enemyTanks[i]=enemyTank;
	
			//启动这个敌人的坦克
			window.setInterval("enemyTanks["+i+"].run()",hz);
	
			//当创建敌人坦克时就分配子弹
			var eb=new Bullet(enemyTanks[i].x+9,enemyTanks[i].y+30,direct,5,"enemy",enemyTanks[i]);
	
			enemyBullets[i]=eb;
			//启动该子弹
			var ettimer=window.setInterval("enemyBullets["+i+"].run()",hz);
			enemyBullets[i].timer=ettimer;
			
		}
		//先调用一次
		flashTankMap();
		isStart=true;
		//计算刷新次数	
		hasFlashCount=0;
		
		//每隔100毫秒去刷新一次作战区
		window.setInterval("flashTankMap()",100);
	}
