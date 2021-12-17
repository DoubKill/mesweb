<template>
  <div>
    <!-- 胶料计划库存汇总 -->
    <el-form
      :inline="true"
    >
      <el-form-item label="日期">
        <el-date-picker
          v-model="search.day_time"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          @change="getList"
        />
      </el-form-item>
      <el-form-item label="规格">
        <el-input
          v-model="search.product_no"
          @input="changeSearch"
        />
      </el-form-item>
      <el-form-item style="float:right">
        <el-button v-permission="['equip_fault_signal', 'add']" type="primary">自动排程</el-button>
        <el-button v-permission="['equip_fault_signal', 'add']" type="primary" @click="getList">查询</el-button>
        <el-button v-permission="['equip_fault_signal', 'export']" type="primary" :loading="btnExportLoad" @click="exportTable">导出Excel</el-button>
        <el-upload
          v-permission="['equip_fault_signal', 'import']"
          style="margin:0 8px;display:inline-block"
          action="string"
          accept=".xls, .xlsx"
          :http-request="Upload"
          :show-file-list="false"
        >
          <el-button type="primary">导入Excel</el-button>
        </el-upload>
        <el-button v-permission="['equip_fault_signal', 'add']" type="primary" @click="onSubmit">新建</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      border
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column
        type="index"
        label="序号"
      />
      <el-table-column
        prop="product_no"
        label="规格"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
          >{{ scope.row.product_no }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="plan_demand"
        label="计划(吨)"
      />
      <el-table-column
        prop="name"
        label="车间库存(吨)"
      />
      <el-table-column
        prop="name"
        label="属地库存(吨)"
      />
      <el-table-column
        prop="name"
        label="备注(加硫不合格待处理)"
      />
      <el-table-column
        prop="name"
        label="目标总库存量(吨)"
      />
      <el-table-column
        prop="name"
        label="可用时间(小时)"
      />
      <el-table-column
        prop="name"
        label="需生产量(吨)"
      />
      <el-table-column
        width="200px"
        label="操作"
        fixed="right"
      >
        <template
          v-if="scope.$index!==tableData.length-1"
          slot-scope="scope"
        >
          <el-button-group>
            <el-button
              icon="el-icon-caret-top"
              size="mini"
              type="primary"
              @click="moveUp(scope.$index,scope.row,tableData)"
            />
            <el-button
              icon="el-icon-caret-bottom"
              size="mini"
              type="primary"
              @click="moveDown(scope.$index,scope.row,tableData)"
            />
            <el-button
              icon="el-icon-edit"
              size="mini"
              type="primary"
              @click="editOrder(scope.row)"
            />
            <el-button
              icon="el-icon-delete"
              size="mini"
              type="danger"
              @click="deleteOrder(scope.row)"
            />
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="`${formData.id?'编辑':'插入'}胶料计划库存`"
      :visible.sync="dialogVisible"
      width="500px"
      :before-close="handleClose"
      class="dialog-style"
    >
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px">
        <el-form-item label="胶料规格" prop="product_no">
          <el-select
            v-model="formData.product_no"
            style="width:250px"
            filterable
            placeholder="请选择"
            @visible-change="visibleChange"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.product_no"
              :value="item.product_no"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="计划(吨)" prop="plan_demand">
          <el-input-number
            v-model="formData.plan_demand"
            style="width:250px"
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
import { productInfosUrl } from '@/api/base_w'
export default {
  name: 'ScheduleInventorySummary',
  components: {},
  data() {
    return {
      search: {},
      btnExportLoad: false,
      dialogVisible: false,
      loadingBtn: false,
      loading: false,
      formData: {},
      tableData: [],
      options: [],
      rules: {
        product_no: [{ required: true, message: '不能为空', trigger: 'change' }],
        plan_demand: [{ required: true, message: '不能为空', trigger: 'change' }]
      }
    }
  },

  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        // this.loading = true
        // const data = await testTypes('get', null, { params: { all: 1 }})
        // this.tableData = data || []
        // this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    async visibleChange(val) {
      if (val) {
        try {
          const data = await productInfosUrl('get', null, { params: { all: 1 }})
          this.options = data.results || []
        } catch (e) {
        //
        }
      }
    },
    changeSearch() {
      this.$debounce(this, 'getList')
    },
    deleteOrder: function(row) {
      // this.$confirm('此操作将删除' + row.order_id + ', 是否继续?', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   equipWarehouseOrder('delete', row.id, {})
      //     .then(response => {
      //       this.$message({
      //         type: 'success',
      //         message: '操作成功!'
      //       })
      //       this.getList()
      //     })
      // })
    },
    onSubmit() {
      this.formData = {}
      if (this.$refs.formRef) {
        this.$refs.formRef.clearValidate()
      }
      this.dialogVisible = true
    },
    editOrder(row) {
      if (this.$refs.formRef) {
        this.$refs.formRef.clearValidate()
      }
      this.formData = {
        id: row.id,
        product_no: row.product_no,
        plan_demand: row.plan_demand,
        desc: row.desc
      }
      this.dialogVisible = true
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
      // this.$refs.formRef.validate(async(valid) => {
      //   if (valid) {
      //     try {
      //       this.loadingBtn = true
      //       const _mothod = this.formData.id ? 'put' : 'post'
      //       await weightingPackageSingle(_mothod, this.formData.id || null, { data: this.formData })
      //       this.$message.success('操作成功')
      //       this.handleClose(false)
      //       this.getList()
      //       this.loadingBtn = false
      //     } catch (e) {
      //       this.loadingBtn = false
      //     }
      //   } else {
      //     return false
      //   }
      // })
    },
    moveUp(index, row, tableData) {
      if (index === 0) {
        this.$message({
          message: '处于顶端，不能继续上移',
          type: 'warning'
        })
      } else {
        const upDate = tableData[index - 1]
        tableData.splice(index - 1, 1)
        tableData.splice(index, 0, upDate)
      }
    },
    moveDown(index, row, tableData) {
      var that = this
      if (index + 1 === tableData.length) {
        that.$message({
          message: '处于末端，不能继续下移',
          type: 'warning'
        })
      } else {
        const downDate = tableData[index + 1]
        tableData.splice(index + 1, 1)
        tableData.splice(index, 0, downDate)
      }
    },
    exportTable() {
      // this.btnExportLoad = true
      // const obj = Object.assign({ export: 1 }, this.search)
      // const _api = equipComponentDown
      // _api(obj)
      //   .then(res => {
      //     const link = document.createElement('a')
      //     const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
      //     link.style.display = 'none'
      //     link.href = URL.createObjectURL(blob)
      //     link.download = '设备部件定义.xlsx' // 下载的文件名
      //     document.body.appendChild(link)
      //     link.click()
      //     document.body.removeChild(link)
      //     this.btnExportLoad = false
      //   }).catch(e => {
      //     this.btnExportLoad = false
      //   })
    },
    Upload(param) {
      // const formData = new FormData()
      // formData.append('file', param.file)
      // equipFaultSignalImport('post', null, { data: formData }).then(response => {
      //   this.$message({
      //     type: 'success',
      //     message: response
      //   })
      //   this.search.page = 1
      //   this.getList()
      // })
    }
  }

}
</script>

<style scoped lang='scss'>
</style>
