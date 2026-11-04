/** NDH support line. One source of truth for every WhatsApp entry point. */
export const WHATSAPP_NUMBER = "2348144444662";
export const WHATSAPP_MESSAGE = "Hello NDH, I would like to make an inquiry";

export function whatsappLink(message: string = WHATSAPP_MESSAGE): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
