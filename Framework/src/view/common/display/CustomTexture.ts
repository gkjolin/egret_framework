class CustomTexture {
	private _useTime: number = 0;
	private _lastTime: number = 0;//最后使用的时间
	private _texture: egret.Texture;
	public url: string;
	public canGC: boolean = true;
	public constructor() {
	}

	public setTexture(t: egret.Texture): void {
		this._texture = t;
	}

	public get texture() {
		return this._texture;
	}

	public use(): void {
		this._useTime++;
		this._lastTime = getTimer();
	}

	public unUse(): void {
		this._useTime--;
	}

	public getTimes(): number {
		return this._useTime;
	}

	public getLastTime(): number {
		return this._lastTime;
	}

	public dispose(): void {
		if (this._texture) {
			this._texture.dispose();
			this._texture = null;
		}
		this._useTime = 0;
		this._lastTime = 0;
	}
}