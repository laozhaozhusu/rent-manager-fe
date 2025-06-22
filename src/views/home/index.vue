<template>
  <div class="room-number-list">
    <CellGroup inset>
      <cell title="总房间数量" :value="totalRoomsCount" size="large" />
    </CellGroup>

    <CellGroup inset>
      <cell title="已出租数量" :value="occupiedRoomCount" size="large" />
    </CellGroup>

    <CellGroup inset>
      <cell title="未出租数量" :value="unOccupiedRoomCount" size="large" />
    </CellGroup>
    <CellGroup inset>
      <cell
        title="未开收据数量"
        :value="unbilledRoomsCount"
        is-link=""
        @click="goToUnbilledRoom"
        size="large"
      />
      <!-- <template #right-icon>
          <Icon name="arrow-o" size="24px" />
        </template> -->
      <!-- </cell> -->
    </CellGroup>
  </div>

  <Footer />
</template>

<script setup>
import { CellGroup, Cell } from "vant";

import { useRoomStore } from "@/store/roomStore";
import Footer from "@/components/Footer/index.vue";

import { computed } from "vue";
import { useRentStore } from "@/store/rentStore";
import { useRouter } from "vue-router";

const router = useRouter();
const roomStore = useRoomStore();
const rentStore = useRentStore();

const totalRoomsCount = computed(() => roomStore.totalRoomsCount);
const unOccupiedRoomCount = computed(() => roomStore.unOccupiedRoomCount);
const occupiedRoomCount = computed(() => roomStore.occupiedRoomCount);

const unbilledRoomsCount = computed(() => roomStore.unbilledRooms.length);

const goToUnbilledRoom = () => {
  router.push({ path: "/room", query: { type: "unbilled" } });
};
</script>
<style lang="css" scoped>
.room-number-list {
  padding-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
