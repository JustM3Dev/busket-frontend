<template>
  <div>
    <v-card v-for="(item, i) in lists" :key="i" class="mt-3 mx-16 pa-2" outlined ripple @click="$router.push({ name: 'list detail', params: { listId: item.id } })">
      <v-row>
        <v-col
          cols="auto"
          class="mr-auto"
          align-self="center"
        >
          {{ item.name }}
        </v-col>
        <v-col cols="auto">
          <v-btn color="accent" icon @click.stop="$router.push({ name: 'list detail', params: { listId: item.shareId } })">
            <v-icon>mdi-share</v-icon>
          </v-btn>
          <v-btn color="accent" icon @click.stop="$router.push({ name: 'list detail', params: { listId: item.id } })">
            <v-icon>mdi-open-in-new</v-icon>
          </v-btn>
          <v-btn color="primary" icon
                 @click.stop="item.starred = !item.starred; starList(item.id, item.starred)">
            <v-icon color="accent">mdi-{{ item.starred ? 'star' : 'star-outline' }}</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <v-btn
      class="mx-2"
      fab
      dark
      color="primary"
      fixed
      right
      bottom
      @click="dialog = true"
    >
      <v-icon dark>
        mdi-plus
      </v-icon>
    </v-btn>

    <v-dialog
      v-model="dialog"
      max-width="360"
      persistent
    >
      <v-card>
        <v-card-title class="text-h5">
          Create a new list.
        </v-card-title>
        <v-card-text>
          <v-text-field label="Name" autofocus placeholder="Cool shopping list" v-model="newList.name"></v-text-field>
          <v-checkbox label="Mark as starred?" v-model="newList.starred"></v-checkbox>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="grey"
            text
            @click="dialog = false"
          >
            Close
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="dialog = false; createList()"
          >
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import EventBus from '@/eventbus';
import feathersClient, { IList } from '@/feathers-client';

interface LList {
  name: string;
  starred: boolean;
  id: string;
  shareId: string;
}

@Component
export default class ListOverview extends Vue {
  protected lists: LList[] = [];
  private dialog = false;
  private newList: Record<string, string | boolean> = {
    name: '',
    starred: false,
  };

  async mounted (): Promise<void> {
    const lists: IList[] = await feathersClient.service('lists').find();
    console.log(lists);

    lists.forEach((list) => {
      this.lists.push({
        name: list.name,
        starred: list.starred,
        id: list.list_id,
        shareId: list.share_id,
      });
    });
  }

  async createList (): Promise<void> {
    if (!this.newList.name || !this.newList.starred) return;
    await feathersClient.service('lists').create({ name: this.newList.name, starred: this.newList.starred } as IList);
  }

  async starList (id: string, star: boolean): Promise<void> {
    const list = this.lists.find((item) => item.id === id);
    if (!list) return;

    await feathersClient.service('lists').update(id, { starred: star });

    this.snack(list.starred ? `Added '${list.name}' to starred lists.` : `Removed '${list.name}' from starred lists.`);
  }

  snack (message: string): void {
    EventBus.$emit('snackbar', { message });
  }
}
</script>
