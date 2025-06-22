<template>
  <Teleport to="#narBarLeft">
    <Icon
      name="arrow-left"
      class="back-icon"
      @click.stop.prevent="router.back()"
    />
  </Teleport>
  <div class="add-rent">
    <Form ref="formRef">
      <Field v-model="selectedRoom.code" label="房号" disabled />
      <Field v-model="selectedRoom.checkInDate" label="单据日期" disabled />

      <DateField
        v-model="formData.startDate"
        label="房租起始日期"
        type="date"
        placeholder="请选择时间"
        :disabled="readonly"
      />
      <DateField
        v-model="formData.endDate"
        label="房租终止日期"
        type="date"
        placeholder="请选择时间"
        :disabled="readonly"
      />
      <!-- 电费相关 -->
      <Field
        v-model="formData.previousElectricity"
        type="number"
        label="上月电表读数"
        :disabled="readonly"
        :rules="[{ required: true, message: '请输入上月电表读数' }]"
      />
      <Field
        v-model="formData.currentElectricity"
        type="number"
        label="本月电表读数"
        :rules="[{ required: true, message: '请输入本月电表读数' }]"
        :disabled="readonly"
      />
      <Field
        v-model="usedElectricity"
        type="number"
        disabled
        label="实用电量"
      />
      <Field
        v-model="formData.electricityPrice"
        label="电费单价"
        type="number"
        :disabled="readonly"
      />
      <Field
        v-model="monthElectricityFee"
        type="number"
        disabled
        label="电费"
      />
      <!-- 水费相关 -->
      <Field
        v-model="formData.previousWater"
        type="number"
        label="上月水表读数"
        :disabled="readonly"
        :rules="[{ required: true, message: '请输入上月水表读数' }]"
      />
      <Field
        v-model="formData.currentWater"
        type="number"
        label="本月水表读数"
        :disabled="readonly"
        :rules="[{ required: true, message: '请输入本月水表读数' }]"
      />
      <Field v-model="usedWater" type="number" disabled label="实用水量" />
      <Field
        v-model="formData.waterPrice"
        :disabled="readonly"
        label="水费费单价"
        type="number"
      />
      <Field v-model="monthWaterFee" type="number" disabled label="水费" />
      <!-- 其他费用 -->
      <Field
        v-model="formData.monthlyRent"
        :disabled="readonly"
        type="number"
        label="房租"
        :rules="[{ required: true, message: '请输入房租' }]"
      />
      <Field
        v-model="formData.sanitationFee"
        :disabled="readonly"
        type="number"
        label="卫生费"
      />
      <Field
        v-model="formData.elevatorFee"
        :disabled="readonly"
        type="number"
        label="电梯费"
      />
      <Field
        v-model="formData.internetFee"
        :disabled="readonly"
        type="number"
        label="网费"
      />
      <Field
        v-model="formData.managementFee"
        :disabled="readonly"
        type="number"
        label="管理费"
      />
      <Field
        v-model="formData.otherFee"
        :disabled="readonly"
        type="number"
        label="其他"
      />
      <Field v-model="formData.payee" :disabled="readonly" label="收款人" />
    </Form>
  </div>
  <ActionBar placeholder>
    <ActionBarButton
      v-if="readonly"
      type="primary"
      :to="`/rent/preview/${rentId}`"
      text="生成图片"
    />
    <ActionBarButton v-else type="primary" @click="onSubmit" text="提交" />
  </ActionBar>
</template>

<script setup lang="ts">
import { computed, watch, reactive, ref } from "vue";
import { useRoomStore } from "@/store/roomStore";
import { useRentStore, type RentalRecord } from "@/store/rentStore";
import dayjs from "dayjs";
import { Form, Field, ActionBar, ActionBarButton, Icon } from "vant";
import DateField from "@/components/DateField/index.vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
const roomStore = useRoomStore();
const rentStore = useRentStore();
let rentId = route.params?.rentId as string;
const roomId = route.query?.roomId as string;
const formRef = ref();

const operateType = computed(() => route.query.type);

const readonly = computed(() => operateType.value === "detail");

const selectedRecord = computed(() => rentStore.getRecordById(rentId) || null);

const latestRentRecord = computed(
  () =>
    rentStore.getLatestRecordByRoomId(roomId) || {
      startDate: "",
      endDate: "",
    }
);
const selectedRoom = computed(
  () =>
    roomStore.getRoomById(roomId) || {
      code: "",
      checkInDate: "",
    }
);

