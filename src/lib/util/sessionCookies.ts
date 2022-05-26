import { randomColor } from '$lib/util';
import { emojiFromName, randomName } from '$lib/util/naming';
import { SETTINGS_COOKIE_PREFIX } from '$lib/constants';
import * as cookie from 'cookie';

export const getCookies = (c: string | null): TCookies => cookie.parse(c || '');

export const cookieSessionKeysConverter = {
    to: (k: string): string => `${SETTINGS_COOKIE_PREFIX}-${k}`,
    from: (k: string): string => k.replace(`${SETTINGS_COOKIE_PREFIX}-`, '')
};

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export const serializeCookie = (k: string, v: any, persist = false): string =>
    cookie.serialize(cookieSessionKeysConverter.to(k), JSON.stringify(v), {
        path: '/',
        httpOnly: false, // Allows us to modify from the browser
        // NOTE "persistent" cookie is always persisted so as to know what to do next time
        // around.
        maxAge: k === 'persistent' || persist ? 90 * 24 * 3600 : undefined
    });

export const setCookiesFromSessionLocals = (
    sess: App.Session,
    handler: (cookieHeader: string) => void
): void => {
    for (const [k, v] of Object.entries(sess)) {
        handler(serializeCookie(k, v, sess.persistent));
    }
};

export const extractFromCookies = {
    user: (cookies: TCookies): UserSettings => {
        const key = 'user';
        const cookieKey = cookieSessionKeysConverter.to(key);
        let u = cookies[cookieKey] ? JSON.parse(cookies[cookieKey]) : {};
        if (typeof u !== 'object') {
            u = {};
        }

        const name = u.name || randomName();
        return {
            name,
            color: u.color || randomColor(),
            emoji: (u.emoji || emojiFromName(name))[0]
        };
    },
    persistent: (cookies: TCookies): boolean => {
        const key = 'persistent';
        const ck = cookieSessionKeysConverter.to(key);

        return cookies[ck] != null ? Boolean(cookies[ck]) : false;
    }
};

// export const getPersistenceSetting

// export const handleUserSettings = (cookies: TCookies): UserSettings => {
// 	const key = 'user';
// 	const cookieKey = cookieSessionKeysConverter.to(key);
// 	let u = cookies[cookieKey] ? JSON.parse(cookies[cookieKey]) : {};
// 	if (typeof u !== 'object') {
// 		u = {};
// 	}

// 	return {
// 		username: u.username || randomName(),
// 		color: u.color || randomColor()
// 	};
// };

// export const handlePersistent = (cookies: TCookies): boolean => {
// 	const key = 'persistent';
// 	const ck = cookieSessionKeysConverter.to(key);

// 	return cookies[ck] != null ? Boolean(cookies[ck]) : false;
// };
