//其它的敌人坦克，这里的扩展性，还是不错的.
//定义一个炸弹类
function Bomb(x,y,isMePlayer){
	this.x=x;
	this.y=y;
	this.isLive=true; //炸弹是否活的，默认true;
	//炸弹有一个生命值
	this.blood=9;
	//减生命值
	this.bloodDown=function(){
		if(this.blood>0){
			this.blood--;
		}else{
			//说明炸弹死亡
			this.isLive=false;
		}
	};
	countBomb(isMePlayer);
}

function countBomb(isMePlayer){
	if(isMePlayer){
		return;
	}
	enemyCount--;
	
	if(enemyCount==0){
		document.getElementById("aa").innerText="敌人全部被消灭了，用时："+(hasFlashCount*100/1000)+"秒,浪费子弹："+heroBulletSeqId+"棵";
		WS.sendMessage(new Message(Message.RELEASE,"敌人全部被消灭了，用时："+(hasFlashCount*100/1000)+"秒,浪费子弹："+heroBulletSeqId+"棵"));
	}else if(enemyCount>0){
		document.getElementById("aa").innerText="还有"+enemyCount+"个坏蛋";
	}
}

//子弹类
//type表示：这颗子弹是敌人的，还是自己的
//tank表示对象，说明这颗子弹，属于哪个坦克.
function Bullet(x,y,direct,speed,type,tank,seqId){
	this.x=x;
	this.y=y;
	this.direct=direct;
	this.speed=speed;
	this.timer=null;
	this.isLive=true;
	this.type=type;
	this.tank=tank;
	this.seqId=seqId;
	this.run=function run(){
		
			//在该表这个子弹的坐标时，我们先判断子弹是否已经到边界
			//子弹不前进，有两个逻辑，1.碰到边界，2. 碰到敌人坦克.
			if(this.x<=0||this.x>=800||this.y<=0||this.y>=500||this.isLive==false){
				//子弹要停止.
//				window.clearInterval(this.timer);
//				//子弹死亡
//				this.isLive=false;
				this.dead();
			}else{
				//这个可以去修改坐标
				switch(this.direct){
					case 0:
							this.y-=this.speed;
							break;
					case 1:
							this.x+=this.speed;
							break;
					case 2:
							this.y+=this.speed;
							break;
					case 3:
							this.x-=this.speed;
							break;
				}
			}

		};
	this.dead=function(){
		window.clearInterval(this.timer);
		this.isLive=false;
		if(this.type==mePlay){
			//清除heroBullets的子弹信息
			for(o in heroBullets){
				if(heroBullets[o]==null){
					continue;
				}
				if(heroBullets[o].seqId==this.seqId){
					console.log(o);
					console.log("子弹数组长:"+heroBullets.length);
					heroBullets.splice(o,1,null);
					break;
				}
			}
		}else{
			this.tank.bulletIsLive=false;
		}
	}	;
}

		//画出自己的子弹
		function drawHeroBullet(){

				//现在要画出所有子弹
				for( var i=0;i<heroBullets.length;i++){
					var heroBullet=heroBullets[i];
					//这里，我们加入了一句话，但是要知道这里加，是需要对整个程序有把握
					if(heroBullet!=null&&heroBullet.isLive){
						cxt.fillStyle="#FEF26E";
						cxt.fillRect(heroBullet.x,heroBullet.y,2,2);
					}
				}

		}

		//这里我们还需要添加一个函数，用于画出敌人的子弹,当然，画出敌人的子弹和自己的子弹是可以合并的.
		function drawEnemyBullet(){
			
			//现在要画出所有子弹
				for( var i=0;i<enemyBullets.length;i++){
					var etBullet=enemyBullets[i];
					//这里，我们加入了一句话，但是要知道这里加，是需要对整个程序有把握
					if(etBullet.isLive){
						cxt.fillStyle="#00FEFE";
						cxt.fillRect(etBullet.x,etBullet.y,2,2);
					}
				}
		}
	
	//绘制坦克(敌人坦克和自己的坦克)
	function drawTank(tank){
	
		//说明所有的坦克都要isLive这个属性
		if(tank.isLive){
			//考虑方向
			switch(tank.direct){

			case 0: //上
			case 2:// 下
				//画出自己的坦克，使用前面的绘图技术
				//设置颜色
				cxt.fillStyle=tank.color[0];
				//先画出左面的矩形
				cxt.beginPath();
				cxt.fillRect(tank.x,tank.y,5,30);
				//画出右边的矩形(一定要一个参照点)
				cxt.fillRect(tank.x+15,tank.y,5,30);
				//画出中间矩形
				cxt.fillRect(tank.x+6,tank.y+5,8,20);
				//画出坦克的盖子
				cxt.fillStyle=tank.color[1];
				cxt.arc(tank.x+10,tank.y+15,4,0,360,true);
				cxt.fill();
				cxt.closePath();
				//画出炮筒(直线)
				cxt.strokeStyle=tank.color[1];
				//设置线条的宽度
				cxt.lineWidth=1.5;
				cxt.beginPath();
				cxt.moveTo(tank.x+10,tank.y+15);
				
				if(tank.direct==0){
				cxt.lineTo(tank.x+10,tank.y);
				}else if(tank.direct==2){
				cxt.lineTo(tank.x+10,tank.y+30);
				}

				cxt.closePath();
				cxt.stroke();
				break;
			case 1: //右和左
			case 3:
				//画出自己的坦克，使用前面的绘图技术
				//设置颜色
				cxt.fillStyle=tank.color[0];
				cxt.beginPath();
				//先画出左面的矩形
				cxt.fillRect(tank.x,tank.y,30,5);
				//画出右边的矩形(这时请大家思路->一定要一个参照点)
				cxt.fillRect(tank.x,tank.y+15,30,5);
				//画出中间矩形
				cxt.fillRect(tank.x+5,tank.y+6,20,8);
				//画出坦克的盖子
				cxt.fillStyle=tank.color[1];
				cxt.arc(tank.x+15,tank.y+10,4,0,360,true);
				cxt.fill();
				cxt.closePath();
				//画出炮筒(直线)
				cxt.strokeStyle=tank.color[1];
				//设置线条的宽度
				cxt.lineWidth=1.5;
				cxt.beginPath();
				cxt.moveTo(tank.x+15,tank.y+10);
				//向右
				if(tank.direct==1){
				cxt.lineTo(tank.x+30,tank.y+10);
				}else if(tank.direct==3){ //向左
				cxt.lineTo(tank.x,tank.y+10);
				}

				cxt.closePath();
				cxt.stroke();
				break;

			}
		}
	}

