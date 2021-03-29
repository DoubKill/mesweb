<template>
  <div>
    <!-- 原材料快检结果查看 -->
    <el-form :inline="true">
      <el-form-item label="日期：">
        <el-date-picker
          v-model="search.storage_date"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
          @change="changeList"
        />
      </el-form-item>
      <el-form-item label="原材料编码：">
        <all-product-no-select :type-parms="2" @productBatchingChanged="changeMaterialCode" />
      </el-form-item>
      <el-form-item label="原材料名称：">
        <all-product-no-select :type-parms="2" label-name="material_name" @productBatchingChanged="changeMaterialName" />
      </el-form-item>

      <el-form-item label="条码：">
        <el-input
          v-model="search.lot_no"
          placeholder="请输入内容"
          @input="changeList"
        />
      </el-form-item>
      <el-form-item label="判定结果：">
        <el-select
          v-model="search.is_qualified"
          clearable
          placeholder="请选择"
          @change="changeList"
        >
          <el-option
            v-for="item in option"
            :key="item.name"
            :label="item.name"
            :value="item.label"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="试验方法：">
        <qualityTestMethodSelect
          ref="testMethodSelect"
          @changeSelect="testMethodChange"
        />
      </el-form-item> -->
    </el-form>
    <el-table
      :data="tableData"
      border
    >
      <el-table-column
        align="center"
        type="index"
        label="No"
        width="50"
      />
      <el-table-column label="物料信息">
        <el-table-column
          prop="storage_date"
          label="入库时间"
          min-width="10"
        />
        <el-table-column
          prop="material_no"
          label="原材料编码"
          min-width="10"
        />
        <el-table-column
          prop="material_name"
          label="原材料名称"
          min-width="10"
        />
        <el-table-column
          prop="supplier_name"
          label="厂家信息"
          min-width="10"
        />
        <el-table-column
          prop="lot_no"
          label="条码"
          min-width="10"
        />
      </el-table-column>
      <el-table-column
        prop="is_qualified"
        label="等级"
        min-width="10"
      >
        <template slot-scope="{row}">
          {{ row.is_qualified?'等级1':'等级2' }}
        </template>
      </el-table-column>
      <el-table-column
        label="综合判定结果"
        min-width="10"
      >
        <template slot-scope="scope">
          {{ scope.row.is_qualified?'合格':'不合格' }}
          <el-popover
            v-model="scope.row.visible"
            v-permission="['raw_result_info','change']"
            placement="right"
            width="160"
          >
            <el-select v-model="qualityValue" placeholder="请选择">
              <el-option
                v-for="item in option"
                :key="item.name"
                :label="item.name"
                :value="item.label"
              />
            </el-select>
            <div style="text-align: right; margin-top: 5px">
              <el-button size="mini" type="text" @click="scope.row.visible = false">取消</el-button>
              <el-button type="primary" size="mini" @click="submitUser(scope.row,scope.$index)">确定</el-button>
            </div>
            <i slot="reference" class="el-icon-edit" style="font-size:20px" />
          </el-popover>
        </template>
      </el-table-column>
    </el-table>

    <page
      :old-page="false"
      :total="total"
      :current-page="search.page"
      @currentChange="currentChange"
    />
  </div>
</template>

<script>
// import qualityTestMethodSelect from '../components/qualityTestMethodSelect'
// import materialCodeSelect from '@/components/materialCodeSelect'
import { materialTestOrdersRaw, testIndicatorDataPointsRaw } from '@/api/base_w_three'
import page from '@/components/page'
import allProductNoSelect from '@/components/select_w/allProductNoSelect'

export default {
  components: { page, allProductNoSelect },
  data() {
    return {
      search: {},
      tableData: [],
      qualityValue: '',
      heardList: [],
      total: 0,
      loading: false,
      option: [{ label: true, name: '合格' }, { label: false, name: '不合格' }]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.loading = true
      try {
        const data1 = await testIndicatorDataPointsRaw('get', null, { params: this.search })
        const data = await materialTestOrdersRaw('get', null, { params: this.search })
        this.tableData = data.results || []
        this.heardList = data1 || []
        this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    changeList() {
      this.search.page = 1
      this.getList()
    },
    // testMethodChange(val) {
    //   // 试验方法id
    //   console.log(val, 666)
    // },
    changeMaterialName(val) {
      this.search.material_name = val
      this.changeList()
    },
    changeMaterialCode(val) {
      this.search.material_no = val
      this.changeList()
    },
    async submitUser(row, index) {
      try {
        // await materialTestOrdersRaw('get', null, { params: this.search })
        await materialTestOrdersRaw('patch', row.id, { data: {
          is_qualified: this.qualityValue
        }})
        this.tableData[index].is_qualified = this.qualityValue
        this.tableData[index].visible = false
      } catch (e) {
        //
      }
    },
    currentChange(page, page_size) {
      this.search.page = page
      this.search.page_size = page_size
      this.getList()
    }
  }
}
</script>

<style>

</style>
