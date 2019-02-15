class CCMD10000 {
	public plat_id:number;
	public unixtime:number;
	public plat_account:string;
	public ticket:string;
	public channel:string;
	public via:number;
	public svr_id:number;

	public list=[{name:"plat_id",type:"Int32"},{name:"unixtime",type:"Int32"},{name:"plat_account",type:"string"},{name:"ticket",type:"string"},{name:"channel",type:"string"},{name:"via",type:"Int8"},{name:"svr_id",type:"Int32"}];
	public constructor() {}
}