<template>
  <div class="hebao-style">
    <!-- 细料硫磺单配流转卡 -->
    <el-form :inline="true">
      <el-form-item label="配方名称">
        <el-input v-model="search.product_no" clearable placeholder="配方名称" @input="debounceList" />
      </el-form-item>
      <!-- <el-form-item label="物料名称">
        <el-input v-model="search.material_name" clearable placeholder="物料名称" @input="debounceList" />
      </el-form-item> -->
      <el-form-item label="物料条码">
        <el-input v-model="search.bra_code" clearable placeholder="物料条码" @input="debounceList" />
      </el-form-item>
      <el-form-item label="机配机台">
        <equipSelect equip-type="称量设备" :equip_no_props.sync="search.batching_equip" @changeSearch="changeSearch" />
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
      <el-form-item>
        <el-button
          v-permission="['weighting_package_manual', 'add']"
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
        prop="product_no"
        label="配方名称"
        min-width="20"
      />
      <el-table-column
        prop="dev_type"
        label="机型"
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
        prop="single_weight"
        label="单配总重"
        min-width="20"
      />
      <el-table-column
        prop="created_username"
        label="配料员"
        min-width="20"
      />
      <el-table-column
        prop="print_datetime"
        label="打印时间"
        min-width="20"
      />
      <el-table-column
        label="包数"
        min-width="20"
        :formatter="d=>{
          return d.package_count
        }"
      />
      <el-table-column
        prop="batching_equip"
        label="机配机台"
        min-width="20"
      />
      <el-table-column
        prop="split_num"
        label="分包数"
        min-width="20"
      />
      <el-table-column
        prop="print_count"
        label="打印张数"
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
            v-permission="['weighting_package_manual', 'print']"
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
      :title="`准备分厂机台单配（合包）化工流转卡${formData.id?'预览':'设置'}`"
      :visible.sync="dialogVisible"
      width="900px"
      :before-close="handleClose"
    >
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px">
        <el-form-item v-if="!formData.id" prop="product_no" label="配方名称">
          <!-- <el-select v-model="formData.product_no" :disabled="formData.id?true:false" filterable placeholder="请选择" @change="changeProduct">
            <el-option
              v-for="item in productList"
              :key="item.id"
              :label="item.stage_product_batch_no"
              :value="item.stage_product_batch_no"
            />
          </el-select> -->
          <el-select v-model="formData.product_no" :disabled="formData.id?true:false" filterable placeholder="请选择" @change="changeProductNo">
            <el-option
              v-for="(item,_index) in productList"
              :key="_index"
              :label="item.product_no"
              :value="item.product_no"
            >
              <span style="float: left">{{ item.product_no }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.dev_type }}</span>
            </el-option>
          </el-select>
          <span style="margin-left:20px">机型：</span>
          <span>{{ formData.dev_type }}</span>
        </el-form-item>
        <el-form-item v-else label="配方名称">
          {{ formData.product_no }}
          <span style="margin-left:20px">机型：</span>
          <span>{{ formData.dev_type }}</span>
        </el-form-item>
        <!-- <el-form-item prop="dev_type" label="机型">
          <equip-category-select v-if="!formData.id" v-model="formData.dev_type" @change="changeProduct" />
          <span v-else>{{ formData.dev_type_name }}</span>
        </el-form-item> -->
        <!-- <el-form-item prop="begin_trains" label="起始车次">
          <el-input-number v-model="formData.begin_trains" controls-position="right" :min="1" :disabled="formData.id?true:false" />
        </el-form-item> -->
        <el-form-item prop="batching_equip" label="机配机台">
          <el-select v-if="!formData.id" v-model="formData.batching_equip" filterable placeholder="请选择" @change="changeProduct">
            <el-option
              v-for="item in equipList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
          <!-- <equipSelect v-if="!formData.id" equip-type="称量设备" :equip_no_props.sync="formData.batching_equip" @changeSearch="changeProduct" /> -->
          <span v-else>{{ formData.batching_equip }}</span>
        </el-form-item>
        <el-form-item prop="split_num" label="分包数">
          <el-input-number v-model="formData.split_num" controls-position="right" :min="1" :disabled="formData.id?true:false" @change="changeSplitNum" />
        </el-form-item>
        <el-form-item prop="package_count" label="包数">
          <el-input-number v-model="formData.package_count" controls-position="right" :min="1" :disabled="formData.id?true:false" />
        </el-form-item>
        <el-form-item prop="print_count" label="打印张数">
          <el-input-number v-model="formData.print_count" controls-position="right" :min="1" />
        </el-form-item>
        <el-table
          :data="tableData1New"
          border
        >
          <el-table-column
            prop="material_name"
            label="物料名称"
            min-width="20"
          />
          <el-table-column
            prop="standard_weight"
            label="重量（kg）"
            min-width="20"
          />
          <el-table-column
            prop="tolerance"
            label="公差（kg）"
            min-width="20"
          />
          <el-table-column
            v-if="formData.id?false:true"
            prop="plan_id"
            label="配料方式"
            width="210px"
          >
            <template slot-scope="{row}">
              <el-select v-model="row.batch_type" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.equip_no"
                  :value="item.equip_no"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            v-else
            label="配料方式"
            width="210px"
          >
            <template slot-scope="{row}">
              {{ row.batch_type }}
            </template>
          </el-table-column>
          <el-table-column
            v-if="formData.id?false:true"
            label="操作"
            width="100px"
          >
            <template slot-scope="scope">
              <el-button
                type="danger"
                @click="delFun(scope.row,scope.$index)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="!formData.id" type="info" @click="resetFun">重 置</el-button>
        <el-button @click="handleClose(false)">取 消</el-button>
        <el-button type="primary" :disabled="loadingBtn" @click="submitFun">打 印</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import page from '@/components/page'
