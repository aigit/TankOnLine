//我的坦克 hero
var heroTank;
//定义子弹数组
var heroBullets;
//定义敌人的坦克
var enemyTanks;
//其它玩家的坦克
var playerTanks;
//定义敌人子弹的数组
var enemyBullets;
//坦克子弹发射Id
var heroBulletSeqId=0;
//电脑敌人数量
var enemyCount=14;//不知为何敌人坦克移动位置差距随着时间推移会越来越大？
var heroColor=new Array("#BA9618","#FEF21E");
var enmeyColor=new Array("#11A2B5","#11FEFE");
var playerColor=new Array("#22b215","#33F3FE");
var enemyTankRunStep=new Array(1,2,3,4,2,4,2,1,2,4,2,3,1,4,2,1,3,4,4,565,5,34,2,21,1,7,99);//电脑坦克移动步骤
var nowStep=0;
//按Id和名称获取坦克
function getTank(tId,tName){
	if(tName=="enemy"){
		for(o in enemyTanks){
			if(tId==enemyTanks[o].id){
				return enemyTanks[o];
			}
		}
	}else{
		for(o in playerTanks){
			if(tId==playerTanks[o].id){
				return playerTanks[o];
			}
		}
	}
	return null;
};
//按Id和名称获取子弹
function getBullet(bId,bName){
	if(bName==mePlay){
		for(o in heroBullets){
			if(heroBullets[o]==null){
				continue;
			}
			if(bId==heroBullets[o].seqId){
				return heroBullets[o];
			}
		}
	}else{
		for(o in enemyBullets){
			if(bId==enemyBullets[o].seqId&&bName==enemyBullets[o].type){
				return enemyBullets[o];
			}
		}
	}
	return null;
};
//这是一个Tank类
function Tank(x,y,direct,color){
		this.x=x;
		this.y=y;
		this.speed=2;
		this.isLive=true;
		this.direct=direct;
		//一个坦克，需要两个颜色.
		this.color=color;
		//上移
		this.moveUp=function(){
			if(this.y>0){
				this.y-=this.speed;
			}
//			this.y-=this.speed;
			this.direct=0;
		};
		//向右
		this.moveRight=function(){
			if(this.x+30<800){
				this.x+=this.speed;
			}
//			this.x+=this.speed;
			this.direct=1;
		};

		//下移
		this.moveDown=function(){
			if(this.y+30<500){
				this.y+=this.speed;
			}
//			this.y+=this.speed;
			this.direct=2;
		};
		//左
		this.moveLeft=function(){
			if(this.x>0){
				this.x-=this.speed;
			}
//			this.x-=this.speed;
			this.direct=3;
		};
		//坦克死亡事件
		this.dead=function(){
			this.isLive=false;
		};
		this.shot=function(seqId){
			switch(this.direct){
				case 0:
				heroBullet=new Bullet(this.x+9,this.y,this.direct,5.5,this.name,this,seqId);
				break;
				case 1:
				heroBullet=new Bullet(this.x+30,this.y+9,this.direct,5.5,this.name,this,seqId);
				break;
				case 2:
				heroBullet=new Bullet(this.x+9,this.y+30,this.direct,5.5,this.name,this,seqId);
				break;
				case 3: //右
				heroBullet=new Bullet(this.x,this.y+9,this.direct,5.5,this.name,this,seqId);
				break;
			}

			//把这个子弹对象放入到数组中	 -> push函数
			enemyBullets.push(heroBullet);
			//启动方式，每个子弹的定时器是独立,如果按原来的方法
			//则所有子弹共享一个定时器.
			var timer=window.setInterval("enemyBullets["+(enemyBullets.length-1)+"].run()",hz);
			//把这个timer赋给这个子弹(js对象是引用传递!)
			enemyBullets[enemyBullets.length-1].timer=timer;

		};
}

