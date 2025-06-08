import { defineStore } from "pinia";
import { useRoomStore } from "./roomStore";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";

export type RentalRecord = {
  id: string;
  roomId: string;
  roomCode: string; // 房间号
  startDate: string;
  endDate: string;
  PreviousElectricity: string; // 上月电表读数
  currentElectricity: string; // 当前电表读数
  electricityPrice: string; //电价
  PreviousWater: string; // 上月水表读数
  currentWater: string; // 当前水表读数
  waterPrice: string; // 水价
  monthlyRent: string; // 房租
  sanitationFee: string; // 卫生费
  elevatorFee: string; // 电梯费
  internetFee: string; // 网络费
  managementFee: string; // 管理费
  otherFee: string; // 其他费用
  totalFee: string; // 合计金额
  operateTime: string; // 操作时间
};

type RentState = {
  records: RentalRecord[];
  selectedRecordId: string; // 当前选中的记录ID
};

export const useRentStore = defineStore("rental", {
  state: (): RentState => ({
    records: [],
    selectedRecordId: "", // 当前选中的记录ID
  }),

  getters: {
    rentRecords: (state) => {
      const roomStore = useRoomStore();
      const roomId = roomStore.selectedRoomId;

      return state.records.filter((r) => r.roomId === roomId);
    },
    latestRentRecord: (state) => {
      const roomStore = useRoomStore();
      const roomId = roomStore.selectedRoomId;

      return state.records
        .filter((r) => r.roomId === roomId)
        .sort((a, b) => {
          return (
            new Date(a.operateTime).getTime() -
            new Date(b.operateTime).getTime()
          );
        })?.[0];
    },
    selectedRecord: (state) => {
      return state.records.find((r) => r.id === state.selectedRecordId);
    },
  },

  actions: {
    selectRecord(id: string) {
      if (!this.records.some((r) => r.id === id)) {
        console.warn(`Record with id ${id} does not exist`);
      }
      this.selectedRecordId = id;
    },
    addRecord(
      record: Omit<RentalRecord, "id" | "roomId" | "roomCode" | "operateTime">
    ) {
      const id = uuidv4();
      const roomStore = useRoomStore();
      const roomId = roomStore.selectedRoomId;
      const roomCode = roomStore.selectedRoom?.code || "";
      const operateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
      this.records.push({ ...record, id, roomId, operateTime, roomCode });
    },
    removeRecord(id: string) {
      this.records = this.records.filter((r) => r.id !== id);
    },
  },
});
