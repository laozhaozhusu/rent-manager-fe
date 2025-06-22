<template>
  <div class="receipt-wrapper">
    <h2 class="title">租金收据</h2>

    <table class="receipt-table" border="1">
      <tbody>
        <tr>
          <td width="50%">房间号：{{ data.roomCode }}</td>
          <td align="right">
            {{ dayjs(data.operateTime).format("YYYY-MM-DD") }}
          </td>
        </tr>
        <tr>
          <td colspan="2" align="right">
            {{ data.startDate }} 至 {{ data.endDate }}租金
          </td>
        </tr>
        <tr>
          <td colspan="2">电费总金额：¥{{ electricityAmount }}</td>
        </tr>
        <tr>
          <td>
            <div>上月电表读数</div>
            <div>{{ data.previousElectricity }}</div>
          </td>
          <td>
            <div>本月电表读数</div>
            <div>{{ data.currentElectricity }}</div>
          </td>
        </tr>
        <tr>
          <td>
            <div>实际读数</div>
            <div>{{ electricityUsed }}</div>
          </td>
          <td>
            <div>单价</div>
            <div>{{ data.electricityPrice }}</div>
          </td>
        </tr>

        <tr>
          <td colspan="4">水费总金额：¥{{ waterAmount }}</td>
        </tr>
        <tr>
          <td>
            <div>上月水表读数</div>
            <div>{{ data.previousWater }}</div>
          </td>
          <td>
            <div>本月水表读数</div>
            <div>{{ data.currentWater }}</div>
          </td>
        </tr>

        <tr>
          <td>
            <div>实际读数</div>
            <div>{{ waterUsed }}</div>
          </td>
          <td>
            <div>实际读数</div>
            <div>{{ data.waterPrice }}</div>
          </td>
        </tr>

        <tr>
          <td>租金</td>
          <td>¥{{ data.monthlyRent }}</td>
        </tr>
        <tr>
          <td>卫生费</td>
          <td>¥{{ data.sanitationFee }}</td>
        </tr>
        <tr>
          <td>电梯费</td>
          <td>¥{{ data.elevatorFee }}</td>
        </tr>
        <tr>
          <td>网费</td>
          <td>¥{{ data.internetFee }}</td>
        </tr>
        <tr>
          <td>管理费</td>
          <td>¥{{ data.managementFee }}</td>
        </tr>
        <tr>
          <td>其他</td>
          <td>¥{{ data.otherFee }}</td>
        </tr>

        <tr class="total">
          <td height="40px" colspan="2">
            合计金额：<span class="red">¥{{ data.totalFee }}元</span>
          </td>
        </tr>
        <tr>
          <td height="40px" colspan="2">收款人：{{ data.payee }}</td>
        </tr>
      </tbody>
    </table>

    <div class="footer">
      <p class="red" style="font-size: 12px">
        {{ noticeText }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RentalRecord } from "@/store/rentStore";
import dayjs from "dayjs";
import { computed } from "vue";

const props = defineProps<{
  data: RentalRecord;
}>();

// 计算实际使用度数和费用
const electricityUsed = computed(() =>
  (
    parseFloat(props.data.currentElectricity) -
    parseFloat(props.data.previousElectricity)
  ).toFixed(2)
);
const electricityAmount = computed(() =>
  (
    parseFloat(electricityUsed.value) * parseFloat(props.data.electricityPrice)
  ).toFixed(2)
);

const waterUsed = computed(() =>
  (
    parseFloat(props.data.currentWater) - parseFloat(props.data.previousWater)
  ).toFixed(2)
);
const waterAmount = computed(() =>
  (parseFloat(waterUsed.value) * parseFloat(props.data.waterPrice)).toFixed(2)
);

const noticeText =
  "注：租赁未到期一律不退押金，不得私自转租，贵重物品自行保管，遗失自负。退房请提前十天告知房东，超出一天按50~100元/天计费。";
</script>

<style scoped>
.red {
  color: red;
  font-weight: bold;
}
.receipt-wrapper {
  padding: 16px;
  background-color: #f8f8f8;
}
.receipt-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 16px;
  font-size: 16px;
  line-height: 20px;
}
.receipt-table td {
  padding: 4px;
  border: 1px solid #ccc;
}
.title {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
}
</style>
