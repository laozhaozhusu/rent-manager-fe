<template>
  <Teleport to="#narBarRight">
    <Icon name="plus" class="add-icon" @click="onAdd" size="large" />
  </Teleport>
  <List finished-text="没有更多了" v-if="buildings.length > 0">
    <SwipeCell v-for="item in buildings" :key="item.id">
      <Cell :title="item.name" is-link :to="`/room/${item.id}`" />
      <template #right>
        <Button square type="danger" text="删除" @click="deleteItem(item.id)" />
      </template>
    </SwipeCell>
  </List>
  <Empty v-else description="暂无楼栋" />
  <Popup
    :show="show"
    @click-overlay="() => (show = false)"
    @click-close-icon="() => (show = false)"
  >
    <Form @submit="onSubmit">
      <CellGroup>
        <Field
          v-model="building.name"
          label="楼栋名称"
          placeholder="请输入楼栋名称"
          required
        />
      </CellGroup>
      <div style="margin: 16px">
        <Button type="primary" round block native-type="submit">添加</Button>
      </div>
    </Form>
  </Popup>
  <Footer />
</template>

<script setup lang="ts">
import {
  Icon,
  List,
  Cell,
  SwipeCell,
  Button,
  Form,
  Popup,
  Field,
  CellGroup,
  Empty,
} from "vant";
import Footer from "@/components/Footer/index.vue";
import { showConfirmDialog } from "vant";
import { useBuildingStore } from "@/store/buildingStore";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const buildingStore = useBuildingStore();

const buildings = computed(() => buildingStore.buildingList);

const show = ref(false);

const building = ref({
  name: "",
});
const onAdd = () => {
  show.value = true;
};

const onSubmit = () => {
  buildingStore.addBuilding(building.value);
  building.value.name = "";
  show.value = false;
};

const deleteItem = (id) => {
  showConfirmDialog({
    title: "提示",
    message: "确定要删除此楼栋吗？",
  })
    .then(() => {
      buildingStore.removeBuilding(id);
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
