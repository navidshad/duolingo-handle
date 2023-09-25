<script setup lang="ts">
import { ref } from 'vue'
import type { VoucherType } from './types/voucher.type'
import type { SubmitEventPromise } from 'vuetify'
import { dataProvider } from '@modular-rest/client'
import { COLLECTIONS, DB } from '@/static/database'

const formEl = ref<HTMLFormElement>()
const formData = ref<VoucherType>({
  email: ''
})

const emailRules = [
  // Check if server error is not null
  () => {
    if (error.value !== null) {
      return error.value
    } else return true
  },
  // validate value as email
  (v: string) => /.+@.+/.test(v) || 'E-mail must be valid'
]

const error = ref(null)
const isLoading = ref(false)
async function createVoucher(event: SubmitEventPromise) {
  isLoading.value = true

  const { validate, resetValidation } = formEl.value!

  const { valid } = await validate()
  if (!valid) {
    isLoading.value = false
    return
  }

  resetValidation()

  await dataProvider
    .insertOne({
      database: DB.exam,
      collection: COLLECTIONS.voucher,
      doc: formData.value
    })
    .then((res) => {})
    .catch((res) => (error.value = res.error))

  await event

  isLoading.value = false
}
</script>

<template>
  <v-card min-width="500px">
    <v-form ref="formEl" validate-on="submit lazy" @submit.prevent="createVoucher">
      <v-card-title>
        <h3 class="text-h5">Create Voucher</h3>
      </v-card-title>

      <v-card-text>
        <v-text-field
          v-model="formData.email"
          :rules="emailRules"
          label="Email"
          outlined
          required
        />
      </v-card-text>

      <v-card-actions>
        <v-btn color="primary" type="submit" :loading="isLoading"> Create </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>
