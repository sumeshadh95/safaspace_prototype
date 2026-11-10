// All text on the page lives here, so the team can edit words without touching components.
// Wording rules: plain and warm. Never "cache", "sync", "local storage", "API", "AI-powered".
// Say "saved in your cloud", "on your phone", "clear space", "bring back". No invented numbers.

export const TEAM_NAMES = '[NAMES]';
export const PRICE = '[PRICE]';

export const nav = [
  { id: 'features', label: 'Features' },
  { id: 'how-it-works', label: 'How it works' },
  { id: 'safety', label: 'Safety' },
  { id: 'faq', label: 'FAQ' },
  { id: 'for-organisations', label: 'For organisations' },
] as const;

export const brand = {
  name: 'SafeSpace',
  tagline: 'Phone storage, made simple',
};

export const cta = {
  demo: 'Try the demo',
  howItWorks: 'See how it works',
  partner: 'Partner with us',
};

export const hero = {
  eyebrow: 'For older adults and the families who help them',
  /** The second part gets a soft green highlight. */
  headline: { lead: 'Make room on your phone.', highlight: 'Keep every memory.' },
  message:
    'SafeSpace checks which photos, videos and documents are already safe in your cloud, then helps you clear space in a few simple taps — in plain words, and nothing is deleted without asking.',
  ticks: ['Nothing deleted without asking', 'Undo anytime', 'Large text, plain words'],
  /** Under the buttons: the demo starts on a phone's home screen, not inside the app. */
  demoHint: 'The demo opens on a phone’s home screen. Tap the green SafeSpace icon to start.',
  /** The two floating notes next to the phones. Same numbers as the demo: 72 photos + 15 videos saved, 3.5 GB in all. */
  chips: {
    safe: { title: '87 photos and videos', text: 'safe in your cloud' },
    freed: { text: 'You freed', title: '3.5 GB' },
  },
};

export const features = {
  eyebrow: 'Why SafeSpace',
  title: 'Peace of mind, one tap at a time',
  subtitle: 'Everything is built around one promise: your memories stay safe while you make room on your phone.',
  items: [
    {
      icon: 'cloud',
      title: 'See what’s already safe',
      text: 'We check which photos and files are already saved in your cloud, so you know what you can clear.',
    },
    {
      icon: 'shield',
      title: 'Clear space without worry',
      text: 'If something isn’t saved yet, SafeSpace tells you first and offers to save it.',
    },
    {
      icon: 'undo',
      title: 'Change your mind anytime',
      text: 'Removed something by mistake? Tap Undo, or bring it back from your cloud later.',
    },
    {
      icon: 'people',
      title: 'Made for real people',
      text: 'Big text, big buttons, plain words. One simple step at a time, no technical knowledge needed.',
    },
  ],
} as const;

export const problem = {
  title: 'Sound familiar?',
  items: [
    { icon: 'full', text: 'My phone says storage is full again.' },
    { icon: 'heart', text: 'I’m scared to delete photos of my grandchildren.' },
    { icon: 'ads', text: 'Cleaner apps are confusing and full of ads.' },
  ],
  answer: 'SafeSpace was made for exactly this.',
  link: 'See how it works',
} as const;

export const howItWorks = {
  eyebrow: 'Step by step',
  title: 'How it works',
  subtitle: 'Free up space in three simple steps.',
  steps: [
    { title: 'Check', text: 'Tap one button. SafeSpace looks through your photos, videos and documents.' },
    {
      title: 'See what’s safe',
      text: 'Everything is sorted oldest to newest and clearly marked: saved in cloud, or only on your phone.',
    },
    {
      title: 'Save or clear',
      text: 'Save to the cloud, remove from your phone, or both. Undo is always one tap away.',
    },
  ],
  tryLink: 'Try it yourself',
};

/** Screenshots live in public/screenshots/ (PNG, plus a WebP copy made automatically). */
export const screenshots = {
  home: {
    file: '01-home',
    alt: 'SafeSpace home screen: “Good morning, Robert”, two buttons for Dark mode and Power saving, a phone space bar showing 61 of 64 GB used and marked Almost full, and a large “Check my phone” button.',
  },
  results: {
    file: '02-results',
    alt: 'Check complete screen with small Dark mode and Power saving buttons at the top. A green panel says 87 photos and videos are safe in your cloud, with cards for Photos, Videos and Documents showing how many are saved.',
  },
  photosList: {
    file: '03-photos-list',
    alt: 'Photos list sorted by year. Three photos marked “Only on phone” are selected, each with Upload and Delete buttons, and a bar at the bottom says 3 selected with Upload and Delete.',
  },
  uploadSheet: {
    file: '04-upload-sheet',
    alt: 'Save to cloud pop-up with two large choices: “Save to cloud and keep on phone” and “Save to cloud and remove from phone”, which frees up space.',
  },
  deleteWarning: {
    file: '05-delete-warning',
    alt: 'A calm warning: “This photo is only on your phone. If you delete it, it may be gone.” The main button says “Save to cloud first”, with a smaller “Delete anyway” and Cancel.',
  },
  undoToast: {
    file: '06-undo-toast',
    alt: 'The photos list right after removing two photos. A message at the bottom says they were removed from the phone, how much space was freed, and shows a large Undo button.',
  },
};

