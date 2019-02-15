class SCMD13304 {
	public flash_time:number;
	public role_id:number;
	public name:string;
	public icon:number;
	public round:number;
	public level:number;
	public partner_list:any[]=[NodePartner_list];

	public list=[{name:"flash_time",type:"Int32"},{name:"role_id",type:"Int64"},{name:"name",type:"string"},{name:"icon",type:"Int32"},{name:"round",type:"Int8"},{name:"level",type:"Int16"},{name:"partner_list",type:"array"}];
	public constructor() {}
}