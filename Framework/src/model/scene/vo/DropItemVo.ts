class DropItemVo {
	public id: number = 0;
	public num: number = 0;
	public x: number = 0;
	public y: number = 0;
	public uid: number = 0;

	private static INDEX: number = 0;
	public constructor() {
		DropItemVo.INDEX++;
		this.uid = DropItemVo.INDEX;
	}
}