// import EquipCategorySelect from '@/components/EquipCategorySelect'
import { weightingPackageManua, getManualInfo, getMaterialTolerance, xlRecipesInfo } from '@/api/base_w_five'
import { equipUrl } from '@/api/base_w'
import equipSelect from '@/components/select_w/equip'
export default {
  name: 'SmallMaterialWeightHebao',
  components: { page, equipSelect },
  data() {
    return {
      search: {},
      tableData: [],
      total: 0,
      loading: false,
      dialogVisible: false,
      formData: {
        split_num: 1,
        print_count: 1,
        begin_trains: 1
      },
      rules: {
        product_no: [{ required: true, message: '请输入', trigger: 'change' }],
        begin_trains: [{ required: true, message: '请输入', trigger: 'blur' }],
        cc: [{ required: true, message: '请输入', trigger: 'change' }],
        package_count: [{ required: true, message: '请输入', trigger: 'blur' }],
        split_num: [{ required: true, message: '请输入', trigger: 'blur' }],
        dev_type: [{ required: true, message: '请输入', trigger: 'change',
          validator: (rule, value, callback) => {
            if (!this.formData.dev_type && !value) {
              callback(new Error('请输入'))
            } else {
              callback()
            }
          } }],
        batching_equip: [{ required: true, message: '请输入', trigger: 'change',
          validator: (rule, value, callback) => {
            if (!this.formData.batching_equip && !value) {
              callback(new Error('请输入'))
            } else {
              callback()
            }
          } }]
      },
      loadingBtn: false,
      tableData1: [],
      tableData1New: [],
      options: [],
      productList: [],
      equipList: []
    }
  },
  created() {
    this.getList()
    this.getProductList()
    this.getMachineList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await weightingPackageManua('get', null, { params: this.search })
        this.tableData = data.results || []
        this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    getMachineList() {
      var _this = this
      equipUrl('get', { params: { all: 1, category_name: '称量设备' }})
        .then(function(response) {
          _this.options = response.results || []
          _this.options.unshift({ id: 9999, equip_no: '人工配' })
        })
        .catch(function() { })
    },
    async getProductList() {
      try {
        const data = await xlRecipesInfo('get', null, {})
        this.productList = data.results || []
      } catch (e) {
        //
      }
    },
    async getManual() {
      try {
        if (!this.formData.product_no || !this.formData.dev_type || !this.formData.batching_equip) {
          return
        }
        const data = await getManualInfo('get', null, { params: { product_no: this.formData.product_no, dev_type: this.formData.dev_type, batching_equip: this.formData.batching_equip }})
        this.tableData1New = data.results || []
        this.tableData1 = JSON.parse(JSON.stringify(data.results || []))

        this.tableData1New.forEach(d => {
          this.$set(d, 'batch_type', '人工配')
          d.standard_weight_old = d.standard_weight
        })
        this.tableData1.forEach(d => {
          this.$set(d, 'batch_type', '人工配')
          d.standard_weight_old = d.standard_weight
        })
        if (!this.tableData1New.length) {
          return
        }
        this.changeSplitNum()
      } catch (e) {
        //
      }
    },
    changeProduct() {
      this.tableData1 = []
      this.tableData1New = []
      this.getManual()
    },
    changeProductNo(no) {
      if (no) {
        const obj = this.productList.find(D => D.product_no === no)
        this.formData.dev_type = obj.dev_type
        this.equipList = obj.batching_equip || []
      } else {
        this.formData.dev_type = ''
        this.formData.product_no = ''
      }
      this.getHistory()
      this.formData.batching_equip = ''
      this.tableData1 = []
      this.tableData1New = []
      this.getManual()
    },
    async changeSplitNum() {
      if (!this.tableData1New.length) {
        return
      }
      this.loadingBtn = true
      let i = this.tableData1New.length
      for (let index = 0; index < this.tableData1New.length; index++) {
        const d = this.tableData1New[index]
        d.standard_weight = Math.round(d.standard_weight_old / this.formData.split_num * 1000) / 1000
        try {
          const data = await getMaterialTolerance('get', null, { params: {
            batching_equip: this.formData.batching_equip,
            material_name: d.material_name, standard_weight: d.standard_weight }})
          this.$set(d, 'tolerance', data)
          i--
        } catch (e) {
          //
        }
      }
      if (i === 0) {
        this.loadingBtn = false
      }
    },
    changeSearch() {
      this.search.page = 1
      this.getList()
    },
    debounceList() {
      this.$debounce(this, 'changeSearch')
    },
    currentChange(page, page_size) {
      this.search.page = page
      this.search.page_size = page_size
      this.getList()
    },
    changeDevType(e) {
      // 机型的id
      this.formData.dev_type = e
    },
    delFun(row, index) {
      this.tableData1New.splice(index, 1)
    },
    resetFun() {
      this.formData.split_num = 1
      this.tableData1New = JSON.parse(JSON.stringify(this.tableData1 || []))
      this.changeSplitNum()
    },
    showPrintDialog(row) {
      if (row) {
        this.formData = JSON.parse(JSON.stringify(row))
        this.tableData1New = this.formData.manual_details
        this.tableData1 = this.formData.manual_details
      }
      this.dialogVisible = true
      setTimeout(d => {
        if (this.$refs.formRef) {
          this.$refs.formRef.clearValidate()
        }
      })
    },
    handleClose(done) {
      setTimeout(() => {
        this.formData = {
          split_num: 1,
          print_count: 1,
          begin_trains: 1
        }
        this.tableData1New = []
        this.tableData1 = []
        this.$refs.formRef.clearValidate()
      }, 200)
      this.dialogVisible = false
      if (done) {
        done()
      }
    },
    async getHistory() {
      try {
        const data = await weightingPackageManua('get', null, { params: { history: 1, product_no: this.formData.product_no }})
        Object.assign(this.formData, data)
        this.changeProduct()
      } catch (e) {
        //
      }
    },
    submitFun() {
      if (!this.formData.manual_details) {
        // this.tableData1New.forEach(d => {
        //   d.material_name = d.material__material_name
        // })
        this.formData.manual_details = this.tableData1New
      }
      if (!this.formData.manual_details.length) {
        this.$message.info('没有物料')
        return
      }
      this.$refs.formRef.validate(async(valid) => {
        if (valid) {
          try {
            this.loadingBtn = true
            const _method = this.formData.id ? 'put' : 'post'
            await weightingPackageManua(_method, this.formData.id || null, { data: this.formData })
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
.hebao-style{
  .el-input,.el-select{
    width:190px !important;
  }
  .el-dialog__body .el-form-item{
    margin-bottom:16px;
  }
}
</style>
