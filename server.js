import express from 'express';
import { PrismaClient } from '@prisma/client';



const app = express();

app.use(express.json());

const prisma = new PrismaClient();

app.get('/test',(req,res)=>{
    res.json({ message: 'Test endpoint is working!' });
})

var todo = [];

app.post('/create',async (req,res)=>{
    const { title, description } = req.body;
    if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required' });
    }
    
    const newTodo = await prisma.todo.create({
        data: {
            title,
            description
        }
    })

    //const newTodo = { id: todo.length + 1, title, description };

    //todo.push(newTodo);
    
    res.status(201).json(newTodo);
})

app.get('/todos',(req,res)=>{
    res.json(todo);
})



app.get('/todos/:id',(req,res)=>{
    const todoId = parseInt(req.params.id, 10);
    const foundTodo = todo.find(t => t.id === todoId);
    
    if (!foundTodo) {
        return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.json(foundTodo);
});

app.put('/todos/:id',(req,res)=>{
    const todoId = parseInt(req.params.id, 10);
    const foundTodo = todo.find(t => t.id === todoId);
    
    if (!foundTodo) {
        return res.status(404).json({ error: 'Todo not found' });
    }
    
    const { title, description } = req.body;
    if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required' });
    }
    
    foundTodo.title = title;
    foundTodo.description = description;
    
    res.json(foundTodo);
})


app.delete('/todos/:id',(req,res)=>{
    const todoId = parseInt(req.params.id, 10);
    const todoIndex = todo.findIndex(t => t.id === todoId);
    
    if (todoIndex === -1) {
        return res.status(404).json({ error: 'Todo not found' });
    }
    
    todo.splice(todoIndex, 1);
    
    res.status(204).send();
})

app.listen(3000);

console.log('Server is running on port 3000');
