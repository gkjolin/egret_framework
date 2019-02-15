function rURL(url: string): string {
	if (url.indexOf(ConfigManager.rootURL) > -1) return url;
	if (url.indexOf('http://') > -1 || url.indexOf('https://') > -1) return url;
	return ConfigManager.rootURL + url;
}

function getTimer(): number {
	return egret.getTimer();
}

function is(obj: any, className: string): boolean {
	return egret.is(obj, className);
}

function setTimeout2(closure: Function, delay: number, ...parameters): number {
	var si: number = setTimeout(exec, delay, closure, delay, parameters);
	function exec(func: Function, delay: number, arg: Array<any> = null): void {
		clearTimeout(si);
		var time: number = getTimer();
		func.apply(null, arg);
		if (getTimer() - time > 10) {
			trace('setTimeout执行消耗:' + delay + ',' + (getTimer() - time));
		}
		closure = null;
	}
	return si;
}

var AllParamObj: Object = {};

var isFilterTxt: boolean = false;

var debugCmd: boolean = true;

var isTestSkill: boolean = false;

var browserVsn: string;

var vsnFileCode: string;

var bigResCode: string; //大版本号，主要用于地图块

var isDebug: boolean; //是否发布版本

var QQApiID: number = 1101255595;
