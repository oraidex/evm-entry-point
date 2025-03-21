import { OraiDEXIcon } from "@/assets/oraidex";
import { ColorScheme, DEFAULT_CONFIG } from "@/constants/config";
import { useEthersSigner } from "@/lib/utils";
import { Theme } from "@/stores/persist-config/usePersistStore";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { SwapModalProps, Widget } from "../SwapModal";

export type SwapWithPopoverProps = SwapModalProps;

export const SwapWithPopover = ({
  sender,
  connectButton,
  className,
  customStyles = DEFAULT_CONFIG.customStyles,
  colorScheme = ColorScheme.ORAI_DEX,
  theme = Theme.DARK,
  defaultTokenFrom = null,
  defaultTokenTo = null,
  disableTokenSelectFrom = false,
  disableTokenSelectTo = false,
}: SwapWithPopoverProps) => {
  const signer = useEthersSigner();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="rounded-full border-2 hover:cursor-pointer w-fit fixed bottom-10 left-10 p-3">
          <OraiDEXIcon width={48} height={48} />
        </div>
      </PopoverTrigger>
      <PopoverContent
        onFocusOutside={(event) => {
          event.preventDefault();
        }}
        onInteractOutside={(event) => {
          event.preventDefault();
        }}
        align="start"
        side="top"
        sideOffset={16}
      >
        <Widget
          signer={signer}
          sender={sender}
          connectButton={connectButton}
          className={className}
          customStyles={customStyles}
          colorScheme={colorScheme}
          theme={theme}
          defaultTokenFrom={defaultTokenFrom}
          defaultTokenTo={defaultTokenTo}
          disableTokenSelectFrom={disableTokenSelectFrom}
          disableTokenSelectTo={disableTokenSelectTo}
        />
      </PopoverContent>
    </Popover>
  );
};
