// The one place to change links. Everything else reads from here.

/** The prototype while developing on this laptop (the screenshot and check scripts read this line). */
export const PROTOTYPE_DEV_URL = 'http://localhost:5288/';

/**
 * Where "Try the demo" goes. On the live site the app is served from /app/ on the same domain
 * (see scripts/build-site.mjs in the main folder). VITE_PROTOTYPE_URL overrides it if needed.
 */
export const PROTOTYPE_URL: string =
  import.meta.env.VITE_PROTOTYPE_URL ?? (import.meta.env.DEV ? PROTOTYPE_DEV_URL : `${import.meta.env.BASE_URL}app/`);

/** The team's email address, used by the links below. */
export const TEAM_EMAIL = '[TEAM_EMAIL]';

/** "Partner with us" (for organisations). */
export const PARTNER_MAILTO = `mailto:${TEAM_EMAIL}?subject=${encodeURIComponent('SafeSpace partnership')}`;

/** General questions (FAQ "Send us an email" and the footer "Contact us"). */
export const CONTACT_MAILTO = `mailto:${TEAM_EMAIL}?subject=${encodeURIComponent('Question about SafeSpace')}`;
