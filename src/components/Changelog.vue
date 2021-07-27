<template>
  <div class="ma-2">
    <h1>Welcome to Busket {{ version }}!</h1>
    <h4>What changed? (Major changed will be first)</h4>
    <v-list subheader v-for="(list, i) in changes" :key="i">
      <v-list-item v-for="(change, idx) in list.list" :key="idx" :two-line="change.s !== ''">
        <v-icon>mdi-circle-medium</v-icon>
        <v-list-item-content>
          <v-list-item-title>{{ change.h }}</v-list-item-title>
          <v-list-item-subtitle v-show="change.s.length > 0">{{ change.s }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <div v-if="isDev">
      <h1 class="mt-5">Changelog generator</h1>
      <v-row no-gutters>
        <v-col>
          <v-list subheader v-for="(list, i) in generatorOut" :key="i" dense>
            <v-list-item v-for="(change, idx) in list.list" :key="idx">
              <v-icon>mdi-circle-medium</v-icon>
              <v-list-item-content>
                <v-list-item-title>
                  <v-text-field label="Header" dense class="json-textfield-max-width" v-model="change.h"
                                @change="showOutput"></v-text-field>
                </v-list-item-title>
                <v-list-item-subtitle>
                  <v-text-field label="Subheader" dense class="json-textfield-max-width" v-model="change.s"
                                @keydown.tab="nextChange(i)" @change="showOutput"></v-text-field>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
        <v-col>
          <v-list subheader v-for="(list, i) in generatorOut" :key="i">
            <v-list-item v-for="(change, idx) in list.list" :key="idx" class="mb" :class="idx === 0 ? 'mt-9' : ''" :two-line="change.s !== ''">
              <v-icon>mdi-circle-medium</v-icon>
              <v-list-item-content>
                <v-list-item-title>{{ change.h }}</v-list-item-title>
                <v-list-item-subtitle v-show="change.s.length > 0">{{ change.s }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
      <div class="mt-12">
        <div class="changelog-base-font ml-2">Inspired by Webstorm IDE</div>
        <pre ref="ta" class="json-syntax-pre"></pre>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import config from '../../config';

@Component
export default class Changelog extends Vue {
  private version = config.version;
  private changes = [
    {
      title: 'changes',
      list: [
        {
          h: 'Temporarily disabled shared lists due to major bugs',
          s: 'We will revisit and fix those later',
        },
        {
          h: 'Added new Busket logo',
          s: 'You can see the new logo now in various places!',
        },
        {
          h: 'Fixed 404 when going to valid links',
          s: '',
        },
        {
          h: 'Fixed bug where you were unable to interact with items on mobile',
          s: '',
        },
        {
          h: 'Fixed bug where deleting lists marked as "done" resulted in other ones being deleted',
          s: '',
        },
        {
          h: 'Added Changelog',
          s: 'This thing',
        },
        {
          h: 'Added install prompt when using Chrome',
          s: 'Mobile/Desktop: Only works on Chrome; Only works if PWA isn\'t installed',
        },
        {
          h: 'Fixed connectivity issues',
          s: '',
        },
        {
          h: 'Fixed some other minor bugs',
          s: '',
        },
        {
          h: 'Fixed UX/UI bugs',
          s: '',
        },
      ],
    },
  ];
  private generatorOut = [
    {
      title: 'changes',
      list: [{
        h: '',
        s: '',
      }],
    },
  ];
  private isDev = config.isBeta;

  mounted (): void {
    this.showOutput();
  }

  showOutput (): void {
    (this.$refs.ta as HTMLTextAreaElement).innerHTML = this.syntaxHighlight(JSON.stringify(this.generatorOut, null, 2));
  }

  syntaxHighlight (inp: string): string {
    const json = inp.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g, (match) => {
      let style = 'color: #8bc278 !important';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          style = 'color: #e06c75 !important;';
        }
      }
      return `<span class="json-syntax-highlight-appear" style="${style} ">${match}</span>`;
    });
  }

  nextChange (section: number): void {
    this.generatorOut[section].list.push({
      h: '',
      s: '',
    });
    this.showOutput();
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono&display=swap');

.json-textfield-max-width {
  max-width: 800px;
}

.mb {
  margin-bottom: 3.61rem;
}

.json-syntax-pre {
  padding: 5px;
  margin: 5px;
  border: 1px solid #1d1e24;
  border-radius: 10px;
  background: #282c34;
  font-family: 'JetBrains Mono', monospace;
  color: white;
}

.changelog-base-font {
  font-family: 'JetBrains Mono', monospace;
  color: #435063;
}

.json-syntax-highlight-appear {
  background: rgba(255, 255, 0, 0);
  transition: color;
  animation-name: appearAnimation;
  animation-duration: 0.3s;
}

@keyframes appearAnimation {
  from {
    background: rgba(255, 255, 0, 0.9);
  }
  to {
    background: rgba(255, 255, 0, 0);
  }
}
</style>
