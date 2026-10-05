import { BUSINESS_PROFILES } from "@/lib/business-profiles";

/**
 * Translation dictionaries for the NDH ecosystem gateway.
 *
 * Scope, stated honestly: the gateway surface (navigation, hero, ecosystem
 * directory, status bar, bento, foundation, footer and the Omni-Hub consultant
 * chrome) is translated into English, French and Arabic. Arabic drives a real
 * RTL layout. Deeper product pages that are still being migrated fall back to
 * English through `t()` rather than showing a missing-key artefact, so adding a
 * language later is purely additive.
 *
 * English is the canonical dictionary — its keys define `TranslationKey`, so a
 * typo in another language file is a type error rather than a silent gap.
 */

export const en = {
  "nav.businesses": "Businesses",
  "nav.approach": "Our approach",
  "nav.work": "Work",
  "nav.blog": "Blog",
  "nav.about": "About",
  "nav.contact": "Contact",
  "nav.skip": "Skip to content",
  "nav.menu": "Menu",
  "nav.onThisSite": "On this site",
  "nav.status": "Family snapshot",
  "nav.talkToUs": "Talk to us",
  "nav.family": "The family",
  "nav.familyLead": "Every business in the NDH family, grouped by what it does.",
  "nav.familyAll": "See all {count} businesses",
  "app.switcher.label": "Switch application",
  "app.switcher.title": "NDH applications",
  "app.switcher.lead": "Move between the businesses in the NDH family without losing your place.",
  "app.switcher.parentName": "NDH Gateway",
  "app.switcher.parentDesc": "The parent brand and ecosystem directory.",
  "app.switcher.open": "Open",
  "app.switcher.current": "You are here",
  "app.switcher.preview": "Live",
  "app.switcher.soon": "Coming Soon",
  "app.switcher.viewAll": "View the full ecosystem",
  "prefs.label": "Change language",
  "prefs.title": "Language",
  "prefs.language": "Language",
  "prefs.note": "Your language is remembered on this device.",
  "prefs.open": "Preferences",
  "footer.tagline":
    "Digital delivery, AI-skills education, cooperative farming and multi-vendor commerce under one roof.",
  "footer.explore": "Explore",
  "footer.company": "Company",
  "footer.ecosystem": "Ecosystem",
  "footer.rights": "© {year} Najeeb Digital Hub. Nigeria · Worldwide.",
  "home.hero.kicker": "The NDH family",
  "home.hero.origin": "Founded in Nigeria · Open to the world",
  "home.hero.titleTop": "Najeeb",
  "home.hero.titleBottom": "Digital Hub",
  "home.hero.lead":
    "Digital services, practical AI-skills education, cooperative farming and multi-vendor commerce — with school, travel and healthcare platforms coming next.",
  "home.hero.detail":
    "Four active businesses. Three pipeline platforms. One family to help you find the right next step.",
  "home.hero.primary": "Explore our businesses",
  "home.hero.badgeLive": "live today",
  "home.hero.badgeBrands": "businesses in the family",
  "home.hero.scroll": "Scroll to explore",
  "home.hero.footerLeft": "NDH / A growing ecosystem",
  "home.paths.title": "Where can we take you?",
  "home.paths.build": "Build a digital product",
  "home.paths.learn": "Learn a practical skill",
  "home.paths.tools": "Shop or run a storefront",
  "home.paths.services": "Explore cooperative farming",
  "home.stats.eyebrow": "03 / Official family snapshot",
  "home.stats.title": "The family, in verified scope.",
  "home.stats.lead":
    "Confirmed business scope and availability from NDH’s official profiles. These are not live performance or uptime statistics.",
  "home.stats.updated": "Source: NDH official business profiles · 5 October 2026",
  "home.eco.eyebrow": "01 / Explore the ecosystem",
  "home.eco.title": "One name. Many doors.",
  "home.eco.lead":
    "Find the NDH business that fits what you are here to do. Each has its own focus, united by one identity and one standard of delivery.",
  "home.eco.filterAll": "All businesses",
  "home.eco.filterLabel": "Filter by category",
  "home.eco.resultOne": "1 business",
  "home.eco.resultMany": "{count} businesses",
  "home.eco.empty": "Nothing in this category yet — more is on the way.",
  "home.eco.clear": "Show the whole family",
  "home.card.visit": "Visit business",
  "home.card.preview": "Open live preview",
  "home.card.inDevelopment": "Coming Soon",
  "home.card.nextLabel": "The next chapter",
  "home.card.nextTitle": "More to come.",
  "home.card.nextBody": "The system is built to grow with every new NDH business.",
  "home.bento.eyebrow": "02 / Why NDH",
  "home.bento.title": "The advantage is everything the businesses share.",
  "home.bento.lead":
    "Each NDH business stands on its own. What they share is the identity, the standard, the tools and the technology — and that is what makes the family worth more than the sum of its parts.",
  "bento.platforms.title": "Not only digital services",
  "bento.platforms.body":
    "SchoolDesk, Travel and iHospital are Coming Soon: school operations, travel services and digital healthcare are in the pipeline, not live services.",
  "home.foundation.eyebrow": "04 / The idea behind NDH",
  "home.foundation.title": "Built to move things forward.",
  "home.foundation.p1":
    "NDH brings focused businesses under one roof. Some help you make things. Some help you learn. Others help you run everyday life more effectively.",
  "home.foundation.p2":
    "The work is different. The belief behind it is the same: useful ideas deserve to become useful experiences — and the group should be able to carry an idea from a first lesson to a finished product.",
  "home.foundation.cta": "Find your next step",
  "home.foundation.pillar1.title": "One identity",
  "home.foundation.pillar1.body":
    "The Open Gateway symbol travels with every business, with its sector icon set into the corner.",
  "home.foundation.pillar2.title": "Clear responsibilities",
  "home.foundation.pillar2.body":
    "Each business has its own operating model, with defined roles and a clear purpose.",
  "home.foundation.pillar3.title": "One ecosystem",
  "home.foundation.pillar3.body":
    "Learning, managed digital work, cooperative farming and commerce, connected by one parent brand.",
  "home.cta.title": "Not sure which door to open?",
  "home.cta.body":
    "Tell us what you need in one sentence. The team will point you to the right business and take it from there.",
  "eco.category.enterprise.name": "Enterprise Digital Delivery",
  "eco.category.enterprise.blurb":
    "Managed engineering, design and AI delivery through dedicated PM teams.",
  "eco.category.education.name": "Education & Tech Talent",
  "eco.category.education.blurb": "60 practical AI-skills courses across 6 specialized schools.",
  "eco.category.infrastructure.name": "Pipeline Platforms",
  "eco.category.infrastructure.blurb": "SchoolDesk, Travel and iHospital — all Coming Soon.",
  "eco.agency.name": BUSINESS_PROFILES.agency.name,
  "eco.agency.tagline": BUSINESS_PROFILES.agency.tagline,
  "eco.agency.description": BUSINESS_PROFILES.agency.description,
  "eco.agency.point1": BUSINESS_PROFILES.agency.point1,
  "eco.agency.point2": BUSINESS_PROFILES.agency.point2,
  "eco.academy.name": BUSINESS_PROFILES.academy.name,
  "eco.academy.tagline": BUSINESS_PROFILES.academy.tagline,
  "eco.academy.description": BUSINESS_PROFILES.academy.description,
  "eco.academy.point1": BUSINESS_PROFILES.academy.point1,
  "eco.academy.point2": BUSINESS_PROFILES.academy.point2,
  "eco.agricapital.name": BUSINESS_PROFILES.agricapital.name,
  "eco.agricapital.tagline": BUSINESS_PROFILES.agricapital.tagline,
  "eco.agricapital.description": BUSINESS_PROFILES.agricapital.description,
  "eco.agricapital.point1": BUSINESS_PROFILES.agricapital.point1,
  "eco.agricapital.point2": BUSINESS_PROFILES.agricapital.point2,
  "eco.estore.name": BUSINESS_PROFILES.estore.name,
  "eco.estore.tagline": BUSINESS_PROFILES.estore.tagline,
  "eco.estore.description": BUSINESS_PROFILES.estore.description,
  "eco.estore.point1": BUSINESS_PROFILES.estore.point1,
  "eco.estore.point2": BUSINESS_PROFILES.estore.point2,
  "eco.schooldesk.name": BUSINESS_PROFILES.schooldesk.name,
  "eco.schooldesk.tagline": BUSINESS_PROFILES.schooldesk.tagline,
  "eco.schooldesk.description": BUSINESS_PROFILES.schooldesk.description,
  "eco.schooldesk.point1": BUSINESS_PROFILES.schooldesk.point1,
  "eco.schooldesk.point2": BUSINESS_PROFILES.schooldesk.point2,
  "eco.travel.name": BUSINESS_PROFILES.travel.name,
  "eco.travel.tagline": BUSINESS_PROFILES.travel.tagline,
  "eco.travel.description": BUSINESS_PROFILES.travel.description,
  "eco.travel.point1": BUSINESS_PROFILES.travel.point1,
  "eco.travel.point2": BUSINESS_PROFILES.travel.point2,
  "eco.ihospital.name": BUSINESS_PROFILES.ihospital.name,
  "eco.ihospital.tagline": BUSINESS_PROFILES.ihospital.tagline,
  "eco.ihospital.description": BUSINESS_PROFILES.ihospital.description,
  "eco.ihospital.point1": BUSINESS_PROFILES.ihospital.point1,
  "eco.ihospital.point2": BUSINESS_PROFILES.ihospital.point2,
  "chat.launcher.open": "Open the NDH AI consultant",
  "chat.launcher.close": "Close the AI consultant",
  "chat.title": "NDH AI Consultant",
  "chat.subtitle": "Omni-Hub routing",
  "chat.status.online": "Online now",
  "chat.status.thinking": "Thinking",
  "chat.status.typing": "Writing",
  "chat.status.routing": "Routing you",
  "chat.mode.live": "Live model",
  "chat.mode.engine": "Instant routing",
  "chat.placeholder": "Tell me what you need…",
  "chat.send": "Send",
  "chat.thinking": "Working out the best route…",
  "chat.error": "The consultant is unavailable right now.",
  "chat.contactTeam": "Contact the team",
  "chat.reset": "Start again",
  "chat.greeting":
    "Welcome to Najeeb Digital Hub — Agency, Academy, AgriCapital and eStore, with SchoolDesk, Travel and iHospital Coming Soon. Tell me what you need and I’ll point you to the right business.",
  "chat.quickLabel": "Where would you like to start?",
  "chat.chip.hire": "Build with a team",
  "chat.chip.learn": "Find a course",
  "chat.chip.store": "Sell through a storefront",
  "chat.chip.family": "What NDH does",
  "chat.chip.school": "SchoolDesk — Coming Soon",
  "chat.chip.early": "Invest in a farm cycle",
  "chat.chip.pricing": "How pricing works",
  "chat.route.suggested": "Suggested route",
  "chat.route.open": "Open",
  "chat.recommend.title": "Courses that match",
  "chat.recommend.view": "View course",
  "chat.qualify.title": "A quick question",
  "chat.offlineNotice": "Replying instantly from the NDH knowledge base.",
  "chat.handoff": "A specialist can pick this up",
  "chat.summary.title": "Your brief so far",
  "language.en": "English",
  "language.ar": "Arabic",
  "language.fr": "French",
  "bento.identity.title": "One symbol. Every business.",
  "bento.identity.body":
    "The Open Gateway mark travels with every business in the family, with that sector's icon set into the corner of the tile. New businesses join the same system without redesigning the brand.",
  "bento.toolkit.title": "Distinct operating models",
  "bento.toolkit.body":
    "PM-managed delivery, structured learning, farm-cycle equity and vendor storefronts: each business has its own purpose and workflow.",
  "bento.standard.title": "Clear roles and accountability",
  "bento.standard.body":
    "Agency PMs oversee delivery; Academy learners complete capstones; AgriCapital operators log farm activity; eStore vendors manage their storefronts.",
  "bento.region.title": "Built in Nigeria. Open to the world.",
  "bento.region.body":
    "We work across regions, time zones and languages, with the parent gateway available in English, French and Arabic.",
  "home.trust.identity": "One identity across the family",
  "home.trust.review": "Defined roles in each business",
  "home.trust.support": "One support team across the family",
  "home.hero.badgeComing": "coming soon",
  "metric.businesses": "Businesses in the family",
  "metric.liveBusinesses": "Active businesses",
  "metric.comingBusinesses": "Coming Soon",
  "metric.courses": "Practical AI-skills courses",
  "metric.schools": "Specialized Academy schools",
  "metric.departments": "Agency service departments",
  "eco.category.agriculture.name": "Agriculture & Cooperative Farming",
  "eco.category.agriculture.blurb":
    "Farm-cycle contributions, transparent equity and harvest profit distribution.",
  "eco.category.commerce.name": "Commerce & Retail Infrastructure",
  "eco.category.commerce.blurb":
    "Multi-vendor digital and physical storefronts, shipping and checkout.",
  "eco.agency.category": BUSINESS_PROFILES.agency.category,
  "eco.academy.category": BUSINESS_PROFILES.academy.category,
  "eco.agricapital.category": BUSINESS_PROFILES.agricapital.category,
  "eco.estore.category": BUSINESS_PROFILES.estore.category,
  "eco.schooldesk.category": BUSINESS_PROFILES.schooldesk.category,
  "eco.travel.category": BUSINESS_PROFILES.travel.category,
  "eco.ihospital.category": BUSINESS_PROFILES.ihospital.category,
};

