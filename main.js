const Menu = require('./menu.js')
const Restaurant = require('./restaurant.js')
const Item = require('./item.js')

module.exports = { Menu, Restaurant, Item }



//selecting all the restaurants out of the database
// Restaurant.all.forEach(row => {
//     const restaurant = new Restaurant(row.name, row.id)
//     const menu = new Menu("Mains")
//     restaurant.addMenu(menu)
// })


Item.init();
Menu.init();
Restaurant.init();
// const restaurant = new Restaurant('kfc','http://.jpg')
// const menu = new Menu(1,'Mains')
// const item = new Item(1,'chicken', 3)
// menu.addItem(item)
// restaurant.addMenu(menu)

console.log(Restaurant.all)
