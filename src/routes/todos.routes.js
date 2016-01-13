//
// Internal dependencies
//
import { ToDosController } from '../controllers/todos.controller'
import { BaseRoutes } from './base.routes'


/******************************************
 *
 * Lists routes
 *
 ******************************************/
let routes = new class TodosRoutes extends BaseRoutes {

  /**
   * Constructor
   */
  constructor() {
    let endpointName = '/todos'
    super(new ToDosController(), endpointName)
  }
}


//
// Export public end-points
//
export default []
