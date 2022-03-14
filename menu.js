const Item = require('./item.js')
//importing item object

const db = require('better-sqlite3')('./db-sb-sql.sqlite')
// improting the database

class Menu {
    static init = function () {
        db.prepare('CREATE TABLE IF NOT EXISTS menus (id INTEGER PRIMARY KEY, restaurant_id INTEGER ,title TEXT);').run()
    }

    constructor(restaurant_id, title, id) {
        this.restaurant_id = restaurant_id
        this.title = title
        this.items = []
        if (id) {
            this.id = id
            const items_rows = db.prepare('SELECT * FROM items WHERE menu_id = ?;').all(this.id)
            for(const item_row of items_rows) {
                this.items.push(new Item(item_row.menu_id, item_row.dish, item_row.price, item_row.id))
            }
        } else {
            const insert = db.prepare('INSERT INTO menus (restaurant_id, title) VALUES (?, ?);')
            const info = insert.run(this.restaurant_id, this.title)
            this.id = info.lastInsertRowid       
        }
    }

    addItem(item) {
        if (!(item instanceof Item)) throw Error("can only add Items")
        this.items.push(item)
    }
}


module.exports = Menu
