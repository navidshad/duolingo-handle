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

  try {
    const alreadyExist = await dataProvider.findOne<VoucherType>({
      database: DB.exam,
      collection: COLLECTIONS.voucher,
      query: {
        email: formData.value.email
      }
    })

    // If already exist then update
    //
    if (alreadyExist) {
      if (!alreadyExist.examVouchers) alreadyExist.examVouchers = []

      alreadyExist.examVouchers.push({
        remainingExams: 4
      })

      await dataProvider.updateOne({
        database: DB.exam,
        collection: COLLECTIONS.voucher,
        query: { _id: alreadyExist._id },
        update: alreadyExist
      })
    }
    // Else create new one
    //
    else {
      await dataProvider.insertOne({
        database: DB.exam,
        collection: COLLECTIONS.voucher,
        doc: formData.value
      })
    }
  } catch (err) {
    error.value = error as any
  }

  await event

  isLoading.value = false
}
</script>

<template>
  <v-main class="d-flex align-center justify-center">
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
  </v-main>
</template>
