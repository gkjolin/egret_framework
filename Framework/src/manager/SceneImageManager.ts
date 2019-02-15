class SceneImageManager {
	private static _instance: SceneImageManager;
	public static imageTextNum: number = 0;
	private static IMAGETEXT_MAX: number = 15;
	public constructor() {
	}

	public static getInstance(): SceneImageManager {
		if (SceneImageManager._instance == null) {
			SceneImageManager._instance = new SceneImageManager();
		}
		return SceneImageManager._instance;
	}

	//飘伤害数字
	//isShow,true的话就一定会显示，如果是false的话，就要判断当前场景上的伤害数字是否满了，不满才显示
	public showDamage(container: egret.Sprite, value: number, srcX: number, srcY: number, angle: number, career: number = 0, isShow: boolean = false): void {
		if (SceneImageManager.imageTextNum > SceneImageManager.IMAGETEXT_MAX) {
			if (!isShow) {
				return;
			}
		}
		var damageTxt: SceneImageTxt = new SceneImageTxt(career);
		damageTxt.x = srcX;
		damageTxt.y = srcY;
		damageTxt.setData(value);
		container.addChild(damageTxt);
		var endX: number = srcX + Math.cos(angle) * 140;
		var endY: number = srcY + Math.sin(angle) * 100;
		egret.Tween.get(damageTxt).to({ x: endX, y: endY }, 150)
			.call(this.step1Finish, this, [damageTxt]);
		SceneImageManager.imageTextNum++;
	}

	private step1Finish(txt: SceneImageTxt): void {
		var endY: number = txt.y - 70;
		egret.Tween.get(txt).to({ y: endY }, 800)
			.call(this.removeTxt, this, [txt]);
	}

	private removeTxt(txt: SceneImageTxt): void {
		if (txt == null) return;
		if (txt.parent) {
			txt.parent.removeChild(txt);
		}
		txt.dispose();
		txt = null;
		SceneImageManager.imageTextNum--;
	}
}