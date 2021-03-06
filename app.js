const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const contactRouter = require('./routes/contact')
const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', 'views')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('./public'));
app.use(methodOverride('_method'));
app.use('/contact', contactRouter);

let todoList = [
  {
    id: 1,
    todo: 'Implement a REST API',
  },
  {
    id: 2,
    todo: 'Get Yoked',
  },
  {
    id: 3,
    todo: 'Eat Protein',
  },
  {
    id: 4,
    todo: 'Sleep Enough',
  },
  {
    id: 5,
    todo: 'Wrestle Rottweilers',
  },
];


app.get('/about', function (req, res) {
  res.render('about', {
    title: 'Sh*t To-Do...',
    task: todoList,
  });
});


// GET /api/todos
// app.get("/api/todos", (req, res) => res.send(todoList.filter(todoItems => todoItems.todo;)));
app.get("/api/todos", (req, res) => {
  return res.json(todoList);
});

// GET /api/todos/:id
app.get("/api/todos/:id", (req, res) => res.send(todoList.filter(todoItems => {
  // console.log(todoItems.id, req.params.id);
  return todoItems.id == req.params.id;
})));

// POST /api/todos
app.post("/api/todos", (req, res) => {
  if (req.body.todo) {
    const maxId = todoList.reduce((max, currentTodo) => {
      if (currentTodo.id > max) {
        max = currentTodo.id
      }
      return max
    }, 0);

    const newTodo = {
      id: maxId + 1,
      todo: req.body.todo,
    };
    todoList.push(newTodo);
    if (req.query.form) {
      res.redirect('/about');
    } else {
      res.json(req.body);
    }
  } else {
    res.status(400).json({
      error: 'Please provide todo text',
    })
  }
});

// PUT /api/todos/:id can t find 404 if found update

app.put("/api/todos/:id", (req, res) => {
  let newTodo = null;
  for (let i = 0; i < todoList.length; i++) {
    if (todoList[i].id == req.params.id) {
      newTodo = { id: req.params.id, todo: req.body.todo };
      todoList.splice(i, 1, newTodo);
      res.redirect("/about");
    }
  }
  if (newTodo === null) {
    res.status(404).json({
      error: "Page Not Found",
    });
  }
})
// DELETE /api/todos/:id
app.delete("/api/todos/:id", (req, res) => {
  for (let i = 0; i < todoList.length; i++) {
    if (todoList[i].id == req.params.id) {
      todoList.splice(i, 1);
      res.redirect("/about");
    }
  }
  if (req.params === null) {
    res.status(404).json({
      error: "Page Not Found",
    });
  }
})


app.listen(3000, function () {
  console.log(`Listening.. open http://localhost:${PORT} to view.`);
});
