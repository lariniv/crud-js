// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

class User {
  static #list = []

  constructor(email, login, password) {
    this.email = email
    this.login = login
    this.password = password
    this.id = new Date().getTime()
  }

  verifyPassword = (password) => this.password === password

  static add = (user) => this.#list.push(user)

  static getList = () => this.#list

  static getById = (id) =>
    this.#list.find((user) => user.id === id)

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (user) => user.id === id,
    )

    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }

  static updateById = (id, data) => {
    const user = this.getById(id)

    if (user) {
      this.update(user, data)

      return true
    } else return false
  }

  static update = (user, { email }) => {
    if (email) {
      user.email = email
    }
  }
}

class Product {
  static #list = []

  constructor(name, price, description) {
    this.id = Math.trunc(Math.random() * 89999) + 10000
    this.createDate = new Date().toISOString()
    this.name = name
    this.price = price
    this.description = description
  }

  static getList = () => {
    return this.#list
  }

  static add = (product) => {
    this.#list.push(product)
  }

  static getById = (id) => {
    return this.#list.find((user) => user.id === Number(id))
  }

  static updateById = (id, data) => {
    const user = this.getById(id)
    const { price, name, description } = data

    if (user) {
      if (price) {
        user.price = price
      }
      if (name) {
        user.name = name
      }
      if (description) {
        user.description = description
      }
      return true
    } else return false
  }

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (user) => user.id === Number(id),
    )

    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else return false
  }
}

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку
  const list = User.getList()
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('user-index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'user-index',

    data: {
      users: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

router.post('/user-create', function (req, res) {
  const { email, login, password } = req.body

  const user = new User(email, login, password)

  User.add(user)

  console.log(User.getList())

  res.render('user-alert', {
    style: 'user-alert',
    info: 'User succesfully created',
  })
})

// ================================================================

router.get('/user-delete', function (req, res) {
  const { id } = req.query

  User.deleteById(Number(id))

  res.render('user-alert', {
    style: 'user-alert',
    info: 'User succesfully deleted',
  })
})

// ================================================================

router.post('/user-update', function (req, res) {
  const { email, password, id } = req.body

  let result = false

  const user = User.getById(Number(id))

  if (user.verifyPassword(String(password))) {
    User.update(user, { email })
    result = true
  }

  res.render('user-alert', {
    style: 'user-alert',
    info: result
      ? 'Email succesfully updated'
      : 'Failed to update your email',
  })
})

// ================================================================

router.get('/product-create', function (req, res) {
  res.render('user-product-create', {
    style: 'user-product-create',
  })
})

// ================================================================

router.post('/product-create', function (req, res) {
  let { name, price, description } = req.body

  const product = new Product(name, price, description)

  Product.add(product)

  res.render('user-product-alert', {
    style: 'user-product-alert',
    info: 'Action completed',
    description: 'Product was successfully created',
  })
})

// ================================================================

router.get('/product-list', function (req, res) {
  const list = Product.getList()
  res.render('user-product-list', {
    style: 'user-product-list',

    data: {
      products: {
        list,
      },
    },
  })
})

// ================================================================

router.get('/product-edit', function (req, res) {
  const { id } = req.query
  let product = Product.getById(id)
  console.log(product.name, product, id)
  res.render('user-product-edit', {
    style: 'user-product-edit',
    data: {
      name: product.name,
      price: product.price,
      description: product.description,
      id,
    },
  })
})

// ================================================================

router.post('/product-edit', function (req, res) {
  const data = req.body
  const { id } = req.body

  const result = Product.updateById(id, data)

  res.render('user-product-alert', {
    style: 'user-product-alert',
    info: 'Action completed',
    description: result
      ? 'Operation succesfull'
      : 'Failed to update',
  })
})

// ================================================================

router.get('/product-delete', function (req, res) {
  const { id } = req.query

  const result = Product.deleteById(id)

  res.render('user-product-alert', {
    style: 'user-product-alert',
    info: 'Action completed',
    description: result
      ? 'Operation succesfull'
      : 'Failed to update',
  })
})
// Підключаємо роутер до бек-енду
module.exports = router
