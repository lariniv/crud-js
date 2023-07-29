// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()
// ================================================================

class Track {
  static #list = []

  constructor(author, name, image) {
    this.id = Math.floor(1000 + Math.random() * 9000)
    this.author = author
    this.name = name
    this.image = image
  }

  static create(author, name, image) {
    const newTrack = new Track(author, name, image)
    this.#list.push(newTrack)
    return newTrack
  }

  static getList() {
    return this.#list.reverse()
  }

  static getById(id) {
    return (
      Track.#list.find((track) => track.id === id) || null
    )
  }
}

Track.create(
  'Track 1',
  'Author 1',
  'https://picsum.photos/100/100',
)

Track.create(
  'Track 2',
  'Author 2',
  'https://picsum.photos/100/100',
)

Track.create(
  'Track 3',
  'Author 3',
  'https://picsum.photos/100/100',
)

Track.create(
  'Track 4',
  'Author 4',
  'https://picsum.photos/100/100',
)

Track.create(
  'Track 5',
  'Author 5',
  'https://picsum.photos/100/100',
)

Track.create(
  'Track 6',
  'Author 6',
  'https://picsum.photos/100/100',
)

Track.create(
  'Track 7',
  'Author 7',
  'https://picsum.photos/100/100',
)

class Playlist {
  static #list = []

  constructor(name) {
    this.id = Math.floor(1000 + Math.random() * 9000)
    this.name = name
    this.tracks = []
    this.image = 'https://picsum.photos/100/100'
  }

  static create(name) {
    const newPlaylist = new Playlist(name)
    this.#list.push(newPlaylist)
    return newPlaylist
  }

  static getList() {
    return this.#list.reverse()
  }

  static makeMix(playlist) {
    const allTrakcs = Track.getList()

    let randomTracks = allTrakcs
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)

    playlist.tracks.push(...randomTracks)
  }

  static getById(id) {
    return (
      Playlist.#list.find(
        (playlist) => playlist.id === id,
      ) || null
    )
  }

  static findListByName(name) {
    return this.#list.filter((playlist) =>
      playlist.name
        .toLowerCase()
        .includes(name.toLowerCase()),
    )
  }

  deleteTrackById(trackid) {
    this.tracks = this.tracks.filter(
      (track) => track.id !== trackid,
    )
  }

  addTrackById(trackId) {
    const track = Track.getById(trackId)
    this.tracks.push(track)
  }
}

Playlist.makeMix(Playlist.create('test1'))
Playlist.makeMix(Playlist.create('test2'))
Playlist.makeMix(Playlist.create('test3'))

// ================================================================

router.get('/', function (req, res) {
  const playlists = Playlist.getList()
  console.log(playlists)

  res.render('spotify-index', {
    style: 'spotify-index',

    data: {
      list: playlists,
    },
  })
})

// ================================================================

router.get('/spotify-choose', function (req, res) {
  res.render('spotify-choose', {
    style: 'spotify-choose',

    data: {},
  })
})

// ================================================================

router.get('/spotify-create', function (req, res) {
  const isMix = !!req.query.isMix

  res.render('spotify-create', {
    style: 'spotify-create',

    data: {
      isMix,
    },
  })
})

// ================================================================

router.post('/spotify-create', function (req, res) {
  const isMix = !!req.query.isMix

  const name = req.body.name

  if (!name) {
    return res.render('alert', {
      style: 'alert',

      data: {
        title: 'Error',
        text: 'Please enter playlsit name',
        link: isMix
          ? '/spotify-create?isMix=true'
          : '/spotify-creat',
      },
    })
  }

  const playlist = Playlist.create(name)

  if (isMix) {
    Playlist.makeMix(playlist)
  }

  console.log(playlist)

  res.render('spotify-playlist', {
    style: 'spotify-playlist',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})

// ================================================================

router.get('/spotify-playlist', function (req, res) {
  const id = Number(req.query.id)

  const playlist = Playlist.getById(id)

  if (!playlist) {
    return res.render('alert', {
      style: 'alert',

      data: {
        title: 'Error',
        text: "There's no such playlist",
        link: '/',
      },
    })
  }

  console.log(playlist.tracks)

  res.render('spotify-playlist', {
    style: 'spotify-playlist',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})

// ================================================================

router.get('/spotify-track-delete', function (req, res) {
  const playlistid = Number(req.query.playlistId)
  const trackId = Number(req.query.trackId)

  const playlist = Playlist.getById(playlistid)

  if (!playlist) {
    return res.render('alert', {
      style: 'alert',

      data: {
        title: 'Error',
        text: "There's no such playlist",
        link: `/spotify-playlist?id=${playlistid}`,
      },
    })
  }

  playlist.deleteTrackById(trackId)

  console.log(playlist.tracks)

  res.render('spotify-playlist', {
    style: 'spotify-playlist',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})

// ================================================================

router.get('/spotify-playlist-add', function (req, res) {
  const playlistid = Number(req.query.playlistId)
  const trackId = Number(req.query.trackId)

  const playlist = Playlist.getById(playlistid)

  if (!playlist) {
    return res.render('alert', {
      style: 'alert',

      data: {
        title: 'Error',
        text: "There's no such playlist",
        link: `/spotify-playlist?id=${playlistid}`,
      },
    })
  }

  playlist.deleteTrackById(trackId)

  console.log(playlist.tracks)

  res.render('spotify-playlist-add', {
    style: 'spotify-playlist-add',

    data: {
      playlistId: playlist.id,
      tracks: Track.getList(),
      name: playlist.name,
    },
  })
})

// ================================================================

router.get('/spotify-search', function (req, res) {
  const value = ''

  const list = Playlist.findListByName(value)

  res.render('spotify-search', {
    style: 'spotify-search',

    data: {
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
      value,
    },
  })
})

// ================================================================

router.post('/spotify-search', function (req, res) {
  const value = req.body.value || ''

  const list = Playlist.findListByName(value)

  res.render('spotify-search', {
    style: 'spotify-search',

    data: {
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
      value,
    },
  })
})

// ================================================================

router.get('/spotify-track-add', function (req, res) {
  const playlistId = Number(req.query.playlistId)
  const trackId = Number(req.query.trackId)

  const playlist = Playlist.getById(playlistId)

  console.log(playlist)

  playlist.addTrackById(trackId)

  console.log(playlist)

  res.render('spotify-playlist', {
    style: 'spotify-playlist',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})

// Підключаємо роутер до бек-енду
module.exports = router
