<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterView } from 'vue-router'

const isNotLoginPage = computed(() => {
  const route = useRoute()
  return route.name !== 'login'
})
</script>

<template>
  <v-layout style="height: 100vh">
    <v-navigation-drawer v-if="isNotLoginPage" theme="dark">
      <v-list color="transparent">
        <v-list-item color="green" title="Voucher" to="/voucher" />
      </v-list>

      <template v-slot:append>
        <div class="pa-2">
          <v-btn block> Logout </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
    <RouterView />
  </v-layout>
</template>
