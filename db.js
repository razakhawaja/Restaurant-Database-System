var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');
var path = require('path');
app.use('/static',express.static(path.join(__dirname+ '/SQL')));
app.use(bodyParser.urlencoded({ extended: true })); 

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "hassan",
  database : 'resturant'
});

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/outermain.html'));
});

app.get('/insert',function(req,res){
  res.sendFile(path.join(__dirname+'/main.html'));
});

app.get('/delete',function(req,res){
  res.sendFile(path.join(__dirname+'/del.html'));
});

app.get('/update',function(req,res){
  res.sendFile(path.join(__dirname+'/upd.html'));
});

app.get('/eform',function(req,res){
	res.sendFile(path.join(__dirname+'/empl.html'));
})

app.get('/cform',function(req,res){
	res.sendFile(path.join(__dirname+'/customer.html'));
})

app.get('/oform',function(req,res){
	res.sendFile(path.join(__dirname+'/orders.html'));
})

app.get('/mform',function(req,res){
	res.sendFile(path.join(__dirname+'/member.html'));
})

app.get('/odform',function(req,res){
	res.sendFile(path.join(__dirname+'/orderdetails.html'));
})

app.get('/menuform',function(req,res){
	res.sendFile(path.join(__dirname+'/menu.html'));
})

app.get('/iform',function(req,res){
	res.sendFile(path.join(__dirname+'/inventory.html'));
})

app.get('/succ',function(req,res){
	res.sendFile(path.join(__dirname+'/sucess.html'));
})

app.get('/fail',function(req,res){
	res.sendFile(path.join(__dirname+'/fail.html'));
})

app.get('/out',function(req,res){
	res.sendFile(path.join(__dirname+'/out.html'));
})

app.get('/stat',function(req,res){
	res.sendFile(path.join(__dirname+'/s_queries.html'));
})

app.get('/dyn',function(req,res){
	res.sendFile(path.join(__dirname+'/d_queries.html'));
})

// ==================INSERTIION ================
app.post('/esub', function(req, res){
	post = {employee_id: parseInt(req.body.ID,10), name: req.body.Name, contact: parseInt(req.body.Contact,10), address: req.body.Addr, job: req.body.Job };
	con.query("INSERT INTO employee SET ?", post,function(err, result)      
{           

  if (err)
     {
     	console.log(err);

     	return res.redirect('/fail');
     }
 else
 	{
 		return res.redirect('/succ');
 	}

});
});

app.post('/csub', function(req, res){
	post = {customer_id: parseInt(req.body.ID,10), 
			name: req.body.Name,
			contact1: parseInt(req.body.Contact1,10),
			contact2: parseInt(req.body.Contact2,10),
			membership: req.body.Membership };
	con.query("INSERT INTO customer SET ?", post,function(err, result)      
{           

  if (err)
     {
     	console.log(err);
     	return res.redirect('/fail');
     }
 else
 	{
 		return res.redirect('/succ');
 	}

});
});

app.post('/isub', function(req, res){
	post = {item_id: parseInt(req.body.ID,10), item_name: req.body.Name, stock: parseInt(req.body.Contact1) };
	con.query("INSERT INTO inventory SET ?", post,function(err, result)      
{           

  if (err)
     {
     	console.log(err);

     	return res.redirect('/fail');
     }
 else
 	{
 		return res.redirect('/succ');
 	}

});
});

app.post('/msub', function(req, res){
	post = { packages: req.body.orderid, discount: parseInt(req.body.itemid)};
	con.query("INSERT INTO memberships SET ?", post,function(err, result)      
{           

  if (err)
     {
     	console.log(err);
     	return res.redirect('/fail');
     }
 else
 	{
 		return res.redirect('/succ');
 	}

});
});

app.post('/menusub', function(req, res){
	post = { item_id: parseInt(req.body.ID,10), item_name: req.body.Name, price: parseInt(req.body.Contact1)};
	con.query("INSERT INTO menu SET ?", post,function(err, result)      
{           

  if (err)
     {
     	console.log(err);

     	return res.redirect('/fail');
     }
 else
 	{
 		return res.redirect('/succ');
 	}

});
});

app.post('/osub', function(req, res){
	post = { order_id: parseInt(req.body.ID,10), employee_id: parseInt(req.body.Name), customer_id: parseInt(req.body.Contact1),total_bill: 0};
	con.query("INSERT INTO orders SET ?", post,function(err, result)      
{           

  if (err)
     {
     	console.log(err);

     	return res.redirect('/fail');
     }
 else
 	{
 		return res.redirect('/succ');
 	}

});
});

