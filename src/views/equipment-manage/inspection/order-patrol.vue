<template>
  <div>
    <!-- 接单巡检工单 -->
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
          @equipSelected="equipSelected"
        />
      </el-form-item>
      <el-form-item label="巡检标准">
        <el-input
          v-model="search.equip_repair_standard"
          style="width:200px"
          clearable
          @input="changeDebounce"
        />
      </el-form-item>
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
      <el-form-item>
        <el-button v-permission="['equip_inspection_order','receive']" :loading="submit1" type="primary" @click="order">接单</el-button>
        <el-button v-permission="['equip_inspection_order','charge']" :loading="submit2" type="primary" @click="backDialog">退单</el-button>
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
      title="退单原因填写"
      :visible.sync="dialogVisibleBack"
      width="30%"
    >
      <el-form label-width="120px">
        <el-form-item label="退单原因:">
          <el-input
            v-model="desc"
            style="width:300px"
            type="textarea"
            :rows="4"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleBack=false">取 消</el-button>
        <el-button :loading="submit2" type="primary" @click="back">确 定</el-button>
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
        <el-button :loading="submit3" type="primary" @click="close">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="维护作业标准详情"
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
import page from '@/components/page'
import { mapGetters } from 'vuex'
import maintain from '../components/definition-dialog1'
import { equipInspectionOrder, multiUpdateInspection, equipMaintenanceStandard } from '@/api/jqy'
import { debounce } from '@/utils'
import EquipSelect from '@/components/EquipSelect/index'
export default {
  name: 'OrderPatrol',
  components: { EquipSelect, page, maintain },
  data() {
    return {
      search: { status: '已指派' },
      loading: false,
      dateValue: [],
      tableData: [],
      dialogVisibleMaintain: false,
      dialogVisibleBack: false,
      dialogVisibleClose: false,
      desc: null,
      total: 0,
      multipleSelection: [],
      typeForm1: {},
      submit: false,
      submit1: false,
      submit2: false,
      submit3: false
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
    backDialog() {
      if (this.multipleSelection.length > 0) {
        this.desc = null
        this.dialogVisibleBack = true
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
    closeDialog() {
      if (this.multipleSelection.length > 0) {
        this.desc = null
        this.dialogVisibleClose = true
      } else {
        this.$message('请先勾选工单')
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
            this.submit1 = true
            multiUpdateInspection('post', null, { data: { pks: obj, status: '已接单', opera_type: '接单' }})
              .then(response => {
                this.$message({
                  type: 'success',
                  message: '接单成功'
                })
                this.submit1 = false
                this.$refs.multipleTable.clearSelection()
                this.getList()
              })
              .catch(response => {
                this.submit1 = false
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
            this.submit2 = true
            multiUpdateInspection('post', null, { data: { back_reason: this.desc, pks: obj, status: '已生成', opera_type: '退单' }})
              .then(response => {
                this.$message({
                  type: 'success',
                  message: '退单成功'
                })
                this.submit2 = false
                this.dialogVisibleBack = false
                this.$refs.multipleTable.clearSelection()
                this.getList()
              })
              .catch(response => {
                this.submit2 = false
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
            this.submit3 = true
            multiUpdateInspection('post', null, { data: { close_reason: this.desc, pks: obj, status: '已关闭', opera_type: '关闭' }})
              .then(response => {
                this.$message({
                  type: 'success',
                  message: '关闭成功'
                })
                this.submit3 = false
                this.dialogVisibleClose = false
                this.$refs.multipleTable.clearSelection()
                this.getList()
              })
              .catch(response => {
                this.submit3 = false
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
