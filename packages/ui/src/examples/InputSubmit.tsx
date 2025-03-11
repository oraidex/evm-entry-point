import { Button, Input, Text } from "@/components";

export const InputSubmit = () => {
  return (
    <>
      <Text
        as="label"
        htmlFor="password"
        size={"sm"}
        weight={"medium"}
        className="mb-1.5"
      >
        Password
      </Text>
      <Input id="password" type="password" placeholder={"Password"} />

      <Button type="submit" variant={"solid"} className="mt-10">
        Login
      </Button>
    </>
  );
};
