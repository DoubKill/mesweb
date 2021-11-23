<template>
  <div>
    <!--胶皮补打卡片 -->
    <el-form :inline="true">
      <el-form-item label="类别" prop="submission_department">
        <el-select
          v-model="dialogForm.submission_department"
          placeholder="请选择"
        >
          <el-option
            v-for="item in ['加硫','无硫']"
            :key="item"
            :disabled="val==='预览'"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="配方编号">
        <el-input v-model="search.material_no" style="width:150px" clearable @input="debounceFun" />
      </el-form-item>
      <el-form-item label="卡片条码">
        <el-input v-model="search.material_name" style="width:150px" clearable @input="debounceFun" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="dialog(false,'设置')">新建</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
      border
    >
      <el-table-column
        prop="material_no"
        label="卡片条码"
        min-width="20"
      />
      <el-table-column
        prop="zc_material_code"
        label="工厂日期"
        min-width="20"
      />
      <el-table-column
        prop="batch_no"
        label="班次/班组"
        min-width="20"
      />
      <el-table-column
        prop="quality_status"
        label="类别"
        min-width="20"
      />
      <el-table-column
        prop="pdm_no"
        label="配方名称"
        min-width="20"
      />
      <el-table-column
        prop="unit"
        label="车次"
        min-width="20"
      />
      <el-table-column
        prop="quantity"
        label="异常描述"
        min-width="20"
      />
      <el-table-column
        prop="weight"
        label="处理意见"
        min-width="20"
      />
      <el-table-column
        prop="weight"
        label="打印时间"
        min-width="20"
      />
      <el-table-column
        prop="weight"
        label="工艺员"
        min-width="20"
      />
      <el-table-column
        prop="weight"
        label="打印员"
        min-width="20"
      />
      <el-table-column
        prop="weight"
        label="录入人"
        min-width="20"
      />
      <el-table-column
        prop="weight"
        label="录入时间"
        min-width="20"
      />
      <el-table-column
        label="操作"
        width="80"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="dialog(scope.row,'预览')"
          >打印
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <page
      :old-page="false"
      :total="total"
      :current-page="search.page"
      @currentChange="currentChange"
    />

    <el-dialog
      :title="`准备分厂机台单配（配方）化工流转卡`+val"
      :visible.sync="dialogVisibleAdd"
      width="30%"
      :before-close="handleCloseAdd"
    >
      <el-form
        ref="createForm"
        :rules="rules"
        label-width="150px"
        :model="dialogForm"
      >
        <el-form-item label="胶料类别" prop="submission_department">
          <el-select
            v-model="dialogForm.submission_department"
            :disabled="val==='预览'"
            placeholder="请选择"
          >
            <el-option
              v-for="item in ['加硫','无硫']"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="配方名称"
          prop="order_id"
        >
          <el-input v-model="dialogForm.order_id" :disabled="val==='预览'" style="width:300px" />
        </el-form-item>
        <el-form-item
          label="车次"
          prop="order_id"
        >
          <el-input v-model="dialogForm.order_id" :disabled="val==='预览'" style="width:100px" />
          -
          <el-input v-model="dialogForm.order_id" :disabled="val==='预览'" style="width:100px" />
        </el-form-item>
        <el-form-item label="异常描述" prop="note">
          <el-input
            v-model="dialogForm.result_fault_desc"
            :disabled="val==='预览'"
            type="textarea"
            style="width:250px"
            :rows="3"
          />
        </el-form-item>
        <el-form-item label="处理意见" prop="note">
          <el-input
            v-model="dialogForm.result_fault_desc"
            :disabled="val==='预览'"
            type="textarea"
            style="width:250px"
            :rows="3"
          />
        </el-form-item>
        <el-form-item label="工艺员" prop="submission_department">
          <el-select
            v-model="dialogForm.submission_department"
            :disabled="val==='预览'"
            placeholder="请选择"
          >
            <el-option
              v-for="item in ['122']"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="打印张数" prop="submission_department">
          <el-input-number
            v-model="dialogForm.su"
            controls-position="right"
            :min="1"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseAdd(false)">取 消</el-button>
        <el-button type="primary" :loading="submit" @click="submitFun">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { debounce } from '@/utils'
import page from '@/components/page'
import { wmsStorageSummary } from '@/api/jqy'
export default {
  name: 'BanburyingMakeUp',
  components: { page },
  data() {
    return {
      search: {
        page: 1,
        page_size: 10
      },
      val: null,
      dialogForm: {},
      total: 0,
      dialogVisibleAdd: false,
      submit: false,
      tableData: [{}],
      rules: {
        submission_department: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        equip_spare: [
          { type: 'array', required: true, message: '不能为空', trigger: 'change' }
        ]
      },
      loading: false
    }
  },
  created() {
    // this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await wmsStorageSummary('get', null, { params: this.search })
        this.tableData = data.results
        this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    async dialog(row, val) {
      this.val = val
      if (val === '设置') {
        this.dialogForm = {}
        this.dialogVisibleAdd = true
      } else {
        this.dialogForm = JSON.parse(JSON.stringify(row))
        this.dialogVisibleAdd = true
      }
    },
    handleCloseAdd(done) {
      this.dialogVisibleAdd = false
      this.$refs.createForm.resetFields()
      if (done) {
        done()
      }
    },
    submitFun() {
      this.$refs.createForm.validate(async(valid) => {
        if (valid) {
          try {
            this.submit = true
            await wmsStorageSummary('post', null, { data: this.dialogForm })
            this.$message.success('操作成功')
            this.handleCloseAdd(null)
            this.getList()
            this.submit = false
            this.dialogVisibleAdd = false
          } catch (e) {
            this.submit = false
            this.dialogVisibleAdd = true
          }
        } else {
          return false
        }
      })
    },
    equipSelected(obj) {
      this.$set(this.search, 'equip_no', obj ? obj.equip_no : '')
      this.changeSearch()
    },
    debounceFun() {
      this.search.page = 1
      debounce(this, 'getList')
    },
    changeList() {
      this.search.page = 1
      this.getList()
    },
    currentChange(page, page_size) {
      this.search.page = page
      this.search.page_size = page_size
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
