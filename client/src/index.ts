import m from "mithril";

import Home from './view/homepage';

m.route(document.body, '/', {
  '/': Home
}
)