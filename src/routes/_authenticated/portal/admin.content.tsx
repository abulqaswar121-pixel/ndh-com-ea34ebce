import { createFileRoute } from '@tanstack/react-router';
import { FileText } from 'lucide-react';
import { PortalPage } from '@/components/PortalShell';
import { CaseStudiesManager, PostsManager, TestimonialsManager } from '@/components/admin/ContentManager';

export const Route = createFileRoute('/_authenticated/portal/admin/content')({
  component: () => (
    <PortalPage
      eyebrow="ADMIN PORTAL"
      title="Content"
      intro="Testimonials, case studies and blog articles."
      icon={FileText}
    >
      <section className="portal-section">
        <div className="portal-section-title">
          <h2>Testimonials</h2>
        </div>
        <TestimonialsManager />
      </section>
      <section className="portal-section">
        <div className="portal-section-title">
          <h2>Case studies</h2>
        </div>
        <CaseStudiesManager />
      </section>
      <section className="portal-section">
        <div className="portal-section-title">
          <h2>Blog articles</h2>
        </div>
        <PostsManager />
      </section>
    </PortalPage>
  ),
});
