<template>
  <div class="receipt-wrapper">
    <h1 class="title">租金收据</h1>

    <table class="receipt-table" border="1">
      <tbody>
        <tr>
          <td colspan="2" class="red">房间号：{{ data.roomCode }}</td>
          <td align="right" colspan="3">
            单据日期:{{ dayjs(data.operateTime).format("YYYY-MM-DD") }}
          </td>
        </tr>
        <tr>
          <td>上月电表读数</td>
          <td>本月电表读数</td>
          <td>实际读数</td>
          <td>单价</td>
          <td>金额</td>
        </tr>
        <tr>
          <td>
            {{ data.previousElectricity }}
          </td>
          <td>
            {{ data.currentElectricity }}
          </td>
          <td>{{ electricityUsed }}</td>
          <td>¥{{ data.electricityPrice }}</td>
          <td align="right">¥{{ electricityAmount }}</td>
        </tr>
        <tr>
          <td>上月水表读数</td>
          <td>本月水表读数</td>
          <td>实际读数</td>
          <td>单价</td>
          <td>金额</td>
        </tr>
        <tr>
          <td>
            {{ data.previousWater }}
          </td>
          <td>
            {{ data.previousWater }}
          </td>
          <td>{{ waterUsed }}</td>
          <td>¥{{ data.waterPrice }}</td>
          <td align="right">¥{{ waterAmount }}</td>
        </tr>

        <tr>
          <td>租金</td>
          <td>¥{{ data.monthlyRent }}</td>
          <td colspan="3" align="right">
            {{ data.startDate }} 至 {{ data.endDate }}租金
          </td>
        </tr>

        <tr>
          <td>卫生费</td>
          <td>¥{{ data.sanitationFee || 0 }}</td>
          <td>电梯费</td>
          <td>¥{{ data.elevatorFee || 0 }}</td>
          <td></td>
        </tr>
        <tr>
          <td>网费</td>
          <td>¥{{ data.internetFee || 0 }}</td>
          <td>管理费</td>
          <td>¥{{ data.managementFee || 0 }}</td>
          <td></td>
        </tr>
        <tr>
          <td>其他</td>
          <td>¥{{ data.otherFee || 0 }}</td>
          <td colspan="3"></td>
        </tr>

        <tr class="total">
          <td>合计金额</td>
          <td height="50px" colspan="2">
            <span class="red" style="font-size: 32px"
              >¥{{ data.totalFee }}元</span
            >
          </td>
          <td height="50px" colspan="2">收款人：{{ data.payee }}</td>
        </tr>
      </tbody>
    </table>

    <div class="footer">
      <p class="red" style="font-size: 24px">
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
  padding: 32px;
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
  padding: 8px;
  line-height: 32px;
  font-size: 18px;
  border: 1px solid #000000;
}
.title {
  text-align: center;
  font-weight: bold;
}
</style>
