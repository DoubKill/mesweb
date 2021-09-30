<template>
  <div>
    <!-- 执行巡检工单 -->
    <el-form :inline="true">
      <el-form-item label="计划巡检时间">
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
      <el-form-item label="计划名称">
        <el-input
          v-model="search.equip_no"
          style="width:200px"
          @input="changeSearch"
        />
      </el-form-item>
      <el-form-item label="机台">
        <equip-select
          equip-type="密炼设备"
          @equipSelected="equipSelected"
        />
      </el-form-item>
      <el-form-item label="巡检标准">
        <el-input
          v-model="search.equip1"
          style="width:200px"
          @input="changeSearch"
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-select
          v-model="search.feeding"
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
      <el-form-item label="接单人">
        <el-input
          v-model="search.person"
          style="width:200px"
          @input="changeSearch"
        />
      </el-form-item>
      <el-form-item label="设备条件">
        <el-select
          v-model="search.feedi"
          placeholder="请选择"
          clearable
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
        <el-button type="primary">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      border
    >
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
        label="工单编号"
        min-width="20"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
          >{{ scope.row.date }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="date"
        label="机台"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="巡检标准"
        min-width="20"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
          >{{ scope.row.date }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="date"
        label="计划巡检日期"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="设备条件"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="重要程度"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="指派人"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="指派时间"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="接单人"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="接单时间"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="巡检人"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="巡检开始时间"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="巡检结束时间"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="状态"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="录入人"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="录入时间"
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
import EquipSelect from '@/components/EquipSelect/index'
export default {
  name: 'PatrolQuery',
  components: { EquipSelect, page },
  data() {
    return {
      search: {
        page: 1,
        page_size: 10
      },
      dateValue: [],
      tableData: [{ date: '1' }],
      total: 0,
      options2: ['已做成', '已接单', '等待物料', '等待外协维修', '已完成', '已关闭'],
      options3: ['停机', '不停机'],
      options4: ['高', '中', '低']
    }
  },
  methods: {
    changeDate() {

    },
    getList() {

    },
    changeSearch() {
      this.getList()
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisibleImg = true
    },
    equipSelected(obj) {
      this.creatOrder.equip_no = obj || null
      console.log(this.creatOrder.equip_no)
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
