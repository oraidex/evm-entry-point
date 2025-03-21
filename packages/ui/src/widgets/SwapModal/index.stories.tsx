import type { Meta, StoryObj } from "@storybook/react";
import { SwapModal, Widget } from ".";
import { ColorScheme, DEFAULT_CONFIG } from "@/constants/config";
import { Theme } from "@/stores/persist-config/usePersistStore";

const meta: Meta<typeof SwapModal> = {
  title: "Widgets/SwapModal",
  component: Widget,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    sender: "0xa9518ADB046383a624fF64dcFB99fCfcAf5d2Bf8",
    ...DEFAULT_CONFIG,
    colorScheme: ColorScheme.ORAI_DEX,
    theme: Theme.DARK,
    disableTokenSelectFrom: true,
    disableTokenSelectTo: true,
    defaultTokenFrom: {
      address: {
        cosmos: "orai",
        evm: "orai",
      },
      name: "ORAI",
      symbol: "ORAI",
      decimals: {
        cosmos: 6,
        evm: 18,
      },
      image: "https://images.orai.io/logo/orai-token.png",
    },
    defaultTokenTo: {
      address: {
        cosmos: "orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh",
        evm: "0xFE7394f22465EB1ae0843acEef270C377CB43567",
      },
      name: "USDT",
      symbol: "USDT",
      decimals: {
        cosmos: 6,
        evm: 6,
      },
      image: "https://s2.coinmarketcap.com/static/img/coins/64x64/825.png",
    },
  },
};
