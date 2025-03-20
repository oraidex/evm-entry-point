import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export enum Theme {
  LIGHT = "light",
  DARK = "dark",
}

interface PersistStore {
  theme: Theme;
}

export interface PersistAction {
  handleSetTheme: (theme: Theme) => void;
}

const initialState = {
  theme: Theme.DARK,
};

const usePersistStore = create<PersistStore & { actions: PersistAction }>()(
  persist(
    immer((set) => ({
      //States
      ...initialState,

      //Actions
      actions: {
        handleSetTheme: (theme: Theme) => set({ theme }),
      },
    })),
    {
      name: "Zus:SwapWidget",
      partialize: ({ theme }) => ({ theme }),
    }
  )
);

export default usePersistStore;
