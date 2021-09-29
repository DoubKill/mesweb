<template>
  <div>
    <!-- 维修工单查询 -->
    <el-form :inline="true">
      <el-form-item label="计划维修时间">
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
      <el-form-item label="工单编号">
        <el-input
          v-model="search.equip1"
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
      <el-form-item label="维修标准">
        <el-input
          v-model="search.equip"
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
      <el-form-item label="维修人">
        <el-input
          v-model="search.person"
          style="width:200px"
          @input="changeSearch"
        />
      </el-form-item>
      <el-form-item label="验收人">
        <el-input
          v-model="search.person1"
          style="width:200px"
          @input="changeSearch"
        />
      </el-form-item>
      <el-form-item label="验收人">
        <el-select
          v-model="search.jg"
          placeholder="请选择"
          clearable
          @change="changeSearch"
        >
          <el-option
            v-for="item in ['合格','不合格']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否需要外协">
        <el-select
          v-model="search.f"
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
      <el-form-item label="是否需要物料">
        <el-select
          v-model="search.fe"
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
      <el-form-item>
        <el-button type="primary">导出Excel</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      border
    >
      <el-table-column
        prop="date"
        label="计划/报修编号"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="计划/报修名称"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="工单编号"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="机台"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="部位名称"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="维修标准/故障原因"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="故障详情描述"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="维修记录"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="计划维修日期"
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
        label="状态"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="维修人"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="维修开始时间"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="维修结束时间"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="是否需要物料"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="是否需要外协"
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
        label="验收人"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="验收时间"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="验收结果"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="验收记录"
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
  name: 'EquipmentQuery',
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
