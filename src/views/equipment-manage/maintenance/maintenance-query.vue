<template>
  <div>
    <!-- 设备维护计划查询 -->
    <el-form :inline="true">
      <el-form-item label="维护类别">
        <el-select
          v-model="search.feeding_tye"
          placeholder="请选择"
          clearable
          @change="changeSearch"
        >
          <el-option
            v-for="item in options"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="计划名称">
        <el-input
          v-model="search.equip_no"
          style="width:250px"
          @input="changeSearch"
        />
      </el-form-item>
      <el-form-item label="计划日期">
        <el-date-picker
          v-model="search.dateValue"
          type="date"
          value-format="yyyy-MM-dd"
          @change="changeSearch"
        />
      </el-form-item>
      <el-form-item label="来源">
        <el-select
          v-model="search.feeding_ty"
          placeholder="请选择"
          clearable
          @change="changeSearch"
        >
          <el-option
            v-for="item in options1"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select
          v-model="search.feeding_type"
          placeholder="请选择"
          clearable
          @change="changeSearch"
        >
          <el-option
            v-for="item in options2"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="设备条件">
        <el-select
          v-model="search.feeding"
          placeholder="请选择"
          clearable
          @change="changeSearch"
        >
          <el-option
            v-for="item in options3"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="重要程度">
        <el-select
          v-model="search.feed"
          placeholder="请选择"
          clearable
          @change="changeSearch"
        >
          <el-option
            v-for="item in options4"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">导出Excel</el-button>
        <el-button type="primary" @click="changeSearch">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      row-key="id"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="40"
        :reserve-selection="true"
      />
      <el-table-column
        prop="date"
        label="维护类别"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="计划编号"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="计划名称"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="机台"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="维护标准"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="设备条件"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="重要条件"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="来源"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="状态"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="计划维护日期"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="下次维护日期"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="创建人"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="创建时间"
        min-width="20"
      />
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
import page from '@/components/page'
export default {
  name: 'MaintenanceQuery',
  components: { page },
  data() {
    return {
      search: {
        page: 1,
        page_size: 10
      },
      tableData: [],
      total: 0,
      options: ['巡检', '保养', '润滑', '标定'],
      options1: ['自动生成', '人工创建', '故障报修'],
      options2: ['未生成工单', '已生成工单', '计划执行中', '计划已完成'],
      options3: ['停机', '不停机'],
      options4: ['高', '中', '低'],
      multipleSelection: [],
      submit: false,
      creatOrder: {}
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {

    },
    changeSearch() {
      this.getList()
    },
    equipSelected(obj) {
      this.creatOrder.equip_no = obj || null
      console.log(this.creatOrder.equip_no)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
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
