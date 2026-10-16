// Idiomas del sitio. Todas las páginas existen en los tres: /es/..., /en/..., /pt/...
export const LANGS = ['en', 'es', 'pt'] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = 'en';

export const LANG_META: Record<Lang, { label: string; short: string; htmlLang: string; intl: string }> = {
  en: { label: 'English', short: 'EN', htmlLang: 'en', intl: 'en-US' },
  es: { label: 'Español', short: 'ES', htmlLang: 'es', intl: 'es' },
  pt: { label: 'Português', short: 'PT', htmlLang: 'pt-BR', intl: 'pt-BR' },
};

/** Un texto en los tres idiomas. */
export type Localized = Record<Lang, string>;

/** Antepone el base path (necesario en GitHub Pages sin dominio propio). */
export function url(path: string) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

/** URL de una página en un idioma: lp('es', '/format') → /es/format */
export function lp(lang: Lang, path = '/') {
  const clean = path === '/' ? '/' : `/${path.replace(/^\//, '')}`;
  return url(`/${lang}${clean === '/' ? '/' : clean}`);
}

/** Para getStaticPaths de páginas simples. */
export const langPaths = () => LANGS.map((lang) => ({ params: { lang } }));

export function formatMonth(date: Date, lang: Lang, precision: 'month' | 'year' = 'month') {
  const opts: Intl.DateTimeFormatOptions =
    precision === 'year' ? { year: 'numeric', timeZone: 'UTC' } : { month: 'long', year: 'numeric', timeZone: 'UTC' };
  const s = new Intl.DateTimeFormat(LANG_META[lang].intl, opts).format(date);
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function languageName(code: string, lang: Lang) {
  const name = new Intl.DisplayNames([LANG_META[lang].intl], { type: 'language' }).of(code) ?? code;
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export function countryName(code: string, lang: Lang) {
  return new Intl.DisplayNames([LANG_META[lang].intl], { type: 'region' }).of(code) ?? code;
}

// Textos comunes a todo el sitio.
export const UI = {
  en: {
    nav: { home: 'Home', editions: 'Editions', format: 'The format', participate: 'Participate', host: 'Host', about: 'About me', contact: 'Contact', company: 'For companies' },
    skip: 'Skip to content',
    menu: 'Menu',
    language: 'Language',
    footerTagline: 'Peer workshops for software professionals',
    subscribe: 'Subscribe to updates',
    status: { planned: 'Coming soon', open: 'Call open', closed: 'Applications closed', past: 'Held' },
    edition: 'edition',
    editions: 'editions',
    inLanguage: 'In', myRole: { organizer: 'Organizer', host: 'Host' },
    tbd: { date: 'Date to be announced', place: 'Location to be announced', both: 'Date and location to be announced', theme: 'Theme to be announced' },
  },
  es: {
    nav: { home: 'Inicio', editions: 'Ediciones', format: 'El formato', participate: 'Participar', host: 'Ser host', about: 'Sobre mí', contact: 'Contacto', company: 'Para empresas' },
    skip: 'Saltar al contenido',
    menu: 'Menú',
    language: 'Idioma',
    footerTagline: 'Talleres entre pares para profesionales de software',
    subscribe: 'Suscribite a las novedades',
    status: { planned: 'Próximamente', open: 'Convocatoria abierta', closed: 'Postulaciones cerradas', past: 'Realizada' },
    edition: 'edición',
    editions: 'ediciones',
    inLanguage: 'En', myRole: { organizer: 'Organizador', host: 'Host' },
    tbd: { date: 'Fecha a definir', place: 'Lugar a definir', both: 'Fecha y lugar a definir', theme: 'Tema a definir' },
  },
  pt: {
    nav: { home: 'Início', editions: 'Edições', format: 'O formato', participate: 'Participar', host: 'Ser host', about: 'Sobre mim', contact: 'Contato', company: 'Para empresas' },
    skip: 'Pular para o conteúdo',
    menu: 'Menu',
    language: 'Idioma',
    footerTagline: 'Workshops entre pares para profissionais de software',
    subscribe: 'Receba as novidades',
    status: { planned: 'Em breve', open: 'Inscrições abertas', closed: 'Inscrições encerradas', past: 'Realizada' },
    edition: 'edição',
    editions: 'edições',
    inLanguage: 'Em', myRole: { organizer: 'Organizador', host: 'Host' },
    tbd: { date: 'Data a definir', place: 'Local a definir', both: 'Data e local a definir', theme: 'Tema a definir' },
  },
} satisfies Record<Lang, unknown>;

export const NAV = [
  { key: 'home', path: '/' },
  { key: 'editions', path: '/editions' },
  { key: 'format', path: '/format' },
  { key: 'participate', path: '/participate' },
  { key: 'host', path: '/host' },
  { key: 'about', path: '/about' },
  { key: 'contact', path: '/contact' },
  { key: 'company', path: '/in-company', cta: true },
] as const;
