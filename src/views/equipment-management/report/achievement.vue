<template>
  <div class="achievement">
    <!-- 密炼员工绩效汇总表 -->
    <el-form :inline="true">
      <el-form-item label="月份">
        <el-date-picker
          v-model="search.date"
          type="month"
          :clearable="false"
          format="yyyy-MM"
          value-format="yyyy-MM"
          placeholder="选择月"
          @change="changeList"
        />
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="search.name_d" clearable @input="debounceFun" />
      </el-form-item>
      <el-form-item style="float:right;">
        <el-button
          v-permission="['performance_summary','export']"
          type="primary"
          :disabled="btnExportTemplateLoad"
          @click="exportTemplate"
        >导出是否独立上岗模板</el-button>
        <el-upload
          style="margin:0 8px;display:inline-block"
          action="string"
          accept=".xls, .xlsx"
          :http-request="Upload"
          :show-file-list="false"
        >
          <el-button v-permission="['performance_summary','import']" type="primary">导入是否独立上岗</el-button>
        </el-upload>
        <el-button
          v-permission="['performance_summary', 'export']"
          type="primary"
          :disabled="btnExportLoad"
          @click="exportTable"
        >导出Excel</el-button>
      </el-form-item>
    </el-form>
    <div style="clear:both" />
    <u-table
      v-if="!isExport"
      v-loading="loading"
      :data="tableData"
      use-virtual
      show-body-overflow="title"
      show-header-overflow="title"
      :max-height="700"
      style="width: 100%"
      border
    >
      <u-table-column
        prop="name"
        fixed
        label="名字"
        width="60"
      />
      <u-table-column
        prop="work_type"
        fixed
        label="员工类别"
        width="60"
      />
      <u-table-column
        prop="是否定岗"
        fixed
        label="是否独立上岗"
        width="65"
      />
      <!-- <template slot-scope="{row}">
          {{ row.是否定岗?'是':'否' }}
        </template>
      </u-table-column> -->
      <u-table-column
        prop="hj"
        label="产量工资合计"
        width="65"
        fixed
      />
      <u-table-column
        prop="超产奖励"
        label="超产奖励"
        width="65"
        fixed
      >
        <template slot-scope="{row}">
          <el-link
            type="primary"
            @click="subsidyList(row,3)"
          >{{ row.超产奖励 }}</el-link>
        </template>
      </u-table-column>
      <u-table-column
        prop="其他奖惩"
        label="其他奖惩"
        width="65"
        fixed
      >
        <template slot-scope="{row}">
          <el-link
            type="primary"
            @click="subsidyList(row,1)"
          >{{ row.其他奖惩 }}</el-link>
        </template>
      </u-table-column>
      <u-table-column
        prop="生产补贴"
        label="生产补贴"
        width="65"
        fixed
      >
        <template slot-scope="{row}">
          <el-link
            type="primary"
            @click="subsidyList(row,2)"
          >{{ row.生产补贴 }}</el-link>
        </template>
      </u-table-column>
      <u-table-column
        prop="all"
        label="工资总计"
        width="90"
        fixed
      />
      <u-table-column v-for="(item,_index) in day" :key="item" :label="item+'日'">
        <u-table-column
          v-for="_item in group_list[_index]"
          :key="_item"
          :label="_item"
          width="65"
        >
          <template slot-scope="{row}">
            <el-link
              type="primary"
              @click="subsidyInfo(row,_item,item)"
            >{{ row[item+'_'+_item] }}</el-link>
          </template>
        </u-table-column>
      </u-table-column>

    </u-table>
    <achievementC
      v-if="isExport"
      :id="!dialogVisible1&&!dialogVisible&&!dialogVisible2?'out-table':''"
      :table-data="tableData"
      :day="day"
      :group-list="group_list"
    />

    <el-dialog
      title="补贴填写"
      :visible.sync="dialogVisible"
      width="500px"
      :before-close="handleClose"
    >
      <el-form ref="dialogForm" :model="formData" :rules="rules" label-width="120px">
        <el-form-item label="日期" prop="date">
          <el-date-picker
            v-model="formData.date"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="班次" prop="aaaaa">
          <el-select
            v-model="search.aaaaa"
            placeholder="请选择"
            filterable
            @change="classChanged"
          >
            <el-option
              v-for="item in ['早']"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="班组">
          <el-input v-model="formData.input" disabled />
        </el-form-item>
        <el-form-item label="补贴金额" prop="period">
          <el-input-number v-model="formData.period" />
        </el-form-item>
        <el-form-item label="补贴说明" prop="input">
          <el-input v-model="formData.input" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose(false)">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :title="subsidyIs===1?'其他奖惩列表':subsidyIs===2?'补贴列表':'超产奖列表'"
      :visible.sync="dialogVisible1"
      width="800px"
    >
      <el-form :inline="true">
        <el-form-item label="姓名">
          <el-input v-model="currentInfo.name" disabled />
        </el-form-item>
        <el-form-item style="float:right">
          <el-button v-permission="['performance_summary','export']" type="primary" @click="exportSubsidy(false)">导出Excel</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :id="dialogVisible1?'out-table':''"
        v-loading="loading1"
        :data="tableData1"
        style="width: 100%"
        show-summary
        border
      >
        <el-table-column
          prop="date"
          label="日期"
        />
        <el-table-column
          v-if="subsidyIs!==3"
          prop="group"
          label="班次"
        />
        <el-table-column
          prop="price"
          :label="subsidyIs===2?'补贴金额（元）':'超产奖金额（元）'"
        />
        <el-table-column
          v-if="subsidyIs!==3"
          prop="desc"
          :label="subsidyIs===2?'补贴说明':'超产奖说明'"
        />
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="单日绩效计算详情"
      :visible.sync="dialogVisible2"
      width="80%"
    >
      <div v-loading="loading1">
        <el-form :inline="true">
          <el-form-item label="姓名">
            <el-input v-model="currentInfo.name" disabled />
          </el-form-item>
          <el-form-item label="是否定岗">
            <el-input v-model="currentInfo.是否定岗" disabled />
          </el-form-item>
          <el-form-item label="工厂日期">
            <el-input v-model="currentInfo.factoryDate" disabled />
          </el-form-item>
          <el-form-item label="班组">
            <el-input v-model="currentInfo._class" disabled />
          </el-form-item>
          <el-form-item style="float:right">
            <el-button v-permission="['performance_summary','export']" type="primary" @click="exportSubsidy(true)">导出Excel</el-button>
          </el-form-item>
        </el-form>
        <el-table
          :id="dialogVisible2?'out-table':''"
          :data="tableData2"
          style="width: 100%"
          border
          :row-class-name="tableRowClassName"
        >
          <el-table-column
            prop="name"
            label="段数/项目"
          />
          <el-table-column
            v-for="item in sectionList"
            :key="item.id"
            :label="item.global_name"
          >
            <template slot-scope="{row}">
              {{ row[item.global_name] }}
            </template>
          </el-table-column>
        </el-table>
        <el-form :inline="true" style="margin-top:20px;" label-width="100px">
          <el-form-item label="产量工资总计">
            <el-input v-model="currentInfo.all_price" disabled />
          </el-form-item><br>
          <el-form-item label="超产奖励">
            <el-input v-model="currentInfo.超产奖励" disabled />
          </el-form-item>
          <!-- <el-form-item label="机台目标值">
            <el-input v-model="currentInfo.input" disabled />
          </el-form-item>
          <el-form-item label="机台最高值">
            <el-input v-model="currentInfo.input" disabled />
          </el-form-item><br> -->
          <el-form-item label="其他奖惩">
            <el-input-number
              v-model="currentInfo.其他奖惩1"
              controls-position="right"
            />
          </el-form-item>
          <el-form-item label="奖惩说明">
            <el-input v-model="currentInfo.奖惩说明1" style="width:350px;" />
          </el-form-item><br>
          <el-form-item label="生产补贴">
            <el-input-number
              v-model="currentInfo.生产补贴1"
              controls-position="right"
            />
          </el-form-item>
          <el-form-item label="补贴说明">
            <el-input v-model="currentInfo.补贴说明1" style="width:350px;" />
          </el-form-item><br>
          <el-form-item label="工资总计">
            <el-input v-model="currentInfo.工资总计" disabled />
          </el-form-item>
        </el-form>
        <div slot="footer" style="text-align:right">
          <el-button @click="dialogVisible2 = false">取 消</el-button>
          <el-button v-permission="['performance_summary','change']" type="primary" :loading="btnLoading" @click="handleSubmit">确 定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { debounce, setDate, exportExcel } from '@/utils'