//编写一个函数，专门用于判断我的子弹，是否击中了某个坦克
function isHitEnemyTank(){
	
		//取出每颗子弹
		for(var i=0;i<heroBullets.length;i++){
			
				//取出一颗子弹
				var heroBullet=heroBullets[i];
				if(null==heroBullet){
					continue;
				}
				if(heroBullet.isLive){ //子弹是活的，才去判断
					//让这颗子弹去和遍历每个敌人坦克判断
					for(var j=0;j<enemyTanks.length;j++){
						
								var enemyTank=enemyTanks[j];
							
								if(enemyTank.isLive){
								//(看看这颗子弹，是否进入坦克所在矩形)
								//根据当时敌人坦克的方向来决定
								switch(enemyTank.direct){
									case 0: //敌人坦克向上
									case 2://敌人坦克向下
										if(heroBullet.x>=enemyTank.x&&heroBullet.x<=enemyTank.x+20
											&&heroBullet.y>=enemyTank.y&&heroBullet.y<=enemyTank.y+30){
											
											if(!isNet){
												//把坦克isLive 设为false ,表示死亡
												//enemyTank.isLive=false;
												enemyTank.dead();
												//该子弹也死亡
												heroBullet.dead();
												//创建一颗炸弹
												var bomb=new Bomb(enemyTank.x,enemyTank.y);
												//然后把该炸弹放入到bombs数组中
												bombs.push(bomb);
												//清除死亡坦克
												//enemyTanks.splice(j,1);
											}else{
												new Kill(enemyTank.id,enemyTank.name,heroBullet.seqId,heroBullet.type).send();
											}
											
										}
									break;
									case 1: //敌人坦克向右
									case 3://敌人坦克向左
										if(heroBullet.x>=enemyTank.x&&heroBullet.x<=enemyTank.x+30
											&&heroBullet.y>=enemyTank.y&&heroBullet.y<=enemyTank.y+20){
											if(!isNet){	
												//把坦克isLive 设为false ,表示死亡
												//enemyTank.isLive=false;
												enemyTank.dead();
												heroBullet.dead();;
												//创建一颗炸弹
												var bomb=new Bomb(enemyTank.x,enemyTank.y);
												//然后把该炸弹放入到bombs数组中
												bombs.push(bomb);
												
												//清除死亡坦克
												//enemyTanks.splice(j,1);
											}else{
												new Kill(enemyTank.id,enemyTank.name,heroBullet.seqId,heroBullet.type).send();
											}						
										}
									break;

								}

							}


					}//for
			}
		}
}
//检测自己是否中弹
function isHitMeTank(){
//		if(enemyCount>0){
//			return;
//		}
		if(!isLive){
			return;
		}
		//取出每颗子弹
		for(var i=0;i<enemyBullets.length;i++){
			
				//取出一颗子弹
				var bullet=enemyBullets[i];
				if(null==bullet){
					continue;
				}
				if(bullet.isLive){ //子弹是活的，才去判断
						
					//根据当时敌人坦克的方向来决定
					switch(heroTank.direct){
						case 0: //敌人坦克向上
						case 2://敌人坦克向下
							if(bullet.x>=heroTank.x&&bullet.x<=heroTank.x+20
								&&bullet.y>=heroTank.y&&bullet.y<=heroTank.y+30){
								
								if(!isNet){
									//把坦克isLive 设为false ,表示死亡
									//enemyTank.isLive=false;
									heroTank.dead();
									//该子弹也死亡
									bullet.dead();
									//创建一颗炸弹
									var bomb=new Bomb(heroTank.x,heroTank.y);
									//然后把该炸弹放入到bombs数组中
									bombs.push(bomb);
									isLive=false;
									//清除死亡坦克
									//enemyTanks.splice(j,1);
								}else{
									new Kill(heroTank.id,heroTank.name,bullet.seqId,bullet.type).send();
								}
								
							}
						break;
						case 1: //敌人坦克向右
						case 3://敌人坦克向左
							if(bullet.x>=heroTank.x&&bullet.x<=heroTank.x+30
								&&bullet.y>=heroTank.y&&bullet.y<=heroTank.y+20){
								if(!isNet){	
									//把坦克isLive 设为false ,表示死亡
									//enemyTank.isLive=false;
									heroTank.dead();
									bullet.dead();;
									//创建一颗炸弹
									var bomb=new Bomb(heroTank.x,heroTank.y);
									//然后把该炸弹放入到bombs数组中
									bombs.push(bomb);
									isLive=false;
									//清除死亡坦克
									//enemyTanks.splice(j,1);
								}else{
									new Kill(heroTank.id,heroTank.name,bullet.seqId,bullet.type).send();
								}						
							}
						break;

					}

			}
		}
}

//画出敌人炸弹 
function drawEnemyBomb(){
	
	for(var i=0;i<bombs.length;i++){
	
		//取出一颗炸弹
		var bomb=bombs[i];
		if(bomb.isLive){
			
			//更据当前这个炸弹的生命值，来画出不同的炸弹图片
			if(bomb.blood>6){  //显示最大炸弹图
				var img1=new Image();
				img1.src="bomb_1.gif";
				var x=bomb.x;
				var y=bomb.y;
				img1.onload=function(){
					cxt.drawImage(img1,x,y,30,30);
				};
			}else if(bomb.blood>3){
				var img2=new Image();
				img2.src="bomb_2.gif";
				var x=bomb.x;
				var y=bomb.y;
				img2.onload=function(){
					cxt.drawImage(img2,x,y,30,30);
				};
			}else {
				var img3=new Image();
				img3.src="bomb_3.gif";
				var x=bomb.x;
				var y=bomb.y;
				img3.onload=function(){
					cxt.drawImage(img3,x,y,30,30);
				};
			}

			//减血
			bomb.bloodDown();
			if(bomb.blood<=0){
				//怎么办?把这个炸弹从数组中去掉
				bombs.splice(i,1);

			}
		}
	}
}