/** French — complete translation of the gateway surface. */
export const fr: Dictionary = {
  "nav.businesses": "Entreprises",
  "nav.approach": "Notre approche",
  "nav.work": "Réalisations",
  "nav.blog": "Blog",
  "nav.about": "À propos",
  "nav.contact": "Contact",
  "nav.skip": "Aller au contenu",
  "nav.menu": "Menu",
  "nav.onThisSite": "Sur ce site",
  "nav.status": "Vue d’ensemble",
  "nav.talkToUs": "Parlez-nous",
  "nav.family": "Le groupe",
  "nav.familyLead": "Chaque entreprise du groupe NDH, classée par activité.",
  "nav.familyAll": "Voir les {count} entreprises",
  "app.switcher.label": "Changer d’application",
  "app.switcher.title": "Applications NDH",
  "app.switcher.lead": "Passez d’une entreprise du groupe NDH à l’autre sans perdre le fil.",
  "app.switcher.parentName": "Portail NDH",
  "app.switcher.parentDesc": "La marque mère et l’annuaire de l’écosystème.",
  "app.switcher.open": "Ouvrir",
  "app.switcher.current": "Vous êtes ici",
  "app.switcher.preview": "Disponible",
  "app.switcher.soon": "Bientôt disponible",
  "app.switcher.viewAll": "Voir tout l’écosystème",
  "prefs.label": "Changer de langue",
  "prefs.title": "Langue",
  "prefs.language": "Langue",
  "prefs.note": "Votre langue est mémorisée sur cet appareil.",
  "prefs.open": "Préférences",
  "footer.tagline":
    "Services digitaux, formation aux compétences IA, agriculture coopérative et commerce multivendeur sous un même toit.",
  "footer.explore": "Explorer",
  "footer.company": "Entreprise",
  "footer.ecosystem": "Écosystème",
  "footer.rights": "© {year} Najeeb Digital Hub. Nigeria · International.",
  "home.hero.kicker": "La famille NDH",
  "home.hero.origin": "Fondé au Nigeria · Ouvert au monde",
  "home.hero.titleTop": "Najeeb",
  "home.hero.titleBottom": "Digital Hub",
  "home.hero.lead":
    "Services digitaux, compétences IA pratiques, agriculture coopérative et commerce multivendeur — puis des plateformes scolaires, de voyage et de santé à venir.",
  "home.hero.detail":
    "Quatre entreprises actives. Trois plateformes à venir. Une famille pour trouver la prochaine étape.",
  "home.hero.primary": "Découvrir nos entreprises",
  "home.hero.badgeLive": "actives aujourd’hui",
  "home.hero.badgeBrands": "entreprises dans le groupe",
  "home.hero.scroll": "Faites défiler",
  "home.hero.footerLeft": "NDH / Un écosystème en croissance",
  "home.paths.title": "Où pouvons-nous vous emmener ?",
  "home.paths.build": "Créer un produit digital",
  "home.paths.learn": "Apprendre une compétence",
  "home.paths.tools": "Acheter ou gérer une boutique",
  "home.paths.services": "Explorer l’agriculture coopérative",
  "home.stats.eyebrow": "03 / Profil officiel du groupe",
  "home.stats.title": "Le groupe, en chiffres confirmés.",
  "home.stats.lead":
    "Périmètre et disponibilité confirmés par les profils officiels NDH. Ce ne sont pas des statistiques de performance ou de disponibilité en temps réel.",
  "home.stats.updated": "Source : profils officiels NDH · 5 octobre 2026",
  "home.eco.eyebrow": "01 / Explorer l’écosystème",
  "home.eco.title": "Un nom. Plusieurs portes.",
  "home.eco.lead":
    "Trouvez l’entreprise NDH adaptée à votre besoin. Chacune a son métier, reliée par une identité et un standard de livraison.",
  "home.eco.filterAll": "Toutes les entreprises",
  "home.eco.filterLabel": "Filtrer par catégorie",
  "home.eco.resultOne": "1 entreprise",
  "home.eco.resultMany": "{count} entreprises",
  "home.eco.empty": "Rien dans cette catégorie pour l’instant — la suite arrive.",
  "home.eco.clear": "Voir toute la famille",
  "home.card.visit": "Visiter l’entreprise",
  "home.card.preview": "Ouvrir l’aperçu",
  "home.card.inDevelopment": "Bientôt disponible",
  "home.card.nextLabel": "Le prochain chapitre",
  "home.card.nextTitle": "La suite arrive.",
  "home.card.nextBody": "Le système est conçu pour grandir avec chaque nouvelle entreprise NDH.",
  "home.bento.eyebrow": "02 / Pourquoi NDH",
  "home.bento.title": "L'avantage, c'est tout ce que les entreprises partagent.",
  "home.bento.lead":
    "Chaque entreprise NDH tient debout seule. Ce qu'elles partagent, c'est l'identité, le standard, les outils et la technologie — et c'est ce qui fait du groupe bien plus que la somme de ses parties.",
  "bento.platforms.title": "Pas seulement des services numériques",
  "bento.platforms.body":
    "SchoolDesk, Travel et iHospital sont à venir : gestion scolaire, voyages et santé numérique sont en préparation, pas encore disponibles.",
  "home.foundation.eyebrow": "04 / L’idée derrière NDH",
  "home.foundation.title": "Conçu pour faire avancer les choses.",
  "home.foundation.p1":
    "NDH réunit des entreprises ciblées sous un même toit. Certaines vous aident à créer, d’autres à apprendre, d’autres encore à mieux gérer le quotidien.",
  "home.foundation.p2":
    "Le travail diffère, la conviction est la même : une idée utile mérite de devenir une expérience utile — et le groupe doit pouvoir porter une idée de la première leçon au produit fini.",
  "home.foundation.cta": "Trouver votre prochain pas",
  "home.foundation.pillar1.title": "Une identité",
  "home.foundation.pillar1.body":
    "Le symbole Open Gateway accompagne chaque entreprise, avec son icône sectorielle dans l’angle.",
  "home.foundation.pillar2.title": "Des responsabilités claires",
  "home.foundation.pillar2.body":
    "Chaque entreprise possède son propre modèle, des rôles définis et un objectif clair.",
  "home.foundation.pillar3.title": "Un écosystème",
  "home.foundation.pillar3.body":
    "Formation, services digitaux, agriculture coopérative et commerce, reliés par une marque commune.",
  "home.cta.title": "Vous ne savez pas quelle porte ouvrir ?",
  "home.cta.body":
    "Dites-nous en une phrase ce dont vous avez besoin. L’équipe vous orientera vers la bonne entreprise et prendra le relais.",
  "eco.category.enterprise.name": "Services digitaux aux entreprises",
  "eco.category.enterprise.blurb":
    "Ingénierie, design et IA encadrés par des chefs de projet dédiés.",
  "eco.category.education.name": "Éducation et talents technologiques",
  "eco.category.education.blurb":
    "60 cours pratiques de compétences IA dans 6 écoles spécialisées.",
  "eco.category.infrastructure.name": "Plateformes à venir",
  "eco.category.infrastructure.blurb": "SchoolDesk, Travel et iHospital — bientôt disponibles.",
  "eco.agency.name": "NDH Agency",
  "eco.agency.tagline":
    "Ingénierie, design et automatisation IA de niveau entreprise, livrés par des équipes de chefs de projet dédiés.",
  "eco.agency.description":
    "Bureau de services digitaux comprenant 10 départements, dont stratégie de marque, UI/UX, ingénierie web/app full-stack, systèmes IA sur mesure et marketing de croissance. Une séparation confidentielle stricte interdit tout contact direct entre clients et talents.",
  "eco.agency.point1": "Contrôle qualité et validation des jalons par les chefs de projet",
  "eco.agency.point2": "Séparation client–talent et paiements des talents via séquestre",
  "eco.academy.name": "NDH Academy",
  "eco.academy.tagline": "60 cours pratiques dans 6 écoles avec des certificats vérifiables.",
  "eco.academy.description":
    "60 cours de compétences IA : ingénierie IA, design et marque, médias et vidéo, rédaction et contenu, marketing et croissance, gestion et opérations. Leçons vidéo structurées, projets de synthèse et certificats signés vérifiables cryptographiquement.",
  "eco.academy.point1": "Leçons vidéo et quiz de préparation avant projet",
  "eco.academy.point2": "Projets de synthèse et vérification des certificats sur /verify",
  "eco.agricapital.name": "NDH AgriCapital",
  "eco.agricapital.tagline":
    "Investissements agricoles via un registre partagé transparent, avec versements automatisés selon les parts après récolte.",
  "eco.agricapital.description":
    "Les contributeurs financent élevage et cultures par Paystack ou virement. Les parts sont calculées en direct depuis le registre partagé. Les opérateurs enregistrent alimentation, croissance et dépenses ; après récolte et vente, l’administrateur clôture le cycle et répartit les bénéfices proportionnellement aux parts.",
  "eco.agricapital.point1": "Registre des contributions et calcul des parts en direct",
  "eco.agricapital.point2": "Dépenses des fermes et bénéfices répartis au prorata",
  "eco.estore.name": "NDH eStore",
  "eco.estore.tagline":
    "Moteur de boutiques multivendeurs pour le commerce local et transfrontalier.",
  "eco.estore.description":
    "Plateforme mondiale de produits physiques et numériques : inscription automatisée des marchands, boutiques /store/:vendorSlug, gestion des produits et stocks, livraison nationale et internationale.",
  "eco.estore.point1": "Paiement via Paystack et Flutterwave",
  "eco.estore.point2": "Boutiques personnalisées et registres automatisés de versements vendeurs",
  "eco.schooldesk.name": "NDH SchoolDesk",
  "eco.schooldesk.tagline":
    "Système EdTech de gestion scolaire, de notation et de bulletins automatisés.",
  "eco.schooldesk.description":
    "Bientôt disponible. Gestion scolaire, notation et bulletins automatisés en préparation ; pas encore d’inscription ni d’exploitation scolaire.",
  "eco.schooldesk.point1": "Gestion scolaire et notation prévues",
  "eco.schooldesk.point2": "Bulletins automatisés · À venir",
  "eco.travel.name": "NDH Travel",
  "eco.travel.tagline": "Conciergerie de voyage, réservation de vols et conseil en visas.",
  "eco.travel.description":
    "Bientôt disponible. Conciergerie, vols et conseil en visas en préparation ; les réservations ne sont pas ouvertes.",
  "eco.travel.point1": "Conciergerie et réservation de vols prévues",
  "eco.travel.point2": "Conseil en visas · À venir",
  "eco.ihospital.name": "NDH iHospital",
  "eco.ihospital.tagline": "Infrastructure de télémédecine et de gestion numérique des cliniques.",
  "eco.ihospital.description":
    "Bientôt disponible. Télémédecine et gestion de cliniques en développement ; aucune consultation ni prestation clinique actuellement.",
  "eco.ihospital.point1": "Infrastructure de télémédecine prévue",
  "eco.ihospital.point2": "Gestion numérique des cliniques · À venir",
  "chat.launcher.open": "Ouvrir le consultant IA NDH",
  "chat.launcher.close": "Fermer le consultant IA",
  "chat.title": "Consultant IA NDH",
  "chat.subtitle": "Orientation Omni-Hub",
  "chat.status.online": "En ligne",
  "chat.status.thinking": "Réflexion",
  "chat.status.typing": "Rédaction",
  "chat.status.routing": "Orientation",
  "chat.mode.live": "Modèle en direct",
  "chat.mode.engine": "Orientation instantanée",
  "chat.placeholder": "Dites-moi ce qu’il vous faut…",
  "chat.send": "Envoyer",
  "chat.thinking": "Recherche du meilleur parcours…",
  "chat.error": "Le consultant est indisponible pour le moment.",
  "chat.contactTeam": "Contacter l’équipe",
  "chat.reset": "Recommencer",
  "chat.greeting":
    "Bienvenue chez NDH : Agency, Academy, AgriCapital et eStore, avec SchoolDesk, Travel et iHospital à venir. Décrivez votre besoin pour trouver la bonne entreprise.",
  "chat.quickLabel": "Par où voulez-vous commencer ?",
  "chat.chip.hire": "Construire avec une équipe",
  "chat.chip.learn": "Trouver un cours",
  "chat.chip.store": "Vendre dans une boutique",
  "chat.chip.family": "Ce que fait NDH",
  "chat.chip.school": "SchoolDesk — à venir",
  "chat.chip.early": "Investir dans un cycle agricole",
  "chat.chip.pricing": "Comment se fixent les prix",
  "chat.route.suggested": "Parcours suggéré",
  "chat.route.open": "Ouvrir",
  "chat.recommend.title": "Cours correspondants",
  "chat.recommend.view": "Voir le cours",
  "chat.qualify.title": "Une question rapide",
  "chat.offlineNotice": "Réponse instantanée depuis la base de connaissances NDH.",
  "chat.handoff": "Un spécialiste peut prendre le relais",
  "chat.summary.title": "Votre brief jusqu’ici",
  "language.en": "Anglais",
  "language.ar": "Arabe",
  "language.fr": "Français",
  "bento.identity.title": "Un symbole. Chaque entreprise.",
  "bento.identity.body":
    "Le symbole Open Gateway accompagne chaque entreprise du groupe, avec l'icône de son secteur dans l'angle. Les nouvelles entreprises rejoignent le système sans refonte de marque.",
  "bento.toolkit.title": "Des modèles distincts",
  "bento.toolkit.body":
    "Livraison encadrée par un chef de projet, apprentissage structuré, participations agricoles et boutiques vendeurs : chaque entreprise a son propre fonctionnement.",
  "bento.standard.title": "Des rôles et responsabilités clairs",
  "bento.standard.body":
    "Les chefs de projet supervisent Agency, les apprenants réalisent des projets, les opérateurs AgriCapital suivent les fermes et les vendeurs eStore gèrent leurs boutiques.",
  "bento.region.title": "Né au Nigeria. Ouvert au monde.",
  "bento.region.body":
    "Nous travaillons sur plusieurs régions, fuseaux et langues, avec la passerelle disponible en anglais, français et arabe.",
  "home.trust.identity": "Une identité pour tout le groupe",
  "home.trust.review": "Des rôles définis dans chaque entreprise",
  "home.trust.support": "Une équipe d’appui pour tout le groupe",
  "home.hero.badgeComing": "à venir",
  "metric.businesses": "Entreprises du groupe",
  "metric.liveBusinesses": "Entreprises actives",
  "metric.comingBusinesses": "À venir",
  "metric.courses": "Cours pratiques de compétences IA",
  "metric.schools": "Écoles spécialisées Academy",
  "metric.departments": "Départements de services Agency",
  "eco.category.agriculture.name": "Investissement agricole et coopératives",
  "eco.category.agriculture.blurb":
    "Contributions aux cycles agricoles, participations transparentes et répartition des bénéfices.",
  "eco.category.commerce.name": "Commerce et infrastructure de vente",
  "eco.category.commerce.blurb":
    "Boutiques multivendeurs, produits physiques et numériques, livraison et paiement.",
  "eco.agency.category": "Services digitaux aux entreprises",
  "eco.academy.category": "Éducation et talents technologiques",
  "eco.agricapital.category": "Investissement agricole et agriculture coopérative",
  "eco.estore.category": "Commerce et infrastructure de vente",
  "eco.schooldesk.category": "Technologie éducative · À venir",
  "eco.travel.category": "Services de voyage · À venir",
  "eco.ihospital.category": "Santé numérique · À venir",
};

