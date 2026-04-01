interface StatusBadgeProps {
  status: string;
}

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  pendente: { bg: 'bg-warning/10', text: 'text-warning', dot: 'bg-warning' },
  aprovado: { bg: 'bg-primary/10', text: 'text-primary', dot: 'bg-primary' },
  enviado: { bg: 'bg-accent/10', text: 'text-accent', dot: 'bg-accent' },
  entregue: { bg: 'bg-success/10', text: 'text-success', dot: 'bg-success' },
  cancelado: { bg: 'bg-destructive/10', text: 'text-destructive', dot: 'bg-destructive' },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.pendente;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
