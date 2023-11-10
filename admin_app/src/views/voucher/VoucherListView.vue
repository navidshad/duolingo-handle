<script setup lang="ts">
import { voucherStore } from '@/stores/voucher'
import { onMounted } from 'vue'

const store = voucherStore()

onMounted(() => {
  store.getList()
})
</script>

<template>
  <v-main class="d-flex justify-center align-content-center flex-wrap">
    <v-card
      v-for="(voucher, index) of store.list"
      :key="index"
      class="ma-2"
      min-width="300px"
      height="200px"
    >
      <v-card-title>{{ voucher.email }}</v-card-title>
      <v-card-text>
        <span>{{ voucher._id }}</span>
        <div v-for="(exam, i) of voucher.examVouchers" :key="i">
          <span
            >Voucher <span>{{ i + 1 }}</span> Remaining Exams: {{ exam.remainingExams }}</span
          >
        </div>
      </v-card-text>
    </v-card>
  </v-main>
</template>
