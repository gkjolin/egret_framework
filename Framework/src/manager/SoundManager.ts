class SoundManager extends egret.EventDispatcher {
	private static _instance: SoundManager;
	private _url: string;
	public constructor() {
		super();
	}

	public static getInstance(): SoundManager {
		if (SoundManager._instance == null) {
			SoundManager._instance = new SoundManager();
		}
		return SoundManager._instance;
	}

	public play(url: string): void {
		RES.getResByUrl(url, this.playSound, this, RES.ResourceItem.TYPE_SOUND);
	}

	private playSound(sound: egret.Sound): void {
		Message.show("playSound");
		sound.play(0, 1);
	}
}