import { cn } from "@/lib/utils";
import { VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { forwardRef } from "react";
import { Button, buttonVariants } from "../ui/button";

export interface SwapButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading: boolean;
}

export const SwapButton = forwardRef<HTMLButtonElement, SwapButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      content,
      isLoading,
      ...props
    },
    ref
  ) => {
    return (
      <>
        <Button
          variant={variant}
          size={size}
          className={cn("w-full", className)}
          ref={ref}
          asChild={false}
          {...props}
        >
          {isLoading && <Loader2 className="animate-spin" />}
          {content}
        </Button>
      </>
    );
  }
);
