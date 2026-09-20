/** Service areas shared by agency services, briefs and PM coverage. */
export const SERVICE_AREAS = [
  'Brand & Identity',
  'Design & Product',
  'Development',
  'Content & Writing',
  'Marketing & Growth',
  'Video & Media',
  'Data & Business',
  'AI & Automation',
] as const;

export type ServiceArea = (typeof SERVICE_AREAS)[number];
