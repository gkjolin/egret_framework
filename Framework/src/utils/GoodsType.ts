class GoodsType {
	public static ITEM_EQUIP: number = 10;
	public static ITEM_GIFT: number = 16;
	public static ITEM_OTHER: number = 90;
	public static EQUIP_PARTNAME: Object = {
		1: "武器", 2: "衣服", 3: "头盔", 4: "项链", 5: "护腕", 6: "戒指", 9: "天珠", 30: "仙翎", 31: "仙喙", 32: "仙骨", 33: "仙晶", 34: "光粉", 35: "光滴", 36: "光石", 37: "光魂"
		, 40: "觉醒武器", 41: "觉醒衣服", 42: "觉醒帽子", 43: "觉醒鞋子", 44: "觉醒护腕", 45: "觉醒腰带", 46: "觉醒项链", 47: "觉醒戒指"
	}

	public static EQUIP_WEAPON: number = 1;
	public static EQUIP_ARMOR: number = 2;
	public static EQUIP_HEAD: number = 3;
	public static EQUIP_NECKLACE: number = 4;
	public static EQUIP_WRISTER: number = 5;
	public static EQUIP_RING: number = 6;

	public static SPECIAL_EQUIP_1: number = 1;//麻痹戒指
	public static SPECIAL_EQUIP_2: number = 2;//护身戒指
	public static SPECIAL_EQUIP_3: number = 3;//龙魂
	public static SPECIAL_EQUIP_4: number = 4;//护盾

	public static EQUIP_TYPE_LIST: Array<any> = [1, 2, 3, 4, 5, 6, 30, 31, 32, 33];
	public static EQUIP_NORMAL_TYPE_LIST: Array<any> = [1, 2, 3, 4, 5, 6];

	public static COLOR_WHITE: number = 0; //白色
	public static COLOR_GREEN: number = 1; //绿色
	public static COLOR_BLUE: number = 2; //蓝色
	public static COLOR_PURPLE: number = 3; //紫色
	public static COLOR_ORANGE: number = 4; //橙色
	public static COLOR_RED: number = 5; //红色
	public static COLOR_GOLD: number = 6; //金色

	public static QUALITY_1: number = 1;
	public static QUALITY_2: number = 2;
	public static QUALITY_3: number = 3;
	public static QUALITY_4: number = 4;
	public static QUALITY_5: number = 5;
	public static QUALITY_6: number = 6;
	public static QUALITY_7: number = 7;
	public constructor() {
	}
}