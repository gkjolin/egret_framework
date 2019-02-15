class NodeKfboss_awakes {
	public template_id:number;
	public hp_rate:number;
	public kfboss_awake_hits:any[]=[NodeKfboss_awake_hits];
	public kfboss_awake_kills:any[]=[NodeKfboss_awake_kills];

	public list=[{name:"template_id",type:"Int32"},{name:"hp_rate",type:"Int8"},{name:"kfboss_awake_hits",type:"array"},{name:"kfboss_awake_kills",type:"array"}];
	public constructor() {}
}