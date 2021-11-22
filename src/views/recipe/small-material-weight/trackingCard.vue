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
          >{{ scope.row.status === 'N'?'打印':'重新打印' }}
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
      width="750px"
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
            @change="ruleForm.package_count=1"
          />
        </el-form-item>
        <el-form-item label="配置数量" prop="package_count">
          <el-input-number
            v-model="ruleForm.package_count"
            controls-position="right"
            :min="1"
            :max="ruleForm.package_fufil+1-ruleForm.print_begin_trains"
            :step="1"
            step-strictly
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
          <td>名称</td>
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
          <td>{{ }}</td>
          <td>配置机台</td>
          <td>{{ ruleForm.equip_no }}</td>
        </tr>
        <tr>
          <td>标准重量</td>
          <td>{{ }}</td>
          <td>配料车次</td>
          <td>{{ }}</td>
        </tr>
        <tr>
          <td>配料员</td>
          <td>{{ }}</td>
          <td>有效期（天）</td>
          <td>{{ }}</td>
        </tr>
        <tr>
          <td>配料时间</td>
          <td colspan="3">{{}}</td>
        </tr>
        <tr>
          <td>打印时间</td>
          <td colspan="3">{{}}</td>
        </tr>
        <tr>
          <td>有效时间</td>
          <td colspan="3">{{}}</td>
        </tr>
      </table>
      <div style="border:1px solid #eee;margin:10px 0" />
      <el-form>
        <el-form-item label="合包配料包条码">
          <el-input v-model="barCode" style="width:300px" />
        </el-form-item>
      </el-form>
      <h3 style="text-align:center">合包配料信息</h3>
      <table
        border="1"
        bordercolor="black"
        class="info-table"
      >
        <tr>
          <td>名称</td>
          <td>{{ ruleForm.product_no }}</td>
          <td>机型</td>
          <td>{{ ruleForm.dev_type }}</td>
        </tr>
        <tr>
          <td>打印日期</td>
          <td>{{ ruleForm.product_no }}</td>
          <td>班组班次</td>
          <td>{{ ruleForm.dev_type }}</td>
        </tr>
        <tr>
          <td>单配总重</td>
          <td>{{ ruleForm.product_no }}</td>
          <td>单配件数</td>
          <td>{{ ruleForm.dev_type }}</td>
        </tr>
      </table>
      <h3 style="text-align:center">合包配料物料信息</h3>

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
import { weightingPackageLog } from '@/api/base_w_two'
import { setDate } from '@/utils'
// import axios from 'axios'

export default {
  name: 'SmallMaterialWeightTrackingCard',
  components: { SelectBatchingEquip, page },
  data() {
    return {
      formInline: {
        batch_time: setDate()
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
      barCode: ''
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
      if (done) {
        done()
      }
    },
    reprintFun(row) {
      this.dialogVisible = true
      this.ruleForm = JSON.parse(JSON.stringify(row))
      this.$set(this.ruleForm, 'print_count', 1)
    },
    submitFun() {
      this.$refs.ruleForm.validate(async(valid) => {
        if (valid) {
          try {
            this.btnLoading = true
            await weightingPackageLog('post', null, { data: this.ruleForm })
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
        min-width: 170px;
        padding-top: 10px;
        padding-bottom: 10px;
        text-align: center;
      }
    }
</style>
