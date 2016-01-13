//
// External dependencies
//
const Q = require('q')

//
// Internal dependencies
//
import { ToDoList } from './ToDoList'

//
// Tests
//
xdescribe('Model: ToDoList', () => {
  let model

  beforeEach(() => {
    model = new ToDoList()

    spyOn(model, 'findById').and.returnValue(Q.when([{}]))
  })

  it('should be defined and inherit from BaseModelRDMS', () => {
    expect(model).not.toBe(undefined)
    expect(model.Knex).not.toBe(undefined)
  })

  it('should have the correct DB table name', () => {
    expect(model.tableName).toBe('todo_lists')
  })
})
