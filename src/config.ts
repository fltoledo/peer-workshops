// Datos generales del sitio. Cambiá acá el nombre, links y claves.
export const SITE = {
  name: 'Peer Workshops',
  contactEmail: '', // opcional, p. ej. 'hello@tudominio.com'
  // Clave pública de Web3Forms (https://web3forms.com). Se obtiene gratis con tu email.
  web3formsKey: 'a407938e-726e-4e89-9d27-3a6a992d42c0',
};

// Newsletter con Kit (https://kit.com). Por ahora un solo formulario para los tres idiomas.
// Si más adelante querés separar por idioma, creá un formulario de Kit por idioma y poné su URL en cada uno.
// La URL es la del atributo action="..." del <form> (en Kit: Publish → Embed → HTML).
// Si quedan vacías, el sitio muestra un enlace a `fallbackUrl`.
const KIT_FORM = 'https://app.kit.com/forms/10054775/subscriptions';

export const NEWSLETTER = {
  formActions: { en: KIT_FORM, es: KIT_FORM, pt: KIT_FORM },
  fallbackUrl: 'http://eepurl.com/dhGmEv',
};
