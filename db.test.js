const db = require('better-sqlite3')(':memory:')//need to import sqlite3 to use it
//:memory: creates a new database purely in memory

describe('better-sqlite3 is used like this', () => {
    beforeAll(() => {//excecuted before any other code is
        db.prepare('CREATE TABLE restaurants (id INTEGER PRIMARY KEY, name TEXT);').run()
        //prepare essentially allows you to create an sql statement to be used again in the code
        //essentially a template
        //creating a table called restaurants
        //id is integer and its primary key so each row will have its own unique number
        //name is the input you want to put in, text is the data type
        //run is running that bit of code
        const restaurantsInsert = db.prepare('INSERT INTO restaurants (name) VALUES (?);')
        // creating a restaurantinsert variable
        //assigning the variable to db.prepare...
        //inserting the name into restaurants table
        //values left with ? because we will add them later
        restaurantsInsert.run('Shakeshack')
        //running the prepare which will need a value parameter to be added
        //in this case Shakeshack
        restaurantsInsert.run('Nandos')
    })
    test('can read out of a database', () => {
        //creating a test and giving a description
        //want to check if the restaurants are in the database
        const restaurants = db.prepare('SELECT id, name FROM restaurants;').all()
        //preparing another 'template' which will get the id and name
        //from the restaurant table
        //.all will get all the restaurants in the table
        //also turns it into an array so it can be read
        expect(Array.isArray(restaurants)).toBeTruthy()
        //expect the restaurant database to be an array
        const [row1, row2] = restaurants
        //assigning the 1st and 2nd restaurants in the array to row 1 and row 2
        expect(row1.name).toBe('Shakeshack')
        //expecting the 1st one to be called Shakeshack
        expect(row2.id).toBe(2)
        //expecting the 2nd ones id to be 2 which it will be as we inserted it 2nd
        //and its id is an integer and its primary key
    })
    test('we can update rows', () => {
        const getRestaurant = db.prepare('SELECT id, name FROM restaurants WHERE id = ?;')
        // assigning db.prepare to a variable because we cant just say expect
        //db.prepare to = something as that would reference any instance of db.prepare
        //getting the id and name from the restaurant database where the id = something
        //which we will pass in later
        expect(getRestaurant.get(2).name).toBe('Nandos')
        //.get is going to get the restaurant which has an id of 2
        //putting two next to get to fill in the where parameter which asks for an id
        //expecting the name of the 2nd restaurant to be Nandos
        const update = db.prepare('UPDATE restaurants SET name = ? WHERE id = ?;')
        //preparing to update the restaurant database and set the name to whatever
        //parameter we pass in, and choosing the location to change this at with WHERE id
        update.run('Burger Bar', 2)
        //running the update db.prepare and passing in desired parameters
        expect(getRestaurant.get(2).name).toBe('Burger Bar')
        //calling the guess restaurant variable and getting the id of the 2nd restaurant
        //expecting its name to now be Burger Bar as we updated it
    })
    test('we can also delete!', () => { // checking if i can delete restaurants from database
        const getrid =  db.prepare('DELETE FROM restaurants WHERE id = ?;')
        //assigning  a variable to db.prepare then making a prepare statement to delete
        // from the restaurants where the id is equal to whatever parameter i pass in
        getrid.run(2)
        // calling the getrid variable which is equal to the prepare statement it is assigned to
        // and then running it which will delete
        //a restaurant depending on which restaurant id passed in
        //which is 2 in this case
        const restaurants = db.prepare('SELECT id, name FROM restaurants;').all()
        //the restaurants are now an array after we used .all
        expect(restaurants.length).toBe(1)
        //expecting the restaurants length to be one because we deleted one
    })
})