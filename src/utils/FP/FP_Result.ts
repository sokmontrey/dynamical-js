export type Success<T> = { ok: true, value: T };
export type Failure = { ok: false, err_msg: string };

export const success =
	<T>(value: T): Success<T> => ({ ok: true, value });
export const failure =
	(err_msg: string): Failure => ({ ok: false, err_msg });

export type Result<T> = Success<T> | Failure;
