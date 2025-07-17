import { TableCell, TableRow } from "@/components/ui/table";
import { FileX, Search, Plus } from "lucide-react";
import { useTranslations } from "next-intl";

interface TableEmptyStateProps {
  colSpan: number;
  message?: string;
  description?: string;
  showAddButton?: boolean;
  onAddClick?: () => void;
  addButtonText?: string;
}

export default function TableEmptyState({
  colSpan,
  message,
  description,
  showAddButton = false,
  onAddClick,
  addButtonText
}: TableEmptyStateProps) {
  const t = useTranslations('common');

  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="text-center py-12">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="p-3 rounded-full bg-muted/50">
            <FileX className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              {message || "No data available"}
            </h3>
            {description && (
              <p className="text-sm text-muted-foreground max-w-md">
                {description}
              </p>
            )}
          </div>
          {showAddButton && onAddClick && (
            <button
              onClick={onAddClick}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              {addButtonText || t('add')}
            </button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}
