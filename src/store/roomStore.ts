import { defineStore } from "pinia";
import { useBuildingStore } from "./buildingStore";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";
import { useRentStore } from "./rentStore";

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
}

export const useRoomStore = defineStore("room", {
  state: (): RoomState => ({
    rooms: [],
  }),
  getters: {
    roomIds(state) {
      return state.rooms.map((item) => {
        return item.id;
      });
    },
    getRoomById(state) {
      return (id: string): Room | undefined => {
        return state.rooms.find((r) => r.id === id);
      };
    },
    getRoomsByBuildingId(state) {
      return (id: string): Room[] => {
        return state.rooms.filter((r) => r.buildingId === id);
      };
    },
    // 获取房间总数量
    totalRoomsCount(state): number {
      return state.rooms.length;
    },
    // 获取未出租房间数量
    unOccupiedRoomCount(state): number {
      return state.rooms.filter((r) => r.status !== ROOM_STATUS.OCCUPIED)
        .length;
    },
    // 获取已出租房间数量
    occupiedRoomCount(state): number {
      return state.rooms.filter((r) => r.status === ROOM_STATUS.OCCUPIED)
        .length;
    },
    unbilledRooms: (state) => {
      const rentStore = useRentStore();

      const billedRoomIds = new Set(
        rentStore.records
          .filter((record) => {
            return (
              record.endDate > dayjs().subtract(1, "M").format("YYYY-MM-DD")
            );
          })
          .map((record) => record.roomId)
      );

      const unBilledRooms = state.rooms.filter(
        (room) => !billedRoomIds.has(room.id) && room.status === "occupied"
      );

      return unBilledRooms;
    },
  },
  actions: {
    addRoom(room: Omit<Room, "id" | "buildingId">, buildingId: string) {
      if (!buildingId) {
        throw new Error("No building selected");
      }
      const id = uuidv4(); // 简单生成唯一ID
      this.rooms.push({ ...room, id, buildingId });
    },
    removeRoom(id: string) {
      const rentStore = useRentStore();
      this.rooms = this.rooms.filter((r) => r.id !== id);
      rentStore.syncByPraent();
    },
    syncByPraent() {
      const buildingStore = useBuildingStore();
      const rentStore = useRentStore();

      this.rooms = this.rooms.filter((r) =>
        buildingStore.buildingIds.includes(r.buildingId)
      );
      rentStore.syncByPraent();
    },
    checkInRoom(id: string) {
      const room = this.getRoomById(id);
      if (room && room.status === ROOM_STATUS.AVAILABLE) {
        room.status = ROOM_STATUS.OCCUPIED;
        room.checkInDate = dayjs().format("YYYY-MM-DD HH:mm:ss");
        room.checkOutDate = undefined;
      }
    },
    checkOutRoom(id: string) {
      const room = this.getRoomById(id);
      const rentStore = useRentStore();
      if (room && room.status === ROOM_STATUS.OCCUPIED) {
        room.status = ROOM_STATUS.AVAILABLE;
        room.checkOutDate = dayjs().format("YYYY-MM-DD HH:mm:ss");
        rentStore.removeRecordByRoom(room.id);
      }
    },
  },
});
