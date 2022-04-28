<template>
  <div class="singleCard-style">
    <!-- 人工单配卡片打印 -->
    <el-row :gutter="10" class="row-box">
      <el-col :span="10">
        <div class="border-style">
          <h3>细料硫磺单配 流转卡</h3>
          <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
            <el-form-item prop="product_no" label="配方名称">
              <el-select v-model="formData.product_no" style="width:300px !important" filterable placeholder="请选择" @change="changeProductNo">
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
            <el-form-item prop="batching_equip" label="机配机台">
              <el-select v-model="formData.batching_equip" filterable placeholder="请选择" @change="changeProduct">
                <el-option
                  v-for="item in equipList"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
            <el-form-item prop="split_num" label="分包数">
              <el-input-number v-model="formData.split_num" controls-position="right" :min="1" @change="changeSplitNum" />
            </el-form-item>
            <el-form-item prop="package_count" label="包数">
              <el-input-number v-model="formData.package_count" controls-position="right" :min="1" />
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
                min-width="30"
              />
              <el-table-column
                prop="standard_weight"
                label="重量（kg）"
                min-width="15"
              />
              <el-table-column
                prop="tolerance"
                label="公差（kg）"
                min-width="15"
              />
              <el-table-column
                prop="plan_id"
                label="配料方式"
                width="120px"
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
          <span class="dialog-footer">
            <el-button type="primary" @click="viewFun(1)">打印履历查看</el-button>
            <el-button type="info" @click="resetFun">重 置</el-button>
            <el-button v-permission="['weighting_package_manual', 'add']" type="primary" :disabled="loadingBtn" @click="submitFun">打 印</el-button>
          </span>
        </div>
      </el-col>
      <el-col :span="7">
        <div class="border-style">
          <h3>配方用原材料 流转卡</h3>
          <el-form
            ref="formRef1"
            :model="formData1"
            :rules="rules1"
            label-width="100px"
          >
            <el-form-item
              v-if="formData1.batching_type==='配方'"
              prop="product_no_id"
              label="配方名称"
            >
              <el-select
                v-model="formData1.product_no_id"
                filterable
                placeholder="请选择"
                style="width:250px"
                @change="changeProduct1"
              >
                <el-option
                  v-for="item in productList1"
                  :key="item.id"
                  :label="item.stage_product_batch_no"
                  :value="item.id"
                >
                  <span style="float: left">{{ item.stage_product_batch_no }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.dev_type__category_name }}</span>
                </el-option>
              </el-select>
              <!-- <span style="margin-left:20px">机型：</span>
              <span>{{ formData1.dev_type_name }}</span> -->
            </el-form-item>
            <el-form-item
              label="机型"
            >
              <span>{{ formData1.dev_type_name }}</span>
            </el-form-item>
            <el-form-item
              prop="material_name"
              label="物料名称"
            >
              <el-select
                v-model="formData1.material_name"
                filterable
                placeholder="请选择"
                style="width:250px"
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
              v-if="formData1.batching_type==='配方'"
              prop="_single_weight"
              label="配料重量"
              style="width:280px"
            >
              <el-input
                v-model="formData1._single_weight"
                :disabled="true"
                placeholder="配料重量"
              />
            </el-form-item>
            <el-form-item
              v-if="formData1.batching_type==='配方'"
              prop="split_num"
              label="分包数"
            >
              <el-input-number
                v-model="formData1.split_num"
                controls-position="right"
                :min="1"
                @change="splitNumChange"
              />
            </el-form-item>
            <el-form-item
              prop="package_count"
              label="包数"
            >
              <el-input-number
                v-model="formData1.package_count"
                controls-position="right"
                :min="1"
              />
            </el-form-item>
            <el-form-item
              prop="expire_day"
              label="有效期(天)"
            >
              <el-input-number
                v-model="formData1.expire_day"
                :step="1"
                step-strictl
                controls-position="right"
                :min="1"
              />
            </el-form-item>
            <el-form-item
              prop="print_count"
              label="打印张数"
            >
              <el-input-number
                v-model="formData1.print_count"
                :step="1"
                step-strictl
                controls-position="right"
                :min="1"
              />
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <!-- <el-button @click="handleClose(false)">清 空</el-button> -->
            <el-button type="primary" @click="viewFun(2)">打印履历查看</el-button>
            <el-button v-permission="['weighting_package_manual', 'add2']" type="primary" :disabled="loadingBtn" @click="submitFun1">打 印</el-button>
          </span>
        </div>
      </el-col>
      <el-col :span="7">
        <div class="border-style" style="height:614px;position: relative;">
          <h3>通用化工 流转卡</h3>
          <el-form ref="formRef2" :model="formData2" :rules="rules1" label-width="100px">
            <el-form-item
              prop="material_name"
              label="物料名称"
            >
              <el-select
                v-model="formData2.material_name"
                style="width:250px"
                filterable
                placeholder="请选择"
                @change="changeMaterial1"
              >
                <el-option
                  v-for="item in materialList1"
                  :key="item.id"
                  :label="item.material_name"
                  :value="item.material_name"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              prop="single_weight"
              label="配料重量"
            >
              <el-input-number
                v-model="formData2.single_weight"
                controls-position="right"
                :max="100"
              />
            </el-form-item>
            <el-form-item
              prop="package_count"
              label="包数"
            >
              <el-input-number
                v-model="formData2.package_count"
                controls-position="right"
                :min="1"
                :max="30"
              />
            </el-form-item>
            <el-form-item
              prop="expire_day"
              label="有效期(天)"
            >
              <el-input-number
                v-model="formData2.expire_day"
                :step="1"
                step-strictl
                controls-position="right"
                :min="1"
              />
            </el-form-item>
            <el-form-item
              prop="print_count"
              label="打印张数"
            >
              <el-input-number
                v-model="formData2.print_count"
                :step="1"
                step-strictl
                controls-position="right"
                :min="1"
              />
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer btn-style">
            <!-- <el-button @click="handleClose(false)">取 消</el-button> -->
            <el-button type="primary" @click="viewFun(3)">打印履历查看</el-button>
            <el-button v-permission="['weighting_package_manual', 'add2']" type="primary" :disabled="loadingBtn" @click="submitFun2">打 印</el-button>
          </span>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      title="打印履历"
      :visible.sync="dialogVisible"
      width="98%"
    >
      <hebao v-if="type===1" ref="hebaoRef" :is-dialog="true" />
      <currency v-else ref="hebaoRef" :is-dialog="true" :type="type" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { weightingPackageManua, getManualInfo, getMaterialTolerance, xlRecipesInfo } from '@/api/base_w_five'
