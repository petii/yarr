import m from "mithril";

import Home from './view/homepage';
import Setup from './view/retrosetup';

m.route(document.body, '/', {
  '/': Setup,
  '/current': Home
})
