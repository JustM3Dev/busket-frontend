<template>
  <div>
    <v-card v-for="(item, i) in lists" :key="i" class="mt-3 mx-16 pa-2" outlined>
      <v-row>
        <v-col
          cols="auto"
          class="mr-auto"
          align-self="center"
        >
          {{ item.name }}
        </v-col>
        <v-col cols="auto">
          <v-btn color="primary" icon
                 @click="item.starred = !item.starred; snack(item.starred ? `Added '${item.name}' to starred lists.` : `Removed '${item.name}' from starred lists.`);">
            <v-icon>mdi-{{ item.starred ? 'star' : 'star-outline' }}</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import EventBus from '@/eventbus';

interface List {
  name: string,
  starred: boolean,
  category?: string
}

@Component
export default class ListOverview extends Vue {
  protected lists: List[] = [];

  mounted (): void {
    this.lists.push({
      name: 'Shopping',
      starred: true,
      category: 'Shopping',
    });

    this.lists.push({
      name: 'Nice',
      starred: false,
      category: 'Business?',
    });
  }

  snack (message: string): void {
    EventBus.$emit('snackbar', { message });
  }
}
</script>