import { equipUrl, rubberMaterialUrl, materialsUrl } from '@/api/base_w'
import { getRecipeManual } from '@/api/small-material-recipe'
import { weightingPackageSingle } from '@/api/base_w_five'
import hebao from './hebao'
import currency from './currency'

export default {
  components: { hebao, currency },
  data() {
    return {
      formData: {
        split_num: 1,
        print_count: 1,
        begin_trains: 1,
        package_count: 1
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
      productList: [],
      equipList: [],
      tableData1: [],
      tableData1New: [],
      options: [],
      loadingBtn: false,
      formData1: {
        split_num: 1,
        batching_type: '配方',
        print_count: 1,
        begin_trains: 1,
        package_count: 1,
        expire_day: 5
      },
      rules1: {
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
      productList1: [],
      materialList: [],
      materialList1: [],
      formData2: {
        split_num: 1,
        batching_type: '通用',
        print_count: 1,
        begin_trains: 1,
        package_count: 1,
        expire_day: 5
      },
      dialogVisible: false,
      type: null // 2配方 3通用
    }
  },
  watch: {
    dialogVisible(bool) {
      if (this.$refs.hebaoRef) {
        if (this.type === 2) {
          this.$refs.hebaoRef.search = {
            batching_type: '配方'
          }
        } else if (this.type === 3) {
          this.$refs.hebaoRef.search = {
            batching_type: '通用'
          }
        } else {
          this.$refs.hebaoRef.search = {}
        }
        if (bool) {
          this.$refs.hebaoRef.getList()
        }
      }
    }
  },
  created() {
    this.getProductList()
    this.getMachineList()
    this.getProductList1()
    this.getManualList2()
  },
  methods: {
    // 第一个开始
    async changeProductNo(no) {
      if (no) {
        const obj = this.productList.find(D => D.product_no === no)
        this.formData.dev_type = obj.dev_type
        this.equipList = obj.batching_equip || []
      } else {
        this.formData.dev_type = ''
        this.formData.product_no = ''
      }
      this.formData.batching_equip = ''
      this.tableData1 = []
      this.tableData1New = []
      await this.getManual()
      await this.getHistory()
    },
    async getHistory() {
      try {
        const data = await weightingPackageManua('get', null, { params: { history: 1, product_no: this.formData.product_no }})
        Object.assign(this.formData, data)
        this.formData.split_num = data.split_num ? data.split_num : 1
        this.formData.package_count = data.package_count ? data.package_count : 1
        this.formData.print_count = data.print_count ? data.print_count : 1
        this.changeProduct()
      } catch (e) {
        //
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
    changeProduct() {
      this.tableData1 = []
      this.tableData1New = []
      this.getManual()
    },
    delFun(row, index) {
      this.tableData1New.splice(index, 1)
    },
    resetFun() {
      this.formData.split_num = 1
      this.formData.print_count = 1
      this.formData.begin_trains = 1
      this.formData.package_count = 1
      this.tableData1New = JSON.parse(JSON.stringify(this.tableData1 || []))
      this.changeSplitNum()
    },
    viewFun(num) {
      this.type = num
      this.dialogVisible = true
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
    handleClose() {
      this.formData = {
        split_num: 1,
        print_count: 1,
        begin_trains: 1,
        package_count: 1
      }
      this.tableData1New = []
      this.tableData1 = []
      setTimeout(() => {
        this.$refs.formRef.clearValidate()
      }, 200)
    },
    submitFun() {
      if (!this.formData.manual_details) {
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
            this.$message.success('细料硫磺单配流转卡,操作成功')
            this.handleClose()
            this.loadingBtn = false
          } catch (e) {
            this.loadingBtn = false
          }
        } else {
          return false
        }
      })
    },
    // 第一个结束
    // 第二个开始
    async getProductList1() {
      try {
        const data = await rubberMaterialUrl('get', null, { params: { used_type: 4, all: 1 }})
        this.productList1 = data.results || []
      } catch (e) {
        //
      }
    },
    async getManualList1() {
      try {
        let data = []
        this.$set(this.formData1, 'material_name', null)
        this.$set(this.formData1, 'single_weight', null)
        this.materialList = []
        if (this.formData1.batching_type === '配方') {
          if (this.formData1.product_no) {
            data = await getRecipeManual(this.product_batching)
          }
        }
        this.materialList = data || []
      } catch (e) {
        //
      }
    },
    async changeProduct1(id) {
      this.formData1 = {
        split_num: 1,
        batching_type: '配方',
        print_count: 1,
        begin_trains: 1,
        package_count: 1,
        expire_day: 5,
        product_no_id: id
      }
      if (id) {
        const obj = this.productList1.find(D => D.id === id)
        this.formData1.dev_type_name = obj.dev_type__category_name
        this.formData1.product_no = obj.stage_product_batch_no
        this.formData1.dev_type = obj.dev_type
        this.product_batching = obj.id
      } else {
        this.formData1.dev_type = ''
        this.formData1.dev_type_name = ''
        this.formData1.product_no = ''
      }
      await this.getManualList1()
    },
    async getHistory1() {
      try {
        const data = await weightingPackageSingle('get', null, { params: { history: 1, material_name: this.formData1.material_name, product_no: this.formData1.product_no, product_batching: this.product_batching }})
        Object.assign(this.formData1, data)

        if (this.formData1.split_num) {
          const a = this.formData1.single_weight / this.formData1.split_num
          const b = Math.round(a * 1000) / 1000
          this.$set(this.formData1, '_single_weight', b)
        }
      } catch (e) {
        //
      }
    },
    splitNumChange() {
      if (this.formData1.single_weight && this.formData1.split_num) {
        const a = this.formData1.single_weight / this.formData1.split_num
        const b = Math.round(a * 1000) / 1000
        this.formData1._single_weight = b
      }
    },
    handleClose1() {
      this.formData1 = {
        split_num: 1,
        batching_type: '配方',
        print_count: 1,
        begin_trains: 1,
        package_count: 1,
        expire_day: 5
      }
      setTimeout(() => {
        this.$refs.formRef1.clearValidate()
      }, 200)
    },
    async changeMaterial(val) {
      this.formData1.split_num = 1
      this.formData1.print_count = 1
      this.formData1.begin_trains = 1
      this.formData1.package_count = 1
      this.formData1.expire_day = 5
      if (val) {
        const obj = this.materialList.find(d => d.material_name === val)
        this.formData1.single_weight = obj.actual_weight
        this.formData1.feeding_mode = obj.feeding_mode
        // if (this.formData1.split_num) {
        //   const a = this.formData1.single_weight / this.formData1.split_num
        //   const b = Math.round(a * 1000) / 1000
        //   this.formData1._single_weight = b
        // }
      }
      this.getHistory1()
    },
    submitFun1() {
      this.$refs.formRef1.validate(async(valid) => {
        if (valid) {
          try {
            this.loadingBtn = true
            const _mothod = this.formData1.id ? 'put' : 'post'
            await weightingPackageSingle(_mothod, this.formData1.id || null, { data: this.formData1 })
            this.$message.success('配方用原材料流转卡,操作成功')
            this.handleClose1()
            this.loadingBtn = false
          } catch (e) {
            this.loadingBtn = false
          }
        } else {
          return false
        }
      })
    },
    // 第二个结束
    // 第三个开始
    async getManualList2() {
      try {
        let data = []
        this.$set(this.formData2, 'material_name', null)
        this.$set(this.formData2, 'single_weight', null)
        this.materialList1 = []
        const { results } = await materialsUrl('get', null, { params: { all: 1, mc_code: 1 }})
        data = results
        this.materialList1 = data || []
      } catch (e) {
        //
      }
    },
    async changeMaterial1(val) {
      this.formData2.split_num = 1
      this.formData2.print_count = 1
      this.formData2.begin_trains = 1
      this.formData2.package_count = 1
      this.formData2.expire_day = 5
      if (val) {
        const obj = this.materialList1.find(d => d.material_name === val)
        this.formData2.single_weight = obj.actual_weight
        this.formData2.feeding_mode = obj.feeding_mode
        if (this.formData2.split_num) {
          const a = this.formData2.single_weight / this.formData2.split_num
          const b = Math.round(a * 1000) / 1000
          this.$set(this.formData2, '_single_weight', b)
        }
        await this.getWeight()
      }
      await this.getHistory2()
    },
    async getWeight() {
      try {
        const data = await weightingPackageSingle('get', null, { params: { material_name: this.formData2.material_name, weight: 1 }})
        this.formData2.single_weight = data || null
      } catch (e) {
        //
      }
    },
    async getHistory2() {
      try {
        const data = await weightingPackageSingle('get', null, { params: { history: 1, material_name: this.formData2.material_name }})
        Object.assign(this.formData2, data)
      } catch (e) {
        //
      }
    },
    handleClose2() {
      this.formData2 = {
        split_num: 1,
        batching_type: '通用',
        print_count: 1,
        begin_trains: 1,
        package_count: 1,
        expire_day: 1,
        single_weight: ''
      }
      setTimeout(() => {
        this.$refs.formRef2.clearValidate()
      }, 200)
    },
    submitFun2() {
      this.$refs.formRef2.validate(async(valid) => {
        if (valid) {
          try {
            this.loadingBtn = true
            const _mothod = this.formData2.id ? 'put' : 'post'
            await weightingPackageSingle(_mothod, this.formData2.id || null, { data: this.formData2 })
            this.$message.success('通用化工流转卡,操作成功')
            this.handleClose2()
            this.loadingBtn = false
          } catch (e) {
            this.loadingBtn = false
          }
        } else {
          return false
        }
      })
    }
    // 第三个结束
  }
}
</script>

<style scoped>
.singleCard-style{
    /* min-width: 1000px; */
/* overflow-x: scroll; */
}
    .border-style{
        border:1px solid #000;
        padding-left: 10px;
    }
    .dialog-footer{
        display: inline-block;
            width: 97%;
        margin:10px 0;
        text-align: right;
    }
    .btn-style{
        position:absolute;
        bottom:0px;
        right:10px;
    }
</style>
