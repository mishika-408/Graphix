import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

interface EquationInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  color?: string;
  error?: string | null;
}

export function EquationInput({
  value,
  onChange,
  placeholder = 'Enter equation...',
  className = '',
  color,
  error,
}: EquationInputProps) {
  return (
    <div className="flex-1 space-y-1">
      <div className="relative flex items-center gap-3">
        {color && (
          <div
            className="w-3 h-3 rounded-full flex-shrink-0 glow-border"
            style={{ backgroundColor: color, borderColor: color }}
          />
        )}
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            'font-mono text-sm bg-card',
            error ? 'border-destructive focus-visible:ring-destructive' : 'border-input',
            className
          )}
          data-testid={`input-equation-${placeholder.toLowerCase().replace(/\s+/g, '-')}`}
        />
      </div>
      {error && (
        <div className="flex items-center gap-1.5 text-destructive text-xs pl-6" data-testid="text-equation-error">
          <AlertCircle className="h-3 w-3 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
