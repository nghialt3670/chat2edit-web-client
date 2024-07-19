import { create } from "zustand";
import Conv from "../models/Conv";
import Message from "../models/Message";
import { createBsonId } from "../utils/id";

interface ConvsState {
  currConvIdx: number;
  currConv: Conv;
  oldConvs: Conv[];
  addMessage: (message: Message) => void;
  createNewConv: () => void;
  setCurrConv: (conv: Conv, idx: number) => void;
  setOldConvs: (convs: Conv[]) => void;
}

const useConvsStore = create<ConvsState>((set, get) => ({
  currConvIdx: -1,
  currConv: { id: createBsonId(), title: null, messages: [] },
  oldConvs: [],
  addMessage: (message) =>
    set((state) => ({
      currConv: {
        ...state.currConv,
        messages: [...state.currConv.messages, message],
      },
    })),
  createNewConv: () =>
    set((state) => {
      if (!state.currConv.title && state.currConv.messages.length === 0)
        return state;
      if (state.currConvIdx === state.oldConvs.length)
        return {
          currConvIdx: state.currConvIdx + 1,
          currConv: { id: createBsonId(), title: null, messages: [] },
          oldConvs: [...state.oldConvs, state.currConv],
        };
      const updatedOldConvs = [...state.oldConvs];
      updatedOldConvs[state.currConvIdx] = state.currConv;
      return {
        currConvIdx: state.currConvIdx + 1,
        currConv: { id: createBsonId(), title: null, messages: [] },
        oldConvs: updatedOldConvs,
      };
    }),
  setCurrConv: (conv, idx) =>
    set((state) => {
      if (idx === state.currConvIdx) return state;

      const updatedOldConvs = [...state.oldConvs];
      updatedOldConvs[state.currConvIdx] = state.currConv;
      return {
        currConvIdx: state.currConvIdx,
        currConv: {...conv},
        oldConvs: updatedOldConvs,
      };
    }),
  setOldConvs: (convs) => set({ oldConvs: convs }),
}));

export default useConvsStore;