app.post('/odsub', function(req, res){
	var sql = "SELECT stock from inventory WHERE item_id = ?";
	con.query(sql,parseInt(req.body.itemid), function(err,result) {
		console.log(result[0].stock);
		if ((result[0].stock-parseInt(req.body.quantity))<0) {
			return res.redirect('/out');
		}
		else {
			con.query("UPDATE inventory SET stock = ? WHERE item_id = ?",[result[0].stock-parseInt(req.body.quantity),parseInt(req.body.itemid)],function(err,result) {
				if (result) {
					console.log("Stock Updated");
					post = { order_id: parseInt(req.body.orderid,10), item_id: parseInt(req.body.itemid), quantity: parseInt(req.body.quantity)};
					var sql_price = "SELECT price from menu WHERE item_id = ?";
					con.query(sql_price,parseInt(req.body.itemid), function(err,result) {
						var pr = result[0].price;
						var quant = parseInt(req.body.quantity);
						con.query("SELECT customer_id, total_bill from orders WHERE order_id = ?", parseInt(req.body.orderid,10), function(err,result) {
							var curr_bil = result[0].total_bill;
							var cust_id = result[0].customer_id;
							con.query("SELECT membership from customer WHERE customer_id = ?",cust_id, function(err,result) {
								var memb = result[0].membership;
								con.query("SELECT discount from memberships WHERE packages = ?",memb,function(err,result){
									var disc = 1 - result[0].discount/100;
									var new_bill = curr_bil + ((pr*quant)*disc);
									con.query("UPDATE orders SET total_bill = ? WHERE order_id = ?",[new_bill,parseInt(req.body.orderid,10)],function(err,result) {
										if (result) {
											console.log("NEW BILL UPDATED");
										}
									});
								})
							});
						});

					});
					con.query("INSERT INTO order_details SET ?", post,function(err, result)      
					{           

					  if (err)
					     {
					     	console.log(err);

					     	return res.redirect('/fail');
					     }
					 else
					 	{
					 		return res.redirect('/succ');
					 	}

					});
				}
			});
		}
	});
});
// ===========================================================
  
app.get('/edelform',function(req,res){
	res.sendFile(path.join(__dirname+'/empldel.html'));
})

app.get('/cdelform',function(req,res){
	res.sendFile(path.join(__dirname+'/customerdel.html'));
})

app.get('/odelform',function(req,res){
	res.sendFile(path.join(__dirname+'/ordersdel.html'));
})

app.get('/mdelform',function(req,res){
	res.sendFile(path.join(__dirname+'/memberdel.html'));
})

app.get('/oddelform',function(req,res){
	res.sendFile(path.join(__dirname+'/orderdetailsdel.html'));
})

app.get('/menudelform',function(req,res){
	res.sendFile(path.join(__dirname+'/menudel.html'));
})

app.get('/idelform',function(req,res){
	res.sendFile(path.join(__dirname+'/inventorydel.html'));
})



function length(obj) {
    return Object.keys(obj).length;
}

function parse_any(data,key) {
	if (key == 'customer_id' || key == 'contact1' || key == 'contact2' || key == 'employee_id' || key == 'contact' || key == 'order_id' ||  key == 'item_id' || key == 'quantity' || key == 'price' || key == 'stock' ||  key == 'discount') {
		return parseInt(data[key]);
	}
	return data[key];
}


app.post('/edel', function(req, res){
	var arr = [];
	var data = req.body;
	var num = length(data)-1;
	var ind = 0;
	var vals = [];

	for (var key in data) {
		if (key != 'Submit') {
			if (data[key] != "") {
				arr.push(key);
			}
		}
	}

	if (!arr.length) 
	{
		sql = "DELETE FROM employee";
		con.query(sql, function(err,result) 
		{
		if (err)
     	{
     		console.log(err);
     		return res.redirect('/fail');
     	}
 		else
 		{
 			return res.redirect('/succ');
 		}

		});
	}
	else {
		sql = "DELETE FROM employee WHERE "
		for (i=0;i<arr.length;i++) {
			if (!i) {
				sql = sql + arr[i] + " = ?";
			}
			else {
				sql = sql + " AND " + arr[i] + " = ?";
			}
			vals.push(parse_any(data,arr[i]));
		}
		con.query(sql,vals,function(err,result) {
			if (err)
     	{
     		console.log(err);
     		return res.redirect('/fail');
     	}
 		else
 		{
 			return res.redirect('/succ');
 		}

		});
	}

	
	
});

