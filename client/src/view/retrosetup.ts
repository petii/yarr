import m from "mithril";

const Setup: m.Component = {
  view: () => m('.page',
    m('h1', 'Set up a Retrospective Meeting'),
    m('', 'TODO: fields'),
    m('button',{ onclick: ()=> m.route.set('/current') } ,'Start Meeting')
  ),
  oncreate: () => m.request({ url: '/api/retro/started'}).then(
      (started) => {
        if (started)
          m.route.set('/current')
      }
  )
}

export default Setup;