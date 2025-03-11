import type { Meta, StoryObj } from "@storybook/react";
import { InputSubmit } from "./InputSubmit";

const meta: Meta<typeof InputSubmit> = {
  title: "Examples/Form",
  component: InputSubmit,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Login: Story = {};
