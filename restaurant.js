const Menu = require('./menu.js')

const db = require('better-sqlite3')('./db-sb-sql.sqlite')
//^ establishing interaction with the database


class Restaurant {
    static init () {// initialises the restaurant by fetching all the restaurant items out of te database
        //this creates the table ONLY IF the table does NOT exist already
        db.prepare('CREATE TABLE IF NOT EXISTS restaurants (id INTEGER PRIMARY KEY, name TEXT, imageURL Text);').run()
        
        //selecting all of the restaurants out of the database that are already existing
        const restaurants_rows = db.prepare('SELECT * FROM restaurants;').all()
        //console.log(restaurants_rows)
        
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
    
    //this is where the new instances of thes restaurant get pushed into as stated by Restaurant.all.push(this)
    static all = []
    //^ holds reference to every restaurant class created
    
    //constructor function is invoked every time you use the new keyword when instantiating a class
    constructor(name, imageURL, id) {//setting the properties of the restaurant instance // remember restaurant may not always have an id
        this.name = name // this. referes to the current instance
        this.imageURL = imageURL
        this.menus = []
        //if the instance of restaurant already has its unique id then the unique id is used
        if (id) {
            this.id = id
        } else {
            //when inserting a new instance of a restaurant with no id it's made with the block of code, it ensures is unique
            const insert = db.prepare('INSERT INTO restaurants (name, imageURL) VALUES (?,?);')
            //^this gives us an object which is then run on the next line of code
            
            //this runs the sql statement and inserts into database
            const row = insert.run(this.name, this.imageURL)

            //gives back the id that has now been given to the newly inserted row/restaurant. The id is also added to the instance of the class(in this case the class is Restaurant)
            this.id = row.lastInsertRowid
        }
        //this pushes the newly made restaurant instance into the database; next time databse is run the new restaurant would be in the db as a new object
        Restaurant.all.push(this)
    }

    update(updates) { // a function we can call with an object
        this.name = updates.name || this.name // assigning this name to be the updates name OR if that isn't set it defaults to whatever the current name is
        this.imageURL = updates.imageURL || this.imageURL // assigning this imageURL to be the updates ImageURL OR if that isn't set it defaults to whatever the current ImageURL is
        this.menus = updates.menus || this.menus // assigning this menus to be the updates menus OR if that isn't set it defaults to whatever the current menus is
        const update = db.prepare('UPDATE restaurants SET name=?, imageURL=? WHERE id=?;')
        //^ update statement where the update of the mane and imageURL occurs where the id is the id
        update.run(this.name, this.imageURL, this.id)
    }

    delete() {
        db.prepare('DELETE FROM restaurants WHERE id = ?;').run(this.id)
        //^ call delete on an instance of a restaurant and then removes intance from the database
        const index = Restaurant.all.indexOf(this)
        //^ finds itself in the restaurant array
        Restaurant.all.splice(index, 1)
        //removes itself from the array
    }

    addMenu(menu) {
        if (!menu.id) {
        } else {
            this.menus.push(menu)
        }
    }
    //adds from codebase into database
}



module.exports = Restaurant


