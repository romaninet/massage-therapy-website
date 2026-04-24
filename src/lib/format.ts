export function formatPrice(price: number, locale: 'en' | 'fr'): string {
  return locale === 'fr' ? `${price} $` : `$${price}`;
}
