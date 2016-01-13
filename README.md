# [hapi] Seed Project - MVC / RDMS

This project is an application skeleton for a typical [hapi] RESTful API. You can use it to quickly bootstrap your [hapi] API projects and be ready to code the core of your App within minutes.

## Features

- ES6
- MVC file structure + base classes (a'la Rails/Laravel/Django)
- Relational Database support (via [knex.js])
  - MySQL
  - PostgreSQL
  - SQLite3
  - Schema Migrations and Seeding
- Pre-configured environments (_local_, _dev_, _staging_, _production_)
- Powerful payload validations via [joi]
- Auto-generated documentation ([lout])
- Unit & API/REST tests examples ([Jasmine2])
- RESTful outputs
- Improved Logging and Remote debugging
- Healthcheck end-point
- [Gulp] for workflows (ie. watch files changes and launch local server)
- \+ all features and plugin's from [hapi]

---

## Prerequisites

- You need git to clone the hapi-seed repository: http://git-scm.com/

- node.js and npm are needed to execute the code: http://nodejs.org/.

- A relational database is needed, for instance PostgreSQL:
  - Mac: http://postgresapp.com/
  - Linux/Windows: http://www.postgresql.org/download/


## Getting started

1. Fork this repo (top right button) and clone it form your account (replace `YOUR-USERNAME`)
  ```
  git clone https://github.com/YOUR-USERNAME/hapijs-seed-mvc.git
  cd hapijs-seed-mvc
  ```

2. Install the dependencies
  ```
  npm install
  ```

3. Create a Database. In case of PostgreSQL, go into your psql terminal and enter:
  ```
  CREATE DATABASE todo;
  ```

4. Duplicate `config/local.js.default` and rename it into `config/local.js`. Then edit and enter your database settings (DB name goes into `config/default.js`).

5. [Migrate the database and seed it](#database-migration-and-seed)
  ```
  gulp db:migrate
  gulp db:seed
  ```

6. Run the app
  ```
  gulp
  ```

  (if `NODE_ENV` wasn't exported, then `local` is going to be used)

7. Go to: [http://localhost:3000](http://localhost:3000)


## Database Migration and Seed

Knex is taking care of migrating the DB schema and populating (seeding) the tables.
The documentation is available here: http://knexjs.org/#Migrations-CLI.

### Migration

Knex will keep a history of your executed migrations and save them into the DB table `knex_migrations`.

You have to save the migrations in `database/migrations/`. It's recommended to prefix the files with an incrementing number or timestamp. Otherwise it might be hard to keep track of the order the DB changes were executed.

```
gulp db:migrate
```

### Rollback

You can rollback the last group of executed migrations:
```
gulp db:rollback
```

### Seeds

You can populate your DB tables by executing seed files through Knex. Seed files are saved in `database/seeds/`.
```
gulp db:seed
```

## Tests

This project has to kind of tests: UnitTest and API Tests. For both [Jasmine2] is being used. If you want to execute both kind of tests at the same time, you can run:
```
gulp test
```

### UnitTest's

UnitTest's are stored within the folders of the implementation and contain `.spec` as part of their file name. For instance `src/controllers/main.controller.js` and `src/controllers/main.controller.spec.js`. This pattern makes it easier not to forget to write tests :)

You can execute them by running:
```
gulp test:unit
```

### API Tests

API Tests are stored in `/tests/api` and are meant to test the RESTful end-points of your App.

In order to test the server responses you have to start the server in a new terminal/tab:
```
cd /path/to/your/project
gulp
```

Then execute your API Tests by running:
```
gulp test:api
```

## API Documentation

The auto-generated API documentation is provided by [lout] and it's based on the configuration of every route (`/routes`).

[http://localhost:3000/docs](http://localhost:3000/docs)

---

# Build ToDo API

1. Extend the model class: _ToDoList_ (`src/models/ToDoList.js`)
  ```js
  /**
   * Constructor
   */
  constructor() {
    let tableName = 'todo_lists'
    super(tableName)
  }
  ```

2. Extend the controller class: _ToDoListsController_ `src/controllers/todo_lists.controller.js`
  ```js
  /**
   * Constructor
   */
  constructor() {
    let notFoundMsg = `ToDo List not found`

    super(notFoundMsg)
    this.ToDoList = new ToDoList()
  }

  /**
   * Retrieve the list of all ToDo lists
   */
  index(request, reply) {
    this.ToDoList.findAll()
      .then(reply)
      .catch((err) => reply(this.Boom.wrap(err)))
  }

  /**
   * Retrieve a single ToDo list
   */
  view(request, reply) {
    let id = request.params.id

    this.ToDoList.findById(id)
      .then((response) => this.replyOnResonse(response, reply))
      .catch((err) => reply(this.Boom.wrap(err)))
  }
  ```

3. Export `index()` and `view()` end-points in `src/routes/todo_lists.routes.js`
  ```js
  //
  // Export public end-points
  //
  export default [
    routes.index(),
    routes.view()
  ]
  ```

4. Lets test it:
  ```bash
  curl localhost:3000/todo-lists

  curl localhost:3000/todo-lists/1
  ```

5. Extend the controller class with `create()` and `update`: _ToDoListsController_ `src/controllers/todo_lists.controller.js`
  ```js
  /**
   * Create a new ToDo list
   */
  create(request, reply) {
    let data = request.payload

    this.ToDoList.save(data)
      .then(reply)
      .catch((err) => reply(this.Boom.wrap(err)))
  }

  /**
   * Update an existing ToDo list
   */
  update(request, reply) {
    let id = request.params.id
      , data = request.payload

    this.ToDoList.update(id, data)
      .then((response) => this.replyOnResonse(response, reply))
      .catch((err) => reply(this.Boom.wrap(err)))
  }
  ```

6. Extend ToDo List routes class with `create()` and `update()`: `src/routes/todo_lists.routes.js`
  ```js
  /**
   * Create a new ToDo list
   *
   * @return {object}
   */
  create() {
    // Get route settings from parent
    let route = super.create()

    // Update end-point description (used in Documentation)
    route.config.description = 'Create a new ToDo list'

    // Add validations for POST payload
    route.config.validate.payload = {
      name: this.joi.string().required().description('ToDo list name')
    }

    return route
  }

  /**
   * Update an existing ToDo list
   *
   * @return {object}
   */
  update() {
    // Get route settings from parent
    let route = super.update()

    // Update end-point description (used in Documentation)
    route.config.description = 'Update an existing ToDo list'

    // Add validations for POST payload
    route.config.validate.payload = {
      name: this.joi.string().description('ToDo list name')
    }

    return route
  }
  ```

7. Export `create()` and `update()` end-points in `src/routes/todo_lists.routes.js`
  ```js
  //
  // Export public end-points
  //
  export default [
    routes.index(),
    routes.view(),
    routes.create(),
    routes.update()
  ]
  ```

8. Lets test it:
  ```bash
  curl localhost:3000/todo-lists

  curl -X PUT localhost:3000/todo-lists/1 -d name=Homework

  curl -X POST localhost:3000/todo-lists -d name=Uni\ Stuff  
  ```

9. Extend the controller class with `remove()`: _ToDoListsController_ `src/controllers/todo_lists.controller.js`
  ```js
  /**
   * Delete a ToDo list
   */
  remove(request, reply) {
    let id = request.params.id

    this.ToDoList.del(id)
      .then((response) => this.replyOnResonse(response, reply))
      .catch((err) => reply(this.Boom.wrap(err)))
  }
  ```

10. Export the `remove()` end-points in `src/routes/todo_lists.routes.js`
  ```js
  //
  // Export public end-points
  //
  export default [
    routes.index(),
    routes.view(),
    routes.create(),
    routes.update(),
    routes.remove()
  ]
  ```

11. Lets test it:
  ```bash
  curl localhost:3000/todo-lists

  curl -X DELETE localhost:3000/todo-lists/1
  ```

12. Activate tests for ToDo Lists (`*.spec.js` files)

13. Find out how to continue with ToDo's ;)

---

## More

### Remote debug setup

The configuration allows to setup the TCP debug port for node remote debug functionality (5858 by default). This should be overridden when multiple micro node.js services are running on a local machine in a typical dev environment setup.

Remote debug can be used the command line using node debug or with IDEs supporting this feature.


### Go to Staging/Production

Deploy your App on a server and you can use [forever] to run it. [forever] is used to run your App continuously. It will automatically restart if it crashes.
```
[sudo] npm install forever -g
cd /path/to/your/project

export NODE_ENV=staging
forever start index.js
```

.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  
.  

---

### TL;DR :)
https://github.com/cbmono/hapijs-seed-mvc



[hapi]:     http://hapijs.com/
[knex.js]:  http://knexjs.org/
[lout]:     https://github.com/hapijs/lout
[joi]:      https://github.com/hapijs/joi
[Jasmine2]: http://jasmine.github.io/2.4/introduction.html
[Gulp]:     http://gulpjs.com/
[forever]:  https://github.com/foreverjs/forever
