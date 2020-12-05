var express = require('express');
var mysql = require('mysql');
var app = express();

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'motokawa21',
  database: 'mini_app'
});

connection.connect((err) => {
  if(err) {
    console.log('error connecting:' + err.stack);
    return;
  }
  console.log('success');
});

app.set('views', './views');
app.set('view engine', 'pug');//pug拡張子を省略するための記載
app.use('/assets', express.static(__dirname + '/public'));

//JSONでproductsのデータを取得していたものをデータベースに移行
//var products = require('./data/products.json');

app.get('/product', (req, res) => {
  connection.query('SELECT * FROM products',
    (error, results) => {
      if (error) {
        console.log(error);
      }
      res.render('product', {
        title: 'Mini App - product',
        products: results,
        activeMainMenu: {
          product: 'active',
          about: '',
          contact: ''
        },
      });
    }
  );
});

app.get('/order', (req, res) => {
  console.log('req.query = ', req.query);
  connection.query('SELECT * FROM products WHERE id = ?',[req.query.id],
    (error, results) => {
      if (error) {
        console.log(error);
      }
      console.log('show product = ', results[0]);
      console.log(results[0].name);
      res.render('order', {
        title: 'Mini App - product / order',
        product: results[0],
        activeMainMenu: {
          product: '',
          about: '',
          contact: ''
        },
      });
    }
  );
});

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/order/:id', (req, res) => {
  console.log(req.params);
  console.log(req.body);
  //params.idのレコードの在庫を-1して更新する
  connection.query('UPDATE products SET availability = availability - 1 WHERE id = ?',
                    [req.params.id],
    (error, results) => {
      if (error) {
        console.log(error);
      }
      res.redirect('/thanks');
    }
  );
});



app.get('/', (req, res) => {
  res.render('index', {
    title: 'Mini App',
    activeMainMenu: {
      about: '',
      contact: ''
    },
  });
});

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'Mini App - about us',
    activeMainMenu: {
      about: 'active',
      contact: ''
    },
  });
});

app.get('/thanks', (req, res) => {
  res.render('thanks', {
    title: 'Mini App - thanks',
    activeMainMenu: {
      about: 'active',
      contact: ''
    },
  });
});


app.get('/contact', (req, res) => {
  res.render('contact', {
    title: 'Mini App - contact us',
    activeMainMenu: {
      about: '',
      contact: 'active'
    },
  });
});

app.post('/contact', (req, res) => {
  console.log(req.body);
  res.redirect('/');
});

app.listen(3300, function() {
  console.log('ミニアプリサーバーはhttp://localhost:3300でスタートしました！');
});