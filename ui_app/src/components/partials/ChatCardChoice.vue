<template>
  <chat-card stick-to-right>
    <h1 class="p-2" v-if="!content?.length">Capture the Coices!</h1>

    <!-- Captured Content -->
    <section v-else>
      <label class="m-2 border-b-2">Total Options: {{ total }}</label>
      <textarea
        class="w-full h-full p-2"
        v-model="content"
        placeholder="Type your choices here..."
      />

      <div v-if="answer.length" class="text-green-700 p-2 border-t-2">
        <p>{{ answer }}</p>
      </div>

      <div>
        <v-btn
          :loading="isFinding"
          variant="text"
          class="m-2"
          color="primary"
          @click="find"
          >Find</v-btn
        >
      </div>
    </section>

    <template #actions>
      <button-open-subtool
        size="small"
        icon="fa fa-square-plus"
        subtool="capture-text"
        :channelId="channelId"
        @onData="content = $event.text"
      />

      <v-btn
        class="my-2"
        size="small"
        variant="text"
        icon="fa fa-remove"
        @click="$emit('remove')"
      />
    </template>
  </chat-card>
</template>

<script lang="ts">
import { createChatCompletion } from "@/services/ai";
import type { DialogType } from "@/types/conversation";
import type { CompletionMessage } from "@/types/gpt";
import { inject } from "vue";
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    return {
      diaglogs: inject<DialogType[]>("diaglogs", []),
      getDialogsSummary: inject<(index: number) => string>(
        "getDialogsSummary",
        (index: number) => ""
      ),
    };
  },

  props: {
    index: {
      type: Number,
      requered: true,
    },
    modelValue: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      channelId: new Date().getTime().toString() + Math.random().toString(),
      isFinding: false,
      content: "",
      answer: "",
      tab: 0,
    };
  },

  computed: {
    total() {
      return this.content.split("\n\n").length;
    },
  },

  watch: {
    modelValue: {
      immediate: true,
      handler(val) {
        if (val !== this.content) this.content = val;
      },
    },

    content(val) {
      this.$emit("update:modelValue", val);
    },
  },

  methods: {
    async find() {
      this.isFinding = true;
      const currentIndex = this.index || 0;

      const messages: CompletionMessage[] = [];

      // System message
      //
      messages.push({
        role: "system",
        content: `You have to guess a dialog for the following topic: ${this.diaglogs[0].content?.trim()}`,
      });

      // Older Dialogs messages
      //
      messages.push({
        role: "user",
        content: this.getDialogsSummary(currentIndex - 1),
      });

      // Current Dialog
      //
      const diaglog = this.diaglogs[this.index || 0];
      const options = diaglog.options
        ?.split("\n")
        .map((x) => "\n- " + x.trim());

      messages.push({
        role: "user",
        content: `
          You: ??

          So guess the choice from the following points:
          ${options}

          Note: Return the answer only.
        `,
      });

      createChatCompletion({ message: messages })
        .then((answer) => {
          this.answer = answer;
          this.$emit("onAnswer", answer);
        })
        .finally(() => {
          this.isFinding = false;
        });
    },
  },
});
</script>
