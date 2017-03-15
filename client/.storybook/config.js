import { configure } from '@kadira/storybook';

const req = require.context('../src/stories', true, /.js$/)

function loadStories() {
  if (req.keys().includes('./index.js')) {
    req('./index.js');
  }
  req.keys().forEach((filename) => req(filename))
}

configure(loadStories, module);
