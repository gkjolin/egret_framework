class Particle {
	private _delay: number = 200;
	private count: number;
	private _url: Array<string>;
	private particlesList: Array<ParticleBitmap>;
	private isStop: boolean = false;
	private n: number = 0;
	private time: number;
	private _timeIndex: string;
	private _timeIndexComplete: string;
	
	public constructor(count: number, url: Array<string>, delay: number = 500, _time = 3000) {
		this.count = count;
		this._url = url;
		this.time = _time;
		this._delay = delay;
		this.particlesList = [];
	}
	public start(): void {
		this.disposefun();
		this.n = 0;
		this.isStop = false;
		TimerManager.getInstance().remove(this._delay, this.playerParticles, this);
		TimerManager.getInstance().add(this._delay, this.playerParticles, this);
		RenderManager.add(this.step, this);
		TimerManager.getInstance().remove(this.time, this.disposefun, this);
		TimerManager.getInstance().add(this.time, this.disposefun, this);
	}

	private disposefun(): void {
		this.stop();
		TimerManager.getInstance().remove(this.time, this.disposefun, this);
	}

	public step(): void {
		this.n++;
		var bitmap: ParticleBitmap;
		var j: number = 0;
		for (j = 0; j < this.particlesList.length; j++) {
			bitmap = this.particlesList[j];
			bitmap.x += bitmap.speedX;

			if (bitmap.y > GameContent.stageHeight - 30) {
				this.removeParticles(bitmap);
			} else {
				bitmap.y += bitmap.speedY;
			}
		}
		if (this.isStop && this.particlesList.length < 10) {
			this.dispose();
		}
	}
	private playerParticles(): void {
		var bitmap: ParticleBitmap;
		for (var i: number = 0; i < this.count; i++) {
			bitmap = this.createParticles();
			bitmap.x = Math.random() * GameContent.stageWidth;
			bitmap.y = Math.random() * 40 - 60;
		}
		bitmap = null;
	}
	private createParticles(): ParticleBitmap {
		var bitmap: ParticleBitmap = new ParticleBitmap();
		bitmap.source = this._url[Math.floor(Math.random() * 7)];
		bitmap.speedY = 10 + Math.floor(Math.random() * 3);

		GameContent.gameLayers.tipsLayer.addChild(bitmap);
		this.particlesList.push(bitmap);

		return bitmap;
	}
	private removeParticles(bitmap: ParticleBitmap): void {
		if (this.particlesList.indexOf(bitmap) > 0) {
			this.particlesList.splice(this.particlesList.indexOf(bitmap), 1);
		}
		if (bitmap.parent != null) {
			bitmap.$bitmapData = null;
			bitmap.parent.removeChild(bitmap);
		}
		bitmap = null;
	}
	public stop(): void {
		TimerManager.getInstance().remove(this._delay, this.playerParticles, this);
		this.isStop = true;
	}
	public dispose(): void {
		this.disposefun();
		RenderManager.remove(this.step, this);
		if (this.particlesList) {
			while (this.particlesList.length > 0) {
				this.removeParticles(this.particlesList.pop() as ParticleBitmap);
			}
			this.particlesList = [];
		}
	}
}
