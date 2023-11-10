<template>
  <FrameBorder class="bg-white">
    <Frameheader ref="header" title="Conversation">
      <template #actions> </template>
    </Frameheader>

    <!-- Body -->
    <section
      class="flex flex-col items-start m-2 overflow-auto space-y-2"
      :style="{ height: contentHeight + 'px' }"
    >
      <div class="w-full" v-for="(dialog, index) in diaglogs" :key="index">
        <!-- Topic card -->
        <template v-if="dialog.type === 'topic'">
          <chat-card class="px-3 py-4">
            <h1 v-if="!dialog.content?.length">Capture the topic please!</h1>
            <div v-else>{{ dialog.content }}</div>
            <template #actions>
              <button-open-subtool
                size="small"
                icon="fa fa-square-plus"
                subtool="capture-text"
                :channelId="channelId"
                @onData="dialog.content = $event.text"
              />
            </template>
          </chat-card>
        </template>

        <!-- Voice Card -->
        <template v-else-if="dialog.type === 'voice-dialog'">
          <chat-card-voice
            v-model="dialog.caption"
            @remove="removeDialog(index)"
          />
        </template>

        <!-- Choice Card -->
        <template v-else-if="dialog.type === 'choice-dialog'">
          <chat-card-choice
            :index="index"
            v-model="dialog.options"
            @onAnswer="dialog.answer = $event"
            @remove="removeDialog(index)"
          />
        </template>
      </div>

      <div v-if="summary.length" class="w-full text-green-700">
        <p>{{ summary }}</p>
      </div>

      <!-- Add Actions -->
      <div class="flex justify-center space-x-2 w-full mt-4">
        <v-btn variant="flat" @click="addCard('choice-dialog')"
          >Add Choice</v-btn
        >
        <v-btn variant="flat" @click="addCard('voice-dialog')">Add Voice</v-btn>
        <v-btn
          variant="flat"
          @click="getDisscussionSummary"
          :loading="isSummarizing"
          >Summary</v-btn
        >
      </div>
    </section>
  </FrameBorder>
</template>

<script lang="ts">
import { defineComponent } from "vue";

// @ts-ignore
import HeaderMixin from "@/mixins/header-hight.js";
import ChatCard from "@/components/materials/ChatCard.vue";
import ChatCardVoice from "@/components/partials/ChatCardVoice.vue";
import ChatCardChoice from "@/components/partials/ChatCardChoice.vue";
import { computed } from "vue";
import type { DialogType } from "@/types/conversation";
import type { CompletionMessage } from "@/types/gpt";
import { createChatCompletion } from "@/services/ai";

export default defineComponent({
  components: { ChatCard, ChatCardVoice, ChatCardChoice },
  mixins: [HeaderMixin],

  provide() {
    return {
      diaglogs: computed(() => this.diaglogs),
      getDialogsSummary: this.getDialogsSummary,
    };
  },

  data() {
    return {
      channelId: new Date().getTime().toString() + Math.random().toString(),
      diaglogs: <DialogType[]>[
        {
          type: "topic",
          content: "",
        },
      ],
      isSummarizing: false,
      summary: "",
    };
  },

  methods: {
    addCard(type = "") {
      switch (type) {
        case "topic":
          this.diaglogs.push({
            type: type as any,
            content: "",
          });
          break;
        case "voice-dialog":
          this.diaglogs.push({
            type: type as any,
            caption: "",
          });
          break;
        case "choice-dialog":
          this.diaglogs.push({
            type: type as any,
            options: "",
          });
          break;
      }
    },

    removeDialog(index: number) {
      this.diaglogs.splice(index, 1);
    },

    getDialogsSummary(lastDialogIndex: number) {
      if (lastDialogIndex === 0) return "";

      let olderDialogsContent = "";

      for (let i = 1; i <= lastDialogIndex; i++) {
        const diaglog = this.diaglogs[i];
        const personLabel =
          diaglog.type === "choice-dialog" ? "You:" : "Other Person:";

        const content = diaglog.answer || diaglog.caption;

        olderDialogsContent += `${personLabel}: ${content?.trim()}\n\n`;
      }

      return olderDialogsContent;
    },

    getDisscussionSummary() {
      this.isSummarizing = true;
      const messages: CompletionMessage[] = [];

      // System message
      //
      messages.push({
        role: "system",
        content: `You have to summarize the giving conversation in the following topic: ${this.diaglogs[0].content?.trim()}`,
      });

      // Dialog summary
      //
      messages.push({
        role: "user",
        content: this.getDialogsSummary(this.diaglogs.length),
      });

      messages.push({
        role: "user",
        content: `Summarize the conversation in a paragraph.`,
      });

      createChatCompletion({ messages })
        .then((answer) => {
          this.summary = answer;
        })
        .finally(() => {
          this.isSummarizing = false;
        });
    },
  },
});
</script>
