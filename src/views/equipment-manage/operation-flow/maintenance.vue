<template>
  <div>
    <!-- 设备维护计划 -->
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
        <el-button type="primary">指派计划</el-button>
        <el-button type="primary">关闭计划</el-button>
        <el-button type="primary">生成工单</el-button>
        <el-button type="primary" @click="dialog">新建</el-button>
      </el-form-item>
    </el-form>
    <el-dialog
      title="新建维护计划"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-form :inline="true" label-width="120px">
        <el-form-item style="" label="维护类别" prop="warehouse">
          <el-select
            v-model="creatOrder.mater"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in options"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item style="" label="维护计划名称" prop="order_qty">
          <el-input
            v-model="creatOrder.order_qty"
            placeholder="请输入维护计划名称"
          />
        </el-form-item>
        <el-form-item label="生产机台">
          <equip-select
            equip-type="密炼设备"
            :is-multiple="true"
            @equipSelected="equipSelected"
          />
        </el-form-item>
        <el-form-item label="维护标准">
          <el-input
            v-model="creatOrder.material_name"
            style="width:250px"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
            />
          </el-input>
        </el-form-item>
        <el-form-item label="计划维护日期">
          <el-date-picker
            v-model="creatOrder.dateValue"
            type="date"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="下次维护日期">
          <el-date-picker
            v-model="creatOrder.dateValue1"
            type="date"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="设备条件">
          <el-select
            v-model="creatOrder.feeding"
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
            v-model="creatOrder.feed"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in options4"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose(false)">取 消</el-button>
        <el-button :loading="submit" type="primary" @click="generateFun">确 定</el-button>
      </span>
    </el-dialog>
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
import EquipSelect from '@/components/EquipSelect/index'
export default {
  name: 'Maintenance',
  components: { EquipSelect, page },
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
      dialogVisible: false,
      submit: false,
      creatOrder: {}
    }
  },
  methods: {
    generateFun(obj) {
      this.dialogVisible = true
      console.log(obj, 'obj')
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
