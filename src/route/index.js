// Підключаємо технологію express для back-end сервера
const order = require('eslint-plugin-import/lib/rules/order')
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

class Product {
  static #list = []

  static #count = 0

  constructor(
    img,
    title,
    description,
    category,
    price,
    amount = 0,
  ) {
    this.id = ++Product.#count
    this.img = img
    this.title = title
    this.description = description
    this.category = category
    this.price = price
    this.amount = amount
  }

  static add = (...data) => {
    const newProduct = new Product(...data)

    this.#list.push(newProduct)
  }

  static getList = () => {
    return this.#list
  }

  static getById = (id) => {
    return this.#list.find((product) => product.id === id)
  }

  static getRandomList = (id) => {
    const filteredList = this.#list.filter(
      (product) => product.id !== id,
    )

    const shuffledList = filteredList.sort(
      () => Math.random() - 0.5,
    )

    return shuffledList.slice(0, 3)
  }
}

class Purchase {
  static DELIVERY_PRICE = 10
  static #BONUS_FACTOR = 0.1

  static #count = 0
  static #list = []

  static #bonusAccount = new Map()

  static calcBonusAmount(value) {
    return value * Purchase.#BONUS_FACTOR
  }

  static getBonudBalance(email) {
    return Purchase.#bonusAccount.get(email) || 0
  }

  static updateBonusBalance(email, price, bonusUse = 0) {
    const amount = this.calcBonusAmount(price)

    const currentBalance = Purchase.getBonudBalance(email)

    const updatedBalance =
      currentBalance + amount - bonusUse

    Purchase.#bonusAccount.set(email, updatedBalance)

    console.log(email, updatedBalance)

    return amount
  }
  constructor(data, product) {
    this.id = ++Purchase.#count

    this.firstname = data.firstname
    this.lastname = data.lastname

    this.phone = data.phone
    this.email = data.email

    this.comment = data.comment || null

    this.bonus = data.bonus || 0

    this.promocode = data.promocode || null

    this.totalPrice = data.totalPrice
    this.productPrice = data.productPrice
    this.deliveryPrice = data.deliveryPrice
    this.amount = data.amount

    this.product = product
  }

  static add(...arg) {
    const newPurchase = new Purchase(...arg)

    this.#list.push(newPurchase)

    return newPurchase
  }

  static getList() {
    return Purchase.#list.reverse()
  }

  static getById = (id) => {
    return this.#list.find((item) => item.id === id)
  }

  static updateById(id, data) {
    const purchase = this.getById(id)

    if (purchase) {
      if (data.firstname)
        purchase.firstname = data.firstname
      if (data.lastname) purchase.lastname = data.lastname
      if (data.phone) purchase.phone = data.phone
      if (data.email) purchase.email = data.email

      return true
    } else return false
  }
}

class Promocode {
  static #list = []

  constructor(name, factor) {
    this.name = name
    this.factor = factor
  }

  static add(name, factor) {
    const newPromo = new Promocode(name, factor)
    Promocode.#list.push(newPromo)
    return newPromo
  }

  static getByName = (name) => {
    return this.#list.find((promo) => promo.name === name)
  }

  static calc(promo, price) {
    return price * promo.factor
  }
}

Promocode.add('promo', 0.9)

Product.add(
  'https://picsum.photos/200/300',
  'Product PC Number 1',
  'Product PC Number 1 rather long desciption with important info and loads of different words',
  [
    { id: 1, text: 'Ready for shipping' },
    { id: 2, text: 'Top 100 sales' },
  ],
  1500,
  10,
)

Product.add(
  'https://picsum.photos/200/300',
  'Product PC Number 2',
  'Product PC Number 2 rather long desciption with important info and loads of different words',
  [
    { id: 1, text: 'Ready for shipping' },
    { id: 2, text: 'Top 100 sales' },
  ],
  2000,
  10,
)

Product.add(
  'https://picsum.photos/200/300',
  'Product PC Number 3',
  'Product PC Number 3 rather long desciption with important info and loads of different words',
  [
    { id: 1, text: 'Ready for shipping' },
    { id: 2, text: 'Top 100 sales' },
  ],
  2500,
  10,
)

// ================================================================

router.get('/', function (req, res) {
  res.render('purchase-index', {
    style: 'purchase-index',

    data: {
      list: Product.getList(),
    },
  })
})

// ================================================================

router.get('/purchase-product', function (req, res) {
  const id = Number(req.query.id)
  console.log(id)
  res.render('purchase-product', {
    style: 'purchase-product',

    data: {
      list: Product.getRandomList(id),
      product: Product.getById(id),
    },
  })
})

// ================================================================

router.get('/purchase-alert', function (req, res) {
  res.render('purchase-alert', {
    style: 'purchase-alert',

    data: {
      message: 'Succesfull operation',
      info: 'Product created',
      link: '/test',
    },
  })
})

// ================================================================

