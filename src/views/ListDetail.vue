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
          {{ $t('list.Add to lib') }}
        </v-col>
        <v-col cols="auto">
          <v-btn color="primary" outlined x-small @click="createRelation(); notInLibrary = false;">{{
              $t('list.Add it')
            }}
          </v-btn>
        </v-col>
      </v-row>
      <v-spacer></v-spacer>
    </v-alert>

    <v-btn outlined block color="primary" @click="loadItems()" class="mt-3">
      <v-icon>mdi-reload</v-icon>
      {{ $t('list.Refresh') }}
    </v-btn>

    <v-text-field outlined label="Add" persistent-placeholder :placeholder="$t('list.Ham')" dense class="mt-3"
                  append-icon="mdi-plus" @click:append="createItem" v-model="newItem.name"
                  @keypress.enter="createItem"></v-text-field>

    <div v-if="items && items.length > 0">
      <div v-for="(filter, i) in [ true, false ]" :key="i">
        <div class="grey--text" :class="filter ? '' : 'mt-6'" :draggable="false">{{
            filter ? $t('list.To do') : $t('list.Done')
          }}
        </div>
        <v-divider class="mb-2"></v-divider>
        <draggable v-model="items" ghost-class="ghost" @end="updateItems">
          <transition-group>
            <v-card v-for="(item, i) in items.filter(t => t.checked === !filter)" :key="i" flat outlined
                    class="px-2 mb-2">
              <v-row>
                <v-col
                  cols="auto"
                  class="mr-auto"
                  align-self="center"
                >
                  <div class="d-flex justify-start">
                    {{ item.name }} ({{ item.checked }})
                    <!--                  <SneakInput v-model="item.name" style="width: 60%" @keypress.enter="item.cachedName = item.name; updateItems();" />-->
                    <div style="width: 60px">
                      <v-btn outlined small color="primary" @click="item.cachedName = item.name; updateItems();"
                             :hidden="item.name === item.cachedName">
                        {{ $t('list.Save') }}
                      </v-btn>
                    </div>
                  </div>
                </v-col>
                <v-col cols="auto" align-self="center">
                  <v-layout row wrap align-center>
                    <v-btn color="red lighten-1" class="ma-auto" icon @click="trashClick($event, i)">
                      <v-icon>mdi-trash-can-outline</v-icon>
                    </v-btn>
                    <v-checkbox class="px-1 pt-1" @click="checkItem(item.id)"
                                :input-value="item.checked"></v-checkbox>
                  </v-layout>
                </v-col>
              </v-row>
            </v-card>
          </transition-group>
        </draggable>
      </div>
    </div>
    <div v-else class="grey--text text-center my-3">
      {{ $t('No data to display') }}
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
          {{ $t('list.Item delete notice') }}
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
            @click="removeDialog.show = false; removeItem(removeDialog.index)"
          >
            {{ $t('Delete') }}
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
    pinned: false,
    list_id: '',
    items: {},
    created_at: new Date(),
    updated_at: new Date(),
  };
  private items: ListItem[] = [];
  private newItem = {
    name: '',
    checked: false,
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

  async checkItem (id: string): Promise<void> {
    const item = this.items.filter((t) => t.id === id)[0];
    item.checked = !item.checked;
    await this.updateItems();
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

  trashClick (e: { shiftKey: boolean }, i: number): void {
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
        checked: item.checked,
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
      checked: false,
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
        checked: item.checked,
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
/*noinspection ALL*/
.ghost {
  width: 100%;
  height: 46px;
  background: rgba(24, 131, 234, 0.2);
  opacity: 80%;
  border: rgba(24, 131, 234, 1) dashed 2px;
}
</style>
