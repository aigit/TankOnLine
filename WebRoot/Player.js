var players={};
var Player;     
if(!Player) Player = function(name,level){
	this.name=name;
	this.level=level;
};

Player.READLY=0;
Player.GAMEING=1;
Player.RELEASE=2;