<template>
  <div class="currency-style">
    <!-- 配方用原材料流转卡 -->
    <!-- 通用化工流转卡 -->
    <el-form :inline="true">
      <!-- <el-form-item v-if="!isProduction" label="类别">
        <el-select
          v-model="search.batching_type"
          clearable
          placeholder="请选择"
          @change="getList"
        >
          <el-option
            v-for="item in [{name:'配方'},{name:'通用'}]"
            :key="item.name"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item v-if="!isProduction&&type !== 3" label="配方名称">
        <el-input
          v-model="search.product_no"
          clearable
          placeholder="配方名称"
          @input="debounceList"
        />
      </el-form-item>
      <el-form-item label="物料名称">
        <el-input
          v-model="search.material_name"
          clearable
          placeholder="物料名称"
          @input="debounceList"
        />
      </el-form-item>
      <el-form-item label="物料条码">
        <el-input
          v-model="search.bra_code"
          clearable
          placeholder="物料条码"
          @input="debounceList"
        />
      </el-form-item>
      <el-form-item v-if="!isProduction&&type !== 3" label="机型">
        <equip-category-select
          v-model="search.dev_type"
          @change="changeDevType"
        />
      </el-form-item>
      <el-form-item label="卡片状态">
        <el-select
          v-model="search.print_flag"
          clearable
          filterable
          @change="changeSearch"
        >
          <el-option
            v-for="(item) in [{name:'未打印',id:0},{name:'已打印',id:1},
                              {name:'已失效',id:2},{name:'过期',id:3}]"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="!isProduction&&!isDialog">
        <el-button
          v-permission="['weighting_package_manual', 'add2']"
          type="primary"
          @click="showPrintDialog(false)"
        >新建</el-button>
      </el-form-item>
      <el-form-item v-else-if="isProduction&&!isDialog">
        <el-button
          v-permission="['material_add_print', 'add']"
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
      <!-- <el-table-column
        v-if="!isProduction"
        prop="batching_type"
        label="类别"
        min-width="20"
      /> -->
      <el-table-column
        v-if="!isProduction&&type !== 3"
        prop="product_no"
        label="配方名称"
        min-width="20"
      />
      <el-table-column
        v-if="!isProduction&&type !== 3"
        prop="dev_type_name"
        label="机型"
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
        label="包数"
        min-width="20"
        :formatter="d=>{
          return d.package_count
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
        prop="expire_datetime"
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
          <div v-if="!isProduction">
            <el-button
              v-permission="['weighting_package_manual', 'print2']"
              type="primary"
              @click="showPrintDialog(scope.row)"
            >打印</el-button>
          </div>
          <div v-else>
            <el-button
              v-permission="['material_add_print', 'print']"
              type="primary"
              @click="showPrintDialog(scope.row)"
            >打印</el-button>
          </div>
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
      :title="`${type === 3?'通用化工流转卡':'配方用原材料流转卡'}${formData.id?'预览':'设置'}`"
      :visible.sync="dialogVisible"
      width="600px"
      :before-close="handleClose"
      class="dialog-style"
      append-to-body
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="120px"
      >
        <!-- <el-form-item v-if="!isProduction" label="类别">
          <el-radio-group
            v-model="formData.batching_type"
            :disabled="formData.id?true:false"
            @change="radioChange"
          >
            <el-radio label="配方">配方</el-radio>
            <el-radio label="通用">通用</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item
          v-if="formData.batching_type==='配方'&&!formData.id"
          prop="product_no_id"
          label="配方名称"
        >
          <el-select
            v-model="formData.product_no_id"
            :disabled="formData.id?true:false"
            filterable
            placeholder="请选择"
            @change="changeProduct"
          >
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
          <span style="margin-left:20px">机型：</span>
          <span>{{ formData.dev_type_name }}</span>
        </el-form-item>
        <el-form-item
          v-if="formData.batching_type==='配方'&&formData.id"
          label="配方名称"
        >
          {{ formData.product_no }}
          <span style="margin-left:20px">机型：</span>
          <span>{{ formData.dev_type_name }}</span>
        </el-form-item>
        <el-form-item
          prop="material_name"
          label="物料名称"
        >
          <el-select
            v-model="formData.material_name"
            filterable
            placeholder="请选择"
            :disabled="formData.id?true:false"
            @change="changeMaterial"
          >
            <el-option
              v-for="item in materialList"
              :key="item.id"
              :label="item.material_name"
              :value="item.material_name"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="formData.batching_type==='配方'"
          prop="_single_weight"
          label="配料重量"
        >
          <el-input
            v-model="formData._single_weight"
            style="width:100px"
            placeholder="配料重量"
            :disabled="(formData.id||formData.batching_type==='配方')?true:false"
          />
        </el-form-item>
        <el-form-item
          v-else
          prop="single_weight"
          label="配料重量"
        >
          <el-input
            v-model="formData.single_weight"
            style="width:100px"
            placeholder="配料重量"
            :disabled="(formData.id||formData.batching_type==='配方')?true:false"
          />
        </el-form-item>
        <!-- <el-form-item
          prop="begin_trains"
          label="起始车次"
        >
          <el-input-number
            v-model="formData.begin_trains"
            controls-position="right"
            :min="1"
            :disabled="formData.id?true:false"
          />
        </el-form-item> -->
        <el-form-item
          v-if="formData.batching_type==='配方'"
          prop="split_num"
          label="分包数"
        >
          <el-input-number
            v-model="formData.split_num"
            controls-position="right"
            :min="1"
            :disabled="formData.id?true:false"
            @change="splitNumChange"
          />
        </el-form-item>
        <el-form-item
          prop="package_count"
          label="包数"
        >
          <el-input-number
            v-model="formData.package_count"
            controls-position="right"
            :min="1"
            :disabled="formData.id?true:false"
          />
        </el-form-item>
        <el-form-item
          prop="expire_day"
          label="有效期（天）"
        >
          <el-input-number
            v-model="formData.expire_day"
            :step="1"
            step-strictl
            controls-position="right"
            :min="1"
            :disabled="formData.id?true:false"
          />
        </el-form-item>
        <el-form-item
          prop="print_count"
          label="打印张数"
        >
          <el-input-number
            v-model="formData.print_count"
            :step="1"
            step-strictl
            controls-position="right"
            :min="1"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose(false)">取 消</el-button>
        <el-button type="primary" :disabled="loadingBtn" @click="submitFun">打 印</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import page from '@/components/page'
