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

app.get('/', async function(req, res) {
	const [content] = await pool.query('SELECT * FROM content');
	res.send(`<!DOCTYPE html>
	<html>
	<head>
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
	</head>
		<body>
		<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
			<h1>Основы теоретической физики</h1>
			<span>Содержание</span> <a href="/search">Поиск</a>
			<hr/>
			<ul>
				${content.map(thema => `<div><a href="/content-thema/${thema.id}">${thema.theme}</a></div>`).join('')}
			</ul>
		</body>
	</html>`);
});
/////////////
app.get('/content-thema/:theme_id', async function(req, res) {
	const { theme_id } = req.params;
	const [themes] = await pool.query('SELECT * FROM themes WHERE theme_id = ?', theme_id);
	const [[thema]] = await pool.query('SELECT * FROM content WHERE id = ?', theme_id);
	
	res.send(`<!DOCTYPE html>
	<html>
	<head>
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
	</head>
		<body>
		<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
			<h1>Тема: ${thema.theme} <button><a href="/thema/${theme_id}">Редактировать</a></button></h1>
			<a href="/">Содержание</a> 
			<ul class="themes">
			${themes.map(contents => `<div>${contents.text}  <a href="/contents/${contents.id}">редактировать</a></div>`).join('')}
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
	</head>
		<body>
		<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
		<h1>Редактирование темы: ${thema.theme} <form method="post" action="/thema/${theme_id}/remove"></form></h1>
		<a href="/">Содержание</a>
		<form method="post" action="/thema/${theme_id}">
			<div class="mb-3">	
				<textarea class="form-control" id="exampleFormControlTextarea1" rows="5" type="text" name="theme" placeholder="Название темы" >${thema.theme}</textarea>
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
	</head>
		<body>
		<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
		<h1>Редактирование содержимого темы ${thema.theme} <form method="post" action="/contents/${contents_id}/remove"></form></h1>
		<a href="/">Содержание</a>
		<form method="post" action="/contents/${contents_id}">
		<div class="mb-3">	
			<textarea class="form-control" id="exampleFormControlTextarea1" rows="25" type="text" name="text" placeholder="Содержимое темы"  >${contents.text}</textarea>
		</div>	
			<button type="submit">Сохранить</button>
		</form>
		</body>
	</html>`);
});
////////////////
app.get('/search', async function(req, res) {
	const thema_query = req.query.thema_query || '';
	const [themes] = await pool.query(`SELECT themes.text, content.theme
		FROM content
		JOIN themes ON themes.theme_id = content.id
		WHERE content.theme LIKE ?
	`, thema_query + '%');
	res.send(`<!DOCTYPE html>
	<html>
	<head>
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
	</head>
		<body>
		<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
			<h1>Поиск темы</h1>
			<a href="/">Содержание</a> <span>Поиск</span>
			<hr/>
			<form method="get" action="/search">
				<input type="text" name="thema_query" placeholder="Поисковой запрос" value="${thema_query ? thema_query : ''}"/>
				<button type="submit">Применить</button>
			</form>
			Найдено: ${themes.length}
				${themes.map(contents => `<div>${contents.theme}</div>`).join('')}
		</body>
	</html>`);
});

app.get('/search-dynamic-data', async function(req, res) {
	const thema_query = req.query.thema_query || '';
	const [themes] = await pool.query(`SELECT themes.text, content.theme
		FROM content
		JOIN themes ON themes.theme_id = content.id
		WHERE content.theme LIKE ?
	`, thema_query + '%');
	res.json(themes);
});

app.get('/search-dynamic', async function(req, res) {
	const thema_query = req.query.thema_query || '';
	const [themes] = await pool.query(`SELECT themes.text, content.theme
		FROM content
		JOIN themes ON themes.theme_id = content.id
		WHERE content.theme LIKE ?
	`, thema_query + '%');
	res.send(`<!DOCTYPE html>
	<html>
	<head>
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
	</head>
		<body>
		<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
			<script>
			async function getNewData(target) {
				const data = await fetch('/search-dynamic-data?thema_query=' + target.value);
				const themes = await data.json();
				document.querySelector('ul').innerHTML = themes.map(contents => \`<li>\${contents.theme} \${contents.text}</li>\`).join('');
				document.querySelector('.count').innerHTML = themes.length;
			}
			</script>
			<h1>Поиск темы</h1>
			<a href="/">Содержание</a> <span>Поиск</span>
			<hr/>
			<form method="get" action="/search">
				<input type="text" name="thema_query" oninput="javascript:getNewData(this)" placeholder="Поисковой запрос" value="${thema_query ? thema_query : ''}"/>
				<button type="submit">Применить</button>
			</form>
			Найдено: <span class="count">${themes.length}</span>
				${themes.map(contents => `<li>${contents.theme} ${contents.text}</li>`).join('')}
		</body>
	</html>`);
});


app.listen(80,function() {      //запуск сервера
	console.log('server started');
});
