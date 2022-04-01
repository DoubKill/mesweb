<template>
  <div>
    <!-- 帘布库 出入库履历查询 -->
    <materialInoutRecord :warehouse-name-props="'帘布库'" />
  </div>
</template>

<script>
import materialInoutRecord from '@/views/inventory/rubber-warehouse/material_inout_record.vue'

export default {
  name: 'CurtainInOutRecord',
  components: { materialInoutRecord }
}
</script>

<style>

</style>
