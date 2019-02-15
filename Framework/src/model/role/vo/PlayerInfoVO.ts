class PlayerInfoVO extends egret.EventDispatcher {
	public static CHANGEGOLD: string = "CHANGEGOLD";
	public static CHANGECOIN: string = "CHANGECOIN";
	public static CHANGEGX: string = "CHANGEGX";
	public static CHANGESOUL: string = "CHANGESOUL";
	public static CHANGEMALLPOINT: string = "CHANGEMALLPOINT";
	public static CHANGEFEAT: string = "CHANGEFEAT";
	public static CHANGAWAKE: string = "CHANGAWAKE";
	public attack: number;//攻击
	public defence: number;//防御
	public strength: number;//力量
	public mingzhong: number;//命中
	public miss: number;//闪避
	public baoji: number;//暴击
	public attackSpeed: number = 400;//写死400毫秒


	private _gold: number = 0;//元宝
	private _coin: number = 0;//金币
	private _gx: number = 0;//公会贡献
	private _soul: number = 0;//修为
	private _mallpoint: number = 0;//商城积分
	private _feat: number = 0;//功勋
	private _awake: number = 0;//觉醒真气

	public constructor() {
		super();
	}

	public setGold(value: number): void {
		if (this._gold == value) return;
		this._gold = value;
		this.dispatchEvent(new egret.Event(PlayerInfoVO.CHANGEGOLD));
	}
	public getGold(): number {
		return this._gold;
	}
	public setCoin(value: number): void {
		if (this._coin == value) return;
		this._coin = value;
		this.dispatchEvent(new egret.Event(PlayerInfoVO.CHANGECOIN));
	}
	public getCoin(): number {
		return this._coin;
	}
	public setGx(value: number): void {
		if (this._gx == value) return;
		this._gx = value;
		this.dispatchEvent(new egret.Event(PlayerInfoVO.CHANGEGX));
	}
	public getGx(): number {
		return this._gx;
	}
	public setSoul(value: number): void {
		if (this._soul == value) return;
		this._soul = value;
		this.dispatchEvent(new egret.Event(PlayerInfoVO.CHANGESOUL));
	}
	public getSoul(): number {
		return this._soul;
	}
	public setMallPoint(value: number): void {
		if (this._mallpoint == value) return;
		this._mallpoint = value;
		this.dispatchEvent(new egret.Event(PlayerInfoVO.CHANGEMALLPOINT));
	}
	public getMallPoint(): number {
		return this._mallpoint;
	}
	public setFeat(value: number): void {
		if (this._feat == value) return;
		this._feat = value;
		this.dispatchEvent(new egret.Event(PlayerInfoVO.CHANGEFEAT));
	}
	public getFeat(): number {
		return this._feat;
	}

	public setAwake(value: number): void {
		if (this._awake == value) return;
		this._awake = value;
		this.dispatchEvent(new egret.Event(PlayerInfoVO.CHANGAWAKE));
	}
	public getAwake(): number {
		return this._awake;
	}
}