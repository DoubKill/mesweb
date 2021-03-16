<template>
  <div v-loading="loading" class="rubber-plan-release">
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
      <!-- <el-form-item label="配料设备">
        <select-batching-equip v-model="getParams.equip" @change="changeList" />
      </el-form-item> -->
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
      ref="table"
      :data="tableData"
      border
      row-key="id"
      lazy
      :load="loadTableData"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column
        type="index"
        label="No"
        width="40"
      />
      <el-table-column
        label="工厂时间"
        prop="day_time"
        width="110px"
      />
      <el-table-column
        prop="classes_name"
        label="班次"
        min-width="10"
      />
      <el-table-column
        prop="weight_batch_no"
        label="小料配方编码"
        min-width="20"
      />
      <el-table-column
        prop="plan_batching_uid"
        label="计划编号"
        min-width="20"
      />
      <el-table-column
        prop="plan_batching_uid"
        label="配料方式"
        min-width="20"
        :formatter="(row, column) => {
          return true?'自动':'手动'
        }"
      />
      <!-- <el-table-column
        prop="weigh_type"
        label="料包类型"
        :formatter="weighTypeFun"
        min-width="20"
      /> -->
      <el-table-column
        label="配料设备"
        prop="equip_no"
        min-width="20"
      />
      <el-table-column
        prop="stage_product_batch_no"
        label="胶料编码"
        min-width="20"
      />
      <el-table-column
        prop="plan_package"
        label="计划数量(包)"
        min-width="17"
      >
        <template slot-scope="scope">
          <div v-if="!scope.row.isChildren" :class="{ 'b-r': scope.row.package_changed }">{{ scope.row.plan_package }}
            <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
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
            </el-tooltip>
          </div>
          <div v-else>
            {{ scope.row.plan_package }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="undistributed_package"
        label="剩余计划数量(包)"
        min-width="16"
        :formatter="(row, column) => {
          return row.undistributed_package?row.undistributed_package:0
        }"
      />
      <el-table-column
        prop="packages"
        label="已下达数量(包)"
        min-width="16"
        :formatter="(row, column) => {
          if(row.packages){
            return row.packages
          }
          if(row.plan_package){
            return row.plan_package+row.undistributed_package
          }
          return 0
        }"
      />
      <el-table-column
        prop=""
        label="默认机台"
        min-width="16"
      />
      <!-- <el-table-column
        prop="weigh_batching_used_type"
        label="小料配方状态"
        min-width="10"
      >
        <template slot-scope="scoped">
          <span :style="{'color':scoped.row.weigh_batching_used_type === 6?'red':''}">
            {{ usedTypeFormatter(scoped.row) }}
          </span>
        </template>
      </el-table-column> -->
      <el-table-column
        label="操作"
        width="70"
      >
        <template v-if="!scope.row.isChildren" slot-scope="scope">
          <el-button-group>
            <el-button size="mini" @click="view(scope.row,scope.$index)">明细</el-button>
          </el-button-group>
        </template>
      </el-table-column>
      <el-table-column
        label="下发"
        width="70"
      >
        <template v-if="!scope.row.isChildren" slot-scope="scope">
          <el-popover
            v-model="scope.row.visibleSend"
            placement="right"
            width="500"
            trigger="click"
          >
            <div>
              配料设备：<select-batching-equip v-model="scope.row.textEquipId" :multiple-is="true" :show="scope.row.visibleSend" :created-is="false" @changeFun="changeFun" /><br>
              <div v-for="(item,i) in equip_num_list" :key="i" style="display:inline-block;margin-top:6px">
                <span style="margin:0 6px">{{ item.equip_no }}</span>+
                <el-input
                  v-model="item.packages"
                  type="number"
                  style="width:80px"
                  controls-position="right"
                /> (包)
              </div>
            </div>
            <el-button
              slot="reference"
              v-permission="['batching_plan','send']"
              size="mini"
              :disabled="!sendInabled(scope.row)"
              @click="clickSend(scope.row)"
            >发送</el-button>
            <el-button style="float:right;margin-top:5px" size="mini" type="primary" @click="submitSendFun(scope.row,scope.$index)">确定</el-button>
            <el-button style="float:right;margin-top:5px;margin-right:5px" size="mini" @click="scope.row.visibleSend = false">取消</el-button>
          </el-popover>

          <!-- <el-button
            v-permission="['batching_plan','send']"
            :disabled="!sendInabled(scope.row)"
            size="mini"
            @click="showSendOut(scope.row,scope.$index)"
          >发送</el-button> -->
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        min-width="15"
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
        prop="send_username"
        label="下发人"
        min-width="20"
      />
      <el-table-column
        prop="send_time"
        label="下发时间"
        min-width="20"
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
      :before-close="handleClose"
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
        <el-form-item label="剩余数量(包)">
          <el-input :value="form.undistributed_package" disabled />
        </el-form-item>
        <span v-for="item1 in classeseEquipPlan" :key="item1.id" style="margin-right:18px">
          <span>{{ item1.equip_no }}设备 已配置：{{ item1.packages }}包</span>
        </span>
        <el-form-item label="配料设备" prop="equip">
          <select-batching-equip v-model="form.equip" :multiple-is="true" @changeFun="changeFun" /><br>
          <div v-for="(item,i) in equip_num_list" :key="i" style="display:inline-block;margin-top:6px">
            <span style="margin:0 6px">{{ item.equip_no }}</span>+
            <el-input
              v-model="item.packages"
              type="number"
              style="width:80px"
            /> (包)
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose(false)">取 消</el-button>
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
import { batchingClassesPlan, issueBatchingClassesPlan, batchingClassesEquipPlan, changePlanPackage } from '@/api/small-material-recipe'
// import { setDate } from '@/utils'
export default {
  components: { Page, classSelect, EquipCategorySelect, SelectBatchingEquip, WeighBatchingPlanDetail },
  data() {
    return {
      getParams: {
        page: 1,
        page_size: 10,
        // day_time: setDate(),
        day_time: '',
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
      reason: '',
      equip_num_list: [],
      classeseEquipPlan: [],
      maps: new Map(),
      formSend: {}
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
      console.log(this.reason, 888)
      await changePlanPackage(row.id,
        this.reason)
      this.getList()
    },
    weighTypeFun(row) {
      const str1 = row.weigh_type === 1 ? '硫磺包' : '细料包'
      const str2 = row.package_type === 1 ? '自动' : '手动'
      return str1 + '-' + str2
    },
    handleChangePlanPackage(row) {
      this.planPackageFormData = Object.assign({}, row)
      this.changePlanPackageVisible = true
      this.$nextTick(() => {
        this.$refs['planPackageForm'].clearValidate()
      })
    },
    sendInabled(row) {
      // 剩余包数 === 0
      if (row.weigh_batching_used_type === 4 && row.undistributed_package) {
        return true
      }
      return false
    },
    async getList() {
      this.loading = true
      try {
        const data = await batchingClassesPlan(this.getParams)
        this.tableData = data.results || []
        this.tableData.forEach(D => {
          D.hasChildren = true
          // D.textEquipObj = [
          //   { id: 16, equip_no: 'XLC01' },
          //   { id: 17, equip_no: 'XLC02' }
          // ]
          // D.textEquipId = [16, 17]
        })
        this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
        console.log(e)
      }
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
    clickSend(row) {
      row.textEquipId = []
      this.equip_num_list = []
      this.form = Object.assign({}, row)
      if (row.textEquipObj && row.textEquipObj.length !== 0) {
        row.textEquipObj.forEach((D, i) => {
          this.equip_num_list.push({
            equip_no: D.equip_no,
            equip: D.id,
            packages: i === 0 ? row.undistributed_package : ''
          })
        })
      }
    },
    submitSendFun(row, i) {
      this.sendOutFun(row, i)
    },
    async sendOut() {
      this.$refs['form'].validate(async valid => {
        if (valid) {
          this.sendOutFun()
        }
      })
    },
    async sendOutFun(row, i) {
      let allNum = 0
      let bool
      const equip_num_list = JSON.parse(JSON.stringify(this.equip_num_list))
      equip_num_list.map(D => {
        D.batching_class_plan = row.id
        D.equip = D.equip || D.id
        allNum += Number(D.packages)
        if (!Number(D.packages)) {
          bool = true
          return
        }
      })
      if (bool) {
        this.$message.info('未配置设备包数')
        bool = false
        return
      }
      if (allNum > row.undistributed_package) {
        this.$message.info('超过了计划包数')
        return
      }
      await issueBatchingClassesPlan(equip_num_list)
      this.handleClose(false)
      this.getList()
      this.tableData[i].visibleSend = false

      const { id } = this.form // 取出当前删除行的pid
      if (id && this.maps.get(id)) {
        const { tree, treeNode, resolve } = this.maps.get(id) // 根据pid取出对应的节点数据
        this.$set(this.$refs.table.store.states.lazyTreeNodeMap, id, []) // 将对应节点下的数据清空，从而实现数据的重新加载
        if (tree) {
          this.loadTableData(tree, treeNode, resolve)
        }
      }
    },
    showSendOut(row, index) {
      this.form = Object.assign({}, row)
      this.choiceDeviceDialogVisible = true
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
      })
      this.getHistoryList(row.id)
    },
    async getHistoryList(id) {
      try {
        const data = await batchingClassesEquipPlan({ batching_class_plan: id })
        this.classeseEquipPlan = data
        return data
      } catch (e) {
        console.log(e)
      }
    },
    view(row, index) {
      this.batchingClassesPlan = row
      this.dialogVisible = true
    },
    handleClose(done) {
      this.choiceDeviceDialogVisible = false
      this.equip_num_list.map(D => {
        D.packages = undefined
      })
      this.equip_num_list = []
      if (done) {
        done()
      }
    },
    async loadTableData(tree, treeNode, resolve) {
      this.maps.set(tree.id, { tree, treeNode, resolve })
      // 唯一标识
      const numId = 88888888
      const data = await this.getHistoryList(tree.id)
      data.forEach(D => {
        D.isChildren = true
        D.id = D.id + numId
        D.day_time = '--'
        D.classes_name = tree.classes_name
        D.undistributed_package = '--'
      })
      resolve(data)
    },
    changeFun(arr) {
      this.equip_num_list = arr
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

<style lang="scss">
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
  margin: 0;
}
.rubber-plan-release{
  .b-r {
    display:inline-block;
    background: red;
    color: white;
    width:100%;
    padding-left:4px;
  }
  .discardClass{
    color:red !important;
  }
    .slotIconStyle{
    font-size: 25px;
    display: inline-block;
    /* height: 25px; */
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
    margin: 0;
  }
}
</style>
