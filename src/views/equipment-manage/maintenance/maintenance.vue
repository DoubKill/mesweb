<template>
  <div>
    <!-- 设备维护计划 -->
    <el-form :inline="true">
      <el-form-item label="维护类别">
        <el-select
          v-model="search.work_type"
          placeholder="请选择"
          clearable
          @change="changeSearch"
        >
          <el-option
            v-for="item in options"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="计划名称">
        <el-input
          v-model="search.plan_name"
          clearable
          style="width:250px"
          @input="changeDebounce"
        />
      </el-form-item>
      <el-form-item label="计划日期">
        <el-date-picker
          v-model="search.planned_maintenance_date"
          type="date"
          value-format="yyyy-MM-dd"
          @change="changeSearch"
        />
      </el-form-item>
      <el-form-item label="来源">
        <el-select
          v-model="search.plan_source"
          placeholder="请选择"
          clearable
          @change="changeSearch"
        >
          <el-option
            v-for="item in options1"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select
          v-model="search.status"
          placeholder="请选择"
          clearable
          @change="changeSearch"
        >
          <el-option
            v-for="item in options2"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="设备条件">
        <el-select
          v-model="search.equip_condition"
          placeholder="请选择"
          clearable
          @change="changeSearch"
        >
          <el-option
            v-for="item in options3"
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
            v-for="item in options4"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="dialogAssign">指派计划</el-button>
        <el-button type="primary" @click="close">关闭计划</el-button>
        <el-button type="primary" @click="generate">生成工单</el-button>
        <el-button type="primary" @click="dialog">新建</el-button>
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
        prop="work_type"
        label="维护类别"
        min-width="20"
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
        prop="equip_name"
        label="机台"
        min-width="20"
      />
      <el-table-column
        label="维护标准"
        min-width="20"
      >
        <template slot-scope="scope">
          <el-link
            v-if="scope.row.repair_standard_name"
            type="primary"
          >{{ scope.row.repair_standard_name }}</el-link>
          <el-link
            v-if="scope.row.standard_name"
            type="primary"
          >{{ scope.row.standard_name }}</el-link>
        </template>
      </el-table-column>
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
        prop="plan_source"
        label="来源"
        min-width="20"
      />
      <el-table-column
        prop="status"
        label="状态"
        min-width="20"
      />
      <el-table-column
        prop="planned_maintenance_date"
        label="计划维护日期"
        min-width="20"
      />
      <el-table-column
        prop="next_maintenance_date"
        label="下次维护日期"
        min-width="20"
      />
      <el-table-column
        prop="created_username"
        label="创建人"
        min-width="20"
      />
      <el-table-column
        prop="created_date"
        label="创建时间"
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
      title="新建维护计划"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      width="30%"
    >
      <el-form
        ref="ruleFormHandle"
        :model="creatOrder"
        :rules="rules"
        :inline="true"
        label-width="120px"
      >
        <el-form-item label="维护类别" prop="work_type">
          <el-select
            v-model="creatOrder.work_type"
            placeholder="请选择"
            clearable
            @change="clear"
          >
            <el-option
              v-for="item in options"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="维护计划名称" prop="plan_name">
          <el-input
            v-model="creatOrder.plan_name"
            placeholder="请输入维护计划名称"
          />
        </el-form-item>
        <el-form-item label="生产机台" prop="equip_no">
          <el-select
            v-model="creatOrder.equip_no"
            placeholder="请选择"
            clearable
            multiple
            @visible-change="visibleChange"
          >
            <el-option
              v-for="item in equipOptions"
              :key="item.id"
              :label="item.equip_no"
              :value="item.equip_no"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="creatOrder.work_type !=='计划维修'" label="维护标准" prop="standard_name">
          <el-input
            v-model="creatOrder.standard_name"
            style="width:250px"
            disabled
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="AddDefinition"
            />
          </el-input>
        </el-form-item>
        <el-form-item v-if="creatOrder.work_type ==='计划维修'" label="维护标准" prop="repair_standard_name">
          <el-input
            v-model="creatOrder.repair_standard_name"
            style="width:250px"
            disabled
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="AddDefinition"
            />
          </el-input>
        </el-form-item>
        <el-form-item label="计划维护日期" prop="planned_maintenance_date">
          <el-date-picker
            v-model="creatOrder.planned_maintenance_date"
            type="date"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="下次维护日期">
          <el-date-picker
            v-model="creatOrder.next_maintenance_date"
            type="date"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="设备条件" prop="equip_condition">
          <el-select
            v-model="creatOrder.equip_condition"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in options3"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="重要程度" prop="importance_level">
          <el-select
            v-model="creatOrder.importance_level"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in options4"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose(false)">取 消</el-button>
        <el-button :loading="submit" type="primary" @click="generateFun">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="`维修作业项目`"
      :visible.sync="dialogVisibleRepair"
      width="80%"
      :before-close="handleCloseRepair"
    >
      <repair-definition
        ref="List1"
        :is-dialog="true"
        :params="creatOrder"
        :show="dialogVisibleRepair"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseRepair(false)">取 消</el-button>
        <el-button type="primary" @click="submitFunRepair">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="`维护作业项目`"
      :visible.sync="dialogVisibleWork"
      width="80%"
      :before-close="handleClosework"
    >
      <maintain-definition
        ref="List2"
        :is-dialog="true"
        :params="creatOrder"
        :show="dialogVisibleWork"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClosework(false)">取 消</el-button>
        <el-button type="primary" @click="submitFunwork">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="指派工单"
      :visible.sync="dialogVisibleAssign"
      width="30%"
    >
      <el-form :inline="true" label-width="120px">
        <el-form-item style="" prop="checkList">
          <el-checkbox-group v-model="checkList">
            <template v-for="(item, index) in staffList">
              <el-checkbox :key="index" :label="item.username" :disabled="!item.optional" />
            </template>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleAssign = false">取 消</el-button>
        <el-button :loading="submitAssign" type="primary" @click="generateAssign">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { debounce } from '@/utils'
