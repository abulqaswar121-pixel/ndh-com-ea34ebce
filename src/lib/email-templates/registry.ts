import type { ComponentType } from 'react';
import { template as flyerReady } from './flyer-ready';
export type TemplateEntry<P = Record<string, unknown>> = { component: ComponentType<P>; subject: string; displayName?: string; previewData?: P };
export const TEMPLATES = { 'flyer-ready': flyerReady };