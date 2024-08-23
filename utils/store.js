import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useConfigurationStore = create(
  persist(
    (set) => ({
      configuration: null,
      setConfiguration: (newConfiguration) =>
        set({ configuration: newConfiguration }),
    }),
    {
      name: "configuration",
      getStorage: () => sessionStorage,
    }
  )
);
