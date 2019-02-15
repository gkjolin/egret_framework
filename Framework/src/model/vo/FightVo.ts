class FightVo {
	public hitter: LiveThing;
	public hitterType: number;
	public hurt: number;
	public leftHp: number;//剩余的红或者蓝
	public leftType: number = 1;//红或者蓝

	public static RED: number = 1;
	public static BLUE: number = 2;
	public constructor() {
	}
}