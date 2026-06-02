import { Box, Settings, GitBranch, Heart, Camera, Play } from 'lucide-react';
import type { Service } from '@/types';

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  Box,
  Settings,
  GitBranch,
  Heart,
  Camera,
  Play,
};

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const Icon = icons[service.icon] ?? Box;

  return (
    <div className="glass-card rounded-xl p-6 group hover:border-[rgba(0,212,255,0.2)] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,212,255,0.1)] transition-all duration-300 h-full flex flex-col min-h-[200px]">
      <div className="w-10 h-10 rounded-lg bg-[rgba(0,212,255,0.1)] flex items-center justify-center mb-5 group-hover:bg-[rgba(0,212,255,0.15)] transition-colors duration-300 flex-shrink-0">
        <Icon className="w-5 h-5 text-[var(--accent-primary)]" />
      </div>
      <h3 className="font-grotesk font-semibold text-base text-[var(--text-primary)] mb-3 flex-shrink-0">
        {service.title}
      </h3>
      <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-3 overflow-hidden">
        {service.description}
      </p>
    </div>
  );
}
