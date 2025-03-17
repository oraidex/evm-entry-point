import type { Meta, StoryObj } from "@storybook/react";
import { SelectToken } from ".";

const meta: Meta<typeof SelectToken> = {
  title: "Components/SelectToken",
  component: SelectToken,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: "outline",
    size: "default",
  },
};

export const TokenSelected: Story = {
  args: {
    variant: "outline",
    size: "default",
    token: {
      address: {
        cosmos: "orai",
        evm: "orai",
      },
      name: "Oraichain",
      symbol: "ORAI",
      decimals: {
        cosmos: 6,
        evm: 18,
      },
      image: "https://images.orai.io/logo/orai-token.png",
    },
  },
};
