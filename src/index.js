import grpc from '@grpc/grpc-js'
import protoLoader from '@grpc/proto-loader'

const packageDefinition = protoLoader.loadSync('./todo.proto')

const packageObject = grpc.loadPackageDefinition(packageDefinition)

const todoPackage = packageObject.todoPackage

const creds = grpc.ServerCredentials.createInsecure()
const server = new grpc.Server()

server.bindAsync('0.0.0.0:4000', creds, (err, port) => {
  if (err) console.log('Error', err)
  server.start()
  console.log(`Server is listening on port:${port}`)
})

server.addService(todoPackage.Todo.service, {
  createTodo: createTodo,
  readTodos: readTodos,
  readTodosStream: readTodosStream
})

const todos = []

function createTodo(call, callback) {
  const todoItem = {
    id: todos.length + 1,
    text: call.request.text
  }

  todos.push(todoItem)
  callback(null, todoItem)
}

function readTodos(call, callback) {
  callback(null, { items: todos }) // variable name items in TodoItems in Proto
}

function readTodosStream(call, callback) {
  todos.forEach((item) => call.write(item))
  call.end()
}
