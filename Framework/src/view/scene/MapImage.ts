class MapImage extends egret.Sprite {
	private _w: number;
	private _h: number;
	private _tileDic: Object;
	private _rootURL: string;
	private _currentID: number;
	private _model: SceneModel;
	protected _loadRectWidth: number = 1000;
	protected _loadRectHeight: number = 1000;
	protected _loadingList: Array<MapTile>;
	private _loadingGap: number = 0;
	public constructor() {
		super();
		this.init();
	}

	private init(): void {
		this._model = SceneModel.getInstance();
	}

	private initTiles(): void {
		var cols: number = Math.ceil(this._w / TileUtil.tileWidth);
		var rows: number = Math.ceil(this._h / TileUtil.tileHeight);
		this._loadingList = new Array();
		var focusPos: Point = this._model.getFocusPos();
		var rect;
		if (focusPos) {
			rect = new egret.Rectangle(focusPos.x, focusPos.y, GameContent.stageWidth, GameContent.stageHeight);
			return;
		}
		for (var i: number = 0; i < cols; i++) {
			for (var j: number = 0; j < rows; j++) {
				var numStr: string = Tools.changeToNumberStr(i + 1) + Tools.changeToNumberStr(j + 1);
				var tile: MapTile = new MapTile(this, numStr);
				tile.url = this._rootURL + numStr + ".jpg";
				tile.x = i * TileUtil.tileWidth;
				tile.y = j * TileUtil.tileHeight;
				tile.col = i;
				tile.row = j;
				this._tileDic[numStr] = tile;
				if (SceneModel.getInstance().isSceneMapResLoaded()) {
					// if (rect) {
					// 	if (this.checkTileInRect(tile, rect)) {
					// 		tile.doLoad();
					// 		this.addChild(tile);
					// 	}
					// }
					// else {
					// 	tile.doLoad();
					// 	this.addChild(tile);
					// }
					this._loadingGap = 3;
				}
				else {
					this._loadingGap = 10;
				}
				this._loadingList.push(tile);
			}
		}
		TimerManager.getInstance().add(this._loadingGap, this.doLoadHandler, this);
		// var gap: number = 10;
		// if (SceneModel.getInstance().isSceneMapResLoaded()) {
		// }
		// else {
		// 	TimerManager.getInstance().add(10, () => { this.doLoadHandler() }, this._timerIndex);
		// }
	}

	private doLoadHandler(): void {
		if (this._loadingList && this._loadingList.length > 0) {
			var tile: MapTile = this._loadingList.shift();
			if (!tile.getHasLoad()) {
				tile.doLoad();
			}
			if (!this.contains(tile)) {
				this.addChild(tile);
			}
		}
	}

	/**********************外部方法******************************/

	//构造场景
	public build(w: number, h: number, url: string): void {
		this._w = w;
		this._h = h;
		this._currentID = this._model.id;
		this._rootURL = rURL(url);
		this._tileDic = new Object();
		this.initTiles();
	}

	//判断地图块是否在加载矩形中
	public checkTileInRect(tileItem: MapTile, rect: egret.Rectangle): boolean {
		var offSet: number = 2;
		this._loadRectWidth = GameContent.stageWidth;
		this._loadRectHeight = GameContent.stageHeight;
		//新位置屏幕中心点
		var ox: number = rect.x + (rect.width >> 1);
		var oy: number = rect.y + (rect.height >> 1);
		//在加载区域内的加载，没在的话要移除
		var startCol: number = Math.floor((ox - (this._loadRectWidth >> 1)) / TileUtil.tileWidth) - offSet;
		var startRow: number = Math.floor((oy - (this._loadRectHeight >> 1)) / TileUtil.tileHeight) - offSet;
		var minRow: number = 0;
		var minCol: number = 0;
		var maxCol = Math.floor((this._w - this._loadRectWidth) / TileUtil.tileWidth);
		var maxRow = Math.floor((this._h - this._loadRectHeight) / TileUtil.tileHeight);
		startCol = startCol < minCol ? minCol : startCol;
		startRow = startRow < minRow ? minRow : startRow;
		startCol = startCol > maxCol ? maxCol : startCol;
		startRow = startRow > maxRow ? maxRow : startRow;
		var loadCols: number = Math.ceil(this._loadRectWidth / TileUtil.tileWidth);
		var loadRows: number = Math.ceil(this._loadRectHeight / TileUtil.tileHeight);
		var endCol: number = startCol + offSet + loadCols;
		var endRow: Number = startRow + offSet + loadRows;
		if (tileItem.col >= startCol && tileItem.col <= endCol && tileItem.row >= startRow && tileItem.row <= endRow) {
			return true;
		}
		return false;
	}

	//加载矩形地图
	public load(rect: egret.Rectangle): void {
		var offSet: number = 2;
		this._loadRectWidth = GameContent.stageWidth;
		this._loadRectHeight = GameContent.stageHeight;
		//新位置屏幕中心点
		var ox: number = rect.x + (rect.width >> 1);
		var oy: number = rect.y + (rect.height >> 1);
		//在加载区域内的加载，没在的话要移除
		var startCol: number = Math.floor((ox - (this._loadRectWidth >> 1)) / TileUtil.tileWidth) - offSet;
		var startRow: number = Math.floor((oy - (this._loadRectHeight >> 1)) / TileUtil.tileHeight) - offSet;
		var minRow: number = 0;
		var minCol: number = 0;
		var maxCol = Math.floor((this._w - this._loadRectWidth) / TileUtil.tileWidth);
		var maxRow = Math.floor((this._h - this._loadRectHeight) / TileUtil.tileHeight);
		startCol = startCol < minCol ? minCol : startCol;
		startRow = startRow < minRow ? minRow : startRow;
		startCol = startCol > maxCol ? maxCol : startCol;
		startRow = startRow > maxRow ? maxRow : startRow;
		var loadCols: number = Math.ceil(this._loadRectWidth / TileUtil.tileWidth);
		var loadRows: number = Math.ceil(this._loadRectHeight / TileUtil.tileHeight);
		var endCol: number = startCol + offSet + loadCols;
		var endRow: Number = startRow + offSet + loadRows;
		// var endCol: number = startCol + offSet + loadCols + offSet
		// var endRow: Number = startRow + offSet + loadRows + offSet;
		//可视区域的起始行列
		// var visibleStartCol: number = Math.floor(rect.x / TileUtil.tileWidth);
		// var visibleStartRow: number = Math.floor(rect.y / TileUtil.tileHeight);
		// var visibleEndCol: number = visibleStartCol + Math.ceil(rect.width / TileUtil.tileWidth);
		// var visibleEndRow: number = visibleStartRow + Math.ceil(rect.height / TileUtil.tileHeight);
		//可视区域的tile数目
		var i: number = 0;
		var tileItem: MapTile;
		for (var s in this._tileDic) {
			tileItem = this._tileDic[s];
			if (tileItem.col >= startCol && tileItem.col <= endCol && tileItem.row >= startRow && tileItem.row <= endRow) {
				if (this.contains(tileItem) == false) {
					if (this._loadingList.indexOf(tileItem) == -1) {
						this._loadingList.push(tileItem);
					}
				}
			}
			else {
				if (this.contains(tileItem)) {
					this.removeChild(tileItem);
					// tileItem.unLoad();
				}
				var index: number = this._loadingList.indexOf(tileItem);
				if (index > -1) {
					this._loadingList.splice(index, 1);
				}
			}
		}
	}

	public dispose(): void {
		var i: any;
		var tile: MapTile;
		for (i in this._tileDic) {
			tile = this._tileDic[i];
			tile.dispose();
			tile = null;
		}
		this._tileDic = null;
		TimerManager.getInstance().remove(this._loadingGap, this.doLoadHandler, this);
	}
}