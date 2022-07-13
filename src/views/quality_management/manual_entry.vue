<template>
  <div v-loading="loading" class="manual_entry_style">
    <el-form :inline="true">
      <el-form-item label="工厂日期：">
        <el-date-picker
          v-model="search.factory_date"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
          @change="pageOne"
        />
      </el-form-item>
      <el-form-item label="生产机台：">
        <equip-select
          :equip_no_props.sync="search.equip_no"
          @changeSearch="pageOne"
        />
      </el-form-item>
      <el-form-item label="班次：">
        <class-select @classSelected="classSelected" />
      </el-form-item>
      <el-form-item label="胶料：">
        <all-product-no-select :params-obj="search" @productBatchingChanged="productBatchingChanged" />
      </el-form-item>
    </el-form>
    <el-table
      v-if="tableDataStyle.length>0&&tableDataChild.length>0"
      :data="[{}]"
      border
      class="rigthTable"
      width="100%"
    >
      <el-table-column
        v-for="(valItem,i) in tableDataStyle"
        :key="i"
        :label="valItem.test_indicator"
        :width="i===0?'300':'auto'"
      >
        <template v-if="valItem.methods.length>0">
          <el-radio
            v-for="(itemData,ik) in valItem.methods"
            :key="ik"
            v-model="valItem.checkedC"
            :label="itemData"
            :disabled="!itemData.allowed"
            @change="changeMethods(valItem.test_indicator,valItem)"
          >
            {{ itemData.name }}
          </el-radio>
          <span v-if="false">{{ scope.row }}</span>
          <br>
          <el-button style="margin-top:5px" size="mini" @click="clearRadio(valItem,i)">清除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button
      v-permission="['test_result','add']"
      :loading="loadingBtn"
      style="float:right;margin:10px 0"
      @click="submitTable"
    >保 存</el-button>
    <el-button
      style="float:right;margin:10px 10px"
      @click="templateDownload"
    >下载模板</el-button>
    <el-upload
      style="float:right;margin:10px 0"
      action="string"
      accept=".xls, .xlsx"
      :http-request="Upload"
      :show-file-list="false"
    >
      <el-button v-permission="['test_result','add']">导入</el-button>
    </el-upload>
    <el-table
      ref="table"
      :data="tableDataChild"
      border
    >
      <el-table-column
        key="5"
        type="index"
        width="50"
        label="No"
      />
      <el-table-column
        key="4"
        label="生产信息"
        align="center"
      >
        <el-table-column
          prop="product_no"
          label="胶料编码"
        />
        <el-table-column
          prop="lot_no"
          label="收皮条码"
        />
        <el-table-column
          prop="classes"
          label="班次"
        />
        <el-table-column
          prop="equip_no"
          label="生产机台"
        />
        <el-table-column
          prop="actual_trains"
          label="车次"
        />
      </el-table-column>
      <div key="1">
        <div v-for="(itemTa,iTa) in changeTable" :key="iTa">
          <el-table-column
            v-if="JSON.stringify(itemTa.checkedC) !== '{}'"
            :label="itemTa.test_indicator"
            align="center"
          >
            <el-table-column
              v-for="(itemChild,indexChild) in itemTa.checkedC.data_points"
              :key="indexChild"
            >
              <template slot="header">
                <div @click="clickValue(itemTa.test_indicator,itemChild.name)">
                  {{ itemChild.name }}
                  <i class="el-icon-edit" />
                </div>
              </template>
              <template
                v-if="itemChild.name"
                slot-scope="scope"
              >
                <el-input
                  v-if="scope.row._list[itemTa.test_indicator]
                    &&scope.row._list[itemTa.test_indicator][itemChild.name]"
                  :ref="'elInputNumber'+scope.$index"
                  v-model="scope.row._list[itemTa.test_indicator][itemChild.name].value"
                  controls-position="right"
                  :label="itemTa.test_indicator+'-'+itemChild.name"
                  @keyup.38.native.prevent="upKeyFun(scope.row,scope.$index,indexChild,itemTa.test_indicator+'-'+itemChild.name)"
                  @keyup.40.native.prevent="downKeyFun(scope.row,scope.$index,indexChild,itemTa.test_indicator+'-'+itemChild.name)"
                  @change="detectionValue(scope.row,scope.$index,scope.row._list,itemTa.test_indicator,itemChild.name)"
                />
                <!-- type="number"
                :step="itemTa.test_indicator==='比重'?0.02:1" -->

                <!-- 37左 38上 39右 40下 -->
                <!-- <el-dropdown
                  v-if="commandList(itemTa.test_indicator).length>0"
                  trigger="click"
                  @command="handleCommand($event,scope.$index,scope.row._list,itemTa.test_indicator,itemChild.name,scope.row)"
                >
                  <el-input-number
                    v-if="scope.row._list[itemTa.test_indicator]
                      &&scope.row._list[itemTa.test_indicator][itemChild.name]"
                    v-model="scope.row._list[itemTa.test_indicator][itemChild.name].value"
                    controls-position="right"
                    :min="0"
                    :step="itemTa.test_indicator==='比重'?0.02:1"
                    @change="detectionValue(scope.row,scope.$index,scope.row._list,itemTa.test_indicator)"
                  />
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="(itemCommand,indexCommand) in commandList(itemTa.test_indicator)" :key="indexCommand" style="width:150px" :command="itemCommand">{{ itemCommand }}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown> -->

                <!-- <el-input
                  v-if="scope.row._list[itemTa.test_indicator]
                    &&scope.row._list[itemTa.test_indicator][itemChild.name]"
                  v-model="scope.row._list[itemTa.test_indicator][itemChild.name].value"
                  placeholder="请输入检测值"
                  @change="detectionValue(scope.row,scope.$index,scope.row._list)"
                /> -->
              </template>
            </el-table-column>
            <el-table-column
              label="试验方法"
            >
              <template slot-scope="scope">
                {{ itemTa.checkedC.name }}
                <span v-if="false">{{ scope.row }}</span>
              </template>
            </el-table-column>
          </el-table-column>
        </div>
      </div>
      <el-table-column key="2" label="备注">
        <template slot-scope="scope">
          <el-input
            :ref="'noteInput'+scope.$index"
            v-model="scope.row.note"
            placeholder="请输入内容"
            @keyup.38.native.prevent="upKeyFun(scope.row,scope.$index)"
            @keyup.40.native.prevent="downKeyFun(scope.row,scope.$index)"
          />
        </template>
      </el-table-column>
      <el-table-column key="3" label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="deleteFunction(scope.$index)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <view-dialog-trial
      :show="dialogVisible"
      @handleClose="dialogVisible = false"
    />

    <el-dialog
      title="编辑"
      :visible.sync="dialogVisibleEdit"
      width="600px"
    >
      <el-form label-width="100px">
        <el-form-item label="检测值">
          <el-input-number v-model="allValue" />
        </el-form-item>
        <el-form-item label="起止车次">
          <el-input-number v-model="begin_trains" style="width:130px" controls-position="right" :min="1" :max="end_trains" />-
          <el-input-number v-model="end_trains" style="width:130px" controls-position="right" :min="begin_trains" :max="99999" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="allValueSure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { palletFeedBacksUrl, matTestIndicatorMethods, materialTestOrders, palletTrainsFeedbacks, importMaterialMestMrders, importMaterialTestOrders, productTestValueHistory } from '@/api/base_w'
