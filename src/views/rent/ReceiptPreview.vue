<template>
  <Teleport to="#narBarLeft">
    <Icon
      name="arrow-left"
      class="back-icon"
      @click.stop.prevent="$router.back()"
    />
  </Teleport>
  <Image
    width="100%"
    :src="imageUrl"
    v-if="imageUrl"
    @click="
      () => {
        showImagePreview([imageUrl!]);
      }
    "
  />
  <div v-else style="width: 100%; overflow-x: scroll">
    <div
      ref="receiptRef"
      class="receipt-content"
      :class="isGenerate ? 'is-generate' : ''"
    >
      <weiTemplate :data="receiptData" v-if="!!receiptData" />
    </div>
  </div>

  <ActionBar placeholder>
    <ActionBarButton type="primary" @click="handleShare" text="分享图片" />
    <ActionBarButton type="primary" @click="downloadImage" text="保存图片" />
  </ActionBar>

  <van-toast id="toast" />
</template>

<script setup lang="ts">
import { computed, watch, ref, nextTick } from "vue";
// import RentReceipt from "@/components/RentTemplate/index.vue"; // 复用的收据组件
import weiTemplate from "@/components/RentTemplate/weiTemplate.vue"; // 复用的收据组件
import html2canvas from "html2canvas";
import {
  ActionBar,
  ActionBarButton,
  Icon,
  Image,
  showImagePreview,
  showNotify,
} from "vant";
import { useRentStore } from "@/store/rentStore";
import { Share } from "@capacitor/share";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { useRoute } from "vue-router";
import { Capacitor } from "@capacitor/core";

const route = useRoute();
const rentId = route.params?.rentId as string;

const receiptRef = ref<HTMLElement>();
const imageUrl = ref<string>();
const rentStore = useRentStore();
const receiptData = computed(() => rentStore.getRecordById(rentId) || null);
const isGenerate = ref(false);

// 分享功能（复制链接或跳转小程序等）
const handleGenerate = async () => {
  if (!receiptRef.value || imageUrl.value) return;
  isGenerate.value = true;

  nextTick(async () => {
    await html2canvas(receiptRef.value!, {
      useCORS: true,
      allowTaint: false,
      width: 1200,
      scale: 1,
    })
      .then((canvas) => {
        imageUrl.value = canvas.toDataURL("image/png");
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        isGenerate.value = false;
      });
  });
};
const fileName = computed(() => {
  return `${receiptData.value?.roomCode}号房_${receiptData.value?.endDate}_收据.png`;
});

const handleShare = async () => {
  await handleGenerate();

  try {
    await Filesystem.writeFile({
      path: fileName.value,
      data: imageUrl.value!.split(",")[1], // 只保留base64数据部分
      directory: Directory.Cache,
    });

    const fileUri = await Filesystem.getUri({
      directory: Directory.Cache,
      path: fileName.value,
    });

    await Share.share({
      title: `${receiptData.value?.roomCode}租金收据`,
      text: "租金收据信息",
      url: fileUri.uri,
      dialogTitle: "分享截图",
    });
  } catch (e) {
    alert("分享失败，请稍后再试");
    console.error("分享失败", e);
  }
};

const downloadImage = async () => {
  await handleGenerate();

  if (Capacitor.getPlatform() === "web") {
    const link = document.createElement("a");
    link.href = imageUrl.value!;
    link.download = fileName.value;
    link.click();
  } else {
    await Filesystem.writeFile({
      path: fileName.value,
      data: imageUrl.value!.split(",")[1], // 只保留base64数据部分
      directory: Directory.Documents,
      recursive: true,
    })
      .then(() => {
        showNotify({ type: "success", message: "保存成功" });
      })
      .catch(() => {
        showNotify({ type: "danger", message: "保存失败" });
      });
  }
};

watch(
  [() => receiptRef.value, () => receiptData.value],
  ([newVal, newData]) => {
    newVal && newData && nextTick(handleGenerate);
  }
);
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
.is-generate {
  width: 1200px;
  overflow-x: auto;
}
</style>
