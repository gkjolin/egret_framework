class TimeUtil {
	public constructor() {
	}

	//获取当前时间的秒数
	public static getTimeNow(): number {
		return Math.floor(new Date().getTime() / 1000);
	}

	/**
		 * 获取时间格式
		 * @param time 秒
		 * @return String
		 *
		 */
	public static getTime(time: number): string {
		var timeStr: string = "";
		var second: number = time % 60;
		var minute: number = Math.floor(time / 60);
		if (minute >= 60) {
			time = Math.floor(minute / 60);
			timeStr += time > 9 ? time : "0" + time;
			timeStr = timeStr.concat(":");
			minute = minute % 60;
			timeStr += minute > 9 ? minute : "0" + minute;
			timeStr = timeStr.concat(":");
			timeStr += second > 9 ? second : "0" + second;
		} else {
			timeStr = timeStr.concat("00:");
			timeStr += minute > 9 ? minute : "0" + minute;
			timeStr = timeStr.concat(":");
			timeStr += second > 9 ? second : "0" + second;
		}
		return timeStr;
	}

	/**
	 * 获取时间格式
	 * @param seconds秒
	 * @return
	 *
	 */
	public static getTime2(seconds: number, onlyMinute: Boolean = false): string {
		if (seconds < 0)
			return "00分00秒";
		var timeStr: string = "";
		var second: number = seconds % 60;
		var minute: number = Math.floor(seconds / 60);
		if (onlyMinute) {
			if (minute <= 0) {
				return second + "秒";
			}
			return minute + "分";
		}
		var hourStr: string = "";
		var minuteStr: string = "";
		var secondStr: string = "";

		if (minute >= 60) {
			var time: number = Math.floor(minute / 60);
			hourStr = timeStr + (time > 9 ? time : "0" + time);

			minute = minute % 60;
		}
		minuteStr = minuteStr + (minute > 9 ? minute : "0" + minute);
		secondStr = secondStr + (second > 9 ? second : "0" + second);
		if (hourStr == "")
			timeStr = `${minuteStr}分${secondStr}秒`;
		else
			timeStr = `${hourStr}时${minuteStr}分${secondStr}秒`;


		return timeStr;
	}
	public static getTime3(seconds: number): string {
		if (seconds < 86400)
			return this.getTime2(seconds);
		var time: number = Math.floor(seconds / 86400);
		return time + "天 " + this.getTime2(seconds % 86400);
	}
	public static getTime4(seconds: number): string {
		if (seconds <= 0)
			return "0天0小时";
		if (seconds < 3600)
			return "0天1小时";
		if (seconds < 86400) {
			var hour: number = Math.ceil(seconds / 3600);
			if (hour == 24)
				return "1天0小时";
			return `0天&{hour}小时`;
			//				return "0天"+hour+"小时";
		}
		var time: number = seconds / 86400;
		var h: number = Math.ceil((seconds % 86400) / 3600);
		return `${time}天 ${h}小时`;
		//			return time+"天 "+Math.ceil((seconds%86400)/3600)+"小时";
	}
	public static getTime5(seconds: number): string {
		var time: number = Math.floor(seconds / 86400);
		return time + "天 " + this.getTime2(seconds % 86400);
	}
	/**毫秒
	 * 将ms时间转换成 天 时：分：秒
	 * @param time:number 输入时间（ms）
	 * @param format:String "DD hh:mm:ss" 格式随意
	 * @return String
	 */
	public static convertTime(time: number, format: string = "DD hh:mm:ss"): string {
		var d: number = Math.floor(time / 86400000);
		var hor: number = Math.floor(time % 86400000 / 3600000);
		var min: number = Math.floor(time % 86400000 % 3600000 / 60000);
		var sec: number = Math.floor(time % 86400000 % 3600000 % 60000 / 1000);

		var DD: string = d + "";

		var hh: string = hor >= 10 ? "" + hor : "0" + hor;
		var mm: string = min >= 10 ? "" + min : "0" + min;
		var ss: string = sec >= 10 ? "" + sec : "0" + sec;

		format = format.replace("DD", DD);
		format = format.replace("hh", hh);
		format = format.replace("mm", mm);
		format = format.replace("ss", ss);

		return format;
	}

	/**
	 * 毫秒
	 * 格式化时间
	 * @param time:number（ms）需要格式化的时间，如果为0，表示当前时间
	 * @param format:string "YYYY/MM/DD hh:mm:ss" 格式随意定
	 * 例如：  MM月DD日 mm分  输出为： 10月30日 34分
	 * @return string
	 */
	public static formatTime(time: number = 0, format: string = "YYYY-MM-DD hh:mm:ss"): string {
		var dt: Date = new Date();
		if (time != 0)
			dt.setTime(time);

		var y: number = dt.getFullYear();
		var m: number = dt.getMonth() + 1;
		var d: number = dt.getDate();

		var hor: number = dt.getHours();
		var min: number = dt.getMinutes();
		var sec: number = dt.getSeconds();

		var YYYY: string = y + "";
		var MM: string = m >= 10 ? "" + m : "0" + m;
		var DD: string = d >= 10 ? "" + d : "0" + d;

		var hh: string = hor >= 10 ? "" + hor : "0" + hor;
		var mm: string = min >= 10 ? "" + min : "0" + min;
		var ss: string = sec >= 10 ? "" + sec : "0" + sec;

		format = format.replace("YYYY", YYYY);
		format = format.replace("MM", MM);
		format = format.replace("DD", DD);
		format = format.replace("hh", hh);
		format = format.replace("mm", mm);
		format = format.replace("ss", ss);

		return format;
	}

	/**
	 * 获取时间格式
	 * @param seconds
	 * @return
	 *
	 */
	public static getTimeHour(seconds: number): string {
		var second: number = seconds % 60;
		var minute: number = seconds / 60;
		var hourStr: string = "1";

		if (minute >= 60) {
			var time: number = minute / 60;
			hourStr = Math.floor(time).toString();
		}
		return hourStr;
	}

	//判断是否同一天
	public static isOnSameDay(date1: Date, date2: Date): boolean {
		var y1: number = date1.getFullYear();
		var y2: number = date2.getFullYear();
		var m1: number = date1.getMonth();
		var m2: number = date2.getMonth();
		var d1: number = date1.getDate();
		var d2: number = date2.getDate();
		var day1: number = date1.getDay();
		var day2: number = date2.getDay();
		// if (y1 == y2 && day1 == day2) return true;
		if (y1 == y2 && m1 == m2 && d1 == d2 && day1 == day2) return true;
		return false;
	}

	//获取接下来的星期day的Date
	public static getNextDay(day: number): Date {
		var now: number// = RoleModel.getInstance().serverTime;
		var d1: Date = new Date(now * 1000);
		var count: number = 0;
		while (d1.getDay() != day && count < 7) {
			d1 = new Date(d1.getTime() + 86400000);
			count++;
		}
		return d1;
	}

	public static getTodayZero(): number {
		var d: Date = new Date();
		var d2: Date = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
		return d2.getTime();
	}

	public static getZero(d: Date): number {
		var d2: Date = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
		return d2.getTime();
	}

	//获取某个时区的当前的Date
	public static getTimeByTimeZone(timeZone: number = 8): Date {
		var d = new Date();
		var localTime = d.getTime();
		var localOffset = d.getTimezoneOffset() * 60000; //获得当地时间偏移的毫秒数,这里可能是负数  
		var utc = localTime + localOffset; //utc即GMT时间  
		var offset = timeZone; //时区，北京市+8  美国华盛顿为 -5  
		var localSecondTime = utc + (3600000 * offset);  //本地对应的毫秒数  
		var date = new Date(localSecondTime);
		return date;
	}

	//获得本周的开端日期
	//如果以周日为一周的开端，offDay就是0，周一为开端，offDay就是1
	public static getWeekStartDate(offDay: number = 0): Date {
		var now: Date = new Date();
		var nowYear: number = now.getFullYear();
		var nowMonth: number = now.getMonth();
		var nowDate: number = now.getDate();
		var nowDayOfWeek = now.getDay();
		var weekStartDate = new Date(nowYear, nowMonth, nowDate - nowDayOfWeek + offDay);
		return weekStartDate;
	}

	//获得本周的停止日期
	//如果以周日为一周的开端，offDay就是0，周一为开端，offDay就是1
	public static getWeekEndDate(offDay: number = 0) {
		var now: Date = new Date();
		var nowYear: number = now.getFullYear();
		var nowMonth: number = now.getMonth();
		var nowDate: number = now.getDate();
		var nowDayOfWeek = now.getDay();
		var weekEndDate = new Date(nowYear, nowMonth, nowDate + (6 - nowDayOfWeek + offDay));
		return weekEndDate;
	}
}