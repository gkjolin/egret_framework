class BaseView extends Csprite {
	private _resGroupName: string;
	public constructor() {
		super();
	}
	public onOpenHandler(): void {

	}
	public onCloseHandler(): void {

	}
	//加载本模块资源组，value为资源组的名字
	public set resGroupName(value: string) {
		this._resGroupName = value;
		if (!RES.isGroupLoaded(this._resGroupName)) {
			RES.loadGroup(this._resGroupName);
			RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onReGroupLoadComplete, this);
		} else {
			this.onReGroupLoadComplete();
		}
	}
	//本模块的资源组加载完成
	protected onReGroupLoadComplete(): void {
		//由子类重载
	}
	public dispose(): void {
		super.dispose();
		RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onReGroupLoadComplete, this);
	}

	public onAdd(): void {

	}

	public onRemove(): void {

	}
}