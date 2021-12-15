<template>
  <div>
    <!-- 机台设备停机计划设置 -->
    <el-form :inline="true">
      <el-form-item label="工厂日期">
        <el-date-picker
          v-model="day_time"
          type="date"
          :clearable="false"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          @change="getList"
        />
      </el-form-item>
      <el-form-item style="float:right">
        <el-button
          type="primary"
          :loading="saveLoading"
          @click="save()"
        >保存</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
      border
    >
      <el-table-column
        prop="equip"
        label="机台"
        min-width="20"
      >
        <template slot-scope="scope">
          <equip-select :is-created="scope.row.equip?true:false" :default-val="scope.row.equip" equip-type="密炼设备" @equipSelected="equipChanged($event,scope.$index)" />
        </template>
      </el-table-column>
      <el-table-column
        prop="type"
        label="停机类型"
        min-width="20"
      >
        <template slot-scope="scope">
          <el-select
            v-model="scope.row.type"
            placeholder="请选择"
          >
            <el-option
              v-for="item in ['1','2']"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        prop="time"
        label="停机开始时间"
        min-width="20"
      >
        <template slot-scope="scope">
          <el-date-picker
            v-model="scope.row.time"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择停机开始时间"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="times"
        label="停机时长(小时)"
        min-width="20"
      >
        <template slot-scope="scope">
          <el-input-number
            v-model="scope.row.times"
            :precision="1"
            :min="0"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="desc"
        label="备注"
        min-width="20"
      >
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.desc"
            placeholder="请输入内容"
          />
        </template>
      </el-table-column>
      <el-table-column
        width="70px"
        label="操作"
        fixed="right"
      >
        <template
          v-if="scope.$index!==tableData.length-1"
          slot-scope="scope"
        >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index,scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { setDate } from '@/utils'
import EquipSelect from '@/components/EquipSelect'
import { globalCodesUrl } from '@/api/base_w'
export default {
  name: 'ScheduleEquipmentShutdownPlan',
  components: { EquipSelect },
  data() {
    return {
      day_time: setDate(),
      loading: false,
      options: [],
      tableData: [],
      saveLoading: false
    }
  },
  created() {
    this.getShutdownType()
    this.getList()
  },
  methods: {
    async getShutdownType() {
      try {
        const data = await globalCodesUrl('get', { params: { all: 1, class_name: '停机类型' }})
        this.options = data.results || []
      } catch (e) {
        this.options = []
      }
    },
    async getList() {
      try {
        this.loading = true
        // const data = await equipWarehouseRecord('get', null, { params: day_time })
        this.tableData = []
        this.tableData.push({
          equip: ''
        })
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    equipChanged(arr, index) {
      this.$set(this.tableData[index], 'equip', arr.id)
      if (this.tableData.length - 1 === index) {
        // 处于最后一行
        const baseData = {}
        this.tableData.push(baseData)
      }
    },
    save() {

    },
    handleDelete(index, row) {
      if (this.tableData.length === 1) {
        this.$message.warning('最少保留一行')
        return
      }
      this.$confirm(
        '是否删除?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        this.tableData.splice(index, 1)
      })
    }
  }
}
</script>

<style>

</style>