export const showcase = {
  eyebrow: 'Inside the app',
  title: 'Simple on every screen',
  subtitle: 'One clear choice at a time, with words everyone understands.',
  items: [
    { shot: 'photosList', icon: 'list', caption: 'Every file sorted by date, with clear labels' },
    { shot: 'uploadSheet', icon: 'choice', caption: 'You choose: keep a copy on your phone or free up space' },
    { shot: 'undoToast', icon: 'undo', caption: 'Undo is always there' },
  ],
} as const;

export const safety = {
  eyebrow: 'Safety',
  title: 'Your memories are protected',
  subtitle: 'Three promises SafeSpace always keeps.',
  /** Small note floating next to the phone. */
  badge: 'Always asks first',
  points: [
    {
      icon: 'check',
      title: 'We check before anything is deleted',
      text: 'Files that aren’t saved anywhere else get a clear warning and a “Save to cloud first” button.',
    },
    {
      icon: 'undo',
      title: 'Undo, and bring it back',
      text: 'Every removal can be undone, and files in your cloud can be brought back to your phone anytime.',
    },
    {
      icon: 'hand',
      title: 'Nothing happens without you',
      text: 'SafeSpace never deletes anything on its own.',
    },
  ],
} as const;

export const organisations = {
  eyebrow: 'For organisations',
  title: 'Working with older adults?',
  text: 'We partner with NGOs, senior care organisations and community centres to help the people they support use their phones with confidence.',
  items: [
    { icon: 'workshop', text: 'Easy to introduce in workshops' },
    { icon: 'questions', text: 'Fewer repeat “my phone is full” questions' },
    { icon: 'guide', text: 'Plain-language guidance for every user' },
  ],
} as const;

/**
 * User stories. Today this is our persona, not a real customer, so the label says so.
 * Replace or add real quotes from usability tests here later (keep a truthful label).
 */
export const stories = [
  {
    initials: 'R',
    quote: 'I finally have space for new photos, and I didn’t lose a single one of the old ones.',
    name: 'Robert, 72',
    label: 'Our user persona',
  },
];

export const madeIn = 'Made in Mikkeli';

/** For the sons, daughters and grandchildren who help with phones. */
export const families = {
  eyebrow: 'For families',
  title: 'Helping a parent with their phone?',
  text: 'Try SafeSpace together once. After that they can use it on their own, and nothing is deleted without asking them first.',
  tips: [
    { icon: 'together', title: 'Try the demo together', text: 'Sit side by side and press “Check my phone”. It only takes a few taps.' },
    { icon: 'undo', title: 'Show them Undo', text: 'Remove one photo, then tap Undo. Seeing it come back builds trust.' },
    { icon: 'lead', title: 'Let them lead', text: 'Big buttons and plain words, so next time they can do it on their own.' },
  ],
  /** Note next to the small phone drawing. */
  findIt: 'Look for the green SafeSpace icon',
  cta: 'Try the demo together',
} as const;

export const faq = {
  eyebrow: 'FAQ',
  title: 'Questions and answers',
  help: {
    title: 'Still wondering about something?',
    text: 'We’re happy to help.',
    link: 'Send us an email',
  },
  items: [
    {
      q: 'Will SafeSpace delete my photos?',
      a: 'Never without asking. You always choose, and anything you remove can be brought back.',
    },
    {
      q: 'Do I need to be good with technology?',
      a: 'No. SafeSpace uses big buttons, plain words and one step at a time.',
    },
    {
      q: 'Can my family help me get started?',
      a: 'Yes. Try the demo together first. SafeSpace always asks before anything is deleted, so you stay in control.',
    },
    {
      q: 'Where are my photos saved?',
      a: 'In your cloud storage. SafeSpace shows you clearly which files are already saved there.',
    },
    {
      q: 'Is my information private?',
      a: 'This demo uses made-up photos, so nothing from your own phone is used or sent anywhere.',
    },
    {
      q: 'What does it cost?',
      a: `SafeSpace will offer a simple monthly or yearly plan. Price: ${PRICE}.`,
    },
    {
      q: 'Which phones will it work on?',
      a: 'We’re starting with Android phones. This page shows an early prototype.',
    },
  ],
};

export const finalCta = {
  title: 'Ready to make room on your phone?',
  text: 'Try the SafeSpace demo, no sign-up needed.',
};

export const footer = {
  about: 'A student project at Xamk, Mikkeli',
  exploreTitle: 'Explore',
  contactTitle: 'Contact',
  team: `Team: ${TEAM_NAMES}`,
  contact: 'Contact us',
  backToTop: 'Back to top',
  legal: '© 2026 SafeSpace · Prototype for the ICT Business Management course. Not a real product yet.',
};
