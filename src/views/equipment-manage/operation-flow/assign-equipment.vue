<template>
  <div>
    <!-- 指派维修工单 -->
    <el-form :inline="true">
      <el-form-item label="计划/报修日期">
        <el-date-picker
          v-model="dateValue"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="changeDate"
        />
      </el-form-item>
      <el-form-item label="计划/报修名称">
        <el-input
          v-model="search.plan_name"
          clearable
          style="width:200px"
          @input="debounceList"
        />
      </el-form-item>
      <el-form-item label="机台">
        <equip-select
          @equipSelected="equipSelected"
        />
      </el-form-item>
      <!-- <el-form-item label="维修标准">
        <el-input
          v-model="search.equip_repair_standard"
          clearable
          style="width:200px"
          @input="debounceList"
        />
      </el-form-item> -->
      <el-form-item label="设备条件">
        <el-select
          v-model="search.equip_condition"
          placeholder="请选择"
          clearable
          @change="changeSearch"
        >
          <el-option
            v-for="item in ['停机', '不停机']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="重要程度">
        <el-select
          v-model="search.importance_level"
          placeholder="请选择"
          clearable
          @change="changeSearch"
        >
          <el-option
            v-for="item in ['高', '中', '低']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="报修人">
        <el-input
          v-model="search.created_user"
          clearable
          style="width:200px"
          @input="debounceList"
        />
      </el-form-item>

      <el-form-item>
        <el-button v-permission="['equip_apply_order', 'assign']" type="primary" @click="dialog">指派</el-button>
        <el-button v-permission="['equip_apply_order', 'close']" type="primary" @click="closeDialog">关闭</el-button>
        <!-- <el-button type="primary">导出Excel</el-button> -->
      </el-form-item>
    </el-form>
    <el-table
      ref="multipleTable"
      v-loading="loading"
      :data="tableData"
      row-key="id"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="40"
        :reserve-selection="true"
      />
      <el-table-column
        prop="plan_id"
        label="计划/报修编号"
        min-width="20"
      />
      <el-table-column
        prop="plan_name"
        label="计划/报修名称"
        width="180"
      />
      <el-table-column
        prop="work_order_no"
        label="工单编号"
        width="180"
      />
      <el-table-column
        prop="equip_no"
        label="机台"
        width="60"
      />
      <el-table-column
        prop="part_name"
        label="部位名称"
        min-width="20"
      />
      <el-table-column
        label="维修标准/故障原因"
        width="140"
      >
        <template slot-scope="scope">
          <el-link
            v-if="scope.row.equip_maintenance_standard_name"
            type="primary"
            @click="repairDialog(scope.row)"
          >{{ scope.row.equip_maintenance_standard_name }}</el-link>
          <el-link
            v-if="scope.row.equip_repair_standard_name"
            type="primary"
            @click="repairDialog(scope.row)"
          >{{ scope.row.equip_repair_standard_name }}</el-link>
          <el-link
            v-else
            type="primary"
            @click="repairDialog(scope.row)"
          >{{ scope.row.result_fault_cause_name }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="planned_repair_date"
        label="计划维修日期"
        min-width="20"
      />
      <el-table-column
        prop="equip_condition"
        label="设备条件"
        width="70"
      />
      <el-table-column
        prop="importance_level"
        label="重要程度"
        width="70"
      />
      <el-table-column
        prop="status"
        label="状态"
        width="70"
      />
      <el-table-column
        prop="created_username"
        label="报修人"
        width="70"
      />
      <el-table-column
        prop="created_date"
        label="报修时间"
        min-width="20"
      />
    </el-table>
    <page
      :old-page="false"
      :total="total"
      :current-page="search.page"
      @currentChange="currentChange"
    />
    <el-dialog
      title="指派工单"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-form v-loading="loadPerson" :inline="true" label-width="120px">
        <el-form-item style="" prop="checkList">
          <span v-if="bz">作业标准人数：{{ bz }}</span>
          <el-checkbox-group v-model="checkList">
            <template v-for="(item, index) in staffList">
              <el-checkbox :key="index" :label="item.username" :disabled="!item.optional" />
            </template>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose(false)">取 消</el-button>
        <el-button :loading="submit" type="primary" @click="generateFun">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="报修详情"
      :visible.sync="dialogVisibleRepair"
      width="600"
    >
      <repair
        :rule-form="ruleForm"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseRepair">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="维修作业标准详情"
      :visible.sync="dialogVisibleDefinition"
      width="80%"
    >
      <definition
        :type-form="typeForm"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseDefinition">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="维护作业标准详情"
      :visible.sync="dialogVisibleMaintain"
      width="80%"
    >
      <maintain
        :type-form="typeForm1"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseMaintain">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="关闭工单原因填写"
      :visible.sync="dialogVisibleClose"
      width="30%"
    >
      <el-form :inline="true" label-width="120px">
        <el-form-item label="关闭工单原因:">
          <el-input
            v-model="desc"
            style="width:300px"
            type="textarea"
            :rows="4"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleClose=false">取 消</el-button>
        <el-button :loading="closeLoad" type="primary" @click="close">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import page from '@/components/page'
import { equipApplyOrder, multiUpdate, getStaff, equipApplyRepair, equipRepairStandard, equipMaintenanceStandard } from '@/api/jqy'
import { debounce } from '@/utils'
import definition from '../components/definition-dialog'
import maintain from '../components/definition-dialog1'
import repair from '../components/repair-dialog'
import EquipSelect from '@/components/EquipSelect/index'
export default {
  name: 'AssignEquipment',
  components: { EquipSelect, page, repair, definition, maintain },
  data() {
    return {
      search: { status: '已生成' },
      bz: '',
      loading: false,
      btnExportLoad: false,
      closeLoad: false,
      dialogVisibleRepair: false,
      dialogVisibleDefinition: false,
      dialogVisibleMaintain: false,
      dialogVisibleClose: false,
      desc: null,
      dateValue: [],
      loadPerson: false,
      tableData: [],
      total: 0,
      staffList: [],
      checkList: [],
      multipleSelection: [],
      dialogVisible: false,
      submit: false,
      ruleForm: {},
      typeForm: {},
      typeForm1: {},
      creatOrder: {}
    }
  },
  created() {
    this.getList()
    // this.getStaff()
  },
  methods: {
    debounceList() {
      debounce(this, 'changeSearch')
    },
    closeDialog() {
      if (this.multipleSelection.length > 0) {
        this.desc = null
        this.dialogVisibleClose = true
      } else {
        this.$message('请先勾选工单')
      }
    },
    // async getStaff() {
    //   try {
    //     const data = await getStaff('get', null, { params: {}})
    //     this.staffList = data.results || []
    //   } catch (e) {
    //     //
    //   }
    // },
    async generateFun() {
      const obj = []
      this.multipleSelection.forEach(d => {
        obj.push(d.id)
      })
      if (this.checkList.length > 0) {
        try {
          this.submit = true
          await multiUpdate('post', null, { data: { pks: obj, assign_to_user: this.checkList, status: '已指派', opera_type: '指派' }})
          this.$message.success('指派成功')
          this.submit = false
          this.dialogVisible = false
          this.$refs.multipleTable.clearSelection()
          this.getList()
        } catch (e) {
          this.submit = false
          this.dialogVisible = true
        }
      } else {
        this.$message.info('请选择指派人员')
      }
    },
    async close() {
      if (this.multipleSelection.length > 0) {
        if (this.multipleSelection.every(d => d.status === '已生成')) {
          const obj = []
          this.multipleSelection.forEach(d => {
            obj.push(d.id)
          })
          this.$confirm('此操作将关闭工单是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.closeLoad = true
            multiUpdate('post', null, { data: { close_reason: this.desc, pks: obj, status: '已关闭', opera_type: '关闭' }})
              .then(response => {
                this.$message({
                  type: 'success',
                  message: '关闭成功'
                })
                this.closeLoad = false
                this.dialogVisibleClose = false
                this.$refs.multipleTable.clearSelection()
                this.getList()
              })
              .catch(response => {
                this.closeLoad = false
              })
          })
        } else {
          this.$message.info('请勾选已生成状态列表')
        }
      } else {
        this.$message.info('请先勾选工单列表')
      }
    },
    changeDate(date) {
      this.search.planned_repair_date_after = date ? date[0] : ''
      this.search.planned_repair_date_before = date ? date[1] : ''
      this.changeSearch()
    },
    async repairDialog(row) {
      if (row.equip_repair_standard_name) {
        try {
          const data = await equipRepairStandard('get', null, { params: { id: row.equip_repair_standard }})
          this.typeForm = data.results[0]
        } catch (e) {
          // this.dialogVisible = true
        }
        this.dialogVisibleDefinition = true
      } else if (row.equip_maintenance_standard_name) {
        try {
          const data = await equipMaintenanceStandard('get', null, { params: { id: row.equip_maintenance_standard }})
          this.typeForm1 = data.results[0]
        } catch (e) {
          // this.dialogVisible = true
        }
        this.dialogVisibleMaintain = true
      } else if (row.result_fault_cause_name) {
        try {
          const data = await equipApplyRepair('get', null, { params: { plan_id: row.plan_id }})
          this.ruleForm = data.results[0]
        } catch (e) {
        // this.dialogVisible = true
        }
        this.dialogVisibleRepair = true
      }
    },
    handleCloseRepair() {
      this.dialogVisibleRepair = false
    },
    handleCloseDefinition() {
      this.dialogVisibleDefinition = false
    },
    handleCloseMaintain() {
      this.dialogVisibleMaintain = false
    },
    async getList() {
      try {
        this.loading = true
        const data = await equipApplyOrder('get', null, { params: this.search })
        this.tableData = data.results || []
        this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    changeSearch() {
      this.search.page = 1
      this.getList()
    },
    equipSelected(obj) {
      this.$set(this.search, 'equip_no', obj ? obj.equip_no : '')
      this.changeSearch()
    },
    async dialog() {
      this.bz = null
      if (this.multipleSelection.length > 0) {
        if (this.multipleSelection.length === 1) {
          this.bz = this.multipleSelection[0].work_persons
        }
        if (this.multipleSelection.every(d => d.status === '已生成')) {
          this.dialogVisible = true
          this.loadPerson = true
          const data = await getStaff('get', null, { params: { have_classes: 1 }})
          this.staffList = data.results || []
          this.checkList = []
          this.loadPerson = false
        } else {
          this.$message.info('请勾选已生成状态列表')
        }
      } else {
        this.$message.info('请先勾选工单列表')
      }
    },
    handleClose(done) {
      this.dialogVisible = false
      if (done) {
        done()
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    currentChange(page, page_size) {
      this.search.page = page
      this.search.page_size = page_size
      this.getList()
    }
  }
}
</script>

<style>

</style>
