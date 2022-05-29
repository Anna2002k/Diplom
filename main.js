const express = require('express');
const mysql2 = require('mysql2/promise');
const bodyParser = require('body-parser');

const pool = mysql2.createPool({  //подкючение БД
	host: '80.87.97.38',
	user: 'user1',
	database: 'phone_book',
	password: '123451',
}); 

const app = express();

app.use(bodyParser.urlencoded());
//////////////// страница содержание////////////////
app.get('/', async function(req, res) {            
	const [content] = await pool.query('SELECT * FROM content');
	res.send(`<!DOCTYPE html>
	<html>
	<head>
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
	<style >
	h1 {
		margin-left: 30px;
	}
	ul {
		border: 1px solid #a7d7f9;
	}
	h6 {
		margin-left: 30px;
		margin-bottom: 0%;
		margin-right: 83%;
    	background: linear-gradient(to top, #E6E6FA,#FFFFFF);
    	padding: 10px;
	}
	</style>
	</head>
		<body>
		<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
			<h1>Основы теоретической физики</h1>
			<hr>
			<h6><span>Содержание |</span> <a href="/search">Поиск</a></h6>
			<ul>
				${content.map(thema => `<div><a href="/content-thema/${thema.id}">${thema.num_theme} ${thema.theme}</a></div>`).join('')}
			</ul>
		</body>
	</html>`);
});
/////////////вывод содержимого темы///////////////////////
app.get('/content-thema/:theme_id', async function(req, res) {
	const { theme_id } = req.params;
	const [themes] = await pool.query('SELECT * FROM themes WHERE theme_id = ?', theme_id);
	const [[thema]] = await pool.query('SELECT * FROM content WHERE id = ?', theme_id);
	
	res.send(`<!DOCTYPE html>
	<html>
	<head>
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
	<script src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML"></script>
	<style >
	h1 {
		margin-left: 30px;
		margin-top: 0%;
	}
	ul {
		border: 1px solid #a7d7f9;
	}
	h6 {
		margin-left: 30px;
		margin-bottom: 0%;
		margin-right: 83%;
    	background: linear-gradient(to top, #E6E6FA,#FFFFFF);
    	padding: 10px;
	}
	p {
		text-align:right;
		margin-bottom: 0%;
		margin-right: 2%;
	}
	</style>
	</head>
		<body>
		<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
		<p><button><a href="/thema/${theme_id}" >Редактировать название темы</a></button></p>	
		<h1>Тема:${thema.num_theme} ${thema.theme} </h1>
			<h6><a href="/">Содержание</a> </h6>
			<ul class="themes">
			${themes.map(contents => `<div>${contents.text}  <p><a href="/contents/${contents.id}">Редактировать содержимое темы</a></p></div>`).join('')}
			</ul>

			</body>
	</html>`);
});
////////////

app.get('/thema/:theme_id', async function(req, res) {
	const { theme_id } = req.params;
	const [[thema]] = await pool.query('SELECT * FROM content WHERE id = ?',theme_id);
	
	res.send(`<!DOCTYPE html>
	<html>
	<head>
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
	<style >
	h1 {
		margin-left: 30px;
	}
	ul {
		border: 1px solid #a7d7f9;
	}
	h6 {
		margin-left: 30px;
		margin-bottom: 0%;
		margin-right: 83%;
    	background: linear-gradient(to top, #E6E6FA,#FFFFFF);
    	padding: 10px;
	}
	</style>
	</head>
		<body>
		<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
		
		<h1>Редактирование темы: ${thema.num_theme}  ${thema.theme}<form method="post" action="/thema/${theme_id}/remove"></form></h1>
		<h6><a href="/">Содержание</a></h6>
		<form method="post" action="/thema/${theme_id}">
			<div class="mb-3">	
				<textarea class="form-control" id="exampleFormControlTextarea1" rows="5" type="text" name="theme" placeholder="Название темы" > ${thema.theme}</textarea>
			</div>
			<button type="submit">Сохранить</button>
		</form>
		</body>
	</html>`);
});
//////////редактирование названия темы///////////
app.post('/thema/:theme_id', async function(req, res) {
	const { theme_id } = req.params;
	const { theme } = req.body;

	await pool.query('UPDATE content SET ? WHERE id = ?', [{
		theme,
	}, theme_id]);
	

	res.redirect(`/content-thema/${theme_id}`);
});

