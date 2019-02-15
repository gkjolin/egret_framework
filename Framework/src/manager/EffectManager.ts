class EffectManager extends egret.EventDispatcher {
	public constructor() {
		super();
	}

	private static _instance: EffectManager;
	public static getInstance(): EffectManager {
		if (EffectManager._instance == null) {
			EffectManager._instance = new EffectManager();
		}
		return EffectManager._instance;
	}

	public showEffect(url: string, px: number, py: number, parent: Object, delay: number = 60, isLoop: boolean = false, cangc: boolean = false, lastTime: number = 0, isQueue: boolean = true,
		time: number = 0, autoRemove: boolean = true, startFrame: number = 1, endFrame: number = -1, delayToPlay: number = 0, childIndex: number = -1): UIEffect {
		var effect: UIEffect = new UIEffect("EffectManager");
		var offX: number = 0;
		var offY: number = 0;
		effect.showEffect(url, px + offX, py + offY, parent, delay, isLoop, cangc, lastTime, isQueue,
			time, autoRemove, startFrame, endFrame, delayToPlay, childIndex);
		return effect;
	}
}