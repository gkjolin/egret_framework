class MonConfigVo {
	public typeID: number = 0;
	public name: string;
	public monsterType: number = 0;
	public resID: number = 0;
	public lev: number = 0;
	public hp: number = 0;
	public attSpeed: number = 0;
	public attType:number = 0;
	public moveSpeed: number = 0;
	public propertyVo: PropertyVO;
	public constructor() {
		this.propertyVo = new PropertyVO();
	}
}