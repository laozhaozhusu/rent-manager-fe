import { defineStore } from "pinia";
import { useBuildingStore } from "./buildingStore";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";

export enum ROOM_STATUS {
  AVAILABLE = "available", // 可用
  OCCUPIED = "occupied", // 已入住
  MAINTENANCE = "maintenance", // 维修中
}

export type Room = {
  id: string;
  buildingId: string; //所属楼宇ID
  code: string; //房号
  tenantName?: string; //租户姓名
  checkInDate?: string; //入住时间
  checkOutDate?: string; //退房时间
  status: ROOM_STATUS; //房间状态
};
interface RoomState {
  rooms: Room[];
  selectedRoomId: string; // 当前选中的房间ID
}

export const useRoomStore = defineStore("room", {
  state: (): RoomState => ({
    rooms: [],
    selectedRoomId: "",
  }),
  getters: {
    selectedRoom(state): Room {
      return state.rooms.find((b) => b.id === state.selectedRoomId);
    },
    buildingRooms(state): Room[] {
      const buildingStore = useBuildingStore();
      const buildingId = buildingStore.selectedBuildingId;
      if (!buildingId) {
        return [];
      }
      return state.rooms.filter((r) => r.buildingId === buildingId);
    },
  },
  actions: {
    selectRoom(id: string) {
      if (!this.rooms.some((r) => r.id === id)) {
        console.warn(`Room with id ${id} does not exist`);
      }
      this.selectedRoomId = id;
    },
    addRoom(room: Omit<Room, "id" | "buildingId">) {
      const buildingStore = useBuildingStore();
      const buildingId = buildingStore.selectedBuildingId;
      if (!buildingId) {
        throw new Error("No building selected");
      }
      const id = uuidv4(); // 简单生成唯一ID
      this.rooms.push({ ...room, id, buildingId });
    },
    removeRoom(id: string) {
      this.rooms = this.rooms.filter((r) => r.id !== id);
    },
    checkInRoom() {
      const room = this.selectedRoom;
      if (room && room.status === ROOM_STATUS.AVAILABLE) {
        room.status = ROOM_STATUS.OCCUPIED;
        room.checkInDate = dayjs().format("YYYY-MM-DD HH:mm:ss");
        room.checkOutDate = null;
      }
    },
    checkOutRoom() {
      const room = this.selectedRoom;
      if (room && room.status === ROOM_STATUS.OCCUPIED) {
        room.status = ROOM_STATUS.AVAILABLE;
        room.checkOutDate = dayjs().format("YYYY-MM-DD HH:mm:ss");
      }
    },
  },
});
