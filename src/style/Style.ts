// TODO use Color for every color instead of string
export interface StyleProps {
	is_enable?: boolean;
}

export default class Style {
	public is_enable: boolean = true;

	constructor(params: StyleProps = {}) {
		Object.assign(this, params);
	}
}