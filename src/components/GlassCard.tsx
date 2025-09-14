import clsx from "clsx";
import React from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        {...props}
        className={clsx(
          "backdrop-blur-xl rounded-5xl bg-white/5 px-6 py-10 shadow-2xl shadow-black/50",
          className
        )}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = "GlassCard";

export default GlassCard;
