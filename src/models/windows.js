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
      right: '300px',
      bottom: '#console',
      left: '#tools'
    },
    hooks: {
      top: '',
      right: ['#styles', '#layers'],
      bottom: ['#console', '#assets', '#router'],
      left: '#tools'
    }
  },
  // Styles
  {
    id: 'styles',
    width: '',
    height: '',
    pos: { top: 0, right: 0, bottom: '#layers', left: '#playground' },
    hooks: { top: '', right: '', bottom: '#layers', left: '#playground' }
  },
  // Layers
  {
    id: 'layers',
    width: '',
    height: '',
    pos: {
      top: 'calc(100% - 500px)',
      right: 0,
      bottom: 0,
      left: '#playground'
    },
    hooks: {
      top: 'calc(100% - 300px)',
      right: '',
      bottom: '',
      left: ['#playground', '#console']
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
      right: ['#layers', '#styles'],
      bottom: '',
      left: '#assets'
    }
  }
]
