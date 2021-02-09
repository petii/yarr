import m from "mithril";

import Nav from './navigation';

const Home: m.Component = {
  view: () => m('.page', m(Nav),
    m('','content')
  )
}

export default Home;