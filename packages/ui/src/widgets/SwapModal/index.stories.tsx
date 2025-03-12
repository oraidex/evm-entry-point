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

export const Default: Story = {};
