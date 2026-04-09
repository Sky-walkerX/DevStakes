import { cn } from './Button';

export function Card({ className, children, ...props }) {
  return (
    <div className={cn("glass-panel p-6", className)} {...props}>
      {children}
    </div>
  );
}
