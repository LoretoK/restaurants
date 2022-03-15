const Menu = require('./menu.js')

const db = require('better-sqlite3')('./db-sb-sql.sqlite')


class Restaurant {
    static init () {
        //this creates the table ONLY IF the table does NOT exist already
        db.prepare('CREATE TABLE IF NOT EXISTS restaurants (id INTEGER PRIMARY KEY, name TEXT, imageURL Text);').run()
        
        //selecting all of the restaurants out of the database that are already existing
        const restaurants_rows = db.prepare('SELECT * FROM restaurants;').all()
        // console.log(restaurants_rows)
        
        //for loop allowing the information from each row to be an instance of the restaurant class, a new restaurant object is made
        for(let restaurant_row of restaurants_rows) {
            const restaurant = new Restaurant(restaurant_row.name, restaurant_row.imageURL, restaurant_row.id)
            const menus_rows = db.prepare('SELECT * FROM menus WHERE restaurant_id = ?;').all(restaurant.id)
         //for loop allowing the information from each row to be an instance of the menu class           
            for(const menu_row of menus_rows) {
                const menu = new Menu(menu_row.restaurant_id, menu_row.title, menu_row.id)
                restaurant.addMenu(menu)
            }
        }
    }
    
    //this is where the new instances od thes restaurant get pushed into as stated by Restaurant.all.push(this)
    static all = []
    

    constructor(name, imageURL, id) {//setting the properties of the restaurant instance
        this.name = name
        this.imageURL = imageURL
        this.menus = []
        //if the instance of restaurant already has its unique id then the unique id is used
        if (id) {
            this.id = id
        } else {
            //when inserting a new instance of a restaurant with no id it's made with the block of code, it ensures is unique
            const insert = db.prepare('INSERT INTO restaurants (name, imageURL) VALUES (?,?);')

            //gives back the id that has now been given and uses it as the new restaurants id
            const row = insert.run(this.name, this.imageURL)
            this.id = row.lastInsertRowid
        }
        //this pushes the newly made restaurant instance into the database; next time databse is run the new restaurant would be in the db as a new object
        Restaurant.all.push(this)
    }

    update(updates) {
        this.name = updates.name || this.name
        this.imageURL = updates.imageURL || this.imageURL
        this.menus = updates.menus || this.menus
        const update = db.prepare('UPDATE restaurants SET name=?, imageURL=? WHERE id=?;')
        update.run(this.name, this.imageURL, this.id)
    }

    delete() {
        db.prepare('DELETE FROM restaurants WHERE id = ?;').run(this.id)
        const index = Restaurant.all.indexOf(this)
        Restaurant.all.splice(index, 1)
    }

    addMenu(menu) {
        if (!menu.id) {
            // add to database
        } else {
            this.menus.push(menu)
        }
    }
}



module.exports = Restaurant


