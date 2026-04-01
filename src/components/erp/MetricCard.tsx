import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
}

export function MetricCard({ title, value, icon: Icon, trend, trendUp }: MetricCardProps) {
  return (
    <div className="bg-card rounded-xl p-5 shadow-card border border-border hover:shadow-elevated transition-shadow duration-300 animate-slide-up">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-card-foreground mt-1">{value}</p>
          {trend && (
            <p className={`text-xs mt-2 font-medium ${trendUp ? 'text-success' : 'text-destructive'}`}>
              {trendUp ? '↑' : '↓'} {trend}
            </p>
          )}
        </div>
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </div>
    </div>
  );
}
