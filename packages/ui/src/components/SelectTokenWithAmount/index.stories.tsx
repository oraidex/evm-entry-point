import type { Meta, StoryObj } from "@storybook/react";
import { SelectTokenWithAmount } from ".";

const meta: Meta<typeof SelectTokenWithAmount> = {
  title: "Components/SelectTokenWithAmount",
  component: SelectTokenWithAmount,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const TokenSelected: Story = {
  args: {
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
    price: 2.37,
    balance: 12.455,
    amount: "123",
  },
};
