import type { Meta, StoryObj } from "@storybook/react";
import { SwapModal } from ".";

const meta: Meta<typeof SwapModal> = {
  title: "Widgets/SwapModal",
  component: SwapModal,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    sender: "0xa9518ADB046383a624fF64dcFB99fCfcAf5d2Bf8",
  },
};
