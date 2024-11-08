// TODO use Color for every color instead of string
export interface StyleParams {
	is_enable?: boolean;
}

export default class Style {
	public is_enable: boolean;

	constructor({
		is_enable = true
	}: StyleParams = {}) {
		this.is_enable = is_enable;
	}

	enable() {
		this.is_enable = true;
		return this;
	}

	disable() {
		this.is_enable = false;
		return this;
	}
}

