export default [
  // Tools
  {
    id: 'tools',
    width: '',
    height: '',
    pos: {
      top: 0,
      right: 'calc(100% - 100px)',
      bottom: '#timeline',
      left: 0
    },
    hooks: {
      top: '',
      right: '#playground',
      bottom: '#timeline',
      left: ''
    }
  },
  // Playground
  {
    id: 'playground',
    width: '300px',
    height: '',
    pos: {
      top: 0,
      right: '#preview',
      bottom: '#timeline',
      left: '#tools'
    },
    hooks: {
      top: '',
      right: '#preview',
      bottom: '#timeline',
      left: '#tools'
    }
  },
  // Preview
  {
    id: 'preview',
    width: '',
    height: '',
    pos: {
      top: 0,
      right: '300px',
      bottom: '#timeline',
      left: '#playground'
    },
    hooks: {
      top: '',
      right: ['#styles', '#layers'],
      bottom: '#timeline',
      left: '#playground'
    }
  },
  // Styles
  {
    id: 'styles',
    width: '',
    height: '',
    pos: { top: 0, right: 0, bottom: '#layers', left: '#preview' },
    hooks: { top: '', right: '', bottom: '#layers', left: '#preview' }
  },
  // Layers
  {
    id: 'layers',
    width: '',
    height: '',
    pos: {
      top: 'calc(100% - 400px)',
      right: 0,
      bottom: '#timeline',
      left: '#preview'
    },
    hooks: {
      top: '#styles',
      right: '',
      bottom: '#timeline',
      left: '#preview'
    }
  },
  // Timeline
  {
    id: 'timeline',
    width: '',
    height: '',
    pos: { top: 'calc(100% - 200px)', right: 0, bottom: 0, left: 0 },
    hooks: {
      top: ['#tools', '#playground', '#preview', '#layers'],
      right: '',
      bottom: '',
      left: ''
    }
  }
]
