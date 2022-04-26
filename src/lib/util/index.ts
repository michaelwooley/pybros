// TODO #23 Pretty colors w/ golden ratio
const _USER_COLORS = [
	'#30bced',
	'#6eeb83',
	'#ffbc42',
	'#ecd444',
	'#ee6352',
	'#9ac2c9',
	'#8acb88',
	'#1be7ff'
];

export const randomColor = () => _USER_COLORS[Math.floor(Math.random() * _USER_COLORS.length)];
