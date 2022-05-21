<template>
  <div>
    <!-- 发生部门发起 -->
    <el-form :inline="true">
      <el-form-item label="生产日期">
        <el-date-picker
          v-model="dateValue"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="changeSearch"
        />
      </el-form-item>
      <el-form-item label="生产班次">
        <classSelect @classSelected="classSelectedFun " />
      </el-form-item>
      <el-form-item label="生产机号">
        <selectEquip
          :equip_no_props.sync="paramsObj.equip_no"
          @changeSearch="changeSearch"
        />
      </el-form-item>
      <!-- <el-form-item label="是否已发起">
        <el-select
          v-model="search.is_deal"
          clearable
          placeholder="请选择"
          @change="changeSearch"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item label="胶料类别">
        <el-select
          v-model="search.sulfur_flag"
          placeholder="请选择"
          clearable
          @change="changeSearch"
        >
          <el-option
            v-for="item in ['加硫','无硫']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="胶料规格">
        <all-product-no-select :params-obj="paramsObj" :params-obj-must="false" @productBatchingChanged="productBatchingChanged" />
      </el-form-item>
    </el-form>
    <h3>
      不合格品车次列表
    </h3>
    <el-table
      ref="multipleTable"
      v-loading="loading"
      :data="tableData"
      border
      tooltip-effect="dark"
      style="width: 100%"
      max-height="500"
      row-key="id"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
        :reserve-selection="true"
      />
      <el-table-column
        label="日期/班次"
        min-width="130"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ scope.row.factory_date }}/{{ scope.row.classes }}
        </template>
      </el-table-column>
      <el-table-column
        prop="equip_no"
        label="生产机台"
        min-width="60"
      />
      <el-table-column
        prop="product_no"
        label="胶料规格"
        min-width="120"
      />
      <el-table-column
        label="车次"
      >
        <template slot-scope="scope">
          {{ scope.row.trains }}
        </template>
      </el-table-column>
      <el-table-column
        prop="is_deal"
        label="是否已发起"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.is_deal === true">Y</span>
          <span v-if="scope.row.is_deal === false">N</span>
        </template>
      </el-table-column>
      <el-table-column label="不合格项">
        <el-table-column
          v-for="(item,index) in form_head_data"
          :key="index"
          :label="item"
        >
          <template slot-scope="scope">
            <div
              v-if="
                scope.row.test_data.some(d=>{
                  return d.data_point_name===item
                })"
            >
              <span
                v-if="scope.row.test_data.filter(d=>{
                  return d.data_point_name===item
                })[0].min_value===
                  scope.row.test_data.filter(d=>{
                    return d.data_point_name===item
                  })[0].max_value"
              >
                {{ scope.row.test_data.filter(d=>{
                  return d.data_point_name===item
                })[0].min_value }}
              </span>
              <span v-else>
                {{ scope.row.test_data.filter(d=>{
                  return d.data_point_name===item
                })[0].min_value }}-
                {{ scope.row.test_data.filter(d=>{
                  return d.data_point_name===item
                })[0].max_value }}
              </span>
            </div>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <page
      :old-page="false"
      :total="total"
      :current-page="search.page"
      @currentChange="currentChange"
    />
    <div style="marginTop:20px;width:100%;textAlign:center">
      <el-button
        size="mini"
        type="primary"
        style="margin: 0 auto;fontSize:30px;color:white"
        icon="el-icon-arrow-down"
        @click="dialog"
      />
    </div>
    <el-dialog
      title="不合格情况 信息登录"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <span>不合格品情况：</span>
      <el-input
        v-model="textarea"
        :autosize="{ minRows: 4 }"
        style="marginTop:10px"
        type="textarea"
        placeholder="请输入内容"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="generateFun">确 定</el-button>
      </span>
    </el-dialog>
    <h3>
      不合格品 待处理清单
    </h3>
    <el-button
      v-permission="['product_unqualified_order','add']"
      type="primary"
      style="float:right;margin-bottom:20px"
      @click="creatExcel"
    >生成不合格处理单</el-button>
    <el-table
      :data="tableData2"
      border
      tooltip-effect="dark"
      style="width: 100%"
      max-height="500"
    >
      <el-table-column
        type="index"
        width="50"
        label="No"
      />
      <el-table-column
        label="日期/班次"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ scope.row.factory_date }}/{{ scope.row.classes }}
        </template>
      </el-table-column>
      <el-table-column
        prop="equip_no"
        label="生产机台"
      />
      <el-table-column
        prop="product_no"
        label="胶料规格"
      />
      <el-table-column
        label="车次"
      >
        <template slot-scope="scope">
          {{ scope.row.trains }}
        </template>
      </el-table-column>
      <el-table-column
        prop="reason"
        label="生产过程-原因及程度"
      >
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.reason"
            placeholder="请输入内容"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        min-width="40"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="move(scope)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="不合格处置单发起"
      :fullscreen="false"
      width="800px"
      :visible.sync="handleCardDialogVisible"
      center
    >
      <excel
        ref="handleCard"
        :order-row="orderRow"
        :list-data-props="tableData2"
        :form-head-data="form_head_data"
        :show="handleCardDialogVisible"
        :edit-type="1"
        @preserveFun="preserveFun"
        @cancelFun="cancelFun"
      />
    </el-dialog>
  </div>
