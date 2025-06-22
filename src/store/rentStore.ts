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
  previousElectricity: string; // 上月电表读数
  currentElectricity: string; // 当前电表读数
  electricityPrice: string; //电价
  previousWater: string; // 上月水表读数
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
  payee: string; // 收款人
};

type RentState = {
  records: RentalRecord[];
};

export const useRentStore = defineStore("rental", {
  state: (): RentState => ({
    records: [],
  }),

  getters: {
    getRecordsByRoomId: (state) => {
      return (roomId: string): RentalRecord[] => {
        return state.records.filter((r) => r.roomId === roomId);
      };
    },
    getLatestRecordByRoomId: (state) => {
      return (roomId: string) => {
        return state.records
          .filter((r) => r.roomId === roomId)
          .sort((a, b) => {
            return (
              new Date(b.operateTime).getTime() -
              new Date(a.operateTime).getTime()
            );
          })?.[0];
      };
    },
    getRecordById: (state) => {
      return (id: string): RentalRecord | undefined => {
        return state.records.find((r) => r.id === id);
      };
    },
  },

  actions: {
    addRecord(
      record: Omit<RentalRecord, "id" | "roomCode" | "operateTime">
    ): string {
      const roomStore = useRoomStore();

      const id = uuidv4();
      const roomCode = roomStore.getRoomById(record.roomId)?.code || "";
      const operateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
      this.records.push({ ...record, id, operateTime, roomCode });
      return id;
    },
    removeRecord(id: string) {
      this.records = this.records.filter((r) => r.id !== id);
    },
    removeRecordByRoom(roomId: string) {
      this.records = this.records.filter((r) => r.roomId !== roomId);
    },
    syncByPraent() {
      const roomStore = useRoomStore();

      this.records = this.records.filter((r) =>
        roomStore.roomIds.includes(r.roomId)
      );
    },
  },
});
