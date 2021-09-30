<template>
  <div>
    <!-- 生产运行记录 -->
    <el-form :inline="true">
      <el-form-item label="工厂时间:">
        <el-date-picker
          v-model="search.date"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择工厂时间"
          @change="changeSearch"
        />
      </el-form-item>
      <el-form-item label="班次:">
        <class-select
          @classSelected="classChanged"
        />
      </el-form-item>
      <el-form-item label="值班长:">
        <el-input
          v-model="shift_leader"
          placeholder="请输入值班长"
          :disabled="search.classes===''||search.classes===undefined"
          @change="UserEdit3"
        />
      </el-form-item>
      <el-form-item style="float:right">
        <el-button @click="reportBrowse">报表浏览</el-button>
        <el-button @click="dialog('设备')">设备异常记录</el-button>
        <el-button @click="dialog('工艺')">工艺停机记录</el-button>
        <el-button @click="dialog('生产')">生产停机记录</el-button>
        <el-button @click="dialog1">辅助岗位名单记录</el-button>
        <!-- <el-button @click="exportTable">导出</el-button> -->
      </el-form-item>
    </el-form>
    <el-dialog
      title="相关记录"
      :visible.sync="dialogVisible1"
      width="30%"
    >
      <span v-if="pd==='设备'">设备异常运行情况：</span>
      <span v-if="pd==='工艺'">工艺停机情况：</span>
      <span v-if="pd==='生产'">生产停机情况：</span>
      <el-input
        v-model="textarea"
        :autosize="{ minRows: 4 }"
        style="marginTop:10px"
        type="textarea"
        placeholder="请输入内容"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取 消</el-button>
        <el-button type="primary" :loading="loadingBtn" @click="generateFun">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="相关记录"
      :visible.sync="dialogVisible2"
      width="30%"
    >
      <span>辅助岗位名单记录：</span>
      <el-input
        v-model="textarea1"
        :autosize="{ minRows: 4 }"
        style="marginTop:10px"
        type="textarea"
        placeholder="请输入内容"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" :loading="loadingBtn1" @click="generateFun1">确 定</el-button>
      </span>
    </el-dialog>
    <el-table
      v-loading="loading"
      :data="dataList"
      :span-method="objectSpanMethod"
      border
    >
      <el-table-column
        prop="equip_no"
        label="机台"
        min-width="10"
      />
      <el-table-column
        label="完成总量(车)"
        min-width="14"
      >
        <template v-if="row.trains_sum" slot-scope="{row}">
          {{ row.trains_sum[0] }}
        </template>
      </el-table-column>
      <el-table-column
        prop="put_user"
        label="投料人员"
        min-width="20"
      >
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.put_user"
            :disabled="search.classes===''||search.classes===undefined"
            placeholder="请输入内容"
            @change="UserEdit(scope)"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="extrusion_user"
        label="挤出人员"
        min-width="20"
      >
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.extrusion_user"
            :disabled="search.classes===''||search.classes===undefined"
            placeholder="请输入内容"
            @change="UserEdit1(scope)"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="collection_user"
        label="收皮人员"
        min-width="20"
      >
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.collection_user"
            :disabled="search.classes===''||search.classes===undefined"
            placeholder="请输入内容"
            @change="UserEdit2(scope)"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="设备启动率"
        min-width="20"
      >
        <template v-if="row.start_rate" slot-scope="{row}">
          <el-progress :text-inside="true" :stroke-width="24" status="success" :percentage="parseInt(row.start_rate *100)" />
        </template>
      </el-table-column>
      <el-table-column
        prop="product_no"
        label="胶料编码"
        min-width="20"
      />
      <el-table-column
        prop="plan_trains"
        label="计划量(车)"
        min-width="14"
      />
      <el-table-column
        prop="actual_trains"
        label="完成量(车)"
        min-width="14"
      />
      <el-table-column
        prop="c"
        label="达成率"
        min-width="20"
      >
        <template v-if="row.actual_trains" slot-scope="{row}">
          <el-progress :text-inside="true" :stroke-width="24" :percentage="parseInt(row.actual_trains/row.plan_trains * 100)" />
        </template>
      </el-table-column>

      <el-table-column
        prop="product_time"
        label="生产时间"
        min-width="20"
      />

    </el-table>
    <el-dialog
      title="炼胶生产运行记录预览"
      :visible.sync="dialogVisible"
      width="80%"
    >
      <div style="float:right;marginBottom:20px">
        <el-button type="primary" @click="exportPDF">导出PDF</el-button>
        <el-button type="primary" @click="exportTable">导出Excel</el-button>
        <el-button type="primary" @click="dialogVisible = false">返回</el-button>
      </div>
      <div id="out-table">
        <table
          bordercolor="black"
          style="width:100%;border-collapse: collapse;"
          border="1"
          class="info-table-head"
        >
          <tr style="textAlign:center;height:30px">
            <td colspan="10"><h3 style="marginTop:15px">安吉炼胶分厂</h3></td>
          </tr>
          <tr style="textAlign:center">
            <td colspan="10">炼胶生产运行记录</td>
          </tr>
          <tr style="textAlign:center">
            <td colspan="2">班组：{{ group }}</td>
            <td colspan="3">班次：{{ search.classes }}</td>
            <td colspan="4">值班长：{{ records.shift_leader }}</td>
            <td colspan="">{{ search.date }}</td>
          </tr>
          <tr style="textAlign:center">
            <th>机台</th>
            <th>胶料编码</th>
            <th>计划量(车)</th>
            <th>完成量(车)</th>
            <th>合计(车)</th>
            <th colspan="2">岗位人员配置</th>
            <th colspan="3">相关记录</th>
          </tr>
          <tr v-for="(itemVal,i) in dataList" :key="i" style="textAlign:center">
            <td v-if="spanArr[i]" :rowspan="spanArr[i]">{{ itemVal.equip_no }}</td>
            <td v-if="spanArr1[i]" :rowspan="spanArr1[i]" style="width:150px">{{ itemVal.product_no }}</td>
            <td v-if="spanArr1[i]" :rowspan="spanArr1[i]" style="minHeight:30px">{{ itemVal.plan_trains }}</td>
            <td v-if="spanArr1[i]" :rowspan="spanArr1[i]">{{ itemVal.actual_trains }}</td>
            <td v-if="spanArr1[i]" :rowspan="spanArr1[i]">{{ itemVal.trains_sum[0] }}</td>
            <td v-if="spanArr[i]" :rowspan="spanArr[i] " colspan="2">
              <div>投料岗位：{{ itemVal.put_user }} </div>
              <div>挤出岗位：{{ itemVal.extrusion_user }}</div>
              <div>收皮岗位：{{ itemVal.collection_user }}</div>
            </td>

            <td v-if="itemVal.aaa" style="width:200px;height:20px" :rowspan="itemVal.aaa" colspan="3">
              <span v-if="i===0" style="fontWeight:bolder">设备异常运行情况</span>
              <span v-if="i===1">{{ records.equip_error_record }}</span>
              <span v-if="i===Math.floor(dataList.length / 4)" style="fontWeight:bolder">工艺停机</span>
              <span v-if="i===Math.floor(dataList.length / 4)+1">{{ records.process_shutdown_record }}</span>
              <span v-if="i===Math.floor(dataList.length / 4)*2" style="fontWeight:bolder">生产停机</span>
              <span v-if="i===Math.floor(dataList.length / 4)*2+1">{{ records.production_shutdown_record }}</span>
              <span v-if="i===Math.floor(dataList.length / 4)*3" style="fontWeight:bolder">辅助岗位名单</span>
              <span v-if="i===Math.floor(dataList.length / 4)*3+1">{{ changeInputBack(records.auxiliary_positions_record) }}</span>
            </td>
          </tr>
        </table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import classSelect from '@/components/ClassSelect'