app.post('/cdel', function(req, res){
	var arr = [];
	var data = req.body;
	var num = length(data)-1;
	var ind = 0;
	var vals = [];

	for (var key in data) {
		if (key != 'Submit') {
			if (data[key] != "") {
				arr.push(key);
			}
		}
	}

	if (!arr.length) 
	{
		sql = "DELETE FROM customer";
		con.query(sql, function(err,result) 
		{
		if (err)
     	{
     		console.log(err);
     		return res.redirect('/fail');
     	}
 		else
 		{
 			return res.redirect('/succ');
 		}

		});
	}
	else {
		sql = "DELETE FROM customer WHERE "
		for (i=0;i<arr.length;i++) {
			if (!i) {
				sql = sql + arr[i] + " = ?";
			}
			else {
				sql = sql + " AND " + arr[i] + " = ?";
			}
			vals.push(parse_any(data,arr[i]));
		}
		con.query(sql,vals,function(err,result) {
			if (err)
     	{
     		console.log(err);
     		return res.redirect('/fail');
     	}
 		else
 		{
 			return res.redirect('/succ');
 		}

		});
	}

	
	
});

app.post('/odel', function(req, res){
	var arr = [];
	var data = req.body;
	var num = length(data)-1;
	var ind = 0;
	var vals = [];

	for (var key in data) {
		if (key != 'Submit') {
			if (data[key] != "") {
				arr.push(key);
			}
		}
	}

	if (!arr.length) 
	{
		sql = "DELETE FROM orders";
		con.query(sql, function(err,result) 
		{
		if (err)
     	{
     		console.log(err);
     		return res.redirect('/fail');
     	}
 		else
 		{
 			return res.redirect('/succ');
 		}

		});
	}
	else {
		sql = "DELETE FROM orders WHERE "
		for (i=0;i<arr.length;i++) {
			if (!i) {
				sql = sql + arr[i] + " = ?";
			}
			else {
				sql = sql + " AND " + arr[i] + " = ?";
			}
			vals.push(parse_any(data,arr[i]));
		}
		con.query(sql,vals,function(err,result) {
			if (err)
     	{
     		console.log(err);
     		return res.redirect('/fail');
     	}
 		else
 		{
 			return res.redirect('/succ');
 		}

		});
	}

	
	
});

app.post('/oddel', function(req, res){
	var arr = [];
	var data = req.body;
	var num = length(data)-1;
	var ind = 0;
	var vals = [];

	for (var key in data) {
		if (key != 'Submit') {
			if (data[key] != "") {
				arr.push(key);
			}
		}
	}

	if (!arr.length) 
	{
		sql = "DELETE FROM order_details";
		con.query(sql, function(err,result) 
		{
		if (err)
     	{
     		console.log(err);
     		return res.redirect('/fail');
     	}
 		else
 		{
 			return res.redirect('/succ');
 		}

		});
	}
	else {
		sql = "DELETE FROM order_details WHERE "
		for (i=0;i<arr.length;i++) {
			if (!i) {
				sql = sql + arr[i] + " = ?";
			}
			else {
				sql = sql + " AND " + arr[i] + " = ?";
			}
			vals.push(parse_any(data,arr[i]));
		}
		con.query(sql,vals,function(err,result) {
			if (err)
     	{
     		console.log(err);
     		return res.redirect('/fail');
     	}
 		else
 		{
 			return res.redirect('/succ');
 		}

		});
	}

	
	
});

app.post('/menudel', function(req, res){
	var sql = "DELETE FROM menu WHERE ";
	var arr = [];
	var data = req.body;
	var num = length(data)-1;
	var ind = 0;
	var vals = [];

	for (var key in data) {
		if (key != 'Submit') {
			if (data[key] != "") {
				arr.push(key);
			}
		}
	}

	if (!arr.length) 
	{
		sql = "DELETE FROM menu";
		con.query(sql, function(err,result) 
		{
		if (err)
     	{
     		console.log(err);
     		return res.redirect('/fail');
     	}
 		else
 		{
 			return res.redirect('/succ');
 		}

		});
	}
	else {
		sql = "DELETE FROM menu WHERE "
		for (i=0;i<arr.length;i++) {
			if (!i) {
				sql = sql + arr[i] + " = ?";
			}
			else {
				sql = sql + " AND " + arr[i] + " = ?";
			}
			vals.push(parse_any(data,arr[i]));
		}
		con.query(sql,vals,function(err,result) {
			if (err)
     	{
     		console.log(err);
     		return res.redirect('/fail');
     	}
 		else
 		{
 			return res.redirect('/succ');
 		}

		});
	}

	
	
});

app.post('/mdel', function(req, res){
	var arr = [];
	var data = req.body;
	var num = length(data)-1;
	var ind = 0;
	var vals = [];

	for (var key in data) {
		if (key != 'Submit') {
			if (data[key] != "") {
				arr.push(key);
			}
		}
	}

	if (!arr.length) 
	{
		sql = "DELETE FROM memberships";
		con.query(sql, function(err,result) 
		{
		if (err)
     	{
     		console.log(err);
     		return res.redirect('/fail');
     	}
 		else
 		{
 			return res.redirect('/succ');
 		}

		});
	}
	else {
		sql = "DELETE FROM memberships WHERE "
		for (i=0;i<arr.length;i++) {
			if (!i) {
				sql = sql + arr[i] + " = ?";
			}
			else {
				sql = sql + " AND " + arr[i] + " = ?";
			}
			vals.push(parse_any(data,arr[i]));
		}
		con.query(sql,vals,function(err,result) {
			if (err)
     	{
     		console.log(err);
     		return res.redirect('/fail');
     	}
 		else
 		{
 			return res.redirect('/succ');
 		}

		});
	}

	
	
});

