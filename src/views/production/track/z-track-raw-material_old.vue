<template>
  <div v-loading="loading">
    <!-- 原材料条码追溯 -->
    条形码：
    <el-input
      v-model="barCodeSearch"
      style="width:300px;margin-right:20px"
      placeholder="请输入内容"
      clearable
      @input="barCodeInput"
    />
    流程：<el-select v-model="value" placeholder="流程" @change="clickFun">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.value"
        :value="item.value"
      />
    </el-select>
    <el-timeline v-if="activities" style="margin-top:18px;">
      <el-timeline-item
        v-for="(activity, key) in options"
        :key="key"
        :timestamp="activities[activity.label]&&activities[activity.label][0]?activities[activity.label][0].time:''"
        placement="top"
        size="large"
        :color="value === activity.value?'#0bbd87':''"
      >
        <span
          :id="activity.value"
          :ref="activity.value"
          style="width:35px;display: inline-block;"
        >
          {{ activities[activity.label]&&activities[activity.label][0]?activities[activity.label][0].classes_name:'--' }}
        </span>
        <span style="margin-left:10px;display: inline-block;" @click="activity._show = !activity._show">{{ activity.value }}</span>
        <i v-if="activity._show" class="el-icon-arrow-down" style="vertical-align: middle;margin-left:10px;" @click="activity._show = !activity._show" />
        <i v-if="!activity._show" class="el-icon-arrow-up" style="vertical-align: middle;margin-left:10px" @click="activity._show = !activity._show" />
        <table
          v-if="activity._show"
          border="1"
          bordercolor="#72716d"
          class="info-table"
        >
          <thead>
            <tr v-if="activity.label === 'material_sample'">
              <td>计划编码</td>
              <td>胶料编码</td>
              <td>设备编码</td>
              <td>创建时间</td>
              <td>下发时间</td>
              <td>开始生产时间</td>
              <td>结束生产时间</td>
            </tr>
            <tr v-if="activity.label === 'material_in'">
              <td>条码</td>
              <td>物料编码</td>
              <td>物料名称</td>
              <td>仓库信息</td>
              <td>库存信息</td>
              <td>库位信息</td>
              <td>托盘号</td>
              <td>操作员</td>
              <td>供应商</td>
              <td>供应商批次</td>
            </tr>
            <tr v-if="activity.label === 'material_out'">
              <td>条码</td>
              <td>物料编码</td>
              <td>物料名称</td>
              <td>仓库信息</td>
              <td>库存信息</td>
              <td>库位信息</td>
              <td>托盘号</td>
              <td>操作员</td>
              <td>供应商</td>
              <td>供应商批次</td>
              <td>质量状态</td>
            </tr>
            <tr v-if="activity.label === 'material_weight'">
              <td>条码</td>
              <td>物料编码</td>
              <td>配料设备</td>
              <td>料罐信息</td>
              <td>称量投入时间</td>
              <td>操作员</td>
            </tr>
            <tr v-if="activity.label === 'material_load'">
              <td>条码</td>
              <td>物料编码</td>
              <td>生产机台</td>
              <td>密炼投入时间</td>
              <td>操作员</td>
            </tr>
          </thead>
          <tbody v-for="(itemVal,index) in activities[activity.label]" :key="index">
            <tr v-if="activity.label === 'material_sample'">
              <!-- <td>{{}}</td> -->
            </tr>
            <tr v-if="activity.label === 'material_in'">
              <td>{{ itemVal.lot_no }}</td>
              <td>{{ itemVal.material_no }}</td>
              <td>{{ itemVal.material_name }}</td>
              <td>--</td>
              <td>--</td>
              <td>{{ itemVal.location }}</td>
              <td>{{ itemVal.pallet_no }}</td>
              <td>{{ itemVal.task__initiator }}</td>
              <td>{{ itemVal.supplier }}</td>
              <td>{{ itemVal.batch_no || '--' }}</td>
            </tr>
            <tr v-if="activity.label === 'material_out'">
              <td>{{ itemVal.lot_no }}</td>
              <td>{{ itemVal.material_no }}</td>
              <td>{{ itemVal.material_name }}</td>
              <td>--</td>
              <td>--</td>
              <td>{{ itemVal.location }}</td>
              <td>{{ itemVal.pallet_no }}</td>
              <td>{{ itemVal.task__initiator }}</td>
              <td>{{ itemVal.supplier }}</td>
              <td>{{ itemVal.batch_no || '--' }}</td>
              <td>--</td>
            </tr>
            <tr v-if="activity.label === 'material_weight'">
              <td>{{ itemVal.bra_code }}</td>
              <td>{{ itemVal.material_no }}</td>
              <td>{{ itemVal.equip_no }}</td>
              <td>{{ itemVal.tank_no }}</td>
              <td>{{ itemVal.created_date || '--' }}</td>
              <td>{{ itemVal.created_user__username }}</td>
            </tr>
            <tr v-if="activity.label === 'material_load'">
              <td>{{ itemVal.bra_code }}</td>
              <td>{{ itemVal.material_no }}</td>
              <td>{{ itemVal.feed_log__equip_no }}</td>
              <td>{{ itemVal.weight_time || '--' }}</td>
              <td>{{ itemVal.feed_log__batch_group }}</td>
            </tr>
          </tbody>
        </table>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
import { materialTrace } from '@/api/base_w_three'
import { debounce } from '@/utils'
export default {
  name: 'TrackRawMaterial',
  data() {
    return {
      value: '',
      barCodeSearch: '', // KTP001
      activities: [],
      loading: false,
      options: [{ label: 'material_sample', value: '取样', _show: true },
        { label: 'material_in', value: '入库', _show: true },
        { label: 'material_out', value: '出库', _show: true },
        { label: 'material_weight', value: '称量投入', _show: true },
        { label: 'material_load', value: '密炼投入', _show: true }],
      headList: {
        material_in: []
      }
    }
  },
  created() {
    // this.getList()
  },
  methods: {
    async getList() {
      this.loading = true
      try {
        const data = await materialTrace('get', null, { params: { lot_no: this.barCodeSearch }})
        this.activities = data || []
        this.loading = false
      } catch (e) {
        this.loading = false
        this.activities = []
      }
    },
    clickFun(val) {
      try {
        this.$nextTick(() => {
          setTimeout(() => {
            const targetbox = document.getElementById(val)
            const target = targetbox.getBoundingClientRect().top
            document.documentElement.scrollTop = target
          })
        })
      } catch (e) {
        console.log(e)
      }
    },
    barCodeInput() {
      debounce(this, 'getList')
    }
  }
}
</script>

<style lang="scss" scoped>
.info-table{
    margin-top:5px;
    border-collapse: collapse;
    td{
        width: 150px;
        text-align: center;
        color: #72716d;
        padding:4px 0;
        word-break : break-all;
    }
}
</style>
