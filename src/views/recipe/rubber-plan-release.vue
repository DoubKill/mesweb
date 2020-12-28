<template>
  <div v-loading="loading">
    <!-- 小料计划下达 -->
    <el-form :inline="true">
      <el-form-item label="时间">
        <el-date-picker
          v-model="getParams.day_time"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
          @change="getList"
        />
      </el-form-item>
      <el-form-item label="生产机型">
        <equip-category-select
          v-model="getParams.dev_type"
          @change="getList"
        />
      </el-form-item>
      <el-form-item label="小料配方编码">
        <el-input
          v-model="getParams.weight_batch_no"
          placeholder="请输入小料配方编码"
          @input="getList"
        />
      </el-form-item>
      <br>
      <el-form-item label="班次">
        <class-select
          @classSelected="classChanged"
        />
      </el-form-item>
      <el-form-item label="配料设备">
        <select-batching-equip v-model="getParams.equip" @change="getList" />
      </el-form-item>
      <el-form-item label="状态">
        <el-select
          v-model="getParams.status"
          clearable
          @change="getList"
        >
          <el-option
            v-for="(item, index) in [[1, '未下发'], [2, '已下发']]"
            :key="index"
            :label="item[1]"
            :value="item[0]"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      style="width: 100%"
      fit
      border
    >
      <el-table-column
        type="index"
        label="No"
        width="40"
        align="center"
      />
      <el-table-column
        label="工厂时间"
        prop="day_time"
        align="center"
        width="90"
      />
      <el-table-column
        prop="classes_name"
        label="班次"
        align="center"
        width="45"
      />
      <el-table-column
        prop="weight_batch_no"
        label="小料配方编码"
        align="center"
        width="165"
      />
      <el-table-column
        prop="category_name"
        label="生产机型"
        align="center"
      />
      <el-table-column
        label="配料设备"
        align="center"
        prop="equip_name"
      />
      />
      <el-table-column
        prop="stage_product_batch_no"
        label="胶料编码"
        align="center"
        width="130"
      />
      />
      <el-table-column
        prop="plan_package"
        label="计划数量"
        align="center"
      />
      <el-table-column
        prop="weigh_batching_used_type"
        label="小料配方状态"
        width="100"
        :formatter="usedTypeFormatter"
        align="center"
      />
      <el-table-column
        label="明细查看"
        align="center"
        width="70"
      >
        <template slot-scope="scope">
          <el-button size="mini" @click="view(scope.row,scope.$index)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="下发"
        align="center"
        width="70"
      >
        <template slot-scope="scope">
          <el-button :disabled="scope.row.status!==1||scope.row.weigh_batching_used_type !== 4" size="mini" @click="showSendOut(scope.row,scope.$index)">发送</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        width="70"
        align="center"
        :formatter="(row, column) => {
          switch(row.status) {
          case 1:
            return '未下发'
          case 2:
            return '已下发'
          }
        }"
      />
      <el-table-column
        prop="send_user"
        label="下发人"
        align="center"
      />
      <el-table-column
        prop="send_time"
        label="下发时间"
        align="center"
      />
    </el-table>
    <el-dialog
      title="小料计划明细"
      width="90%"
      :visible.sync="dialogVisible"
    >
      <weigh-batching-plan-detail
        :batching-classes-plan="batchingClassesPlan"
      />
    </el-dialog>
    <el-dialog
      title="配料设备选择"
      :visible.sync="choiceDeviceDialogVisible"
    >
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="小料配方编码">
          <el-input :value="form.weight_batch_no" disabled />
        </el-form-item>
        <el-form-item label="胶料编码">
          <el-input :value="form.stage_product_batch_no" disabled />
        </el-form-item>
        <el-form-item label="生产机型">
          <el-input :value="form.category_name" disabled />
        </el-form-item>
        <el-form-item label="计划数量">
          <el-input :value="form.plan_package" disabled />
        </el-form-item>
        <el-form-item label="配料设备" prop="equip">
          <select-batching-equip v-model="form.equip" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="choiceDeviceDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sendOut">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import classSelect from '@/components/ClassSelect'
import EquipCategorySelect from '@/components/EquipCategorySelect'
import SelectBatchingEquip from './components/select-batching-equip'
import WeighBatchingPlanDetail from './components/weigh_batching_plan_detail'

import { batchingClassesPlan, issueBatchingClassesPlan } from '@/api/small-material-recipe'

export default {
  components: { classSelect, EquipCategorySelect, SelectBatchingEquip, WeighBatchingPlanDetail },
  data() {
    return {
      getParams: {
        day_time: null,
        dev_type: null,
        weight_batch_no: '',
        classes_name: '',
        status: '',
        equip: null
      },
      loading: false,
      tableData: [],
      dialogVisible: false,
      batchingClassesPlan: {},
      choiceDeviceDialogVisible: false,
      // batchingEquip: null
      form: {
        weight_batch_no: '',
        stage_product_batch_no: '',
        category_name: '',
        plan_package: '',
        equip: null
      },
      rules: {
        equip: [{ required: true, message: '该字段不能为空', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.loading = true
      const data = await batchingClassesPlan(this.getParams)
      this.tableData = data.results || []
      this.loading = false
    },
    classChanged(val) {
      this.getParams.classes_name = val
      this.getList()
    },
    selectBatchEquip(val) {
      this.getParams.equip = val ? val.id : null
      this.getList()
    },
    async sendOut() {
      this.$refs['form'].validate(async valid => {
        if (valid) {
          await issueBatchingClassesPlan(this.form.id, this.form.equip)
          this.getList()
          this.choiceDeviceDialogVisible = false
        }
      })
    },
    showSendOut(row, index) {
      this.form = Object.assign({}, row)
      this.choiceDeviceDialogVisible = true
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
      })
    },
    view(row, index) {
      this.batchingClassesPlan = row
      this.dialogVisible = true
    },
    usedTypeFormatter(row, column) {
      switch (row.weigh_batching_used_type) {
        case 1:
          return '编辑'
        case 2:
          return '提交'
        case 3:
          return '校对'
        case 4:
          return '启用'
        case 5:
          return '驳回'
        case 6:
          return '废弃'
      }
    }
  }
}
</script>

<style>

</style>
