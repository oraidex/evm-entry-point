import type { Meta, StoryObj } from "@storybook/react";
import { SwapButton } from ".";

const meta: Meta<typeof SwapButton> = {
  title: "Components/SwapButton",
  component: SwapButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    content: "Swap"
  },
};

export const Loading: Story = {
    args: {
      content: "Swap",
      isLoading: true,
      disabled: true
    },
  };

  export const Disabled: Story = {
    args: {
      content: "Insufficient Funds",
      isLoading: false,
      disabled: true
    },
  };
