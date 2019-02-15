class SCMD13501 {
	public role_id:number;
	public icon:number;
	public name:string;
	public round:number;
	public level:number;
	public rank_partners:any[]=[NodeRank_partners];

	public list=[{name:"role_id",type:"Int64"},{name:"icon",type:"Int32"},{name:"name",type:"string"},{name:"round",type:"Int8"},{name:"level",type:"Int16"},{name:"rank_partners",type:"array"}];
	public constructor() {}
}