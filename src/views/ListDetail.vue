<template>
  <div class="px-4">
    <v-alert
      dense
      dismissible
      text
      icon="mdi-information-outline"
      type="info"
      class="mt-4"
      transition="slide-y-transition"
      v-model="notInLibrary"
    >
      <v-row>
        <v-col class="mr-auto" cols="auto" align-self="center">
          Add list to library?
        </v-col>
        <v-col cols="auto">
          <v-btn color="primary" outlined x-small @click="createRelation(); notInLibrary = false;">Add it</v-btn>
        </v-col>
      </v-row>
      <v-spacer></v-spacer>
    </v-alert>

    <v-text-field outlined label="Add" persistent-placeholder placeholder="Test" dense class="mt-3 mx-1"
                  append-icon="mdi-plus" @click:append="createItem" v-model="newItem.name"></v-text-field>

    <div v-if="items && items.length > 0" class="mt-3">
      <draggable v-model="items" ghost-class="ghost" @end="updateItems">
        <transition-group>
          <v-card v-for="(item, i) in items" :key="i" flat outlined class="px-2 mb-2">
            <v-row>
              <v-col
                cols="auto"
                class="mr-auto"
                align-self="center"
              >
                <div class="d-flex justify-start">
                  <SneakInput v-model="item.name" style="width: 60%"/>
                  <div style="width: 60px">
                    <v-btn outlined small color="primary" @click="item.name = item.cachedName; updateItems"
                           :hidden="item.name === item.cachedName">
                      Save
                    </v-btn>
                  </div>
                </div>
              </v-col>
              <v-col cols="auto">
                <v-btn color="red lighten-1" icon @click="trashClick($event, i)">
                  <v-icon>mdi-trash-can-outline</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
        </transition-group>
      </draggable>
    </div>
    <div v-else class="grey--text text-center my-3">
      No data to display.
    </div>

    <v-btn outlined block color="primary" @click="loadItems()">
      <v-icon>mdi-reload</v-icon>
      Reload
    </v-btn>

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
      <v-icon>
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
          Create a new item.
        </v-card-title>
        <v-card-text>
          <v-text-field label="Name" autofocus placeholder="Ham" v-model="newItem.name"
                        @keypress.enter="dialog = false; createItem()"></v-text-field>
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
            @click="dialog = false; createItem()"
            :disabled="newItem.name.trim().length <= 0"
          >
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="removeDialog.show"
      max-width="290"
    >
      <v-card>
        <v-card-title class="text-h5">
          Are you sure?
        </v-card-title>
        <v-card-text>Do you really want to permanently delete this item of your list? You cannot undo this! Tip: Hold
          shift while clicking the trash can to skip the modal.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="removeDialog.show = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="removeDialog.show = false; removeItem(removeDialog.index)"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import feathersClient, { IList, Item as ListItem } from '@/feathers-client';
import draggable from 'vuedraggable';
import { v4 as uuidv4 } from 'uuid';
import SneakInput from '@/components/SneakInput.vue';

@Component({
  components: {
    SneakInput,
    draggable,
  },
})
export default class ListDetail extends Vue {
  @Prop() private listId: string | undefined;
  private list: IList = {
    owner: '',
    name: '',
    starred: false,
    list_id: '',
    items: {},
    created_at: new Date(),
    updated_at: new Date(),
  };
  private items: ListItem[] = [];
  private dialog = false;
  private newItem = {
    name: '',
  };
  private notInLibrary = false;
  private removeDialog = {
    show: false,
    index: -1,
  };

  async mounted (): Promise<void> {
    await this.loadItems();
    this.notInLibrary = !await this.isInLibrary();
  }

  async isInLibrary (): Promise<boolean> {
    const rel = await feathersClient.service('relations').get({});
    console.log(rel);
    let inLib = false;
    Object.keys(rel).forEach((item) => {
      if (rel[item].list_id === this.listId) inLib = true;
    });
    return inLib;
  }

  trashClick (e: any, i: number): void {
    console.log(e.shiftKey);
    if (e.shiftKey) {
      this.removeItem(i);
      return;
    }
    this.removeDialog.show = true;
    this.removeDialog.index = i;
  }

  async createRelation (): Promise<void> {
    feathersClient.service('relations').create({ list_id: this.listId });
  }

  async loadItems (): Promise<void> {
    this.items = [];

    this.list = await feathersClient.service('lists').get(this.listId);

    if (!this.list.items) (this.list.items as unknown as Record<string, unknown>) = { data: [] };
    (this.list.items.data as unknown as ListItem[]).forEach((item) => {
      this.items.push({
        cachedName: item.name,
        name: item.name,
        id: item.id,
      });
    });
  }

  async createItem (): Promise<void> {
    await feathersClient.service('listitem').create({
      list_id: this.listId,
      name: this.newItem.name.trim(),
    });

    if (!this.items) this.items = [];
    this.items.push({
      cachedName: this.newItem.name.trim(),
      name: this.newItem.name.trim(),
      id: uuidv4(),
    });

    this.newItem.name = '';
  }

  async updateItems (): Promise<void> {
    const items = [];
    this.items.forEach((item) => {
      items.push({
        name: item.name,
        id: item.id,
      });
    });
    await feathersClient.service('lists').update(this.listId, { items: { data: this.items } });
  }

  async removeItem (index: number): Promise<void> {
    this.items.splice(index, 1);
    await feathersClient.service('listitem').remove({ index, list_id: this.listId });
  }
}
</script>

<style scoped>
.ghost {
  width: 100%;
  height: 38px;
  background: rgba(24, 131, 234, 0.2);
  opacity: 80%;
  border: rgba(24, 131, 234, 1) dashed 2px;
}
</style>