app.post('/idel', function(req, res){
	var arr = [];
	var data = req.body;
	var num = length(data)-1;
	var ind = 0;
	var vals = [];

	for (var key in data) {
		if (key != 'Submit') {
			if (data[key] != "") {
				arr.push(key);
			}
		}
	}

	if (!arr.length) 
	{
		sql = "DELETE FROM inventory";
		con.query(sql, function(err,result) 
		{
		if (err)
     	{
     		console.log(err);
     		return res.redirect('/fail');
     	}
 		else
 		{
 			return res.redirect('/succ');
 		}

		});
	}
	else {
		sql = "DELETE FROM inventory WHERE "
		for (i=0;i<arr.length;i++) {
			if (!i) {
				sql = sql + arr[i] + " = ?";
			}
			else {
				sql = sql + " AND " + arr[i] + " = ?";
			}
			vals.push(parse_any(data,arr[i]));
		}
		con.query(sql,vals,function(err,result) {
			if (err)
     	{
     		console.log(err);
     		return res.redirect('/fail');
     	}
 		else
 		{
 			return res.redirect('/succ');
 		}

		});
	}

	
	
});

app.get('/eupdform',function(req,res){
	res.sendFile(path.join(__dirname+'/emplupd.html'));
})

app.get('/cupdform',function(req,res){
	res.sendFile(path.join(__dirname+'/customerupd.html'));
})

app.get('/oupdform',function(req,res){
	res.sendFile(path.join(__dirname+'/ordersupd.html'));
})

app.get('/mupdform',function(req,res){
	res.sendFile(path.join(__dirname+'/memberupd.html'));
})

app.get('/odupdform',function(req,res){
	res.sendFile(path.join(__dirname+'/orderdetailsupd.html'));
})

app.get('/menuupdform',function(req,res){
	res.sendFile(path.join(__dirname+'/menuupd.html'));
})

app.get('/iupdform',function(req,res){
	res.sendFile(path.join(__dirname+'/inventoryupd.html'));
})

app.post('/eupd', function(req, res){
	var arr_set = [];
	var arr_wh = [];
	var data = req.body;
	var num = length(data);
	var ind = 0;
	var vals_set = [];

	for (var key in data) {
		if (key != 'Submit') {
			if (data[key] != "") {
				if(key.substr(0,1)=="_") {
					arr_wh.push(key);
				} else {
					arr_set.push(key);
				}
				
			}
		}

	}
	if(!arr_set.length)
		return res.redirect('/succ');

	if(!arr_wh.length)
	{
		sql = "UPDATE employee SET ";
		for (i=0;i<arr_set.length;i++) {
			if (!i) {
				sql = sql + arr_set[i] + " = ?";
			}
			else {
				sql = sql + " AND " + arr_set[i] + " = ?";
			}
			vals_set.push(parse_any(data,arr_set[i]));
		}
			con.query(sql,vals_set, function(err,result) 
		{
		if (err)
     	{
     		console.log(err);
     		return res.redirect('/fail');
     	}
 		else
 		{
 			return res.redirect('/succ');
 		}

		});
	}
	else {
		sql = "UPDATE employee SET ";
		for (i=0;i<arr_set.length;i++) {
			if (!i) {
				sql = sql + arr_set[i] + " = ?";
			}
			else {
				sql = sql + " AND " + arr_set[i] + " = ?";
			}
			vals_set.push(parse_any(data,arr_set[i]));
		}
		
		
		sql = sql + " WHERE ";
		for (i=0;i<arr_wh.length;i++) {
			var temp = arr_wh[i].substr(1);

			if (!i) {
				sql = sql + temp + " = ?";
			}
			else {
				sql = sql + " AND " + temp + " = ?";
			}
			vals_set.push(parse_any(data,arr_wh[i]));
		}
			console.log(sql);
			console.log(vals_set);
			con.query(sql,vals_set, function(err,result) 
		{
		if (err)
     	{
     		console.log(err);
     		return res.redirect('/fail');
     	}
 		else
 		{
 			return res.redirect('/succ');
 		}

		});

	}	
});

