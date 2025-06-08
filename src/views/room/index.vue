<template>
  <Teleport to="#narBarRight">
    <van-icon name="plus" class="add-icon" @click="onAdd" />
  </Teleport>
  <List finished-text="没有更多了">
    <SwipeCell v-for="item in rooms" :key="item.id">
      <Cell
        :title="item.code"
        is-link
        to="/rent"
        @click="selectRoom(item.id)"
      />
      <template #right>
        <Button square type="danger" text="删除" @click="deleteItem(item)" />
      </template>
    </SwipeCell>
  </List>
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
} from "vant";
import { showConfirmDialog } from "vant";
import { Room, ROOM_STATUS, useRoomStore } from "@/store/roomStore";
import { computed, ref } from "vue";

const roomStore = useRoomStore();

const rooms = computed(() => roomStore.buildingRooms);

const show = ref(false);

const room = ref<Omit<Room, "id" | "buildingId">>({
  code: "", //房号
  status: ROOM_STATUS.AVAILABLE, //房间状态
});

const onAdd = () => {
  show.value = true;
};

const onSubmit = () => {
  roomStore.addRoom(room.value);
  room.value.code = "";

  show.value = false;
};

const selectRoom = (id: string) => {
  console.log("selectRoom", id);

  roomStore.selectRoom(id);
};
const deleteItem = (item: { id: string }) => {
  showConfirmDialog({
    title: "提示",
    message: "确定要删除此房间吗？",
    theme: "round-button",
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
