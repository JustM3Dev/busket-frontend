<template>
  <div class="px-4">
    <div v-if="items && items.length > 0" class="mt-3">
      <draggable v-model="items" ghost-class="ghost" @end="moveItem">
        <transition-group>
          <v-card v-for="(item, i) in items" :key="i" flat outlined class="px-2 mb-2">
            <v-row>
              <v-col
                cols="auto"
                class="mr-auto"
                align-self="center"
              >
                {{ item.name }}
              </v-col>
              <v-col cols="auto">
                <v-btn color="red lighten-1" icon @click="removeItem(i)">
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
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import feathersClient, { IList, Item as ListItem } from '@/feathers-client';
import draggable, { DraggedContext } from 'vuedraggable';
import * as vuedraggable from 'vuedraggable';
import { v4 as uuidv4 } from 'uuid';

@Component({
  components: {
    draggable,
  },
})
export default class ListDetail extends Vue {
  @Prop() private listId: string | undefined;
  private list: IList = {
    name: '',
    starred: false,
    share_id: '',
    list_id: '',
    order: 0,
    items: {},
    created_at: new Date(),
    updated_at: new Date(),
  };
  private items: ListItem[] = [];
  private dialog = false;
  private newItem = {
    name: '',
  };

  async mounted (): Promise<void> {
    await this.loadItems();
  }

  async loadItems (): Promise<void> {
    this.list = await feathersClient.service('lists').get(this.listId);

    if (!this.list.items) (this.list.items as unknown as Record<string, unknown>) = { data: [] };
    this.items = this.list.items.data as unknown as ListItem[];
  }

  async createItem (): Promise<void> {
    await feathersClient.service('listitem').create({
      list_id: this.listId,
      name: this.newItem.name.trim(),
    });

    if (!this.items) this.items = [];
    this.items.push({
      name: this.newItem.name.trim(),
      id: uuidv4(),
    });

    this.newItem.name = '';
  }

  async moveItem (e: Record<string, unknown>): Promise<void> {
    console.log(this.items);
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