app.post('/cupd', function(req, res){
	var arr_set = [];
	var arr_wh = [];
	var data = req.body;
	var num = length(data);
	var ind = 0;
	var vals_set = [];

	for (var key in data) {
		if (key != 'Submit') {
			if (data[key] != "") {
				if(key.substr(0,1)=="_") {
					arr_wh.push(key);
				} else {
					arr_set.push(key);
				}
				
			}
		}

	}
	if(!arr_set.length)
		return res.redirect('/succ');

	if(!arr_wh.length)
	{
		sql = "UPDATE customer SET ";
		for (i=0;i<arr_set.length;i++) {
			if (!i) {
				sql = sql + arr_set[i] + " = ?";
			}
			else {
				sql = sql + " AND " + arr_set[i] + " = ?";
			}
			vals_set.push(parse_any(data,arr_set[i]));
		}
			con.query(sql,vals_set, function(err,result) 
		{
		if (err)
     	{
     		console.log(err);
     		return res.redirect('/fail');
     	}
 		else
 		{
 			return res.redirect('/succ');
 		}

		});
	}
	else {
		sql = "UPDATE customer SET ";
		for (i=0;i<arr_set.length;i++) {
			if (!i) {
				sql = sql + arr_set[i] + " = ?";
			}
			else {
				sql = sql + " AND " + arr_set[i] + " = ?";
			}
			vals_set.push(parse_any(data,arr_set[i]));
		}
		
		
		sql = sql + " WHERE ";
		for (i=0;i<arr_wh.length;i++) {
			var temp = arr_wh[i].substr(1);

			if (!i) {
				sql = sql + temp + " = ?";
			}
			else {
				sql = sql + " AND " + temp + " = ?";
			}
			vals_set.push(parse_any(data,arr_wh[i]));
		}
			console.log(sql);
			console.log(vals_set);
			con.query(sql,vals_set, function(err,result) 
		{
		if (err)
     	{
     		console.log(err);
     		return res.redirect('/fail');
     	}
 		else
 		{
 			return res.redirect('/succ');
 		}

		});

	}	
});

app.post('/iupd', function(req, res){
	var arr_set = [];
	var arr_wh = [];
	var data = req.body;
	var num = length(data);
	var ind = 0;
	var vals_set = [];

	for (var key in data) {
		if (key != 'Submit') {
			if (data[key] != "") {
				if(key.substr(0,1)=="_") {
					arr_wh.push(key);
				} else {
					arr_set.push(key);
				}
				
			}
		}

	}
	if(!arr_set.length)
		return res.redirect('/succ');

	if(!arr_wh.length)
	{
		sql = "UPDATE inventory SET ";
		for (i=0;i<arr_set.length;i++) {
			if (!i) {
				sql = sql + arr_set[i] + " = ?";
			}
			else {
				sql = sql + " AND " + arr_set[i] + " = ?";
			}
			vals_set.push(parse_any(data,arr_set[i]));
		}
			con.query(sql,vals_set, function(err,result) 
		{
		if (err)
     	{
     		console.log(err);
     		return res.redirect('/fail');
     	}
 		else
 		{
 			return res.redirect('/succ');
 		}

		});
	}
	else {
		sql = "UPDATE inventory SET ";
		for (i=0;i<arr_set.length;i++) {
			if (!i) {
				sql = sql + arr_set[i] + " = ?";
			}
			else {
				sql = sql + " AND " + arr_set[i] + " = ?";
			}
			vals_set.push(parse_any(data,arr_set[i]));
		}
		
		
		sql = sql + " WHERE ";
		for (i=0;i<arr_wh.length;i++) {
			var temp = arr_wh[i].substr(1);

			if (!i) {
				sql = sql + temp + " = ?";
			}
			else {
				sql = sql + " AND " + temp + " = ?";
			}
			vals_set.push(parse_any(data,arr_wh[i]));
		}
			console.log(sql);
			console.log(vals_set);
			con.query(sql,vals_set, function(err,result) 
		{
		if (err)
     	{
     		console.log(err);
     		return res.redirect('/fail');
     	}
 		else
 		{
 			return res.redirect('/succ');
 		}

		});

	}	
});

