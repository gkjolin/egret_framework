class TimerManager {

	private static _instance: TimerManager;
	private _timerDic: Object;//以间隔储存时间的字典，键值：时间间隔，值：Timer
	private _keyToTimerDic: Object;//以函数储存时间的字典，键值：函数，值：时间间隔
	private _funcListDic: Object;//以间隔储存函数数组的字典，键值：时间间隔，值：包含函数的数组
	private _keyToFuncDic: Object;
	private _count: number = 0;
	private _countForMsg: number = 0;
	private static TIMER_INDEX: number = 0;
	public constructor() {
		this.init();
	}

	private init(): void {
		this._timerDic = new Object();
		this._keyToTimerDic = new Object();
		this._funcListDic = new Object();
		this._keyToFuncDic = new Object();
	}

	public static getInstance(): TimerManager {
		if (this._instance == null) {
			this._instance = new TimerManager();
		}
		return this._instance;
	}

	//添加间隔和方法
	public addForMsg(delayTime: number, func: any, key: string): void {
		if (this._keyToTimerDic[key] != null || this._keyToTimerDic[key] != undefined) {
			return;
		}
		this.removeForMsg(key);
		this._countForMsg++;
		this.createTimer(delayTime, true);
		this._keyToTimerDic[key] = delayTime;
		this._keyToFuncDic[key] = func;
		var funcList: Array<Function> = this._funcListDic[delayTime];
		funcList.push(func);
	}

	public add(delayTime: number, func: any, thisObj: any, ...parameters): void {
		this.remove(delayTime, func, thisObj);
		this._count++;
		this.createTimer(delayTime);
		var funcList: Array<Object> = this._funcListDic[delayTime];
		var timerObj: Object = new Object();
		timerObj["delay"] = delayTime;
		timerObj["func"] = func;
		timerObj["thisObj"] = thisObj;
		timerObj["parameters"] = parameters;
		funcList.push(timerObj);
	}

	//判断当前key对应的方法是否在定时器中
	public hasTimer(key: string): boolean {
		if (this._keyToTimerDic[key]) {
			return true;
		}
		else {
			return false;
		}
	}

	//移除方法
	public remove(delayTime: number, func: any, thisObj: any): void {
		var delay: number = delayTime;
		var list: Array<Object> = this._funcListDic[delay];
		if (!list) {
			return;
		}
		for (var i: number = 0; i < list.length; i++) {
			var obj = list[i];
			if (obj["func"] == func && obj["thisObj"] == thisObj) {
				list.splice(i, 1);
				this._count--;
				break;
			}
		}
		if (list.length == 0) {
			var timer: egret.Timer = this._timerDic[delay];
			timer.stop();
			timer.removeEventListener(egret.TimerEvent.TIMER, this.timerHandle, this)
			delete this._funcListDic[delay];
			delete this._timerDic[delay];
		}
	}

	public has(delay: number, func: any, thisObj: any): boolean {
		var list: Array<Object> = this._funcListDic[delay];
		if (!list) {
			return false;
		}
		for (var i: number = 0; i < list.length; i++) {
			var obj = list[i];
			if (obj["func"] == func && obj["thisObj"] == thisObj) {
				return true;
			}
		}
		return false;
	}

	//移除方法
	public removeForMsg(key: string, isExeFunc: boolean = false): void {
		if (this._keyToTimerDic[key] == null || this._keyToTimerDic[key] == undefined) {
			return;
		}
		this._countForMsg--;
		var delay: number = this._keyToTimerDic[key];
		delete this._keyToTimerDic[key];
		var list: Array<any> = this._funcListDic[delay];
		var fun: any = this._keyToFuncDic[key];
		if (fun && isExeFunc) {
			fun();
		}
		var index: number = list.indexOf(fun);
		if (index > -1) {
			list.splice(index, 1);
		}
		if (list.length == 0) {
			var timer: egret.Timer = this._timerDic[delay];
			timer.stop();
			timer.removeEventListener(egret.TimerEvent.TIMER, this.timerHandleForMsg, this)
			delete this._funcListDic[delay];
			delete this._timerDic[delay];
		}
	}

	//获取当前定时器有多少个
	public getCount(): number {
		return this._count;
	}

	public getCountForMsg(): number {
		return this._countForMsg;
	}

	private timerHandle(e: egret.TimerEvent): void {
		var timer: egret.Timer = e.currentTarget as egret.Timer;
		var delay: number = timer.delay;
		var oo: Object = this._funcListDic;
		var list: Array<Object> = oo[delay];
		for (var i: number = 0; i < list.length; i++) {
			var timerObj = list[i];
			var thisObj = timerObj["thisObj"];
			timerObj["func"].apply(thisObj, timerObj["parameters"]);
		}
	}

	private createTimer(delay: number, useInMsg: boolean = false): void {
		if (this._timerDic[delay] == undefined) {
			var timer: egret.Timer = new egret.Timer(delay);
			if (useInMsg) {
				timer.addEventListener(egret.TimerEvent.TIMER, this.timerHandleForMsg, this);
			}
			else {
				timer.addEventListener(egret.TimerEvent.TIMER, this.timerHandle, this);
			}
			timer.start();
			this._timerDic[delay] = timer;

		}
		if (this._funcListDic[delay] == undefined) {
			this._funcListDic[delay] = new Array();
		}
	}

	private timerHandleForMsg(e: egret.TimerEvent): void {
		var timer: egret.Timer = e.currentTarget as egret.Timer;
		var delay: number = timer.delay;
		var oo: Object = this._funcListDic;
		var list: Array<Function> = oo[delay];
		for (var i: number = 0; i < list.length; i++) {
			list[i]();
		}
	}

	public getTimerKey(): string {
		return "TimerManager_" + TimerManager.TIMER_INDEX++;
	}

	//清除所有用于Message的定时器
	public clearAllMsgTimer(): void {
		for (var key in this._keyToTimerDic) {
			this.removeForMsg(key, true);
		}
	}

	private _currentServerTime: number = 0;
	private _lastTimer: number = 0;
	public get currentServerTime(): number {
		var gap: number = Math.ceil((getTimer() - this._lastTimer) / 1000);
		return this._currentServerTime + gap;
	}

	public set currentServerTime(value: number) {
		this._currentServerTime = value;
		this._lastTimer = getTimer();
	}
}