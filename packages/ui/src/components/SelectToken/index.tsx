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
import { twMerge } from "tailwind-merge";

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
            className={twMerge(
              "rounded-boxSelectRadius bg-boxSelect border border-borderBox h-[58px] py-2",
              className
            )}
            asChild={false}
            {...props}
            ref={ref}
          >
            {token ? (
              <div className="flex items-center justify-center gap-2 text-neutralContent text-[16px] md:text-[20px]">
                <Avatar>
                  <AvatarImage
                    className="rounded-full"
                    width={38}
                    height={38}
                    src={token.image}
                    alt="Token Image"
                  />
                  <AvatarFallback>
                    <div className="rounded-full p-5 w-5 h-5 bg-background border border-borderContainer text-neutralContent flex items-center justify-center">
                      ?
                    </div>
                  </AvatarFallback>
                </Avatar>
                {token.symbol}
              </div>
            ) : (
              <span>Select a token</span>
            )}
            <ChevronDownIcon className="text-neutralContent" />
          </Button>
        </DrawerTrigger>
        <DrawerContent aria-describedby={undefined}>
          <DrawerHeader>
            <DrawerTitle className="text-center text-neutralContent">
              Select a token
            </DrawerTitle>
            <DrawerClose className="absolute right-4">
              <X size={20} className="text-neutralContent" />
            </DrawerClose>
          </DrawerHeader>
          <div className="w-full px-4">
            <div className="w-full flex flex-col gap-4">
              <Input
                placeholder="Find token by symbol"
                className="text-neutralContent"
              />
              <ScrollArea
                type="scroll"
                className="max-h-[300px] w-full rounded-md overflow-auto flex flex-col gap-2 text-base justify-start"
              >
                {tokenList.map((token, index) => (
                  <DrawerClose>
                    <div
                      onClick={() => setToken(token)}
                      key={index}
                      className="flex py-2 gap-2 items-center text-neutralContent hover:cursor-pointer hover:bg-foreground hover:brightness-75"
                    >
                      <Avatar>
                        <AvatarImage
                          className="rounded-full"
                          width={40}
                          height={40}
                          src={token.image}
                          alt="Token Image"
                        />
                        <AvatarFallback>
                          <div className="rounded-full p-5 w-5 h-5 bg-background border border-borderContainer text-neutralContent flex items-center justify-center">
                            ?
                          </div>
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-neutralContent">
                        {token.symbol}
                      </span>
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
