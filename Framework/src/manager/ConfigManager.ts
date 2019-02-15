class ConfigManager {
	public static rootURL: string = '';
	public static platform_id: number = 0;
	private static _plat_id: string = '12';
	public static plat_ip: string;
	public static plat_port: number;
	public static domain: string;

	public static server_id: number = 0;
	public static cur_channel: string = '';

	public static test_centerUrl: string = 'http://api.bzsch5.test.9217web.com';

	public constructor() {}

	/**
     * 是否外服    true：开发服      false:外服
     * @return 
     * 
     */
	public static get isDevServer(): Boolean {
		var result: Boolean = false;
		if (AllParamObj['isin'] != undefined) {
			if (AllParamObj['isin'] != null) {
				if (AllParamObj['isin'] == '1') {
					result = true;
				}
			}
		}
		return result;
	}

	public static get isGMOpen(): boolean {
		return AllParamObj['gmOpen'] == '1';
	}

	public static get isHttpPostMode(): Boolean {
		var result: Boolean = false;
		if (AllParamObj['isin2'] != undefined) {
			if (AllParamObj['isin2'] != null) {
				if (AllParamObj['isin2'] == '1') {
					result = true;
				}
			}
		}
		return result;
	}

	public static isDirectEnter(): boolean {
		// LoginControl.getInstance();
		var user_id: string = Tools.getPageParams('user_id');
		var platform: string = Tools.getPageParams('platform');
		var cur_channel: string = Tools.getPageParams('cur_channel');
		var ret: number = Number(Tools.getPageParams('ret'));

		var server_id: string;
		var login_ip: string = '';
		var port: string = '';
		var loginStr: string;
		var decodeStr: string;
		var splitArr: Array<string>;
		var resultArr: Array<string> = [];
		var resultStr: string;
		var tempStr: string = '';

		ConfigManager.plat_id = user_id;
		ConfigManager.cur_channel = cur_channel;
		if (platform != null && platform != '') {
			AllParamObj['platform'] = platform;
			if (platform == 'dev') {
				AllParamObj['center_url'] = ConfigManager.test_centerUrl;
			}
		}
		if (ConfigManager.isDevServer == true) {
			this.parseUrlLogin();
			return false;
		} else {
			var ret2 = Tools.getPageParams('ret');
			if (ret2 == undefined || ret2 == null || ret2 == '') {
				AllParamObj['isin2'] = '0';
				AllParamObj['isin'] = '1';
				this.parseUrlLogin();
				return false;
			} else if (ret == 0) {
				Alert.show('登录失败');
				return false;
			}
		}

		//===========如果URL里面有以下参数，就跳过选服界面，直接进入游戏==========//
		server_id = Tools.getPageParams('server_id');
		loginStr = Tools.getPageParams('login');
		if (loginStr == undefined || loginStr == '') return false;
		if (user_id == undefined || user_id == '') {
			Alert.show('登录失败');
			return false;
		}
		decodeStr = Base64.base64decode(loginStr);
		splitArr = decodeStr.split(',');
		resultArr = [];
		resultStr = '';
		tempStr = '';
		for (let i in splitArr) {
			tempStr = String.fromCharCode(Number(splitArr[i]));
			resultStr += tempStr;
		}
		resultArr = resultStr.split(':');
		login_ip = resultArr[0];
		port = resultArr[1];
		var isSSL = Tools.getPageParams('is_ssl');
		if (isSSL && parseInt(isSSL) > 0) {
			var domain: string = resultArr[2];
			ConfigManager.domain = domain;
		}
		if (
			server_id != undefined &&
			server_id != '' &&
			login_ip != undefined &&
			login_ip != '' &&
			port != undefined &&
			port != ''
		) {
			ConfigManager.server_id = Number(server_id);
			ConfigManager.plat_port = Number(port);
			ConfigManager.plat_ip = login_ip;
			// trace("serverid=====" + Number(server_id))
			// trace("port=====" + Number(port))
			// trace("ip=====" + login_ip)
			// trace("use_id=====" + ConfigManager.plat_id)
			// PhpHttpStatisticsManager.send(1);
			// CreateControl.getInstance();
			// new CreateControl().initCreate();
			RenderManager.start();
			return true;
		}
		return false;
	}

	public static parseUrlLogin(): boolean {
		var server_id: string;
		var login_ip: string = '';
		var port: string = '';
		var loginStr: string;
		var decodeStr: string;
		var splitArr: Array<string>;
		var resultArr: Array<string> = [];
		var resultStr: string;
		var tempStr: string = '';

		server_id = Tools.getPageParams('server_id');
		loginStr = Tools.getPageParams('login');
		decodeStr = Base64.base64decode(loginStr);
		splitArr = decodeStr.split(',');
		resultArr = [];
		resultStr = '';
		tempStr = '';
		for (let i in splitArr) {
			tempStr = String.fromCharCode(Number(splitArr[i]));
			resultStr += tempStr;
		}
		resultArr = resultStr.split(':');
		login_ip = resultArr[0];
		port = resultArr[1];
		if (
			server_id != undefined &&
			server_id != '' &&
			login_ip != undefined &&
			login_ip != '' &&
			port != undefined &&
			port != ''
		) {
			ConfigManager.server_id = Number(server_id);
			AllParamObj['port'] = port;
			AllParamObj['ip'] = login_ip;
		}
		return true;
	}

	public static isTencent(): boolean {
		// return true;
		return AllParamObj['platform'] == 'tencent';
	}

	public static isGuoZiZF(): boolean {
		return AllParamObj['platform'] == 'b333yx';
	}

	public static isGuoZi(): boolean {
		return AllParamObj['platform'] == 'guoziyx';
	}

	public static isb9cb(): boolean {
		return AllParamObj['platform'] == 'b9cb';
	}

	public static isyxjinbang(): boolean {
		return AllParamObj['platform'] == 'yxjinbang';
	}

	public static isQiTian(): boolean {
		return AllParamObj['platform'] == 'qitian';
	}

	public static isWanZui(): boolean {
		return AllParamObj['platform'] == 'wanzui';
	}

	public static isb7724(): boolean {
		return AllParamObj['platform'] == 'b7724';
	}

	public static isQingFeng(): boolean {
		return AllParamObj['platform'] == 'qingfeng';
	}

	public static getOS(): string {
		var os = egret.Capabilities.os;
		var result = '';
		if (os == 'iOS') {
			result = 'ios';
		} else if (os == 'Android') {
			result = 'android';
		} else {
			result = 'winpc';
		}
		return result;
	}

	public static isAndroid(): boolean {
		return ConfigManager.getOS() == 'android';
	}

	//苹果是2，安卓是1
	public static getOSCode(): number {
		var os = egret.Capabilities.os;
		if (os == 'iOS') {
			return 2;
		}
		return 1;
	}

	public static set plat_id(value: string) {
		ConfigManager._plat_id = value;
	}

	public static get plat_id() {
		return ConfigManager._plat_id;
		// var result: string = "";
		// if (ConfigManager.isTencent()) {
		//     result = ConfigManager._plat_id + "_" + ConfigManager.getOS();
		// }
		// else {
		//     result = ConfigManager._plat_id;
		// }
		// return result;
	}

	public static isIOS(): boolean {
		if (ConfigManager.isTencent()) {
			if (window['OPEN_DATA']) {
				return parseInt(window['OPEN_DATA']['platform']) == 2;
			}
		}
		return egret.Capabilities.os == 'iOS';
	}

	public static isQunHei(): boolean {
		return AllParamObj['platform'] == 'qunhei';
	}

	public static getVia(): number {
		var result: number = 0;
		if (ConfigManager.isTencent()) {
			if (window['OPEN_DATA']) {
				var via: string = window['OPEN_DATA']['via'];
				if (via == 'H5.QQ.SHARE') {
					result = 2;
				} else if (via == 'H5.QZONE.SHARE') {
					result = 1;
				} else if (via == 'H5.DESKTOP') {
					result = 3;
				} else if (via == 'H5.APP.HDB_D') {
					result = 4;
				} else if (via == 'H5.QZONE.PC') {
					result == 5;
				}
			}
		}
		return result;
	}

	public static isChaoren(): boolean {
		return AllParamObj['platform'] == 'chaoren';
	}

	public static isNewCreate(): boolean {
		return (
			ConfigManager.isTencent() ||
			ConfigManager.isb7724() ||
			ConfigManager.isyxjinbang() ||
			ConfigManager.isQunHei() ||
			ConfigManager.isQingFeng() ||
			ConfigManager.isChaoren() ||
			ConfigManager.isB9g() ||
			ConfigManager.isb9cb() ||
			ConfigManager.isLeDu() ||
			ConfigManager.isYuMeng() ||
			ConfigManager.is37()
		);
	}

	public static isBigScene(): boolean {
		return (
			ConfigManager.isb7724() ||
			ConfigManager.isyxjinbang() ||
			ConfigManager.isQunHei() ||
			ConfigManager.isQingFeng() ||
			ConfigManager.isChaoren() ||
			ConfigManager.isB9g() ||
			ConfigManager.isb9cb() ||
			ConfigManager.isLeDu() ||
			ConfigManager.isYuMeng()
		);
	}

	public static isB9g(): boolean {
		return AllParamObj['platform'] == 'b9g';
	}

	public static isLeDu(): boolean {
		return AllParamObj['platform'] == 'ledu';
	}

	public static isYuMeng(): boolean {
		return AllParamObj['platform'] == 'yumeng';
	}

	public static is37(): boolean {
		return AllParamObj['platform'] == 'b37huyu';
	}
}
