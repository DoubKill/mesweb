<template>
  <div>
    <!-- 帘布库-库存明细 -->
    <materialInventoryManage :warehouse-name-props="'帘布库'" />
  </div>
</template>

<script>
import materialInventoryManage from '@/views/inventory/rubber-warehouse/material-inventory-manage.vue'
export default {
  name: 'CurtainInventoryDetails',
  components: { materialInventoryManage }
}
</script>

<style>

</style>
