<template>
  <div>
    <!-- 投料操作履历查询 -->
    <el-form :inline="true">
      <el-form-item label="投料区分">
        <el-select
          v-model="searchForm.feeding_type"
          placeholder="请选择"
          clearable
          @change="changeSearch"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="投料口">
        <el-select
          v-model="searchForm.feeding_port_no"
          placeholder="请选择"
          clearable
          @change="changeSearch"
        >
          <el-option
            v-for="item in ['掺混','白炭黑','炭黑','Z01T01','Z01T02','Z01F01','Z01F02','OIL01','OIL02']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="投料日期">
        <el-date-picker
          v-model="searchForm.feeding_datetime"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="changeSearch"
        />
      </el-form-item>
      <el-form-item label="班次">
        <class-select @classSelected="classSelected" />
      </el-form-item>
      <el-form-item label="投料结果">
        <el-select
          v-model="searchForm.feed_result"
          placeholder="请选择"
          clearable
          @change="changeSearch"
        >
          <el-option
            v-for="item in ['Y','N']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="投料人员">
        <el-input v-model="searchForm.feeding_username" clearable @input="debounceList" />
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      border
    >
      <el-table-column
        prop="feeding_type"
        label="投料区分"
        min-width="20"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.feeding_type == 1">粉料罐投料</span>
          <span v-if="scope.row.feeding_type == 2">炭黑罐投料</span>
          <span v-if="scope.row.feeding_type == 3">油料罐投料</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="feeding_port_no"
        label="投料口"
        min-width="20"
      />
      <el-table-column
        prop="feeding_time"
        label="投料时间"
        min-width="20"
      />
      <el-table-column
        prop="feeding_classes"
        label="投料班次"
        min-width="20"
      />
      <el-table-column
        prop="tank_bar_code"
        label="料罐条码"
        min-width="20"
      />
      <el-table-column
        prop="tank_material_name"
        label="料罐物料名称"
        min-width="20"
      />
      <el-table-column
        prop="feeding_bar_code"
        label="投料物料条码"
        min-width="20"
      />
      <el-table-column
        prop="feeding_material_name"
        label="投料物料名称"
        min-width="20"
      />
      <el-table-column
        prop="qty"
        label="投料数量"
        min-width="20"
      />
      <el-table-column
        prop="weight"
        label="投料重量（kg）"
        min-width="20"
      />
      <el-table-column
        prop="feed_result"
        label="投料防错结果"
        min-width="20"
      />
      <el-table-column
        prop="feeding_username"
        label="投料人员"
        min-width="20"
      />
    </el-table>
    <page
      :total="total"
      :old-page="false"
      :current-page="searchForm.page"
      @currentChange="currentChange"
    />
  </div>
</template>

<script>
import page from '@/components/page'
import ClassSelect from '@/components/ClassSelect'
import { rawQuery } from '@/api/jqy'
import { debounce } from '@/utils/'
export default {
  name: 'RawQuery',
  components: { page, ClassSelect },
  data() {
    return {
      searchForm: {},
      loading: false,
      tableData: [],
      total: 0,
      options: [{
        value: '1',
        label: '粉料罐投料'
      }, {
        value: '2',
        label: '炭黑罐投料'
      }, {
        value: '3',
        label: '油料罐投料'
      }]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    changeSearch() {
      this.loading = true
      if (this.searchForm.feeding_datetime) {
        this.searchForm.feeding_time_after = this.searchForm.feeding_datetime[0]
        this.searchForm.feeding_time_before = this.searchForm.feeding_datetime[1]
      } else {
        delete this.searchForm.feeding_time_before
        delete this.searchForm.feeding_time_after
      }
      this.searchForm.page = 1
      this.getList()
    },
    async getList() {
      try {
        this.loading = true
        const data = await rawQuery('get', null, { params: this.searchForm })
        this.tableData = data.results || []
        this.loading = false
        this.total = data.count
      } catch (e) { this.loading = false }
    },
    classSelected(className) {
      this.searchForm.feeding_classes = className || null
      this.searchForm.page = 1
      this.getList()
    },
    currentChange(page, pageSize) {
      this.searchForm.page = page
      this.searchForm.page_size = pageSize
      this.getList()
    },
    debounceList() {
      this.searchForm.page = 1
      debounce(this, 'getList')
    }
  }
}
</script>
