import grpc from '@grpc/grpc-js'
import protoLoader from '@grpc/proto-loader'

// Explore examples:  https://github.com/grpc/grpc-node/blob/@grpc/grpc-js@1.9.0/examples/routeguide/dynamic_codegen/route_guide_client.js
const packageDefinition = protoLoader.loadSync('./todo.proto')

const todoPackage = grpc.loadPackageDefinition(packageDefinition).todoPackage

const client = new todoPackage.Todo('localhost:4000', grpc.credentials.createInsecure())

client.readTodos({}, (err, res) => {
  console.log('Reading All todos', JSON.stringify(res))
})

const streamCall = client.readTodosStream()

streamCall.on('data', (item) => {
  console.log(`StreamData Recieved from Server`, JSON.stringify(item))
})

streamCall.on('end', (e) => console.log(`Stream DONE!!`))

client.createTodo({ id: 1, text: 'My Third Todo in the list' }, (err, res) => {
  console.log('Response', JSON.stringify(res))
})
