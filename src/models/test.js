export default [
  // Tools
  {
    id: 'tools2',
    width: '',
    height: '',
    pos: {
      top: 0,
      right: 'calc(100% - 100px)',
      bottom: '#timeline2',
      left: 0
    },
    hooks: {
      top: '',
      right: '#playground2',
      bottom: '#timeline2',
      left: ''
    }
  },
  // Playground
  {
    id: 'playground2',
    width: '200px',
    height: '',
    pos: {
      top: 0,
      right: '#preview2',
      bottom: '#timeline2',
      left: '#tools2'
    },
    hooks: {
      top: '',
      right: '#preview2',
      bottom: '#timeline2',
      left: '#tools2'
    }
  },
  // Preview
  {
    id: 'preview2',
    width: '',
    height: '',
    pos: {
      top: 0,
      right: '300px',
      bottom: '#timeline2',
      left: '#playground2'
    },
    hooks: {
      top: '',
      right: ['#styles2', '#layers2'],
      bottom: '#timeline2',
      left: '#playground2'
    }
  },
  // Styles
  {
    id: 'styles2',
    width: '',
    height: '',
    pos: { top: 0, right: 0, bottom: '#layers2', left: '#preview2' },
    hooks: { top: '', right: '', bottom: '#layers2', left: '#preview2' }
  },
  // Layers
  {
    id: 'layers2',
    width: '',
    height: '',
    pos: {
      top: 'calc(100% - 400px)',
      right: 0,
      bottom: '#timeline2',
      left: '#preview2'
    },
    hooks: {
      top: '#styles2',
      right: '',
      bottom: '#timeline2',
      left: '#preview2'
    }
  },
  // Timeline
  {
    id: 'timeline2',
    width: '',
    height: '',
    pos: { top: 'calc(100% - 200px)', right: 0, bottom: 0, left: 0 },
    hooks: {
      top: ['#tools2', '#playground2', '#preview2', '#layers2'],
      right: '',
      bottom: '',
      left: ''
    }
  }
]
