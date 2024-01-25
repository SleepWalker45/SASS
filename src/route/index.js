// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()
// ================================================================


// ================================================================

class Product {
  static #deliveryPrice = 150;
  static #list = [];
  static #count = 0;

  constructor (name, description, price, readyTo, topToSales) {
    this.id = ++Product.#count;
    this.name = name;
    this.description = description;
    this.price = price;
    this.totalPrice = this.price + Product.#deliveryPrice;
    this.readyTo = readyTo? true : false;
    this.topToSales = topToSales? true : false;
  }

  static getList = () => Product.#list;

  static add = (product) => this.#list.push(product);

  static getById = (id) => {return this.#list.find((product) => product.id === id)};

  static getOtherProducts = (id) => {
    const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];

    let otherProducts = [];

    if (Product.#list.length <= 3) {
      console.log('Выполнился if')
      return otherProducts = Product.#list.filter((product) => product.id !== id);
    } else {
      console.log('Выполинлся else')
      for (let i = 0; i < 3;) {
        const randomElement = getRandomElement(Product.#list);
        console.log(randomElement)
        if (!otherProducts.includes(randomElement) && randomElement !== Product.getById(id)) {
          otherProducts.push(randomElement);
          i++
        }
      }
      return otherProducts;
    }
  }

}

// ================================================================
class Purchase {
  static DELIVERY_PRICE = 150;
  static #count = 0;
  static #list = [];

  constructor (data, product) {
    this.id = ++Purchase.#count;

    this.firstname = data.firstname;
    this.lastname = data.lastname;

    this.phone = data.phone;
    this.email = data.email;

    this.description = data.description || null;
    this.bonus = data.bonus || 0;
    this.promo = data.promo || null;

    this.totalPrice = data.totalPrice;
    this.productPrice = data.productPrice;
    this.amount = data.amount;
    this.cashBack = data.cashBack;

    this.product = product;
  }

  static add = (purchase) => this.#list.push(purchase);

  static getList = () => {
    const reversedList = Purchase.#list.slice().reverse();
    return reversedList;
  };
  

  static getById = (id) => {
    return Purchase.#list.find((product) => product.id === id);
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
  const {name, description, price, readyTo, topToSales} = req.body;
  console.log(readyTo);
  console.log(topToSales);

  const product = new Product(name, description, price, readyTo, topToSales);
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
const product = Product.getById(Number(id));
console.log(product)


  res.render('purchase-product', {
    style: 'purchase-product',
    product,
    id,
    otherProducts: Product.getOtherProducts(Number(id)),
    
  })
  // ↑↑ сюди вводимо JSON дані
})

router.post('/purchase-product', function (req, res) {
  let { id, amount} = req.body;
  id = Number(id)
  amount = Number(amount);
  console.log(`Это id с purchase-product ${id}`)
  if (amount < 1) {
    console.log('if заработал')
    return res.render('alert', {
      style: 'alert',
      info: 'Указано неправильное количество!',
      link: `purchase-product?id=${id}`,
    })
  }

  const product = Product.getById(Number(id));

  const productPrice = product.price;
  const orderPrice = productPrice * Number(amount);
  const totalPrice = orderPrice + 150;
  const cashBack = totalPrice * 0.01

    res.render('order', {
      style: 'order',
      product,
      amount,
      orderPrice,
      productPrice,
      totalPrice,
      cashBack,
      id,
    })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

router.get('/order', function (req, res) {
  const {id} = req.query;
  const product = Product.getById(id);
  console.log(product)

  res.render('order', {
    style: 'order',
    data: {
    }
  })
  // ↑↑ сюди вводимо JSON дані
})

router.post('/order', function (req, res) {
  const {firstname, lastname, phone, email, description, totalPrice, productPrice, cashBack, amount, id} = req.body;
  const product = Product.getById(Number(id));

  const user = new Purchase({firstname, lastname, phone, email, description, totalPrice, productPrice, cashBack, amount}, product);
  Purchase.add(user);

  const userList = Purchase.getList();
  
  res.render('alert', {
    style: 'alert',
    info: 'Заказ оформлен!',
    link: 'order-list',
    id
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

router.get('/order-list', function (req, res) {
  const list = Purchase.getList();

  res.render('order-list', {
    style: 'order-list',
    list,
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

router.get('/order-info', function (req, res) {
  console.log('Запустился order-info')
  let id = req.query.id;
  id = Number(id);
  const user = Purchase.getById(id);
  console.log(user)
  const deliveryPrice = Purchase.DELIVERY_PRICE;
  const price = user.totalPrice - deliveryPrice;
  res.render('order-info', {
    style: 'order-info',
    id,
    user,
    price,
    deliveryPrice
  })
  // ↑↑ сюди вводимо JSON дані
})

router.post('/order-info', function (req, res) {

  res.render('order-list', {
    style: 'order-list',
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

router.get('/order-change', function (req, res) {
  let id = req.query.id;
  id = Number(id);
  console.log(id)
  res.render('order-change', {
    style: 'order-change',
    id
  })
  // ↑↑ сюди вводимо JSON дані
})

router.post('/order-change', function (req, res) {
  const id = req.query.id
  const { lastname, firstname, phone, email } = req.body;

  Purchase.updateById(Number(id), {lastname, firstname, phone, email});

  res.render('alert', {
    style: 'alert',
    info: 'Данные изменены',
    link: 'order-list'
  })
  // ↑↑ сюди вводимо JSON дані
})


// Підключаємо роутер до бек-енду
module.exports = router