/** Arabic — complete translation of the gateway surface; drives the RTL layout. */
export const ar: Dictionary = {
  "nav.businesses": "الشركات",
  "nav.approach": "منهجنا",
  "nav.work": "أعمالنا",
  "nav.blog": "المدونة",
  "nav.about": "من نحن",
  "nav.contact": "اتصل بنا",
  "nav.skip": "تجاوز إلى المحتوى",
  "nav.menu": "القائمة",
  "nav.onThisSite": "في هذا الموقع",
  "nav.status": "لمحة عن المجموعة",
  "nav.talkToUs": "تحدّث إلينا",
  "nav.family": "المجموعة",
  "nav.familyLead": "كل شركة في مجموعة NDH مصنفة حسب نشاطها.",
  "nav.familyAll": "عرض {count} شركات",
  "app.switcher.label": "تبديل التطبيق",
  "app.switcher.title": "تطبيقات NDH",
  "app.switcher.lead": "تنقّل بين شركات مجموعة NDH دون أن تفقد مكانك.",
  "app.switcher.parentName": "بوابة NDH",
  "app.switcher.parentDesc": "العلامة الأم ودليل المنظومة.",
  "app.switcher.open": "فتح",
  "app.switcher.current": "أنت هنا",
  "app.switcher.preview": "متاح",
  "app.switcher.soon": "قريباً",
  "app.switcher.viewAll": "عرض المنظومة كاملة",
  "prefs.label": "تغيير اللغة",
  "prefs.title": "اللغة",
  "prefs.language": "اللغة",
  "prefs.note": "يتم تذكّر لغتك على هذا الجهاز.",
  "prefs.open": "التفضيلات",
  "footer.tagline":
    "خدمات رقمية وتعليم مهارات الذكاء الاصطناعي وزراعة تعاونية وتجارة متعددة البائعين تحت سقف واحد.",
  "footer.explore": "استكشف",
  "footer.company": "الشركة",
  "footer.ecosystem": "المنظومة",
  "footer.rights": "© {year} نجيب ديجيتال هب. نيجيريا · العالم.",
  "home.hero.kicker": "مجموعة NDH",
  "home.hero.origin": "تأسست في نيجيريا · منفتحة على العالم",
  "home.hero.titleTop": "نجيب",
  "home.hero.titleBottom": "ديجيتال هب",
  "home.hero.lead":
    "خدمات رقمية ومهارات عملية في الذكاء الاصطناعي وزراعة تعاونية وتجارة متعددة البائعين — ومنصات للمدارس والسفر والرعاية الصحية قريباً.",
  "home.hero.detail":
    "أربع شركات نشطة وثلاث منصات قادمة. مجموعة واحدة لمساعدتك في اختيار خطوتك التالية.",
  "home.hero.primary": "استكشف شركاتنا",
  "home.hero.badgeLive": "تعمل اليوم",
  "home.hero.badgeBrands": "شركات في المجموعة",
  "home.hero.scroll": "مرّر للاستكشاف",
  "home.hero.footerLeft": "NDH / منظومة في نمو",
  "home.paths.title": "إلى أين نأخذك؟",
  "home.paths.build": "ابنِ منتجًا رقميًا",
  "home.paths.learn": "تعلّم مهارة عملية",
  "home.paths.tools": "تسوّق أو أدر متجرك",
  "home.paths.services": "اكتشف الزراعة التعاونية",
  "home.stats.eyebrow": "03 / لمحة رسمية عن المجموعة",
  "home.stats.title": "نطاق أعمال موثّق بالأرقام.",
  "home.stats.lead":
    "نطاق الأعمال وحالة التوفر وفق ملفات NDH الرسمية. هذه ليست إحصاءات مباشرة للأداء أو وقت التشغيل.",
  "home.stats.updated": "المصدر: ملفات أعمال NDH الرسمية · 5 أكتوبر 2026",
  "home.eco.eyebrow": "01 / استكشف المنظومة",
  "home.eco.title": "اسم واحد. أبواب كثيرة.",
  "home.eco.lead":
    "اعثر على شركة NDH المناسبة لما تريد. لكل شركة تخصصها، وتجمعها هوية واحدة ومعيار تنفيذ واحد.",
  "home.eco.filterAll": "كل الشركات",
  "home.eco.filterLabel": "تصفية حسب الفئة",
  "home.eco.resultOne": "شركة واحدة",
  "home.eco.resultMany": "{count} شركات",
  "home.eco.empty": "لا يوجد شيء في هذه الفئة بعد — المزيد قادم.",
  "home.eco.clear": "اعرض المجموعة كاملة",
  "home.card.visit": "زيارة الشركة",
  "home.card.preview": "النسخة التجريبية",
  "home.card.inDevelopment": "قريباً",
  "home.card.nextLabel": "الفصل القادم",
  "home.card.nextTitle": "المزيد قادم.",
  "home.card.nextBody": "المنظومة مبنية لتنمو مع كل شركة جديدة.",
  "home.bento.eyebrow": "02 / لماذا NDH",
  "home.bento.title": "الميزة هي كل ما تتشاركه الشركات.",
  "home.bento.lead":
    "كل شركة في NDH قائمة بذاتها. وما تتشاركه هو الهوية والمعيار والأدوات والتقنية — وهذا ما يجعل المجموعة أكبر من مجموع أجزائها.",
  "bento.platforms.title": "ليست خدمات رقمية فقط",
  "bento.platforms.body":
    "SchoolDesk وTravel وiHospital قيد التطوير: إدارة المدارس والسفر والرعاية الصحية الرقمية خدمات قادمة وليست متاحة حالياً.",
  "home.foundation.eyebrow": "04 / الفكرة وراء NDH",
  "home.foundation.title": "مبنيّة لدفع الأمور إلى الأمام.",
  "home.foundation.p1":
    "تجمع NDH شركات مركّزة تحت سقف واحد. بعضها يساعدك على البناء، وبعضها على التعلّم، وأخرى على إدارة الحياة اليومية بكفاءة.",
  "home.foundation.p2":
    "العمل مختلف، والإيمان واحد: الأفكار النافعة تستحق أن تصبح تجارب نافعة — ويجب أن تحمل المجموعة الفكرة من الدرس الأول إلى منتج مكتمل.",
  "home.foundation.cta": "اكتشف خطوتك القادمة",
  "home.foundation.pillar1.title": "هوية واحدة",
  "home.foundation.pillar1.body":
    "رمز البوابة المفتوحة يرافق كل شركة، مع أيقونة قطاعها في الزاوية.",
  "home.foundation.pillar2.title": "مسؤوليات واضحة",
  "home.foundation.pillar2.body": "لكل شركة نموذج تشغيل وأدوار محددة وغرض واضح.",
  "home.foundation.pillar3.title": "منظومة واحدة",
  "home.foundation.pillar3.body":
    "تعليم وخدمات رقمية وزراعة تعاونية وتجارة تربطها علامة رئيسية واحدة.",
  "home.cta.title": "لا تعرف أي باب تفتح؟",
  "home.cta.body":
    "أخبرنا بما تحتاجه في جملة واحدة، وسيوجّهك الفريق إلى الشركة المناسبة ويتابع معك.",
  "eco.category.enterprise.name": "خدمات رقمية للمؤسسات",
  "eco.category.enterprise.blurb": "هندسة وتصميم وذكاء اصطناعي بإشراف فرق متخصصة لإدارة المشاريع.",
  "eco.category.education.name": "التعليم والمواهب التقنية",
  "eco.category.education.blurb": "60 دورة عملية لمهارات الذكاء الاصطناعي ضمن 6 مدارس متخصصة.",
  "eco.category.infrastructure.name": "منصات قادمة",
  "eco.category.infrastructure.blurb": "SchoolDesk وTravel وiHospital — جميعها قريباً.",
  "eco.agency.name": "NDH Agency",
  "eco.agency.tagline":
    "هندسة وتصميم وأتمتة بالذكاء الاصطناعي بمستوى مؤسسي تقدمها فرق متخصصة لإدارة المشاريع.",
  "eco.agency.description":
    "مكتب خدمات رقمية يضم 10 أقسام أساسية، منها استراتيجية العلامة وUI/UX وهندسة الويب والتطبيقات المتكاملة وأنظمة الذكاء الاصطناعي المخصصة وتسويق النمو. يفرض مديرو المشاريع عزلاً سرياً صارماً: لا يتواصل العملاء والمختصون مباشرة.",
  "eco.agency.point1": "ضبط الجودة والتحقق من مراحل التسليم بإشراف مديري المشاريع",
  "eco.agency.point2": "فصل سري بين العملاء والمختصين وصرف مستحقات الضمان",
  "eco.academy.name": "NDH Academy",
  "eco.academy.tagline": "60 دورة عملية ضمن 6 مدارس مع شهادات قابلة للتحقق.",
  "eco.academy.description":
    "60 دورة لمهارات الذكاء الاصطناعي في هندسة الذكاء الاصطناعي والتصميم والعلامة والإعلام والفيديو والكتابة والمحتوى والتسويق والنمو والأعمال والعمليات. دروس فيديو منظمة ومشاريع ختامية وشهادات موقعة قابلة للتحقق تشفيرياً.",
  "eco.academy.point1": "دروس فيديو واختبارات استعداد قبل المشروع",
  "eco.academy.point2": "مشاريع ختامية والتحقق من الشهادات عبر /verify",
  "eco.agricapital.name": "NDH AgriCapital",
  "eco.agricapital.tagline":
    "استثمارات زراعية بسجل مشترك شفاف وتوزيعات آلية حسب حصص الملكية بعد الحصاد.",
  "eco.agricapital.description":
    "يمول المساهمون دورات تربية المواشي والزراعة عبر Paystack أو التحويل المباشر. تُحسب الحصص مباشرة من سجل المساهمات. يسجل المشغلون التغذية والنمو والمصروفات؛ وبعد الحصاد والبيع يغلق المسؤول الدورة ويوزع الأرباح بنسبة حصة كل مساهم.",
  "eco.agricapital.point1": "سجل مساهمات مشترك وحساب مباشر لحصص الملكية",
  "eco.agricapital.point2": "تسجيل المصروفات وتوزيع أرباح الحصاد بنسبة الحصص",
  "eco.estore.name": "NDH eStore",
  "eco.estore.tagline": "محرك متاجر متعددة البائعين يدعم التجارة المحلية والعابرة للحدود.",
  "eco.estore.description":
    "منصة عالمية للمنتجات الرقمية والمادية: تسجيل آلي للتجار ومتاجر مخصصة عبر /store/:vendorSlug وإدارة المنتجات والمخزون ومسارات شحن محلية ودولية.",
  "eco.estore.point1": "الدفع عبر Paystack وFlutterwave",
  "eco.estore.point2": "متاجر مخصصة وسجلات آلية لمستحقات البائعين",
  "eco.schooldesk.name": "NDH SchoolDesk",
  "eco.schooldesk.tagline": "نظام لإدارة المدارس والتقييم وإصدار تقارير الدرجات آلياً.",
  "eco.schooldesk.description":
    "قريباً. نظام لإدارة المدارس والتقييم والتقارير الآلية قيد التطوير؛ التسجيل والتشغيل المدرسي غير متاحين حالياً.",
  "eco.schooldesk.point1": "إدارة المدارس والتقييم ضمن الخطة",
  "eco.schooldesk.point2": "تقارير درجات آلية · قريباً",
  "eco.travel.name": "NDH Travel",
  "eco.travel.tagline": "خدمات كونسيرج السفر وحجز الطيران والاستشارات المتعلقة بالتأشيرات.",
  "eco.travel.description":
    "قريباً. خدمات السفر والطيران واستشارات التأشيرات قيد التحضير؛ الحجوزات غير متاحة حالياً.",
  "eco.travel.point1": "خدمات سفر وحجز طيران ضمن الخطة",
  "eco.travel.point2": "استشارات التأشيرات · قريباً",
  "eco.ihospital.name": "NDH iHospital",
  "eco.ihospital.tagline": "بنية تحتية للتطبيب عن بُعد وإدارة العيادات الرقمية.",
  "eco.ihospital.description":
    "قريباً. التطبيب عن بُعد وإدارة العيادات قيد التطوير؛ لا تقدم المنصة استشارات أو خدمات سريرية حالياً.",
  "eco.ihospital.point1": "بنية للتطبيب عن بُعد ضمن الخطة",
  "eco.ihospital.point2": "إدارة العيادات الرقمية · قريباً",
  "chat.launcher.open": "افتح مستشار NDH الذكي",
  "chat.launcher.close": "إغلاق المستشار الذكي",
  "chat.title": "مستشار NDH الذكي",
  "chat.subtitle": "توجيه Omni-Hub",
  "chat.status.online": "متصل الآن",
  "chat.status.thinking": "يفكّر",
  "chat.status.typing": "يكتب",
  "chat.status.routing": "يوجّهك",
  "chat.mode.live": "نموذج مباشر",
  "chat.mode.engine": "توجيه فوري",
  "chat.placeholder": "أخبرني بما تحتاجه…",
  "chat.send": "إرسال",
  "chat.thinking": "أبحث عن أفضل مسار…",
  "chat.error": "المستشار غير متاح الآن.",
  "chat.contactTeam": "تواصل مع الفريق",
  "chat.reset": "ابدأ من جديد",
  "chat.greeting":
    "مرحباً بك في NDH: Agency وAcademy وAgriCapital وeStore، مع SchoolDesk وTravel وiHospital قريباً. أخبرني بما تحتاج لأرشدك إلى الشركة المناسبة.",
  "chat.quickLabel": "من أين تحب أن تبدأ؟",
  "chat.chip.hire": "ابنِ مع فريق",
  "chat.chip.learn": "ابحث عن دورة",
  "chat.chip.store": "بع عبر متجر خاص",
  "chat.chip.family": "ما الذي تقدمه NDH",
  "chat.chip.school": "SchoolDesk — قريباً",
  "chat.chip.early": "استثمر في دورة زراعية",
  "chat.chip.pricing": "كيف تُحسب الأسعار",
  "chat.route.suggested": "المسار المقترح",
  "chat.route.open": "فتح",
  "chat.recommend.title": "دورات مناسبة",
  "chat.recommend.view": "عرض الدورة",
  "chat.qualify.title": "سؤال سريع",
  "chat.offlineNotice": "رد فوري من قاعدة معرفة NDH.",
  "chat.handoff": "يمكن لمختص متابعة الأمر",
  "chat.summary.title": "ملخص طلبك حتى الآن",
  "language.en": "الإنجليزية",
  "language.ar": "العربية",
  "language.fr": "الفرنسية",
  "bento.identity.title": "رمز واحد. لكل شركة.",
  "bento.identity.body":
    "يرافق رمز البوابة المفتوحة كل شركة في المجموعة، مع أيقونة قطاعها في زاوية الشعار. وتنضم الشركات الجديدة إلى النظام نفسه دون إعادة تصميم العلامة.",
  "bento.toolkit.title": "نماذج تشغيل مختلفة",
  "bento.toolkit.body":
    "خدمات بإدارة مشاريع وتعليم منظم وحصص في دورات زراعية ومتاجر للبائعين: لكل شركة غرضها وطريقة عملها.",
  "bento.standard.title": "أدوار ومسؤوليات واضحة",
  "bento.standard.body":
    "مديرو المشاريع يشرفون على الوكالة، والمتعلمون ينجزون مشاريع تطبيقية، ومشغلو AgriCapital يسجلون أعمال المزارع، وبائعو eStore يديرون متاجرهم.",
  "bento.region.title": "وُلدت في نيجيريا. ومنفتحة على العالم.",
  "bento.region.body":
    "نعمل عبر مناطق ولغات ومناطق زمنية مختلفة، والبوابة الأم متاحة بالإنجليزية والفرنسية والعربية.",
  "home.trust.identity": "هوية واحدة لكل المجموعة",
  "home.trust.review": "أدوار محددة في كل شركة",
  "home.trust.support": "فريق دعم واحد لكل المجموعة",
  "home.hero.badgeComing": "قريباً",
  "metric.businesses": "شركات المجموعة",
  "metric.liveBusinesses": "شركات نشطة",
  "metric.comingBusinesses": "قريباً",
  "metric.courses": "دورات عملية لمهارات الذكاء الاصطناعي",
  "metric.schools": "مدارس أكاديمية متخصصة",
  "metric.departments": "أقسام خدمات الوكالة",
  "eco.category.agriculture.name": "الاستثمار الزراعي والزراعة التعاونية",
  "eco.category.agriculture.blurb": "تمويل دورات زراعية وحصص ملكية شفافة وتوزيع أرباح الحصاد.",
  "eco.category.commerce.name": "التجارة والبنية التحتية للبيع",
  "eco.category.commerce.blurb": "متاجر متعددة البائعين للمنتجات الرقمية والمادية والشحن والدفع.",
  "eco.agency.category": "خدمات رقمية للمؤسسات",
  "eco.academy.category": "التعليم والمواهب التقنية",
  "eco.agricapital.category": "الاستثمار الزراعي والزراعة التعاونية",
  "eco.estore.category": "التجارة والبنية التحتية للبيع",
  "eco.schooldesk.category": "تقنية التعليم · قريباً",
  "eco.travel.category": "خدمات السفر · قريباً",
  "eco.ihospital.category": "الرعاية الصحية الرقمية · قريباً",
};

