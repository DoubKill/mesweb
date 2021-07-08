<template>
  <div class="loaction-style">
    <!--线边库 库区库位管理 -->
    <el-row>
      <el-col v-loading="loading" :span="12">
        <el-button
          v-permission="['depot', 'add']"
          style="margin-bottom:10px"
          @click="addArea(true)"
        >添加库区</el-button>
        <el-table
          ref="currentRow"
          :data="tableData"
          border
          highlight-current-row
          @current-change="handleCurrentChange"
        >
          <el-table-column
            prop="depot_name"
            label="库区名称"
          />
          <el-table-column
            prop="description"
            label="描述"
          />
          <el-table-column
            label="操作"
          >
            <template slot-scope="scope">
              <el-button
                v-permission="['depot', 'change']"
                size="mini"
                type="primary"
                @click="editArea(scope.row,true)"
              >编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <page
          :old-page="false"
          :total="total"
          :current-page="pageNo"
          @currentChange="currentChange"
        />
      </el-col>
      <el-col v-loading="loading1" :span="12">
        <el-button
          v-permission="['depot', 'addSite']"
          style="margin-bottom:10px;float:right"
          :disabled="depot?false:true"
          @click="addArea(false)"
        >添加库位</el-button>
        <el-table
          :data="tableData1"
          border
        >
          <!-- <el-table-column
            prop="depot__depot_name"
            label="库区"
          /> -->
          <el-table-column
            prop="depot_site_name"
            label="库位名称"
          />
          <el-table-column
            prop="description"
            label="描述"
          />
          <el-table-column
            label="操作"
          >
            <template slot-scope="scope">
              <el-button
                v-permission="['depot', 'changeSite']"
                size="mini"
                type="primary"
                @click="editArea(scope.row,false)"
              >编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- <page
          :old-page="false"
          :total="total1"
          :current-page="pageNo1"
          @currentChange="currentChange1"
        /> -->
      </el-col>
    </el-row>

    <el-dialog
      :title="(formObj.id?'编辑':'添加')+(isArea?'库区':'库位')"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form
        ref="formObj"
        :model="formObj"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item v-if="!isArea" label="库区" prop="depot">
          <el-select
            v-model="formObj.depot"
            placeholder="请选择"
            :disabled="formObj.depot"
          >
            <el-option
              v-for="item in tableData"
              :key="item.id"
              :label="item.depot_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="isArea" label="库区名称" prop="depot_name">
          <el-input v-model="formObj.depot_name" />
        </el-form-item>
        <el-form-item v-if="!isArea" label="库位名称" prop="depot_site_name">
          <el-input v-model="formObj.depot_site_name" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="formObj.description" />
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
import { depot, depotSite } from '@/api/base_w_four'
import page from '@/components/page'
import { checkPermission } from '@/utils'
export default {
  name: 'LineSideInOutWarehouse',
  components: { page },
  data() {
    return {
      tableData: [],
      tableData1: [],
      isArea: null,
      formObj: {},
      dialogVisible: false,
      rules: {
        depot_name: [
          { required: true, message: '请输入库区', trigger: 'blur' }
        ],
        depot_site_name: [
          { required: true, message: '请输入库位', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入描述', trigger: 'blur' }
        ],
        depot: [
          { required: true, message: '请选择库区', trigger: 'change' }
        ]
      },
      options: [],
      loading: false,
      loading1: false,
      loadingBtn: false,
      total: 0,
      total1: 0,
      pageNo: 1,
      pageNo1: 1,
      pageSize: 10,
      pageSize1: 10,
      depot: null
    }
  },
  created() {
    this.getList()
    // this.getList1()
  },
  methods: {
    checkPermission,
    async getList() {
      try {
        this.loading = true
        const data = await depot('get', null, { params: { page: this.pageNo, page_size: this.pageSize }})
        this.tableData = data.results
        this.total = data.count
        this.$refs.currentRow.setCurrentRow(this.tableData[0])
        this.depot = this.tableData[0].id
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    handleCurrentChange(row) {
      this.depot = row.id
      this.getList1()
    },
    async getList1() {
      try {
        this.loading1 = true
        const data = await depotSite('get', null, { params: { all: 1, id: this.depot }})
        this.tableData1 = data.results
        // this.total1 = data.count
        this.loading1 = false
      } catch (e) {
        this.loading1 = false
      }
    },
    currentChange(page, page_size) {
      this.pageNo = page
      this.pageSize = page_size
      this.getList()
    },
    currentChange1(page, page_size) {
      this.pageNo1 = page
      this.pageSize1 = page_size
      this.getList1()
    },
    addArea(bool) {
      this.formObj.depot = this.depot
      this.isArea = bool
      this.dialogVisible = true
    },
    editArea(row, bool) {
      this.isArea = bool
      this.dialogVisible = true
      this.formObj = JSON.parse(JSON.stringify(row))
    },
    handleClose(done) {
      this.dialogVisible = false
      this.formObj = {
        name: ''
      }
      this.$refs.formObj.resetFields()
      if (done) {
        done()
      }
    },
    submitFun() {
      this.$refs.formObj.validate(async(valid) => {
        if (valid) {
          try {
            this.loadingBtn = true
            const _api = this.isArea ? depot : depotSite
            const _method = this.formObj.id ? 'put' : 'post'
            await _api(_method, this.formObj.id, { data: this.formObj })
            this.$message.success('操作成功')
            this.handleClose(false)
            if (this.isArea) {
              this.getList()
            } else {
              this.getList1()
            }
            this.loadingBtn = false
          } catch (e) {
            this.loadingBtn = false
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
.loaction-style{
.el-input{
  width:auto !important;
}
}
</style>
