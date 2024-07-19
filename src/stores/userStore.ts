import { create } from "zustand";

interface UserState {
  avatarDataURL: string | null;
  setAvatarDataURL: (dataURL: string) => void;
}

const useUserStore = create<UserState>((set) => ({
  avatarDataURL: null,
  setAvatarDataURL: (dataURL) => set({ avatarDataURL: dataURL }),
}));

export default useUserStore;
