// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()
// ================================================================

class Product {
  static #list = [];
  static #count = 0;

  constructor (name, description, price) {
    this.id = ++Product.#count;
    this.name = name;
    this.description = description;
    this.price = price;
  }

  static getList = () => Product.#list;

  static add = (product) => this.#list.push(product);

  static getById = (id) => this.#list.find((product) = product.id === id)

}

// ================================================================
class Purchase {
  static DELIVERY_PRICE = 150;
  static #count = 0;
  static #list = [];

  constructor (data, product) {
    this.id = ++Purchase.#count

    this.firstname = data.firstname;
    this.lastname = data.lastname;

    this.phone = data.phone;
    this.email = data.email;

    this.description = data.description || null;
    this.bonus = data.bonus || 0;
    this.promo = data.promo || null;

    this.totalPrice = data.totalPrice;
    this.productPrice = data.productPrice;
    this.deliveryPrice = data.deliveryPrice;
    this.amount = data.amount;

    this.product = product;
  }

  static add = (...arg) => {
    const newPurchase = new Purchase (...arg);
    this.#list.push(newPurchase);
    return newPurchase;
  }

  static getList = () => {
    return Purchase.#list.reverse();
  }

  static getById = (id) => {
    return Purchase.#list.find((item) => item.id === id);
  }

  static updateById = (id, data) => {
    const purchase = Purchase.getById(id);

    if (purchase) {
      if (data.firstname) {purchase.firstname = data.firstname};
      if (data.lastname) {purchase.lastname = data.lastname};
      if (data.phone) {purchase.phone = data.phone};
      if (data.email) {purchase.email = data.email};

      return true;
    } else {return false;}
  }
}

// ================================================================

router.get('/', function (req, res) {


  res.render('index', {
    style: 'index',

    data: {
    }
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

router.get('/alert', function (req, res) {


  res.render('alert', {
    style: 'alert',
    info: 'Инфо',
    data: {
    }
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

router.get('/product-list', function (req, res) {
  const list = Product.getList();
  

  res.render('product-list', {
    style: 'product-list',
    list,
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

router.get('/product-create', function (req, res) {


  res.render('product-create', {
    style: 'product-create',
    data: {
    }
  })
  // ↑↑ сюди вводимо JSON дані
})

router.post('/product-create', function (req, res) {
  const {name, description, price} = req.body;

  const product = new Product(name, description, price);
  console.log(product);

  Product.add(product);
  console.log(Product.getList())
  console.log(product.id)



  res.render('alert', {
    style: 'alert',
    info: 'Товар добавлен!',
    link: 'product-list'
  })

  
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================


router.get('/purchase-product', function (req, res) {
const {id} = req.query;
console.log(Number(id))
const item = Product.getById(Number(id));
console.log(item);


  res.render('purchase-product', {
    style: 'purchase-product',
    
  })
  // ↑↑ сюди вводимо JSON дані
})

router.post('/purchase-product', function (req, res) {


  res.render('purchase-product', {
    style: 'purchase-product',
    data: {
    }
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

router.get('/order', function (req, res) {

  res.render('order', {
    style: 'order',
    data: {
    }
  })
  // ↑↑ сюди вводимо JSON дані
})

router.post('/order', function (req, res) {
  const id = Number(req.query.id);

  let {
    totalPrice,
    productPrice,
    deliveryPrice,
    amount,

    firstname,
    lastname,
    email,
    phone,
  } = req.body;

  res.render('order', {
    style: 'order',
    data: {
    }
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

router.get('/order-list', function (req, res) {

  res.render('order-list', {
    style: 'order-list',
    data: {
    }
  })
  // ↑↑ сюди вводимо JSON дані
})


// Підключаємо роутер до бек-енду
module.exports = router
