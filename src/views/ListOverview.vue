<template>
  <div>
    <div v-if="lists.length > 0">
      <v-card v-for="(item, i) in lists" :key="i" class="mt-3 pa-2" :class="mx" outlined ripple
              @click="$router.push({ name: 'list detail', params: { listId: item.id } })">
        <v-row>
          <v-col
            cols="auto"
            class="mr-auto d-flex"
            align-self="center"
          >
            {{ item.name }}
            <div class="d-flex" v-if="item.owner !== ''">
              <v-icon color="primary" class="ml-1">
                mdi-account-multiple
              </v-icon>
              <div class="grey--text">({{ item.owner }})</div>
            </div>
          </v-col>
          <v-col cols="auto">
            <v-btn color="accent" icon @click.stop="removeDialog.show = true; removeDialog.id = item.id">
              <v-icon>mdi-trash-can-outline</v-icon>
            </v-btn>
            <v-btn color="accent" icon @click.stop="copyToClipboard(`https://busket.bux.at/me/list/${item.id}`)">
              <v-icon>mdi-share-variant</v-icon>
            </v-btn>
            <v-btn color="primary" icon
                   @click.stop="item.pinned = !item.pinned; pinList(item.id, item.pinned)">
              <v-icon color="accent">mdi-{{ item.pinned ? 'pin' : 'pin-outline' }}</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </div>
    <div v-else class="grey--text text-center my-3">
      {{ $t('No data to display') }}.
    </div>

    <v-dialog
      v-model="removeDialog.show"
      max-width="290"
    >
      <v-card>
        <v-card-title class="text-h5">
          {{ $t('list.Are you sure') }}?
        </v-card-title>
        <v-card-text>
          {{ $t('list.Do you want to delete the list') }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="removeDialog.show = false"
          >
            {{ $t('Cancel') }}
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="removeDialog.show = false; removeItem(removeDialog.id)"
          >
            {{ $t('Delete') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
          {{ $t('list.Create new list') }}.
        </v-card-title>
        <v-card-text>
          <v-text-field label="Name" autofocus :placeholder="$t('list.New list placeholder')" v-model="newList.name"
                        @keypress.enter="dialog = false; createList();"></v-text-field>
          <v-checkbox :label="$t('list.Pin?')" v-model="newList.starred"></v-checkbox>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="grey"
            text
            @click="dialog = false"
          >
            {{ $t('Close') }}
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="dialog = false; createList()"
          >
            {{ $t('Create') }}
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
import { isMobileOnly } from 'mobile-device-detect';

interface LList {
  owner: string;
  name: string;
  pinned: boolean;
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
  private removeDialog = {
    show: false,
    id: '',
  };
  private mx = 'mx-16';

  async mounted (): Promise<void> {
    window.addEventListener('resize', this.resizeEvent);
    this.resizeEvent();
    await this.loadLists();
  }

  resizeEvent (): void {
    if (window.innerWidth > 1024) {
      this.mx = isMobileOnly ? 'mx-2' : 'mx-16';
      return;
    }
    this.mx = 'mx-2';
  }

  async removeItem (id: string): Promise<void> {
    feathersClient.service('lists').remove(id);
    await this.loadLists();
  }

  copyToClipboard (content: string): void {
    if (window.clipboardData && window.clipboardData.setData) {
      // For IE
      // eslint-disable-next-line no-undef
      clipboardData.setData('Text', text);
    } else if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
      const t = document.createElement('textarea');
      t.textContent = content;
      // For Edge
      t.style.position = 'fixed';
      document.body.appendChild(t);
      t.select();
      try {
        EventBus.$emit('snackbar', { message: this.$t('special.Copied link') });
        document.execCommand('copy');
      } catch (ex) {
        console.warn('Copy to clipboard failed.', ex);
      } finally {
        document.body.removeChild(t);
      }
    }
  }

  async loadLists (): Promise<void> {
    this.lists = [];

    const lists: IList[] = await feathersClient.service('lists').find();
    await lists.map(async (list) => {
      this.lists.push({
        owner: await this.getOwnerName(list.owner),
        name: list.name,
        pinned: list.pinned,
        id: list.list_id,
      });
    });
  }

  async getOwnerName (uuid: string): Promise<string> {
    if (uuid === this.auth.user.uuid) return '';
    return feathersClient.service('user').get(uuid);
  }

  async createList (): Promise<void> {
    if (!this.newList.name) return;
    await feathersClient.service('lists').create({
      name: this.newList.name,
      pinned: this.newList.pinned || false,
    } as IList);
    await this.loadLists();
  }

  async pinList (id: string, pin: boolean): Promise<void> {
    const list = this.lists.find((item) => item.id === id);
    if (!list) return;

    await feathersClient.service('lists').update(id, { pinned: pin });

    this.snack(list.pinned ? this.$t('list.Added name to pinned', { name: list.name }) : this.$t('list.Removed name from pinned', { name: list.name }));
  }

  snack (message: string): void {
    EventBus.$emit('snackbar', { message });
  }
}
</script>
