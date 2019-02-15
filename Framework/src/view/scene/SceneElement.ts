class SceneElement extends CommonSprite implements IElement, IDepthObject {
	private _sceneModel: SceneModel;
	private _isInteractive: boolean = true;
	private _mask: boolean = false;//是否被遮挡
	public constructor(type: string = "SceneElement") {
		super(type);
		this._sceneModel = SceneModel.getInstance();
	}

	public setSelect(value: boolean): void {

	}

	//实现接口	
	public getId(): any {
		return "";
	}

	public getType(): string {
		return "";
	}

	//是否交互
	public setIsInteractive(value: boolean): void {
		this._isInteractive = value;
	}
	public getIsInteractive(): boolean {
		return this._isInteractive;
	}

	//是否碰撞
	public isHit(point: Point): boolean {
		if (!this.visible || parent == null)
			return false;
		if (point.x > this.x && point.x < this.x + this.width && point.y > this.y && point.y < this.y + this.height) {
			return true;
		}
		return false;
	}

	//获取纵深
	public getEz(): number {
		return Math.floor(this.y);
	}

	//获取效果点
	public getEffectPoint(): Point {
		return new Point(0, 0);
	}

	public dispose(): void {
		super.dispose();
	}

	public set halfMask(value: boolean) {
		var a = this;
		if (a._mask == value) return;
		a._mask = value;
		if (a._mask == true) {
			if (a.alpha == 1)
				a.alpha = 0.5;
		}
		else {
			if (a.alpha == 0.5)
				a.alpha = 1;
		}
	}

	public get halfMask() {
		return this._mask;
	}
}