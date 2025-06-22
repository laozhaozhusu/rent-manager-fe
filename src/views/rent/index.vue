<template>
  <Teleport to="#narBarLeft">
    <Icon
      name="arrow-left"
      class="back-icon"
      size="large"
      @click.stop.prevent="$router.back()"
    />
  </Teleport>
  <List finished-text="没有更多了" v-if="rentRecords.length > 0" inset>
    <SwipeCell
      v-for="item in rentRecords"
      :key="item.id"
      v-if="rentRecords.length > 0"
    >
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
        <Button square type="danger" text="删除" @click="deleteItem(item.id)" />
      </template>
    </SwipeCell>
  </List>
  <Empty v-else description="暂无租赁记录" />
  <ActionBar placeholder>
    <ActionBarIcon
      icon="plus"
      v-if="selectedRoom?.status === ROOM_STATUS.AVAILABLE"
      text="入住"
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
      @click="handleAddRecord()"
      text="新增单据"
    />
  </ActionBar>
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
  Icon,
  Empty,
} from "vant";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const roomStore = useRoomStore();
const roomId = route.params?.roomId as string;
const selectedRoom = computed(() => {
  return roomStore.getRoomById(roomId);
});
const rentStore = useRentStore();
const rentRecords = computed(() => {
  return rentStore.getRecordsByRoomId(roomId);
});
const formateElectricity = (item: RentalRecord): string => {
  // 计算电费
  const currentElectricity = parseFloat(item.currentElectricity) || 0;
  const previousElectricity = parseFloat(item.previousElectricity) || 0;
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
  const previousWater = parseFloat(item.previousWater) || 0;
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
  })
    .then(() => {
      rentStore.removeRecord(id);
    })
    .catch(() => {
      // 取消删除
    });
};
const checkInRoom = () => {
  if (selectedRoom.value?.status === ROOM_STATUS.AVAILABLE) {
    roomStore.checkInRoom(roomId);
  }
};
const checkOutRoom = () => {
  if (selectedRoom.value?.status === ROOM_STATUS.OCCUPIED) {
    roomStore.checkOutRoom(roomId);
  }
};

const handleAddRecord = () => {
  router.push({ path: `/rent/add`, query: { type: "add", roomId } });
};
const handleDetail = (rentId: string) => {
  router.push({
    path: `/rent/detail/${rentId}`,
    query: { type: "detail", roomId },
  });
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
