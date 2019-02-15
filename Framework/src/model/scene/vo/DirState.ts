class DirState extends egret.EventDispatcher{
	public static dirList:Array<number> = [2,1,4,7,8,9,6,3];

	private _state:number;
	private _scale:number = 1;
	private _frame:number = 2;
	private _stateList:Array<number>;
	private _stateStep:number=0;
	private _isChanged:boolean;

	public static CHANGE:string = "DirState_change";

	public isLock:boolean = false;
	public constructor() {
		super();
	}

	//设置状态
	public setState(value:number):void 
	{
		this._stateList = [];
		this.setState0(value);
	}
	
	//重置
	public revert():void 
	{
		this._stateList = [2];
		this._state = 0;
		this._scale = 1;
		this._frame = 2;
		this._stateStep = 0;
		this._isChanged = false;
	}
	
	//获取当前状态
	public getState():number 
	{
		return this._state;
	}
	
	//设置状态
	private setState0(value:number):void 
	{
		if (this.isLock) return;	
		if (this._state != value) 
		{				
			this._state = value;
			this._isChanged = true;
			switch(this._state) 
			{
				case 7:
					this._frame = 9;
					this._scale = -1;
					break;
				case 4:
					this._frame = 6;
					this._scale = -1;
					break;
				case 1:
					this._frame = 3;
					this._scale = -1;
					break;
				default:
					this._frame = this._state;
					this._scale = 1;
					break;
			}
			this.dispatchEvent(new ParamEvent(DirState.CHANGE));
		}
		else 
		{
			this._isChanged = false;
		}
	}
	
	//每帧状态
	public stepState():void 
	{
		if(this._stateStep < this._stateList.length) 
		{
			this.setState0(this._stateList[this._stateStep]);
			this._stateStep++;
		}
	}
	
	//是否改变
	public getIsChanged():boolean 
	{
		return this._isChanged;
	}

	public getScale():number {
		return this._scale;
	}

	//获取对应帧数
	public getFrame():number 
	{
		return this._frame;
	}
		
	public getDirVector():Point 
	{
		switch(this._state) {
			case 2:
				return new Point(0,1);
			case 3:
				return new Point(0.707,0.707);
			case 6:
				return new Point(1,0);
			case 9:
				return new Point(0.707,-0.707);
			case 8:
				return new Point(0,-1);
			case 7:
				return new Point(-0.707,-0.707);
			case 4:
				return new Point(-1,0);
			case 1:
				return new Point(-0.707,0.707);
			default:
				return null;
		}
	}
}