//定义一个Hero类
	//x 表示坦克的 横坐标, y 表示纵坐标, direct 方向	
	function Hero(x,y,direct,color,name,id){
	
		//下面两句话的作用是通过对象冒充，达到继承的效果
		this.tank=Tank;
		this.tank(x,y,direct,color);
		this.speed=3;
		this.name=name;
		this.id=id;
		this.moveTimer=null;
		//增加一个函数，射击敌人坦克.
		this.shotEnemy=function(){
			//创建子弹, 子弹的位置应该和hero有关系，并且和hero的方向有关.!!!
			//this.x 就是当前hero的横坐标,这里我们简单的处理(细化)
			var arrayId=Game.getBulletArrayId();
			console.log("下标："+arrayId);
//			if(arrayId==-1){
//				document.getElementById("chatlog").textContent +="提示:子弹打完了，请稍等！" + "\n";
//				return ;
//			}
			switch(this.direct){
				case 0:
				heroBullet=new Bullet(this.x+9,this.y,this.direct,5.5,this.name,this,heroBulletSeqId++);
				break;
				case 1:
				heroBullet=new Bullet(this.x+30,this.y+9,this.direct,5.5,this.name,this,heroBulletSeqId++);
				break;
				case 2:
				heroBullet=new Bullet(this.x+9,this.y+30,this.direct,5.5,this.name,this,heroBulletSeqId++);
				break;
				case 3: //右
				heroBullet=new Bullet(this.x,this.y+9,this.direct,5.5,this.name,this,heroBulletSeqId++);
				break;
			}

			//把这个子弹对象放入到数组中	 -> push函数
			heroBullets[arrayId]=heroBullet;
			//启动方式，每个子弹的定时器是独立,如果按原来的方法
			//则所有子弹共享一个定时器.
			var timer=window.setInterval("heroBullets["+(arrayId)+"].run()",hz);
			//把这个timer赋给这个子弹(js对象是引用传递!)
			heroBullets[arrayId].timer=timer;

		};

	}

	//定义一个EnemyTank类
	function EnemyTank (x,y,direct,color,name,id){
		this.name=name;
		//也通过对象冒充，来继承Tank
		this.tank=Tank;
		this.count=0;
		this.bulletIsLive=true;
		
		this.tank(x,y,direct,color);
		this.timer=null;
		this.id=id;
		this.run=function run(){
			
			//判断敌人的坦克当前方向
			switch(this.direct){
				
				case 0:
					if(this.y>0){
						this.y-=this.speed;
					}	
					break;
				case 1:
					if(this.x+30<800){
						this.x+=this.speed;
					}
					break;
				case 2:
					if(this.y+30<500){
						this.y+=this.speed;
					}
					break;
				case 3:
					if(this.x>0){
						this.x-=this.speed;
					}
					break;
			}
			//改变方向,走30次，再改变方向
			if(this.count>30){
				this.direct=((enemyTankRunStep[(nowStep++)%(enemyTankRunStep.length)])+this.direct)%4;//随机生成 0,1,2,3
				this.count=0;
			}
			this.count++;

			//判断子弹是否已经死亡，如果死亡，则增加新的一颗子弹
			if(this.bulletIsLive==false){
				if(this.isLive){
					//增子弹,这是需要考虑当前这个敌人坦克的方向，在增加子弹
					switch(this.direct){
							case 0:
							etBullet=new Bullet(this.x+9,this.y,this.direct,5,"enemy",this,this.id);
							break;
							case 1:
							etBullet=new Bullet(this.x+30,this.y+9,this.direct,5,"enemy",this,this.id);
							break;
							case 2:
							etBullet=new Bullet(this.x+9,this.y+30,this.direct,5,"enemy",this,this.id);
							break;
							case 3: //右
							etBullet=new Bullet(this.x,this.y+9,this.direct,5,"enemy",this,this.id);
							break;
					}
					//把子弹添加到敌人子弹数组中
					enemyBullets.push(etBullet);
					//启动新子弹run
					this.timer=window.setInterval("enemyBullets["+(enemyBullets.length-1)+"].run()",hz);
					enemyBullets[enemyBullets.length-1].timer=this.timer;

					this.bulletIsLive=true;
				}else{//子弹和坦克都死亡则取消发子弹的定时器
					window.clearInterval(this.timer);
				}
			}

		};
	}