import { setDate, deepClone } from '@/utils/index'
// import planSchedulesSelect from '@/components/PlanSchedulesSelect'
import equipSelect from '@/components/select_w/equip'
import classSelect from '@/components/ClassSelect'
import allProductNoSelect from '@/components/select_w/allProductNoSelect'
import viewDialogTrial from '@/components/select_w/viewDialogTrial'
// import manualEntryRadio from './manual_entry_components/index'
// import page from '@/components/page'
export default {
  name: 'ManualEntry',
  components: { equipSelect, classSelect, allProductNoSelect, viewDialogTrial },
  data() {
    return {
      dialogVisible: false,
      loading: false,
      total: 0,
      search: {
        ShiftRules: '',
        factory_date: setDate(),
        equip_no: '', // Z02
        classes: '', // 早班
        product_no: '' // C-FM-K504-10
      },
      tableData: [],
      tableDataStyle: [],
      tableDataChild: [],
      showTableDataChild: false,
      changeTable: [],
      loadingBtn: false,
      arr: [],
      dialogVisibleEdit: false,
      allValue: undefined,
      begin_trains: undefined,
      end_trains: undefined,
      // 当前的 指标点 和 数据点
      current_test_indicator: '',
      current_data_point_name: '',
      history_begin_trains: 0,
      history_end_trains: 0
    }
  },
  mounted() {
    // this.getList()
    // this.getTestType()
  },
  methods: {
    async getTableDataChild() {
      try {
        this.titleInfo(this.search.equip_no, '请输入生产机台')
        this.titleInfo(this.search.classes, '请输入班次')
        this.titleInfo(this.search.product_no, '请输入胶料')
        this.titleInfo(this.search.factory_date, '请输入时间')
        this.loading = true
        const data = await palletTrainsFeedbacks('get', null, { params: this.search })
        this.getTestType(this.search.product_no)
        this.tableDataChild = data || []
        this.tableDataChild.forEach((D, index) => { this.$set(D, '_index', index) })
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    titleInfo(val, error) {
      if (!val && val !== 0) {
        this.$message.info(error)
        throw new Error(error)
      }
    },
    async getList() {
      this.clearData()
      this.showTableDataChild = false
      try {
        this.loading = true
        const data = await palletFeedBacksUrl('get', null, { params: this.search })
        this.tableData = data.results || []
        this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    async getTestType(id) {
      try {
        const data = await matTestIndicatorMethods('get', null, { params: { material_no: id }})
        this.tableDataStyle = data || []
        this.tableDataStyle.forEach(D => {
          this.$set(D, 'checkedC', {})
        })
      } catch (e) {
        //
      }
    },
    changeMethods(test_indicator, valItem) {
      setDataChild(this, valItem)
    },
    clearRadio(val, index) {
      if (JSON.stringify(val.checkedC) === '{}') return
      this.$set(this.tableDataStyle[index], 'checkedC', {})
      this.$nextTick(() => {
        setDataChild(this, val)
      })
    },
    currentChange(page) {
      this.search.page = page
      this.getList()
    },
    upKeyFun(row, index, indexChild, label) {
      if (!label) {
        // 备注
        if (this.$refs['noteInput' + (index - 1)]) {
          const noteInput = (this.$refs['noteInput' + (index - 1)])
          noteInput.focus()
        }
        return
      }
      if (this.$refs['elInputNumber' + (index - 1)]) {
        const dom = (this.$refs['elInputNumber' + (index - 1)])
        const objDom = dom.filter(d => d.label === label)
        objDom[0].focus()
      }
    },
    downKeyFun(row, index, indexChild, label) {
      if (!label) {
        // 备注
        if (this.$refs['noteInput' + (index + 1)]) {
          const noteInput = (this.$refs['noteInput' + (index + 1)])
          noteInput.focus()
        }
        return
      }
      if (this.$refs['elInputNumber' + (index + 1)]) {
        const dom = (this.$refs['elInputNumber' + (index + 1)])
        const objDom = dom.filter(d => d.label === label)
        objDom[0].focus()
      }
    },
    pageOne() {
      this.getTableDataChild()
      this.tableDataStyle.forEach(D => {
        D.checkedC = {}
      })
      this.changeTable = []
    },
    // changeSearch() {
    //   this.pageOne()
    // },
    planScheduleSelected(id) {
      this.search.ShiftRules = id
      this.pageOne()
    },
    classSelected(val) {
      this.search.classes = val
      this.pageOne()
    },
    productBatchingChanged(val) {
      this.search.product_no = val ? val.material_no : ''
      this.pageOne()
    },
    rowClick(row) {
      this.getTestType(row.product_no)

      this.clearData()
      this.showTableDataChild = true

      const num = parseInt(Number(row.end_trains) - Number(row.begin_trains) + 1)
      for (let i = 0; i < num; i++) {
        const obj = JSON.parse(JSON.stringify(row))
        this.$set(obj, 'input', '')
        this.$set(obj, 'actual_trains', Number(row.begin_trains) + i)
        this.tableDataChild.push(obj)
      }
    },
    clearData() {
      // 清除下面的数据
      this.changeTable = []
      this.tableDataStyle = []
      this.tableDataChild = []
    },
    deleteFunction(index) {
      this.$confirm(
        '是否删除?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        this.tableDataChild.splice(index, 1)
      })
    },
    viewTrial() {
      this.dialogVisible = true
    },
    handleCommand(val, index, _list, test_indicator, name, row) {
      // $event,scope.$index,scope.row._list,itemTa.test_indicator,itemChild.name,scope.row
      this.$set(this.tableDataChild[index]._list[test_indicator][name],
        'value', val)
      // scope.row, scope.$index, scope.row._list
      this.detectionValue(row, index, _list)
    },
    commandList(val) {
      const a = localStorage.getItem('detectionValue')
      const obj = a ? JSON.parse(a) : {}
      if (val === '比重') {
        return obj[val] || [1.11, 1.13, 1.15]
      } else if (val === '硬度') {
        return obj[val] || [59]
      } else {
        return []
      }
    },
    detectionValue(row, index, list, test_indicator, name) {
      row._list[test_indicator][name].value = clearNoNum(row._list[test_indicator][name])

      const a = localStorage.getItem('detectionValue')
      const obj = a ? JSON.parse(a) : {}
      const arr = JSON.stringify(obj) !== '{}' && obj[test_indicator] ? obj[test_indicator] : []

      row._filledIn = false
      for (const key in list) {
        for (const value in list[key]) {
          if (list[key][value] && list[key][value].value) {
            row._filledIn = true
            if (list[test_indicator] && list[test_indicator][value] &&
            list[test_indicator][value].value) {
              arr.unshift(list[test_indicator][value].value)
              if (arr.length > 3) {
                arr.pop()
              }
              this.$set(obj, test_indicator, arr)
              localStorage.setItem('detectionValue', JSON.stringify(obj))
            }
          }
        }
      }
    },
    testMethodChange(event, val) {
      if (val) {
        for (const key in val) {
          if (val[key]) {
            this.$set(val[key], 'test_method_name', event)
          }
        }
      }
    },
    Upload(param) {
      const formData = new FormData()
      formData.append('file', param.file)
      importMaterialMestMrders(formData).then(response => {
        this.$message({
          type: 'success',
          message: '导入成功!'
        })
      })
    },
    templateDownload() {
      importMaterialTestOrders().then(response => {
        const link = document.createElement('a')
        const blob = new Blob([response], { type: 'application/vnd.ms-excel' })
        link.style.display = 'none'
        link.href = URL.createObjectURL(blob)
        link.download = '手工检测数据录入模板.xls' // 下载的文件名
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
    },
    clickValue(test_indicator_name, data_point_name) {
      this.allValue = undefined
      this.begin_trains = undefined
      this.end_trains = undefined
      this.dialogVisibleEdit = true
      this.current_test_indicator = test_indicator_name
      this.current_data_point_name = data_point_name
      this.getDefaultValue()
    },
    async getDefaultValue() {
      try {
        const obj = Object.assign({ data_point: this.current_data_point_name }, this.search)
        const data = await productTestValueHistory('get', null, { params: obj })
        if (data.max_trains) {
          this.begin_trains = data.max_trains + 1
        }
        this.history_begin_trains = data.min_trains || 0
        this.history_end_trains = data.max_trains || 0
      } catch (e) {
        //
      }
    },
    allValueSure() {
      if (!this.allValue) {
        this.dialogVisibleEdit = false
        return
      }
      const all = this.tableDataChild[this.tableDataChild.length - 1].actual_trains
      const begin_trains = this.begin_trains ? this.begin_trains : 1
      const end_trains = this.end_trains ? this.end_trains : all

      let val = ''
      if (begin_trains >= this.history_begin_trains && end_trains <= this.history_end_trains) {
        val = begin_trains + '车~' + end_trains + '车'
      } else if (begin_trains <= this.history_end_trains && begin_trains >= this.history_begin_trains) {
        val = begin_trains + '车~' + this.history_end_trains + '车'
      } else if (end_trains <= this.history_end_trains && end_trains >= this.history_begin_trains) {
        val = this.history_begin_trains + '车~' + end_trains + '车'
      }
      if (val) {
        this.$confirm(`${val}已设定检测值, 是否覆盖？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.tableDataChild.map(D => {
            if (D.actual_trains <= end_trains && D.actual_trains >= begin_trains) {
              D._list[this.current_test_indicator][this.current_data_point_name].value = this.allValue
              D._filledIn = true
              return D
            } else {
              return D
            }
          })
          this.dialogVisibleEdit = false
        }).catch(() => {
        })
      } else {
        this.tableDataChild.map(D => {
          if (D.actual_trains <= end_trains && D.actual_trains >= begin_trains) {
            D._list[this.current_test_indicator][this.current_data_point_name].value = this.allValue
            D._filledIn = true
            return D
          } else {
            return D
          }
        })
        this.dialogVisibleEdit = false
      }
    },
    async submitTable() {
      const arr = []
      try {
        if (this.tableDataChild.length === 0) return
        const tableDataChild = this.tableDataChild.filter(D => { return D._filledIn })
        const tableDataChildNew = deepClone(tableDataChild)
        tableDataChildNew.forEach((D, i) => {
          const arrChild = []
          if (!D.lot_no) {
            this.$message.error('收皮条码不能为空！')
            throw new Error('收皮条码不能为空！')
          }
          if (JSON.stringify(D._list) !== '{}') {
            for (const key in D._list) {
              for (const keyChild in D._list[key]) {
                if (D._list[key][keyChild]) {
                  if (!D._list[key][keyChild].value) {
                    D._list[key][keyChild].value = null
                  }
                  arrChild.push(D._list[key][keyChild])
                }
              }
            }
          }
          arr[i] = {
            lot_no: D.lot_no,
            actual_trains: D.actual_trains,
            product_no: D.product_no,
            plan_classes_uid: D.plan_classes_uid,
            production_class: D.classes,
            production_equip_no: D.equip_no,
            production_factory_date: this.search.factory_date,
            note: D.note,
            order_results: arrChild
          }
        })
      } catch (ex) {
        return
      }
      if (arr.length === 0) {
        this.$message.error('不能为空！')
        return
      }
      this.loadingBtn = true
      try {
        await materialTestOrders('post', null, { data: arr })
        this.$message.success('录入成功')
        this.loadingBtn = false
      } catch (e) {
        this.loadingBtn = false
      }
    }
  }
}

function setDataChild(_this, row) {
  const newObjChild = {}
  const newObj = {}
  let _obj = {}
  if (JSON.stringify(row.checkedC) !== '{}') {
    const arrData_points = deepClone(row.checkedC.data_points)
    arrData_points.forEach(D => {
      const obj = {}
      _this.$set(obj, 'test_indicator_name', row.test_indicator)
      _this.$set(obj, 'data_point_name', D.name)
      _this.$set(obj, 'test_method_name', row.checkedC.name)
      _this.$set(obj, 'value', undefined)
      _obj = deepClone(obj)
      _this.$set(newObjChild, D.name, _obj)
    })
    Object.assign(newObj, { [row.test_indicator]: newObjChild })
  }

  const changeTableNum = _this.changeTable.findIndex(D => D.test_indicator === row.test_indicator)
  if (changeTableNum > -1) {
    if (JSON.stringify(row.checkedC) === '{}') {
      _this.tableDataChild.forEach(D => {
        delete D._list[row.test_indicator]
      })
      _this.changeTable.splice(changeTableNum, 1)
    } else {
      _this.changeTable[changeTableNum] = row
    }
  } else {
    _this.changeTable.push(row)
  }
  _this.tableDataChild.forEach(dd => {
    if (JSON.stringify(row.checkedC) === '{}') {
      // 清空
      delete dd._list[row.test_indicator]
      return
    }
    const _newObjChild = deepClone(newObj)
    if (!dd._list) {
      _this.$set(dd, '_list', {})
    }
    const ccc = Object.assign({}, dd._list, _newObjChild)
    _this.$set(dd, '_list', ccc)
  })
}
function clearNoNum(obj) {
  // 正数
  // 先把非数字的都替换掉，除了数字和.
  obj.value = obj.value.replace(/[^\d.]/g, '')
  // 保证只有出现一个.而没有多个.
  obj.value = obj.value.replace(/\.{2,}/g, '.')
  // 必须保证第一个为数字而不是.
  obj.value = obj.value.replace(/^\./g, '')
  // 保证.只出现一次，而不能出现两次以上
  obj.value = obj.value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
  // // 只能输入两个小数
  // obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d\d\d).*$/, '$1$2.$3')
  // 如果没有小数点，首位不能为类似于 01、02的金额
  if (obj.value.indexOf('.') < 0 && obj.value !== '') {
    obj.value = parseFloat(obj.value)
  }
  obj.value = obj.value.toString()
  // 如果第一位是0，第二位不是点，就用数字把点替换掉
  var len1 = obj.value.substr(0, 1)
  var len2 = obj.value.substr(1, 1)
  if (obj.value.length > 1 && Number(len1) === 0 && len2 !== '.') {
    obj.value = obj.value.substr(1, 1)
  }

  return Number(obj.value)
}
</script>

<style lang="scss">
$border-color: #EBEEF5;
$border-weight: 1px;
.manual_entry_style{
  // .rigthTable{
    // overflow-y: scroll;
    // max-height: 400px;
  // }
  .el-input-number__increase,.el-input-number__decrease{
    display: none;
    padding:0;
  }
  .el-input-number.is-controls-right .el-input__inner{
    padding-left: 1px;
    padding-right: 1px;
  }
 .train-one {
    border-color: $border-color;
    .train-one-tr-banburying {
      td {
        // line-height: 20px;
        padding: 10px;
      }
    }
  }
  .el-card{
    display: inline-block;
  }
  .el-input-number{
    width:auto;
  }

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button{
   -webkit-appearance: none !important;
   margin: 0;
}
input[type="number"]{-moz-appearance:textfield;}
}

</style>