import EquipCategorySelect from '@/components/EquipCategorySelect'
import { weightingPackageSingle } from '@/api/base_w_five'
import { rubberMaterialUrl, materialsUrl } from '@/api/base_w'
import { getRecipeManual } from '@/api/small-material-recipe'
export default {
  name: 'SmallMaterialWeightCurrency',
  components: { page, EquipCategorySelect },
  props: {
    isDialog: {
      type: Boolean,
      default: false
    },
    type: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      search: {
        batching_type: '配方'
      },
      tableData: [],
      total: 0,
      loading: false,
      dialogVisible: false,
      formData: {
        split_num: 1,
        batching_type: '配方',
        print_count: 1,
        begin_trains: 1,
        package_count: 1,
        expire_day: 5
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
        dev_type: [{
          required: true, message: '请输入', trigger: 'change',
          validator: (rule, value, callback) => {
            if (!this.formData.dev_type && !value) {
              callback(new Error('请输入'))
            } else {
              callback()
            }
          }
        }]
      },
      loadingBtn: false,
      tableData1: [],
      options: [],
      productList: [],
      materialList: [],
      isProduction: null // 是否是生产页面点进来的
    }
  },
  created() {
    // 只有通用
    this.isProduction = (this.$route.path === '/small-material-weight/currency1') || (this.$route.path === '/small-material-weight/currency/')
    if (this.isDialog) {
      if (this.type === 2) {
        this.search.batching_type = '配方'
        this.formData.batching_type = '配方'
      } else {
        this.search.batching_type = '通用'
        this.formData.batching_type = '通用'
      }
    }
  },
  mounted() {
    if (this.isProduction) {
      this.search.batching_type = '通用'
      this.formData.batching_type = '通用'
    }
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
            data = await getRecipeManual(this.product_batching)
          }
        } else {
          const { results } = await materialsUrl('get', null, { params: { all: 1, mc_code: 1 }})
          data = results
        }
        this.materialList = data || []
      } catch (e) {
        //
      }
    },
    async changeMaterial(val) {
      this.formData.split_num = 1
      this.formData.print_count = 1
      this.formData.begin_trains = 1
      this.formData.package_count = 1
      this.formData.expire_day = 5
      if (val) {
        const obj = this.materialList.find(d => d.material_name === val)
        this.formData.single_weight = obj.actual_weight
        this.formData.feeding_mode = obj.feeding_mode
        // if (this.formData.split_num) {
        //   const a = this.formData.single_weight / this.formData.split_num
        //   const b = Math.round(a * 1000) / 1000
        //   this.formData._single_weight = b
        // }
        if (this.formData.batching_type !== '配方') {
          await this.getWeight()
          await this.getHistory1()
        } else {
          await this.getHistory()
        }
      }
    },
    async getHistory1() {
      try {
        const data = await weightingPackageSingle('get', null, { params: { history: 1, material_name: this.formData.material_name }})
        Object.assign(this.formData, data)
      } catch (e) {
        //
      }
    },
    async getWeight() {
      try {
        const data = await weightingPackageSingle('get', null, { params: { material_name: this.formData.material_name, weight: 1 }})
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
      this.$set(this.formData, 'product_no_id', '')

      this.getManualList()
    },
    async changeProduct(id) {
      this.formData = {
        split_num: 1,
        batching_type: '配方',
        print_count: 1,
        begin_trains: 1,
        package_count: 1,
        expire_day: 5,
        product_no_id: id
      }
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
      await this.getManualList()
      // await this.getHistory()
    },
    async getHistory() {
      try {
        const data = await weightingPackageSingle('get', null, { params: { history: 1, material_name: this.formData.material_name, product_no: this.formData.product_no, product_batching: this.product_batching }})
        Object.assign(this.formData, data)
        if (this.formData.split_num) {
          const a = this.formData.single_weight / this.formData.split_num
          const b = Math.round(a * 1000) / 1000
          this.formData._single_weight = b
        }
      } catch (e) {
        //
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
          batching_type: '配方',
          print_count: 1,
          begin_trains: 1,
          package_count: 1,
          expire_day: 5
        }
        if (this.isProduction) {
          this.formData.batching_type = '通用'
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
  .el-dialog__body .el-form-item{
    margin-bottom:16px;
  }
}
</style>
