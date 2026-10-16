import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

const localized = z.object({ en: z.string(), es: z.string(), pt: z.string() });
const localizedList = z.object({ en: z.array(z.string()), es: z.array(z.string()), pt: z.array(z.string()) });
// Texto en un solo idioma (se muestra igual en todos) o traducido a los tres.
const text = z.union([z.string(), localized]);

// Una "serie" es una temática que se repite: WOPR Latam, TAPIA, etc.
const series = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/series' }),
  schema: z.object({
    name: z.string(),
    acronym: z.string(),
    order: z.number().default(99),
    website: z.string().url().optional(),
    // false para temáticas que no organiza Federico (p. ej. el WOPR original): no aparecen en el home
    own: z.boolean().default(true),
    // Color de texto en modo claro y en modo oscuro (ambos deben dar contraste AA ≥ 4.5:1)
    color: z.string(),
    colorDark: z.string(),
    fullName: localized,
    summary: localized,
    about: localizedList,
  }),
});

// Una "edición" es un workshop concreto. Fecha, lugar y tema pueden quedar sin definir.
const editions = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/editions' }),
  schema: ({ image }) =>
    z.object({
      series: reference('series'),
      title: z.string(),
      number: z.number().optional(),
      date: z.coerce.date().optional(),
      // Año previsto, si todavía no hay fecha (p. ej. 2027)
      expectedYear: z.number().optional(),
      datePrecision: z.enum(['month', 'year']).default('month'),
      city: z.string().optional(),
      country: z.string().length(2).optional(), // código ISO: UY, AR, BR, US...
      host: z.string().optional(),
      // Lugar concreto, si no es el host (p. ej. una universidad)
      venue: z.string().optional(),
      organizers: z.array(z.string()).default([]),
      contentOwner: z.string().optional(),
      // Página oficial de la edición, si existe
      url: z.string().url().optional(),
      // Idioma en el que se hizo la edición
      language: z.enum(['es', 'en', 'pt']).default('es'),
      // Rol de Federico en la edición
      myRole: z.enum(['organizer', 'host']).default('organizer'),
      theme: localized.optional(),
      // planned: anunciada · open: convocatoria abierta · closed: postulaciones cerradas · past: ya se hizo
      status: z.enum(['planned', 'open', 'closed', 'past']),
      applyUrl: z.string().url().optional(),
      applyDeadline: z.coerce.date().optional(),
      // Resumen de lo que pasó (opcional)
      summary: localized.optional(),
      // Fotos: rutas relativas a este archivo, p. ej. ./wopr-latam-02/grupo.jpg
      // Foto de fondo del encabezado (si no se indica, se usa la primera de `photos`)
      cover: image().optional(),
      photos: z
        .array(z.object({ src: image(), alt: text, caption: text.optional() }))
        .default([]),
      participants: z
        .array(
          z.object({
            name: z.string(),
            org: z.string().optional(),
            country: z.string().length(2).optional(),
            url: z.string().url().optional(), // LinkedIn u otro perfil
          }),
        )
        .default([]),
      // Si no cargás la lista de participantes pero sabés cuántos fueron
      participantCount: z.number().optional(),
      // Temas tratados: reportes de experiencia y discusiones
      topics: z.array(z.object({ title: text, presenter: z.string().optional() })).default([]),
      // Cantidad de reportes presentados, para la sección de impacto del home
      reportsPresented: z.number().optional(),
    }),
});

export const collections = { series, editions };