import { globalCodesUrl } from '@/api/base_w'
import achievementC from '../components/achievement-c'
import { performanceSummary, performanceSubsidy, independentPostTemplate, independentPostTemplatePOST } from '@/api/base_w_five'
export default {
  name: 'StatisticalReportAchievement',
  components: { achievementC },
  data() {
    return {
      search: {
        date: setDate(false, false, 'month')
      },
      value2: '',
      btnExportTemplateLoad: false,
      btnExportLoad: false,
      tableData: [],
      month: '',
      year: '',
      day: '',
      dialogVisible: false,
      formData: {},
      rules: {
        schedule_no: [
          { required: true, message: '请输入倒班代码', trigger: 'blur' }
        ]
      },
      dialogVisible1: false,
      currentInfo: {},
      tableData1: [],
      subsidyIs: false,
      dialogVisible2: false,
      tableData2: [],
      loading: true,
      loading1: false,
      allArr: [],
      btnLoading: false,
      sectionList: [],
      group_list: [],
      isExport: false
    }
  },
  created() {
    this.getList()
    this.getGlobalCodes()
  },
  methods: {
    async getList() {
      try {
        if (!this.search.date) {
          this.$message('请选择月份')
          return
        }
        const a = new Date(this.search.date)
        const y = a.getFullYear()
        const m = a.getMonth() + 1
        this.day = new Date(y, m, 0).getDate()
        this.month = m
        this.year = y
        this.loading = true
        const data = await performanceSummary('get', null, { params: this.search })
        this.tableData = data.results
        this.group_list = data.group_list
      } catch (e) {
        //
      }
      this.loading = false
    },
    async getGlobalCodes() {
      try {
        const data = await globalCodesUrl('get', { params: {
          class_name: '胶料段次',
          all: 1
        }})
        this.sectionList = data.results
      } catch (e) {
        //
      }
    },
    changeList(val) {
      this.getList()
    },
    debounceFun() {
      this.search.page = 1
      debounce(this, 'getList')
    },
    subsidyFilling(row) {
      this.dialogVisible = true
    },
    async subsidyList(row, type) {
      this.subsidyIs = type
      this.dialogVisible1 = true
      this.currentInfo = row
      try {
        if (type === 3) {
          this.loading1 = true
          const data = await performanceSummary('get', null, { params: { name_d: row.name, date: this.search.date, ccjl: 1 }})
          this.tableData1 = data.results || []
          this.loading1 = false
          return
        }
        this.loading1 = true
        const data = await performanceSubsidy('get', null, { params: { type: type, year: this.year, month: this.month, name: row.name }})
        this.tableData1 = data
        this.loading1 = false
      } catch (e) {
        this.loading1 = false
        //
      }
    },
    async subsidyInfo(row, group, day) {
      this.currentInfo = JSON.parse(JSON.stringify(row))
      this.dialogVisible2 = true
      // this.currentInfo.是否定岗 = this.currentInfo.是否定岗 ? '是' : '否'
      this.currentInfo._class = group
      this.currentInfo.factoryDate = this.year + '-' + this.month + '-' + day
      try {
        this.loading1 = true
        const data = await performanceSummary('get', null, { params: { date: this.search.date, group_d: group, day_d: day, name_d: row.name }})
        const data1 = await performanceSubsidy('get', null, { params: { date: this.year + '-' + this.month + '-' + day, name: row.name }})
        this.allArr = data1 || []
        this.currentInfo.all_price = Number(data.all_price ? data.all_price : 0)
        this.currentInfo.超产奖励 = Number(data.超产奖励 ? data.超产奖励 : 0)
        this.tableData2 = data.results
        this.tableData2.push(data.hj)
        if (data1.length) {
          this.$set(this.currentInfo, '其他奖惩1', data1[0].price)
          this.$set(this.currentInfo, '奖惩说明1', data1[0].desc)
          this.$set(this.currentInfo, '生产补贴1', data1[1].price)
          this.$set(this.currentInfo, '补贴说明1', data1[1].desc)
        }
        const a = this.currentInfo.其他奖惩1 ? this.currentInfo.其他奖惩1 : 0
        const b = this.currentInfo.生产补贴1 ? this.currentInfo.生产补贴1 : 0
        this.currentInfo.工资总计 = this.currentInfo.all_price + this.currentInfo.超产奖励 + a + b
        this.currentInfo.工资总计 = Math.round(this.currentInfo.工资总计 * 100) / 100
      } catch (e) {
        //
      }
      this.loading1 = false
    },
    handleClose(done) {
      this.dialogVisible = false
      if (done) {
        done()
      }
    },
    classChanged(val) {
    },
    async handleSubmit() {
      try {
        if (!this.allArr.length) {
          this.allArr = [{ type: 1, date: this.currentInfo.factoryDate, group: this.currentInfo._class, name: this.currentInfo.name },
            { type: 2, date: this.currentInfo.factoryDate, group: this.currentInfo._class, name: this.currentInfo.name }]
        }
        this.allArr[0].price = this.currentInfo.其他奖惩1
        this.allArr[0].desc = this.currentInfo.奖惩说明1
        this.allArr[1].price = this.currentInfo.生产补贴1
        this.allArr[1].desc = this.currentInfo.补贴说明1
        this.btnLoading = true

        await performanceSubsidy('post', null, { data: this.allArr })
        this.$message.success('补贴、奖惩修改成功')
        this.dialogVisible2 = false
        this.currentInfo = {}
        this.getList()
      } catch (e) {
        //
      }
      this.btnLoading = false
    },
    Upload(param) {
      const formData = new FormData()
      formData.append('file', param.file)
      formData.append('date', this.search.date)
      independentPostTemplatePOST('post', null, { data: formData }).then(response => {
        this.$message({
          type: 'success',
          message: response
        })
        this.getList()
      })
    },
    exportTemplate() {
      this.btnExportTemplateLoad = true
      const obj = { date: this.search.date, export: 1 }
      const _api = independentPostTemplate
      _api('get', null, { params: obj })
        .then(res => {
          const link = document.createElement('a')
          const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
          link.style.display = 'none'
          link.href = URL.createObjectURL(blob)
          link.download = '否独立上岗模版.xlsx' // 下载的文件名
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          this.btnExportTemplateLoad = false
        }).catch(e => {
          this.btnExportTemplateLoad = false
        })
    },
    async exportTable() {
      this.loading = true
      this.btnExportLoad = true

      setTimeout(d => {
        this.isExport = true
        setTimeout(d => {
          exportExcel('员工绩效汇总表')
          this.isExport = false
          this.btnExportLoad = false
          this.loading = false
        }, 1000)
      }, 100)
    },
    exportSubsidy(bool) {
      let str = this.subsidyIs === 1 ? '其他奖惩列表' : this.subsidyIs === 2 ? '补贴列表' : '超产奖列表'
      if (bool) {
        str = '单日绩效计算详情'
      }
      exportExcel(str)
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.name === '产量工资合计') {
        return 'summary-cell-style'
      }
    }
  }
}
</script>

<style lang="scss">
.achievement{
  .el-table .cell{
    text-overflow:clip;
  }
  .el-dialog{
    .el-input{
      width:200px;
    }
    .el-input-number{
      width:auto;
    }
  }
  .el-table__fixed-right .el-table__fixed-header-wrapper {
    left: auto !important;
    right: 0 !important;
  }
  .el-table__fixed-right .el-table__fixed-body-wrapper{
    right: auto !important;;
  }
}
</style>
