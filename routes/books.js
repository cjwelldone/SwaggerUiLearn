import express from 'express';
const router = express.Router()
//A tiny, secure, URL-friendly, unique string ID generator for JavaScript
import { nanoid } from 'nanoid'
const idLength = 8 


// Swagger UI API Definition
// https://swagger.io/docs/specification/components/ 
// defintion how to use components
/**
 *@swagger
 * components:
 *  schemas:
 *      Book:
 *          type: object
 *          required: 
 *              - title
 *              - author
 *          properties: 
 *              id:
 *                  type: string
 *                  description: auto-generated id of the book
 *              title: 
 *                  type: string
 *                  description: The book title
 *              author: 
 *                  type: string
 *                  description: The book author
 *          example: 
 *              id: esde98zu
 *              title: The Mars Volta
 *              author: Steve F. Keno
 */

 /** 
  * @swagger
  * tags:
  *     name: books
  *     description: The books managing API
 */

 /**
  * @swagger 
  * /books:
  *     get:
  *         summary: Returns list of all books
  *         tags: [Books]
  *         responses:
  *             200:
  *                 description: List of the books
  *                 content:    
  *                     application/json:
  *                         schema: 
  *                             type: array
  *                             items: 
  *                                 $ref: '#/components/schemas/Book'
  * */

 
router.get('/', (req, res) => {
    // access the db through req.app.db - cause db is wired to app.db
    const books = req.app.db.data.books
    res.send(books)
})

/**
  * @swagger
  * /books/{id}:
  *     get:
  *         summary: Get book by id
  *         tags: [Books]
  *         parameters:
  *             - in: path
  *               name: id
  *               schema:
  *                 type: string
  *               required: true
  *               description: The book id
  *            
  *         responses:
  *             200:
  *                 description: The description of the book
  *                 content:    
  *                     application/json:
  *                         schema:
  *                                $ref: '#/components/schemas/Book'
  *             404: 
  *                 description: The book was not found
  */
router.get('/:id', (req, res)=>{
    // find book by id 
    const books = req.app.db.data.books
    const book = books.find(book => {
        return book.id == req.params.id
    })
    if(!book) {
        res.sendStatus(404)
    }

    res.send(book)
})

/**
 * @swagger 
 * /books:
 *    post: 
 *      summary: Create a new Book
 *      tags: [Books]
 *      requestBody: 
 *          required: true
 *          content: 
 *              application/json:
 *                 schema: 
 *                      $ref: '#/components/schemas/Book'
 *      responses: 
 *          200:
 *              description: Book was succesfully created
 *              content:    
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Book'
 *          500:
 *              description: Server Error
 */
router.post('/', async (req,res) => {
    try {
        const newBook = {
            id: nanoid(idLength),
            title: req.body.title,
            author: req.body.author
         }
        const books = req.app.db.data.books
        books.push(newBook)
        // Write db.data content to db.json
        await req.app.db.write()
        res.send(newBook)

     } catch {
        return res.status(500).send('error')
     }
 })

/**
 * @swagger
 * /books/{id}:
 *    put:
 *      summary: Update a Book by id
 *      tags: [Books]
 *      parameters: 
 *             - in: path
 *               name: id
 *               schema:
 *                 type: string
 *                 required: true
 *                 description: The book id
 * 
 *      requestBody: 
 *          required: true
 *          content:
 *               application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Book'
 *      responses:
 *          200:
 *              description: The book was updated successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Book'
 *          404:
 *              description: The book was not found
 *          500:
 *              description: Some Server Error
 * 
 *  */ 
router.put('/:id', async (req,res) => {
    try {
        //find book id
        const books = req.app.db.chain
        .get('books')
        .find({ id: req.params.id })
        //assign the request body {"title": "New Title", "author": "Steve K"}
        .assign(req.body)
        .value()
        await req.app.db.write()
        
        res.send(req.app.db.chain.get('books').find({ id: req.params.id}).value())
    
    } catch(error) {
        return res.status(500).send(console.log(error))
    }
})

/**
 * @swagger
 * /books/{id}:
 *    delete:
 *      summary: Delete a Book by id
 *      tags: [Books]
 *      parameters: 
 *             - in: path
 *               name: id
 *               schema:
 *                 type: string
 *                 required: true
 *                 description: The book id
 *      responses:
 *          200:
 *              description: The book was deleted successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Book'
 *          404:
 *              description: The book was not found
 *          500:
 *              description: Some Server Error
 * 
 *  */ 

router.delete('/:id', async(req,res) => {
    try {
        // find book by id 
        // use book as var to be able to send 404 if id was not found
        const book = req.app.db.chain
        .get('books')
        .remove({id: req.params.id})
        .value()
        await req.app.db.write()
        
        if(!book) {
            res.sendStatus(404)    
        }
        res.sendStatus(200)
        
    } catch(error) {
        return res.status(500).send(error)
    }
})

export { router } 