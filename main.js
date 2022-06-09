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
		margin-bottom: 20px;
	}
	ul {
		border: 1px solid #a7d7f9;
		padding-top: 8px;
		margin-left: 10px;
	}
	h6 {
		margin-left: 10px;
		margin-bottom: 0%;
		margin-right: 83%;
	}
	a {
		color: #221fde; 
		text-decoration: none; 
	   }
	a:visited {
		color: #500c7a; 
	   }  
	a:hover {
		text-decoration: underline;
	   }    
	span {
		padding-top: 1.25em;  
		padding-left: 8px;
		padding-right: 8px;
		cursor: pointer; 
		background-image: linear-gradient(to bottom,rgba(167,215,249,0) 0,#a7d7f9 100%); 
		background-repeat: no-repeat;
		background-repeat-x: no-repeat;
		background-repeat-y: no-repeat; 
		background-size: 1px 100%;
	}
	</style>
	</head>
		<body style="background-color: #faf9e1">
		<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
			<h1>Основы теоретической физики</h1>
			<h6><span>Содержание </span> <a style="color: #221fde; padding-top: 1.25em;  padding-left: 8px;padding-right: 8px;cursor: pointer; background-image: linear-gradient(to bottom,rgba(167,215,249,0) 0,#a7d7f9 100%); background-repeat: no-repeat;background-repeat-x: no-repeat;background-repeat-y: no-repeat; background-size: 1px 100%;" href="/search">Поиск</a><span></span></h6>
			<ul>
				${content.map(thema => `<div><a href="/content-thema/${thema.id}">${thema.num_theme} ${thema.theme}</a></div>`).join('')}
			</ul>
		</body>
	</html>`);
});
/////////////вывод содержимого темы///////////////////////
app.get('/content-thema/:theme_id', async function(req, res) {
	const { theme_id } = req.params;
	let [themes] = await pool.query(`SELECT * FROM themes WHERE (theme_id = ${theme_id})and(time_vers = (select max(time_vers) from themes where theme_id= ${theme_id}))`);
	const [[thema]] = await pool.query(`SELECT * FROM content WHERE id = ${theme_id}`);
	
	if (!!req.query && !!req.query.time)
	{
		var time = new Date(req.query.time*1).toISOString().slice(0, 19).replace('T', ' '); 
		[themes] = await pool.query(`SELECT * FROM themes WHERE (theme_id = ?)and(time_vers = ?)`,[theme_id,time]);
	}
	
	res.send(`<!DOCTYPE html>
	<html>
	<head>
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
	<script src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML"></script>
	<style >
	h1 {
		margin-left: 30px;
		margin-bottom: 20px;
	}
	ul {
		border: 1px solid #a7d7f9;
		padding-top: 8px;
		margin-left: 10px;
	}
	h6 {
		margin-left: 10px;
		margin-bottom: 0%;
	}
	p {
		text-align:right;
		margin-bottom: 0%;
		margin-right: 2%;
	}
	a {
		color: #221fde; 
		text-decoration: none; 
	   }
	a:visited {
		color: #500c7a; 
	   }  
	a:hover {
		text-decoration: underline;
	   } 
	</style>
	</head>
		<body style="background-color: #faf9e1">
		<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
		<p><a style="color: #221fde" href="/thema/${theme_id}" >Редактировать название темы</a></p>	
		<h1>Тема:${thema.num_theme} ${thema.theme} </h1>
			<h6><a style="color: #221fde; padding-top: 1.25em;  padding-left: 8px;padding-right: 8px;cursor: pointer; background-image: linear-gradient(to bottom,rgba(167,215,249,0) 0,#a7d7f9 100%); background-repeat: no-repeat;background-repeat-x: no-repeat;background-repeat-y: no-repeat; background-size: 1px 100%;" href="/">Содержание</a> <a style="color: #221fde; padding-top: 1.25em;  padding-left: 8px;padding-right: 8px;cursor: pointer; background-image: linear-gradient(to bottom,rgba(167,215,249,0) 0,#a7d7f9 100%); background-repeat: no-repeat;background-repeat-x: no-repeat;background-repeat-y: no-repeat; background-size: 1px 100%;" href="/thema_vers/${theme_id}">Версии страницы</a><a <a style="color: #221fde; padding-top: 1.25em;  padding-left: 8px;padding-right: 8px;cursor: pointer; background-image: linear-gradient(to bottom,rgba(167,215,249,0) 0,#a7d7f9 100%); background-repeat: no-repeat;background-repeat-x: no-repeat;background-repeat-y: no-repeat; background-size: 1px 100%;"></a></h6>
			
			<ul class="themes">
			<p><a style="color: #221fde" href="/contents/${theme_id }">Редактировать содержимое темы</a></p>
			${themes.map(contents => `<div>${contents.text}${contents.time_vers}  </div>`).join('')}
			</ul>

			</body>
	</html>`);
});
////////////редактирование темы/////////////////////

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
		margin-bottom: 20px;
	}
	textarea {
		border: 1px solid #a7d7f9;
		padding-top: 8px;
		margin-left: 10px;
	}
	h6 {
		margin-left: 10px;
		margin-bottom: 0%;
	}
	a {
		color: #221fde; 
		text-decoration: none; 
	   }
	a:visited {
		color: #500c7a; 
	   }  
	a:hover {
		text-decoration: underline;
	   } 
	</style>
	</head>
		<body style="background-color: #faf9e1">
		<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
		
		<h1>Редактирование темы: ${thema.num_theme}  ${thema.theme}<form method="post" action="/thema/${theme_id}/remove"></form></h1>
		<h6><a style="color: #221fde; padding-top: 1.25em;  padding-left: 8px;padding-right: 8px;cursor: pointer; background-image: linear-gradient(to bottom,rgba(167,215,249,0) 0,#a7d7f9 100%); background-repeat: no-repeat;background-repeat-x: no-repeat;background-repeat-y: no-repeat; background-size: 1px 100%;" href="/">Содержание</a><a style="padding-top: 1.25em;  padding-left: 8px;padding-right: 8px;cursor: pointer; background-image: linear-gradient(to bottom,rgba(167,215,249,0) 0,#a7d7f9 100%); background-repeat: no-repeat;background-repeat-x: no-repeat;background-repeat-y: no-repeat; background-size: 1px 100%;"></a></h6>
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
	let { comment } = req.body;
	
	await pool.query(`INSERT INTO themes (theme_id, text, time_vers, comment) VALUES (?, ?, now(), ?)`,[contents_id,text,comment]);
	const [[contents]] = await pool.query(`SELECT * FROM themes WHERE theme_id = ${contents_id}`);
	
	res.redirect(`/content-thema/${contents.theme_id}`);
});
/////////////////////редактирование содержимого темы//////////////////////
app.get('/contents/:contents_id', async function(req, res) {
	const { contents_id } = req.params;
	let [[contents]] = await pool.query(`SELECT * FROM themes WHERE (theme_id = ${contents_id})and(time_vers = (select max(time_vers) from themes where theme_id= ${contents_id}))`);
	const [[thema]] = await pool.query(`SELECT * FROM content WHERE id = ${contents_id}`);
	
	if (contents==undefined)
	{
		await pool.query(`INSERT INTO themes (theme_id, text, time_vers) VALUES (${contents_id}, "Введите содержимое темы", now())`);

		[[contents]] = await pool.query('SELECT * FROM themes WHERE theme_id = ? ', contents_id);

	}
	res.send(`<!DOCTYPE html>
	<html>
	<head>
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
	<style >
	h1 {
		margin-left: 30px;
		margin-bottom: 20px;
	}
	textarea {
		border: 1px solid #a7d7f9;
		padding-top: 8px;
		margin-left: 10px;
	}
	h6 {
		margin-left: 10px;
		margin-bottom: 0%;
	}
	a {
		color: #221fde; 
		text-decoration: none; 
	   }
	a:visited {
		color: #500c7a; 
	   }  
	a:hover {
		text-decoration: underline;
	   } 
	</style>
	</head>
		<body style="background-color: #faf9e1">
		<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
		<h1>Редактирование содержимого темы ${thema.num_theme} ${thema.theme} <form method="post" action="/contents/${contents_id}/remove"></form></h1>
		<h6><a style="color: #221fde; padding-top: 1.25em;  padding-left: 8px;padding-right: 8px;cursor: pointer; background-image: linear-gradient(to bottom,rgba(167,215,249,0) 0,#a7d7f9 100%); background-repeat: no-repeat;background-repeat-x: no-repeat;background-repeat-y: no-repeat; background-size: 1px 100%;" href="/">Содержание</a><a style=" #221fde; padding-top: 1.25em;  padding-left: 8px;padding-right: 8px;cursor: pointer; background-image: linear-gradient(to bottom,rgba(167,215,249,0) 0,#a7d7f9 100%); background-repeat: no-repeat;background-repeat-x: no-repeat;background-repeat-y: no-repeat; background-size: 1px 100%;"></a></h6>
		<form method="post" action="/contents/${contents_id}">
		<div class="mb-3">	
			<textarea class="form-control" id="exampleFormControlTextarea1" rows="25" type="text" name="text"  >${contents.text}</textarea>
			<textarea class="form-control" id="exampleFormControlTextarea2" rows="4" type="text" name="comment" > ${contents.comment}</textarea>
			</div>	
			<button type="submit">Сохранить</button>
		</form>
		</body>
	</html>`);
});

//////////////поиск///////////////////////////////
app.get('/search', async function(req, res) {
	const thema_query = req.query.thema_query || '';
	const [themes] = await pool.query(`SELECT *
		FROM themes
		WHERE themes.text LIKE ?
	`,'%' + thema_query + '%');

	res.send(`<!DOCTYPE html>
	<html>
	<head>
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
	<script src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML"></script>
	<style >
	h1 {
		margin-left: 30px;
		margin-bottom: 20px;
	}
	ul {
		border: 1px solid #a7d7f9;
		padding-top: 8px;
		margin-left: 10px;
	}
	h6 {
		margin-left: 10px;
		margin-bottom: 0%;
	}
	p {
		text-align:right;
		margin-bottom: 0%;
		margin-right: 2%;
	}
	a {
		color: #221fde; 
		text-decoration: none; 
	   }
	a:visited {
		color: #500c7a; 
	   }  
	a:hover {
		text-decoration: underline;
	   }
	</style>
	</head>
		<body style="background-color: #faf9e1">
		<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
		<h1>Поиск</h1>	
		<h6><a style="color: #221fde; padding-top: 1.25em;  padding-left: 8px;padding-right: 8px;cursor: pointer; background-image: linear-gradient(to bottom,rgba(167,215,249,0) 0,#a7d7f9 100%); background-repeat: no-repeat;background-repeat-x: no-repeat;background-repeat-y: no-repeat; background-size: 1px 100%;" href="/">Содержание</a> <span style="padding-top: 1.25em;  padding-left: 8px;padding-right: 8px;cursor: pointer; background-image: linear-gradient(to bottom,rgba(167,215,249,0) 0,#a7d7f9 100%); background-repeat: no-repeat;background-repeat-x: no-repeat;background-repeat-y: no-repeat; background-size: 1px 100%;">Поиск</span><span <a style="color: #221fde; padding-top: 1.25em;  padding-left: 8px;padding-right: 8px;cursor: pointer; background-image: linear-gradient(to bottom,rgba(167,215,249,0) 0,#a7d7f9 100%); background-repeat: no-repeat;background-repeat-x: no-repeat;background-repeat-y: no-repeat; background-size: 1px 100%;"></span></h6>
			<ul>
			<form method="get" action="/search">
			<input type="text" name="thema_query" placeholder="Поисковой запрос" value="${thema_query ? thema_query : ''}"/>
			<button type="submit">Применить</button>
		    </form>
			${themes.map(contents => `<div> ${textmodify(contents.text,thema_query)}${contents.time_vers}</div>`).join('')}
			</ul>
			</body>
	</html>`);

});

function textmodify (text,sub)
{
	const pos_start = text.indexOf(sub);
	const pos_end = pos_start + sub.length + 40;
	const tmp1 = insert(text,'<span style="background-color: #B0C4DE">',pos_start);
	const result = insert(tmp1,'</span>',pos_end); 
	return result;
}

function insert(str, substr, pos) {
	var array = str.split('');
	array.splice(pos, 0, substr);
	return array.join('');
  }
/////////версии темы/////////
app.get('/thema_vers/:theme_id', async function(req, res) {
	const { theme_id } = req.params;
	const [themes] = await pool.query(`SELECT * FROM themes WHERE (theme_id = ${theme_id})`);
	const [[thema]] = await pool.query(`SELECT * FROM content WHERE id = ${theme_id}`)

	res.send(`<!DOCTYPE html>
	<html>
	<head>
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
	<script src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML"></script>
	<style >
	h1 {
		margin-left: 30px;
		margin-bottom: 20px;
	}
	ul {
		border: 1px solid #a7d7f9;
		padding-top: 8px;
		margin-left: 10px;
	}
	h6 {
		margin-left: 10px;
		margin-bottom: 0%;
	}
	a {
		color: #221fde; 
		text-decoration: none; 
	   }
	a:visited {
		color: #500c7a; 
	   }  
	a:hover {
		text-decoration: underline;
	   }    
	span {
		padding-top: 1.25em;  
		padding-left: 8px;
		padding-right: 8px;
		cursor: pointer; 
		background-image: linear-gradient(to bottom,rgba(167,215,249,0) 0,#a7d7f9 100%); 
		background-repeat: no-repeat;
		background-repeat-x: no-repeat;
		background-repeat-y: no-repeat; 
		background-size: 1px 100%;
	}
	</style>
	</head>
		<body style="background-color: #faf9e1">
		<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
		<h1>Тема:${thema.num_theme} ${thema.theme} </h1>
			<h6><span><a style="color: #221fde" href="/">Содержание</a></span> <span><a style="color: #221fde" href="/thema_vers/${theme_id}">Версии страницы</a></span><span></span></h6>
			
			<ul class="themes">
			${themes.map(contents => `<div><a href="/content-thema/${thema.id}?time=${Date.parse(contents.time_vers)}">${contents.time_vers} </a>${contents.comment} </div>`).join('')}
			</ul>
			
			</body>
	</html>`);
});	


app.listen(80,function() {      //запуск сервера
	console.log('server started');
});
