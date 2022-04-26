const _BASE = '';

export const BASE = `${_BASE}/`;
export const ABOUT = `${_BASE}/about`;

export const MEET = `${_BASE}/meet`;
export const MEET_SLUG = (s: string): string => `${MEET}/${s}`;
export const MEET_SETTINGS_SLUG = (s: string): string => `${MEET_SLUG(s)}/settings`;
