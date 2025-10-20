import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface InfoCardProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: "default" | "success" | "accent";
}

export function InfoCard({
  icon: Icon,
  title,
  subtitle,
  description,
  actionLabel,
  onAction,
  variant = "default"
}: InfoCardProps) {
  const variantClasses = {
    default: "border-primary/20 hover:border-primary/40",
    success: "border-success/20 hover:border-success/40",
    accent: "border-accent/20 hover:border-accent/40"
  };

  const iconVariantClasses = {
    default: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    accent: "bg-accent/10 text-accent"
  };

  return (
    <Card className={`p-6 transition-all duration-300 ${variantClasses[variant]} hover:shadow-lg`}>
      <div className="flex items-start gap-4">
        <div className={`p-4 rounded-2xl ${iconVariantClasses[variant]}`}>
          <Icon className="h-8 w-8" strokeWidth={2.5} />
        </div>
        <div className="flex-1 space-y-2">
          <h3 className="text-2xl font-semibold">{title}</h3>
          <p className="text-lg text-muted-foreground">{subtitle}</p>
          {description && (
            <p className="text-base text-foreground/80">{description}</p>
          )}
          {actionLabel && onAction && (
            <Button 
              variant="ghost" 
              size="lg"
              className="mt-2 p-0 h-auto text-primary hover:text-primary/80 font-semibold"
              onClick={onAction}
            >
              {actionLabel} →
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
