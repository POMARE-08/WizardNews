const express = require("express");
const postBank = require('./postBank')
const morgan = require('morgan')
const app = express();

app.use(morgan('dev'))

app.use(express.static('public'))

app.get("/", (req, res) => {
  const post = postBank.list()
  
  const html = `<!DOCTYPE html>
  <html>
  <head>
  <title>Wizard News</title>
  <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
  <div class="news-list">
  <header><img src="/logo.png"/>Wizard News</header>
  ${post.map(post => `
  <div class='news-item'>
  <p>
  <span class="news-position">${post.id}. ▲</span>
  ${post.title}
  <small>(by ${post.name})</small>
  </p>
  <small class="news-info">
  ${post.upvotes} upvotes | ${post.date}
  </small>
  <a href="/posts/${post.id}">${post.title}</a>
        </div>`
      ).join('')}
    </div>
  </body>
</html>`

  res.send(html)
});

app.get('/posts/:id', (req, res) => {
  const id = req.params.id;
  const post = postBank.find(id);
  
  res.send( `<!DOCTYPE html>
  <html>
  <head>
    <title>Wizard News</title>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <div class="news-list">
      <header><img src="/logo.png"/>Wizard News</header>
        <div class='news-item'>
          <p>
            <span class="news-position">${post.id}. ▲</span>
            ${post.title}
            <small>(by ${post.name})</small>
          </p>
          <small class="news-info">
            ${post.upvotes} upvotes | ${post.date}
          </small>
        </div>
    </div>
  </body>
</html>`);
});

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

const PORT = 1337;

app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});