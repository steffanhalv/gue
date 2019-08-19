import { app, dialog, Menu } from 'electron'

export default (store) => {
  let buildTemplate = () => {
    let projects = []
    store.projects.forEach(project => {
      projects.push({
        label: project.path,
        role: 'project',
        click() {
          console.log(project.path)
        }
      })
    })
    return Menu.buildFromTemplate([
      {
        label: app.getName(),
        submenu: [
          {
            label: 'New project',
            role: 'new',
            click() {
              dialog.showOpenDialog({
                properties: ['openDirectory']
              }).then(results => {
                if (results.filePaths.length && !results.canceled) {
                  store.projects.push({
                    path: results.filePaths[0]
                  })
                }
              }).catch(() => {})
            }
          },
          {
            label: 'Open...',
            role: 'open' ,
            click() {
              dialog.showOpenDialog({
                properties: ['openDirectory']
              }).then(results => {
                if (results.filePaths.length && !results.canceled) {
                  store.projects.push({
                    path: results.filePaths[0]
                  })
                }
              }).catch(() => {})
            }
          }
        ]
      },
      {
        label: 'Projects',
        submenu: projects
      }
    ])
  }
  Menu.setApplicationMenu(buildTemplate())
  store.$watch('projects', () => {
    Menu.setApplicationMenu(buildTemplate())
  })
}
