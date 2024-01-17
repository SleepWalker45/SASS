// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()
// ================================================================

// const obj = [
// {
//   name: 'Roman',
//   lastname: 'Yatsenko',
//   id: 323
// },
// {
//   name: 'Kolya',
//   lastname: 'Vantsev',
//   id: 322
// }];
// console.log(obj)

// updateById = (id) => {
//   const productId = obj.findIndex(elem => elem.id === id)

//   if (productId !== -1) {
//     obj[productId].name = newname;
//     obj[productId].lastname = newlastname;
//     return obj;
//   } else {
//     return 'Error'
//   }
// }
// let newname = 'Sergey'
// let newlastname = 'Piatachenko'

// console.log(updateById(322));



// ================================================================

class Product {

  static #list = [];

  constructor (name, price, description) {
    this.id = Math.floor(Math.random() * (99_000 - 10_000) + 10_000);
    this.name = name;
    this.price = price;
    this.description = description;
    this.createDate = new Date().getTime();
  }

  static getList = () => this.#list;

  static add = (product) => this.#list.push(product);

  static getById = (id) => this.#list.find( product => product.id === id);

  static updateById = (id, data) => {
    const user = this.getById(id)

    if (user) {
      this.update(user, data)

      return true
    } else {
      return false
    }
  }

  static update = (user, {name, price, description}) => {
      user.name = name;
      user.price = price;
      user.description = description;
      return user;
  }

  static deleteById = (id) => {
    const index = this.#list.findIndex(elem => elem.id === id)

    if (index !== -1) {
      this.#list.splice(index, 1);
      return true;
    } else {return false}
  }
}

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку

  const list = Product.getList();

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'index',

    data: {
      products: {
        list,
        isEmpty: list.length === 0,
      }
      
    }
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

router.post('/product-create', function (req, res) {
  const { name, price, description } = req.body;
  let result = false;
  
  if (name.trim() !== '' && price.trim() !== '') {
    console.log('Запустился if')
    const product = new Product (name, price, description);
    Product.add(product);
    result = true;
  } else {
    result = false;
  }

  console.log(Product.getList())

  res.render('alert', {
    style: 'alert',
    info_title: result ? 'Успешное выполнение действия': 'Ошибка при выполнении действия',
    info: result ? 'Товар был добавлен успешно': 'Товар не был добавлен',
  })
})

// ================================================================

router.get('/product-create', function (req, res) {
  const { name, price, description } = req.query;
  

  res.render('product-create', {
    style: 'product-create',
  })
})

// ================================================================

// router.post('/alert', function (req, res) {
//   const { name, price, description } = req.body;
//   let result = false;

//   const product = new Product (name, price, description);
  
//   if (Object.keys(product).length !== 0) {
//     Product.add(product);
//     result = true;
//   }

//   console.log(Product.getList())

//   res.render('alert', {
//     style: 'alert',
//     info_title: result ? 'Успешное выполнение действия': 'Ошибка при выполнении действия',
//     info: result ? 'Товар был добавлен успешно': 'Товар не был добавлен',
//   })
// })

// ================================================================

router.get('/product-list', function (req, res) {
  const list = Product.getList();
  

  res.render('product-list', {
    style: 'product-list',
    list,
  })
})

// ================================================================

router.get('/product-edit', function (req, res) {
  const { id } = req.query;
  const product = Product.getById(Number(id))

  res.render('product-edit', {
    style: 'product-edit',
    product,
  })
})

// ================================================================

router.post('/product-edit', function (req, res) {
  const { name, price, description, id } = req.body;
  let result = Boolean;
  if ( name.trim() !== '' && price.trim() !== '') {
  Product.updateById(Number(id), {name, price, description});
  result = true
  } else { result = false }
  

  res.render('alert', {
    style: 'alert',
    info_title: result ? 'Успешное выполнение действия': 'Ошибка при выполнении действия',
    info: result? 'Данные успешно изменены': 'Ошибка при изменении данных',
  })
})

// ================================================================

router.get('/product-delete', function (req, res) {
  const { id } = req.query;
  let result = false;
  if (Product.deleteById(Number(id))) {
    result = true
  }

  res.render('alert', {
    style: 'alert',
    info_title: result ? 'Успешное выполнение действия': 'Ошибка при выполнении действия',
    info: result? 'Данные успешно изменены': 'Ошибка при изменении данных',
  })
})

// Підключаємо роутер до бек-енду
module.exports = router
