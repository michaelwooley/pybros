const _BASE = '';

export const BASE = `${_BASE}/`;
export const ABOUT = `${_BASE}/about`;

export const MEET = `${_BASE}/meet`;
export const MEET_CREATE = `${MEET}/create`;
export const MEET_SLUG = (s: string): string => `${MEET}/${s}`;
