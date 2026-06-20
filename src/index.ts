import joplin from 'api';
import { init } from './bibleQuote';

joplin.plugins.register({
  onStart: async function () {
    init();
  },
});
