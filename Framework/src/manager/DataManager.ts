class DataManager {
	private static _instance: DataManager;
	private _allConfigObj: Object;
	public constructor() {}

	public static getInstance(): DataManager {
		if (DataManager._instance == null) {
			DataManager._instance = new DataManager();
		}
		return DataManager._instance;
	}

	public setData(obj: Object): void {
		this._allConfigObj = obj;
	}

	public getObj(fileName: string): Object {
		if (this._allConfigObj) {
			return this._allConfigObj[fileName];
		}
		return null;
	}
}
