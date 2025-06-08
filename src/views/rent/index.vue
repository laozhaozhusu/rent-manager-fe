<template>
  <div>
    <List finished-text="没有更多了">
      <SwipeCell v-for="item in rentRecords" :key="item.id">
        <Cell
          value-class="cell-value"
          :title="`${item.roomCode} ${item.startDate}至${item.endDate}`"
          :value="item.totalFee"
          is-link
          @click="handleDetail(item.id)"
        >
          <template #label>
            <div>{{ formateElectricity(item) }}</div>
            <div>{{ formateWater(item) }}</div>
          </template>
        </Cell>
        <template #right>
          <Button
            square
            type="danger"
            text="删除"
            @click="deleteItem(item.id)"
          />
        </template>
      </SwipeCell>
    </List>
    <ActionBar>
      <ActionBarIcon
        icon="plus"
        v-if="selectedRoom?.status === ROOM_STATUS.AVAILABLE"
        text="开始入住"
        @click="checkInRoom"
        color="#ee0a24"
      />
      <ActionBarIcon
        icon="minus"
        @click="checkOutRoom"
        v-if="selectedRoom?.status === ROOM_STATUS.OCCUPIED"
        text="退房"
      />

      <ActionBarButton
        type="primary"
        :disabled="selectedRoom?.status !== ROOM_STATUS.OCCUPIED"
        to="/rent/add"
        text="新增单据"
      />
      <!-- <ActionBarButton
        type="primary"
        :disabled="selectedRoom?.status !== ROOM_STATUS.OCCUPIED"
        to="/rent/add"
      /> -->
    </ActionBar>
  </div>
</template>

<script setup lang="ts">
import { RentalRecord, useRentStore } from "@/store/rentStore";
import { useRoomStore, ROOM_STATUS } from "@/store/roomStore";
import {
  SwipeCell,
  List,
  Cell,
  Button,
  ActionBar,
  ActionBarIcon,
  ActionBarButton,
  showConfirmDialog,
} from "vant";
import { computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const roomStore = useRoomStore();
const selectedRoom = computed(() => roomStore.selectedRoom);
const rentStore = useRentStore();
const rentRecords = computed(() => {
  console.log(":::", rentStore.rentRecords);
  return rentStore.rentRecords;
});
const formateElectricity = (item: RentalRecord): string => {
  // 计算电费
  const currentElectricity = parseFloat(item.currentElectricity) || 0;
  const previousElectricity = parseFloat(item.PreviousElectricity) || 0;
  const unitPriceElectricity = parseFloat(item.electricityPrice) || 0;

  // 实用电量
  const usedElectricity = currentElectricity - previousElectricity;
  return `电费: ${usedElectricity} × ${unitPriceElectricity} = ${(
    usedElectricity * unitPriceElectricity
  ).toFixed(2)} 元`;
};
const formateWater = (item: RentalRecord): string => {
  // 计算水费
  const currentWater = parseFloat(item.currentWater) || 0;
  const previousWater = parseFloat(item.PreviousWater) || 0;
  const unitPriceWater = parseFloat(item.waterPrice) || 0;

  // 实用水量
  const usedWater = currentWater - previousWater;
  return `水费: ${usedWater} × ${unitPriceWater} = ${(
    usedWater * unitPriceWater
  ).toFixed(2)} 元`;
};

const deleteItem = (id: string) => {
  showConfirmDialog({
    title: "提示",
    message: "确定要删除此记录吗？",
    theme: "round-button",
  })
    .then(() => {
      rentStore.removeRecord(id);
    })
    .catch(() => {
      // 取消删除
    });
};
const checkInRoom = () => {
  if (selectedRoom.value.status === ROOM_STATUS.AVAILABLE) {
    roomStore.checkInRoom();
  }
};
const checkOutRoom = () => {
  if (selectedRoom.value.status === ROOM_STATUS.OCCUPIED) {
    roomStore.checkOutRoom();
  }
};

const handleDetail = (id: string) => {
  rentStore.selectRecord(id);
  router.push({ path: "/rent/add", query: { readonly: 1 } });
};
</script>

<style scoped>
:deep(.cell-value) {
  flex-grow: 0;
  flex-basis: auto;
  flex-shrink: 1;
}
:deep(.van-swipe-cell__right button) {
  height: 100%;
}
</style>
