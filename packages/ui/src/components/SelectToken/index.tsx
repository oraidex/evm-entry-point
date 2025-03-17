import { Token } from "@/types/Token";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { ScrollArea } from "@radix-ui/react-scroll-area";
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

export interface SelectTokenProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  token: Token | null;
  tokenList: Token[];
  setToken: (token: Token) => void;
}

export const SelectToken = forwardRef<HTMLButtonElement, SelectTokenProps>(
  (
    {
      token,
      tokenList,
      setToken,
      className,
      variant = "outline",
      size = "default",
      ...props
    },
    ref
  ) => {
    return (
      <Drawer modal>
        <DrawerTrigger asChild>
          <Button
            variant={variant}
            size={size}
            className={className}
            asChild={false}
            {...props}
            ref={ref}
          >
            {token ? (
              <div className="flex gap-2">
                <Avatar>
                  <AvatarImage
                    className="rounded-full"
                    width={20}
                    height={20}
                    src={token.image}
                    alt="Token Image"
                  />
                  <AvatarFallback>?</AvatarFallback>
                </Avatar>
                {token.symbol}
              </div>
            ) : (
              <span>Select a token</span>
            )}
            <ChevronDownIcon />
          </Button>
        </DrawerTrigger>
        <DrawerContent aria-describedby={undefined}>
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
                className="max-h-[370px] w-full rounded-md overflow-auto flex flex-col gap-2 text-base justify-start"
              >
                {tokenList.map((token, index) => (
                  <DrawerClose>
                    <div
                      onClick={() => setToken(token)}
                      key={index}
                      className="flex gap-2 items-center"
                    >
                      <Avatar>
                        <AvatarImage
                          className="rounded-full"
                          width={40}
                          height={40}
                          src={token.image}
                          alt="Token Image"
                        />
                        <AvatarFallback>?</AvatarFallback>
                      </Avatar>
                      <span>{token.symbol}</span>
                    </div>
                  </DrawerClose>
                ))}
              </ScrollArea>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }
);
