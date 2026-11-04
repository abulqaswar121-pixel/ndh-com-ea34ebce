import { WhatsAppIcon } from "@/components/site/WhatsAppIcon";
import { whatsappLink } from "@/lib/whatsapp";

/**
 * Direct WhatsApp line to NDH support, stacked above the AI assistant.
 *
 * Fixed to the bottom-right corner, below the assistant dialog in z-order so it
 * can never cover the chat, and above page/footer content at every width.
 */
export function WhatsAppFab() {
  return (
    <a
      className="ndh-wa-fab"
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with NDH support on WhatsApp"
      title="Chat with NDH support on WhatsApp"
    >
      <WhatsAppIcon size={26} />
      <span className="ndh-wa-tip">WhatsApp support</span>
    </a>
  );
}
