import { SITE_CONTACT as contact } from "@/lib/site-contact";

/** Parent gateway notices. Subsidiary agreements remain separate. */
export function FamilyTerms() {
  return (
    <>
      <p className="family-small">Last updated: 5 October 2026 · Parent website: ndh.com.ng</p>
      <h2>1. About this website</h2>
      <p>
        Najeeb Digital Hub (NDH) is a family of businesses based at {contact.address}. This website
        introduces the family, publishes editorial content and helps you contact the relevant
        business. These terms apply to your use of this parent website.
      </p>
      <h2>2. Finding and using a service</h2>
      <p>
        The directory links to businesses with their own products, platforms and processes. A
        listing is not a booking, enrolment, purchase or service agreement. Check the destination’s
        current availability and terms before proceeding. Any scope, delivery commitment,
        cancellation or refund arrangements should be confirmed with the business providing the
        service.
      </p>
      <p>
        SchoolDesk, Travel and iHospital are identified as upcoming initiatives. Their inclusion
        does not mean they are currently accepting school onboarding or bookings, providing care or
        offering services.
      </p>
      <h2>3. Responsible use</h2>
      <p>
        Use the website lawfully. Do not attempt unauthorised access, interfere with its operation,
        submit malicious content or impersonate someone else. When contacting us, provide accurate
        information and only share material you have the right to share.
      </p>
      <h2>4. Articles and automated guidance</h2>
      <p>
        Journal articles are general information, not advice tailored to your circumstances. The
        automated consultant is intended to help you navigate the family; its answers may be
        incomplete or incorrect. Confirm service details directly with the relevant team. Neither
        articles nor automated responses replace professional medical, legal or financial advice.
      </p>
      <h2>5. Content and intellectual property</h2>
      <p>
        NDH branding and original website content belong to NDH or their respective rights holders.
        You may link to our pages and share brief attributed excerpts where permitted by law.
        Contact us before republishing substantial material or using the brand in a way that
        suggests an affiliation or endorsement.
      </p>
      <h2>6. Links and availability</h2>
      <p>
        Links may take you to subsidiary or third-party websites with separate terms and privacy
        practices. We aim to keep the gateway useful and current, but cannot guarantee uninterrupted
        availability or that every listing is always up to date. Please report broken links or
        incorrect information to {contact.support}.
      </p>
      <h2>7. Your rights and changes to these terms</h2>
      <p>
        Nothing in these terms is intended to exclude rights or protections that cannot lawfully be
        excluded. We may revise this page as the website develops; the update date identifies the
        current version. A separate written agreement for a service is not changed simply by
        updating these website terms.
      </p>
      <h2>8. Contact</h2>
      <p>
        For questions about these terms, email{" "}
        <a href={`mailto:${contact.support}`}>{contact.support}</a> or call{" "}
        <a href={`tel:${contact.telephone}`}>{contact.phone}</a>. General enquiries can also be sent
        to <a href={`mailto:${contact.email}`}>{contact.email}</a>.
      </p>
    </>
  );
}

export function FamilyPrivacy() {
  return (
    <>
      <p className="family-small">Last updated: 5 October 2026 · Parent website: ndh.com.ng</p>
      <h2>1. Scope and contact</h2>
      <p>
        This notice describes information handled through the NDH parent website. Najeeb Digital Hub
        is based at {contact.address}. For privacy questions or requests, contact{" "}
        <a href={`mailto:${contact.support}`}>{contact.support}</a>. Subsidiary platforms and
        external destinations may provide their own notices.
      </p>
      <h2>2. Information you choose to share</h2>
      <p>
        The enquiry form asks for your name, email address, message and enquiry topic, with an
        optional phone number. We use this information to understand and respond to your request and
        route it to the appropriate team. Contacting us by phone, email or WhatsApp also shares the
        information you include through that channel.
      </p>
      <p>
        Please do not send passwords, payment credentials, student records, medical information or
        other sensitive details through the general enquiry form or automated consultant.
      </p>
      <h2>3. The automated consultant</h2>
      <p>
        The consultant processes the conversation you submit, together with your selected language
        and an approximate region used to tailor its guidance. Depending on the service
        configuration, a response may be generated by the routing engine or an AI service provider.
        Do not treat the consultant as a private storage space or a channel for confidential
        records.
      </p>
      <h2>4. Preferences and technical information</h2>
      <p>
        The website uses a preference cookie to remember your language and region settings for up to
        one year. Region may be estimated from your browser’s time zone; this is not precise GPS
        location. You can change the language in the navigation menu and clear cookies using your
        browser settings.
      </p>
      <p>
        Hosting and service infrastructure may process technical information such as request details
        and IP addresses to deliver the website, diagnose errors and limit abuse. Account-based
        areas may use additional authentication storage; review the information provided by the
        relevant platform when signing in.
      </p>
      <h2>5. Service providers and external links</h2>
      <p>
        Website hosting, enquiry storage, transactional email and configured AI providers may
        process information needed to provide those functions. An enquiry may be shared with the
        relevant NDH team to address your request. Some providers may process data outside Nigeria;
        any applicable safeguards should be considered for the service involved.
      </p>
      <p>
        Opening Google Maps, WhatsApp, social media or another business website takes you to an
        external service. Information handled there is subject to that service’s privacy practices.
        The Contact page links to a map search rather than embedding a tracking map.
      </p>
      <h2>6. Retention and protection</h2>
      <p>
        Enquiries may be retained for follow-up, service administration and applicable legal
        obligations. The appropriate retention period depends on the purpose and any service
        relationship that follows. Contact us to ask about the information associated with your
        enquiry. No online service can guarantee absolute security; avoid sharing more information
        than is necessary.
      </p>
      <h2>7. Your choices and requests</h2>
      <p>
        Subject to applicable law, including the Nigeria Data Protection Act 2023 where relevant,
        you may request access to or correction of your personal information, request deletion, or
        object to or seek limits on certain processing. Where processing relies on consent, you may
        withdraw that consent. We may need to verify your identity before acting on a request, and
        legal obligations may limit what can be deleted.
      </p>
      <p>
        Send requests to <a href={`mailto:${contact.support}`}>{contact.support}</a> with enough
        context to locate your enquiry, but do not include identity documents unless a suitable
        verification process has been agreed. You may also raise a concern with the Nigeria Data
        Protection Commission.
      </p>
      <h2>8. Changes</h2>
      <p>
        We may update this notice as the website and its services change. Check the date above for
        the latest revision and contact us if you need clarification.
      </p>
    </>
  );
}
