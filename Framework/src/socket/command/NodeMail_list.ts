class NodeMail_list {
	public mail_id:number;
	public mail_title:string;
	public mail_content:string;
	public accessorys:any[]=[NodeAccessorys];
	public mail_read:number;
	public mail_award:number;
	public ctime:number;

	public list=[{name:"mail_id",type:"Int64"},{name:"mail_title",type:"string"},{name:"mail_content",type:"string"},{name:"accessorys",type:"array"},{name:"mail_read",type:"Int8"},{name:"mail_award",type:"Int8"},{name:"ctime",type:"Int32"}];
	public constructor() {}
}