class PoseState extends egret.EventDispatcher {
	public static STAND: number = 0; 	//站立状态
	public static MOVE: number = 1; 		//走路状态
	public static HITED: number = 2; 	//受击状态
	public static ATTACK: number = 3; 	//攻击状态
	public static DEAD: number = 4; 		//死亡状态
	public static MOVEBACK: number = 5;	//击飞

	public static CHANGE: string = "PoseState_change";

	public canMove: boolean = true;

	private _state: number = -1;
	private _isChanged: boolean;
	private _preState: number;
	private _useType: number;//0是怪物，1是玩家

	public ownerID: string = "";//拥有者id
	public constructor(type: number = 0) {
		super();
		this._useType = type;
	}

	public set useType(value: number) {
		this._useType = value;
	}

	public setState(value: number): void {
		this._isChanged = false;
		if (this.canTransite(value) == false) return;
		if (this._state != value || (this._useType == MonsterVO.PEOPLE_BOSS || this._useType == MonsterVO.PERSON_BOSS
			|| this._useType == MonsterVO.WAVE_BOSS || this._useType == MonsterVO.ROUND_BOSS)) {
			this._preState = this._state;
			this._state = value;
			this._isChanged = true;
			this.dispatchEvent(new ParamEvent(PoseState.CHANGE));
		}
	}

	public revert(): void {
		this._state = 0;
		this._isChanged = false;
		this._preState = 0;
		this.canMove = true;
	}

	private canTransite(value: number): boolean {
		if (this._state == PoseState.DEAD) {
			return false;
		}
		else if (this._state == PoseState.MOVE) {
			if (value == PoseState.HITED) {
				return false;
			}
		}
		else if (this._state == PoseState.ATTACK || this._state == PoseState.HITED) {
			if (value == PoseState.HITED) {
				return false;
			}
		}
		return true;
	}

	//获取当前状态
	public getState(): number {
		return this._state;
	}
	//获取上一个状态
	public getPreState(): number {
		return this._preState;
	}

	//状态是否有改变	
	public isChanged(): boolean {
		return this._isChanged;
	}

	public getLockMove(): boolean {
		if (this.canMove == false) return true;
		if (this._state == PoseState.MOVE
			|| this._state == PoseState.ATTACK
			|| this._state == PoseState.HITED
			|| this._state == PoseState.MOVEBACK) {
			return false;
		}
		return true;
	}
}