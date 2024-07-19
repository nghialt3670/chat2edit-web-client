import { create } from "zustand";

interface LayoutState {
  theme: "dark" | "light";
  sidebar: "opened" | "closed";
  toggleTheme: () => void;
  toggleSidebar: () => void;
}

const useLayoutStore = create<LayoutState>((set) => ({
  theme: "dark",
  sidebar: "closed",
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),
  toggleSidebar: () =>
    set((state) => ({
      sidebar: state.sidebar === "closed" ? "opened" : "closed",
    })),
}));

export default useLayoutStore;
