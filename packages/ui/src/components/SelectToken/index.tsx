import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { VariantProps } from "class-variance-authority";
import { ChevronDownIcon } from "lucide-react";
import { forwardRef } from "react";
import { Button, buttonVariants } from "../ui/button";
import { Token } from "./types";

export interface SelectTokenProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  token: Token | null;
}

export const SelectToken = forwardRef<HTMLButtonElement, SelectTokenProps>(
  (
    { token, className, variant = "outline", size = "default", ...props },
    ref
  ) => {
    return (
      <Button
        variant={variant}
        size={size}
        className={className}
        ref={ref}
        asChild={false}
        {...props}
      >
        {/* Select a token<ChevronDownIcon /> */}
        {token ? (
          <div className="flex gap-2">
            <Avatar>
              <AvatarImage
                className="rounded-full"
                width={20}
                height={20}
                src="https://github.com/shadcn.png"
                alt="Token Image"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            ORAI
          </div>
        ) : (
          <span>Select a token</span>
        )}
        <ChevronDownIcon />
      </Button>
    );
  }
);