app.post('/mupd', function(req, res){
	var arr_set = [];
	var arr_wh = [];
	var data = req.body;
	var num = length(data);
	var ind = 0;
	var vals_set = [];

	for (var key in data) {
		if (key != 'Submit') {
			if (data[key] != "") {
				if(key.substr(0,1)=="_") {
					arr_wh.push(key);
				} else {
					arr_set.push(key);
				}
				
			}
		}

	}

	if(!arr_set.length)
		return res.redirect('/succ');
	if(!arr_wh.length)
	{
		sql = "UPDATE memberships SET ";
		for (i=0;i<arr_set.length;i++) {
			if (!i) {
				sql = sql + arr_set[i] + " = ?";
			}
			else {
				sql = sql + " AND " + arr_set[i] + " = ?";
			}
			vals_set.push(parse_any(data,arr_set[i]));
		}
			con.query(sql,vals_set, function(err,result) 
		{
		if (err)
     	{
     		console.log(err);
     		return res.redirect('/fail');
     	}
 		else
 		{
 			return res.redirect('/succ');
 		}

		});
	}
	else {
		sql = "UPDATE memberships SET ";
		for (i=0;i<arr_set.length;i++) {
			if (!i) {
				sql = sql + arr_set[i] + " = ?";
			}
			else {
				sql = sql + " AND " + arr_set[i] + " = ?";
			}
			vals_set.push(parse_any(data,arr_set[i]));
		}
		
		
		sql = sql + " WHERE ";
		for (i=0;i<arr_wh.length;i++) {
			var temp = arr_wh[i].substr(1);

			if (!i) {
				sql = sql + temp + " = ?";
			}
			else {
				sql = sql + " AND " + temp + " = ?";
			}
			vals_set.push(parse_any(data,arr_wh[i]));
		}
			console.log(sql);
			console.log(vals_set);
			con.query(sql,vals_set, function(err,result) 
		{
		if (err)
     	{
     		console.log(err);
     		return res.redirect('/fail');
     	}
 		else
 		{
 			return res.redirect('/succ');
 		}

		});

	}	
});

app.post('/menuupd', function(req, res){
	var arr_set = [];
	var arr_wh = [];
	var data = req.body;
	var num = length(data);
	var ind = 0;
	var vals_set = [];

	for (var key in data) {
		if (key != 'Submit') {
			if (data[key] != "") {
				if(key.substr(0,1)=="_") {
					arr_wh.push(key);
				} else {
					arr_set.push(key);
				}
				
			}
		}

	}

if(!arr_set.length)
		return res.redirect('/succ');
	if(!arr_wh.length)
	{
		sql = "UPDATE menu SET ";
		for (i=0;i<arr_set.length;i++) {
			if (!i) {
				sql = sql + arr_set[i] + " = ?";
			}
			else {
				sql = sql + " AND " + arr_set[i] + " = ?";
			}
			vals_set.push(parse_any(data,arr_set[i]));
		}
			con.query(sql,vals_set, function(err,result) 
		{
		if (err)
     	{
     		console.log(err);
     		return res.redirect('/fail');
     	}
 		else
 		{
 			return res.redirect('/succ');
 		}

		});
	}
	else {
		sql = "UPDATE menu SET ";
		for (i=0;i<arr_set.length;i++) {
			if (!i) {
				sql = sql + arr_set[i] + " = ?";
			}
			else {
				sql = sql + " AND " + arr_set[i] + " = ?";
			}
			vals_set.push(parse_any(data,arr_set[i]));
		}
		
		
		sql = sql + " WHERE ";
		for (i=0;i<arr_wh.length;i++) {
			var temp = arr_wh[i].substr(1);

			if (!i) {
				sql = sql + temp + " = ?";
			}
			else {
				sql = sql + " AND " + temp + " = ?";
			}
			vals_set.push(parse_any(data,arr_wh[i]));
		}
			console.log(sql);
			console.log(vals_set);
			con.query(sql,vals_set, function(err,result) 
		{
		if (err)
     	{
     		console.log(err);
     		return res.redirect('/fail');
     	}
 		else
 		{
 			return res.redirect('/succ');
 		}

		});

	}	
});

app.post('/odupd', function(req, res){
	var arr_set = [];
	var arr_wh = [];
	var data = req.body;
	var num = length(data);
	var ind = 0;
	var vals_set = [];

	for (var key in data) {
		if (key != 'Submit') {
			if (data[key] != "") {
				if(key.substr(0,1)=="_") {
					arr_wh.push(key);
				} else {
					arr_set.push(key);
				}
				
			}
		}

	}

	if(!arr_set.length)
		return res.redirect('/succ');

	if(!arr_wh.length)
	{
		sql = "UPDATE order_details SET ";
		for (i=0;i<arr_set.length;i++) {
			if (!i) {
				sql = sql + arr_set[i] + " = ?";
			}
			else {
				sql = sql + " AND " + arr_set[i] + " = ?";
			}
			vals_set.push(parse_any(data,arr_set[i]));
		}
			con.query(sql,vals_set, function(err,result) 
		{
		if (err)
     	{
     		console.log(err);
     		return res.redirect('/fail');
     	}
 		else
 		{
 			return res.redirect('/succ');
 		}

		});
	}
	else {
		sql = "UPDATE order_details SET ";
		for (i=0;i<arr_set.length;i++) {
			if (!i) {
				sql = sql + arr_set[i] + " = ?";
			}
			else {
				sql = sql + " AND " + arr_set[i] + " = ?";
			}
			vals_set.push(parse_any(data,arr_set[i]));
		}
		
		
		sql = sql + " WHERE ";
		for (i=0;i<arr_wh.length;i++) {
			var temp = arr_wh[i].substr(1);

			if (!i) {
				sql = sql + temp + " = ?";
			}
			else {
				sql = sql + " AND " + temp + " = ?";
			}
			vals_set.push(parse_any(data,arr_wh[i]));
		}
			console.log(sql);
			console.log(vals_set);
			con.query(sql,vals_set, function(err,result) 
		{
		if (err)
     	{
     		console.log(err);
     		return res.redirect('/fail');
     	}
 		else
 		{
 			return res.redirect('/succ');
 		}

		});

	}	
});

