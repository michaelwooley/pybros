import {
    extractFromCookies,
    getCookies,
    setCookiesFromSessionLocals
} from '$lib/util/sessionCookies';
import type { Handle, GetSession } from '@sveltejs/kit';

// const setCookiesFromSessionLocals = (
// 	sess: App.Session,
// 	handler: (s: string) => void
// 	// res: Response
// ): void => {
// 	for (const [k, v] of Object.entries(sess)) {
// 		// res.headers.append('set-cookie', serializeCookie(k, v, event.persistent));
// 		handler(serializeCookie(k, v, sess.persistent));
// 	}
// };

export const handle: Handle = async ({ event, resolve }) => {
    const cookies = getCookies(event.request.headers.get('cookie'));

    event.locals.user = extractFromCookies.user(cookies);
    event.locals.persistent = extractFromCookies.persistent(cookies);

    const response = await resolve(event);

    setCookiesFromSessionLocals(event.locals, (c) => response.headers.append('set-cookie', c));
    return response;
};

/** @type {import('@sveltejs/kit').GetSession} */
export const getSession: GetSession = (e): App.Session => {
    return e.locals;
};
