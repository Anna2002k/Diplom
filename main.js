const express = require('express');
const mysql2 = require('mysql2/promise');

const pool = mysql2.createPool({  //подкючение БД
	host: 'localhost',
	user: 'root',
	database: 'phone_book',
	password: '',
}); 

const app = express();

app.get('/',function(req,res){
	pool.query('SELECT * FROM abonents').then(function(data) {
		const abonents = data[0];
		res.send(`<!DOCTYPE html>
		<html>
			<body>
				<ul>
					${abonents.map(abonent => `<li>${abonent.name}</li>`).join('')}
				</ul>
			</body>
		</html>`);
	});
});

app.listen(3000,function() {      //запуск сервера
	console.log('server started');
});