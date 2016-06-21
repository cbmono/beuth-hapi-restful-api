import * as Q  from 'q'
import { ToDoList } from './ToDoList'


//
// Tests
//
xdescribe('Model: ToDoList', () => {
  let model

  beforeEach(() => {
    model = new ToDoList()
  })

  it('should be defined and inherit from BaseModelRDMS', () => {
    expect(model).not.toBe(undefined)
    expect(model.Knex).not.toBe(undefined)
  })

  it('should have the correct DB table name', () => {
    expect(model.tableName).toBe('todo_lists')
  })

  it('should import the model ToDo', () => {
    expect(model.ToDo).not.toBe(undefined)
  })

  xdescribe('findByIdWithToDos() method', () => {
    beforeEach(() => {
      spyOn(model.ToDo, 'findBy').and.returnValue(Q.when({}))
    })

    it('should return a ToDoList and all its ToDos()', (done) => {
      spyOn(model, 'findById').and.returnValue(Q.when([{}]))
      let id = 1

      model.findByIdWithToDos(id).then(() => {
        expect(model.findById).toHaveBeenCalledWith(id)
        expect(model.ToDo.findBy).toHaveBeenCalledWith('todo_list_id', id)
        done()
      })
    })

    it('should return an empty array if ID is not found', (done) => {
      spyOn(model, 'findById').and.returnValue(Q.when([]))
      let id = 'xxx'

      model.findByIdWithToDos(id).then((response) => {
        expect(model.findById).toHaveBeenCalledWith(id)
        expect(model.ToDo.findBy).not.toHaveBeenCalled()
        expect(response.length).toBe(0)
        expect(typeof response).toBe('object')
        done()
      })
    })
  })
})
