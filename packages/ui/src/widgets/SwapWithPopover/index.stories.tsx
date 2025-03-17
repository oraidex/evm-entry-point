import type { Meta, StoryObj } from "@storybook/react";
import { SwapWithPopover } from ".";

const meta: Meta<typeof SwapWithPopover> = {
  title: "Widgets/SwapWithPopover",
  component: SwapWithPopover,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    sender: "0xa9518ADB046383a624fF64dcFB99fCfcAf5d2Bf8",
  },
};
