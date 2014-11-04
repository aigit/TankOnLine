package com.zaq.tank;

@Deprecated
public enum Command {
//	0(w),1(d),2(s),3(a) 4(kill) 5(clearWASD)   6(login) 7(logout) 8(talk)
	W,D,S,A,KILL,CLEARWDSA,LOGIN,LOGOUT,TALK;
	
	public static String[] toStrArray(){
		Command[] arr=Command.values();
		String[] retArr=new String[arr.length];
		for(int i=0;i<arr.length;i++){
			retArr[i]=arr[i].name();
		}
		return retArr;
	}
	
	public static Command get(int ordinal){
		return Command.values()[ordinal];
	}
}
