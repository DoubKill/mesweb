<template>
  <div>
    <!-- 作业标准弹框 -->
    <el-form ref="typeForm" :model="typeForm" label-width="100px">
      <el-form-item label="作业类型" prop="work_type">
        <el-select
          v-model="typeForm.work_type"
          disabled
          placeholder="请选择"
        >
          <el-option
            v-for="item in ['巡检','保养','维修','润滑','标定']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="标准编号" prop="standard_code">
        <el-input v-model="typeForm.standard_code" disabled style="width:250px" />
      </el-form-item>
      <el-form-item label="标准名称" prop="standard_name">
        <el-input v-model="typeForm.standard_name" disabled style="width:250px" />
      </el-form-item>
      <el-form-item label="作业详情内容">
        <el-table
          :data="typeForm.work_details"
          border
          style="width: 100%"
        >
          <el-table-column
            label="序号"
            type="index"
          />
          <el-table-column
            prop="date"
            label="作业内容"
          >
            <template slot-scope="{row}">
              <el-input v-model="row.content" disabled />
            </template>
          </el-table-column>
          <el-table-column
            prop="date"
            label="类型"
          >
            <template slot-scope="{row}">
              <el-select v-model="row.check_standard_type" disabled>
                <el-option
                  v-for="item in ['有无','数值范围','正常异常','完成未完成','合格不合格']"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            prop="date"
            label="判断标准/步骤说明"
          >
            <template slot-scope="{row}">
              <div v-if="row.check_standard_type==='有无'">
                <el-switch
                  v-model="row.check_standard_desc"
                  disabled
                  active-value="无"
                  inactive-value="有"
                  active-text="无"
                  inactive-text="有"
                />
              </div>
              <div v-if="row.check_standard_type==='正常异常'">
                <el-switch
                  v-model="row.check_standard_desc"
                  disabled
                  active-value="正常"
                  inactive-value="异常"
                  active-text="正常"
                  inactive-text="异常"
                />
              </div>
              <div v-if="row.check_standard_type==='完成未完成'">
                <el-switch
                  v-model="row.check_standard_desc"
                  disabled
                  active-value="完成"
                  inactive-value="未完成"
                  active-text="完成"
                  inactive-text="未完成"
                />
              </div>
              <div v-if="row.check_standard_type==='合格不合格'">
                <el-switch
                  v-model="row.check_standard_desc"
                  disabled
                  active-value="合格"
                  inactive-value="不合格"
                  active-text="合格"
                  inactive-text="不合格"
                />
              </div>
              <div v-if="row.check_standard_type==='数值范围'">
                <el-input v-model="row.check_standard_desc_a" disabled style="width:120px" />
                -
                <el-input v-model="row.check_standard_desc_b" disabled style="width:120px" />
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="date"
            label="单位"
          >
            <template slot-scope="{row}">
              <el-select v-model="row.check_standard_type" disabled>
                <el-option
                  v-for="item in []"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
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
        this.typeForm.work_details.forEach(D => {
          if (D.check_standard_type === '数值范围') {
            D.check_standard_desc_a = D.check_standard_desc.split('-')[0]
            D.check_standard_desc_b = D.check_standard_desc.split('-')[1]
          }
        })
      }
    }
  },
  created() {
    this.typeForm.work_details.forEach(D => {
      if (D.check_standard_type === '数值范围') {
        D.check_standard_desc_a = D.check_standard_desc.split('-')[0]
        D.check_standard_desc_b = D.check_standard_desc.split('-')[1]
      }
    })
  }

}
</script>

<style lang="scss" scoped>

</style>

