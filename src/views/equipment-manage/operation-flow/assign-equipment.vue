<template>
  <div>
    <!-- 指派维修工单 -->
    <el-form :inline="true">
      <el-form-item label="计划/报修日期">
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
      <el-form-item label="计划/报修名称">
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
      <el-form-item label="维修标准">
        <el-input
          v-model="search.equip"
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
            v-for="item in ['停机', '不停机']"
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
            v-for="item in ['高', '中', '低']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select
          v-model="search.feeding"
          placeholder="请选择"
          clearable
          @change="changeSearch"
        >
          <el-option
            v-for="item in ['已做成', '已接单', '已完成', '已关闭']"
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
      <el-form-item label="报修人">
        <el-input
          v-model="search.person1"
          style="width:200px"
          @input="changeSearch"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="dialog">指派</el-button>
        <el-button type="primary">接单</el-button>
        <el-button type="primary">退单</el-button>
        <el-button type="primary">关闭</el-button>
        <el-button type="primary">导出Excel</el-button>
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
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
          >{{ scope.row.date }}</el-link>
        </template>
      </el-table-column>
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
    </el-table>
    <page
      :old-page="false"
      :total="total"
      :current-page="search.page"
      @currentChange="currentChange"
    />
    <el-dialog
      title="指派工单"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-form :inline="true" label-width="120px">
        <el-form-item style="" prop="checkList">
          <el-checkbox-group v-model="checkList">
            <el-checkbox label="张三" />
            <el-checkbox label="李四" />
            <el-checkbox label="王五" />
            <el-checkbox label="赵六" />
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose(false)">取 消</el-button>
        <el-button :loading="submit" type="primary" @click="generateFun">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import page from '@/components/page'
import EquipSelect from '@/components/EquipSelect/index'
export default {
  name: 'AssignEquipment',
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
      checkList: [],
      multipleSelection: [],
      dialogVisible: false,
      submit: false,
      creatOrder: {}
    }
  },
  created() {
    this.getList()
  },
  methods: {
    generateFun(obj) {
      this.dialogVisible = true
      console.log(obj, 'obj')
    },
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
    dialog() {
      this.dialogVisible = true
    },
    handleClose(done) {
      this.dialogVisible = false
      if (done) {
        done()
      }
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
