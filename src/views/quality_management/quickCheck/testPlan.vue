<template>
  <div class="quickCheck-testPlan">
    <!-- 快检检测计划 -->
    <el-row :gutter="20">
      <el-col :span="11">
        <el-form ref="searchForm" :model="search" :inline="true" :rules="rulesLeft">
          <el-form-item label="检测机号">
            <el-select
              v-model="search.test_equip"
              clearable
              placeholder="请选择"
              @visible-change="changeVisibleTestEquip"
              @change="changeTestEquip"
            >
              <el-option
                v-for="group in testEquipList"
                :key="group.id"
                :label="group.no"
                :value="group.no"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="实验区分">
            <el-select
              v-model="search.test_indicator_name"
              placeholder="请选择"
              @visible-change="changeVisibleTestIndicators"
              @change="changeTestIndicators"
            >
              <el-option
                v-for="group in testIndicatorsList"
                :key="group.id"
                :label="group.name"
                :value="group.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="工厂日期">
            <el-date-picker
              v-model="search.factory_date"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              clearable
              @change="searchList"
            />
          </el-form-item>
          <el-form-item label="生产班次">
            <class-select
              @classSelected="classChanged"
            />
          </el-form-item>
          <el-form-item label="生产机号">
            <equip-select :equip_no_props="search.equip_no" @changeSearch="equipSearch" />
          </el-form-item>
          <el-form-item label="胶料规格">
            <allProductNoSelect :is-disabled="btnLoading" :default-val="search.product_no" :params-obj="search" @productBatchingChanged="productBatchingChanged" />
          </el-form-item>
          <el-form-item label="胶料段次">
            <el-select
              v-model="search.stage"
              clearable
              placeholder="请选择"
              @visible-change="visibleStageList"
              @change="getList"
            >
              <el-option
                v-for="(item,k) in stageList"
                :key="k"
                :label="item.global_name"
                :value="item.global_name"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="是否已检测">
            <el-select
              v-model="search.is_tested"
              clearable
              placeholder="请选择"
              @change="changeTested"
            >
              <el-option
                v-for="(item,k) in [{name:'已检测',id:'Y'},{name:'未检测',id:'N'}]"
                :key="k"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-form>

        <el-table
          ref="multipleTable"
          :data="tableData"
          style="width: 100%"
          border
          :cell-style="cellStyle"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            prop="equip_no"
            label="生产机号"
            min-width="10"
          />
          <el-table-column
            prop="classes"
            label="生产班次"
            min-width="10"
          />
          <el-table-column
            prop="product_no"
            label="胶料规格"
            min-width="20"
          />
          <el-table-column
            prop="actual_trains"
            label="车次"
            min-width="10"
          />
          <el-table-column
            prop="lot_no"
            label="收皮条码"
            min-width="20"
          />
          <el-table-column
            prop="is_tested"
            label="已检测"
            min-width="10"
          />
        </el-table>
      </el-col>
      <el-col :span="1" class="center-box">
        <div class="center-box-child">
          <el-button size="small" type="primary" :disabled="btnLoading" @click="moveRight">>></el-button>
        </div>
      </el-col>
      <el-col :span="12">
        <el-form ref="ruleForm" :inline="true" :rules="rules" :model="ruleForm">
          <el-form-item label="检测日期" prop="test_time">
            <el-date-picker
              v-model="ruleForm.test_time"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            />
          </el-form-item>
          <el-form-item label="检测班次" prop="test_classes">
            <class-select
              :value-default="ruleForm.test_classes"
              @classSelected="classChangedTest"
            />
          </el-form-item>
          <el-form-item label="检测班组" prop="test_group">
            <el-select
              v-model="ruleForm.test_group"
              placeholder="请选择"
              @visible-change="changeGroup"
            >
              <el-option
                v-for="group in groups"
                :key="group.id"
                :label="group.global_name"
                :value="group.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="试验方法" prop="test_method_name">
            <!-- test_method_name -->
            <el-select
              v-model="ruleForm.test_method_name"
              placeholder="请选择"
              @visible-change="changeTestMethod"
            >
              <el-option
                v-for="group in testMethodList"
                :key="group.id"
                :label="group.name"
                :value="group.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="试验次数" prop="test_times">
            <el-select
              v-model="ruleForm.test_times"
              placeholder="请选择"
            >
              <el-option
                v-for="group in 5"
                :key="group"
                :label="group"
                :value="group"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="胶料规格">
            {{ ruleForm.product_no }}
          </el-form-item>
          <el-form-item label="检测间隔">
            <el-select
              v-model="ruleForm.aaa"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="group in 5"
                :key="group"
                :label="group"
                :value="group"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="试验车次">
            <el-input-number
              v-model="ruleForm.num"
              controls-position="right"
              :min="1"
              :max="ruleForm.num1"
              size="mini"
              clearable
            /> --
            <el-input-number
              v-model="ruleForm.num1"
              size="mini"
              controls-position="right"
              :min="ruleForm.num"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-button v-permission="['examine_test_plan', 'begin']" type="primary" :disabled="btnLoading" @click="addSpace">添加</el-button>
          </el-form-item>
        </el-form>
        <el-button v-permission="['examine_test_plan', 'begin']" type="primary" :disabled="btnLoading" @click="startTestFun">开始检测</el-button>
        <el-button v-permission="['examine_test_plan', 'end']" type="primary" :disabled="endBtnLoading" @click="endTestFun">结束检测</el-button>
        <el-button type="primary" @click="refreshFun">刷新</el-button>
        <div style="float:right">
          检测计划单据号:
          <el-input
            v-model="ruleForm.plan_uid"
            :disabled="true"
          />
        </div>
        <el-table
          :data="tableDataRight"
          style="width: 100%;margin-top:10px"
          border
        >
          <el-table-column
            prop="factory_date"
            label="生产日期"
            min-width="20"
          />
          <el-table-column
            prop="classes"
            label="生产班次"
            min-width="20"
          />
          <el-table-column
            prop="equip_no"
            label="生产机号"
            min-width="20"
          />
          <el-table-column
            prop="product_no"
            label="胶料规格"
            min-width="20"
          />
          <el-table-column
            prop="actual_trains"
            label="车次"
            width="80px"
          >
            <template slot-scope="{row,$index}">
              <el-input-number v-if="row.add" v-model="row.actual_trains" style="width:113px" controls-position="right" @blur="trainsBlur(row.actual_trains,$index)" />
              <span v-else>{{ row.actual_trains }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="value"
            label="检测值"
            min-width="20"
          />
          <el-table-column
            label="状态"
            min-width="20"
            :formatter="(row)=>{
              return row.value?'已检测':'待检测'
            }"
          />
          <el-table-column
            prop="lot_no"
            label="收皮条码"
            width="100px"
          />
          <el-table-column
            label="操作"
            width="70"
          >
            <template slot-scope="{$index}">
              <el-button size="mini" type="primary" :disabled="btnLoading" @click="delRow($index)">删除</el-button>
            </template>
          </el-table-column>
        <!-- <el-table-column
          v-if="['物性','钢拔'].includes(search.test_indicator_name)"
          label="查看"
          width="70"
        >
          <template>
            <el-button size="mini" type="primary" :disabled="btnLoading" @click="showTestData">查看</el-button>
          </template>
        </el-table-column> -->
        </el-table>
        <div style="text-align:center;margin-top:5px;">
          <el-button v-permission="['examine_test_plan', 'begin']" type="primary" :disabled="btnLoading" @click="addRowFun">新增一行</el-button>
        </div>
      </el-col>
    </el-row>

    <el-dialog
      :title="search.test_indicator_name+'检测数据查看'"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      width="90%"
    >
      <el-form :inline="true">
        <el-form-item label="检测计划单据号">
          <el-input
            v-model="searchValue.aaaa"
            :disabled="true"
          />
        </el-form-item>
        <el-form-item label="物料规格">
          <el-input
            v-model="searchValue.aaaa"
            :disabled="true"
          />
        </el-form-item>
        <el-form-item label="车次">
          <el-input
            v-model="searchValue.aaaa"
            :disabled="true"
          />
        </el-form-item>
        <el-form-item label="检测方法">
          <el-input
            v-model="searchValue.aaaa"
            :disabled="true"
          />
        </el-form-item>
      </el-form>
      <el-table
        :data="tableDataValue"
        style="width: 100%"
        border
      >
        <el-table-column
          prop="date"
          label="次序（ID)"
          min-width="20"
        />
        <el-table-column
          prop="date"
          label="材料"
          min-width="20"
        />
        <el-table-column
          prop="date"
          label="检测日期"
          min-width="20"
        />
        <el-table-column
          prop="date"
          label="检测时间"
          min-width="20"
        />
        <el-table-column
          prop="date"
          label="速度(mm/min)"
          min-width="20"
        />
        <el-table-column
          v-if="search.test_indicator_name==='物性'"
          :key="1"
          label="厚度(mm)"
          min-width="20"
        >
          <template slot-scope="{row}">
            <el-input v-if="row.edit" v-model="row.aaaa" />
            <span v-else>{{ row.aaaa }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="search.test_indicator_name==='物性'"
          :key="2"
          prop="date"
          label="宽度(mm)"
          min-width="20"
        />
        <el-table-column
          v-if="search.test_indicator_name==='物性'"
          :key="3"
          prop="date"
          label="100%（Mpa）"
          min-width="20"
        >
          <template slot-scope="{row}">
            <el-input v-if="row.edit" v-model="row.aaaa" />
            <span v-else>{{ row.aaaa }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="search.test_indicator_name==='物性'"
          :key="4"
          prop="date"
          label="300%（Mpa）"
          min-width="20"
        >
          <template slot-scope="{row}">
            <el-input v-if="row.edit" v-model="row.aaaa" />
            <span v-else>{{ row.aaaa }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="search.test_indicator_name==='物性'"
          :key="5"
          prop="date"
          label="断裂强力（Mpa）"
          min-width="20"
        >
          <template slot-scope="{row}">
            <el-input v-if="row.edit" v-model="row.aaaa" />
            <span v-else>{{ row.aaaa }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="search.test_indicator_name==='物性'"
          :key="6"
          prop="date"
          label="断裂伸长（%）"
          min-width="20"
        >
          <template slot-scope="{row}">
            <el-input v-if="row.edit" v-model="row.aaaa" />
            <span v-else>{{ row.aaaa }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="search.test_indicator_name==='钢拔'"
          :key="7"
          prop="date"
          label="最大力（N)"
          min-width="20"
        >
          <template slot-scope="{row}">
            <el-input v-if="row.edit" v-model="row.aaaa" />
            <span v-else>{{ row.aaaa }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="search.test_indicator_name==='钢拔'"
          :key="8"
          prop="date"
          label="结束力（N）"
          min-width="20"
        >
          <template slot-scope="{row}">
            <el-input v-if="row.edit" v-model="row.aaaa" />
            <span v-else>{{ row.aaaa }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="date"
          label="检测结果"
          min-width="20"
        />
        <el-table-column
          prop="date"
          label="检测文件名称"
          min-width="20"
        />
        <el-table-column
          prop="date"
          label="操作"
          width="160px"
        >
          <template slot-scope="{row}">
            <el-button type="primary" @click="modifyFun(row)">{{ row.edit?'保存':'修改' }}</el-button>
            <el-upload
              style="display:inline-block"
              action="string"
              accept=".xls, .xlsx"
              :http-request="Upload"
              :show-file-list="false"
            >
              <el-button>浏览</el-button>
            </el-upload>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import classSelect from '@/components/ClassSelect'
import equipSelect from '@/components/select_w/equip'
import { globalCodesUrl, testIndicators, palletTrainsFeedbacks, matTestIndicatorMethods } from '@/api/base_w'
import { productReportEquip, productTestPlan } from '@/api/base_w_four'
import allProductNoSelect from '@/components/select_w/allProductNoSelect.vue'

export default {
  name: 'TestPlan',
  components: { classSelect, equipSelect, allProductNoSelect },
  data() {
    const validator = (rule, value, callback, _value, str) => {
      if (!_value) {
        callback(new Error(str))
      } else {
        callback()
      }
    }
    return {
      search: {
        equip_no: '', // Z01
        product_no: '', // C-3MB-A019-02
        classes: '', // 早班
        factory_date: '', // 2021-04-29 2021-07-21
        test_indicator_name: ''
      },
      loading: false,
      tableData: [],
      tableDataRight: [],
      rules: {
        test_time: { required: true, message: '请选择检测日期', trigger: 'change' },
        test_group: { required: true, message: '请选择检测班组', trigger: 'change' },
        test_method_name: { required: true, message: '请选择试验方法', trigger: 'change' },
        test_times: { required: true, message: '请选择试验次数', trigger: 'change' },
        test_classes: [
          { required: true, trigger: 'change', validator: (rule, value, callback) => {
            validator(rule, value, callback,
              this.ruleForm.test_classes, '请选择检测班次')
          } }
        ]
      },
      rulesLeft: {},
      groups: [],
      ruleForm: {},
      btnLoading: false,
      testEquipList: [],
      testIndicatorsList: [],
      endBtnLoading: false,
      stageList: [],
      alltableData: [],
      testMethodList: [],
      handleList: [],
      dialogVisible: false,
      searchValue: {},
      tableDataValue: []
    }
  },
  watch: {
  },
  created() {
    this.getTestEquipList(true)
    this.getTestIndicators(true)
  },
  methods: {
    titleInfo(val, error) {
      if (!val && val !== 0) {
        this.$message.info(error)
        throw new Error(error)
      }
    },
    async getList() {
      try {
        this.titleInfo(this.search.equip_no, '请输入生产机台')
        this.titleInfo(this.search.classes, '请输入班次')
        this.titleInfo(this.search.product_no, '请输入胶料')
        this.titleInfo(this.search.factory_date, '请输入时间')
        this.loading = true
        const data = await palletTrainsFeedbacks('get', null, { params: this.search })
        this.loading = false
        this.tableData = data
        this.alltableData = data
        this.search.is_tested = ''
      } catch (e) {
        this.loading = false
      }
    },
    async getTestEquipList(bool) {
      try {
        const data = await productReportEquip('get', null, { params: { all: 1 }})
        this.testEquipList = data
        if (bool) {
          this.search.test_equip = data[0].no
          this.getWaitPlan()
        }
      } catch (e) {
        //
      }
    },
    changeVisibleTestEquip(bool) {
      if (bool) {
        this.getTestEquipList()
      }
    },
    visibleStageList(bool) {
      if (bool) {
        globalCodesUrl('get', {
          params: {
            class_name: '胶料段次'
          }
        }).then((response) => {
          this.stageList = response.results
        }).catch(function() {
        })
      }
    },
    async getTestIndicators(bool) {
      try {
        const data = await testIndicators('get', null, { params: { all: 1 }})
        this.testIndicatorsList = data
        if (bool) {
          this.search.test_indicator_name = data[0].name
        }
      } catch (e) {
        //
      }
    },
    changeVisibleTestIndicators(bool) {
      if (bool) {
        this.getTestIndicators()
      }
    },
    async changeTestMethod(bool) {
      if (!bool) return
      try {
        const data = await matTestIndicatorMethods('get', null, { params: { material_no: this.ruleForm.product_no }})
        let arr = []
        arr = data.filter(d => d.test_indicator === this.search.test_indicator_name)
        this.testMethodList = arr[0].methods
      } catch (e) {
        //
      }
    },
    changeGroup(bool) {
      if (bool) {
        this.getClassGroup()
      }
    },
    getClassGroup() {
      globalCodesUrl('get', {
        params: {
          class_name: '班组'
        }
      }).then((response) => {
        this.groups = response.results
      }).catch(function() {
      })
    },
    changeTestEquip() {
      this.tableDataRight = []
      this.btnLoading = false
      this.ruleForm.plan_uid = ''
      this.ruleForm.product_no = ''
      this.getWaitPlan()
    },
    async getWaitPlan(bool) {
      try {
        const obj = { test_equip: this.search.test_equip }
        delete obj.plan_uid
        if (bool) {
          obj.plan_uid = this.ruleForm.plan_uid
          delete obj.test_equip
        }
        const data = await productTestPlan('get', null, { params: obj })
        if (data.results.length === 0) {
          return
        }
        if (!data.msg) {
          this.btnLoading = true
          this.ruleForm = data.results[0]
          this.tableDataRight = data.results[0].product_test_plan_detail
          this.$message.info('正在检测中')
          this.ruleForm.product_no = data.results[0].product_test_plan_detail[0].product_no
        } else {
          this.$message.info('全部检测完毕')
          this.tableDataRight = []
          this.btnLoading = false
          this.ruleForm = {}
          this.$refs.ruleForm.clearValidate()
        }
      } catch (e) {
        //
      }
    },
    changeTestIndicators() {},
    classChanged(val) {
      this.search.classes = val
      this.searchList()
    },
    classChangedTest(val) {
      this.ruleForm.test_classes = val
    },
    searchList() {
      this.search.product_no = ''
      this.getList()
    },
    equipSearch(val) {
      this.search.equip_no = val
      this.searchList()
    },
    productBatchingChanged(val) {
      this.search.product_no = val ? val.material_no : ''
      this.ruleForm.product_no = this.search.product_no
      this.tableDataRight = []
      this.getList()
    },
    changeTested(val) {
      if (!val) { this.tableData = this.alltableData } else {
        const arr = this.alltableData.filter(d => d.is_tested === val)
        this.tableData = arr
      }
    },
    handleSelectionChange(arr) {
      this.handleList = arr
    },
    startTestFun() {
      if (this.tableDataRight.length === 0) {
        this.$message.info('没有可检测数据，请添加')
        return
      }
      this.$refs.ruleForm.validate(async(valid) => {
        if (valid) {
          try {
            this.tableDataRight.forEach(d => {
              if (!d.actual_trains) {
                throw new Error('有检测数据车次未填写，请添加')
              }
            })
            this.btnLoading = true
            // this.ruleForm.test_method_name = '222'
            const obj = {
              ...this.ruleForm,
              test_indicator_name: this.search.test_indicator_name,
              test_equip: this.search.test_equip,
              product_test_plan_detail: this.tableDataRight
            }
            const { plan_uid } = await productTestPlan('post', null, { data: obj })
            this.ruleForm.plan_uid = plan_uid
            this.$message.success('已开始检测')
          } catch (e) {
            if (e.message) {
              this.$message.info(e.message)
            }
            this.btnLoading = false
          }
        } else {
          this.$message.info('请填入检测信息')
          return false
        }
      })
    },
    trainsBlur(val, index) {
      const arr = this.tableDataRight.filter(d => d.actual_trains === val)
      if (arr.length > 1) {
        this.$message.info('已经存在相同的车次')
        this.tableDataRight[index].actual_trains = undefined
      }
    },
    async endTestFun() {
      try {
        if (!this.ruleForm.plan_uid) {
          return
        }
        await productTestPlan('get', null, { params: { close: 1, plan_uid: this.ruleForm.plan_uid }})
        this.btnLoading = false
        this.$message.success('已全部结束检测')
        // this.ruleForm = {}
        this.ruleForm.plan_uid = ''
        this.tableDataRight = []
        // this.$nextTick(() => {
        // this.$refs.ruleForm.clearValidate()
        // })
      } catch (e) {
        // this.btnLoading = false
      }
    },
    refreshFun() {
      if (!this.ruleForm.plan_uid) {
        return
      }
      this.getWaitPlan(true)
    },
    showTestData() {
      this.dialogVisible = true
    },
    handleClose(done) {
      done()
    },
    Upload(param) {
      const formData = new FormData()
      formData.append('excel_file', param.file)
      // planImport('post', null, { data: formData }).then(response => {
      //   this.$message({
      //     type: 'success',
      //     message: '导入成功!'
      //   })
      // })
    },
    modifyFun(row) {
      this.$set(row, 'edit', !row.edit)
    },
    addRowFun() {
      if (!this.search.product_no) {
        this.$message.info('请选择胶料规格')
        return
      }
      const obj = {
        classes: this.search.classes,
        equip_no: this.search.equip_no,
        factory_date: this.search.factory_date,
        product_no: this.search.product_no,
        add: 1
      }
      this.tableDataRight.push(obj)
    },
    moveRight() {
      let bool
      this.handleList.forEach(d => {
        if (this.removeFun(d)) {
          bool = true
          return
        }
        this.tableDataRight.push(d)
      })
      if (bool) {
        this.$message.success('已去掉相同记录，请确认')
      } else {
        this.$message.success('已添加到右侧检测列表')
      }
    },
    removeFun(d) {
      const arr = this.tableDataRight.filter(D => d.factory_date === D.factory_date &&
        d.classes === D.classes && d.equip_no === D.equip_no &&
        d.product_no === D.product_no && d.actual_trains === D.actual_trains)
      if (arr.length > 0) {
        return true
      } else {
        return false
      }
    },
    addSpace() {
      if (!this.ruleForm.aaa) {
        this.$message.info('请选择检测间隔')
        return
      }
      if (!this.ruleForm.product_no) {
        this.$message.info('请选择胶料规格')
        return
      }
      const obj = {
        classes: this.search.classes,
        equip_no: this.search.equip_no,
        factory_date: this.search.factory_date,
        product_no: this.search.product_no
      }
      let bool = false
      let _val = this.ruleForm.num
      for (let index = this.ruleForm.num; index < this.ruleForm.num1 + 1; index++) {
        if (index === this.ruleForm.num) {
          obj.actual_trains = _val
        } else {
          _val = _val + this.ruleForm.aaa
          if (_val <= this.ruleForm.num1) {
            obj.actual_trains = _val
          } else {
            return
          }
        }
        console.log(obj.actual_trains)

        const _obj = JSON.parse(JSON.stringify(obj))
        if (!this.removeFun(_obj)) {
          this.tableDataRight.push(_obj)
        } else {
          bool = true
        }
      }
      if (bool) {
        this.$message.success('已去掉相同记录，请确认')
      } else {
        this.$message.success('已添加到右侧检测列表')
      }
    },
    delRow(index) {
      this.tableDataRight.splice(index, 1)
    },
    cellStyle(row, column, rowIndex, columnIndex) {
      if (row.row.is_tested === 'Y') {
        return 'background:#fafafa'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .quickCheck-testPlan{
    display: flex;
    .el-input{
      width:auto;
    }
    .center-box{
      position: relative;
      height: 100vh;
        .center-box-child{
          position: absolute;
          text-align: center;
          top: 50%;
          left: 50%;
          transform: translate(-50%,-50%);
        }
    }
  }
</style>
