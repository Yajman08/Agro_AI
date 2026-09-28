import type { ButtonHTMLAttributes, ReactNode } from "react";
import { clsx } from "../../lib/clsx";
import { useTranslation } from "../../i18n/useTranslation";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-forest-700 text-white hover:bg-forest-900 active:bg-forest-900 disabled:bg-forest-300",
  secondary:
    "bg-forest-50 text-forest-700 border border-forest-100 hover:bg-forest-100 disabled:opacity-50",
  ghost: "text-ink-soft hover:bg-black/5 disabled:opacity-50",
  danger: "bg-sienna-500 text-white hover:bg-sienna-700 disabled:opacity-50",
};

const sizeStyles: Record<Size, string> = {
  sm: "text-sm px-3 py-1.5 gap-1.5",
  md: "text-sm px-4 py-2.5 gap-2",
  lg: "text-base px-5 py-3 gap-2",
};

export default function Button({
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  fullWidth,
  className,
  children,
  ...rest
}: ButtonProps) {
  const { t } = useTranslation();
  const buttonChildren = typeof children === "string" ? t(children) : children;
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center rounded-full font-medium transition-colors duration-150",
        "disabled:cursor-not-allowed",
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && "w-full",
        className
      )}
      {...rest}
    >
      {icon && iconPosition === "left" && <span className="shrink-0">{icon}</span>}
      {buttonChildren}
      {icon && iconPosition === "right" && <span className="shrink-0">{icon}</span>}
    </button>
  );
}
