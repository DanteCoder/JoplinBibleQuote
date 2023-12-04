import joplin from 'api';
import { bibleQuote } from './bibleQuote';

joplin.plugins.register({
  onStart: async function () {
    bibleQuote.init();
  },
});
