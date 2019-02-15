class PropertyVO {
	public hp: number = 0;
	public mp: number = 0;
	public attack: number = 0;
	public att_def: number = 0;//物防
	public magic_def: number = 0;//法防
	public crit: number = 0;//暴击
	public crit_hurt: number = 0;//暴击伤害
	public crit_def: number = 0;//抗暴
	public palsy_rate: number = 0;//麻痹概率
	public palsy_def: number = 0;//抗麻
	public hurt_up: number = 0;//伤害加成
	public hurt_def: number = 0;//伤害减免
	public hp_up: number = 0;//生命加成

	public static HP: number = 1;
	public static MP: number = 2;
	public static ATTACK: number = 3;
	public static ATTACK_DEF: number = 4;
	public static MAGIC_DEF: number = 5;
	public static CRIT: number = 6;
	public static CRIT_HURT: number = 7;
	public static CRIT_DEF: number = 8;
	public static PALSY_RATE: number = 9;
	public static PALSY_DEF: number = 10;
	public static HURT_UP: number = 11;
	public static HURT_DEF: number = 12;
	public static HP_UP: number = 13;
	public constructor() {
	}

	public setValue(key: number, value: number): void {
		switch (key) {
			case PropertyVO.HP:
				this.hp = value;
				break;
			case PropertyVO.MP:
				this.mp = value;
				break;
			case PropertyVO.ATTACK:
				this.attack = value;
				break;
			case PropertyVO.ATTACK_DEF:
				this.att_def = value;
				break;
			case PropertyVO.MAGIC_DEF:
				this.magic_def = value;
				break;
			case PropertyVO.CRIT:
				this.crit = value;
				break;
			case PropertyVO.CRIT_HURT:
				this.crit_hurt = value;
				break;
			case PropertyVO.CRIT_DEF:
				this.crit_def = value;
				break;
			case PropertyVO.PALSY_RATE:
				this.palsy_rate = value;
				break;
			case PropertyVO.PALSY_DEF:
				this.palsy_def = value;
				break;
			case PropertyVO.HURT_UP:
				this.hurt_up = value;
				break;
			case PropertyVO.HURT_DEF:
				this.hurt_def = value;
				break;
			case PropertyVO.HP_UP:
				this.hp_up = value;
				break;
		}
	}

	public getValue(key: number): number {
		switch (key) {
			case PropertyVO.HP:
				return this.hp;
			case PropertyVO.MP:
				return this.mp;
			case PropertyVO.ATTACK:
				return this.attack;
			case PropertyVO.ATTACK_DEF:
				return this.att_def;
			case PropertyVO.MAGIC_DEF:
				return this.magic_def;
			case PropertyVO.CRIT:
				return this.crit;
			case PropertyVO.CRIT_HURT:
				return this.crit_hurt;
			case PropertyVO.CRIT_DEF:
				return this.crit_def;
			case PropertyVO.PALSY_RATE:
				return this.palsy_rate;
			case PropertyVO.PALSY_DEF:
				return this.palsy_def;
			case PropertyVO.HURT_UP:
				return this.hurt_up;
			case PropertyVO.HURT_DEF:
				return this.hurt_def;
			case PropertyVO.HP_UP:
				return this.hp_up;
		}
		return 0;
	}

	public clone(): PropertyVO {
		var vo: PropertyVO = new PropertyVO();
		vo.hp = this.hp;
		vo.mp = this.mp;
		vo.att_def = this.att_def;
		vo.attack = this.attack;
		vo.magic_def = this.magic_def;
		vo.crit = this.crit;
		vo.crit_hurt = this.crit_hurt;
		vo.crit_def = this.crit_def;
		vo.palsy_def = this.palsy_def;
		vo.palsy_rate = this.palsy_rate;
		vo.hurt_up = this.hurt_up;
		vo.hurt_def = this.hurt_def;
		vo.hp_up = this.hp_up;
		return vo;
	}

	public add(spro: PropertyVO): void {
		this.hp += spro.hp;
		this.mp += spro.mp;
		this.att_def += spro.att_def;
		this.attack += spro.attack;
		this.magic_def += spro.magic_def;
		this.crit += spro.crit;
		this.crit_hurt += spro.crit_hurt;
		this.crit_def += spro.crit_def;
		this.palsy_def += spro.palsy_def;
		this.palsy_rate += spro.palsy_rate;
		this.hurt_up += spro.hurt_up;
		this.hurt_def += spro.hurt_def;
		this.hp_up += spro.hp_up;
	}

	public up(rate: number): void {
		this.hp += Math.floor(this.hp * rate);
		this.mp += Math.floor(this.mp * rate);
		this.att_def += Math.floor(this.att_def * rate);
		this.attack += Math.floor(this.attack * rate);
		this.magic_def += Math.floor(this.magic_def * rate);
		this.crit += Math.floor(this.crit * rate);
		this.crit_hurt += Math.floor(this.crit_hurt * rate);
		this.crit_def += Math.floor(this.crit_def * rate);
		this.palsy_def += Math.floor(this.palsy_def * rate);
		this.palsy_rate += Math.floor(this.palsy_rate * rate);
		this.hurt_up += Math.floor(this.hurt_up * rate);
		this.hurt_def += Math.floor(this.hurt_def * rate);
		this.hp_up += Math.floor(this.hp_up * rate);
	}
}