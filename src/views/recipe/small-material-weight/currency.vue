<template>
  <div class="currency-style">
    <!-- 单配(配方/通用)化工流转卡 -->
    <el-form :inline="true">
      <el-form-item label="类别">
        <el-select v-model="search.batching_type" clearable placeholder="请选择" @change="getList">
          <el-option
            v-for="item in [{name:'配方'},{name:'通用'}]"
            :key="item.name"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="配方名称">
        <el-input v-model="search.product_no" clearable placeholder="配方名称" @input="debounceList" />
      </el-form-item>
      <el-form-item label="物料名称">
        <el-input v-model="search.material_name" clearable placeholder="物料名称" @input="debounceList" />
      </el-form-item>
      <el-form-item label="物料条码">
        <el-input v-model="search.bra_code" clearable placeholder="物料条码" @input="debounceList" />
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
        prop="bra_code"
        label="卡片条码"
        min-width="20"
      />
      <el-table-column
        prop="batching_type"
        label="类别"
        min-width="20"
      />
      <el-table-column
        prop="product_no"
        label="配方名称"
        min-width="20"
      />
      <el-table-column
        prop="dev_type_name"
        label="使用机型"
        min-width="20"
      />
      <el-table-column
        prop="material_name"
        label="物料名称"
        min-width="20"
      />
      <el-table-column
        prop="single_weight"
        label="配料重量"
        min-width="20"
      />
      <el-table-column
        prop="created_date"
        label="配料日期"
        min-width="20"
      />
      <el-table-column
        label="班次/班组"
        min-width="20"
        :formatter="d=>{
          return d.batch_class + '/'+ d.batch_group
        }"
      />
      <el-table-column
        label="配料车次"
        min-width="20"
        :formatter="d=>{
          return d.begin_trains+'-'+d.end_trains
        }"
      />
      <el-table-column
        prop="created_username"
        label="配料员"
        min-width="20"
      />
      <el-table-column
        prop="expire_day"
        label="有效期"
        min-width="20"
      />
      <el-table-column
        prop="print_datetime"
        label="打印时间"
        min-width="20"
      />
      <el-table-column
        prop="expire_day"
        label="有效时间"
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
      :title="`准备分厂机台单配  化工流转卡${formData.id?'预览':'设置'}`"
      :visible.sync="dialogVisible"
      width="600px"
      :before-close="handleClose"
      class="dialog-style"
    >
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px">
        <el-form-item label="类别">
          <el-radio-group v-model="formData.batching_type" :disabled="formData.id?true:false" @change="radioChange">
            <el-radio label="配方">配方</el-radio>
            <el-radio label="通用">通用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="formData.batching_type==='配方'&&!formData.id" prop="product_no_id" label="配方名称">
          <el-select v-model="formData.product_no_id" :disabled="formData.id?true:false" filterable placeholder="请选择" @change="changeProduct">
            <el-option
              v-for="item in productList"
              :key="item.id"
              :label="item.stage_product_batch_no"
              :value="item.id"
            >
              <span style="float: left">{{ item.stage_product_batch_no }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.dev_type__category_name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="formData.batching_type==='配方'&&formData.id" label="配方名称">
          {{ formData.product_no }}
        </el-form-item>
        <el-form-item v-if="formData.batching_type==='配方'" prop="dev_type" label="使用机型">
          <!-- <equip-category-select v-if="!formData.id" v-model="formData.dev_type" @change="changeDevTypeDialog" /> -->
          <span>{{ formData.dev_type_name }}</span>
        </el-form-item>
        <el-form-item v-if="formData.batching_type==='配方'" prop="split_num" label="分包数">
          <el-input-number v-model="formData.split_num" controls-position="right" :min="1" :disabled="formData.id?true:false" @change="splitNumChange" />
        </el-form-item>
        <el-form-item prop="material_name" label="物料名称">
          <el-select v-model="formData.material_name" filterable placeholder="请选择" :disabled="formData.id?true:false" @change="changeMaterial">
            <el-option
              v-for="item in materialList"
              :key="item.id"
              :label="item.material_name"
              :value="item.material_name"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="formData.batching_type==='配方'" prop="_single_weight" label="配料重量">
          <el-input v-model="formData._single_weight" placeholder="配料重量" :disabled="(formData.id||formData.batching_type==='配方')?true:false" />
        </el-form-item>
        <el-form-item v-else prop="single_weight" label="配料重量">
          <el-input v-model="formData.single_weight" placeholder="配料重量" :disabled="(formData.id||formData.batching_type==='配方')?true:false" />
        </el-form-item>
        <el-form-item prop="begin_trains" label="起始车次">
          <el-input-number v-model="formData.begin_trains" controls-position="right" :min="1" :disabled="formData.id?true:false" />
        </el-form-item>
        <el-form-item prop="package_count" label="配置数量">
          <el-input-number v-model="formData.package_count" controls-position="right" :min="1" :disabled="formData.id?true:false" />
        </el-form-item>
        <el-form-item prop="expire_day" label="有效期（天）">
          <el-input-number v-model="formData.expire_day" :step="1" step-strictl controls-position="right" :min="1" :disabled="formData.id?true:false" />
        </el-form-item>
        <el-form-item prop="print_count" label="打印张数">
          <el-input-number v-model="formData.print_count" :step="1" step-strictl controls-position="right" :min="1" />
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
import { weightingPackageSingle } from '@/api/base_w_five'
import { rubberMaterialUrl, materialsUrl } from '@/api/base_w'
import { productBatchingDetail } from '@/api/small-material-recipe'
export default {
  name: 'SmallMaterialWeightCurrency',
  components: { page, EquipCategorySelect },
  data() {
    return {
      search: {},
      tableData: [],
      total: 0,
      loading: false,
      dialogVisible: false,
      formData: {
        split_num: 1,
        batching_type: '配方',
        print_count: 1
      },
      rules: {
        product_no_id: [{ required: true, message: '请输入', trigger: 'change' }],
        split_num: [{ required: true, message: '请输入', trigger: 'blur' }],
        material_name: [{ required: true, message: '请输入', trigger: 'change' }],
        _single_weight: [{ required: true, message: '请输入', trigger: 'blur' }],
        single_weight: [{ required: true, message: '请输入', trigger: 'blur' }],
        begin_trains: [{ required: true, message: '请输入', trigger: 'blur' }],
        expire_day: [{ required: true, message: '请输入', trigger: 'blur' }],
        print_count: [{ required: true, message: '请输入', trigger: 'blur' }],
        package_count: [{ required: true, message: '请输入', trigger: 'blur' }],
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
      options: [],
      productList: [],
      materialList: []
    }
  },
  created() {
    this.getList()
    this.getProductList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await weightingPackageSingle('get', null, { params: this.search })
        this.tableData = data.results || []
        this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    async getProductList() {
      try {
        const data = await rubberMaterialUrl('get', null, { params: { used_type: 4, all: 1 }})
        this.productList = data.results || []
      } catch (e) {
        //
      }
    },
    async getManualList() {
      try {
        let data = []
        this.$set(this.formData, 'material_name', null)
        this.$set(this.formData, 'single_weight', null)
        this.materialList = []
        if (this.formData.batching_type === '配方') {
          if (this.formData.product_no) {
            data = await productBatchingDetail(this.product_batching)
          }
        } else {
          const { results } = await materialsUrl('get', null, { params: { all: 1 }})
          data = results
        }
        this.materialList = data || []
      } catch (e) {
        //
      }
    },
    changeMaterial(val) {
      if (val) {
        const obj = this.materialList.find(d => d.material_name === val)
        this.formData.single_weight = obj.actual_weight
        if (this.formData.split_num) {
          const a = this.formData.single_weight / this.formData.split_num
          const b = Math.round(a * 1000) / 1000
          this.formData._single_weight = b
        }
        if (this.formData.batching_type !== '配方') {
          this.getWeight()
        }
      }
    },
    async getWeight() {
      try {
        const data = await weightingPackageSingle('get', null, { params: { material_name: this.formData.material_name }})
        this.formData.single_weight = data || null
      } catch (e) {
        //
      }
    },
    splitNumChange() {
      if (this.formData.single_weight && this.formData.split_num) {
        const a = this.formData.single_weight / this.formData.split_num
        const b = Math.round(a * 1000) / 1000
        this.formData._single_weight = b
      }
    },
    radioChange() {
      this.formData.dev_type = null
      this.formData.dev_type_name = null
      this.formData.split_num = null
      this.formData.product_no = null
      this.formData.material_name = null
      this.formData.product_no_id = ''

      this.getManualList()
    },
    changeProduct(id) {
      if (id) {
        const obj = this.productList.find(D => D.id === id)
        this.formData.dev_type_name = obj.dev_type__category_name
        this.formData.product_no = obj.stage_product_batch_no
        this.formData.dev_type = obj.dev_type
        this.product_batching = obj.id
      } else {
        this.formData.dev_type = ''
        this.formData.dev_type_name = ''
        this.formData.product_no = ''
      }
      this.getManualList()
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
      this.getManualList()
    },
    currentChange(page, page_size) {
      this.search.page = page
      this.search.page_size = page_size
      this.getList()
    },
    showPrintDialog(row) {
      this.getManualList()
      if (row) {
        this.formData = JSON.parse(JSON.stringify(row))
        this.formData._single_weight = this.formData.single_weight
      }
      this.dialogVisible = true
      setTimeout(d => {
        if (this.$refs.formRef) {
          this.$refs.formRef.clearValidate()
        }
      }, 300)
    },
    handleClose(done) {
      setTimeout(() => {
        this.formData = {
          split_num: 1,
          print_count: 1,
          batching_type: '配方'
        }
        this.$refs.formRef.clearValidate()
      }, 300)
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
            await weightingPackageSingle(_mothod, this.formData.id || null, { data: this.formData })
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
    width:170px !important;
  }
  .dialog-style{
    .el-input,.el-select{
      width:250px !important;
    }
  }
}
</style>
