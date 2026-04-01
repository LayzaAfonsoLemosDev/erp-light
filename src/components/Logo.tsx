import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16"
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <img
        src="/logo-large.svg"
        alt="ERP Light Logo"
        className={sizeClasses[size]}
      />
      <div className="flex flex-col">
        <span className="font-bold text-lg text-blue-600">ERP Light</span>
        <span className="text-xs text-gray-500">Sistema de Gestão</span>
      </div>
    </div>
  );
}