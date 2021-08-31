<template>
  <div>
    <!-- 硫磺库-库存明细 -->
    <materialInventoryManage :warehouse-name-props="'硫磺库'" />
  </div>
</template>

<script>
import materialInventoryManage from '@/views/inventory/rubber-warehouse/material-inventory-manage.vue'
export default {
  name: 'SulphurInventoryDetails',
  components: { materialInventoryManage }
}
</script>

<style>

</style>
