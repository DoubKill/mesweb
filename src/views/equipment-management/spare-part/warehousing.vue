<template>
  <div>
    <!-- 备品备件入库管理 -->
    <el-form :inline="true">
      <el-form-item label="物料编码:">
        //
      </el-form-item>
      <el-form-item label="物料名称:">
        <el-input v-model="search.b" placeholder="请输入内容" />
      </el-form-item>
      <el-form-item label="库存位:">
        <inventoryPosition @changSelect="changInventoryPosition" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import inventoryPosition from '@/components/select_w/inventoryPosition'
export default {
  components: { inventoryPosition },
  data() {
    return {
      search: {}
    }
  },
  methods: {
    changInventoryPosition(obj) {
      console.log(obj, 444)
    }
  }
}
</script>

<style>

</style>
