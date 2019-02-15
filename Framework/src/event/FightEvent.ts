class FightEvent extends ParamEvent {
	public static ATTACKPLAYER: string = "attack_player";
	public static ATTACKMONSTER: string = "attackMoster";
	public static ATTACKRANGE: string = "ATTACKRANGE";
	public constructor(eventName: string, param: any) {
		super(eventName, param);
	}
}