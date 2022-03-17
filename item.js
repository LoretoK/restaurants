const db = require('better-sqlite3')('./db-sb-sql.sqlite')

class Item {
    static all = []

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
        Item.all.push(this)
    }

    update(updates) {
        this.dish  = updates.dish  || this.dish
        this.price = updates.price || this.price
        const update = db.prepare('UPDATE items SET dish=?, price=? WHERE id=?;')
        update.run(this.dish, this.price, this.id)
    }

    delete() {
        db.prepare('DELETE FROM items WHERE id = ?;').run(this.id)
        const index = Item.all.indexOf(this)
        Item.all.splice(index, 1)
    }  

}

module.exports = Item

//new Item(1,"Jack Daniels chicken and fries",13)
//new Item(5,"Fries",2)
//new Item(3,"cheesecake",4)
//new Item(4,"Fanta",1)
//new Item(5,"Nachos",4)
//new Item(2,"Hawaian bread rolls",3)