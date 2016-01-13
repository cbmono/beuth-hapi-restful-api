//
// Internal dependencies
//
import { ToDoListsController } from '../controllers/todo_lists.controller'
import { BaseRoutes } from './base.routes'

/******************************************
 *
 * Lists routes
 *
 ******************************************/
let routes = new class TodoListsRoutes extends BaseRoutes {

  /**
   * Constructor
   */
  constructor() {
    let endpointName = '/todo-lists'
    super(new ToDoListsController(), endpointName)
  }
}


//
// Export public end-points
//
export default []
