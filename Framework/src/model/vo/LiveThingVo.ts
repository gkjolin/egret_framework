class LiveThingVo extends egret.EventDispatcher {
	public static CHANGEHP: string = "changeHP";
	public static CHANGEMP: string = "changeMP";
	public static CHANGELEV: string = "changeLev";
	public static CHANGEMAXHP: string = "changeMaxHp";
	public static CHANGEMAXMP: string = "changeMaxMp";
	public static CHANGESPEED: string = "changeSpeed";
	public static CHANGENAME: string = "changeName";

	public CHANGEMANUAL: string = "CHANGEMANUAL";//体力值改变
	public id: number;
	public x: number;
	public y: number;

	private _name: string;
	private _lev: number;//级别
	private _hp: number;
	private _maxHp: number;
	private _mp: number;
	private _maxMp: number;
	protected _speed: number;
	protected _hunZhanTargetID: string = "";//要攻击的玩家的玩家id
	public isRealFigure: boolean = true;//是否真实的形象
	public constructor() {
		super();
		this.init();
	}

	protected init(): void {

	}

	public setName(value: string): void {
		if (this._name == value) return;
		this._name = value;
		this.dispatchEvent(new egret.Event(LiveThingVo.CHANGENAME));
	}
	public getName(): string {
		return this._name;
	}
	//红        
	public setHp(value: number): void {
		if (this._hp == value) return;
		if (value < 0) value == 0;
		this._hp = value;
		this.dispatchEvent(new egret.Event(LiveThingVo.CHANGEHP));
	}
	public getHp(): number {
		return this._hp;
	}
	//红上限      
	public setMaxHp(value: number): void {
		if (this._maxHp == value) return;
		if (value < 0) value == 0;
		this._maxHp = value;
		this.dispatchEvent(new egret.Event(LiveThingVo.CHANGEMAXHP));

	}
	public getMaxHp(): number {
		return this._maxHp;
	}

	//蓝        
	public setMp(value: number): void {
		if (this._mp == value) return;
		if (value < 0) value == 0;
		this._mp = value;
		this.dispatchEvent(new egret.Event(LiveThingVo.CHANGEMP));
	}
	public getMp(): number {
		return this._mp;
	}
	//蓝上限      
	public setMaxMp(value: number): void {
		if (this._maxMp == value) return;
		if (value < 0) value == 0;
		this._maxMp = value;
		this.dispatchEvent(new egret.Event(LiveThingVo.CHANGEMAXMP));

	}
	public getMaxMp(): number {
		return this._maxMp;
	}

	//等级      
	public setLev(value: number): void {
		if (this._lev != value) {
			this._lev = value;
			this.dispatchEvent(new egret.Event(LiveThingVo.CHANGELEV));
		}
	}
	public getLev(): number {
		return this._lev;
	}

	//速度
	public setSpeed(value: number): void {
		if (this._speed != value) {
			this._speed = value;
			this.dispatchEvent(new egret.Event(LiveThingVo.CHANGESPEED));
		}
	}
	public getSpeed(): number {
		return this._speed;
	}

	//是否已经死亡
	public isDead(): Boolean {
		return this._hp == 0;
	}

	//是否满血
	public isFull(): Boolean {
		return this._hp == this._maxHp;
	}

	public getPropertyVo(): PropertyVO {
		return null;
	}

	public get hunZhanTargetID() {
		return this._hunZhanTargetID;
	}
	public set hunZhanTargetID(value: string) {
		this._hunZhanTargetID = value;
	}
}