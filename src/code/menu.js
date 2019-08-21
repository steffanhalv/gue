import { app, dialog, Menu } from 'electron'
import projectModel from '../models/project'

export default (store) => {
  let buildTemplate = () => {
    let projects = []
    store.projects.forEach(project => {
      projects.push({
        label: project.path,
        role: 'project',
        click() {
          let obj = project
          let idx = (store.projects.length - 1)
          for (let i = (store.projects.length - 1); i >= 0; i--) {
            if (store.projects[i].path === obj.path) {
              obj = Object.assign(store.projects[i], obj)
              idx = i
            }
          }
          if (idx <= 30) store.projects.splice(idx, 1)
          store.projects.unshift(Object.assign(projectModel, obj))
          store.current = store.projects[0]
          while (store.projects.length > 30) store.projects.pop()
        }
      })
    })
    return Menu.buildFromTemplate([
      {
        label: app.getName(),
        submenu: [
          {
            label: 'Open...',
            role: 'open' ,
            click() {
              dialog.showOpenDialog({
                properties: ['openDirectory']
              }).then(results => {
                if (results.filePaths.length && !results.canceled) {
                  let obj = { path: results.filePaths[0] }
                  let idx = (store.projects.length - 1)
                  for (let i = (store.projects.length - 1); i >= 0; i--) {
                    if (store.projects[i].path === obj.path) {
                      obj = Object.assign(store.projects[i], obj)
                      idx = i
                    }
                  }
                  if (idx <= 30) store.projects.splice(idx, 1)
                  store.projects.unshift(Object.assign(projectModel, obj))
                  store.current = store.projects[0]
                  while (store.projects.length > 30) store.projects.pop()
                }
              }).catch(() => {})
            }
          }
        ]
      },
      {
        label: 'Recent',
        submenu: projects
      }
    ])
  }
  Menu.setApplicationMenu(buildTemplate())
  store.$watch('projects', () => {
    Menu.setApplicationMenu(buildTemplate())
  })
}
