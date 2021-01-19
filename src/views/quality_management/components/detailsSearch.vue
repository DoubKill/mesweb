<template>
  <div>
    <el-form :inline="true">
      <el-form-item label="日期">
        <el-date-picker
          v-model="getParams.day_time"
          :clearable="false"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
        />
      </el-form-item>
      <el-form-item label="机台">
        <equip-select
          :equip_no_props.sync="getParams.equip_no"
        />
      </el-form-item>
      <el-form-item label="胶料">
        <all-product-no-select
          @productBatchingChanged="productBatchingChanged"
        />
      </el-form-item>
      <el-form-item label="班次">
        <class-select @classSelected="classSelected" />
      </el-form-item>
      <el-form-item label="段次">
        <stage-select v-model="getParams.stage" />
      </el-form-item>
      <el-form-item label="综合检测结果">
        <el-select
          v-model="getParams.mes_result"
          placeholder="请选择"
          clearable
        >
          <el-option
            v-for="item in options"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="clickQuery">查询</el-button>
      </el-form-item>
      <br>
      <el-form-item>
        <el-button @click="filterFun">
          显示过滤界面
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          v-permission="['result_info','export']"
          @click="exportExcel"
        >
          导出
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import EquipSelect from '@/components/select_w/equip'
import ClassSelect from '@/components/ClassSelect'
import StageSelect from '@/components/StageSelect'
import allProductNoSelect from '@/components/select_w/allProductNoSelect'
// import { testTypes, materialTestOrders, testResultHistory } from '@/api/quick-check-detail'
// import elTableInfiniteScroll from 'el-table-infinite-scroll'
// import FileSaver from 'file-saver'
// import XLSX from 'xlsx'
export default {
  components: { EquipSelect, allProductNoSelect, ClassSelect, StageSelect },
  data() {
    return {
      getParams: {
        day_time: dayjs().format('YYYY-MM-DD'),
        equip_no: null,
        classes: null,
        product_no: null,
        stage: null,
        page: 1
      },
      options: ['一等品', '三等品']
    }
  },
  methods: {
    clickQuery() {
      this.$emit('clickQuery', this.getParams)
    },
    productBatchingChanged(val) {
      this.getParams.product_no = val ? val.material_no : null
    },
    classSelected(className) {
      this.getParams.classes = className || null
    },
    exportExcel() {
      this.$emit('exportExcel')
    },
    filterFun() {
      this.$emit('filterFun')
    }
  }
}
</script>

<style>

</style>
