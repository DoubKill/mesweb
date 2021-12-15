<template>
  <div>
    <!-- 料包产出-质量追踪卡管理 -->
    <el-form :inline="true">
      <el-form-item label="配料机台">
        <select-batching-equip v-model="formInline.equip" :is-default="true" :created-is="true" @changeFun="changeEquipList" />
      </el-form-item>
      <el-form-item label="配料日期">
        <el-date-picker
          v-model="formInline.batch_time"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
          :clearable="false"
          @change="changeList"
        />
      </el-form-item>
      <el-form-item label="配方号">
        <el-select
          v-model="formInline.product_no"
          clearable
          filterable
          @change="changeList"
          @visible-change="visibleChange"
        >
          <el-option
            v-for="(item, index) in option"
            :key="index"
            :label="item.recipe"
            :value="item.recipe"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否已打印">
        <el-select
          v-model="formInline.status"
          clearable
          @change="changeList"
        >
          <el-option
            v-for="(item, index) in [{label:'Y', name:'已打印'}, {label:'N', name:'未打印'}]"
            :key="index"
            :label="item.name"
            :value="item.label"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      border
    >
      <el-table-column
        prop="plan_weight_uid"
        label="计划号"
        min-width="20"
      />
      <el-table-column
        prop="product_no"
        label="配方号"
        min-width="20"
      />
      <el-table-column
        prop="dev_type"
        label="机型"
        min-width="20"
      />
      <el-table-column
        prop="plan_weight"
        label="单重/kg"
        min-width="20"
      />
      <el-table-column
        prop="equip_no"
        label="配料机台"
        min-width="20"
      />
      <el-table-column
        prop="batch_time"
        label="配料日期"
        min-width="20"
      />
      <el-table-column
        prop="print_flag"
        label="打印状态"
        min-width="20"
        :formatter="(row, column) => {
          if(!row.print_flag){
            return ''
          }
          let a = row.print_flag===1?'已生成':row.print_flag===2?'已下发':'已完成'
          return a
        }"
      />
      <el-table-column
        prop="bra_code"
        label="标签条码"
        min-width="20"
      />
      <el-table-column
        prop="package_count"
        label="配置数量"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="打印车次"
        min-width="20"
        :formatter="(row, column) => {
          if(row.begin_trains&&row.end_trains){
            return row.begin_trains+'-'+row.end_trains
          }
          return ''
        }"
      />
      <el-table-column
        prop="print_begin_trains"
        label="打印起始车次"
        min-width="20"
      />
      <el-table-column
        prop="noprint_count"
        label="未打印数量"
        min-width="20"
      />
      <el-table-column
        prop="package_fufil"
        label="完成总数"
        min-width="20"
      />
      <el-table-column
        prop="package_plan_count"
        label="计划总数"
        min-width="20"
      />
      <el-table-column
        label="操作"
        width="120"
      >
        <template slot-scope="scope">
          <el-button
            v-permission="['xl_expire_data', 'save']"
            type="primary"
            @click="reprintFun(scope.row)"
          >
            {{ !scope.row.bra_code?'打印':'重新打印' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <page
      :old-page="false"
      :total="total"
      :current-page="formInline.page"
      @currentChange="currentChange"
    />

    <el-dialog
      title="准备分厂（细料/硫磺）质量追踪卡打印"
      :visible.sync="dialogVisible"
      width="800px"
      :before-close="handleClose"
    >
      <el-form ref="ruleForm" :rules="rules" :model="ruleForm">
        <el-form-item label="起始车次" prop="print_begin_trains">
          <el-input-number
            v-model="ruleForm.print_begin_trains"
            controls-position="right"
            :min="1"
            :max="ruleForm.package_fufil"
            :step="1"
            step-strictly
            :disabled="ruleForm.bra_code?true:false"
            @change="ruleForm.package_count=1"
          />
        </el-form-item>
        <el-form-item label="配置数量" prop="package_count">
          <!-- +1-ruleForm.print_begin_trains -->
          <el-input-number
            v-model="ruleForm.package_count"
            controls-position="right"
            :min="1"
            :max="ruleForm.package_fufil"
            :step="1"
            step-strictly
            :disabled="ruleForm.bra_code?true:false"
            @change="ruleForm.print_count=1"
          />
        </el-form-item>
        <el-form-item label="打印张数" prop="print_count">
          <el-input-number
            v-model="ruleForm.print_count"
            controls-position="right"
            :min="1"
            :max="ruleForm.package_count?ruleForm.package_count:99999"
            :step="1"
            step-strictly
          />
        </el-form-item>
      </el-form>
      <table
        border="1"
        bordercolor="black"
        class="info-table"
      >
        <tr>
          <td>细料名称</td>
          <td>{{ ruleForm.product_no }}</td>
          <td>机型</td>
          <td>{{ ruleForm.dev_type }}</td>
        </tr>
        <tr>
          <td>配料日期</td>
          <td>{{ ruleForm.batch_time }}</td>
          <td>班组班次</td>
          <td>{{ ruleForm.batch_group }}/{{ ruleForm.batch_classes }}</td>
        </tr>
        <tr>
          <td>配料类型</td>
          <td>{{ ruleForm.batching_type }}</td>
          <td>配置机台</td>
          <td>{{ ruleForm.equip_no }}</td>
        </tr>
        <tr>
          <td>标准重量</td>
          <td>
            {{ ruleForm.machine_manual_weight }}{{ ruleForm.machine_manual_tolerance }}
            /包
            <br>
            ({{ ruleForm.machine_weight }}*{{ ruleForm.split_count }}+{{ ruleForm.manual_weight }}*{{ ruleForm.split_count }})
          </td>
          <td>配料车次</td>
          <td>{{ ruleForm.begin_trains+'-'+ruleForm.end_trains }}</td>
        </tr>
        <tr>
          <td>配料员</td>
          <td>{{ ruleForm.batch_user }}</td>
          <td>有效期（天）</td>
          <td>{{ ruleForm.expire_days }}</td>
        </tr>
        <!-- <tr>
          <td>配料时间</td>
          <td colspan="3">{{}}</td>
        </tr> -->
        <tr>
          <td>打印时间</td>
          <td colspan="3">{{ ruleForm.print_datetime }}</td>
        </tr>
        <tr>
          <td>有效时间</td>
          <td colspan="3">{{ ruleForm.expire_datetime }}</td>
        </tr>
      </table>
      <div style="border:1px solid #eee;margin:10px 0" />
      <el-form v-if="!ruleForm.bra_code&&ruleForm.merge_flag">
        <el-form-item label="合包配料包条码">
          <el-input v-model="barCode" style="width:300px" @input="changeBarCode" />
        </el-form-item>
      </el-form>
      <h3 v-if="ruleForm['manual_headers']&&JSON.stringify(ruleForm['manual_headers']) !== '{}'" style="text-align:center">合包配料信息</h3>
      <table
        v-if="ruleForm['manual_headers']&&JSON.stringify(ruleForm['manual_headers']) !== '{}'"
        border="1"
        bordercolor="black"
        class="info-table"
      >
        <tr>
          <td>细料名称</td>
          <td>{{ ruleForm['manual_headers'].product_no }}</td>
          <td>机型</td>
          <td>{{ ruleForm['manual_headers'].dev_type }}</td>
        </tr>
        <tr>
          <td>打印日期</td>
          <td>{{ ruleForm['manual_headers'].print_datetime }}</td>
          <td>班组班次</td>
          <td>{{ ruleForm['manual_headers'].class_group }}</td>
        </tr>
        <tr>
          <td>单配总重</td>
          <td>
            {{ ruleForm['manual_headers'].manual_weight }}{{ ruleForm['manual_headers'].manual_tolerance }}
            <br>
            ({{ ruleForm['manual_headers'].detail_manual }}+{{ ruleForm['manual_headers'].detail_machine }})
          </td>
          <td>单配件数</td>
          <td>{{ ruleForm['manual_headers'].total_nums }}</td>
        </tr>
      </table>
      <h3 v-if="ruleForm['manual_body']&&ruleForm['manual_body'].length" style="text-align:center">合包配料物料信息</h3>
      <table
        v-if="ruleForm['manual_body']&&ruleForm['manual_body'].length"
        border="1"
        bordercolor="black"
        class="info-table info-table-three"
      >
        <tr>
          <td>名称</td>
          <td>重量（kg）</td>
          <td>配料日期</td>
          <td>配料机台</td>
          <td>配料员</td>
        </tr>
        <tr v-for="(tdItem,i) in ruleForm['manual_body']" :key="i">
          <td>{{ tdItem.material_name }}</td>
          <td>{{ tdItem.single_weight }}</td>
          <td>{{ tdItem.batch_time }}</td>
          <td>{{ tdItem.batching_type }}</td>
          <td>{{ tdItem.batch_user }}</td>
        </tr>
      </table>
      <div v-if="otherNum" style="font-weight:700;margin-top:10px;">备注：有其他料包(
        {{ otherNum }}kg/车)</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose(false)">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="submitFun">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import SelectBatchingEquip from '../components/select-batching-equip'
import page from '@/components/page'
import { xlPlan } from '@/api/base_w_three'
import { getMaterialTolerance } from '@/api/base_w_five'
import { weightingPackageLog, manualPost } from '@/api/base_w_two'
import { setDate } from '@/utils'
// import axios from 'axios'

export default {
  name: 'SmallMaterialWeightTrackingCard',
  components: { SelectBatchingEquip, page },
  data() {
    return {
      formInline: {
        // batch_time: setDate(),
        batch_time: '2021-12-02'
      },
      tableData: [],
      total: 0,
      loading: false,
      dialogVisible: false,
      rules: {
        print_begin_trains: [
          { required: true, message: '请填写', trigger: 'blur' }
        ],
        package_count: [
          { required: true, message: '请填写', trigger: 'blur' }
        ],
        print_count: [
          { required: true, message: '请填写', trigger: 'blur' }
        ]
      },
      ruleForm: {},
      option: [],
      btnLoading: false,
      barCode: '',
      otherNum: 0
    }
  },
  created() {
    this.getList()
    // this._setInterval = setInterval(() => {
    //   this.getList()
    // }, 3000)
  },
  // destroyed() {
  //   clearInterval(this._setInterval)
  // },
  // deactivated() {
  //   clearInterval(this._setInterval)
  // },
  // activated() {
  //   this._setInterval = setInterval(() => {
  //     this.getList()
  //   }, 3000)
  // },
  methods: {
    async getList() {
      try {
        // const self = this
        this.loading = true
        const data = await weightingPackageLog('get', null, { params: this.formInline }
          // new axios.CancelToken(function executor(c) {
          //   self.cancel = c
          //   console.log(c)
          // })
        )
        this.total = data.count
        this.tableData = data.results || []
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    async getRecipeNo() {
      try {
        if (!this.formInline.equip_no) {
          this.$message.info('请选择配料机台')
          return
        }
        const data = await xlPlan('get', null, { params: {
          equip_no: this.formInline.equip_no,
          batch_time: this.formInline.batch_time,
          state: '完成,运行中',
          all: 1
        }})
        // date_time: '2021-05-27'
        this.option = data
      } catch (e) {
        //
      }
    },
    visibleChange(bool) {
      if (bool) {
        this.getRecipeNo()
      }
    },
    changeList() {
      // this.cancel()
      if (!this.formInline.batch_time) {
        this.$message.info('请选择配料日期')
        return
      }
      if (!this.formInline.status) {
        delete this.formInline.status
      }
      this.formInline.page = 1
      this.getList()
    },
    async changeBarCode(val) {
      try {
        if (!val) {
          return
        }
        const obj = {
          merge_flag: this.ruleForm.merge_flag,
          product_no: this.ruleForm.product_no,
          dev_type: this.ruleForm.dev_type,
          scan_bra_code: val,
          package_count: this.ruleForm.package_count,
          split_count: this.ruleForm.split_count
        }
        const data = await manualPost('post', null, { data: obj })
        const _details = data.results.details
        if (!this.ruleForm.manual_headers) {
          const _obj = {
            product_no: this.ruleForm.product_no,
            dev_type: this.ruleForm.dev_type,
            print_datetime: _details.created_date,
            class_group: _details.batch_group + '/' + _details.batch_class,
            total_nums: 0
          }
          this.$set(this.ruleForm, 'manual_headers', _obj)
          this.$set(this.ruleForm, 'manual_body', [])
          this.$set(this.ruleForm, 'manual_infos', [])
        }
        if (_details.manual_details && _details.manual_details.length) {
          // 有详情的情况
          _details.manual_details.forEach(D => {
            const arr2 = this.ruleForm.manual_body.filter(d => d.material_name === D.material_name)
            if (arr2.length) {
              throw new Error('扫码失败,有重复物料')
            }
            D.single_weight = D.standard_weight
            D.batching_type = D.batch_type
            D.batch_group = _details.batch_group
            D.batch_class = _details.batch_class
          })
          this.ruleForm.manual_body = this.ruleForm.manual_body.concat(_details.manual_details)
          this.ruleForm.manual_headers.total_nums++
          this.ruleForm.manual_infos.push({
            manual_type: data.results.manual_type,
            manual_id: data.results.manual_id
          })
        } else {
          const arr1 = this.ruleForm.manual_body.filter(d => d.material_name === _details.material_name)
          if (!arr1.length) {
            this.ruleForm.manual_body.push({
              material_name: _details.material_name,
              single_weight: _details.single_weight,
              batch_time: _details.created_date,
              batching_type: _details.batch_type,
              batch_user: _details.created_username,
              batch_group: _details.batch_group,
              batch_class: _details.batch_class
            })
            this.ruleForm.manual_infos.push({
              manual_type: data.results.manual_type,
              manual_id: data.results.manual_id
            })
          } else {
            throw new Error('扫码失败,有重复物料')
          }
          this.ruleForm.manual_headers.total_nums++
        }

        let b = 0 // 手工总重
        let c = 0 // 机配总重
        let minTime = 0
        let currentClass = ''
        this.ruleForm.manual_body.forEach(d => {
          if (!minTime) {
            minTime = (new Date(d.batch_time)).getTime()
            currentClass = d.batch_group + '/' + d.batch_class
          }
          if (minTime > (new Date(d.batch_time)).getTime()) {
            minTime = (new Date(d.batch_time)).getTime()
            currentClass = d.batch_group + '/' + d.batch_class
          }
          if (d.batching_type === '人工配') {
            b += Math.round(Number(d.single_weight) * 1000) / 1000
          } else {
            c += Math.round(Number(d.single_weight) * 1000) / 1000
          }
        })
        this.ruleForm.manual_headers.print_datetime = setDate(minTime, true)
        this.ruleForm.manual_headers.class_group = currentClass
        this.ruleForm.manual_headers.detail_machine = c
        this.ruleForm.manual_headers.detail_manual = b
        this.ruleForm.manual_headers.manual_weight = Math.round((c + b) * 1000) / 1000
        // const d = this.ruleForm._machine_manual_weight
        const e = Math.round((c + b) * 1000) / 1000
        // this.ruleForm.machine_manual_weight = Math.round((d + e) * 1000) / 1000
        this.ruleForm.manual_weight = e
        this.otherNum = Math.round((this.otherNum - (_details.detail_manual + _details.detail_machine) * Number(this.ruleForm.split_count)) * 1000) / 1000

        const tolerance = await getMaterialTolerance('get', null,
          { params: { batching_equip: this.ruleForm.equip_no, project_name: 'all',
            standard_weight: e }})
        // const toleranceAll = await getMaterialTolerance('get', null,
        //   { params: { batching_equip: this.ruleForm.equip_no, project_name: 'all',
        //     standard_weight: this.ruleForm.machine_manual_weight }})
        this.$set(this.ruleForm.manual_headers, 'manual_tolerance', tolerance || '')
        // this.$set(this.ruleForm, 'machine_manual_tolerance', toleranceAll || '')
      } catch (e) {
        if (e.message) {
          this.$message(e.message)
        }
      }
    },
    changeEquipList(val) {
      this.formInline.equip_no = val ? val.equip_no : ''
      this.changeList()
    },
    currentChange(page, page_size) {
      this.formInline.page = page
      this.formInline.page_size = page_size
      this.getList()
    },
    handleClose(done) {
      this.dialogVisible = false
      this.barCode = ''
      if (done) {
        done()
      }
    },
    reprintFun(row) {
      this.dialogVisible = true
      this.ruleForm = JSON.parse(JSON.stringify(row))
      this.$set(this.ruleForm, 'print_count', 1)
      this.$set(this.ruleForm, '_machine_manual_weight', this.ruleForm.machine_manual_weight)
      if (!this.ruleForm.bra_code && this.ruleForm.merge_flag) {
        this.otherNum = Math.round((Number(this.ruleForm.machine_manual_weight) - Number(this.ruleForm.machine_weight) * Number(this.ruleForm.split_count)) * 1000) / 1000
      }
      if (!this.ruleForm.package_count) {
        this.ruleForm.package_count = this.ruleForm.package_fufil || 0
      }
    },
    submitFun() {
      this.$refs.ruleForm.validate(async(valid) => {
        if (valid) {
          try {
            // 计算公差
            const _tolerance = this.ruleForm.machine_manual_tolerance
            let otherNum_tolerance
            if (_tolerance) {
              const lastStr = _tolerance.slice(_tolerance.length - 1)
              let _toleranceA = null
              if (lastStr === '%') {
                _toleranceA = Number(_tolerance.slice(1, _tolerance.length - 1))
                const a = _toleranceA / 100
                const b = Number(this.ruleForm.machine_manual_weight) * a
                otherNum_tolerance = Math.round(b * 1000) / 1000
              } else {
                _toleranceA = Number(_tolerance.slice(1, _tolerance.length - 2))
                otherNum_tolerance = _toleranceA
              }
            }

            if (-otherNum_tolerance > this.otherNum || otherNum_tolerance < this.otherNum) {
              this.$message.info('其他料包总数有偏差')
              return
            }
            const _api = this.ruleForm.bra_code ? 'put' : 'post'
            let _obj = JSON.parse(JSON.stringify(this.ruleForm))
            if (this.ruleForm.bra_code) {
              _obj = { print_count: this.ruleForm.print_count }
            }
            this.btnLoading = true
            await weightingPackageLog(_api, this.ruleForm.bra_code ? this.ruleForm.id : '', { data: _obj })
            this.$message.success('已下发打印')
            this.btnLoading = false
            this.dialogVisible = false
            this.getList()
          } catch (e) {
            this.btnLoading = false
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

   .info-table {
     border-collapse: collapse;
      td {
        min-width: 180px;
        padding-top: 10px;
        padding-bottom: 10px;
        text-align: center;
      }
    }
    .info-table-three{
      td {
        min-width: 150px;
      }
    }
</style>
