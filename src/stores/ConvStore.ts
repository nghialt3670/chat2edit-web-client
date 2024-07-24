import { create } from "zustand";
import Conversation from "../models/Conversation";
import { createBsonId } from "../utils/id";
import Message from "../models/Message";

interface ConvStore {
  currConv: Conversation;
  idToConv: Record<string, Conversation>;
  updateCurrTitle: (title: string) => void;
  updateCurrId: (id: string) => void;
  addMessage: (message: Message) => void;
  setCurrConv: (conv: Conversation) => void;
  setConvs: (convs: Conversation[]) => void;
  createNewConv: () => void;
}

const useConvStore = create<ConvStore>((set, get) => ({
  currConv: { id: createBsonId(), messages: [], title: null },
  idToConv: {},

  updateCurrTitle: (title) => {
    const state = get();
    const newCurrConv = { ...state.currConv };
    const newIdToConv = { ...state.idToConv };

    newCurrConv.title = title;
    newIdToConv[newCurrConv.id] = newCurrConv;
    set({ currConv: newCurrConv, idToConv: newIdToConv });
  },

  updateCurrId: (id) => {
    const state = get();
    const newCurrConv = { ...state.currConv };
    const newIdToConv = { ...state.idToConv };
    delete newIdToConv[newCurrConv.id];
    newCurrConv.id = id;
    newIdToConv[id] = newCurrConv;
    set({ currConv: newCurrConv, idToConv: newIdToConv });
  },

  addMessage: (message) => {
    const state = get();
    const newCurrConv = { ...state.currConv };
    newCurrConv.messages.push(message);
    set({ currConv: newCurrConv });
  },

  setCurrConv: (conv) => {
    const state = get();
    const newIdToConv = { ...state.idToConv };
    newIdToConv[state.currConv.id] = state.currConv;
    set({ currConv: { ...conv }, idToConv: newIdToConv });
  },

  setConvs: (convs: Conversation[]) => {
    set((state) => {
      const newIdToConv = { ...state.idToConv };
      convs.forEach((conv) => {
        newIdToConv[conv.id] = conv;
      });
      return { idToConv: newIdToConv };
    });
  },

  createNewConv: () => {
    const state = get();
    let newConv: Conversation = {
      id: createBsonId(),
      messages: [],
      title: "New Conversation",
    };

    if (!state.idToConv) {
      set({ currConv: { ...newConv }, idToConv: { [newConv.id]: newConv } });
      return;
    }

    const ids = Object.keys(state.idToConv);
    const lastConv = state.idToConv[ids[ids.length - 1]];
    if (!lastConv.messages) {
      state.setCurrConv(lastConv);
      return;
    }

    set({
      currConv: { ...newConv },
      idToConv: { ...state.idToConv, [newConv.id]: newConv },
    });
  },
}));

export default useConvStore;
