<template>
  <v-main class="d-flex align-center justify-center">
    <v-card min-width="400px">
      <v-card-title> Login </v-card-title>

      <v-card-text>
        <v-form>
          <v-text-field label="Email" v-model="email" name="email" />
          <v-text-field label="Password" v-model="password" name="password" type="password" />
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-btn color="primary" @click="doLogin"> Login </v-btn>
      </v-card-actions>
    </v-card>
  </v-main>
</template>

<script setup lang="ts">
import { authentication } from '@modular-rest/client'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')

async function doLogin() {
  const user = await authentication.login(
    {
      idType: 'email',
      id: email.value,
      password: password.value
    },
    true
  )

  if (user) {
    console.log('User logged in', user)
    router.push('/voucher')
  }
}
</script>
