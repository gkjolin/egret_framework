class NodeBoss_guilds {
	public template_id:number;
	public hp_rate:number;
	public last_time:number;
	public boss_guild_hits:any[]=[NodeBoss_guild_hits];
	public boss_guild_kills:any[]=[NodeBoss_guild_kills];

	public list=[{name:"template_id",type:"Int32"},{name:"hp_rate",type:"Int8"},{name:"last_time",type:"Int32"},{name:"boss_guild_hits",type:"array"},{name:"boss_guild_kills",type:"array"}];
	public constructor() {}
}