app.post('/oupd', function(req, res){
	var arr_set = [];
	var arr_wh = [];
	var data = req.body;
	var num = length(data);
	var ind = 0;
	var vals_set = [];

	for (var key in data) {
		if (key != 'Submit') {
			if (data[key] != "") {
				if(key.substr(0,1)=="_") {
					arr_wh.push(key);
				} else {
					arr_set.push(key);
				}
				
			}
		}

	}

	if(!arr_set.length)
		return res.redirect('/succ');

	if(!arr_wh.length)
	{
		sql = "UPDATE orders SET ";
		for (i=0;i<arr_set.length;i++) {
			if (!i) {
				sql = sql + arr_set[i] + " = ?";
			}
			else {
				sql = sql + " AND " + arr_set[i] + " = ?";
			}
			vals_set.push(parse_any(data,arr_set[i]));
		}
			con.query(sql,vals_set, function(err,result) 
		{
		if (err)
     	{
     		console.log(err);
     		return res.redirect('/fail');
     	}
 		else
 		{
 			return res.redirect('/succ');
 		}

		});
	}
	else {
		sql = "UPDATE orders SET ";
		for (i=0;i<arr_set.length;i++) {
			if (!i) {
				sql = sql + arr_set[i] + " = ?";
			}
			else {
				sql = sql + " AND " + arr_set[i] + " = ?";
			}
			vals_set.push(parse_any(data,arr_set[i]));
		}
		
		
		sql = sql + " WHERE ";
		for (i=0;i<arr_wh.length;i++) {
			var temp = arr_wh[i].substr(1);

			if (!i) {
				sql = sql + temp + " = ?";
			}
			else {
				sql = sql + " AND " + temp + " = ?";
			}
			vals_set.push(parse_any(data,arr_wh[i]));
		}
			console.log(sql);
			console.log(vals_set);
			con.query(sql,vals_set, function(err,result) 
		{
		if (err)
     	{
     		console.log(err);
     		return res.redirect('/fail');
     	}
 		else
 		{
 			return res.redirect('/succ');
 		}

		});

	}	
});

// STATIC QUERIES

app.get('/sq1',function(req,res) {
	var max1;
	var max_id;
	var max_name;
	con.query("SELECT MAX(sq.quantity) as max FROM (SELECT item_id, SUM(quantity) AS quantity FROM order_details GROUP BY item_id) AS sq;",function(err,result) {
		max1 = result[0].max
		con.query("SELECT sq.item_id FROM (SELECT item_id, SUM(quantity) AS quantity FROM order_details GROUP BY item_id) AS sq WHERE sq.quantity = ?",max1,function(err,result) {
			max_id = result[0].item_id;
			con.query("SELECT item_name FROM menu WHERE item_id = ?",max_id,function(err,result) {
				max_name = result[0].item_name;
				res.send("Item purchased the most was: " + max_name);
			})
		})
	})
})

app.get('/sq2',function(req,res) {
	var wait_id;
	var wait_max;
	con.query("SELECT employee_id,COUNT(employee_id) AS waiter FROM orders GROUP BY employee_id ORDER BY waiter DESC LIMIT 1;", function(err,result){
		wait_id = result[0].employee_id
		con.query("SELECT name from employee WHERE employee_id = ?",wait_id,function(err,result) {
			wait_max = result[0].name;
			res.send("Waiter who took max orders: " +wait_max);
		})
	})
	
})


app.get('/sq3', function(req, res){
	con.query("SELECT SUM(total_bill) AS revenue FROM orders", function(err, result){
		res.status(200).send("Total Revenue for current day: " +(result[0].revenue).toString());
	})
})

app.get('/sq4', function(req, res){
	con.query("create temporary table temp as select customer_id from orders;",function(err, result){
		con.query("select count(*) AS total from temp", function(err1,result1){
			con.query("drop table temp;", function(err2, result2){
				res.status(200).send("Number of customers who showed up on current day: " + (result1[0].total).toString());
			})
				
		})
	})
	
})

