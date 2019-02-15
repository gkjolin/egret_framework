class ColorUtil {
	public static COLOR_WHITE: string = "#939393"; //白色
	public static COLOR_GREEN: string = "#00d228"; //绿色
	public static COLOR_BLUE: string = "#02a4e7"; //蓝色
	public static COLOR_PURPLE: string = "#ae58ca"; //紫色
	public static COLOR_ORANGE: string = "#ff7200"; //橙色
	public static COLOR_RED: string = "#e31101"; //红色
	public static COLOR_GOLD: string = "#ffd200"; //金色
	public constructor() {
	}
	/**
		 *根据颜色类型获取颜色值
		 * @param color
		 * @return
		 *
		 */
	public static getGoodColor(color: number): string {
		if (color == GoodsType.COLOR_WHITE) //白色
			return "#939393";
		else if (color == GoodsType.COLOR_GREEN) //绿色
			return "#00d228";
		else if (color == GoodsType.COLOR_BLUE) //蓝色
			return "#02a4e7";
		else if (color == GoodsType.COLOR_PURPLE) //紫色
			return "#ae58ca";
		else if (color == GoodsType.COLOR_ORANGE) //橙色
			return "#ff7200";
		else if (color == GoodsType.COLOR_RED) //红色
			return "#e31101";
		else if (color == GoodsType.COLOR_GOLD) //金色
			return "#ffd200";
		else
			return "#939393";
	}
	public static getGoodColorNumber(color: number): number {
		if (color == GoodsType.COLOR_WHITE) //白色
			return 0x939393;
		else if (color == GoodsType.COLOR_GREEN) //绿色
			return 0x00d228;
		else if (color == GoodsType.COLOR_BLUE) //蓝色
			return 0x02a4e7;
		else if (color == GoodsType.COLOR_PURPLE) //紫色
			return 0xae58ca;
		else if (color == GoodsType.COLOR_ORANGE) //橙色
			return 0xff7200;
		else if (color == GoodsType.COLOR_RED) //红色
			return 0xe31101;
		else if (color == GoodsType.COLOR_GOLD) //金色
			return 0xffd200;
		else
			return 0x939393;
	}

	public static getColorHtmlStr(value: any, color: string): string {
		return "<font color='" + color + "'>" + value + "</font>";
	}

	public static getGoodsHtmlName(typeID: number, goodsNum: number = 0): string {
		var result: string = "";
		// var goodsVo: GoodsInfo = GoodsListProxy.getInstance().getGoodsInfoByType(typeID);
		// if (goodsVo == null) {
		// 	return result;
		// }
		// result = StringUtil.substitute("<font color='{0}'>{1}</font>", ColorUtil.getGoodColor(goodsVo.quality - 1), goodsVo.name);
		// if (goodsNum > 0) {
		// 	result = StringUtil.substitute("{0}x{1}", result, Tools.convertNumber(goodsNum));
		// }
		return result;
	}
}