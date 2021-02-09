import m from "mithril";

import Nav from "./navigation";

const Home: m.Component = {
  view: () => m('.page',
    m(Nav),
    m('.content',
      m('button', 'New Retro')
    )
  ),
  oncreate: () => {
    console.log('oncreate')
    m.request({
      method: 'GET',
      url: "/api/retro"
    }).then( (result) => console.log(result) )
  }
}

export default Home;