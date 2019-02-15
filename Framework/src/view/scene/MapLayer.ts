class MapLayer extends CommonSprite {
	private _container: CommonSprite;
	private _model: SceneModel;
	private _mapImage: MapImage;
	private _scrollRangeX: number = 0;
	private _scrollRangeY: number = 0;
	private _isTweenScroll: boolean = true;
	private _tweenValue: number = 0.08;
	private _positionChanged: boolean = false;
	private _tempX: number;
	private _tempY: number;
	private _buttomImage: PicLoader;
	public constructor(parent: CommonSprite) {
		super();
		this._container = parent;
		this.init();
	}

	private init(): void {
		this._model = SceneModel.getInstance();
		this._mapImage = new MapImage();
		this.addChild(this._mapImage);
	}

	//滚屏
	public scroll(): boolean {
		var frontPosChange: boolean = false;
		var oldX: number = this._container.x;
		var oldY: number = this._container.y;
		if (this._isTweenScroll) {
			var focusPos: Point = this._model.getFocusPos();
			if (focusPos == null) {
				return;
			}
			if (this._positionChanged) {
				this._tempX = this._container.x;
				this._tempY = this._container.y;
				//横坐标滚屏
				if (this._tempX + focusPos.x > this._scrollRangeX) {
					this._tempX -= (this._tempX + focusPos.x - this._scrollRangeX) * this._tweenValue;
					this._container.x = this._tempX - 0.5 >> 0;
				}
				else if (this._tempX + focusPos.x < -this._scrollRangeX) {
					this._tempX -= (this._tempX + focusPos.x + this._scrollRangeX) * this._tweenValue;
					this._container.x = this._tempX - 0.5 >> 0;
				}
				//纵坐标滚屏
				if (this._tempY + focusPos.y > this._scrollRangeY) {
					this._tempY -= (this._tempY + focusPos.y - this._scrollRangeY) * this._tweenValue;
					this._container.y = this._tempY - 0.5 >> 0;
				}
				else if (this._tempY + focusPos.y < -this._scrollRangeY) {
					this._tempY -= (this._tempY + focusPos.y + this._scrollRangeY) * this._tweenValue;
					this._container.y = this._tempY - 0.5 >> 0;
				}
				// if (Math.abs(this._container.x + focusPos.x) <= (this._scrollRangeX + 10) && Math.abs(this._container.y + focusPos.y) <= (this._scrollRangeY + 10)) {
				// 	this._positionChanged = false;
				// }
			}
			else {
				if (this._container.x + focusPos.x > this._scrollRangeX) {
					this._container.x = -focusPos.x + this._scrollRangeX >> 0;
				}
				else if (this._container.x + focusPos.x < -this._scrollRangeX) {
					this._container.x = -focusPos.x - this._scrollRangeX >> 0;
				}

				if (this._container.y + focusPos.y > this._scrollRangeY) {
					this._container.y = -focusPos.y + this._scrollRangeY >> 0;
				}
				else if (this._container.y + focusPos.y < -this._scrollRangeY) {
					this._container.y = -focusPos.y - this._scrollRangeY >> 0;
				}
			}
		}
		GameContent.gameLayers.sceneLayer.x = this._container.x;
		GameContent.gameLayers.sceneLayer.y = this._container.y;
		return oldX != this._container.x || oldY != this._container.y;
	}

	
	//构造场景
	public build(): void {
		var w: number = this._model.sceneWidth;
		var h: number = this._model.sceneHeight;
		if (this._buttomImage == null) {
			this._buttomImage = new PicLoader(PicLoader.MAPTILE);
			this.addChildAt(this._buttomImage, 0);
		}
		var url: string = UrlUtil.getSmallMapURL(this._model.resID);
		this._buttomImage.load(url, true);
		this._buttomImage.setWH(w, h);
		url = UrlUtil.getMapTileURL(this._model.resID);
		this._mapImage.build(w, h, url);
		SceneModel.getInstance().storeSceneRes();
	}

	//更新屏幕
	public update(): void {
		var focusPos: Point = this._model.getFocusPos();
		if (focusPos == null) {
			return;
		}
		this._mapImage.load(new egret.Rectangle(focusPos.x, focusPos.y, GameContent.stageWidth, GameContent.stageHeight));
	}

	public setPositionChanged(value: boolean): void {
		this._positionChanged = value;
	}

	public getPositionChanged(): boolean {
		return this._positionChanged;
	}

	public getIsTweenScroll(): boolean {
		return this._isTweenScroll;
	}

	public dispose(): void {
		super.dispose();
		this._positionChanged = false;
		if (this._mapImage) {
			this._mapImage.dispose();
		}
		if (this._buttomImage && this.contains(this._buttomImage)) {
			this.removeChild(this._buttomImage);
			this._buttomImage.dispose();
			this._buttomImage = null;
		}
	}
}