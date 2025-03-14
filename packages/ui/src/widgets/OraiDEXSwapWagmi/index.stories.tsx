import type { Meta, StoryObj } from "@storybook/react";
import { OraiDEXSwapWagmi } from ".";

const meta: Meta<typeof OraiDEXSwapWagmi> = {
  title: "Widgets/OraiDEXSwapWagmi",
  component: OraiDEXSwapWagmi,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    syncWallet: false,
  },
};
