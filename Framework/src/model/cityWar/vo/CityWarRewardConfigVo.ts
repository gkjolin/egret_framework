class CityWarRewardConfigVo {
	public template_id: number;
	public type: number;
	public min: number;
	public max: number;
	public need_point: number;
	public add_item: string;
	public goodsList: Array<NodeDrop_list>;

	public static ROLL: number = 1;
	public static PERSONPOINT: number = 4;
	public static GUILDPOINT: number = 5;
	public static ZHANLING_MASTER: number = 6;
	public static ZHANLING_MEMBER: number = 7;
	public static ZHANLING_DAILY: number = 8;
	public static PERSON_DABIAO: number = 9;
	public constructor() {
	}
}