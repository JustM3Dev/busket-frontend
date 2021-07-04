<template>
  <div>
    <div v-if="lists.length > 0">
      <v-card v-for="(item, i) in lists" :key="i" class="mt-3 mx-16 pa-2" outlined ripple
              @click="$router.push({ name: 'list detail', params: { listId: item.id } })">
        <v-row>
          <v-col
            cols="auto"
            class="mr-auto"
            align-self="center"
          >
            {{ item.name }}
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  color="primary"
                  v-bind="attrs"
                  v-on="on"
                >
                  mdi-account-multiple
                </v-icon>
              </template>
              <span>{{ item.owner }}</span>
            </v-tooltip>
          </v-col>
          <v-col cols="auto">
            <v-btn color="accent" icon @click.stop="copyToClipboard(`https://busket.bux.at/me/list/${item.id}`)">
              <v-icon>mdi-share-variant</v-icon>
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
    </div>
    <div v-else class="grey--text text-center my-3">
      No data to display.
    </div>

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
    <input ref="copy" value="" style="display: none"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import EventBus from '@/eventbus';
import feathersClient, { IList } from '@/feathers-client';

interface LList {
  owner: string;
  name: string;
  starred: boolean;
  id: string;
}

@Component
export default class ListOverview extends Vue {
  protected lists: LList[] = [];
  private dialog = false;
  private newList: Record<string, string | boolean> = {
    name: '',
    starred: false,
  };
  private auth = feathersClient.get('auth');

  async mounted (): Promise<void> {
    await this.loadLists();
  }

  copyToClipboard (content: string): void {
    const inp = (this.$refs.copy as HTMLInputElement);
    inp.value = content;
    inp.select();
    inp.setSelectionRange(0, 999);
    document.execCommand('copy');
    EventBus.$emit('snack', { message: 'Copied link to clipboard!' });
  }

  async loadLists (): Promise<void> {
    const lists: IList[] = await feathersClient.service('lists').find();
    lists.forEach(async (list) => {
      this.lists.push({
        owner: await this.getOwnerName(list.owner),
        name: list.name,
        starred: list.starred,
        id: list.list_id,
      });
    });
  }

  async getOwnerName (uuid: string): Promise<string> {
    if (uuid === this.auth.user.uuid) return 'You';
    console.log(await feathersClient.service('user').get(uuid));
    console.log(uuid);
    return feathersClient.service('user').get(uuid).username;
  }

  async createList (): Promise<void> {
    if (!this.newList.name) return;
    console.log('dsasd', this.newList.starred);
    await feathersClient.service('lists').create({ name: this.newList.name, starred: this.newList.starred } as IList);

    await this.loadLists();
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
