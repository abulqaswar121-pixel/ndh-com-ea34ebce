import {
  ArrowUpRight,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import { NdhFamilySymbol } from "@/components/NdhFamilySymbol";
import { SUBSIDIARIES, subsidiaryHref } from "@/lib/ecosystem";
import { SITE_CONTACT as contact } from "@/lib/site-contact";
import { usePreferences } from "@/lib/preferences";

const labels = {
  en: {
    explore: "Discover NDH",
    family: "Our businesses",
    reach: "Let’s connect",
    terms: "Terms of service",
    privacy: "Privacy notice",
    location: "Rooted in Sokoto. Built for possibility.",
    top: "Back to top",
    soon: "Coming Soon",
    verify: "Verify a certificate",
    general: "General enquiries",
    support: "Support",
  },
  fr: {
    explore: "Découvrir NDH",
    family: "Nos entreprises",
    reach: "Contactez-nous",
    terms: "Conditions d’utilisation",
    privacy: "Confidentialité",
    location: "Ancrés à Sokoto. Ouverts aux possibilités.",
    top: "Haut de page",
    soon: "Bientôt disponible",
    verify: "Vérifier un certificat",
    general: "Renseignements",
    support: "Assistance",
  },
  ar: {
    explore: "اكتشف NDH",
    family: "شركاتنا",
    reach: "تواصل معنا",
    terms: "شروط الاستخدام",
    privacy: "إشعار الخصوصية",
    location: "جذورنا في سوكوتو. نبني للمستقبل.",
    top: "العودة للأعلى",
    soon: "قريباً",
    verify: "التحقق من شهادة",
    general: "استفسارات عامة",
    support: "الدعم",
  },
};

export function FamilyFooter() {
  const { t, locale } = usePreferences();
  const copy = labels[locale];
  const coming = SUBSIDIARIES.filter((item) => item.state === "coming");
  return (
    <footer className="family-footer">
      <div className="family-footer-inner">
        <div className="family-footer-top">
          <a className="ecosystem-brand" href="/" aria-label="Najeeb Digital Hub home">
            <NdhFamilySymbol />
            <span>
              <strong>NAJEEB</strong>
              <small>DIGITAL HUB</small>
            </span>
          </a>
          <p>{t("footer.tagline")}</p>
          <div className="family-socials">
            <a href={contact.whatsapp} aria-label="WhatsApp">
              <MessageCircle size={16} />
            </a>
            <a href={contact.facebook} aria-label="Facebook">
              <Facebook size={16} />
            </a>
            <a href={contact.instagram} aria-label="Instagram">
              <Instagram size={16} />
            </a>
          </div>
        </div>
        <div className="family-footer-grid">
          <nav aria-label={copy.explore}>
            <h2>{copy.explore}</h2>
            <a href="/about">{t("nav.about")}</a>
            <a href="/businesses">{t("nav.businesses")}</a>
            <a href="/approach">{t("nav.status")}</a>
            <a href="/blog">{t("nav.blog")}</a>
            <a href="/contact">{t("nav.contact")}</a>
            <a href="/verify">{copy.verify}</a>
          </nav>
          <nav aria-label={copy.family}>
            <h2>{copy.family}</h2>
            {SUBSIDIARIES.filter((item) => item.state !== "coming").map((item) => (
              <a key={item.id} href={subsidiaryHref(item)}>
                {t(`eco.${item.id}.name` as never)}
                <ArrowUpRight size={12} aria-hidden="true" />
              </a>
            ))}
            {coming.length > 0 && (
              <a className="family-footer-more" href="/businesses">
                +{coming.length} {copy.soon.toLowerCase()}
              </a>
            )}
          </nav>
          <div className="family-footer-contact">
            <h2>{copy.reach}</h2>
            <address>
              <a href={contact.map} target="_blank" rel="noopener noreferrer">
                <MapPin size={14} />
                <span>{contact.address}</span>
              </a>
              <a href={`tel:${contact.telephone}`}>
                <Phone size={14} />
                <span dir="ltr">{contact.phone}</span>
              </a>
              <a href={`mailto:${contact.email}`} title={copy.general}>
                <Mail size={14} />
                <span>{contact.email}</span>
              </a>
              <a href={`mailto:${contact.support}`} title={copy.support}>
                <Mail size={14} />
                <span>{contact.support}</span>
              </a>
            </address>
          </div>
        </div>
        <div className="family-footer-base">
          <span>
            {t("footer.rights", { year: new Date().getFullYear() })} {copy.location}
          </span>
          <nav
            aria-label={
              locale === "ar"
                ? "روابط قانونية"
                : locale === "fr"
                  ? "Informations légales"
                  : "Legal information"
            }
          >
            <a href="/terms">{copy.terms}</a>
            <a href="/privacy">{copy.privacy}</a>
            <a href="#top">{copy.top} ↑</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
