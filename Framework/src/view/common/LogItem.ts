class LogItem extends eui.ItemRenderer {
	private txtContent: CustomLabel;
	public constructor() {
		super();
		this.addEventListener(eui.UIEvent.COMPLETE, this.uiComplementHandler, this);
		this.skinName = "resource/game_skins/common/LogItemSkin.exml";
	}

	private uiComplementHandler(): void {
	}

	protected dataChanged(): void {
		this.txtContent.htmlText = this.data;
	}
}