app.get('/sq5', function(req, res){
	var cust_id;
	var cust_max;
	con.query("SELECT customer_id,COUNT(customer_id) AS cust FROM orders GROUP BY customer_id ORDER BY cust DESC LIMIT 1;", function(err,result){
		cust_id = result[0].customer_id
		con.query("SELECT * FROM customer WHERE customer_id = ? ", cust_id, function(err1, result1){
			//res.status(200).send( (result1[0]));
			res.writeHead(200, { 'Content-Type': 'text/html' });
			res.write("Customer ID: " +result1[0].customer_id + '</br>' + 
				"Customer Name: " + result1[0].name + '</br>' + 
				"Contact 1: " + result1[0].contact1 + '</br>' +
				"Contact 2: " + result1[0].contact2 + '</br>' +
				"Membership: " + result1[0].membership
				);
			res.end('');
		})
	})

})

app.get('/dq1form',function(req,res){
	res.sendFile(path.join(__dirname+'/dq1form.html'));
})

app.get('/dq2form',function(req,res){
	res.sendFile(path.join(__dirname+'/dq2form.html'));
})

app.get('/dq3form',function(req,res){
	res.sendFile(path.join(__dirname+'/dq3form.html'));
})

app.get('/dq4form',function(req,res){
	res.sendFile(path.join(__dirname+'/dq4form.html'));
})

app.get('/dq5form',function(req,res){
	res.sendFile(path.join(__dirname+'/dq5form.html'));
})

app.post('/dq1', function(req, res){
	con.query("create temporary table temp as select order_id from orders WHERE customer_id = ?", parseInt(req.body.ID), function(err, result){
		con.query("SELECT order_details.order_id, order_details.item_id, order_details.quantity FROM order_details JOIN temp ON order_details.order_id=temp.order_id", function(err,result) {
			res.writeHead(200, { 'Content-Type': 'text/html' });
			for (var i = result.length - 1; i >= 0; i--) {
				res.write("order_id : " + result[i].order_id + " item_id : " + result[i].item_id + " quantity: " + result[i].quantity + "</br>");
			}
			res.end("");
		})
		con.query("drop table temp;",function(err,result) {
			if (result) {
				console.log("DROPPED")
			}
		});
	})
})

app.post('/dq2', function(req, res){
	var i_d = parseInt(req.body.ID);
	con.query("create temporary table temp as select item_id from order_details WHERE order_id = ?",i_d,function(err,result) {
		con.query("SELECT menu.item_name, menu.price FROM menu JOIN temp ON menu.item_id=temp.item_id", function(err,result) {
			res.writeHead(200, { 'Content-Type': 'text/html' });
			for (i=0;i<length(result);i++)
			{
				res.write(result[i].item_name + "  " + result[i].price + '</br>');
			}
			res.end('____');
		})
		con.query("drop table temp;",function(err,result) {
			if (result)
				console.log("TABLE DROPPED");

		})
	})
})

app.post('/dq3', function(req, res) {
	var i_d = parseInt(req.body.ID);
	var b = 0;
	con.query("SELECT item_id FROM inventory WHERE stock < 10;",function(err,result){
		for (var i = result.length - 1; i >= 0; i--) {
			if (result[i].item_id == i_d) {
				b = 1;
			}
		}
		if (b) {
			res.send("NEEDS TO BE REORDERED");
		} else {
			res.send("NO NEED TO REORDER");
		}
	})
})

app.post('/dq4',function(req,res) {
	var s;
	var e;
	s = parseInt(req.body.sprice);
	e = parseInt(req.body.eprice);

	con.query("SELECT item_name FROM menu WHERE price >= ? AND price < ?",[s,e],function(err,result) {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		for (var i = result.length - 1; i >= 0; i--) {
			res.write(result[i].item_name + "</br>");
		}
		res.end("");
	})
})

app.post('/dq5',function(req,res) {
	var cname = parseInt(req.body.cname);
	var iname = parseInt(req.body.iname);
	var i_d;
	con.query("create temporary table temp as SELECT customer_id FROM customer WHERE customer_id = ?",cname,function(err,result) {
		con.query("create temporary table temp1 as SELECT orders.order_id FROM orders JOIN temp ON orders.customer_id=temp.customer_id",function(err,result) {
			con.query("create temporary table temp2 as SELECT odd.order_id, odd.item_id, odd.quantity FROM order_details as odd JOIN temp1 ON odd.order_id=temp1.order_id",function(err,result){
				con.query("SELECT item_id, SUM(quantity) as quantity FROM temp2 GROUP BY item_id HAVING item_id = ?",iname,function(err,result) {
					if (!length(result)) {
						res.send("ITEM WAS NEVER ORDERED");
					} else {
					res.send("ITEM HAS BEEN ORDERED BY THIS CUSTOMER " + result[0].quantity + " times" );					

					}
				})
				con.query("drop table temp2");
			})

			con.query("drop table temp1");
		})
		con.query("drop table temp");
	})
})


app.listen(3000);
console.log("Running at Port 3000");
