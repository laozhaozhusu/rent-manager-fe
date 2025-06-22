import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { useRoomStore } from "./roomStore";

export type Building = {
  id: string;
  name: string; //楼宇名称
};

type BuildingState = {
  buildings: Building[];
};

export const useBuildingStore = defineStore("building", {
  state: (): BuildingState => ({
    buildings: [],
  }),

  getters: {
    buildingList(state): Building[] {
      return state.buildings;
    },
    buildingIds(state): string[] {
      return state.buildings.map((item) => {
        return item.id;
      });
    },
  },

  actions: {
    addBuilding(building: Omit<Building, "id">) {
      const id = uuidv4(); // 简单生成唯一ID
      this.buildings.push({ ...building, id });
    },
    removeBuilding(id: string) {
      const roomStore = useRoomStore();
      this.buildings = this.buildings.filter((b) => b.id !== id);

      roomStore.syncByPraent();
    },
  },
});
