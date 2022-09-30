<template>
  <div>
    <!-- 原材料-库存明细 -->
    <materialInventoryManage :warehouse-name-props="'原材料库'" />
  </div>
</template>

<script>
import materialInventoryManage from '@/views/inventory/rubber-warehouse/material-inventory-manage.vue'
export default {
  name: 'DeliveryInventoryDetails',
  components: { materialInventoryManage }
}
</script>

<style>

</style>
