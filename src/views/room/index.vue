<template>
  <Teleport to="#narBarLeft">
    <Icon
      name="arrow-left"
      class="back-icon"
      @click.stop.prevent="$router.back()"
      size="large"
    />
  </Teleport>

  <List finished-text="没有更多了" v-if="rooms.length > 0">
    <SwipeCell v-for="item in rooms" :key="item.id">
      <Cell :title="item.code" is-link :to="`/rent/${item.id}`" />
      <template #right>
        <Button square type="danger" text="删除" @click="deleteItem(item)" />
      </template>
    </SwipeCell>
  </List>
  <Empty v-else description="暂无房间" />

  <ActionBar placeholder v-if="queryType !== 'unbilled'">
    <ActionBarButton type="primary" @click="onAdd()" text="新增房间" />
  </ActionBar>

  <Popup
    :show="show"
    @click-overlay="() => (show = false)"
    @click-close-icon="() => (show = false)"
  >
    <Form @submit="onSubmit">
      <CellGroup>
        <Field
          v-model="room.code"
          label="房间名称"
          placeholder="请输入房间名称"
          required
        />
      </CellGroup>
      <div style="margin: 16px">
        <Button type="primary" round block native-type="submit">添加</Button>
      </div>
    </Form>
  </Popup>
</template>

<script setup lang="ts">
import {
  List,
  Cell,
  SwipeCell,
  Button,
  Form,
  Popup,
  Field,
  CellGroup,
  Empty,
  Icon,
  ActionBar,
  ActionBarButton,
} from "vant";
import { showConfirmDialog } from "vant";
import { Room, ROOM_STATUS, useRoomStore } from "@/store/roomStore";
import { computed, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const roomStore = useRoomStore();
const queryType = computed(() => route.query.type);
const buildingId = computed(() => route.params.buildId as string);

const rooms = computed(() => {
  if (queryType.value === "unbilled") {
    return roomStore.unbilledRooms;
  }
  return roomStore.getRoomsByBuildingId(buildingId.value);
});

const show = ref(false);

const room = ref<Omit<Room, "id" | "buildingId">>({
  code: "", //房号
  status: ROOM_STATUS.AVAILABLE, //房间状态
});

const onAdd = () => {
  show.value = true;
};

const onSubmit = () => {
  roomStore.addRoom(room.value, buildingId.value);
  room.value.code = "";

  show.value = false;
};

const deleteItem = (item: { id: string }) => {
  showConfirmDialog({
    title: "提示",
    message: "确定要删除此房间吗？",
  })
    .then(() => {
      roomStore.removeRoom(item.id);
    })
    .catch(() => {
      // 取消删除
    });
};
</script>

<style scoped>
.home {
  text-align: center;
  margin-top: 50px;
}
</style>
