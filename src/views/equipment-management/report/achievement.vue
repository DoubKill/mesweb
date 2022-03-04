<template>
  <div class="achievement">
    <!-- 员工绩效汇总表 -->
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
        <el-input v-model="search.input" clearable @input="debounceFun" />
      </el-form-item>
      <el-form-item label="多岗位合并基准">
        <el-select
          v-model="search.aaaaa"
          clearable
          placeholder="请选择"
          filterable
          @change="changeList"
        >
          <el-option
            v-for="item in ['最大值']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="多岗位合并系数">
        <el-input v-model="search.input" clearable @input="debounceFun" />
      </el-form-item> -->
      <el-form-item style="float:right">
        <el-button
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
          <el-button type="primary">导入是否独立上岗</el-button>
        </el-upload>
        <el-button
          type="primary"
          :disabled="btnExportLoad"
          @click="exportTable"
        >导出Excel</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      style="width: 100%"
      border
    >
      <el-table-column
        prop="date"
        label="名字"
        min-width="20"
      >
        <!-- <template slot-scope="{row}">
          <el-link
            type="primary"
            @click="subsidyFilling(row)"
          >{{ row.aa }}</el-link>
        </template> -->
      </el-table-column>
      <el-table-column
        prop="date"
        label="是否独立上岗"
        min-width="20"
      />
      <el-table-column v-for="item in month" :key="item" :label="item+'日'">
        <el-table-column
          prop="name"
          label="A"
          min-width="20"
        >
          <template slot-scope="{row}">
            <el-link
              type="primary"
              @click="subsidyInfo(row)"
            >{{ row.aa }}</el-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="C"
          min-width="20"
        >
          <template slot-scope="{row}">
            <el-link
              type="primary"
              @click="subsidyInfo(row)"
            >{{ row.aa }}</el-link>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        prop="date"
        label="产量工资合计"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="补贴合计"
        min-width="20"
      >
        <template slot-scope="{row}">
          <el-link
            type="primary"
            @click="subsidyList(row,true)"
          >{{ row.aa }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="date"
        label="超产奖励"
        min-width="20"
      >
        <template slot-scope="{row}">
          <el-link
            type="primary"
            @click="subsidyList(row,false)"
          >{{ row.aa }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="date"
        label="工资总计"
        min-width="20"
      />
    </el-table>

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
      :title="subsidyIs?'补贴列表':'超产奖列表'"
      :visible.sync="dialogVisible1"
      width="800px"
    >
      <el-form :inline="true">
        <el-form-item label="姓名">
          <el-input v-model="currentInfo.input" disabled />
        </el-form-item>
        <el-form-item style="float:right">
          <el-button type="primary" @click="exportSubsidy(true)">导出Excel</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="tableData1"
        style="width: 100%"
        show-summary
        border
      >
        <el-table-column
          prop="amount1"
          label="日期"
        />
        <el-table-column
          prop="amount1"
          label="班次"
        />
        <el-table-column
          prop="amount1"
          :label="subsidyIs?'补贴金额（元）':'超产奖金额（元）'"
        />
        <el-table-column
          prop="amount1"
          :label="subsidyIs?'补贴说明':'超产奖说明'"
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
      <el-form :inline="true">
        <el-form-item label="姓名">
          <el-input v-model="currentInfo.input" disabled />
        </el-form-item>
        <el-form-item label="是否定岗">
          <el-input v-model="currentInfo.input" disabled />
        </el-form-item>
        <el-form-item label="工厂日期">
          <el-input v-model="currentInfo.input" disabled />
        </el-form-item>
        <el-form-item label="班组">
          <el-input v-model="currentInfo.input" disabled />
        </el-form-item>
        <el-form-item style="float:right">
          <el-button type="primary" @click="exportSubsidy(false)">导出Excel</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="tableData2"
        style="width: 100%"
        border
      >
        <el-table-column
          prop="amount1"
          label="段数/项目"
        />
      </el-table>
      <el-form :inline="true" style="margin-top:20px;" label-width="100px">
        <el-form-item label="产量工资总计">
          <el-input v-model="currentInfo.input" disabled />
        </el-form-item><br>
        <el-form-item label="超产奖励">
          <el-input v-model="currentInfo.input" disabled />
        </el-form-item>
        <el-form-item label="机台目标值">
          <el-input v-model="currentInfo.input" disabled />
        </el-form-item>
        <el-form-item label="机台最高值">
          <el-input v-model="currentInfo.input" disabled />
        </el-form-item><br>
        <el-form-item label="其他奖惩">
          <el-input v-model="currentInfo.input" />
        </el-form-item>
        <el-form-item label="奖惩说明">
          <el-input v-model="currentInfo.input" style="width:350px;" />
        </el-form-item><br>
        <el-form-item label="生产补贴">
          <el-input v-model="currentInfo.input" />
        </el-form-item>
        <el-form-item label="补贴说明">
          <el-input v-model="currentInfo.input" style="width:350px;" />
        </el-form-item><br>
        <el-form-item label="工资总计">
          <el-input v-model="currentInfo.input" disabled />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { debounce } from '@/utils'
import { setDate } from '@/utils'
export default {
  name: 'StatisticalReportAchievement',
  data() {
    return {
      search: {
        date: setDate(false, false, 'month')
      },
      value2: '',
      btnExportTemplateLoad: false,
      btnExportLoad: false,
      tableData: [{ aa: 1 }],
      month: '',
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
      tableData2: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        const a = new Date(this.search.date)
        const y = a.getFullYear()
        const m = a.getMonth() + 1
        this.month = new Date(y, m, 0).getDate()
        // const data = await thStockSummsry('get', null, { params: this.search })
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
    subsidyList(row, bool) {
      this.subsidyIs = bool
      this.dialogVisible1 = true
    },
    subsidyInfo(row) {
      this.dialogVisible2 = true
    },
    handleClose(done) {
      this.dialogVisible = false
      if (done) {
        done()
      }
    },
    classChanged(val) {
    },
    handleSubmit() {},
    Upload(param) {
      const formData = new FormData()
      formData.append('file', param.file)
      // equipSupplierImport('post', null, { data: formData }).then(response => {
      //   this.$message({
      //     type: 'success',
      //     message: response
      //   })
      //   this.search.page = 1
      //   this.getList()
      // })
    },
    exportTemplate() {},
    exportTable() {
      // this.btnExportLoad = true
      // const obj = Object.assign({ export: 1 }, this.search)
      // const _api = equipSupplierListDown
      // _api(obj)
      //   .then(res => {
      //     const link = document.createElement('a')
      //     const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
      //     link.style.display = 'none'
      //     link.href = URL.createObjectURL(blob)
      //     link.download = '员工绩效汇总表.xlsx' // 下载的文件名
      //     document.body.appendChild(link)
      //     link.click()
      //     document.body.removeChild(link)
      //     this.btnExportLoad = false
      //   }).catch(e => {
      //     this.btnExportLoad = false
      //   })
    },
    exportSubsidy(bool) {

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
}
</style>
