<template>
    <div>
        <oms-refer v-bind='$attrs' v-on='$listeners'></oms-refer>
        <oms-table v-bind='$attrs' v-on='$listeners'>
          <template #chart>
            <slot name="chart"></slot>
          </template>
        </oms-table>
        <oms-page v-bind='$attrs' v-on='$listeners'></oms-page>
    </div>
</template>
<script>
  export default {
    name: 'OmsTableGroup', 
  }
</script>
