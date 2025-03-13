import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Separator } from "@radix-ui/react-separator";
import { VariantProps } from "class-variance-authority";
import { ChevronDownIcon, X } from "lucide-react";
import { forwardRef } from "react";
import { Button, buttonVariants } from "../ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { Input } from "../ui/input";
import { Token } from "./types";

// TODO: tokens hardcode list
const tokens: Token[] = [
  {
    symbol: "ORAI",
    image: "https://github.com/shadcn.png",
  },
  {
    symbol: "ORAI",
    image: "https://github.com/shadcn.png",
  },
  {
    symbol: "ORAI",
    image: "https://github.com/shadcn.png",
  },
  {
    symbol: "ORAI",
    image: "https://github.com/shadcn.png",
  },
  {
    symbol: "ORAI",
    image: "https://github.com/shadcn.png",
  },
  {
    symbol: "ORAI",
    image: "https://github.com/shadcn.png",
  },
  {
    symbol: "ORAI",
    image: "https://github.com/shadcn.png",
  },
  {
    symbol: "ORAI",
    image: "https://github.com/shadcn.png",
  },
  {
    symbol: "ORAI",
    image: "https://github.com/shadcn.png",
  },
  {
    symbol: "ORAI",
    image: "https://github.com/shadcn.png",
  },
  {
    symbol: "ORAI",
    image: "https://github.com/shadcn.png",
  },
  {
    symbol: "ORAI",
    image: "https://github.com/shadcn.png",
  },
  {
    symbol: "ORAI",
    image: "https://github.com/shadcn.png",
  },
  {
    symbol: "ORAI",
    image: "https://github.com/shadcn.png",
  },
  {
    symbol: "ORAI",
    image: "https://github.com/shadcn.png",
  },
  {
    symbol: "ORAI",
    image: "https://github.com/shadcn.png",
  },
  {
    symbol: "ORAI",
    image: "https://github.com/shadcn.png",
  },
  {
    symbol: "ORAI",
    image: "https://github.com/shadcn.png",
  },
  {
    symbol: "ORAI",
    image: "https://github.com/shadcn.png",
  },
  {
    symbol: "ORAI",
    image: "https://github.com/shadcn.png",
  },
  {
    symbol: "ORAI",
    image: "https://github.com/shadcn.png",
  },
  {
    symbol: "ORAI",
    image: "https://github.com/shadcn.png",
  },
  {
    symbol: "ORAI",
    image: "https://github.com/shadcn.png",
  },
  {
    symbol: "ORAI",
    image: "https://github.com/shadcn.png",
  },
  {
    symbol: "ORAI",
    image: "https://github.com/shadcn.png",
  },
  {
    symbol: "ORAI",
    image: "https://github.com/shadcn.png",
  },
  {
    symbol: "ORAI",
    image: "https://github.com/shadcn.png",
  },
  {
    symbol: "ORAI",
    image: "https://github.com/shadcn.png",
  },
  {
    symbol: "ORAI",
    image: "https://github.com/shadcn.png",
  },
  {
    symbol: "ORAI",
    image: "https://github.com/shadcn.png",
  },
  {
    symbol: "ORAI",
    image: "https://github.com/shadcn.png",
  },
  {
    symbol: "ORAI",
    image: "https://github.com/shadcn.png",
  },
  {
    symbol: "ORAI",
    image: "https://github.com/shadcn.png",
  },
  {
    symbol: "ORAI",
    image: "https://github.com/shadcn.png",
  },
  {
    symbol: "ORAI",
    image: "https://github.com/shadcn.png",
  },
];

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
      <Drawer modal>
        <DrawerTrigger>
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
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="text-center">Select a token</DrawerTitle>
            <DrawerClose className="absolute right-4">
              <X size={20} />
            </DrawerClose>
          </DrawerHeader>
          <div className="w-full px-4">
            <div className="w-full flex flex-col gap-4">
              <Input placeholder="Find token by symbol" />
              <ScrollArea
                type="scroll"
                className="max-h-[370px] w-full rounded-md overflow-auto"
              >
                {tokens.map((token, index) => (
                  <>
                    <div key={index} className="flex gap-2">
                      <Avatar>
                        <AvatarImage
                          className="rounded-full"
                          width={20}
                          height={20}
                          src={token.image}
                          alt="Token Image"
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <span>{token.symbol}</span>
                    </div>
                    <Separator className="my-2" />
                  </>
                ))}
              </ScrollArea>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }
);
