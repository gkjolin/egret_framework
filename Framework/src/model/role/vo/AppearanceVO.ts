class AppearanceVO {
	public static WEAPON: number = 1;
	public static CLOTH: number = 2;
	public static WING: number = 3;
	public static WEAPON_FASHION: number = 4;
	public static CLOTH_FASHION: number = 5;
	public static WING_FASHION: number = 6;
	public static TITLE: number = 7;
	public static RING: number = 8;
	public static PET: number = 9;
	public static PET_WEAPON_10: number = 10;
	public static PET_WEAPON_11: number = 11;
	public static PET_WEAPON_12: number = 12;

	public weapon: number = 0;
	public ring: number = 0;
	public cloth: number = 0;
	public wing: number = 0;
	public pet: number = 0;
	public weaponFashion: number = 0;
	public clothFashion: number = 0;
	public wingFashion: number = 0;
	public title: number = 0;
	public pet_weapon_10: number = 0;
	public pet_weapon_11: number = 0;
	public pet_weapon_12: number = 0;
	public constructor() {
	}

	public setValue(key: number, value: number): void {
		switch (key) {
			case AppearanceVO.WEAPON:
				this.weapon = value;
				break;
			case AppearanceVO.CLOTH:
				this.cloth = value;
				break;
			case AppearanceVO.WING:
				this.wing = value;
				break;
			case AppearanceVO.WEAPON_FASHION:
				this.weaponFashion = value;
				break;
			case AppearanceVO.CLOTH_FASHION:
				this.clothFashion = value;
				break;
			case AppearanceVO.WING_FASHION:
				this.wingFashion = value;
				break;
			case AppearanceVO.TITLE:
				this.title = value;
				break;
			case AppearanceVO.RING:
				this.ring = value;
				break;
			case AppearanceVO.PET:
				this.pet = value;
				break;
			case AppearanceVO.PET_WEAPON_10:
				this.pet_weapon_10 = value;
				break;
			case AppearanceVO.PET_WEAPON_11:
				this.pet_weapon_11 = value;
				break;
			case AppearanceVO.PET_WEAPON_12:
				this.pet_weapon_12 = value;
				break;
		}
	}

	public clone(): AppearanceVO {
		var vo: AppearanceVO = new AppearanceVO();
		var a = this;
		vo.weapon = a.weapon;
		vo.cloth = a.cloth;
		vo.wing = a.wing;
		vo.weaponFashion = a.weaponFashion;
		vo.clothFashion = a.clothFashion;
		vo.wingFashion = a.wingFashion;
		vo.title = a.title;
		vo.ring = a.ring;
		vo.pet = a.pet;
		vo.pet_weapon_10 = a.pet_weapon_10;
		vo.pet_weapon_11 = a.pet_weapon_11;
		vo.pet_weapon_12 = a.pet_weapon_12;
		return vo;
	}
	public getPetWeapon(): any {
		var a = this;
		if (a.pet_weapon_10 > 0) return { type: AppearanceVO.PET_WEAPON_10, value: a.pet_weapon_10 };
		if (a.pet_weapon_11 > 0) return { type: AppearanceVO.PET_WEAPON_11, value: a.pet_weapon_11 };
		if (a.pet_weapon_12 > 0) return { type: AppearanceVO.PET_WEAPON_12, value: a.pet_weapon_12 };
		return null;
	}
}