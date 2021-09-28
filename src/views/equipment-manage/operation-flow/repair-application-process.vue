<template>
  <div>
    <!-- 报修申请处理 -->
    <el-form :inline="true">
      <el-form-item label="报修单名称">
        <el-input
          v-model="search.equip_no"
          style="width:250px"
          @input="changeSearch"
        />
      </el-form-item>
      <el-form-item label="报修部门">
        <el-select
          v-model="search.feeding_tye"
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
      <el-form-item label="机台">
        <equip-select
          equip-type="密炼设备"
          @equipSelected="equipSelected"
        />
      </el-form-item>
      <el-form-item label="是否已停机">
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
      <el-form-item label="报修起止时间">
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
      <el-form-item label="报修人">
        <el-input
          v-model="search.person"
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

      <el-form-item>
        <el-button type="primary">指派申请</el-button>
        <el-button type="primary">关闭申请</el-button>
        <el-button type="primary">生成工单</el-button>
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
        label="报修单号"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="报修单名称"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="报修部门"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="故障发生时间"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="是否已停机"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="重要程度"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="机台"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="设备部位条码"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="设备部位名称"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="停机原因"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="故障描述"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="状态"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="报修人"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="报修时间"
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
  name: 'EquipmentRepairProcess',
  components: { EquipSelect, page },
  data() {
    return {
      search: {
        page: 1,
        page_size: 10
      },
      dateValue: [],
      tableData: [],
      total: 0,
      options1: ['巡检', '生产', '其他'],
      options2: ['待处理', '已处理'],
      options3: ['停机', '不停机'],
      options4: ['高', '中', '低'],
      multipleSelection: [],
      creatOrder: {}
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