///////////редактирование содержимого темы//////
app.post('/contents/:contents_id', async function(req, res) {
	const { contents_id } = req.params;
	let { text } = req.body;
	
	
	const [[contents]] = await pool.query('SELECT * FROM themes WHERE id = ?', contents_id);
	
	await pool.query('UPDATE themes SET ? WHERE id = ?', [{
		text,
	}, contents_id]);
	
	res.redirect(`/content-thema/${contents.theme_id}`);
});
/////////////////////
app.get('/contents/:contents_id', async function(req, res) {
	const { contents_id } = req.params;
	const [[contents]] = await pool.query('SELECT * FROM themes WHERE id = ?', contents_id);
	const [[thema]] = await pool.query('SELECT * FROM content WHERE id = ?', contents.theme_id);
	
	res.send(`<!DOCTYPE html>
	<html>
	<head>
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
	<style >
	h1 {
		margin-left: 30px;
	}
	ul {
		border: 1px solid #a7d7f9;
	}
	h6 {
		margin-left: 30px;
		margin-bottom: 0%;
		margin-right: 83%;
    	background: linear-gradient(to top, #E6E6FA,#FFFFFF);
    	padding: 10px;
	}
	</style>
	</head>
		<body>
		<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
		<h1>Редактирование содержимого темы ${thema.num_theme} ${thema.theme} <form method="post" action="/contents/${contents_id}/remove"></form></h1>
		<h6><a href="/">Содержание</a></h6>
		<form method="post" action="/contents/${contents_id}">
		<div class="mb-3">	
			<textarea class="form-control" id="exampleFormControlTextarea1" rows="25" type="text" name="text" placeholder="Содержимое темы"  >${contents.text}</textarea>
		</div>	
			<button type="submit">Сохранить</button>
		</form>
		</body>
	</html>`);
});
//////////////поиск///////////////////////////////
app.get('/search', async function(req, res) {
	const thema_query = req.query.thema_query || '';
	const [content] = await pool.query(`SELECT *
		FROM content
		WHERE content.theme LIKE ?
	`, thema_query + '%');
	res.send(`<!DOCTYPE html>
	<html>
	<head>
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
	<style >
	h1 {
		margin-left: 30px;
	}
	ul {
		border: 1px solid #a7d7f9;
	}
	h6 {
		margin-left: 30px;
		margin-bottom: 0%;
		margin-right: 83%;
    	background: linear-gradient(to top, #E6E6FA,#FFFFFF);
    	padding: 10px;
	}
	form {
		margin-top:10px;
	}
	</style>
	</head>
		<body>
		<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
			<h1>Поиск темы</h1>			
			<hr>
			<h6><a href="/">Содержание |</a> <span>Поиск</span></h6>
			<ul>
			<form method="get" action="/search">
				<input type="text" name="thema_query" placeholder="Поисковой запрос" value="${thema_query ? thema_query : ''}"/>
				<button type="submit">Применить</button>
			</form>
			Найдено: ${content.length}
				${content.map(contents => `<div><a href="/content-thema/${contents.id}">${contents.num_theme}${contents.theme}</a></div>`).join('')}
			</ul>
		</body>
	</html>`);
});

app.get('/search-dynamic-data', async function(req, res) {
	const thema_query = req.query.thema_query || '';
	const [content] = await pool.query(`SELECT *
		FROM content
		WHERE content.theme LIKE ?
	`, thema_query + '%');
	res.json(content);
});

app.get('/search-dynamic', async function(req, res) {
	const thema_query = req.query.thema_query || '';
	const [content] = await pool.query(`SELECT *
		FROM content
		WHERE content.theme LIKE ?
	`, thema_query + '%');
	res.send(`<!DOCTYPE html>
	<html>
	<head>
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
	<style >
	h1 {
		margin-left: 30px;
	}
	ul {
		border: 1px solid #a7d7f9;
	}
	h6 {
		margin-left: 30px;
		margin-bottom: 0%;
		margin-right: 83%;
    	background: linear-gradient(to top, #E6E6FA,#FFFFFF);
    	padding: 10px;
	}
	</style>
	</head>
		<body>
		<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
			<script>
			async function getNewData(target) {
				const data = await fetch('/search-dynamic-data?thema_query=' + target.value);
				const content = await data.json();
				document.querySelector('ul').innerHTML = content.map(contents => \`<li>\${contents.theme} </li>\`).join('');
				document.querySelector('.count').innerHTML = content.length;
			}
			</script>
			<h1>Поиск темы</h1>
			<h6><a href="/">Содержание |</a> <span>Поиск</span></h6>
			<hr/>
			<form method="get" action="/search">
				<input type="text" name="thema_query" oninput="javascript:getNewData(this)" placeholder="Поисковой запрос" value="${thema_query ? thema_query : ''}"/>
				<button type="submit">Применить</button>
			</form>
			Найдено: <span class="count">${content.length}</span>
				${content.map(contents => `<div><a href="/content-thema/${contents.id}">${contents.num_theme}${contents.theme}</a></div>`).join('')}
		</body>
	</html>`);
});




app.listen(80,function() {      //запуск сервера
	console.log('server started');
});
