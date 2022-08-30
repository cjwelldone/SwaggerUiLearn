import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import lodash from 'lodash'
import swaggerUi from 'swagger-ui-express'
import swaggerDocument from 'swagger-jsdoc'
const PORT = process.env.PORT || 8181;
//https://github.com/typicode/lowdb/releases/tag/v2.0.0
import { Low, JSONFile } from 'lowdb';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { join } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));
// Use JSON file for storage
const file = join(__dirname, 'db.json');
const adapter = new JSONFile(file);
const db = new Low(adapter);
// Read data from JSON file, this will set db.data content
// very important to use await keyword
await db.read()
// Note: db.data needs to be initialized before lodash.chain is called.
db.chain = lodash.chain(db.data)

//importing the routes
import { router as booksRouter }  from './routes/books.js'


// could also be in a json file
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
        title: 'Library API',
        version: '1.0.0',
        description: 'Simple Express Lib'
        },
        servers: [
            {
            url: 'http://localhost:8181/',
            },
            ],
    },
    apis: ['./routes/*.js']    
}

const specs = swaggerDocument(options)

const app = express()
app.db = db

// define the route where to find the api docs
app.use(
    '/api-docs',
    swaggerUi.serve, 
    swaggerUi.setup(specs)
  );
//app.use(cors) // DO NOT USE IN THIS PROJECT

// parse the json body of the req
app.use(express.json())
app.use(morgan("dev")) 
app.use('/books', booksRouter)

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})

