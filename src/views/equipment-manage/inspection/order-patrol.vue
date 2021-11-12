<template>
  <div>
    <!-- 接单巡检工单 -->
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
      <el-form-item label="指派人">
        <el-input
          v-model="search.assign_user"
          clearable
          style="width:200px"
          @input="debounceList"
        />
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
        <el-button type="primary" @click="order">接单</el-button>
        <el-button type="primary" @click="back">退单</el-button>
        <el-button type="primary" @click="close">关闭</el-button>
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
        width="140"
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
        width="120"
      />
      <el-table-column
        prop="equip_repair_standard_name"
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
        width="120"
      />
      <el-table-column
        prop="equip_condition"
        label="设备条件"
        min-width="20"
      />
      <el-table-column
        prop="importance_level"
        label="重要程度"
        min-width="20"
      />
      <el-table-column
        prop="status"
        label="状态"
        min-width="20"
      />
      <el-table-column
        prop="assign_user"
        label="指派人"
        min-width="20"
      />
      <el-table-column
        prop="assign_datetime"
        label="指派时间"
        min-width="20"
      />
      <el-table-column
        prop="assign_to_user"
        label="被指派人"
        min-width="20"
      />
      <el-table-column
        prop="created_username"
        label="报修人"
        min-width="20"
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
      title="报修详情"
      :visible.sync="dialogVisibleRepair"
      width="30%"
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
      width="70%"
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
      width="70%"
    >
      <maintain
        :type-form="typeForm1"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseMaintain">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import page from '@/components/page'
import { mapGetters } from 'vuex'
import { equipApplyOrder, multiUpdate, equipApplyRepair, equipRepairStandard, equipMaintenanceStandard } from '@/api/jqy'
import { debounce } from '@/utils'
import definition from '../components/definition-dialog'
import maintain from '../components/definition-dialog1'
import repair from '../components/repair-dialog'
import EquipSelect from '@/components/EquipSelect/index'
export default {
  name: 'OrderPatrol',
  components: { EquipSelect, page, repair, definition, maintain },
  data() {
    return {
      search: { status: '已指派' },
      loading: false,
      btnExportLoad: false,
      dialogVisibleRepair: false,
      dialogVisibleDefinition: false,
      dialogVisibleMaintain: false,
      dateValue: [],
      tableData: [],
      total: 0,
      checkList: [],
      multipleSelection: [],
      submit: false,
      ruleForm: {},
      typeForm: {},
      typeForm1: {},
      creatOrder: {}
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    this.search.assign_to_user = this.name
    this.getList()
  },
  methods: {
    debounceList() {
      debounce(this, 'changeSearch')
    },
    changeDate(date) {
      this.search.planned_repair_date_after = date ? date[0] : ''
      this.search.planned_repair_date_before = date ? date[1] : ''
      this.changeSearch()
    },
    order() {
      if (this.multipleSelection.length > 0) {
        if (this.multipleSelection.every(d => d.status === '已指派')) {
          const obj = []
          this.multipleSelection.forEach(d => {
            obj.push(d.id)
          })
          this.$confirm('此操作将接单是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            multiUpdate('post', null, { data: { pks: obj, status: '已接单', opera_type: '接单' }})
              .then(response => {
                this.$message({
                  type: 'success',
                  message: '接单成功'
                })
                this.$refs.multipleTable.clearSelection()
                this.getList()
              })
          })
        } else {
          this.$message.info('请勾选已指派状态列表')
        }
      } else {
        this.$message.info('请先勾选工单列表')
      }
    },
    back() {
      if (this.multipleSelection.length > 0) {
        if (this.multipleSelection.every(d => d.status === '已指派')) {
          const obj = []
          this.multipleSelection.forEach(d => {
            obj.push(d.id)
          })
          this.$confirm('此操作将退单是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            multiUpdate('post', null, { data: { pks: obj, status: '已生成', opera_type: '退单' }})
              .then(response => {
                this.$message({
                  type: 'success',
                  message: '退单成功'
                })
                this.$refs.multipleTable.clearSelection()
                this.getList()
              })
          })
        } else {
          this.$message.info('请勾选已接单状态列表')
        }
      } else {
        this.$message.info('请先勾选工单列表')
      }
    },
    async close() {
      if (this.multipleSelection.length > 0) {
        if (this.multipleSelection.every(d => d.status === '已指派')) {
          const obj = []
          this.multipleSelection.forEach(d => {
            obj.push(d.id)
          })
          this.$confirm('此操作将关闭工单是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            multiUpdate('post', null, { data: { pks: obj, status: '已关闭', opera_type: '关闭' }})
              .then(response => {
                this.$message({
                  type: 'success',
                  message: '关闭成功'
                })
                this.$refs.multipleTable.clearSelection()
                this.getList()
              })
          })
        } else {
          this.$message.info('请勾选已指派状态列表')
        }
      } else {
        this.$message.info('请先勾选工单列表')
      }
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
    changeSearch() {
      this.search.page = 1
      this.getList()
    },
    equipSelected(obj) {
      this.$set(this.search, 'equip_no', obj ? obj.equip_no : '')
      this.changeSearch()
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
