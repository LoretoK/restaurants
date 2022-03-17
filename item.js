const db = require('better-sqlite3')('./db-sb-sql.sqlite')

class Item {
    static init = function () {
        db.prepare('CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY, menu_id INTEGER, dish TEXT, price FLOAT);').run()
    }
    constructor(menu_id, dish, price, id) {
        this.menu_id = menu_id
        this.dish = dish
        this.price = price
        if (id) {
            this.id = id
        } else {
            const insert = db.prepare('INSERT INTO items (menu_id, dish, price) VALUES (?, ?, ?);')
            const info = insert.run(this.menu_id, this.dish, this.price)
            this.id = info.lastInsertRowid
        }
    }
}

module.exports = Item

//new Item(1,"Jack Daniels chicken and fries",13)
//new Item(5,"Fries",2)
//new Item(3,"cheesecake",4)
//new Item(4,"Fanta",1)
//new Item(5,"Nachos",4)
//new Item(2,"Hawaian bread rolls",3)