<template>
  <div>
    <!-- 机台设备停机计划设置 -->
    <el-form :inline="true">
      <el-form-item label="工厂日期">
        <el-date-picker
          v-model="factory_date"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          @change="getList"
        />
      </el-form-item>
      <el-form-item style="float:right">
        <el-button
          v-permission="['aps_halt_plan','add']"
          type="primary"
          @click="onSubmit()"
        >新建</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
      border
    >
      <el-table-column
        prop="created_date"
        label="计划创建时间"
        min-width="20"
      />
      <el-table-column
        prop="equip_no"
        label="机台"
        min-width="20"
      />
      <el-table-column
        prop="down_type"
        label="停机类型"
        min-width="20"
      />
      <el-table-column
        prop="begin_time"
        label="停机开始时间"
        min-width="20"
      />
      <el-table-column
        prop="duration"
        label="停机时长(小时)"
        min-width="20"
      />
      <el-table-column
        prop="desc"
        label="备注"
        min-width="20"
      />
      <el-table-column
        width="200px"
        label="操作"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            v-permission="['aps_halt_plan','change']"
            size="mini"
            type="primary"
            @click="edit(scope.row)"
          >编辑
          </el-button>
          <el-button
            v-permission="['aps_halt_plan','delete']"
            size="mini"
            type="danger"
            @click="handleDelete(scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="`${formData.id?'编辑':'新建'}机台设备停机计划`"
      :visible.sync="dialogVisible"
      width="500px"
      :before-close="handleClose"
      class="dialog-style"
    >
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px">
        <el-form-item label="机台" prop="equip_no">
          <el-select
            v-model="formData.equip_no"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.equip_no"
              :value="item.equip_no"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="停机类型" prop="down_type">
          <el-select
            v-model="formData.down_type"
            allow-create
            filterable
            placeholder="请选择或输入"
          >
            <el-option
              v-for="item in options1"
              :key="item.id"
              :label="item.machine_halt_reason_name"
              :value="item.machine_halt_reason_name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="停机开始时间" prop="begin_time">
          <el-date-picker
            v-model="formData.begin_time"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择停机开始时间"
          />
        </el-form-item>
        <el-form-item label="停机时长" prop="duration">
          <el-input-number
            v-model="formData.duration"
            :precision="1"
            :min="0"
          />
        </el-form-item>
        <el-form-item label="备注" prop="desc">
          <el-input
            v-model="formData.desc"
            style="width:250px"
            type="textarea"
            :rows="4"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose(false)">取 消</el-button>
        <el-button type="primary" :loading="loadingBtn" @click="submitFun">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { equipMachineHaltReason } from '@/api/base_w_four'
import { getEquip } from '@/api/banburying-performance-manage'
import { schedulingEquipShutdownPlan } from '@/api/jqy'
export default {
  name: 'ScheduleEquipmentShutdownPlan',
  components: { },
  data() {
    return {
      factory_date: '',
      loading: false,
      dialogVisible: false,
      formData: {},
      options: [],
      options1: [],
      tableData: [],
      loadingBtn: false,
      rules: {
        equip_no: [{ required: true, message: '不能为空', trigger: 'change' }],
        begin_time: [{ required: true, message: '不能为空', trigger: 'change' }],
        duration: [{ required: true, message: '不能为空', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getEquipList()
    this.getShutdownType()
    this.getList()
  },
  methods: {
    getEquipList() {
      const obj = { all: 1 }
      getEquip(obj).then(response => {
        this.options = response.results
      })
    },
    async getShutdownType() {
      try {
        const data = await equipMachineHaltReason('get', null, { params: {}})
        this.options1 = data || []
      } catch (e) {
        this.options1 = []
      }
    },
    async getList() {
      try {
        this.loading = true
        const data = await schedulingEquipShutdownPlan('get', null, { params: { factory_date: this.factory_date, page_size: 1000000 }})
        this.tableData = data.results || []
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    handleClose(done) {
      this.formData = {}
      this.$refs.formRef.clearValidate()
      this.dialogVisible = false
      if (done) {
        done()
      }
    },
    submitFun() {
      this.$refs.formRef.validate(async(valid) => {
        if (valid) {
          try {
            this.loadingBtn = true
            const _mothod = this.formData.id ? 'put' : 'post'
            await schedulingEquipShutdownPlan(_mothod, this.formData.id || null, { data: this.formData })
            this.$message.success('操作成功')
            this.handleClose(false)
            this.getList()
            this.loadingBtn = false
          } catch (e) {
            this.loadingBtn = false
          }
        } else {
          return false
        }
      })
    },
    onSubmit() {
      if (this.$refs.formRef) {
        this.$refs.formRef.clearValidate()
      }
      this.formData = {}
      this.dialogVisible = true
    },
    edit(row) {
      this.formData = JSON.parse(JSON.stringify(row))
      this.dialogVisible = true
    },
    handleDelete(row) {
      this.$confirm('此操作将删除此机台设备停机计划是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        schedulingEquipShutdownPlan('delete', row.id, {})
          .then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getList()
          })
      })
    }
  }
}
</script>

<style>

</style>
