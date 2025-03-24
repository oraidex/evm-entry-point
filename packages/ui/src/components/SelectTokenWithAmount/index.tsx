import { cn, formatLargeNumber } from "@/lib/utils";
import { Token } from "@/types/Token";
import { ComponentProps, forwardRef } from "react";
import { SelectToken } from "../SelectToken";
import NumberFormat from "react-number-format";
import Decimal from "decimal.js";
import { twMerge } from "tailwind-merge";
import { MIN_AMOUNT_FOR_SWAP } from "@/constants/config";

type SelectTokenWithAmountProps = ComponentProps<"div"> & {
  token: Token | null;
  balance: string;
  price: number | undefined;
  tokenList: Token[];
  amount?: string;
  setToken: (token: Token) => void;
  onAmountChange: (value: string) => void;
  disableInputAmount?: boolean;
  disableTokenSelect?: boolean;
  showHalfButton?: boolean;
};

export const SelectTokenWithAmount = forwardRef<
  HTMLDivElement,
  SelectTokenWithAmountProps
>(
  (
    {
      token,
      balance,
      price,
      tokenList,
      amount,
      setToken,
      disableInputAmount,
      className,
      onAmountChange,
      disableTokenSelect,
      showHalfButton = true,
      ...props
    },
    _ref
  ) => {
    return (
      <div
        className={cn(
          "py-5 px-4 flex flex-col group rounded-boxRadius bg-foreground",
          className
        )}
        {...props}
        // ref={ref}
      >
        <div className="flex text-baseContent justify-between items-center gap-2 mb-4">
          <div className="flex text-[12px] gap-1 items-center justify-center">
            <svg
              width="10"
              height="10"
              viewBox="0 0 11 11"
              fill="none"
              className="text-neutralContent"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.0625 11H10.3125V2.75H8.59375V0H2.0625C0.923158 0 0 0.923158 0 2.0625V8.9375C0 10.0768 0.923158 11 2.0625 11ZM8.9375 4.125V9.625H2.0625C1.6825 9.625 1.375 9.3175 1.375 8.9375V4.00486C1.59589 4.08408 1.82818 4.12437 2.0625 4.12504L8.9375 4.125ZM2.0625 1.375H7.21875V2.75H2.0625C1.6825 2.75 1.375 2.4425 1.375 2.0625C1.375 1.6825 1.6825 1.375 2.0625 1.375Z"
                fill="currentColor"
                fillOpacity="0.25"
              ></path>
            </svg>

            <span className="text-neutralContent">
              {formatLargeNumber(balance, 2)}
            </span>
            <span className="text-neutralContent">{token?.symbol}</span>
          </div>
          {showHalfButton && (
            <div className="flex gap-1">
              <button
                onClick={() => {
                  if (new Decimal(balance).div(2).lt(MIN_AMOUNT_FOR_SWAP)) {
                    return onAmountChange("");
                  }
                  onAmountChange(
                    new Decimal(balance)
                      .div(2)
                      .toFixed(6, Decimal.ROUND_DOWN) || "0"
                  );
                }}
                className={twMerge(
                  "h-[22px] w-[40px] text-[12px] px-1 py-0.5 transition-all ease-in text-primaryBtnText bg-primaryBtnBg rounded-buttonRadius opacity-80 hover:opacity-100"
                )}
              >
                50%
              </button>
              <button
                onClick={() => {
                  if (new Decimal(balance).lt(MIN_AMOUNT_FOR_SWAP)) {
                    return onAmountChange("");
                  }
                  onAmountChange(
                    new Decimal(balance).toFixed(6, Decimal.ROUND_DOWN)
                  );
                }}
                className={twMerge(
                  "h-[22px] w-[40px] text-[12px] px-1 py-0.5 transition-all ease-in text-primaryBtnText bg-primaryBtnBg rounded-buttonRadius opacity-80 hover:opacity-100"
                )}
              >
                100%
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center">
          <SelectToken
            variant="secondary"
            token={token}
            tokenList={tokenList}
            className="border-2"
            setToken={setToken}
            disabled={disableTokenSelect}
          />
          <div className="text-right">
            <div className="flex flex-col gap-1">
              <NumberFormat
                placeholder="0.0"
                thousandSeparator
                className="h-full w-full bg-transparent text-[24px] md:text-[28px] text-right font-semibold text-neutralContent focus:outline-none disabled:cursor-not-allowed"
                decimalScale={6}
                disabled={false}
                type="text"
                value={amount}
                onChange={() => {}}
                isAllowed={(values) => {
                  const { floatValue } = values;
                  // allow !floatValue to let user can clear their input
                  return !floatValue || (floatValue >= 0 && floatValue <= 1e14);
                }}
                onValueChange={({ floatValue }) => {
                  onAmountChange(floatValue?.toString() || "0");
                }}
              />
              <span className="text-xs text-baseContent">
                ${((price || 0) * (Number(amount) || 0)).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