router.post('/purchase-create', function (req, res) {
  const id = Number(req.query.id)
  const amount = Number(req.body.amount)

  if (amount < 1) {
    return res.render('purchase-alert', {
      style: 'purchase-alert',

      data: {
        message: 'Error',
        info: 'Product quantity must be more than 1',
        link: `/purchase-product?id=${id}`,
      },
    })
  }

  const product = Product.getById(id)

  if (product.amount < 1) {
    return res.render('purchase-alert', {
      style: 'purchase-alert',

      data: {
        message: 'Error',
        info: 'Inappropriate product quantity',
        link: `/purchase-product?id=${id}`,
      },
    })
  }

  // console.log(product, amount)

  const productPrice = product.price * amount
  const totalPrice = productPrice + Purchase.DELIVERY_PRICE
  const bonus = Purchase.calcBonusAmount(totalPrice)
  res.render('purchase-create', {
    style: 'purchase-create',

    data: {
      id: product.id,

      cart: [
        {
          text: `${product.title} (${amount})`,
          price: productPrice,
        },
        {
          text: `Delivery`,
          price: Purchase.DELIVERY_PRICE,
        },
      ],
      totalPrice,
      productPrice,
      deliveryPrice: Purchase.DELIVERY_PRICE,
      amount,
      bonus,
    },
  })
})

// ================================================================

router.post('/purchase-submit', function (req, res) {
  const id = Number(req.query.id)
  let {
    totalPrice,
    productPrice,
    deliveryPrice,
    amount,

    firstname,
    lastname,
    email,
    phone,
    comment,

    promocode,
    bonus,
  } = req.body

  const product = Product.getById(id)

  if (!product) {
    return res.render('purchase-alert', {
      style: 'purchase-alert',

      data: {
        message: 'Error',
        info: 'Product does not exist',
        link: '/purchase-list',
      },
    })
  }

  if (product.amount < amount) {
    return res.render('purchase-alert', {
      style: 'purchase-alert',

      data: {
        message: 'Error',
        info: 'Not enough products',
        link: '/purchase-list',
      },
    })
  }

  totalPrice = Number(totalPrice)
  productPrice = Number(productPrice)
  deliveryPrice = Number(deliveryPrice)
  amount = Number(amount)
  bonus = Number(bonus)

  if (
    isNaN(totalPrice) ||
    isNaN(productPrice) ||
    isNaN(deliveryPrice) ||
    isNaN(amount) ||
    isNaN(bonus)
  ) {
    return res.render('purchase-alert', {
      style: 'purchase-alert',

      data: {
        message: 'Error',
        info: 'Invalid data',
        link: '/purchase-list',
      },
    })
  }

  if (!firstname || !lastname || !email || !phone) {
    return res.render('purchase-alert', {
      style: 'purchase-alert',

      data: {
        message: 'Fill required fields',
        info: 'Invalid data',
        link: '/purchase-list',
      },
    })
  }

  if (bonus || bonus > 0) {
    const bonusAmount = Purchase.getBonudBalance(email)

    console.log(bonusAmount)

    if (bonus > bonusAmount) {
      bonus = bonusAmount
    }

    Purchase.updateBonusBalance(email, totalPrice, bonus)

    totalPrice -= bonus
  } else Purchase.updateBonusBalance(email, totalPrice, 0)

  if (promocode) {
    promocode = Promocode.getByName(promocode)

    if (promocode) {
      totalPrice = Promocode.calc(promocode, totalPrice)
    }
  }

  if (totalPrice < 0) totalPrice = 0

  const purchase = Purchase.add(
    {
      totalPrice,
      productPrice,
      deliveryPrice,
      amount,
      bonus,

      firstname,
      lastname,
      email,
      phone,
      comment,

      promocode,
    },
    product,
  )

  // console.log(purchase)

  res.render('purchase-alert', {
    style: 'purchase-alert',

    data: {
      message: 'Success',
      info: 'Opration successfull',
      link: '/purchase-list',
    },
  })
})

// ================================================================

router.get('/purchase-list', function (req, res) {
  const orders = Purchase.getList()
  console.log(orders.length)
  console.log(orders)

  res.render('purchase-list', {
    style: 'purchase-list',

    data: {
      orders: orders,
    },
  })
})

// ================================================================

router.post('/purchase-info', function (req, res) {
  const id = Number(req.query.id)
  const purchase = Purchase.getById(id)
  console.log(purchase)
  res.render('purchase-info', {
    style: 'purchase-info',

    data: {
      id: id,
      name: purchase.firstname,
      lastname: purchase.lastname,
      phone: purchase.phone,
      email: purchase.email,
      product: purchase.product.title,
      bonus: String(purchase.bonus),
      delivery: `${purchase.deliveryPrice}$`,
      totalPrice: `${purchase.totalPrice}$`,
    },
  })
})

// ================================================================

router.post('/purchase-edit', function (req, res) {
  const id = Number(req.query.id)
  const purchase = Purchase.getById(id)

  res.render('purchase-edit', {
    style: 'purchase-edit',

    data: {
      id: id,
      name: purchase.firstname,
      lastname: purchase.lastname,
      phone: purchase.phone,
      email: purchase.email,
    },
  })
})

// Підключаємо роутер до бек-енду
module.exports = router
