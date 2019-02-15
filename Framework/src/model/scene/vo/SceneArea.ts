class SceneArea {
	private _left: number;
	private _top: number;
	private _right: number;
	private _buttom: number;
	public constructor(left: number = 0, top: number = 0, right: number = 0, buttom: number = 0) {
		this._left = left;
		this._top = top;
		this._right = right;
		this._buttom = buttom;
	}

	public getLeft():number{
		return this._left;
	}

	public getTop():number{
		return this._top;
	}

	public getRight():number{
		return this._right;
	}

	public getButtom():number{
		return this._buttom;
	}

}