<template>
  <Field
    v-bind="$attrs"
    readonly
    :label="label"
    :model-value="displayValue"
    is-link
    @click="show = true"
  />

  <Popup v-model:show="show" position="bottom">
    <DatePicker
      v-model="innerValue"
      :title="title"
      :min-date="minDate"
      :max-date="maxDate"
      @confirm="onConfirm"
      @cancel="show = false"
    />
  </Popup>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { DatePicker, Popup, Field } from "vant";

const props = defineProps<{
  modelValue: string;
  label?: string;
  title?: string;
  minDate?: Date;
  maxDate?: Date;
  format?: (val: string) => string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", val: string): void;
}>();

const show = ref(false);

// ✅ 重点：v-model 是 string[]
const innerValue = ref<string[]>([]);

watch(
  () => props.modelValue,
  (val) => {
    if (val) innerValue.value = val.split("-");
    console.log("Model Value Changed:", innerValue.value);
  },
  { immediate: true }
);

const onConfirm = (val: { selectedValues: string[] }) => {
  const dateStr = val.selectedValues.join("-"); // 👉 拼接成 "YYYY-MM-DD"
  emit("update:modelValue", dateStr);
  show.value = false;
};

const displayValue = computed(() => {
  return props.format ? props.format(props.modelValue) : props.modelValue;
});
</script>
