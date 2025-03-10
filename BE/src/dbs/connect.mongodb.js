'use strict'

import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

//SINGLETON DESIGN PATTERN
const connectString = process.env.LOCAL_URI;

class Database {

    constructor() {
        this.connect()
    }

    //connect
    connect(type = 'mongodb') {
        mongoose.connect(connectString, { maxPoolSize: 50 })
            .then(() => {
                console.log("Connected Mongodb Success")
            })
            .catch(err => console.log("Error Connect"))
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database()
        }
        return Database.instance
    }

}

const instanceMongoDb = Database.getInstance()

export default instanceMongoDb
