const Item = require('./item.js')
const Restaurant = require('./restaurant.js')
//importing item object

const db = require('better-sqlite3')('./db-sb-sql.sqlite')
// improting the database

class Menu {
    static all = []

    static init = function () {// references to any menu class instance created
        db.prepare('CREATE TABLE IF NOT EXISTS menus (id INTEGER PRIMARY KEY, restaurant_id INTEGER ,title TEXT);').run()
    }

    constructor(restaurant_id, title, id) { // always need the restaurant_id to associate the menu with it's restaurant
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
        Menu.all.push(this)
    }

    addItem(item) {
        if (!(item instanceof Item)) throw Error("can only add Items")
        this.items.push(item)
    }


    update(updates) {// a function we can call with an object
        this.title     = updates.title     || this.title // assigning this title to be the updates title OR if that isn't set it defaults to whatever the current title is
        const update = db.prepare('UPDATE menus SET title=? WHERE id=?;') //update statement where the update of the title occurs where the id is the id
        update.run(this.title, this.id)
    }

    delete() {
        db.prepare('DELETE FROM menus WHERE id = ?;').run(this.id)
        //^ call delete on an instance of a menu and then removes intance from the database
        const index = Menu.all.indexOf(this)
        //^ finds itself in the menu array
        Menu.all.splice(index, 1)
        //removes itself from the array
    }
}


module.exports = Menu

//new Menu(1, "Sides")
//new Menu(1,"Sides")
//new Menu(1, "Desserts")
//new Menu(1, "Drinks")
//^ this enabled me to add the menu titles with the corresponding restaurant_id