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

    update(updates) { // a function we can call with an object
        this.dish  = updates.dish  || this.dish // assigning this dish to be the updates diah OR if that isn't set it defaults to whatever the current dish is
        this.price = updates.price || this.price // assigning this proce to be the updates price OR if that isn't set it defaults to whatever the current title is
        const update = db.prepare('UPDATE items SET dish=?, price=? WHERE id=?;') //update statement where the update of the dish and price occurs where the id is the id
        update.run(this.dish, this.price, this.id)
    }

    delete() {
        db.prepare('DELETE FROM items WHERE id = ?;').run(this.id)
        //^ call delete on an instance of an item and then removes intance from the database
        const index = Item.all.indexOf(this)
        //^ finds itself in the item array
        Item.all.splice(index, 1)
        //removes itself from the array
    }  

}

module.exports = Item

//new Item(1,"Jack Daniels chicken and fries",13)
//new Item(5,"Fries",2)
//new Item(3,"cheesecake",4)
//new Item(4,"Fanta",1)
//new Item(5,"Nachos",4)
//new Item(2,"Hawaian bread rolls",3)