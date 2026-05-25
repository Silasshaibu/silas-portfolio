export type ProjectCategory = 'industrial' | 'product' | 'stylized' | 'medical';

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: ProjectCategory;
  client: string;
  tools: string[];
  thumbnail: string;
  videoUrl?: string;
  description: string;
  challenge: string;
  solution: string;
  result: string;
  featured: boolean;
}

export interface Service {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  company: string;
  platform: 'Fiverr' | 'LinkedIn' | 'Direct';
  rating: number;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  projectType: string;
  message: string;
}
