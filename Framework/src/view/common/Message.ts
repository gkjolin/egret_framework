class Message {
	private static _msgContainer: CommonSprite;
	private static _msgList: Array<MessageItem>;

	private static _startTime: number = 0;

	private static _timerIndex: string;

	public static GAP: number = 41;

	public constructor() {
	}
	public static show(str: string, textColor: number = 0xffe4c7, delay: number = 3, size: number = 18, mouselocal: boolean = false, _x: number = 0, _y: number = 0): void {
		if (str == "" || str == null) return;

		if (this._msgList == null) {
			this._msgList = [];
		}
		if (GameContent.gameLayers.noticeLayer.visible == false)
			return;
		if (this._msgContainer == null) {
			this._msgContainer = new CommonSprite();
			GameContent.gameLayers.noticeLayer.addChild(this._msgContainer);
		}
		var msgTxt: MessageItem = new MessageItem();
		msgTxt.init(str, textColor, delay, size, "Microsoft YaHei", false, 0x21290b);
		msgTxt.x = GameContent.stageWidth - msgTxt.getMyWidth() >> 1;
		msgTxt.y = GameContent.stageHeight - msgTxt.getMyHeight() >> 1;

		this._msgList.push(msgTxt);
		this.updateTargetPos();

	}
	private static updateTargetPos(): void {
		var item: MessageItem;
		for (var i: number = 0; i < this._msgList.length; i++) {
			item = this._msgList[i];
			item.setIndex(this._msgList.length - i);
		}
		this._timerIndex = TimerManager.getInstance().getTimerKey();
		TimerManager.getInstance().removeForMsg(this._timerIndex);
		TimerManager.getInstance().addForMsg(600, () => { Message.onShowRest() }, this._timerIndex);
	}

	public static onShowRest(): void {
		if (this._msgList && this._msgList.length > 0) {
			this._startTime = getTimer();
			this.onMsgTime(this._msgList.shift());
		}
		else {
			TimerManager.getInstance().removeForMsg(this._timerIndex);
		}
	}
	private static onMsgTime(msgTxt: MessageItem): void {
		this._msgContainer.addChild(msgTxt);
		// msgTxt.setIndex(this._msgContainer.numChildren);
		egret.Tween.get(msgTxt).to({ y: msgTxt.y - msgTxt.targetY }, 500).wait(500).call(() => {
			this.onCompleteFunction1(msgTxt);
		});
	}
	private static onCompleteFunction1(item: MessageItem): void {
		egret.Tween.get(item).to({ "alpha": 0 }, 500).call(() => {
			// this.onCompleteFunction1(item);
			if (item != null && item.parent != null) {
				item.parent.removeChild(item);
				item.destroy();
			}
		});
	}
}