export default [
  // Tools
  {
    id: 'tools3',
    width: '',
    height: '',
    pos: {
      top: 0,
      right: 'calc(100% - 100px)',
      bottom: '#timeline3',
      left: 0
    },
    hooks: {
      top: '',
      right: '#playground3',
      bottom: '#timeline3',
      left: ''
    }
  },
  // Playground
  {
    id: 'playground3',
    width: '200px',
    height: '',
    pos: {
      top: 0,
      right: '#preview3',
      bottom: '#timeline3',
      left: '#tools3'
    },
    hooks: {
      top: '',
      right: '#preview3',
      bottom: '#timeline3',
      left: '#tools3'
    }
  },
  // Preview
  {
    id: 'preview3',
    width: '',
    height: '',
    pos: {
      top: 0,
      right: '300px',
      bottom: '#timeline3',
      left: '#playground3'
    },
    hooks: {
      top: '',
      right: ['#styles3', '#layers3'],
      bottom: '#timeline3',
      left: '#playground3'
    }
  },
  // Styles
  {
    id: 'styles3',
    width: '',
    height: '',
    pos: { top: 0, right: 0, bottom: '#layers3', left: '#preview3' },
    hooks: { top: '', right: '', bottom: '#layers3', left: '#preview3' }
  },
  // Layers
  {
    id: 'layers3',
    width: '',
    height: '',
    pos: {
      top: 'calc(100% - 400px)',
      right: 0,
      bottom: '#timeline3',
      left: '#preview3'
    },
    hooks: {
      top: '#styles3',
      right: '',
      bottom: '#timeline3',
      left: '#preview3'
    }
  },
  // Timeline
  {
    id: 'timeline3',
    width: '',
    height: '',
    pos: { top: 'calc(100% - 200px)', right: 0, bottom: 0, left: 0 },
    hooks: {
      top: ['#tools3', '#playground3', '#preview3', '#layers3'],
      right: '',
      bottom: '',
      left: ''
    }
  }
]
