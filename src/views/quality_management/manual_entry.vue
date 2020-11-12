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
        <product-no-select @productBatchingChanged="productBatchingChanged" />
      </el-form-item>
    </el-form>
    <el-table
      v-if="tableDataStyle.length>0&&tableDataChild.length>0"
      :data="[{}]"
      border
      class="rigthTable"
      width="100%"
    >
      <div v-for="(valItem,i) in tableDataStyle" :key="i">
        <el-table-column
          :label="valItem.test_indicator"
        >
          <template v-if="valItem.methods.length>0">
            <el-radio
              v-for="(itemData,ik) in valItem.methods"
              :key="ik"
              v-model="valItem.checkedC"
              :label="itemData"
              :disabled="!itemData.allowed"
              @change="changeMethods(valItem.test_indicator)"
            >
              {{ itemData.name }}
            </el-radio>
            <span v-if="false">{{ scope.row }}</span>
            <br>
            <el-button style="margin-top:5px" size="mini" @click="clearRadio(valItem,i)">清除</el-button>
          </template>
        </el-table-column>
      </div>
    </el-table>
    <el-button
      :loading="loadingBtn"
      style="float:right;margin:10px 0"
      @click="submitTable"
    >保 存</el-button>
    <el-table
      :data="tableDataChild"
      border
    >
      <el-table-column
        type="index"
        width="50"
        label="No"
      />
      <el-table-column
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
      <div v-for="(itemTa,iTa) in changeTable" :key="iTa">
        <el-table-column
          v-if="JSON.stringify(itemTa.checkedC) !== '{}'"
          :label="itemTa.test_indicator"
          align="center"
        >
          <el-table-column
            v-for="(itemChild,indexChild) in itemTa.checkedC.data_points"
            :key="indexChild"
            :label="itemChild.name"
          >
            <template
              v-if="itemChild.name"
              slot-scope="scope"
            >
              <el-input
                v-if="scope.row._list[itemTa.test_indicator]"
                v-model="scope.row._list[itemTa.test_indicator][itemChild.name].value"
                placeholder="请输入检测值"
              />
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
      <el-table-column :key="changeTable.length+1" label="备注">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.note"
            placeholder="请输入内容"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作">
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
  </div>
</template>

<script>
import { palletFeedBacksUrl, matTestIndicatorMethods, materialTestOrders, palletTrainsFeedbacks } from '@/api/base_w'
import { setDate, deepClone } from '@/utils/index'
// import planSchedulesSelect from '@/components/PlanSchedulesSelect'
import equipSelect from '@/components/select_w/equip'
import classSelect from '@/components/ClassSelect'
import productNoSelect from '@/components/ProductNoSelect'
import viewDialogTrial from '@/components/select_w/viewDialogTrial'
// import manualEntryRadio from './manual_entry_components/index'
// import page from '@/components/page'
export default {
  components: { equipSelect, classSelect, productNoSelect, viewDialogTrial },
  data() {
    return {
      dialogVisible: false,
      loading: false,
      total: 0,
      search: {
        ShiftRules: '',
        factory_date: setDate(),
        // factory_date: '2020-11-10',
        equip_no: '',
        classes: '',
        product_no: ''
      },
      tableData: [],
      tableDataStyle: [],
      tableDataChild: [],
      showTableDataChild: false,
      changeTable: [],
      loadingBtn: false,
      arr: []
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
    changeMethods(test_indicator) {
      const arr = this.tableDataStyle.filter(D =>
        JSON.stringify(D.checkedC) !== '{}'
      )
      this.arr = arr
      this.changeTable = deepClone(arr)

      setDataChild(this, test_indicator)
    },
    clearRadio(val, index) {
      this.tableDataStyle[index].checkedC = {}
      const arr = this.tableDataStyle.filter(D => {
        return JSON.stringify(D.checkedC) !== '{}'
      })
      this.changeTable = deepClone(arr)
      setDataChild(this)
    },
    currentChange(page) {
      this.search.page = page
      this.getList()
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
      this.search.product_no = val ? val.stage_product_batch_no : ''
      this.pageOne()
    },
    rowClick(row) {
      this.getTestType(row.product_no)

      this.clearData()
      this.showTableDataChild = true

      const num = (Number(row.end_trains) - Number(row.begin_trains) + 1).toFixed(0)
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
    testMethodChange(event, val) {
      if (val) {
        for (const key in val) {
          if (val[key]) {
            this.$set(val[key], 'test_method_name', event)
          }
        }
      }
    },
    async submitTable() {
      const arr = []
      try {
        if (this.tableDataChild.length === 0) return
        this.tableDataChild.forEach((D, i) => {
          const arrChild = []
          if (!D.lot_no) {
            this.$message.error('收皮条码不能为空！')
            throw new Error('收皮条码不能为空！')
          }
          if (JSON.stringify(D._list) !== '{}') {
            for (const key in D._list) {
              for (const keyChild in D._list[key]) {
                if (D._list[key][keyChild]) {
                  if (!D._list[key][keyChild].value || !D._list[key][keyChild].test_method_name) {
                    this.$message.error('每行数据类型点是必填！')
                    throw new Error('数据点是必填！')
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
            production_factory_date: D.factory_date,
            note: D.note,
            order_results: arrChild
          }
        })
      } catch (ex) {
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

function setDataChild(_this, test_indicator) {
  if (_this.changeTable.length === 0) {
    _this.tableDataChild.forEach(dd => {
      dd._list = {}
    })
  }
  const newObj = {}

  _this.changeTable.forEach((D, index) => {
    const arr1 = deepClone(D.checkedC.data_points)
    const obj = {}
    const newObjChild = {}

    arr1.forEach((data, i) => {
      _this.$set(obj, 'test_indicator_name', D.test_indicator)
      _this.$set(obj, 'data_point_name', data.name)
      _this.$set(obj, 'test_method_name', D.checkedC.name)
      _this.$set(obj, 'value', '')
      const _obj = deepClone(obj)
      _this.$set(newObjChild, data.name, _obj)
    })
    _this.$set(newObj, D.test_indicator, newObjChild)
  })
  _this.tableDataChild.forEach(dd => {
    _this.$set(dd, '_list', newObj)
  })
}
</script>

<style lang="scss" scoped>
$border-color: #EBEEF5;
$border-weight: 1px;
.manual_entry_style{
  .rigthTable{
    // overflow-y: scroll;
    // max-height: 400px;
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
}

</style>
