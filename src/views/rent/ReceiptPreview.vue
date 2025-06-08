<template>
  <div class="preview-container">
    <!-- <div v-if="imageUrl" class="mt-4">
      <Image :src="imageUrl" alt="截图" />
    </div> -->
    <!-- <RentReceipt :data="receiptData" /> -->

    <div ref="receiptRef" class="receipt-content">
      <RentReceipt :data="receiptData" />
    </div>

    <ActionBar>
      <ActionBarButton type="primary" @click="handleShare" text="分享图片" />
      <ActionBarButton type="primary" @click="downloadImage" text="保存图片" />
    </ActionBar>

    <van-toast id="toast" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import RentReceipt from "@/components/RentTemplate/index.vue"; // 复用的收据组件
import html2canvas from "html2canvas";
import { Image, ActionBar, ActionBarButton } from "vant";
import { useRentStore } from "@/store/rentStore";

const receiptRef = ref<HTMLElement | null>(null);
const imageUrl = ref<string | null>(null);

const rentStore = useRentStore();
const receiptData = computed(() => rentStore.selectedRecord || null);

// 分享功能（复制链接或跳转小程序等）
const handleGenerate = async () => {
  if (!receiptRef.value) return;
  const canvas = await html2canvas(receiptRef.value);
  imageUrl.value = canvas.toDataURL("image/png");
};

const handleShare = async () => {
  if (!navigator.canShare || !imageUrl.value) {
    alert("当前浏览器不支持分享");
    return;
  }

  const res = await fetch(imageUrl.value);
  const blob = await res.blob();
  const file = new File([blob], "receipt.png", { type: "image/png" });

  try {
    await navigator.share({
      files: [file],
      title: "租金收据",
      text: "请查收租金收据",
    });
  } catch (err) {
    console.error("分享失败", err);
  }
};

const downloadImage = async () => {
  // 自动下载图片
  const link = document.createElement("a");
  link.href = imageUrl.value;
  link.download = `${receiptData.value.roomCode}号房${receiptData.value.startDate}-${receiptData.value.endDate}收据.png`;
  link.click();
};
onMounted(() => {
  if (receiptRef.value) {
    handleGenerate();
  }
});
</script>

<style scoped>
.preview-container {
  padding: 16px;
  background-color: #f8f8f8;
}
.socll-receipt {
  overflow: scroll;
  width: 100%;
}
.receipt-content {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.action-buttons {
  margin-top: 24px;
}
</style>
