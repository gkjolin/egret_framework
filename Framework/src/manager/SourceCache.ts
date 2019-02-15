class SourceCache extends egret.EventDispatcher {
	private _cacheDic: Object;
	private static _instance: SourceCache;

	private _loadingDic: Object;//保存正在加载的url

	//加载帧动画
	private _animationLoader: AnimationLoader;//帧动画加载器
	private _animationLoadingList: Array<string>;//保存正在加载帧动画url
	private _animationLoading: boolean = false;

	private _textureLoader: TextureLoader;//纹理加载器
	private _textureLoadingList: Array<string>;//保存正在加载纹理url
	private _textureLoading: boolean = false;

	private _effectLoader: AnimationLoader;
	private _effectLoadingList: Array<string>;
	private _effectLoading: boolean;

	private _imageLoader: ImageLoader;
	private _imageLoadingList: Array<string>;
	private _imageLoading: boolean;

	private _mapTileLoader: ImageLoader;
	private _mapTileLoadingList: Array<string>;
	private _mapTileLoading: boolean;

	private _waitForDispose: Array<Object>;


	public static LOAD_ANIMATION_COMPLETE: string = "LOAD_ANIMATION_COMPLETE";
	public static LOAD_TEXTURE_COMPLETE: string = "LOAD_TEXTURE_COMPLETE";
	public static LOAD_EFFECT_COMPLETE: string = "LOAD_EFFECT_COMPLETE";
	public static LOAD_PIC_COMPLETE: string = "LOAD_PIC_COMPLETE";

	public constructor() {
		super();
		this._cacheDic = new Object();
		this._loadingDic = new Object();

		this._animationLoadingList = new Array();
		this._animationLoader = new AnimationLoader();
		this._animationLoader.addEventListener(AnimationLoader.COMPLETE, this.animationLoadComplete, this);

		this._textureLoadingList = new Array();
		this._textureLoader = new TextureLoader();
		this._textureLoader.addEventListener(TextureLoader.COMPLETE, this.textureLoadComplete, this);

		this._effectLoadingList = new Array();
		this._effectLoader = new AnimationLoader();
		this._effectLoader.addEventListener(AnimationLoader.COMPLETE, this.effectLoadComplete, this);

		this._imageLoadingList = new Array();
		this._imageLoader = new ImageLoader();
		this._imageLoader.addEventListener(ImageLoader.COMPLETE, this.imageLoadComplete, this);

		this._mapTileLoadingList = new Array();
		this._mapTileLoader = new ImageLoader();
		this._mapTileLoader.addEventListener(ImageLoader.COMPLETE, this.mapTileLoadComplete, this);

		TimerManager.getInstance().add(15000, this.checkRes, this);
		TimerManager.getInstance().add(30000, this.desMsg, this);
	}

	private desMsg(): void {
		TimerManager.getInstance().clearAllMsgTimer();
	}

	//把一段时间不用的资源清理掉
	private checkRes(): void {
		var n: any;
		if (this._waitForDispose == null) {
			this._waitForDispose = new Array();
		}
		for (n in this._cacheDic) {
			var obj = this._cacheDic[n];
			//动画资源如果30秒没有使用就销毁，技能特效不销毁
			if (is(obj, "MovieClipData")) {
				var mc = <MovieClipData>obj;
				if (mc.getTimes() == 0 && (getTimer() - mc.getLastTime()) > 10000) {
					if (this._waitForDispose.indexOf(mc) < 0) {
						this._waitForDispose.push(mc);
					}
				}
			}
			else if (is(obj, "CustomTexture")) {
				var image = <CustomTexture>obj;
				if (image.getTimes() == 0) {
					if (image.canGC && this._waitForDispose.indexOf(image) < 0) {
						this._waitForDispose.push(image);
					}
				}
			}
		}
		if (this._waitForDispose.length > 0) {
			TimerManager.getInstance().add(100, this.disposeRes, this);
		}
	}
	private disposeRes(): void {
		if (this._waitForDispose.length == 0) {
			TimerManager.getInstance().remove(100, this.disposeRes, this);
			return;
		}
		var res = this._waitForDispose.shift();
		if (is(res, "MovieClipData")) {
			var mc = <MovieClipData>res;
			if (mc.getTimes() == 0) {
				mc.dispose();
				this.gcMovieClipData(mc.url);
				mc = null;
			}
		}
		else if (is(res, "CustomTexture")) {
			var image = <CustomTexture>res;
			if (image.getTimes() == 0) {
				image.dispose();
				this.gcCusteomTexture(image.url);
				image = null;
			}
		}
		res = null;
	}

	//效果加载
	private effectLoadComplete(event: ParamEvent): void {
		var url: string = event.data.url;
		var mc: MovieClipData = event.data.mc;
		delete this._loadingDic[url];
		this._cacheDic[url] = mc;
		// this._cacheDic[url] = this._effectLoader.movieClipData;
		this.dispatchEvent(new ParamEvent(SourceCache.LOAD_EFFECT_COMPLETE, { url: url, mc: mc }));
		this._effectLoading = false;
		this.loadEffect();
	}

	//帧动画加载完毕
	private animationLoadComplete(event: ParamEvent): void {
		var url: string = event.data.url;
		var mc: MovieClipData = event.data.mc;
		delete this._loadingDic[url];
		this._cacheDic[url] = mc;
		// this._cacheDic[url] = this._animationLoader.movieClipData;
		this.dispatchEvent(new ParamEvent(SourceCache.LOAD_ANIMATION_COMPLETE, { url: url, mc: mc }));
		this._animationLoading = false;
		this.loadAnimation();
		this.checkLoadImage();
	}

	//纹理资源加载完成（其实也是png和json）
	//因为只有一个资源，所以就一直存着好了
	private textureLoadComplete(event: ParamEvent): void {
		var url: string = event.data.url;
		var sp: CustomSpriteSheet = event.data.sp;
		delete this._loadingDic[url];
		this._cacheDic[url] = sp;
		this.dispatchEvent(new ParamEvent(SourceCache.LOAD_TEXTURE_COMPLETE, { url: url, texture: sp }));
		this._textureLoading = false;
		this.loadTexture();
		this.checkLoadImage();
	}

	//普通图片加载完成
	private imageLoadComplete(event: ParamEvent): void {
		var url: string = event.data.url;
		var ct: CustomTexture = event.data.ct;
		delete this._loadingDic[url];
		// this._cacheDic[url] = ct;
		this.dispatchEvent(new ParamEvent(SourceCache.LOAD_PIC_COMPLETE, { url: url, pic: ct }));
		this._imageLoading = false;
		this.loadImage();
	}

	//地图块加载完成
	private mapTileLoadComplete(event: ParamEvent): void {
		var url: string = event.data.url;
		var ct: CustomTexture = event.data.ct;
		delete this._loadingDic[url];
		// this._cacheDic[url] = ct;
		this.dispatchEvent(new ParamEvent(SourceCache.LOAD_PIC_COMPLETE, { url: url, pic: ct }));
		this._mapTileLoading = false;
		this.loadMapTile();
	}

	//加载效果
	private loadEffect(): void {
		if (this._effectLoading) {
			return;
		}
		if (this._effectLoadingList.length > 0) {
			var url: string = this._effectLoadingList.shift();
			this._effectLoading = true;
			this._effectLoader.load(url);
		}
	}

	//加载帧动画
	private loadAnimation(): void {
		if (this._animationLoading) {
			return;
		}
		if (this._animationLoadingList.length > 0) {
			var url: string = this._animationLoadingList.shift();
			this._animationLoading = true;
			this._animationLoader.load(url);
		}
	}

	//加载纹理资源
	private loadTexture(): void {
		if (this._textureLoading) {
			return;
		}
		if (this._textureLoadingList.length > 0) {
			var url: string = this._textureLoadingList.shift();
			this._textureLoading = true;
			this._textureLoader.load(url);
		}
	}

	//加载普通图片
	private loadImage(): void {
		if (this._imageLoading) {
			return;
		}
		if (this._imageLoadingList.length > 0) {
			var url: string = this._imageLoadingList.shift();
			this._imageLoading = true;
			this._imageLoader.load(url);
		}
	}

	//加载地图块
	private loadMapTile(): void {
		if (this._mapTileLoading) {
			return;
		}
		if (this._mapTileLoadingList.length > 0) {
			var url: string = this._mapTileLoadingList.shift();
			this._mapTileLoading = true;
			this._mapTileLoader.load(url);
		}
	}

	public static getInstance(): SourceCache {
		if (this._instance == null) {
			this._instance = new SourceCache();
		}
		return this._instance;
	}

	public load(url: string, type: string, isPre: boolean = false): void {
		if (url == null) return;
		url = rURL(url);
		if (this.isLoading(url) || this.has(url)) return;
		this._loadingDic[url] = true;
		switch (type) {
			case ResourceType.ANIMATION:
				if (isPre) {
					this._animationLoadingList.unshift(url);
				}
				else {
					this._animationLoadingList.push(url);
				}
				this.loadAnimation();
				break;
			case ResourceType.TEXTURE:
				this._textureLoadingList.push(url);
				this.loadTexture();
				break;
			case ResourceType.EFFECT:
				this._effectLoadingList.push(url);
				this.loadEffect();
				break;
			case ResourceType.IMAGE:
				this._imageLoadingList.push(url);
				//普通图片的优先级最低，要等特效和动画的几个资源都加完了才加载这些普通图片
				this.checkLoadImage();
				break;
			case ResourceType.MAPTILE:
				if (isPre) {
					this._mapTileLoadingList.unshift(url);
				}
				else {
					this._mapTileLoadingList.push(url);
				}
				this.loadMapTile();
				break;
		}
	}

	//判断资源是否正在加载
	public isLoading(url: string): boolean {
		if (this._loadingDic[url] == undefined || this._loadingDic[url] == null) {
			return false;
		}
		return true;
	}

	//判断是否有该资源
	public has(url: string): boolean {
		if (this._cacheDic[url] != null && this._cacheDic[url] != undefined) {
			return true;
		}
		return false;
	}

	//获取帧动画
	public getAnimation(url: string): MovieClipData {
		return this._cacheDic[url];
	}

	//获取纹理
	public getSP(url: string): CustomSpriteSheet {
		return this._cacheDic[url];
		// var sp: CustomSpriteSheet = this._cacheDic[url];
		// if (sp) {
		// 	return sp.getTexture(resName);
		// }
		// return null;
	}

	//获取效果资源
	public getEffect(url: string): MovieClipData {
		return this._cacheDic[url];
	}

	//获取图片
	public getPicTexture(url: string): CustomTexture {
		return this._cacheDic[url];
	}

	//检查加载图片
	private checkLoadImage(): void {
		if (this._textureLoadingList.length == 0 && this._animationLoadingList.length == 0
			&& this._mapTileLoadingList.length == 0) {
			this.loadImage();
		}
	}

	public gcRes(): void {
		// var n: any;
		// for (n in this._cacheDic) {
		// 	var obj = this._cacheDic[n];
		// 	if (is(obj, "MovieClipData")) {
		// 		var mc = <MovieClipData>obj;
		// 		mc.dispose();
		// 		this.gcMovieClipData(mc.url);
		// 		mc = null;
		// 	}
		// 	else if (is(obj, "CustomTexture")) {
		// 		var image = <CustomTexture>obj;
		// 		image.dispose();
		// 		this.gcCusteomTexture(image.url);
		// 		image = null;
		// 	}
		// }
	}

	private gcCusteomTexture(url: string): void {
		delete this._cacheDic[url];
		RES.destroyRes(url);
		// trace(StringUtil.substitute("gcCusteomTexture result = {0}", RES.destroyRes(url)));
	}

	private gcMovieClipData(url: string): void {
		delete this._cacheDic[url];
		RES.destroyRes(url + ".png");
		RES.destroyRes(url + ".json");
	}

	public getWaitDesContent(): string {
		var content: string = "";
		var list = this._waitForDispose;
		if (list) {
			for (var i = 0; i < list.length; i++) {
				var res = list[i];
				content += res["url"];
				content += "\n";
			}
		}
		content += ("总数是：" + list.length);
		return content;
	}
}