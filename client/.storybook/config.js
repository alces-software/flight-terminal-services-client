import { configure } from '@kadira/storybook';

const req = require.context('../src/stories', true, /.js$/)
const reqModules = require.context('../src/modules/', true, /.story.js$/)

function loadStories() {
  if (req.keys().includes('./index.js')) {
    req('./index.js');
  }
  req.keys().forEach(req);
  reqModules.keys().forEach(reqModules)
}

configure(loadStories, module);