import page from '@/components/page'
import { equipPlan, getStaff, equipApplyOrder, multiUpdate, equipClosePlan } from '@/api/jqy'
import { getEquip } from '@/api/banburying-performance-manage'
import RepairDefinition from '../standard-definition/repair-definition'
import MaintainDefinition from '../standard-definition/maintain-definition'
export default {
  name: 'Maintenance',
  components: { page, RepairDefinition, MaintainDefinition },
  data() {
    return {
      search: {
        page: 1,
        page_size: 10
      },
      tableData: [],
      checkList: [],
      total: 0,
      options: ['巡检', '保养', '润滑', '标定', '计划维修'],
      options1: ['自动生成', '人工创建', '故障报修'],
      options2: ['未生成工单', '已生成工单', '计划执行中', '计划已完成'],
      options3: ['停机', '不停机'],
      options4: ['高', '中', '低'],
      multipleSelection: [],
      rules: {
        work_type: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        plan_name: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        equip_no: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        standard_name: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        repair_standard_name: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        planned_maintenance_date: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        importance_level: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        equip_condition: [
          { required: true, message: '不能为空', trigger: 'change' }
        ]
      },
      loading: false,
      staffList: [],
      equipOptions: [],
      dialogVisible: false,
      dialogVisibleAssign: false,
      dialogVisibleWork: false,
      dialogVisibleRepair: false,
      submit: false,
      submitAssign: false,
      creatOrder: {}
    }
  },
  created() {
    this.getList()
    this.getStaff()
  },
  methods: {
    clear() {
      if (this.creatOrder.repair_standard_name) {
        this.creatOrder.repair_standard_name = null
      }
      if (this.creatOrder.standard_name) {
        this.creatOrder.standard_name = null
      }
      if (this.creatOrder.equip_manintenance_standard) {
        this.creatOrder.equip_manintenance_standard = null
      }
      if (this.creatOrder.equip_repair_standard) {
        this.creatOrder.equip_repair_standard = null
      }
    },
    async generate() {
      if (this.multipleSelection.length > 0) {
        const obj = []
        this.multipleSelection.forEach(d => {
          obj.push(d.id)
        })
        if (this.multipleSelection.every(d => d.status === '未生成工单')) {
          this.$confirm('此操作将生成计划工单是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            equipApplyOrder('post', null, { data: { ids: obj }})
              .then(response => {
                this.$message({
                  type: 'success',
                  message: '生成成功'
                })
                this.$refs.multipleTable.clearSelection()
                this.getList()
              })
          })
        } else {
          this.$message.info('请先未生成工单计划列表')
        }
      } else {
        this.$message.info('请先勾选计划列表')
      }
    },
    async close() {
      if (this.multipleSelection.length > 0) {
        const obj = []
        this.multipleSelection.forEach(d => {
          obj.push(d.id)
        })
        if (this.multipleSelection.every(d => d.status === '未生成工单')) {
          this.$confirm('此操作将关闭计划是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            equipClosePlan('post', null, { data: { plan_ids: obj }})
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
          this.$message.info('请先未生成工单计划列表')
        }
      } else {
        this.$message.info('请先勾选计划列表')
      }
    },
    async getStaff() {
      try {
        this.loading = true
        const data = await getStaff('get', null, { params: { }})
        this.staffList = data.results || []
      } catch (e) {
        //
      }
    },
    visibleChange(visible) {
      if (visible && this.equipOptions.length === 0) {
        const obj = { all: 1 }
        getEquip(obj).then(response => {
          this.equipOptions = response.results
        })
      }
    },
    dialogAssign() {
      if (this.multipleSelection.length > 0) {
        if (this.multipleSelection.every(d => d.status === '未生成工单')) {
          this.checkList = []
          this.dialogVisibleAssign = true
        } else {
          this.$message.info('请先未生成工单计划列表')
        }
      } else {
        this.$message.info('请先勾选计划列表')
      }
    },
    async generateAssign() {
      const obj = []
      this.multipleSelection.forEach(d => {
        obj.push(d.id)
      })
      if (obj.length > 0) {
        try {
          this.submitAssign = true
          const pks = await equipApplyOrder('post', null, { data: { ids: obj }})
          await multiUpdate('post', null, { data: { pks: pks, assign_to_user: this.checkList, status: '已指派', opera_type: '指派' }})
          this.$message.success('指派成功')
          this.submitAssign = false
          this.dialogVisibleAssign = false
          this.$refs.multipleTable.clearSelection()
          this.getList()
        } catch (e) {
          this.submitAssign = false
          this.dialogVisibleAssign = true
        }
      } else {
        this.$message.info('请选择指派人员')
      }
    },
    changeDebounce() {
      this.search.page = 1
      debounce(this, 'getList')
    },
    generateFun() {
      console.log(this.creatOrder)
      this.$refs.ruleFormHandle.validate(async(valid) => {
        if (valid) {
          try {
            this.submit = true
            await equipPlan('post', null, { data: this.creatOrder })
            this.$message.success('操作成功')
            this.handleClose(null)
            this.getList()
            this.submit = false
          } catch (e) {
            this.submit = false
          }
        } else {
          return false
        }
      })
    },
    async getList() {
      try {
        this.loading = true
        const data = await equipPlan('get', null, { params: this.search })
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
    AddDefinition() {
      if (!this.creatOrder.work_type) {
        this.$message.info('请先选择维护类别')
      } else if (this.creatOrder.work_type === '计划维修') {
        this.dialogVisibleRepair = true
      } else {
        this.dialogVisibleWork = true
      }
    },
    handleCloseRepair(done) {
      this.dialogVisibleRepair = false
      if (done) {
        done()
      }
    },
    handleClosework(done) {
      this.dialogVisibleWork = false
      if (done) {
        done()
      }
    },
    submitFunRepair() {
      if (this.$refs['List1'].currentObj.standard_name) {
        this.$set(this.creatOrder, 'repair_standard_name', this.$refs['List1'].currentObj.standard_name)
        this.$set(this.creatOrder, 'equip_repair_standard', this.$refs['List1'].currentObj.id)
        this.$set(this.creatOrder, 'equip_condition', this.$refs['List1'].currentObj.equip_condition)
        this.$set(this.creatOrder, 'importance_level', this.$refs['List1'].currentObj.important_level)
        this.dialogVisibleRepair = false
      } else {
        this.$message.info('请选择一种标准')
      }
    },
    submitFunwork() {
      if (this.$refs['List2'].currentObj.standard_name) {
        this.$set(this.creatOrder, 'standard_name', this.$refs['List2'].currentObj.standard_name)
        this.$set(this.creatOrder, 'equip_manintenance_standard', this.$refs['List2'].currentObj.id)
        this.$set(this.creatOrder, 'equip_condition', this.$refs['List2'].currentObj.equip_condition)
        this.$set(this.creatOrder, 'importance_level', this.$refs['List2'].currentObj.important_level)
        this.dialogVisibleWork = false
      } else {
        this.$message.info('请选择一种标准')
      }
    },
    dialog() {
      this.creatOrder = {}
      this.dialogVisible = true
    },
    handleClose(done) {
      this.$refs.ruleFormHandle.resetFields()
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
