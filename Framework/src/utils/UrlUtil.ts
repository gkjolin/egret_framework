class UrlUtil {
	public constructor() {
	}

	//获取场景中衣服URL
	public static getClothURL(job: number, sex: number, clothID: number): string {
		if (job == 0) {
			job = 3;
		}
		if (sex == 0) {
			sex = 1;
		}
		var jobFolder: string = Tools.getJobFolder(job);
		var sexFolder: string = Tools.getSexFolder(sex);
		var skinVo//: RoleSkinVo = RoleModel.getInstance().getSkinVo(clothID);
		var url: string;
		if (skinVo) {
			url = `resource/assets/mapAssets/player/cloth/${jobFolder}/${sexFolder}/${skinVo.skinID}/`;
		}
		else {
			url = `resource/assets/mapAssets/player/cloth/${jobFolder}/${sexFolder}/${clothID}/`;
		}
		return rURL(url);
	}

	//获取场景中武器URL
	public static getWeaponURL(sex: number, weaponID: number): string {
		var sexFolder: string = Tools.getSexFolder(sex);
		var skinVo//: RoleSkinVo = RoleModel.getInstance().getSkinVo(weaponID);
		var url: string;
		if (skinVo) {
			url = `resource/assets/mapAssets/player/weapon/${sexFolder}/${skinVo.skinID}/`;
		}
		else {
			url = `resource/assets/mapAssets/player/weapon/${sexFolder}/${weaponID}/`;
		}
		return rURL(url);
	}

	//光环URL
	public static getRingURL(id: number): string {
		var url: string = StringUtil.substitute("resource/assets/mapAssets/player/ring/{0}/gh", id);
		return rURL(url);
	}

	//界面光环URL
	public static getFigureRingURL(id: number): string {
		var url: string = StringUtil.substitute("resource/assets/mapAssets/figure/ring/{0}/gh", id);
		return rURL(url);
	}

	//获取宠物场景中衣服URL
	public static getPetClothURL(clothID: number): string {
		var url: string;
		url = `resource/assets/mapAssets/player/pet/${clothID}/`;
		return rURL(url);
	}
	//获取宠物场景中武器URL
	public static getPetWeaponURL(type: number, weaponId: number): string {
		var url: string;
		url = `resource/assets/mapAssets/player/pet_weapon/type${type}/${weaponId}/`;
		return rURL(url);
	}
	//获取NPC场景中衣服URL
	public static getNpcClothURL(clothID: number): string {
		var url: string;
		url = `resource/assets/mapAssets/npc/${clothID}/`;
		return rURL(url);
	}

	//获取场景地图块URL
	public static getMapTileURL(resID: number): string {
		var url: string = "resource/assets/mapAssets/sceneMapTile/" + resID + "/";
		return rURL(url);
	}

	//获取小地图url
	public static getSmallMapURL(resID: number): string {
		var url: string = "resource/assets/mapAssets/sceneMapTile/" + resID + "/smallmap.jpg";
		return rURL(url);
	}

	//获取道具图片URL
	public static getGoodsImageURL(resName: number): string {
		var url: string = "resource/assets/icon/goodsPic/" + resName + ".png";
		return rURL(url);
	}
	//获取NPC功能图片URL
	public static getNpcFunIconURL(resName: number): string {
		var url: string = "resource/assets/icon/npcIcon/" + resName + ".png";
		return rURL(url);
	}


	//获取掉落图片URL
	public static getGoodsDropURL(resName: number): string {
		var url: string = "resource/assets/icon/goodsPic/" + resName + ".png";
		return rURL(url);
	}

	//获取怪物url
	public static getMonsterURL(id: number): string {
		var url: string = "resource/assets/mapAssets/monster/" + id + "/";
		return rURL(url);
	}

	public static getCommonSceneURL(): string {
		var url: string = "resource/assets/mapAssets/commonScene/commonScene"
		return rURL(url);
	}

	//获取场景中翅膀URL
	public static getWingURL(wingID: number): string {
		var config//: WingDataVO = WingModel.getInstance().getWingDataVOByTemplateId(wingID);
		var url: string = "resource/assets/mapAssets/player/wing/" + config.advance_lev + "/";
		return rURL(url);
	}


	public static getCommonEffectURL(name: string): string {
		var url: string = "resource/assets/mapAssets/effect/common/" + name;
		return rURL(url);
	}
	public static getArtifactEffectURL(name: string): string {
		var url: string = "resource/assets/mapAssets/effect/artifact/" + name;
		return rURL(url);
	}

	/**获取魔宠动作资源*/	
	public static getPetEffectURL(petId: number, action: string): string {
		var url: string = "resource/assets/mapAssets/figure/pet/" + petId + "/" + action;
		return rURL(url);
	}

	/**获取魔宠武器资源*/	
	public static getPetWeaponEffectURL(weaponId: number, level: number): string {
		var url: string = "resource/assets/mapAssets/figure/pet_weapon/type" + weaponId + "/" + level + "/stand";
		return rURL(url);
	}

	/**获取魔宠武器资源2*/	
	public static getPetWeaponEffectURL2(weaponId: number, level: number): string {
		var url: string = "resource/assets/mapAssets/figure/pet_weapon/type" + weaponId + "/" + level + "/stand_s";
		return rURL(url);
	}

	public static getSkillEffectURL(name: string): string {
		var url: string = "resource/assets/mapAssets/effect/skill/" + name;
		return rURL(url);
	}

	//技能url
	public static getSkillURL(icon: number): string {
		return rURL("resource/assets/icon/skill/" + icon + ".png");
	}

	//公会技能url
	public static getSkillGuildURL(icon: number): string {
		return rURL("resource/assets/icon/skill/guild/guild_skill_" + icon + ".png");
	}

	//功勋技能url
	public static getSkillFeatURL(icon: number): string {
		return rURL("resource/assets/icon/skill/feat/feat_skill_" + icon + ".png");
	}
	//绝技url
	public static getPKSkillURL(name: string): string {
		return rURL("resource/assets/icon/pkSkill/" + name + ".png");
	}
	//人物头像url
	public static getHeadURL(type: number = 1, icon: number = 0, career: number = 1, sex: number = 1, id: number = 0): string {
		var url: string = "";
		if (type == 1) {
			url = rURL("resource/assets/icon/head/bighead_" + icon + ".png");
		}
		return url;
	}
	//伙伴头像url
	public static getHeadURLByPartner(career: number = 1, sex: number = 1, icon: number = 0): string {
		if (icon > 0) {
			return rURL("resource/assets/icon/head/smallhead_" + icon + ".png");
		} else {
			return rURL("resource/assets/icon/head/smallhead_" + (career * 1000 + sex) + ".png");
		}
	}

	//获取形象面板的衣服
	public static getFigureClothURL(career: number, sex: number, cloth: number): string {
		var jobFolder: string = Tools.getJobFolder(career);
		var sexFolder: string = Tools.getSexFolder(sex);
		var skinVo//: RoleSkinVo = RoleModel.getInstance().getSkinVo(cloth);
		var url: string;
		if (skinVo) {
			url = `resource/assets/mapAssets/figure/cloth/${jobFolder}/${sexFolder}/${skinVo.skinID}/`;
		}
		else {
			url = `resource/assets/mapAssets/figure/cloth/${jobFolder}/${sexFolder}/${cloth}/`;
		}
		return rURL(url);
	}

	//获取形象面板的武器
	public static getFigureWeaponURL(weaponID: number): string {
		var skinVo//: RoleSkinVo = RoleModel.getInstance().getSkinVo(weaponID);
		var url: string;
		if (skinVo) {
			url = `resource/assets/mapAssets/figure/weapon/${skinVo.skinID}/`;
		}
		else {
			url = `resource/assets/mapAssets/figure/weapon/${weaponID}/`;
		}
		return rURL(url);
	}

	//获取形象面板的翅膀
	public static getFigureWingURL(wingID: number): string {
		var url: string;
		if (wingID < 100) {
			url = "resource/assets/mapAssets/figure/wing/" + wingID + "/";
		}
		else {
			var config//: WingDataVO = WingModel.getInstance().getWingDataVOByTemplateId(wingID);
			url = "resource/assets/mapAssets/figure/wing/" + config.advance_lev + "/";
		}
		return rURL(url);
	}
	//获取称号品质资源
	public static getTitleQualityURL(quality: number): string {
		var url: string = `resource/assets/icon/title/title_type${quality}.png`;
		return rURL(url);
	}
	//获取称号资源
	public static getTitleResource(id: number): string {
		var url: string = `resource/assets/mapAssets/title/${id}`;
		return rURL(url);
	}
	//获取称号界面资源
	public static getTitleWinResource(id: number): string {
		var url: string = `resource/assets/icon/chenghao/${id}.png`;
		return rURL(url);
	}

	//获取小图片
	public static getSmallPic(id: number): string {
		var url: string = `resource/assets/icon/smallPic/${id}.png`;
		return rURL(url);
	}

	//日常活动的图标
	public static getHuoDongDailyIcon(icon: string): string {
		var url: string = `resource/assets/icon/huoDongDaily/${icon}.png`;
		return rURL(url);
	}
	//返利活动的图标
	public static getHeFuIcon(icon: string): string {
		var url: string = `resource/assets/icon/hefu/${icon}.png`;
		return rURL(url);
	}
	//合服活动的图标
	public static getFanLiDailyIcon(icon: string): string {
		var url: string = `resource/assets/icon/fanli/${icon}.png`;
		return rURL(url);
	}
	//qq好友窗口里的图标
	public static getQQFriendWinIcon(icon: string): string {
		var url: string = `resource/assets/icon/QQFriend/${icon}.png`;
		return rURL(url);
	}
	//qq每周豪礼窗口里的图标
	public static getQQWeekGiftWinIcon(icon: string): string {
		var url: string = `resource/assets/icon/QQWeekGift/${icon}.png`;
		return rURL(url);
	}
	//返利活动--限购礼包的图标
	public static getFanLiXGIcon(icon: string): string {
		var url: string = `resource/assets/icon/fanli/flxg/${icon}.png`;
		return rURL(url);
	}
	//祝福BUFF--
	public static getBlessBuffIcon(icon: string): string {
		var url: string = `resource/assets/icon/bless/buff/${icon}.png`;
		return rURL(url);
	}
	//合服活动--限购礼包的图标
	public static getHFXGIcon(icon: string): string {
		var url: string = `resource/assets/icon/hefu/HFGift/${icon}.png`;
		return rURL(url);
	}
	//开服称号活动
	public static getKFHDTITLEIcon(icon: string): string {
		var url: string = `resource/assets/icon/kfhdTitle/${icon}.png`;
		return rURL(url);
	}
	//合服称号活动
	public static getHFTITLEIcon(icon: string): string {
		var url: string = `resource/assets/icon/hefu/HFTitle/${icon}.png`;
		return rURL(url);
	}

	//日常活动的描述图片
	public static getHuoDongDailyPic(icon: any, ext: string = "jpg"): string {
		var url: string = `resource/assets/icon/huoDongDaily/${icon}.${ext}`;
		return rURL(url);
	}
	//合服活动的描述图片
	public static getHFPic(icon: string, ext: string = "jpg"): string {
		var url: string = `resource/assets/icon/hefu/${icon}.${ext}`;
		return rURL(url);
	}
	//窗口标题
	public static getWindowTitlePicURL(icon: string): string {
		var url: string = `resource/assets/icon/windowTitle/${icon}.png`;
		return rURL(url);
	}

	//获取mall里面的图片
	public static getMallPic(icon: string): string {
		var url: string = StringUtil.substitute("resource/assets/icon/mall/{0}.png", icon);
		return rURL(url);
	}

	//获取boss头像
	public static getBossHead(icon: string): string {
		var url: string = StringUtil.substitute("resource/assets/icon/head/bosshead/{0}.png", icon);
		return rURL(url);
	}

	//公会副本中的通用头像
	public static getBossCommonHead(): string {
		var url: string = StringUtil.substitute("resource/assets/icon/head/bosshead/common.png");
		return rURL(url);
	}

	public static getOtherIcon(icon: string, ext: string = "png"): string {
		var url: string = StringUtil.substitute("resource/assets/icon/other/{0}.{1}", icon, ext);
		return rURL(url);
	}

	//获取称号URL
	public static getTitleURL(id: number): string {
		var url: string = StringUtil.substitute("resource/assets/mapAssets/title/{0}", id);
		return rURL(url);
	}
	//获取称号URL
	public static getDominateURL(icon: string): string {
		var url: string = StringUtil.substitute("resource/assets/icon/dominate/{0}", icon);
		return rURL(url);
	}
	//获取经脉 URL
	public static getMeridiansURL(icon: string): string {
		var url: string = StringUtil.substitute("resource/assets/icon/meridians/{0}", icon);
		return rURL(url);
	}
	//获取神炼 URL
	public static getShanlianURL(icon: string): string {
		var url: string = StringUtil.substitute("resource/assets/icon/shenlian/{0}", icon);
		return rURL(url);
	}

	public static getCityWarUrl(icon: string): string {
		var url: string = StringUtil.substitute("resource/assets/icon/cityWar/{0}.png", icon);
		return rURL(url);
	}
	//获取充值 URL
	public static getChargeURL(icon: string): string {
		var url: string = StringUtil.substitute("resource/assets/icon/charge/{0}.png", icon);
		return rURL(url);
	}
	//获取充值 URL
	public static getKFHDChargeURL(icon: string): string {
		var url: string = StringUtil.substitute("resource/assets/icon/kfhdCharge/{0}.png", icon);
		return rURL(url);
	}
	//获取合服充值 URL
	public static getHFChargeURL(icon: string): string {
		var url: string = StringUtil.substitute("resource/assets/icon/hefu/HFCharge/{0}.png", icon);
		return rURL(url);
	}

	//获取buff图标
	public static getBuffIcon(icon: number): string {
		var url = StringUtil.substitute("resource/assets/icon/buff/buff_{0}.png", icon);
		return rURL(url);
	}
	//获取功能预告URL
	public static getFunctionNoticeURL(icon: string): string {
		var url = StringUtil.substitute("resource/assets/icon/functionNotice/{0}.png", icon);
		return rURL(url);
	}

	//王者头像url
	public static getHeadURLByKing(type: number): string {
		return rURL("resource/assets/icon/head/dw_0" + type + ".png");
	}

	//获取声音URL
	public static getSoundUrl(id: string, ext: string = "wav"): string {
		return rURL(StringUtil.substitute("resource/assets/Sound/{0}.{1}", id, ext));
	}

	public static getScenePathFile(id: number): string {
		return rURL(StringUtil.substitute("resource/assets/config/scene/{0}.json", id));
	}
	public static getFolderPic(folder: string, name: string, type: string = "png"): string {
		var url: string = `resource/assets/icon/${folder}/${name}.${type}`;
		return rURL(url);
	}
	public static getFanliDFWPic(value: number): string {
		var url: string = `resource/assets/icon/fanli/dfw/fanli_dfw_${value}.png`;
		return rURL(url);
	}
}