import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#1976d2',
        accent: '#3e90f1',
      },
      dark: {
        primary: '#1b76de',
        accent: '#3190fc',
      },
    },
  },
});
