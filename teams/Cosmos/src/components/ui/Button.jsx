import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper for conditionally merging tailwind classes cleanly
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function Button({ children, className, variant = 'primary', size = 'md', ...props }) {
  const baseStyle = "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-primary-600 text-white hover:bg-primary-500 focus:ring-primary-500",
    secondary: "bg-card border border-cardBorder text-white hover:bg-cardBorder",
    outline: "border-2 border-primary-500 text-primary-400 hover:bg-primary-500/10 focus:ring-primary-500",
    danger: "bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20",
    success: "bg-green-500/10 border border-green-500/20 text-green-500 hover:bg-green-500/20",
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button className={cn(baseStyle, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
}
