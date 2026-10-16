import { getCollection, type CollectionEntry } from 'astro:content';
import { UI, countryName, formatMonth, type Lang, type Localized } from './i18n';

export type Edition = CollectionEntry<'editions'>;
export type Series = CollectionEntry<'series'>;

export async function getSeries() {
  const all = await getCollection('series');
  return all.sort((a, b) => a.data.order - b.data.order);
}

// Sin fecha: al final del año previsto, o como la más futura si tampoco hay año.
const sortKey = (e: Edition) =>
  e.data.date?.getTime() ??
  (e.data.expectedYear ? Date.UTC(e.data.expectedYear, 11, 31) : Number.MAX_SAFE_INTEGER);

/** Ediciones de la más futura a la más antigua. Sin fecha, en el orden de las temáticas. */
export async function getEditions() {
  const all = await getCollection('editions');
  const order = new Map((await getSeries()).map((s) => [s.id, s.data.order]));
  const seriesOrder = (e: Edition) => order.get(e.data.series.id) ?? 99;
  return all.sort((a, b) => sortKey(b) - sortKey(a) || seriesOrder(b) - seriesOrder(a));
}

export async function getSeriesMap() {
  return new Map((await getSeries()).map((s) => [s.id, s]));
}

export const isUpcoming = (e: Edition) => e.data.status !== 'past';

/** Un texto que puede venir en un solo idioma o traducido. */
export const tx = (value: string | Localized, lang: Lang) => (typeof value === 'string' ? value : value[lang]);

export const editionWhen = (e: Edition, lang: Lang) => {
  if (e.data.date) return formatMonth(e.data.date, lang, e.data.datePrecision);
  if (e.data.expectedYear) return `${e.data.expectedYear} · ${UI[lang].tbd.date.toLowerCase()}`;
  return UI[lang].tbd.date;
};

export const editionWhere = (e: Edition, lang: Lang) => {
  const { city, country } = e.data;
  if (!city && !country) return UI[lang].tbd.place;
  return [city, country && countryName(country, lang)].filter(Boolean).join(', ');
};

export const editionTheme = (e: Edition, lang: Lang) => e.data.theme?.[lang] ?? UI[lang].tbd.theme;

export const participantCount = (e: Edition) => e.data.participantCount ?? e.data.participants.length;

/** Variables CSS para el color de una serie en modo claro y oscuro. Usar junto a la clase `series-scope`. */
export const seriesVars = (s: Series) => `--sc-light: ${s.data.color}; --sc-dark: ${s.data.colorDark}`;
