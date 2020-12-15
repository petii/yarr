import m from "mithril";

const Home: m.Component = {
  view: () => m('.page',
    m('nav', 'navigation'),
    m('.content', 'content')
  )
}

export default Home;