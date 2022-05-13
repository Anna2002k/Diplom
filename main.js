const express = require('express');
const mysql2 = require('mysql2/promise');

const pool = mysql2.createPool({  //подкючение БД
	host: 'localhost',
	user: 'root',
	database: 'base_1',
	password: '123451',
}); 

const app = express();

app.get('/',function(req,res){
	pool.query('SELECT * FROM tabl1').then(function(data) {
		const tabl1 = data[0];
		res.send(`<!DOCTYPE html>
		<html>
			<body>
				<ul>
					${tabl1.map(nomber_name => `<li>${nomber_name.name}</li>`).join('')}
				</ul>
			</body>
		</html>`);
	});
});

app.listen(3000,function() {      //запуск сервера
	console.log('server started');
});