## Based on this tut
https://www.youtube.com/watch?v=S8kmHtQeflo&t=347s

## Using ES6 with Node

https://stackoverflow.com/questions/73028412/cannot-import-router-from-file-with-es6-import-export

## Problem with Backslash in JSON

https://stackoverflow.com/questions/10967105/json-stringify-escaping-without-need

- to write to db.json no JSON.stringify is needed
- if you use JSON.stringify on the newly created obj. in post route - it ll be an obj with quotes interpreted a strings: 
{\"2003\":{\"1\":{\"2\":[\"test\"],\"3\":[\"test2\"]}}} 


# Solution
- just do not stringify the object

## lowDB v2 and lodash

https://www.npmjs.com/package/lowdb#adapters

https://openbase.com/js/lowdb/versions

some methods wont work as described: https://appliedtechnology.github.io/protips/lowdb.html

# Example of working methods
import lodash from 'lodash'
```
// Set a user name using Lodash shorthand syntax
db.chain = lodash.chain(db.data)
db.chain
  .set('user.name', 'typicode')
  .value()
db.write()
```


## Swagger Docu

https://swagger.io/docs/specification/basic-structure/


## components Problem with Parameter
- wanted to create component for paramter id but that does not work
see: https://github.com/swagger-api/swagger-editor/issues/1972
