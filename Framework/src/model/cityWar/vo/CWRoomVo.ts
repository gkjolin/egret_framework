class CWRoomVo {
	private _fightList: Array<string>;//里面的id都是玩家id
	public constructor() {
		this._fightList = new Array();
	}

	public checkRelated(attID: string, defID: string): string {
		var a = this;
		var indexAtt: number = a._fightList.indexOf(attID);
		var indexDef: number = a._fightList.indexOf(defID);
		//2个id都在列表中
		if (indexAtt > - 1 && indexDef > -1) {
			return "";
		}
		//攻击玩家id在列表中，防守方不在列表中
		if (indexAtt > -1 && indexDef < 0) {
			return defID;
		}
		//攻击玩家id不在列表中，防守方在列表中
		if (indexAtt < 0 && indexDef > -1) {
			return attID;
		}
		//2个id都不在列表中
		if (indexAtt < 0 && indexDef < 0) {
			return "";
		}
		return "";
	}

	public addRelation(playerID: string): void {
		if (playerID != "") {
			this._fightList.push(playerID);
		}
	}

	//id是玩家id
	public removeRelation(id: string): boolean {
		var index: number = this._fightList.indexOf(id);
		if (index >= 0) {
			this._fightList.splice(index, 1);
			return true;
		}
		return false;
	}

	public contains(id: string): boolean {
		return this._fightList.indexOf(id) > -1;
	}

	public get fightList() {
		return this._fightList;
	}

	public get num() {
		var list = this._fightList;
		if (list == null) {
			return 0;
		}
		return list.length;
	}
}