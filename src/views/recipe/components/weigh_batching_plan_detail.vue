<template>
  <div>
    <el-form :inline="true">
      <el-form-item label="小料配方编码">
        <el-input size="mini" :value="batchingClassesPlan.weight_batch_no" :disabled="true" />
      </el-form-item>
      <el-form-item label="胶料编码">
        <el-input size="mini" :value="batchingClassesPlan.stage_product_batch_no" :disabled="true" />
      </el-form-item>
      <el-form-item label="生产机型">
        <el-input size="mini" :value="batchingClassesPlan.category_name" :disabled="true" />
      </el-form-item>
      <!-- <el-form-item label="配料设备">
        <el-input size="mini" :value="batchingClassesPlan.equip_name" :disabled="true" />
      </el-form-item> -->
      <el-form-item label="计划数量(包)">
        <el-input size="mini" :value="batchingClassesPlan.plan_package" :disabled="true" />
      </el-form-item>
    </el-form>
    <el-row>
      <el-col :span="4">
        <el-row>
          <el-col :span="24">
            <el-form label-width="80px">
              <el-form-item label="分包">
                <el-input :value="cntType.package_cnt" :disabled="true" />
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" style="text-align:right;padding-right:5px">
            <span>{{ cntType.package_type===1?'自动':'手动' }}</span>
            <!-- {{ cntType.weigh_type===1?'硫磺包':'细料包' }}{{ cntType.tag }} -->
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="20">
        <el-table
          border
          style="width: 100%"
          fit
          :data="cntType.weight_details"
        >
          <el-table-column label="原材料编码" prop="material_no" align="center" />
          <el-table-column label="原材料名称" align="center" prop="material_name" />
          <el-table-column label="总重量(kg)" prop="standard_weight" align="center" />
          <el-table-column
            label="单包重量(kg)"
            align="center"
            :formatter="(row, column) => {
              return (Number(row.standard_weight)/ Number(cntType.package_cnt)).toFixed(2)
            }"
          />
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getWeighCntType } from '@/api/small-material-recipe'

export default {
  props: {
    batchingClassesPlan: {
      type: Object,
      required: false,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      cntType: {}
    }
  },
  watch: {
    batchingClassesPlan() {
      this.getWeighCntType()
    }
  },
  created() {
    this.getWeighCntType()
  },
  methods: {
    typeName() {
      if (this.cntType) {
        switch (this.cntType.weigh_type) {
          case 1:
            return '化学药品A'
          case 2:
            return '化学药品B'
          case 3:
            return '硫磺'
        }
      } else {
        return ''
      }
    },
    async getWeighCntType() {
      this.cntType = {}
      if (this.batchingClassesPlan.weigh_cnt_type) {
        this.cntType = await getWeighCntType(this.batchingClassesPlan.weigh_cnt_type)
      }
    }
  }
}
</script>
