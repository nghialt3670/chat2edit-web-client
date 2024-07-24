import { create } from "zustand";

interface FileStore {
  onFormIds: string[];
  idToFile: Record<string, File>;
  idToDataURL: Record<string, string>;
  setOnFormIds: (ids: string[]) => void;
  removeOnFormIds: (ids: string[]) => void;
  setFiles: (ids: string[], files: File[]) => void;
  setDataURLs: (ids: string[], dataURLs: string[]) => void;
  removeFiles: (ids: string[]) => void;
  getFiles: (ids: string[]) => File[];
  getDataURLs: (ids: string[]) => string[];
  updateIds: (oldIds: string[], newIds: string[]) => void;
}

const useFileStore = create<FileStore>((set, get) => ({
  idToFile: {},
  idToDataURL: {},
  onFormIds: [],

  setOnFormIds: (ids: string[]) => set({ onFormIds: ids }),

  removeOnFormIds: (ids: string[]) => {
    set((state) => {
      const newOnFormIds = state.onFormIds.filter((id) => !ids.includes(id));
      return { onFormIds: newOnFormIds };
    });
  },

  setFiles: (ids: string[], files: File[]) => {
    set((state) => {
      const newIdToFile = { ...state.idToFile };
      ids.forEach((id, index) => {
        newIdToFile[id] = files[index];
      });
      return { idToFile: newIdToFile };
    });
  },

  setDataURLs: (ids: string[], dataURLs: string[]) => {
    set((state) => {
      const newIdToDataURL = { ...state.idToDataURL };
      ids.forEach((id, index) => {
        newIdToDataURL[id] = dataURLs[index];
      });
      return { idToDataURL: newIdToDataURL };
    });
  },

  removeFiles: (ids: string[]) => {
    set((state) => {
      const newIdToFile = { ...state.idToFile };
      const newIdToDataURL = { ...state.idToDataURL };

      ids.forEach((id) => {
        delete newIdToFile[id];
        delete newIdToDataURL[id];
      });

      return { idToFile: newIdToFile, idToDataURL: newIdToDataURL };
    });
  },

  getFiles: (ids: string[]) => {
    const state = get();
    return ids.map((id) => state.idToFile[id] || null);
  },

  getDataURLs: (ids: string[]) => {
    const state = get();
    return ids.map((id) => state.idToDataURL[id] || "");
  },

  updateIds: (oldIds: string[], newIds: string[]) => {
    const state = get();
    const newIdToFile = { ...state.idToFile };
    const newIdToDataURL = { ...state.idToDataURL };

    oldIds.forEach((oldId, idx) => {
      const newId = newIds[idx];
      newIdToFile[newId] = newIdToFile[oldId];
      newIdToDataURL[newId] = newIdToDataURL[oldId];
      delete newIdToFile[oldId];
      delete newIdToDataURL[oldId];
    });
  },
}));

export default useFileStore;
