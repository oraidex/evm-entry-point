import { OraiDEXIcon } from "@/assets/oraidex";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { SwapModal, SwapModalProps } from "../SwapModal";
import { useEthersSigner } from "@/lib/utils";

export type SwapWithPopoverProps = SwapModalProps;

export const SwapWithPopover = ({
  sender,
  connectButton,
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
        <SwapModal
          signer={signer}
          sender={sender}
          connectButton={connectButton}
        />
      </PopoverContent>
    </Popover>
  );
};
