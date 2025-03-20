import usePersistStore from "./usePersistStore";

export const usePersistActions = () =>
  usePersistStore((state) => state.actions);
export const useGetTheme = () => usePersistStore((state) => state.theme);
