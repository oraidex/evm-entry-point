import { ComponentProps, forwardRef } from "react";
import { SelectToken } from "../SelectToken";
import { Token } from "../SelectToken/types";

type SelectTokenWithAmountProps = ComponentProps<"div"> & {
  token:
    | (Token & {
        balance: number;
        price: number;
      })
    | null;
  amount?: number;
  onAmountChange: (value: string) => void;
};

export const SelectTokenWithAmount = forwardRef<
  HTMLDivElement,
  SelectTokenWithAmountProps
>(({ token, amount, onAmountChange, ...props }, ref) => {
  return (
    <div
      className="py-5 px-4 flex flex-col border group rounded-xl"
      {...props}
      ref={ref}
    >
      <div className="flex justify-between items-center">
        <SelectToken variant="secondary" token={token} />
        <div className="text-right">
          <input
            type="text"
            placeholder="0.0"
            inputMode="numeric"
            value={amount}
            disabled={!token}
            onChange={(e) => onAmountChange(e.target.value)}
            className="h-full w-full bg-transparent text-right font-semibold text-lg focus:outline-none disabled:cursor-not-allowed"
          />
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex mt-3 space-x-1 text-xs items-center fill-current cursor-pointer">
          <svg
            width="10"
            height="10"
            viewBox="0 0 11 11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.0625 11H10.3125V2.75H8.59375V0H2.0625C0.923158 0 0 0.923158 0 2.0625V8.9375C0 10.0768 0.923158 11 2.0625 11ZM8.9375 4.125V9.625H2.0625C1.6825 9.625 1.375 9.3175 1.375 8.9375V4.00486C1.59589 4.08408 1.82818 4.12437 2.0625 4.12504L8.9375 4.125ZM2.0625 1.375H7.21875V2.75H2.0625C1.6825 2.75 1.375 2.4425 1.375 2.0625C1.375 1.6825 1.6825 1.375 2.0625 1.375Z"
              fill="black"
              fill-opacity="0.25"
            ></path>
          </svg>
          <span translate="no">{(token?.balance || 0).toFixed(2)}</span>
          <span>{token?.symbol}</span>
        </div>
        <span className="text-xs">
          ${((token?.price || 0) * (amount || 0)).toFixed(2)}
        </span>
      </div>
    </div>
  );
});
