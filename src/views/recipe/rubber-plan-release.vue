<template>
  <div v-loading="loading">
    <!-- 小料计划下达 -->
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
        <selectBatchingEquip @selectChanged="selectBatchEquip" />
      </el-form-item>
      <el-form-item label="状态">
        <el-input v-model="formInline.state" placeholder="请输入状态" />
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
        label="工厂时间"
      />
      <el-table-column
        prop="name"
        label="班次"
      />
      <el-table-column
        prop="address"
        label="小料配方编码"
      />
      <el-table-column
        prop="date"
        label="生产机型"
      />
      <el-table-column
        prop="name"
        label="配料设备"
      />
      <el-table-column
        prop="address"
        label="胶料编码"
      />
      <el-table-column
        prop="date"
        label="计划数量"
      />
      <el-table-column
        prop="name"
        label="明细查看"
      >
        <template slot-scope="scope">
          <el-button @click="view(scope.row,scope.$index)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="下发"
      >
        <template slot-scope="scope">
          <el-button @click="sendOut(scope.row,scope.$index)">发送</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="date"
        label="状态"
      />
      <el-table-column
        prop="name"
        label="下发人"
      />
      <el-table-column
        prop="address"
        label="下发时间"
      />
    </el-table>
  </div>
</template>

<script>
import classSelect from '@/components/ClassSelect'
import selectModel from './components/select-model'
import selectBatchingEquip from './components/select-batching-equip'
export default {
  components: { classSelect, selectModel, selectBatchingEquip },
  data() {
    return {
      formInline: {},
      loading: false,
      tableData: []
    }
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
