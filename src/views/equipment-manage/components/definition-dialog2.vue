<template>
  <div>
    <!-- 巡检标准弹框 -->
    <el-form
      ref="createForm1"
      :inline="true"
      :model="typeForm"
      label-width="150px"
    >
      <el-row>
        <el-col :span="8">
          <el-form-item label="作业类型" prop="work_type">
            <el-input v-model="typeForm.work_type" disabled style="width:200px" />
          </el-form-item>
          <el-form-item label="标准编号" prop="standard_code">
            <el-input v-model="typeForm.standard_code" disabled style="width:200px" />
          </el-form-item>
          <el-form-item label="标准名称" prop="standard_name">
            <el-input v-model="typeForm.standard_name" style="width:200px" disabled />
          </el-form-item>
          <el-form-item label="类别" prop="type">
            <el-select
              v-model="typeForm.type"
              disabled
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="item in ['机械', '电气','通用']"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="设备条件" prop="equip_condition">
            <el-select
              v-model="typeForm.equip_condition"
              disabled
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
          <el-form-item label="重要程度" prop="important_level">
            <el-select
              v-model="typeForm.important_level"
              disabled
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="item in ['高', '中', '低']"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="机台">
            <el-input v-model="typeForm.equip" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="起始时间" prop="start_time">
            <el-date-picker
              v-model="typeForm.start_time"
              disabled
              style="width:180px"
              value-format="yyyy-MM-dd"
              :clearable="true"
            />
          </el-form-item>
          <el-form-item label="维护周期" prop="maintenance_cycle">
            <el-input-number v-model="typeForm.maintenance_cycle" disabled placeholder="" controls-position="right" :min="0" />
            <el-form-item style="width:100px">
              <el-select
                v-model="typeForm.cycle_unit"
                disabled
                clearable
                placeholder=""
              >
                <el-option
                  v-for="item in ['4小时','班次','日','周','月','季度','年','车数']"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-form-item>
          <el-form-item label="周期数" prop="cycle_num">
            <el-input-number v-model="typeForm.cycle_num" disabled placeholder="" controls-position="right" :min="0" />
          </el-form-item>
          <el-form-item label="所需人数" prop="cycle_person_num">
            <el-input-number v-model="typeForm.cycle_person_num" disabled placeholder="" controls-position="right" :min="0" />
          </el-form-item>
          <el-form-item label="作业时间" prop="operation_time">
            <el-input-number v-model="typeForm.operation_time" disabled placeholder="" controls-position="right" :min="0" />
            <el-form-item prop="operation_time_unit" style="width:100px">
              <el-select
                v-model="typeForm.operation_time_unit"
                disabled
                clearable
                placeholder=""
              >
                <el-option
                  v-for="item in ['日','小时','分钟','秒','车次']"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-form-item>
          <el-form-item label="钉钉提醒发送" prop="remind_flag">
            <el-checkbox v-model="typeForm.remind_flag1" label="包干人" disabled />
            <el-checkbox v-model="typeForm.remind_flag2" label="上级" disabled />
            <el-checkbox v-model="typeForm.remind_flag3" label="上上级" disabled />
          </el-form-item>
        </el-col>
        <el-form-item
          label="作业内容"
          prop="work_list"
        >
          <el-table
            :data="typeForm.work_list"
            border
            style="width: 100%"
          >
            <el-table-column
              type="index"
              label="次序"
            />
            <el-table-column
              label="区域编号"
              width="180"
              prop="equip_area_define__area_code"
            />
            <el-table-column
              label="区域名称"
              width="150"
              prop="equip_area_define__area_name"
            />
            <el-table-column
              width="150"
              label="部位名称"
              prop="equip_part__part_name"
            />
            <el-table-column
              width="150"
              label="部件名称"
              prop="equip_component__component_name"
            />
            <el-table-column
              label="作业项目"
              width="200px"
              prop="equip_job_item_standard__standard_name"
            />
            <el-table-column
              label="作业项目详情"
              width="200px"
              prop="work_details_column"
            />
          </el-table>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    typeForm: {
      type: Object,
      default() {
        return {}
      }
    },
    show: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  watch: {
    show(val) {
      if (val) {
        if (this.typeForm.cycle_person_num === null) {
          this.typeForm.cycle_person_num = undefined
        }
        if (this.typeForm.operation_time === null) {
          this.typeForm.operation_time = undefined
        }
        if (this.typeForm.maintenance_cycle === null) {
          this.typeForm.maintenance_cycle = undefined
        }
      }
    }
  },
  created() {
    if (this.typeForm.cycle_person_num === null) {
      this.typeForm.cycle_person_num = undefined
    }
    if (this.typeForm.operation_time === null) {
      this.typeForm.operation_time = undefined
    }
    if (this.typeForm.maintenance_cycle === null) {
      this.typeForm.maintenance_cycle = undefined
    }
  }

}
</script>

<style lang="scss" scoped>

</style>

