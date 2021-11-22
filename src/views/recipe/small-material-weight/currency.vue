<template>
  <div class="currency-style">
    <!-- 单配(配方/通用)化工流转卡 -->
    <el-form :inline="true">
      <el-form-item label="类别">
        <el-select v-model="search.aa" clearable placeholder="请选择">
          <el-option
            v-for="item in [{name:'配方'},{name:'通有'}]"
            :key="item.name"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="配方名称">
        <el-input v-model="search.name" clearable placeholder="配方名称" @input="debounceList" />
      </el-form-item>
      <el-form-item label="物料名称">
        <el-input v-model="search.name" clearable placeholder="物料名称" @input="debounceList" />
      </el-form-item>
      <el-form-item label="物料条码">
        <el-input v-model="search.name" clearable placeholder="物料条码" @input="debounceList" />
      </el-form-item>
      <el-form-item label="使用机型">
        <equip-category-select v-model="search.dev_type" @change="changeDevType" />
      </el-form-item>
      <el-form-item label="">
        <el-button
          type="primary"
          @click="showPrintDialog(false)"
        >新建</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
      border
    >
      <el-table-column
        prop="plan_id"
        label="卡片条码"
        min-width="20"
      />
      <el-table-column
        prop="plan_id"
        label="类别"
        min-width="20"
      />
      <el-table-column
        prop="plan_id"
        label="配方名称"
        min-width="20"
      />
      <el-table-column
        prop="plan_id"
        label="使用机型"
        min-width="20"
      />
      <el-table-column
        prop="plan_id"
        label="物料名称"
        min-width="20"
      />
      <el-table-column
        prop="plan_id"
        label="配料重量"
        min-width="20"
      />
      <el-table-column
        prop="plan_id"
        label="配料日期"
        min-width="20"
      />
      <el-table-column
        prop="plan_id"
        label="班次/班组"
        min-width="20"
      />
      <el-table-column
        prop="plan_id"
        label="配料车次"
        min-width="20"
      />
      <el-table-column
        prop="plan_id"
        label="配料员"
        min-width="20"
      />
      <el-table-column
        prop="plan_id"
        label="有效期"
        min-width="20"
      />
      <el-table-column
        prop="plan_id"
        label="配料时间"
        min-width="20"
      />
      <el-table-column
        prop="plan_id"
        label="打印时间"
        min-width="20"
      />
      <el-table-column
        prop="plan_id"
        label="有效时间"
        min-width="20"
      />
      <el-table-column
        prop="plan_id"
        label="录入人"
        min-width="20"
      />
      <el-table-column
        prop="plan_id"
        label="录入时间"
        min-width="20"
      />
      <el-table-column
        label="操作"
        width="100px"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            @click="showPrintDialog(scope.row)"
          >打印</el-button>
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
      :title="`准备分厂机台单配（配方）化工流转卡${formData.id?'预览':'设置'}`"
      :visible.sync="dialogVisible"
      width="600px"
      :before-close="handleClose"
      class="dialog-style"
    >
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px">
        <el-form-item prop="aa" label="配方名称">
          <el-radio-group v-model="formData.radio">
            <el-radio :label="1">配方</el-radio>
            <el-radio :label="2">通用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="aa" label="配方名称">
          <el-input v-model="formData.aa" :disabled="formData.id?true:false" placeholder="配方名称" />
        </el-form-item>
        <el-form-item prop="dev_type" label="使用机型">
          <equip-category-select v-if="!formData.id" v-model="formData.dev_type" @change="changeDevTypeDialog" />
          <span v-else>{{ formData.dev_type }}</span>
        </el-form-item>
        <el-form-item prop="num" label="分包数">
          <el-input-number v-model="formData.num" controls-position="right" :min="1" :disabled="formData.id?true:false" />
        </el-form-item>
        <el-form-item prop="num" label="物料名称">
          <el-select v-model="formData.value" filterable placeholder="请选择" :disabled="formData.id?true:false">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="bb" label="配料重量">
          <el-input v-model="formData.bb" placeholder="配料重量" :disabled="formData.id?true:false" />
        </el-form-item>
        <el-form-item prop="num" label="起始车次">
          <el-input-number v-model="formData.num" controls-position="right" :min="1" :disabled="formData.id?true:false" />
        </el-form-item>
        <el-form-item prop="num" label="配置数量">
          <el-input-number v-model="formData.num" controls-position="right" :min="1" :disabled="formData.id?true:false" />
        </el-form-item>
        <el-form-item prop="num" label="有效期（天）">
          <el-input-number v-model="formData.num" :step="1" step-strictl controls-position="right" :min="1" :disabled="formData.id?true:false" />
        </el-form-item>
        <el-form-item prop="num" label="打印张数">
          <el-input-number v-model="formData.num" controls-position="right" :min="1" />
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
import page from '@/components/page'
import EquipCategorySelect from '@/components/EquipCategorySelect'
export default {
  name: 'SmallMaterialWeightCurrency',
  components: { page, EquipCategorySelect },
  data() {
    return {
      search: {},
      tableData: [{}],
      total: 0,
      loading: false,
      dialogVisible: false,
      formData: {
        num: 1
      },
      rules: {
        aa: [{ required: true, message: '请输入', trigger: 'blur' }],
        bb: [{ required: true, message: '请输入', trigger: 'blur' }],
        cc: [{ required: true, message: '请输入', trigger: 'change' }],
        num: [{ required: true, message: '请输入', trigger: 'blur' }],
        dev_type: [{ required: true, message: '请输入', trigger: 'change',
          validator: (rule, value, callback) => {
            if (!this.formData.dev_type && !value) {
              callback(new Error('请输入'))
            } else {
              callback()
            }
          } }]
      },
      loadingBtn: false,
      tableData1: [{}],
      options: []
    }
  },
  created() {
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        // const data = await equipInspectionOrder('get', null, { params: this.search })
        // this.tableData = data.results || []
        // this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    changeSearch() {
      this.search.page = 1
      this.getList()
    },
    debounceList() {
      this.$debounce(this, 'changeSearch')
    },
    changeDevType(e) {
      // 机型的id
      this.search.dev_type = e
      this.changeSearch()
    },
    changeDevTypeDialog(e) {
      this.formData.dev_type = e
    },
    currentChange(page, page_size) {
      this.search.page = page
      this.search.page_size = page_size
      this.getList()
    },
    showPrintDialog(row) {
      if (row) {
        this.formData = JSON.parse(JSON.stringify(row))
      }
      this.dialogVisible = true
    },
    handleClose(done) {
      this.formData = {
        num: 1
      }
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
            // await _api(_method, this.formObj.id || null, { data: obj })
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
    }
  }
}
</script>

<style lang="scss" scoped>
.currency-style{
  .el-input,.el-select{
    width:190px !important;
  }
  .dialog-style{
    .el-input,.el-select{
      width:250px !important;
    }
  }
}
</style>
