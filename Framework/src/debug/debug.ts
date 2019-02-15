function trace(param: any, ...optionalParam: any[]): void {
	var debug: boolean = isDebug;
	if (debug) {
		console.log(param, optionalParam);
	}
}

function traceByTime(content: string): void {
	var debug: boolean = isDebug;
	debug = true;
	if (debug) {
		var now: Date = new Date();
		var str: string = StringUtil.substitute('time:{0} {1}', TimeUtil.formatTime(now.getTime()), content);
		console.log(str);
	}
}

function testTime(fName: string, f: Function, thisObj: any, ...parameters): any {
	var t1: number = getTimer();
	var result = f.apply(thisObj, parameters);
	traceByTime(StringUtil.substitute('{0} cost time = {1}ms', fName, getTimer() - t1));
	return result;
}