export type TranslationKey = keyof typeof en;

/** Partially translated dictionaries fall back to English per key. */
export type Dictionary = Partial<Record<TranslationKey, string>>;

export type LocaleId = "en" | "fr" | "ar";

export type LocaleOption = {
  id: LocaleId;
  /** Endonym — always shown in its own language, never translated. */
  native: string;
  /** Text direction for the document. */
  dir: "ltr" | "rtl";
};

export const LOCALES: LocaleOption[] = [
  { id: "en", native: "English", dir: "ltr" },
  { id: "fr", native: "Français", dir: "ltr" },
  { id: "ar", native: "العربية", dir: "rtl" },
];

export const DEFAULT_LOCALE: LocaleId = "en";

export const DICTIONARIES: Record<LocaleId, Dictionary> = { en, fr, ar };

export function localeDirection(locale: LocaleId): "ltr" | "rtl" {
  return LOCALES.find((item) => item.id === locale)?.dir ?? "ltr";
}

/** Interpolate `{placeholders}` in a translated string. */
function interpolate(template: string, vars?: Record<string, string | number>) {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : match,
  );
}

/**
 * Resolve a key for a locale, falling back to English and finally to the raw
 * key so a missing translation never renders as blank space.
 */
export function translate(
  locale: LocaleId,
  key: TranslationKey,
  vars?: Record<string, string | number>,
): string {
  const value = DICTIONARIES[locale]?.[key] ?? en[key] ?? key;
  return interpolate(value, vars);
}