</template>

<script>
import selectEquip from '@/components/select_w/equip'
import classSelect from '@/components/ClassSelect'
import page from '@/components/page'
import { setDate } from '@/utils'
import allProductNoSelect from '@/components/select_w/allProductNoSelect'
import excel from '.././disposal-list-components/excelNew'
import { unqualifiedDealOrders } from '@/api/base_w'
import { disposalList, dataPoint } from '@/api/jqy'
import funMixin from '.././disposal-list-components/mixin'
export default {
  name: 'DisposalLaunch',
  components: { classSelect, allProductNoSelect, excel, selectEquip, page },
  mixins: [funMixin],
  data() {
    return {
      total: 0,
      textarea: '',
      search: {
        factory_date: setDate(),
        is_deal: false
      },
      options: [{
        value: true,
        label: 'Y'
      }, {
        value: false,
        label: 'N'
      }],
      tableData: [],
      tableData1: [],
      tableData2: [],
      paramsObj: { factory_date: setDate() },
      list: [],
      dialogVisible: false,
      handleCardDialogVisible: false,
      form_head_data: [],
      loading: false,
      listData: [],
      details: [],
      orderRow: { department: '准备分厂', currentDate: setDate(), reason: '', status: '半成品' },
      dateValue: []
    }
  },
  created() {
    this.search.st = this.dateValue ? this.dateValue[0] : ''
    this.search.et = this.dateValue ? this.dateValue[1] : ''
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await disposalList('get', null, { params: this.search })
        const data1 = await dataPoint('get', null, { })
        this.form_head_data = data1
        this.total = data.count
        this.tableData = data.results
        this.tableData.forEach((d, index) => {
          const i = []
          d.test_data.forEach(d => {
            return i.push(d.data_point_name)
          })
          this.tableData[index].a = JSON.stringify(i)
        })
        this.tableData1 = JSON.parse(JSON.stringify(this.tableData))
        this.tableData2.forEach(d => {
          if (d.ids.length > 0) {
            d.ids.forEach(item => {
              this.tableData.forEach((item1, index) => {
                if (item1.id === item) {
                  this.tableData.splice(index, 1)
                }
              })
            })
            // })
          } else {
            this.tableData.forEach((item1, index) => {
              if (item1.ids) {
                if (item1.id === d.ids) {
                  this.tableData.splice(index, 1)
                }
              }
            })
          }
        })
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    dialog() {
      if (!this.listData || this.listData.length === 0) {
        // this.$message({
        //   showClose: true,
        //   message: '请勾选不合格品车次',
        //   type: 'error'
        // })
        return
      }
      this.dialogVisible = true
    },
    changeSearch() {
      this.search.st = this.dateValue ? this.dateValue[0] : ''
      this.search.et = this.dateValue ? this.dateValue[1] : ''
      this.search.factory_date = this.paramsObj.factory_date
      this.search.equip_no = this.paramsObj.equip_no
      this.search.page = 1
      this.getList()
    },
    classSelectedFun(val) {
      this.search.page = 1
      this.search.classes = val
      this.paramsObj.classes = val
      this.getList()
    },
    productBatchingChanged(val) {
      this.search.product_no = val ? val.material_no : ''
      this.getList()
    },
    handleSelectionChange(arr) {
      if (arr.some(d => { return d.is_deal === true })) {
        this.$message({
          showClose: true,
          message: '不能勾选已发起的',
          type: 'error'
        })
        this.$refs.multipleTable.clearSelection()
      } else { this.listData = arr }
    },
    generateFun() {
      if (!this.listData || this.listData.length === 0) {
        this.$message({
          showClose: true,
          message: '请勾选不合格品车次',
          type: 'error'
        })
        return
      }
      if (this.textarea === '') {
        this.$message({
          showClose: true,
          message: '请填写不合格品情况',
          type: 'error'
        })
        return
      }
      this.list.push(...this.listData)
      const _this = this
      let a = 0
      const aee = []
      let obj = {}
      // 判断逻辑
      aaa(aee)
      function aaa(aee) {
        const ac = JSON.parse(JSON.stringify(_this.listData))
        for (let index = 0; index < ac.length; index++) {
          if (aee.length === 0) {
            aee.push(ac[0])
            obj = ac[0]
            obj.ids = []
            obj.ids[0] = obj.id
          } else {
            if (ac[index].factory_date === obj.factory_date &&
            ac[index].classes === obj.classes &&
            ac[index].equip_no === obj.equip_no &&
            ac[index].product_no === obj.product_no &&
            ac[index].a === obj.a
            ) {
              const _index = aee.findIndex(d => (
                d.factory_date === obj.factory_date &&
                d.classes === obj.classes &&
                d.equip_no === obj.equip_no &&
                d.product_no === obj.product_no &&
                d.a === obj.a))
              if (_index > -1) {
                if (aee[_index].trains.split(';').every(d => { return d !== ac[index].trains })) {
                  aee[_index].trains += ';' + ac[index].trains
                  aee[_index].ids.push(ac[index].id)
                  for (let i = 0; i < aee[_index].test_data.length; i++) {
                    if (aee[_index].test_data[i].min_value) {
                      if (aee[_index].test_data[i].min_value > ac[index].test_data[i].min_value) {
                        aee[_index].test_data[i].min_value = ac[index].test_data[i].min_value
                      }
                    }
                    if (aee[_index].test_data[i].max_value) {
                      if (aee[_index].test_data[i].max_value < ac[index].test_data[i].max_value) {
                        aee[_index].test_data[i].max_value = ac[index].test_data[i].max_value
                      }
                    }
                  }
                }
              }
            } else {
              const _index = aee.findIndex(d => (
                d.factory_date === ac[index].factory_date &&
                d.classes === ac[index].classes &&
                d.equip_no === ac[index].equip_no &&
                d.product_no === ac[index].product_no &&
                d.a === ac[index].a))
              if (_index === -1) {
                ac[index].ids = []
                ac[index].ids[0] = ac[index].id
                aee.push(ac[index])
              }
            }
          }
          if (ac.length - 1 === index) {
            a++
            obj = ac[a]
            if (a < ac.length) {
              aaa(aee)
            }
          }
        }
      }
      this.listData.forEach(item => {
        this.tableData.forEach((item1, index) => {
          if (item1.id === item.id) {
            this.tableData.splice(index, 1)
          }
        })
      })
      aee.forEach(d => {
        d.reason = this.textarea
      })
      const aae = JSON.parse(JSON.stringify(aee))
      this.tableData2.push(...aae)
      this.textarea = ''
      this.dialogVisible = false
      this.$refs.multipleTable.clearSelection()
    },
    creatExcel() {
      if (!this.tableData2 || this.tableData2.length === 0) {
        return
      }
      this.details = []
      this.tableData2.forEach((a, index) => {
        if (a.ids.length > 0) {
          a.ids.forEach(item => {
            if (this.list.some(d => {
              return JSON.stringify(d.id) === JSON.stringify(item)
            })) {
              const arr = this.list.filter(item1 => {
                return JSON.stringify(item1.id) === JSON.stringify(item)
              })[0]
              arr.test_data.forEach(dd => {
                const _arr = a.test_data.filter(ddd => ddd.data_point_name === dd.data_point_name)
                if (_arr.length > 0) {
                  dd.max_value = _arr[0].max_value
                  dd.min_value = _arr[0].min_value
                }
              })
              this.details.push({ ...arr, ordering: index + 1, reason1: a.reason, test: arr.test_data })
            }
          })
        } else {
          if (this.list.some(item => {
            return JSON.stringify(item.id) === JSON.stringify(a.ids)
          })) {
            const arr = this.list.filter(item => {
              return JSON.stringify(item.id) === JSON.stringify(a.ids)
            })[0]
            arr.test_data.forEach(dd => {
              const _arr = a.test_data.filter(ddd => ddd.data_point_name === dd.data_point_name)
              if (_arr.length > 0) {
                dd.max_value = _arr[0].max_value
                dd.min_value = _arr[0].min_value
              }
            })
            this.details.push({ ...arr, ordering: index + 1, reason1: a.reason, test: arr.test_data })
          }
        }
      })
      this.orderRow.reason = ''
      this.orderRow.unqualified_deal_order_uid = ''
      const arr = []
      this.tableData2.forEach((d, index) => {
        arr.push({ id: index + 1, reason: d.reason })
      })
      var map = {}
      var dest = []
      for (var i = 0; i < arr.length; i++) {
        var ai = arr[i]
        if (!map[ai.reason]) {
          dest.push({
            reason: ai.reason,
            id: [ai.id]
          })
          map[ai.reason] = ai
        } else {
          for (var j = 0; j < dest.length; j++) {
            var dj = dest[j]
            if (dj.reason === ai.reason) {
              dj.id.push(ai.id)
              break
            }
          }
        }
      }
      dest.forEach(d => {
        const a = d.id.join(',') + ':' + d.reason + '\r'
        this.orderRow.reason += a
      })
      var myDate = new Date()
      var year = myDate.getFullYear() // 获取当前年
      var mon = myDate.getMonth() + 1 // 获取当前月
      if (mon < 10) {
        mon = '0' + mon
      }
      var date = myDate.getDate() // 获取当前日
      if (date < 10) {
        date = '0' + date
      }
      var hours = myDate.getHours() // 获取当前小时
      if (hours < 10) {
        hours = '0' + hours
      }
      var minutes = myDate.getMinutes() // 获取当前分钟
      if (minutes < 10) {
        minutes = '0' + minutes
      }
      var seconds = myDate.getSeconds() // 获取当前秒
      if (seconds < 10) {
        seconds = '0' + seconds
      }
      var now = year + '' + mon + '' + date + '' + hours + '' + minutes + '' + seconds
      this.orderRow.unqualified_deal_order_uid = 'NO' + now
      this.handleCardDialogVisible = true
    },
    currentChange(page, page_size) {
      this.search.page = page
      this.search.page_size = page_size
      this.getList()
    },
    cancelFun() {
      this.handleCardDialogVisible = false
      this.orderRow.reason = ''
    },
    async preserveFun(obj) {
      if (obj.deal_department === undefined) {
        this.$message({
          showClose: true,
          message: '请填写发生部门',
          type: 'error'
        })
        return
      }
      const deal_details = []
      console.log(this.details)
      this.details.forEach(d => {
        deal_details.push({
          ordering: d.ordering,
          lot_no: d.lot_no,
          factory_date: d.factory_date,
          equip_no: d.equip_no,
          classes: d.classes,
          product_no: d.product_no,
          test_data: d.test,
          trains: d.trains,
          reason: d.reason1 })
      })
      try {
        const paramsData = {
          deal_details: deal_details,
          unqualified_deal_order_uid: obj.unqualified_deal_order_uid,
          deal_department: obj.deal_department,
          status: obj.status,
          reason: obj.reason,
          department: obj.department
        }
        await unqualifiedDealOrders('post', null, { data: paramsData })
        this.$message.success('发起成功！！！！')
        this.handleCardDialogVisible = false
        this.getList()
        this.tableData2 = []
      } catch (e) {
        //
      }
    },
    move(scope) {
      const tableData3 = JSON.parse(JSON.stringify(this.tableData1))
      if (scope.row.ids.length > 0) {
        scope.row.ids.forEach(item => {
          if (tableData3.some(d => {
            return JSON.stringify(d.id) === JSON.stringify(item)
          })) {
            const arr = tableData3.filter(item1 => {
              return JSON.stringify(item1.id) === JSON.stringify(item)
            })[0]
            this.tableData.push(arr)
          }
          scope.row.ids.forEach(item => {
            this.tableData2.forEach((item1, index) => {
              if (item1.ids[0] === item) {
                this.tableData2.splice(index, 1)
              }
            })
            this.list.forEach((item1, index) => {
              if (item1.id === item) {
                this.list.splice(index, 1)
              }
            })
          })
        })
      }
    }
  }
}
</script>
