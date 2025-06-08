<template>
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
        v-model="formData.PreviousElectricity"
        type="number"
        label="上月电表读数"
        :disabled="readonly"
      />
      <Field
        v-model="formData.currentElectricity"
        type="number"
        label="本月电表读数"
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
        v-model="formData.PreviousWater"
        type="number"
        label="上月水表读数"
        :disabled="readonly"
      />
      <Field
        v-model="formData.currentWater"
        type="number"
        label="本月水表读数"
        :disabled="readonly"
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
    </Form>
  </div>
  <ActionBar>
    <ActionBarButton
      v-if="readonly"
      type="primary"
      to="/rent/preview"
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
import { Form, Field, ActionBar, ActionBarButton } from "vant";
import DateField from "@/components/DateField/index.vue";
import { useRoute, useRouter } from "vue-router";
import html2canvas from "html2canvas";

const router = useRouter();
const route = useRoute();
const roomStore = useRoomStore();
const rentStore = useRentStore();

const readonly = computed(() => route.query.readonly === "1");

const selectedRecord = computed(() => rentStore.selectedRecord || null);

const selectedRoom = computed(
  () => roomStore.selectedRoom || { code: "", checkInDate: "" }
);

const latestRentRecord = computed(
  () => rentStore.latestRentRecord || { startDate: "", endDate: "" }
);

// 实用电量计算逻辑
const usedElectricity = computed(() => {
  const current = parseFloat(formData.currentElectricity) || 0;
  const previous = parseFloat(formData.PreviousElectricity) || 0;
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
  const previous = parseFloat(formData.PreviousWater) || 0;
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
  PreviousElectricity: "",
  electricityPrice: "",
  currentWater: "",
  PreviousWater: "",
  waterPrice: "",
  monthlyRent: "",
  sanitationFee: "",
  elevatorFee: "",
  internetFee: "",
  managementFee: "",
  otherFee: "",
});

const onSubmit = () => {
  rentStore.addRecord({
    ...formData,
    totalFee: totalFee.value,
  });
  router.replace({ path: "/rent/add", query: { readonly: 1 } });
};

watch(
  [
    () => latestRentRecord.value.startDate,
    () => selectedRoom.value.checkInDate,
  ],
  ([time1, time2]) => {
    const val = time1 || time2;
    if (!readonly && val) {
      formData.startDate = dayjs(val).format("YYYY-MM-DD");
      formData.endDate = dayjs(val).add(1, "M").format("YYYY-MM-DD");
    }
  },
  { immediate: true }
);

watch(
  () => selectedRecord.value,
  (val) => {
    if (readonly && val) {
      formData.startDate = selectedRecord.value.startDate;
      formData.endDate = selectedRecord.value.endDate;
      formData.currentElectricity = selectedRecord.value.currentElectricity;
      formData.PreviousElectricity = selectedRecord.value.PreviousElectricity;
      formData.PreviousElectricity = selectedRecord.value.PreviousElectricity;
      formData.electricityPrice = selectedRecord.value.electricityPrice;
      formData.currentWater = selectedRecord.value.currentWater;
      formData.PreviousWater = selectedRecord.value.PreviousWater;
      formData.waterPrice = selectedRecord.value.waterPrice;
      formData.monthlyRent = selectedRecord.value.monthlyRent;
      formData.sanitationFee = selectedRecord.value.sanitationFee;
      formData.elevatorFee = selectedRecord.value.elevatorFee;
      formData.internetFee = selectedRecord.value.internetFee;
      formData.managementFee = selectedRecord.value.managementFee;
      formData.otherFee = selectedRecord.value.otherFee;
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
