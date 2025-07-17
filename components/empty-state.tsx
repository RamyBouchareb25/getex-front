import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, FileX, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  className?: string;
}

export default function EmptyState({ 
  title, 
  description, 
  icon,
  className = "" 
}: EmptyStateProps) {
  const t = useTranslations('dashboard.emptyState');
  
  return (
    <div className={`flex flex-col items-center justify-center py-8 px-4 text-center ${className}`}>
      <div className="mb-4 p-3 rounded-full bg-muted/50">
        {icon || <FileX className="h-8 w-8 text-muted-foreground" />}
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4 max-w-md">{description}</p>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <RefreshCw className="h-3 w-3" />
        <span>{t('tryAgain')}</span>
      </div>
    </div>
  );
}
