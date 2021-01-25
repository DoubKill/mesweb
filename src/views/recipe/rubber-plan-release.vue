<template>
  <div v-loading="loading">
    <!-- 小料计划下达 -->
    <el-form :inline="true">
      <el-form-item label="日期">
        <el-date-picker
          v-model="getParams.day_time"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
          @change="changeList"
        />
      </el-form-item>
      <el-form-item label="生产机型">
        <equip-category-select
          v-model="getParams.dev_type"
          @change="changeList"
        />
      </el-form-item>
      <el-form-item label="小料配方编码">
        <el-input
          v-model="getParams.weight_batch_no"
          placeholder="请输入小料配方编码"
          @input="changeList"
        />
      </el-form-item>
      <br>
      <el-form-item label="班次">
        <class-select
          @classSelected="classChanged"
        />
      </el-form-item>
      <el-form-item label="配料设备">
        <select-batching-equip v-model="getParams.equip" @change="changeList" />
      </el-form-item>
      <el-form-item label="状态">
        <el-select
          v-model="getParams.status"
          clearable
          @change="changeList"
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
        prop="weigh_type"
        label="料包类型"
        :formatter="weighTypeFun"
        align="center"
      />
      <el-table-column
        label="配料设备"
        align="center"
        prop="equip_no"
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
        label="计划数量(包)"
        align="center"
      >
        <template slot-scope="scope">
          <span :class="{ 'b-r': scope.row.package_changed }">{{ scope.row.plan_package }}</span>

          <el-popover
            v-model="scope.row.visible"
            placement="right"
            width="400"
            trigger="manual"
          >
            <el-input
              v-model="reason"
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
            />
            <i slot="reference" class="el-icon-edit slotIconStyle" @click="iconEdit(scope.row,scope.$index)" />
            <el-button style="float:right;margin-top:5px" size="mini" @click="submitFun(scope.row,scope.$index)">确定</el-button>
            <el-button style="float:right;margin-top:5px;margin-right:5px" size="mini" @click="scope.row.visible = false">取消</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        prop="weigh_batching_used_type"
        label="小料配方状态"
        width="100"
        align="center"
      >
        <template slot-scope="scoped">
          <span :style="{'color':scoped.row.weigh_batching_used_type === 6?'red':''}">
            {{ usedTypeFormatter(scoped.row) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
      >
        <template slot-scope="scope">
          <el-button-group>
            <el-button size="mini" @click="view(scope.row,scope.$index)">明细</el-button>
            <!-- <el-button
              v-permission="['batching_plan','change']"
              size="mini"
              @click="handleChangePlanPackage(scope.row)"
            >修改</el-button> -->
          </el-button-group>
        </template>
      </el-table-column>
      <el-table-column
        label="下发"
        align="center"
        width="70"
      >
        <template slot-scope="scope">
          <el-button
            v-permission="['batching_plan','send']"
            :disabled="!sendInabled(scope.row)"
            size="mini"
            @click="showSendOut(scope.row,scope.$index)"
          >发送</el-button>
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
    <page
      :old-page="false"
      :total="total"
      :current-page="getParams.page"
      @currentChange="currentChange"
    />

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
        <el-form-item label="计划数量(包)">
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
    <el-dialog
      title="修改计划数量"
      :visible.sync="changePlanPackageVisible"
    >
      <el-form ref="planPackageForm" :model="planPackageFormData" :rules="planPackageFormRules" label-position="left" label-width="110px">
        <el-form-item label="计划数量(包)" prop="plan_package">
          <el-input v-model.number="planPackageFormData.plan_package" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="changePlanPackageVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updatePlanPackage">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import classSelect from '@/components/ClassSelect'
import EquipCategorySelect from '@/components/EquipCategorySelect'
import SelectBatchingEquip from './components/select-batching-equip'
import WeighBatchingPlanDetail from './components/weigh_batching_plan_detail'
import Page from '@/components/page'
import { batchingClassesPlan, issueBatchingClassesPlan, changePlanPackage } from '@/api/small-material-recipe'
import { setDate } from '@/utils'
export default {
  components: { Page, classSelect, EquipCategorySelect, SelectBatchingEquip, WeighBatchingPlanDetail },
  data() {
    return {
      getParams: {
        page: 1,
        page_size: 10,
        day_time: setDate(),
        dev_type: null,
        weight_batch_no: '',
        classes_name: '',
        status: '',
        equip: null
      },
      total: 0,
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
      },
      changePlanPackageVisible: false,
      planPackageFormData: {
        plan_package: null
      },
      planPackageFormRules: {
        plan_package: [{ required: true, message: '该字段不能为空', trigger: 'blur' }]
      },
      reason: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async updatePlanPackage() {
      this.$refs['planPackageForm'].validate(async valid => {
        if (valid) {
          this.changePlanPackageVisible = false
          await changePlanPackage(this.planPackageFormData.id,
            this.planPackageFormData.plan_package)
          this.getList()
        }
      })
    },
    iconEdit(row, index) {
      this.tableData.forEach((D) => {
        D.visible = false
      })
      row.visible = true
      this.reason = row.plan_package
    },
    async submitFun(row, index) {
      row.visible = false
      await changePlanPackage(row.id,
        this.reason)
      this.getList()
    },
    weighTypeFun(row) {
      switch (row.weigh_type) {
        case 1:
          return 'a类'
        case 2:
          return 'b类'
        case 3:
          return '硫磺'
      }
    },
    handleChangePlanPackage(row) {
      this.planPackageFormData = Object.assign({}, row)
      this.changePlanPackageVisible = true
      this.$nextTick(() => {
        this.$refs['planPackageForm'].clearValidate()
      })
    },
    sendInabled(row) {
      if (row.weigh_batching_used_type === 4 &&
         (row.status === 1 || (row.status === 2 && row.package_changed))) {
        return true
      }
      return false
    },
    async getList() {
      this.loading = true
      const data = await batchingClassesPlan(this.getParams)
      this.tableData = data.results || []
      this.total = data.count
      this.loading = false
    },
    classChanged(val) {
      this.getParams.classes_name = val
      this.getParams.page = 1
      this.getList()
    },
    selectBatchEquip(val) {
      this.getParams.page = 1
      this.getParams.equip = val ? val.id : null
      this.getList()
    },
    changeList() {
      this.getParams.page = 1
      this.getList()
    },
    currentChange(page, page_size) {
      this.getParams.page = page
      this.getParams.page_size = page_size
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
    usedTypeFormatter(row) {
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
  .b-r {
    display:inline-block;
    background: red;
    color: white;
    width:73%;
  }
  .discardClass{
    color:red !important;
  }
    .slotIconStyle{
    color: rgb(11, 189, 11);
    font-size: 20px;
    display: inline-block;
    height: 25px;
  }
</style>
