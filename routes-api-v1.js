// Define a Node module that handles routing
module.exports.setup = (router, uploads, knex) => {

    // 1. Load libraries
    let moment = require('moment')

    // 2. Define routes /api/v1 is already on the route because of routesApiV1 variable in todos.js
    router.get('/todos', function(request, response) {
        knex.select('*').table('todos').orderBy('category', 'asc').then(function(data) {
            response.json(data)
        })
    })

    router.post('/todos', function (request, response) {

        let now = moment().format('YYYY-MM-DD HH:mm:ss')

        let todo = {
            todo: request.body.todo.trim(),
            category: request.body.category,
            due_date: request.body.due_date,
            completed: request.body.completed ? 'yes' : 'no',
            created_at: now,
            updated_at: now,
        }

        knex.insert(todo).table('todos').returning('*').then(function(data) {
            response.json(data[0])
        })

    })

    router.get('/todos/:todoId/complete', function (request, response) {
        var update = {
            completed: 'yes'
        }

        
        knex.update(update).table('todos').where('id', '=', request.params.todoId).then(function(data) {
            response.json(true)
        })
    })

    router.get('/todos/:todoId/incomplete', function (request, response) {
        var update = {
            completed: 'no',
        }

         knex.update(update).table('todos').where('id', '=', request.params.todoId).then(function(data) {
            response.json(true)
        })
    })

    // Return the router, with new routes attached back to the Express web serer that's loading these
    return router
}