import { runtimeRecord } from '@/api/base_w_three'
import { runtimeDetail } from '@/api/jqy'
// import { debounce } from '@/utils/index'
import { setDate, exportExcel } from '@/utils/index'
export default {
  name: 'ProduceWork',
  components: { classSelect },
  data() {
    return {
      search: {
        date: setDate()
      },
      pd: '',
      main: '',
      shift_leader: '',
      num: 0,
      textarea: '',
      group: '',
      records: {},
      textarea1: '中控：\n叉车：\n物流：\n出库：\n机动：',
      textarea2: '',
      loadingBtn: false,
      loadingBtn1: false,
      loading: true,
      dialogVisible: false,
      dialogVisible1: false,
      dialogVisible2: false,
      dataList: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await runtimeRecord('get', null, { params: this.search })
        this.dataList = data.results || []
        this.shift_leader = data.shift_leader || null
        this.loading = false
        if (this.dataList.length === 0) return
        const arr = JSON.parse(JSON.stringify(this.dataList))
        if (this.dataList.length < 8) {
          for (var a = 0; a < 8 - arr.length; a++) {
            this.dataList.unshift(this.dataList[0])
          }
        }
        this.spanArr = []
        this.pos = null
        this.spanArr1 = []
        this.pos1 = null
        const aaa = Math.floor(this.dataList.length / 4)
        for (var i = 0; i < this.dataList.length; i++) {
          if (i === 0) {
            this.dataList[i].aaa = 1
          } else if (i === 1) {
            this.dataList[i].aaa = aaa - 1
          } else if ([aaa, aaa * 2].includes(i)) {
            this.dataList[i].aaa = 1
          } else if ([aaa + 1, aaa * 2 + 1].includes(i)) {
            this.dataList[i].aaa = aaa - 1
          } else if (i === aaa * 3) {
            this.dataList[i].aaa = 1
          } else if (i === aaa * 3 + 1) {
            this.dataList[i].aaa = this.dataList.length - aaa * 3 - 1
          } else {
            this.dataList[i].aaa = 0
          }
          if (i === 0) {
            // 如果是第一条记录（即索引是0的时候），向数组中加入１
            this.spanArr.push(1)
            this.pos = 0
            this.spanArr1.push(1)
            this.pos1 = 0
          } else {
            if (this.dataList[i] === this.dataList[i - 1]) {
              // 如果a相等就累加，并且push 0  这里是根据一样的a匹配
              this.spanArr1[this.pos] += 1
              this.spanArr1.push(0)
            } else {
              // 不相等push 1
              this.spanArr1.push(1)
              this.pos1 = i
            }
            if (this.dataList[i].equip_no === this.dataList[i - 1].equip_no) {
              // 如果a相等就累加，并且push 0  这里是根据一样的a匹配
              this.spanArr[this.pos] += 1
              this.spanArr.push(0)
            } else {
              // 不相等push 1
              this.spanArr.push(1)
              this.pos = i
            }
          }
        }
      } catch (e) {
        this.loading = false
      }
    },
    UserEdit(scope) {
      var timer
      try {
        clearTimeout(timer)
        timer = setTimeout(() => {
        // 执行要加载的接口函数 try {
          runtimeDetail('post', null, { data: { detail: scope.row.id, feeding_post: scope.row.put_user }})
        // count = 0
        }, 100)
      } catch {
        this.$message.info('修改失败')
      }
    },
    UserEdit1(scope) {
      var timer
      try {
        clearTimeout(timer)
        timer = setTimeout(() => {
        // 执行要加载的接口函数
          runtimeDetail('post', null, { data: { detail: scope.row.id, extrusion_post: scope.row.extrusion_user }})
        // count = 0
        }, 100)
      } catch {
        this.$message.info('修改失败')
      }
    },
    UserEdit2(scope) {
      var timer
      try {
        clearTimeout(timer)
        timer = setTimeout(() => {
        // 执行要加载的接口函数
          runtimeDetail('post', null, { data: { detail: scope.row.id, collection_post: scope.row.collection_user }})
        // count = 0
        }, 100)
      } catch {
        this.$message.info('修改失败')
      }
    },
    UserEdit3() {
      var timer
      try {
        clearTimeout(timer)
        timer = setTimeout(() => {
        // 执行要加载的接口函数
          runtimeDetail('post', null, { data: {
            shift_leader: this.shift_leader,
            classes: this.search.classes,
            date: this.search.date }
          })
        // count = 0
        }, 100)
      } catch {
        this.$message.info('修改失败')
      }
    },
    changeSearch() {
      this.getList()
    },
    classChanged(obj) {
      this.search.classes = obj
      this.getList()
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if ([0, 1, 2, 3, 4, 5].includes(columnIndex) && this.spanArr) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
      if ([6, 7, 8, 9, 10].includes(columnIndex) && this.spanArr1) {
        const _row = this.spanArr1[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    exportTable() {
      exportExcel('生产运行记录', 'disposal-list')
    },
    async reportBrowse() {
      this.dialogVisible = true
      this.group = ''
      this.records = {}
      const data = await runtimeDetail('get', null, { params: this.search })
      if (data.group) {
        this.group = data.group
      }
      if (data.results) {
        this.records = data.results
      }
    },
    async dialog(val) {
      this.textarea = ''
      if (this.search.classes === '' || this.search.classes === undefined) {
        this.$message.info('请选择班次')
      } else {
        this.dialogVisible1 = true
        this.pd = val
        const data = await runtimeDetail('get', null, { params: this.search })
        this.main = data.results.id
        if (this.pd === '设备') {
          this.textarea = data.results.equip_error_record
        } else if (this.pd === '工艺') {
          this.textarea = data.results.process_shutdown_record
        } else if (this.pd === '生产') {
          this.textarea = data.results.production_shutdown_record
        }
      }
    },
    async dialog1() {
      this.textarea1 = '中控：\n叉车：\n物流：\n出库：\n机动：'
      if (this.search.classes === '' || this.search.classes === undefined) {
        this.$message.info('请选择班次')
      } else {
        this.dialogVisible2 = true
        const data = await runtimeDetail('get', null, { params: this.search })
        this.main = data.results.id
        if (data.results.auxiliary_positions_record) {
          this.textarea1 = this.changeInputBack(data.results.auxiliary_positions_record)
        }
      }
    },
    changeInput(val) {
      if (!val) return null
      return (val).replace(/\r|\n/g, '<br>').replace(/\n/g, '<br>').replace(/\s/g, '&nbsp;')
    },
    changeInputBack(val) {
      if (!val) return ''
      return (val).replace(/<br>/g, '\r\n').replace(/<br>/g, '\n').replace(/&nbsp;/g, '\s')
    },
    generateFun() {
      try {
        if (this.textarea === '') {
          this.$message.info('请填写内容')
        } else {
          this.loadingBtn = true
          if (this.pd === '设备') {
            runtimeDetail('post', null, { data: { main: this.main, equip_error_record: this.textarea }})
          } else if (this.pd === '工艺') {
            runtimeDetail('post', null, { data: { main: this.main, process_shutdown_record: this.textarea }})
          } else if (this.pd === '生产') {
            runtimeDetail('post', null, { data: { main: this.main, production_shutdown_record: this.textarea }})
          }
          this.$message.success('修改成功')
          this.loadingBtn = false
          this.dialogVisible1 = false
          this.textarea = ''
        }
      } catch {
        this.$message.info('修改失败')
      }
    },
    generateFun1() {
      try {
        if (this.textarea1 === '') {
          this.$message.info('请填写内容')
        } else {
          this.loadingBtn1 = true
          this.textarea2 = this.changeInput(this.textarea1)
          runtimeDetail('post', null, { data: { main: this.main, auxiliary_positions_record: this.textarea2 }})
          this.$message.success('修改成功')
          this.loadingBtn1 = false
          this.dialogVisible2 = false
          this.textarea1 = '中控：\n叉车：\n物流：\n出库：\n机动：'
        }
      } catch {
        this.$message.info('修改失败')
      }
    },
    async exportPDF() {
      var iframe = ''
      if (!iframe) {
        var el = document.getElementById('out-table')
        iframe = document.createElement('IFRAME')
        var doc = null
        iframe.setAttribute('id', 'print-iframe')
        iframe.setAttribute('style', 'position:absolute;width:0px;height:0px;left:-500px;top:-500px;')
        document.body.appendChild(iframe)
        doc = iframe.contentWindow.document
        doc.write('<style media="print">@page {size: auto;margin: 20px;} table{font-size:14px}' + '</style>') // 解决出现页眉页脚和路径的问题

        doc.write('<div style="width:100%">' + el.innerHTML + '</div>')
        doc.close()
        iframe.contentWindow.focus()
      }
      setTimeout(function() { iframe.contentWindow.print() }, 50) // 解决第一次样式不生效的问题
      if (navigator.userAgent.indexOf('MSIE') > 0) {
        document.body.removeChild(iframe)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.cell{
  text-align:center;
}
 table {
      width: 100%;
      border-collapse: collapse;
    }
    .info-table-head{
      tr{
        text-align: center;
      }
      td{
        padding:5px;
      }
    }
   .info-table {
       td {
        min-width: 100px;
        padding: 5px 10px;
         font-size: 14px;
         color: #606266;
      }
       thead{
        font-weight: 700;
        td{
          color: #909399;
        }
       }

    }
    .rightHeight{
      height:150px;
    }
</style>
