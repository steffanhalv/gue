export default [
  // Tools
  {
    id: 'tools',
    width: '',
    height: '',
    pos: {
      top: 0,
      right: 'calc(100% - 100px)',
      bottom: '#console',
      left: 0
    },
    hooks: {
      top: '',
      right: '#playground',
      bottom: '#console',
      left: ''
    }
  },
  // Playground
  {
    id: 'playground',
    width: '',
    height: '',
    pos: {
      top: 0,
      right: '#element',
      bottom: '#console',
      left: '#tools'
    },
    hooks: {
      top: '',
      right: ['#element', '#layers'],
      bottom: ['#console', '#assets', '#router'],
      left: '#tools'
    }
  },
  // Element
  {
    id: 'element',
    width: '',
    height: '300px',
    pos: {
      top: 0,
      right: '#elements',
      bottom: '#scripts',
      left: 'calc(100% - 600px)'
    },
    hooks: {
      top: '',
      right: '#elements',
      bottom: ['#layers', '#scripts'],
      left: '#playground'
    }
  },
  // Layers
  {
    id: 'layers',
    width: '',
    height: '',
    pos: {
      top: '#element',
      right: '#scripts',
      bottom: 0,
      left: '#playground'
    },
    hooks: {
      top: ['#elements', '#element'],
      right: '#scripts',
      bottom: '',
      left: ['#playground', '#console']
    }
  },
  // Elements
  {
    id: 'elements',
    width: '',
    height: '',
    pos: { top: 0, right: 0, bottom: '#scripts', left: 'calc(100% - 300px)' },
    hooks: { top: '', right: '', bottom: '#scripts', left: '#element' }
  },
  // Scripts
  {
    id: 'scripts',
    width: '',
    height: '',
    pos: {
      top: 'calc(100% - 500px)',
      right: 0,
      bottom: 0,
      left: 'calc(100% - 300px)'
    },
    hooks: {
      top: ['#elements', '#element'],
      right: '',
      bottom: '',
      left: '#layers'
    }
  },
  // console
  {
    id: 'console',
    width: '',
    height: '',
    pos: {
      top: 'calc(100% - 200px)',
      right: 'calc(100% - 600px)',
      bottom: 0,
      left: 0
    },
    hooks: {
      top: ['#tools', '#playground', '#playground', '#layers'],
      right: '#assets',
      bottom: '',
      left: ''
    }
  },
  // assets
  {
    id: 'assets',
    width: '',
    height: '',
    pos: {
      top: '#playground',
      right: 'calc(100% - 1000px)',
      bottom: 0,
      left: '#console'
    },
    hooks: {
      top: ['#tools', '#playground', '#playground', '#layers'],
      right: '#router',
      bottom: '',
      left: '#console'
    }
  },
  // router
  {
    id: 'router',
    width: '',
    height: '',
    pos: { top: '#playground', right: '#layers', bottom: 0, left: '#assets' },
    hooks: {
      top: ['#tools', '#playground', '#playground', '#layers'],
      right: ['#layers', '#element'],
      bottom: '',
      left: '#assets'
    }
  }
]
