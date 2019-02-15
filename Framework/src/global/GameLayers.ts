class GameLayers {
	public mainUILayer: CommonSprite; //主界面
	public winMapLayer: CommonSprite; //窗口地图
	public sceneRootLayer: CommonSprite; //场景最底层
	public sceneLayer: CommonSprite; //场景层
	public windowLayer: CommonSprite; //弹窗
	public iconLayer: CommonSprite; //图标层
	public noticeLayer: CommonSprite; //
	public topLayer: CommonSprite;
	public tipsLayer: CommonSprite; //TIP层
	public guideLayer: CommonSprite; //新手指引
	public constructor(parent: egret.DisplayObjectContainer) {
		this.sceneRootLayer = new CommonSprite();
		parent.addChild(this.sceneRootLayer);
		this.sceneRootLayer.touchEnabled = false;

		this.sceneLayer = new CommonSprite();
		parent.addChild(this.sceneLayer);
		this.sceneLayer.touchEnabled = false;

		this.winMapLayer = new CommonSprite();
		parent.addChild(this.winMapLayer);

		this.mainUILayer = new CommonSprite();
		parent.addChild(this.mainUILayer);

		this.iconLayer = new CommonSprite();
		parent.addChild(this.iconLayer);

		this.windowLayer = new CommonSprite();
		parent.addChild(this.windowLayer);

		this.noticeLayer = new CommonSprite();
		parent.addChild(this.noticeLayer);

		this.topLayer = new CommonSprite();
		parent.addChild(this.topLayer);

		this.tipsLayer = new CommonSprite();
		parent.addChild(this.tipsLayer);

		this.guideLayer = new CommonSprite();
		parent.addChild(this.guideLayer);
	}

	public getSceneRootLayerNum(): number {
		var result: number = 0;
		var n: number = this.sceneRootLayer.numChildren;
		return result;
	}

	public getContainerChildNum(container: egret.DisplayObjectContainer): number {
		var result: number = 0;
		var n: number = container.numChildren;
		var obj: egret.DisplayObject;
		for (var i: number = 0; i < n; i++) {
			obj = container.getChildAt(i);
			if (is(obj, 'egret.DisplayObjectContainer')) {
				result += this.getContainerChildNum(obj as egret.DisplayObjectContainer);
			} else {
				result += 1;
			}
		}
		return result;
	}
}
