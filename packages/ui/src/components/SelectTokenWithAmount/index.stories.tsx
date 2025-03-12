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
      symbol: "ORAI",
      image: "https://github.com/shadcn.png",
      balance: 12.455,
      price: 2.37,
    },
    amount: 123,
  },
};
