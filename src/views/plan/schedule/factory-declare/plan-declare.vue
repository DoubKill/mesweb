<template>
  <div>
    <!-- 各分厂胶料计划申报 -->
    <el-form :inline="true">
      <el-form-item label="分厂">
        <el-select v-model="search.value" placeholder="请选择" @change="changeList">
          <el-option
            v-for="item in optionsBranch"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="申报单号">
        <el-input v-model="search.material_no" clearable @input="debounceInput" />
      </el-form-item>
      <el-form-item label="胶料编码">
        <el-input v-model="search.material_no" clearable @input="debounceInput" />
      </el-form-item>
      <el-form-item label="计划日期">
        <el-date-picker
          v-model="dateValue"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="changeDate"
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="search.value" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item style="float:right">
        <el-button type="primary" :loading="btnExportLoad" @click="templateDownload">导出Excel</el-button>
        <el-button type="primary" @click="addList">新建</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
      border
      show-summary
    >
      <el-table-column
        prop="name"
        label="分厂"
        min-width="20"
      />
      <el-table-column
        prop="name"
        label="申报日期"
        min-width="20"
      />
      <el-table-column
        prop="name"
        label="申报单号"
        min-width="20"
      />
      <el-table-column
        prop="name"
        label="胶料编码"
        min-width="20"
      />
      <el-table-column
        prop="name"
        label="当日需求（吨）"
        min-width="20"
      />
      <el-table-column
        prop="name"
        label="明日需求（吨）"
        min-width="20"
      />
      <el-table-column
        prop="name"
        label="当前库存（吨）"
        min-width="20"
      />
      <el-table-column
        prop="name"
        label="状态"
        min-width="20"
      />
      <el-table-column
        prop="name"
        label="录入者"
        min-width="20"
      />
      <el-table-column
        prop="name"
        label="录入时间"
        min-width="20"
      />
      <el-table-column
        align="center"
        width="150"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              size="mini"
              @click="showEditEquipCateDialog(scope.row)"
            >编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleEquipCateDelete(scope.row)"
            >关闭</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <page
      :old-page="false"
      :total="total"
      :current-page="search.page"
      @currentChange="currentChange"
    />
    <el-dialog
      title="分厂胶料计划申报"
      :visible.sync="dialogVisible"
      width="80%"
      :before-close="handleClose"
    >
      <el-form :inline="true">
        <el-form-item label="分厂">
          <el-select v-model="formData.value" placeholder="请选择">
            <el-option
              v-for="item in optionsBranch"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="申报单号">
          <el-input v-model="formData.material_no" disabled />
        </el-form-item>
      </el-form>
      <el-table
        :data="tableData1"
        border
        show-summary
      >
        <el-table-column
          type="index"
          label="序号"
          min-width="20"
        />
        <el-table-column
          prop=""
          label="胶料编码"
          min-width="20"
        />
        <el-table-column
          prop=""
          label="当日需求（吨）"
          min-width="20"
        />
        <el-table-column
          prop=""
          label="明日需求（吨）"
          min-width="20"
        />
        <el-table-column
          prop=""
          label="当前库存（吨）"
          min-width="20"
        />
        <el-table-column
          prop=""
          label="在途库存（吨）"
          min-width="20"
        />
        <el-table-column
          width="80"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="delDialog(scope.row,scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="width:100%;text-align:center;margin-top:15px">
        <el-button
          size="small"
          @click="addCell"
        >插入一行</el-button>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose(false)">取 消</el-button>
        <el-button type="primary" @click="submitFun">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import { setDate } from '@/utils'
import page from '@/components/page'
export default {
  name: 'SchedulePlanDeclare',
  components: { page },
  data() {
    return {
      search: {},
      tableData: [{}],
      formData: {},
      loading: false,
      dateValue: [],
      options: [],
      btnExportLoad: false,
      total: 0,
      dialogVisible: false,
      optionsBranch: [],
      tableData1: [{}]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.loading = false
      try {
        this.loading = true
        // const data = await batchChargeLogList('get', null, { params: this.getParams })
        // this.tableData = data.results || []
        // this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    changeList() {
      this.search.page = 1
      this.getList()
    },
    changeDate(arr) {
      this.changeList()
    },
    debounceInput() {
      this.$debounce(this, 'getList')
    },
    currentChange(page, page_size) {
      this.search.page = page
      this.search.page_size = page_size
      this.getList()
    },
    handleClose(done) {
      this.dialogVisible = false
      if (done) {
        done()
      }
    },
    showEditEquipCateDialog(row) {
      this.dialogVisible = true
    },
    handleEquipCateDelete(row) {
      this.$confirm('此操作将关闭该计划，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        try {
          //
        } catch (e) { e }
      }).catch(() => {
      })
    },
    addCell() {
      this.tableData1.push({})
    },
    delDialog(row, index) {
      this.tableData1.splice(index, 1)
    },
    templateDownload() {
    //   this.btnExportLoad = true
    //   const obj = Object.assign({ export: 2 }, this.search)
    //   thStockSummsry('get', null, { params: obj, responseType: 'blob' })
    //     .then(res => {
    //       const link = document.createElement('a')
    //       const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
    //       link.style.display = 'none'
    //       link.href = URL.createObjectURL(blob)
    //       link.download = '各分厂胶料计划申报.xlsx' // 下载的文件名
    //       document.body.appendChild(link)
    //       link.click()
    //       document.body.removeChild(link)
    //       this.btnExportLoad = false
    //     }).catch(e => {
    //       this.btnExportLoad = false
    //     })
    },
    addList() {
      this.dialogVisible = true
    },
    submitFun() {}
  }
}
</script>

<style lang="scss" scoped>

</style>
