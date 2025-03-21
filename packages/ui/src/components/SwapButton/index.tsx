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
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <>
        <Button
          // variant={variant}
          // size={size}
          className={cn(
            "w-full bg-swapBtn h-10 p-2 rounded-buttonRadius text-primaryBtnText hover:brightness-110 transition-all ease-in-out",
            className
          )}
          disabled={disabled || isLoading}
          ref={ref}
          asChild={false}
          {...props}
        >
          {isLoading && (
            <Loader2 className="animate-spin text-primaryBtnText" />
          )}
          {content}
        </Button>
      </>
    );
  }
);
