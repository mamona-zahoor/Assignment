const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

const port = process.env.PORT || 8081;
//to set a port

let app = express();
app.use(express.json())
app.use(express.urlencoded({extended: false}))
 
//to make sure server is ready, we are logging a message
app.listen(port, () => {
    console.log('Server listening at 8081');
})

const sequelize = new Sequelize('EmpDB', //DB
 'postgres', //username
 'postgrepwrd', //password
 {
    host: 'localhost',//host can be found at CONNECTION tab, from postgreSQL server properties
    dialect:'postgres'
  });
  //used sequelize to make connection to database
  //here, to make this project work with your data base please replace the credentials and DB name
 
 
  const Employee = sequelize.define('employee',{
      id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
      },
      name: {
          type: DataTypes.STRING
      },
      job: {
          type: DataTypes.STRING
      },
      department:{
          type: DataTypes.STRING
      },
      salary:{
          type: DataTypes.FLOAT
      },
      hire_date:{
          type:DataTypes.DATE,
      }
  });
 
  (async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ force: true });
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }  
  })();

  
  app.get('/getById', async function (req, res) {
    let id = req.query['id'];
    if(id == null)
     res.send('Required parameter employee_id is not present');
 
     data = await Employee.findAll({where : {id : id }});
    if(data == null)
        res.send('Employee not found with id ' + id);
    else    
        res.send(JSON.stringify(data));
 
    // fetch from database return
 
});

app.get('/getAllEmployees', async function (req, res) {
     data = await Employee.findAll();
    if(data == null)
        res.send('no emp found.');
    else    
        res.send(JSON.stringify(data));
 
    // fetch from database return
 
});


app.post('/insert', async function (req, res) {
    if(req.query['salary']< 0 ){
        res.send('Salary cannot be negative!');}
    else if(req.query['id'] < 0)
    {
        res.send('Id cannot be negative.');}
    else     
        {let data = Employee.build({
        id: req.query['id'],
        name: req.query['name'],
       department: req.query['department'],
        job: req.query['job'],
        salary: req.query['salary'],
        hire_date: req.query['hire_date']
      });
        await data.save();
        res.send(JSON.stringify('Record added!'));}
});
 
app.put('/updatename', function (req, res) {
    try {
        let id = req.query['id'];
    Employee.update(
        { name: req.query['name'] },
        { where: { id: id } }
      )
      .then (function (result) {
        console.log(result)
      })
      res.send('Updated')
      
        // consume the resolved value
      } catch (e) {
        // exception handling
        console.log(e);
      }
              
    
});
 
app.delete('/delete', function (req, res) {
    res.send('hello world')
});
 
 

