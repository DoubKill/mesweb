<template>
  <div>
    <!-- 备品备件入库管理 -->
    <el-form :inline="true">
      <el-form-item label="物料编码:">
        <materialCodeSelect
          :is-all-obj="true"
          @changeSelect="changeMaterialCode"
        />
      </el-form-item>
      <el-form-item label="物料名称:">
        <materialCodeSelect
          :is-all-obj="true"
          label-name="material_name"
          @changeSelect="changeMaterialName"
        />
      </el-form-item>
      <el-form-item label="库存位:">
        <inventoryPosition @changSelect="changeInventoryPosition" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import inventoryPosition from '@/components/select_w/inventoryPosition'
import materialCodeSelect from '@/components/materialCodeSelect/index'
export default {
  components: { inventoryPosition, materialCodeSelect },
  data() {
    return {
      search: {}
    }
  },
  methods: {
    changeInventoryPosition(obj) {
    },
    changeMaterialCode(obj) {

    },
    changeMaterialName(obj) {}
  }
}
</script>

<style>

</style>
