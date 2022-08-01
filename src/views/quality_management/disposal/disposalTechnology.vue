<template>
  <div class="disposalTechnology">
    <!-- 不合格处置工艺技术科处理 -->
    <el-form :inline="true">
      <el-form-item label="处置日期" class="dateStyle">
        <el-date-picker
          v-model="search.date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="changeDate"
        />
      </el-form-item>
      <!-- <el-form-item label="发生部门">
        <el-select
          v-model="search.department"
          clearable
          placeholder="请选择"
          @change="changeDate"
        >
          <el-option
            v-for="item in ['准备分厂','加硫车间','混炼车间','硫磺车间','细料车间']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item label="不合格状态">
        <el-select
          v-model="search.status"
          clearable
          placeholder="请选择"
          @change="changeDate"
        >
          <el-option
            v-for="item in ['来料','半成品']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="处置单号" class="dateStyle">
        <el-input
          v-model="search.unqualified_deal_order_uid"
          clearable
          @input="debounceList"
        />
      </el-form-item>
      <!-- <el-form-item label="是否已处理">
        <el-select
          v-model="search.t_solved"
          clearable
          placeholder="请选择"
          @change="changeDate"
        >
          <el-option
            v-for="item in [{name:'已处理',id:'Y'},{name:'未处理',id:'N'}]"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item> -->
    </el-form>
    <h3>不合格品 处置单列表</h3>
    <el-table
      :data="tableData"
      style="width: 100%;"
      border
      :row-class-name="tableRowClassName"
      max-height="500px"
    >
      <el-table-column
        prop="unqualified_deal_order_uid"
        label="处置单号"
        min-width="20"
      />
      <el-table-column
        prop="deal_date"
        label="处置日期"
        min-width="20"
      />
      <el-table-column
        prop="department"
        label="发生部门"
        min-width="20"
      />
      <el-table-column
        prop="status"
        label="不合格状态"
        min-width="20"
      />
      <el-table-column
        prop="t_deal_user"
        label="是否已处理"
        min-width="20"
        :formatter="(row)=>{
          return row.t_deal_user?'已处理':'未处理'
        }"
      />
      <el-table-column
        prop="address"
        label="操作"
        width="200"
      >
        <template slot-scope="scope">
          <el-button
            v-permission="['tech_unqualified_order','add']"
            type="primary"
            size="mini"
            :disabled="isDisabled"
            @click="dealFun(scope.row,scope.$index)"
          >处理
          </el-button>
          <el-button
            type="primary"
            size="mini"
            @click="viewFun(scope.row)"
          >查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <page
      :old-page="false"
      :total="total"
      :current-page="search.page"
      @currentChange="currentChange"
    />
    <el-alert
      style="color:black"
      title="表格背景色说明：绿色为处理中处置单"
      type="success"
    />
    <h3 style="margin-top:1em">不合格品 处置单详情</h3>
    <el-table
      :data="tableData1"
      style="width: 100%;margin-bottom: 10px;"
      row-key="id"
      max-height="500px"
      border
      :default-expand-all="false"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column
        prop="ordering"
        label="序号"
        min-width="8"
        align="right"
        header-align="left"
      />
      <el-table-column
        label="选择"
        min-width="8"
      >
        <template slot="header" slot-scope="{row}">
          <el-checkbox
            v-model="checkedAll"
            @change="handleCheckAllChange"
          />
          <span v-if="false">{{ row }}</span>
        </template>
        <template slot-scope="{row}">
          <el-checkbox
            v-model="row.checked"
            :disabled="row.forbidden"
            :indeterminate="row.isIndeterminate"
            @change="handleCheckChange($event,row)"
          />
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="unqualified_deal_order_uid"
        label="处置单号"
        min-width="20"
      /> -->
      <el-table-column
        label="日期/班次"
        min-width="20"
        :formatter="(row)=>{
          if(row.factory_date){
            let a = row.factory_date.split('-')[1]
            let b = row.factory_date.split('-')[2]
            return (a+'/'+b) +' - '+(row.classes||'')
          }
        }"
      />
      <el-table-column
        prop="equip_no"
        label="生产机台"
        min-width="10"
      />
      <el-table-column
        prop="product_no"
        label="胶料规格"
        min-width="20"
      />
      <el-table-column
        prop="train"
        label="车次"
        min-width="10"
      />
      <el-table-column
        prop="reason"
        label="生产过程-原因及程度"
        min-width="40"
      />
      <el-table-column
        prop=""
        label="不合格描述"
        min-width="40"
      >
        <template slot-scope="{row}">
          {{ row.unqualifiedDescribe }}
        </template>
      </el-table-column>
    </el-table>
    <div style="width:100%;textAlign:center">
      <el-button
        size="mini"
        type="primary"
        icon="el-icon-arrow-down"
        @click="addOpinions"
      />
    </div>
    <h3>不合格品 处理意见</h3>
    <div style="text-align:right;margin-top:-35px;margin-bottom:8px;">
      <el-button
        v-permission="['tech_unqualified_order','add']"
        size="mini"
        type="primary"
        @click="unqualifiedFun"
      >不合格处理
      </el-button>
    </div>
    <el-table
      :data="tableData2"
      style="width: 100%;"
      border
    >
      <el-table-column
        prop="ordering"
        label="序号"
        min-width="10"
        :formatter="d=>{
          return d.ordering.join(',')
        }"
      />
      <el-table-column
        prop="_showTrain"
        label="车次"
        min-width="20"
      />
      <el-table-column
        prop="address"
        label="处理类型"
        min-width="20"
      >
        <template slot-scope="{row}">
          <el-switch
            v-model="row.is_release"
            active-text="放行"
            inactive-text="不放行"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="处理意见"
        min-width="20"
      >
        <template slot-scope="{row}">
          <el-autocomplete
            v-model="row.suggestion"
            :fetch-suggestions="querySearch"
            placeholder="请输入内容"
            clearable
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="操作"
        width="100"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="deleteFun(scope.row,scope.$index)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :visible.sync="handleCardDialogVisible"
      width="800px"
      :fullscreen="false"
    >
      <excel
        ref="handleCard"
        :order-row="currentRow"
        :form-head-data="formHeadData"
        :list-data-props="currentRow.deal_details"
        :edit-type="2"
        :is-edit="isEdit"
        :show="handleCardDialogVisible"
        @preserveFun="preserveFun"
        @cancelFun="cancelFun"
      />
    </el-dialog>
  </div>
