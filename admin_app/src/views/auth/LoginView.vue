<template>
  <v-main class="d-flex align-center justify-center">
    <v-card min-width="400px">
      <v-card-title> Login </v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field label="Email" />
          <v-text-field label="Password" />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary"> Login </v-btn>
      </v-card-actions>
    </v-card>
  </v-main>
</template>

<script setup lang="ts"></script>
