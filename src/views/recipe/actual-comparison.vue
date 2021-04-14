<template>
  <div v-loading="loading">
    <!-- 小料称量计划与实际对比 -->
    <el-form :inline="true" :model="formInline">
      <el-form-item label="时间">
        <el-date-picker
          v-model="formInline.data"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>
      <el-form-item label="生产机型">
        <selectModel @selectChanged="selectModel" />
      </el-form-item>
      <el-form-item label="小料配方编码">
        <el-input v-model="formInline.input" placeholder="请输入小料配方编码" />
      </el-form-item>
      <br>
      <el-form-item label="班次">
        <class-select
          @classSelected="classChanged"
        />
      </el-form-item>
      <el-form-item label="配料设备">
        <selectBatchingEquip v-model="formInline.equip" @selectChanged="selectBatchEquip" />
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      style="width: 100%"
      border
    >
      <el-table-column
        type="index"
        label="No"
        width="40"
      />
      <el-table-column
        prop="date"
        label="小料配方编码"
      />
      <el-table-column
        prop="name"
        label="生产机型"
      />
      <el-table-column
        prop="address"
        label="配料设备"
      />
      <el-table-column
        prop="date"
        label="药品分类"
      />
      <el-table-column
        prop="name"
        label="日计算数量"
      />
      <el-table-column
        prop="address"
        label="日实际数量"
      />
      <el-table-column
        prop="date"
        label="完成率进度条"
      />
      <el-table-column
        v-for="item in classHeard"
        :key="item.id"
        :label="item.global_name"
        align="center"
      >
        <el-table-column
          prop="name"
          label="计划量"
        />
        <el-table-column
          prop="name"
          label="实际量"
        />
      </el-table-column>
      <el-table-column
        prop="name"
        label="密炼设备"
      />
    </el-table>
  </div>
</template>

<script>
import classSelect from '@/components/ClassSelect'
import selectModel from './components/select-model'
import selectBatchingEquip from './components/select-batching-equip'
import { class_arrange_url } from '@/api/display_static_fun'

export default {
  components: { classSelect, selectModel, selectBatchingEquip },
  data() {
    return {
      formInline: {},
      loading: false,
      tableData: [],
      classHeard: []
    }
  },
  created() {
    this.class_arrange_list()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        // const data = await materialsUrl('get', null, { params: { all: 1 }})
        // this.options = data.results || []
        // this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    async class_arrange_list() {
      try {
        const class_arrange_list = await class_arrange_url('get')
        this.classHeard = class_arrange_list.results
      } catch (e) { throw new Error(e) }
    },
    classChanged(val) {
      this.formInline.class = val
    },
    selectModel(val) {
      console.log(val, 555)
    },
    selectBatchEquip(val) {
    },
    sendOut(row, index) {},
    view(row, index) {}
  }
}
</script>

<style>

</style>
