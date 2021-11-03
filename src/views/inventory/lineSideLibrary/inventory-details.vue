<template>
  <div>
    <!-- 线边库-库存明细 -->
    <materialInventoryManage :warehouse-name-props="'线边库'" />
  </div>
</template>

<script>
import materialInventoryManage from '@/views/inventory/rubber-warehouse/material-inventory-manage.vue'
export default {
  name: 'LineSideInventoryDetails',
  components: { materialInventoryManage }
}
</script>

<style>

</style>
