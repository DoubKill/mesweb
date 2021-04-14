<template>
  <div v-loading="loading" class="info_entry_style">
    <!-- 原料检测数据录入 -->
    <el-form :inline="true">
      <el-form-item label="原材料编码：">
        <all-product-no-select :type-parms="2" @productBatchingChanged="changeMaterialCode" />
      </el-form-item>
      <el-form-item label="原材料名称：">
        <all-product-no-select :type-parms="2" label-name="material_name" @productBatchingChanged="changeMaterialName" />
      </el-form-item>
      <el-form-item label="条码：">
        <el-input
          ref="lot_no_input"
          v-model="search.lot_no"
          placeholder="请输入内容"
          @input="changeListLot"
        />
      </el-form-item>
      <!-- <el-form-item label="批次号：">
        <el-input
          v-model="search.batch_no"
          placeholder="请输入内容"
          @input="changeListLot"
        />
      </el-form-item> -->
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
      v-permission="['raw_test_result','add']"
      :loading="loadingBtn"
      style="float:right;margin:10px 0"
      @click="submitTable"
    >保 存</el-button>
    <!-- <el-button
      style="float:right;margin:10px 10px"
      @click="templateDownload"
    >下载模板</el-button> -->
    <!-- <el-upload
      style="float:right;margin:10px 0"
      action="string"
      accept=".xls, .xlsx"
      :http-request="Upload"
      :show-file-list="false"
    >
      <el-button>导入</el-button>
    </el-upload> -->
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
        label="物料信息"
        align="center"
      >
        <el-table-column
          prop="in_storage_time"
          label="入库时间"
        >
          <template slot-scope="{row}">
            {{ row.in_storage_time }}
          </template>
        </el-table-column>
        <el-table-column
          prop="material_no"
          label="原材料编码"
        />
        <el-table-column
          prop="supplier_name"
          label="厂商信息"
        />
        <el-table-column
          prop="lot_no"
          label="条码"
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
                <el-input-number
                  v-if="commandList(itemTa.test_indicator).length===0
                    &&scope.row._list[itemTa.test_indicator]
                    &&scope.row._list[itemTa.test_indicator][itemChild.name]"
                  v-model="scope.row._list[itemTa.test_indicator][itemChild.name].value"
                  controls-position="right"
                  :min="0"
                  :step="itemTa.test_indicator==='比重'?0.02:1"
                  @change="detectionValue(scope.row,scope.$index,scope.row._list,itemTa.test_indicator)"
                />
                <el-dropdown
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
                </el-dropdown>
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
            v-model="scope.row.note"
            placeholder="请输入内容"
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
      width="300px"
    >
      <el-input-number v-model="allValue" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="allValueSure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { importMaterialMestMrders, importMaterialTestOrders } from '@/api/base_w'
import { matTestIndicatorMethodsRaw, materialInventory, materialTestOrdersRaw } from '@/api/base_w_three'
import { deepClone } from '@/utils/index'
// import planSchedulesSelect from '@/components/PlanSchedulesSelect'
import viewDialogTrial from '@/components/select_w/viewDialogTrial'
// import materialCodeSelect from '@/components/materialCodeSelect'
import { debounce, setDate } from '@/utils'
import allProductNoSelect from '@/components/select_w/allProductNoSelect'

// import manualEntryRadio from './manual_entry_components/index'
// import page from '@/components/page'
export default {
  components: { allProductNoSelect, viewDialogTrial },
  data() {
    return {
      dialogVisible: false,
      loading: false,
      total: 0,
      search: {
        ShiftRules: '',
        lot_no: '',
        batch_no: ''
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
      // 当前的 指标点 和 数据点
      current_test_indicator: '',
      current_data_point_name: '',
      material_id: ''
    }
  },
  mounted() {
    // this.getList()
    // this.getTestType()
  },
  methods: {
    setDate,
    async getTableDataChild() {
      try {
        if (!this.search.lot_no && !this.search.batch_no) {
          this.$message.info('请输入条码或批次号')
          return
        }
        this.loading = true
        const data = await materialInventory('get', null, { params: this.search })
        this.getTestType(this.search.lot_no)
        this.tableDataChild = data || []
        this.tableDataChild.forEach((D, index) => { this.$set(D, '_index', index) })
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    changeListLot() {
      debounce(this, 'pageOne')
    },
    titleInfo(val, error) {
      if (!val && val !== 0) {
        this.$message.info(error)
        throw new Error(error)
      }
    },
    async getTestType(id) {
      try {
        const data = await matTestIndicatorMethodsRaw('get', null, { params: { lot_no: id }})
        this.tableDataStyle = data.ret || []
        this.material_id = data.material_id || ''
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
    pageOne() {
      this.getTableDataChild()
      this.tableDataStyle.forEach(D => {
        D.checkedC = {}
      })
      this.changeTable = []
    },
    changeMaterialName(val) {
      this.search.material_name = val ? val.material_name : ''
      this.pageOne()
    },
    changeMaterialCode(val) {
      this.search.material_no = val ? val.material_no : ''
      this.pageOne()
    },
    // changeSearch() {
    //   this.pageOne()
    // },
    planScheduleSelected(id) {
      this.search.ShiftRules = id
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
    detectionValue(row, index, list, test_indicator) {
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
        link.download = '原料检测数据录入模板.xls' // 下载的文件名
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
    },
    clickValue(test_indicator_name, data_point_name) {
      this.allValue = undefined
      this.dialogVisibleEdit = true
      this.current_test_indicator = test_indicator_name
      this.current_data_point_name = data_point_name
    },
    allValueSure() {
      if (!this.allValue) {
        this.dialogVisibleEdit = false
        return
      }
      this.tableDataChild.map(D => {
        D._list[this.current_test_indicator][this.current_data_point_name].value = this.allValue
        D._filledIn = true
        return D
      })
      this.dialogVisibleEdit = false
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
            batch_no: D.batch_no,
            storage_date: setDate(D.in_storage_time),
            supplier_name: D.supplier_name,
            production_equip_no: D.equip_no,
            material: this.material_id,
            note: D.note,
            order_results_raw: arrChild
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
        await materialTestOrdersRaw('post', null, { data: arr })
        this.$message.success('录入成功')
        this.loadingBtn = false
      } catch (e) {
        this.loadingBtn = false
      }
    }
  }
}

function setDataChild(_this, row) {
  console.log(row, 4444)
  const newObjChild = {}
  const newObj = {}
  let _obj = {}
  if (JSON.stringify(row.checkedC) !== '{}') {
    const arrData_points = deepClone(row.checkedC.data_points)
    arrData_points.forEach(D => {
      const obj = {}
      _this.$set(obj, 'test_indicator_name', row.test_indicator)
      _this.$set(obj, 'data_point', D.id)
      _this.$set(obj, 'data_point_name', D.name)
      _this.$set(obj, 'test_method_name', row.checkedC.name)
      _this.$set(obj, 'test_method', row.checkedC.id)
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
</script>

<style lang="scss">
$border-color: #EBEEF5;
$border-weight: 1px;
.info_entry_style{
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
}

</style>
