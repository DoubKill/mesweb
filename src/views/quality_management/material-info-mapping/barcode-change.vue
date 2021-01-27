<template>
  <div>
    <!-- 条码变更 -->
    <el-form :inline="true">
      <el-form-item label="时间:">
        <el-date-picker
          v-model="searchDate"
          :clearable="true"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="changeDate"
        />
      </el-form-item>
      <el-form-item label="料包编码">
        <el-input v-model="search.material_no" @input="changeList" />
      </el-form-item>
      <el-form-item label="称量机台">
        <equipSelect
          :equip_no_props="search.equip_no"
          equip-type="称量设备"
          @changeSearch="equipSearch"
        />
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      border
    >
      <el-table-column
        label="操作"
        width="130px"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="add(scope.row)"
          >重新生成条形码
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="bra_code"
        label="条形码"
        min-width="20"
      />
      <el-table-column
        prop="equip_no"
        label="称量机台"
        min-width="20"
      />
      <el-table-column
        prop="production_factory_date"
        label="工厂时间"
        min-width="15"
      />
      <el-table-column
        prop="production_classes"
        label="班次"
        min-width="10"
      />
      <el-table-column
        prop="dev_type"
        label="机型"
        min-width="20"
      />
      <el-table-column
        prop="material_no"
        label="料包编码"
        min-width="20"
      />
      <el-table-column
        prop="begin_trains"
        label="开始袋数"
        min-width="15"
      />
      <el-table-column
        prop="end_trains"
        label="结束袋数"
        min-width="15"
      />
      <el-table-column
        prop="quantity"
        label="数量"
        min-width="10"
      />
      <el-table-column
        prop="created_username"
        label="操作者"
        min-width="20"
      />
      <el-table-column
        prop="created_date"
        label="操作时间"
        min-width="20"
      />
      <el-table-column
        prop=""
        label="预计生产时间"
        min-width="20"
      />
    </el-table>
    <page
      :total="total"
      :old-page="false"
      :current-page="search.page"
      @currentChange="currentChange"
    />

    <el-dialog
      :fullscreen="true"
      :visible.sync="cardDialogVisible"
    >
      <codeCard ref="codeCard" />
    </el-dialog>
  </div>
</template>

<script>
// import materielTypeSelect from '@/components/select_w/materielTypeSelect'
// import materialCodeSelect from '@/components/materialCodeSelect'
// import jsbarcode from 'jsbarcode'
import { setDate } from '@/utils'
import codeCard from '../components/codeCard'
import equipSelect from '@/components/select_w/equip'
import page from '@/components/page'
import { weightingPackageLog } from '@/api/base_w_two'
export default {
  components: { codeCard, equipSelect, page },
  data() {
    return {
      tableData: [],
      dialogVisible: false,
      currentObj: {},
      searchDate: [setDate(), setDate()],
      search: {
        equip_no: '',
        pagination: 1,
        page: 1,
        page_size: 10,
        st: setDate(),
        et: setDate()
      },
      total: 0,
      cardDialogVisible: false,
      currentId: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        const data = await weightingPackageLog('get', null, { params: this.search })
        this.tableData = data.results
        this.total = data.count
      } catch (e) {
        //
      }
    },
    changMaterielType() {},
    add(row) {
      this.cardDialogVisible = true
      // this.currentId = row.id
      this.$nextTick(() => {
        this.$refs['codeCard'].setTestData(row.id)
      })
    },
    handleClose(done) {
      done()
    },
    changeDate(arr) {
      this.search.st = arr ? arr[0] : ''
      this.search.et = arr ? arr[1] : ''
      this.changeList()
    },
    currentChange(page, page_size) {
      this.search.page = page
      this.search.page_size = page_size
      this.getList()
    },
    changeList() {
      this.search.page = 1
      this.getList()
    },
    changMaterielTypeDialoge(val) {
      this.currentObj.materielType = val
    },
    changeMaterialCodeDialoge(val) {
      console.log(val)
      this.currentObj.materiel_no = val
    },
    equipSearch(val) {
      this.search.equip_no = val
      this.changeList()
    }
  }
}
</script>

<style>

</style>
