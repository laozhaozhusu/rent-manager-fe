import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";

export type Building = {
  id: string;
  name: string; //楼宇名称
};

type BuildingState = {
  buildings: Building[];
  selectedBuildingId: string;
};

export const useBuildingStore = defineStore("building", {
  state: (): BuildingState => ({
    buildings: [],
    selectedBuildingId: "",
  }),

  getters: {
    buildingList(state): Building[] {
      return state.buildings;
    },
    selectedBuilding(state): Building | null {
      return (
        state.buildings.find((b) => b.id === state.selectedBuildingId) || null
      );
    },
  },

  actions: {
    addBuilding(building: Omit<Building, "id">) {
      const id = uuidv4(); // 简单生成唯一ID
      this.buildings.push({ ...building, id });
    },
    removeBuilding(id: string) {
      this.buildings = this.buildings.filter((b) => b.id !== id);
      if (this.selectedBuildingId === id) {
        this.selectedBuildingId = null;
      }
    },
    selectBuilding(id: string) {
      const exists = this.buildings.some((b) => b.id === id);
      if (exists) {
        this.selectedBuildingId = id;
        return true;
      } else {
        console.warn(`[selectBuilding] 无效的楼栋ID: ${id}`);
        return false;
      }
    },
  },
});