</template>

<script>
import page from '@/components/page'
import { debounce } from '@/utils'
import { globalCodesUrl, unqualifiedDealOrders } from '@/api/base_w'
import { dataPoint } from '@/api/jqy'
import excel from '../disposal-list-components/excelNew'
export default {
  name: 'DisposalTechnology',
  components: { page, excel },
  data() {
    return {
      search: {
        t_solved: 'N'
      },
      tableData: [],
      total: 0,
      loading: false,
      isDisabled: false,
      checkedAll: false,
      isEdit: false,
      handleCardDialogVisible: false,
      formHeadData: [],
      tableData1: [
      // {
      //   id: 2,
      //   ordering: 2,
      //   train: '5-7,8-2',
      //   children: [{
      //     faId: 2,
      //     id: 5,
      //     train: '5-7'
      //   }, {
      //     faId: 2,
      //     id: 6,
      //     train: '8-2'
      //   }]
      // }
      ],
      tableData2: [],
      restaurants: [],
      currentRow: {}
    }
  },
  created() {
    this.getDataPoint()
    this.getList()
    this.getResolution()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await unqualifiedDealOrders('get', null, { params: this.search })
        this.tableData = data.results
        this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    async getResolution() {
      try {
        const data = await globalCodesUrl('get', { params: { class_name: '处理意见' }})
        this.restaurants = data.results
        this.restaurants.forEach(d => { d.value = d.global_name })
      } catch (e) {
        //
      }
    },
    async getDataPoint() {
      try {
        const data = await dataPoint('get')
        this.formHeadData = data || []
      } catch (e) {
        this.formHeadData = []
      }
    },
    async preserveFun(obj) {
      try {
        const paramsData = {
          status: obj.status,
          t_deal_suggestion: obj.t_deal_suggestion,
          t_deal_date: obj.t_deal_date,
          t_deal_user: obj.t_deal_user,
          tech_deal_result: this.tech_deal_result
        }
        if (this.$refs.handleCard) {
          this.$refs.handleCard.loadingBtn = true
        }
        await unqualifiedDealOrders('patch', obj.id, { data: paramsData })
        this.$message.success('处理成功！！！！')
        if (this.$refs.handleCard) {
          this.$refs.handleCard.loadingBtn = false
        }
      } catch (e) {
        if (this.$refs.handleCard) {
          this.$refs.handleCard.loadingBtn = false
        }
      }
    },
    cancelFun() {
      this.handleCardDialogVisible = false
    },
    changeDate() {
      this.search.st = this.search.date ? this.search.date[0] : ''
      this.search.et = this.search.date ? this.search.date[1] : ''
      this.search.page = 1
      this.getList()
    },
    debounceList() {
      this.search.page = 1
      debounce(this, 'getList')
    },
    currentChange(page, page_size) {
      this.search.page = page
      this.search.page_size = page_size
      this.getList()
    },
    clearTable() {
      this.tableData1 = []
      this.tableData2 = []
      this.checkedAll = false
    },
    viewFun(row) {
      this.currentRow = { id: row.id }
      this.isEdit = false
      this.handleCardDialogVisible = true
    },
    async dealFun(row, index) {
      this.clearTable()
      try {
        this.tableData.forEach((d, i) => {
          if (i === index) {
            d.timeout_color = true
          } else {
            d.timeout_color = false
          }
        })
        this.isDisabled = true
        const data = await unqualifiedDealOrders('get', row.id)
        this.tableData1 = data ? data.deal_details : []
        this.tableData1.forEach(d => {
          d.unqualifiedDescribe = ''
          d.test_data.forEach(DD => {
            DD.judged_lower_limit = DD.judged_lower_limit ? DD.judged_lower_limit : ''
            DD.judged_upper_limit = DD.judged_upper_limit ? DD.judged_upper_limit : ''
            let c = false
            if (!DD.judged_lower_limit && !DD.judged_upper_limit) {
              c = true
            }
            d.unqualifiedDescribe += DD.data_point_name + ': ' + DD.min_value + '-' + DD.max_value +
            (c ? '' : '\r(') + DD.judged_lower_limit + (c ? '' : '-') + DD.judged_upper_limit + (c ? '' : ')') + ';\n'
          })
          d.children = d.trains
          d.train = ''
          d.children.forEach((D, i) => {
            D.unqualifiedDescribe = ''
            for (const key in D.pallet_test_data) {
              if (Object.hasOwnProperty.call(D.pallet_test_data, key)) {
                const element = D.pallet_test_data[key]
                element.judged_lower_limit = element.judged_lower_limit ? element.judged_lower_limit : ''
                element.judged_upper_limit = element.judged_upper_limit ? element.judged_upper_limit : ''
                element.test_min_value = element.test_min_value ? element.test_min_value : ''
                element.test_max_value = element.test_max_value ? element.test_max_value : ''
                let a = false
                if (!element.test_min_value && !element.test_max_value) {
                  a = true
                }
                let b = false
                if (!element.judged_lower_limit && !element.judged_upper_limit) {
                  b = true
                }
                D.unqualifiedDescribe += key + ': ' + element.test_min_value + (a ? '' : '-') + element.test_max_value +
            (b ? '' : '\r(') + element.judged_lower_limit + (b ? '' : '-') + element.judged_upper_limit + (b ? '' : ')') + ';\n'
              }
            }
            D.faId = d.ordering
            d.train += D.train + (d.children.length - 1 === i ? '' : ',')
          })
          d.hasChildren = d.children.length <= 1
          d.id = d.ordering
          d.unqualified_deal_order_uid = data.unqualified_deal_order_uid
        })
        this.currentRow = data
        this.isDisabled = false
      } catch (e) {
        this.isDisabled = false
      }
    },
    handleCheckChange(bool, row) {
      if (row.ordering) {
        // 点击的父选择器
        row._checkedStr = []
        row.children.forEach((d) => {
          if (d.forbidden) {
            return
          }
          row._checkedStr.push(d.train)
          this.$set(d, 'checked', bool)
        })
        this.$set(row, 'isIndeterminate', false)
      } else {
        // 点击的子选择器
        const faIndex = this.tableData1.findIndex(d => d.id === row.faId)
        const faRow = this.tableData1[faIndex]

        const arr = []
        faRow.children.forEach(d => {
          if (d.checked) {
            arr.push(d.train)
          }
        })
        faRow._checkedStr = arr

        faRow.checked = faRow._checkedStr.length === faRow.children.length
        this.$set(faRow, 'isIndeterminate', (faRow._checkedStr.length !== faRow.children.length) && faRow._checkedStr.length > 0)
      }
      const _bool = this.tableData1.every(d => d.checked)
      this.checkedAll = _bool
    },
    handleCheckAllChange(bool) {
      this.tableData1.forEach(D => {
        if (D.forbidden) {
          return
        }
        const arr = []
        this.$set(D, 'checked', bool)
        if (D.children) {
          D.children.forEach(d => {
            if (d.forbidden) {
              return
            }
            arr.push(d.train)
            this.$set(d, 'checked', bool)
          })
        }
        D._checkedStr = arr
      })
    },
    addOpinions() {
      const obj = { ordering: [], '车次': [] }
      obj._showTrainExcel = ''
      obj._showTrain = ''
      this.tableData1.forEach((d, index) => {
        let arr = []
        let _arr = []
        if (d.checked) {
          // forbidden 选择过不让再选择得标识
          this.$set(d, 'forbidden', true)
        }
        d.children.forEach(D => {
          if (D.checked && !D.forbidden) {
            obj.ordering.push(d.ordering)
            this.$set(D, 'forbidden', true)

            arr.push(d.ordering + '(' + D.train + ')')
            _arr.push(d.ordering + '(' + D.train + ')')

            obj['车次'].push({ id: D.id, ordering: d.ordering, train: D.train })
          }
        })

        if (arr.length === d.children.length) {
          arr = []
          _arr = [d.ordering]
        }
        if (arr.length > 0) {
          obj._showTrain += arr.join(',') + (index !== this.tableData1.length - 1 ? ';' : '')
        }
        if (_arr.length > 0) {
          obj._showTrainExcel += _arr.join(',') + (index !== this.tableData1.length - 1 ? ';' : '')
        }
      })
      if (obj.ordering.length === 0) {
        return
      }
      obj.ordering = [...new Set(obj.ordering)]
      obj._showTrain = obj._showTrain.substring(obj._showTrain.length - 1) === ';'
        ? obj._showTrain.substring(0, obj._showTrain.length - 1) : obj._showTrain
      obj._showTrainExcel = obj._showTrainExcel.substring(obj._showTrainExcel.length - 1) === ';'
        ? obj._showTrainExcel.substring(0, obj._showTrainExcel.length - 1) : obj._showTrainExcel
      if (obj.ordering.length > 0 && !obj._showTrain) {
        obj._showTrainExcel = ''
      }

      if (obj.ordering.length === 1 && obj._showTrain) {
        let ccc = ''
        const fff = obj._showTrain.split(',')
        fff.forEach((d, index) => {
          const bbbb = d.match(/\((\S*)\)/)[1]
          ccc += bbbb + (index !== fff.length - 1 && fff.length > 1 ? ',' : '')
        })
        obj._showTrain = ccc
        obj._showTrainExcel = ccc
      }
      this.tableData2.push(obj)
    },
    deleteFun(row, index) {
      this.tableData2.splice(index, 1)
      this.tableData1.forEach(d => {
        let bool = false
        d.children.forEach(data => {
          const i = row['车次'].findIndex(D => D.ordering === d.ordering && data.train === D.train)
          if (i > -1) {
            bool = true
            data.checked = false
            data.forbidden = false
            d.checked = false
            d.forbidden = false
            const ii = d._checkedStr.findIndex(da => da === row['车次'][i].train)
            if (ii > -1) {
              d._checkedStr.splice(ii, 1)
            }
          }
        })
        if (bool && d._checkedStr.length !== 0) {
          this.$set(d, 'isIndeterminate', true)
        } else {
          this.$set(d, 'isIndeterminate', false)
        }
      })
      this.checkedAll = false
    },
    unqualifiedFun() {
      const bool = this.tableData1.every(d => d.forbidden)
      if (!bool || this.tableData2.length === 0) {
        this.$message.info('处置单详情未处理完')
        return
      }
      try {
        const bool = this.tableData2.every(d => d.suggestion)
        if (!bool) {
          this.$message.info('请添加处理意见')
          return
        }
        const arr = []
        let t_deal_suggestion = ''
        this.tableData2.forEach(d => {
          d['车次'].forEach(D => {
            arr.push({ suggestion: d.suggestion, is_release: !!d.is_release, id: D.id })
          })
          t_deal_suggestion += '序号' + d.ordering.join(',') + '：' + d._showTrainExcel + (d.is_release ? '放行,' : '不放行,') + d.suggestion + '\r'
        })
        this.tech_deal_result = arr
        this.currentRow.t_deal_suggestion = t_deal_suggestion
        this.isEdit = true
        this.handleCardDialogVisible = true
      } catch (e) {
        //
      }
    },
    querySearch(queryString, cb) {
      var restaurants = this.restaurants
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1)
      }
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.timeout_color) {
        return 'green-row'
      }
    }
  }
}
</script>
<style lang="scss">
.disposalTechnology{
  h3{
    margin-top:0;
  }
  .el-form-item__content{
    width:150px !important;
  }
  .dateStyle{
    .el-form-item__content{
       width:auto !important;
    }
  }
  .green-row{
    background: greenyellow;
  }
}

</style>
