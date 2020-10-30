<template>
  <div v-loading="loading">
    <!-- 胶料单车次时间汇总 -->
    <el-form :inline="true">
      <el-form-item label="开始时间:">
        <el-date-picker
          v-model="search.date"
          type="date"
          placeholder="开始日期"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>
      <el-form-item label="班次:">
        <class-select
          @classSelected="classChanged"
        />
      </el-form-item>
      <el-form-item label="设备编码:">
        <equip-select
          @changeSearch="equipChanged"
        />
      </el-form-item>
      <el-form-item label="胶料编码:">
        <product-no-select @productBatchingChanged="productBatchingChanged" />
      </el-form-item>
    </el-form>
    <el-form :inline="true">
      <el-form-item label="总耗时:">
        {{ 111 }}
      </el-form-item>
      <el-form-item label="最小耗时:">
        {{ 222 }}
      </el-form-item>
      <el-form-item label="最大耗时:">
        {{ 333 }}
      </el-form-item>
      <el-form-item label="平均耗时:">
        {{ 444 }}
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      border
    >
      <el-table-column
        type="index"
        label="No"
      />
      <el-table-column
        prop="b"
        label="设备编码"
      />
      <el-table-column
        prop="c"
        label="胶料编码"
      />
      <el-table-column
        prop="d"
        label="车次"
      />
      <el-table-column
        prop="e"
        label="耗时"
      />
    </el-table>
    <page
      :total="total"
      :current-page="search.page"
      @currentChange="currentChange"
    />
  </div>
</template>

<script>
import productNoSelect from '@/components/ProductNoSelect'
import equipSelect from '@/components/select_w/equip'
import page from '@/components/page'
import classSelect from '@/components/ClassSelect'
export default {
  components: { productNoSelect, page, equipSelect, classSelect },
  data() {
    return {
      total: 0,
      loading: false,
      search: {
        page: 1,
        equip_no: null,
        date: ''
      },
      tableData: []
    }
  },
  methods: {
    currentChange(page) {
      this.search.page = page
    },
    productBatchingChanged(val) {

    },
    equipChanged() {},
    timeSpanChanged() {},
    classChanged() {}
  }
}
</script>

<style>

</style>
