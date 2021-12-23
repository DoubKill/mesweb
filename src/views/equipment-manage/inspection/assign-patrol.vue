<template>
  <div>
    <!-- 指派巡检工单 -->
    <el-form :inline="true">
      <el-form-item label="计划巡检日期">
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
      <el-form-item label="计划名称">
        <el-input
          v-model="search.plan_name"
          style="width:200px"
          clearable
          @input="changeDebounce"
        />
      </el-form-item>
      <el-form-item label="机台">
        <equip-select
          style="width:100px"
          @equipSelected="equipSelected"
        />
      </el-form-item>
      <el-form-item label="巡检标准">
        <el-input
          v-model="search.equip_repair_standard"
          style="width:150px"
          clearable
          @input="changeDebounce"
        />
      </el-form-item>
      <el-form-item label="设备条件">
        <el-select
          v-model="search.equip_condition"
          placeholder="请选择"
          style="width:100px"
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
          style="width:100px"
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

      <el-form-item>
        <el-button v-permission="['equip_inspection_order','assign']" type="primary" @click="dialogAssign">指派</el-button>
        <el-button v-permission="['equip_inspection_order','close']" type="primary" @click="closeDialog">关闭</el-button>
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
        label="计划编号"
        min-width="20"
      />
      <el-table-column
        prop="plan_name"
        label="计划名称"
        min-width="20"
      />
      <el-table-column
        prop="inspection_line_no"
        label="序号"
        min-width="20"
      />
      <el-table-column
        prop="area_name"
        label="区域"
        min-width="20"
      />
      <el-table-column
        prop="work_order_no"
        label="工单编号"
        min-width="20"
      />
      <el-table-column
        prop="equip_no"
        label="机台"
        min-width="20"
      />
      <el-table-column
        prop="equip_repair_standard_name"
        label="巡检标准"
        min-width="20"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
            @click="repairDialog(scope.row)"
          >{{ scope.row.equip_repair_standard_name }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="planned_repair_date"
        label="计划巡检日期"
        min-width="20"
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
        prop="created_username"
        label="录入人"
        min-width="20"
      />
      <el-table-column
        prop="created_date"
        label="录入时间"
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
        <el-button :loading="submit1" type="primary" @click="close">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="巡检作业标准详情"
      :visible.sync="dialogVisibleMaintain"
      width="80%"
    >
      <maintain
        :show="dialogVisibleMaintain"
        :type-form="typeForm1"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleMaintain=false">取 消</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { debounce } from '@/utils'
import page from '@/components/page'
import maintain from '../components/definition-dialog2'
import { equipInspectionOrder, multiUpdateInspection, getStaff, equipMaintenanceStandard } from '@/api/jqy'
import EquipSelect from '@/components/EquipSelect/index'
export default {
  name: 'AssignPatrol',
  components: { EquipSelect, page, maintain },
  data() {
    return {
      search: {
        status: '已生成',
        page: 1,
        page_size: 10
      },
      dateValue: [],
      dialogVisibleMaintain: false,
      loadPerson: false,
      bz: '',
      typeForm1: {},
      tableData: [],
      staffList: [],
      total: 0,
      loading: false,
      checkList: [],
      multipleSelection: [],
      dialogVisible: false,
      dialogVisibleClose: false,
      desc: null,
      submit: false,
      submit1: false,
      creatOrder: {}
    }
  },
  created() {
    this.getList()
  },
  methods: {
    closeDialog() {
      if (this.multipleSelection.length > 0) {
        this.desc = null
        this.dialogVisibleClose = true
      } else {
        this.$message('请先勾选工单')
      }
    },
    async repairDialog(row) {
      try {
        const data = await equipMaintenanceStandard('get', null, { params: { id: row.equip_repair_standard }})
        this.typeForm1 = data.results[0]
        this.dialogVisibleMaintain = true
      } catch (e) {
        // this.dialogVisible = true
      }
    },
    async generateFun() {
      const obj = []
      this.multipleSelection.forEach(d => {
        obj.push(d.id)
      })
      if (this.checkList.length > 0) {
        try {
          this.submit = true
          await multiUpdateInspection('post', null, { data: { pks: obj, assign_to_user: this.checkList, status: '已指派', opera_type: '指派' }})
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
            this.submit1 = true
            multiUpdateInspection('post', null, { data: { close_reason: this.desc, pks: obj, status: '已关闭', opera_type: '关闭' }})
              .then(response => {
                this.$message({
                  type: 'success',
                  message: '关闭成功'
                })
                this.submit1 = false
                this.dialogVisibleClose = false
                this.$refs.multipleTable.clearSelection()
                this.getList()
              })
              .catch(response => {
                this.submit1 = false
              })
          })
        } else {
          this.$message.info('请勾选已生成状态列表')
        }
      } else {
        this.$message.info('请先勾选工单列表')
      }
    },
    async getStaff() {
      try {
        const data = await getStaff('get', null, { params: {}})
        this.staffList = data.results || []
      } catch (e) {
        //
      }
    },
    changeDebounce() {
      debounce(this, 'changeSearch')
    },
    changeDate(date) {
      this.search.planned_repair_date_after = date ? date[0] : ''
      this.search.planned_repair_date_before = date ? date[1] : ''
      this.changeSearch()
    },
    async getList() {
      try {
        this.loading = true
        const data = await equipInspectionOrder('get', null, { params: this.search })
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
    async dialogAssign() {
      this.bz = null
      try {
        if (this.multipleSelection.length > 0) {
          if (this.multipleSelection.length === 1) {
            this.bz = this.multipleSelection[0].work_persons
          }
          if (this.multipleSelection.every(d => d.equip_no === this.multipleSelection[0].equip_no)) {
            this.dialogVisible = true
            this.loadPerson = true
            const data = await getStaff('get', null, { params: { equip_no: this.multipleSelection[0].equip_no }})
            this.staffList = data.results || []
            this.checkList = []
            this.loadPerson = false
          } else {
            this.$message.info('批量指派工单需相同机台')
          }
        } else {
          this.$message.info('请先勾选工单列表')
        }
      } catch (e) {
        //
      }
    },
    dialogAdd() {
      this.creatOrder = { equip_condition: '不停机', importance_level: '中' }
      this.dialogVisibleAdd = true
    },
    handleClose(done) {
      this.dialogVisible = false
      if (done) {
        done()
      }
    },
    handleCloseAdd(done) {
      this.$refs.ruleFormHandle.resetFields()
      this.dialogVisibleAdd = false
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