// 实用电量计算逻辑
const usedElectricity = computed(() => {
  const current = parseFloat(formData.currentElectricity) || 0;
  const previous = parseFloat(formData.previousElectricity) || 0;
  return (current - previous).toFixed(2);
});
// 电费计算逻辑
const monthElectricityFee = computed(() => {
  const price = parseFloat(formData.electricityPrice) || 0;
  const used = parseFloat(usedElectricity.value) || 0;
  return (price * used).toFixed(2);
});

// 实用水量计算逻辑
const usedWater = computed(() => {
  const current = parseFloat(formData.currentWater) || 0;
  const previous = parseFloat(formData.previousWater) || 0;
  return (current - previous).toFixed(2);
});
// 水费计算逻辑
const monthWaterFee = computed(() => {
  const price = parseFloat(formData.waterPrice) || 0;
  const used = parseFloat(usedWater.value) || 0;
  return (price * used).toFixed(2);
});

const totalFee = computed(() => {
  const fees = [
    parseFloat(formData.monthlyRent) || 0,
    parseFloat(monthElectricityFee.value) || 0,
    parseFloat(monthWaterFee.value) || 0,
    parseFloat(formData.sanitationFee) || 0,
    parseFloat(formData.elevatorFee) || 0,
    parseFloat(formData.internetFee) || 0,
    parseFloat(formData.managementFee) || 0,
    parseFloat(formData.otherFee) || 0,
  ];
  return String(fees.reduce((sum, fee) => sum + fee, 0));
});

const formData = reactive<
  Omit<RentalRecord, "id" | "roomId" | "roomCode" | "operateTime" | "totalFee">
>({
  startDate: "", // Convert to 1-based month
  endDate: "",
  currentElectricity: "",
  previousElectricity: "",
  electricityPrice: "",
  currentWater: "",
  previousWater: "",
  waterPrice: "",
  monthlyRent: "",
  sanitationFee: "",
  elevatorFee: "",
  internetFee: "",
  managementFee: "",
  otherFee: "",
  payee: "",
});

const onSubmit = async () => {
  formRef.value
    ?.validate()
    .then(() => {
      rentId = rentStore.addRecord({
        ...formData,
        roomId: roomId,
        totalFee: totalFee.value,
      });
      router.replace({
        path: `/rent/detail/${rentId}`,
        query: { type: "detail", roomId },
      });
    })
    .catch((error: unknown) => {
      console.warn("验证失败", error);
    });
};

watch(
  () => selectedRecord.value,
  (val) => {
    if (operateType.value === "detail" && val) {
      formData.startDate = val.startDate;
      formData.endDate = val.endDate;

      formData.currentElectricity = val.currentElectricity;
      formData.previousElectricity = val.previousElectricity;
      formData.electricityPrice = val.electricityPrice;

      formData.currentWater = val.currentWater;
      formData.previousWater = val.previousWater;
      formData.waterPrice = val.waterPrice;

      formData.monthlyRent = val.monthlyRent;
      formData.sanitationFee = val.sanitationFee;
      formData.elevatorFee = val.elevatorFee;
      formData.internetFee = val.internetFee;
      formData.managementFee = val.managementFee;
      formData.otherFee = val.otherFee;
      formData.payee = val.payee;
    }
  },
  { immediate: true }
);

watch(
  [() => latestRentRecord.value, () => selectedRoom.value.checkInDate],
  ([val, checkInDate]) => {
    if (operateType.value === "add") {
      const startDate = val.endDate || checkInDate;
      formData.startDate = dayjs(startDate).add(1, "day").format("YYYY-MM-DD");
      formData.endDate = dayjs(startDate).add(1, "M").format("YYYY-MM-DD");

      if (operateType.value === "add" && val && "roomId" in val) {
        formData.electricityPrice = val.electricityPrice;
        formData.previousElectricity = val.currentElectricity;

        formData.previousWater = val.currentWater;
        formData.waterPrice = val.waterPrice;

        formData.monthlyRent = val.monthlyRent;
        formData.sanitationFee = val.sanitationFee;
        formData.elevatorFee = val.elevatorFee;
        formData.internetFee = val.internetFee;
        formData.managementFee = val.managementFee;
        formData.otherFee = val.otherFee;
        formData.payee = val.payee;
      }
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.add-rent {
  padding: 16px;
}
</style>
