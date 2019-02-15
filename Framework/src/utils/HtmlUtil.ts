class HtmlUtil {
	public constructor() {
	}

	/**
	 * 获取html文本
	 * @str 文本
	 * @color 颜色值 例："#ff0000"红色
	*/
	public static font(str: string, color: string): string {
		let result: string = "<font color='" + color + "'>" + str + "</font>";
		return result;
	}

	public static link(str: string): string {
		let result: string = "<font><u>" + str + "</u></font>";
		return result;
	}

	public static bold(str: string): string {
		let result: string = "<font><b>" + str + "</b></font>";
		return result;
	}
}