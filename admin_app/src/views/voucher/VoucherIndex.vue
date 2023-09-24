<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>
<template>
  <v-navigation-drawer permanent>
    <v-list color="transparent">
      <v-list-item color="green" title="All Vouchers" to="/voucher/list" />
      <v-list-item color="green" title="Create a Voucher" to="/voucher/create" />
    </v-list>
  </v-navigation-drawer>

  <v-main class="d-flex align-center justify-center">
    <RouterView />
  </v-main>
</template>
