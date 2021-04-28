import express from 'express';
import initializeDatabase from '../db-conn';

const app = express();

// We need this one if we send data inside the body as JSON
app.use(express.json());

async function init() {
  // Call the init function that returns the Database
  const db = await initializeDatabase();
  // Let's extract all the objects we need to perform queries inside the endpoints
  const { Person, Area, Products, Image, Assistance, Features } = db._tables;

  //api to get all the products
  app.get('api/products', async (req, res) => {
    const products = await Product.findAll();
    return res.json(products);    
  });
  //api to get all the people
  app.get('api/people', async (req, res) => {
    const people = await Person.findAll();
    return res.json(people);
  });
  //api to get all the areas
  app.get('api/areas', async (req, res) => {
    const areas = await Area.findAll();
    return res.json(areas);
  });
  // API to get all products by area
  //the parameter :area passed is the id of the area from which we want to retrieve all the products
  app.get('api/products/:area', async (req, res) => {
    const area  = req.params.area;
    const products = await Product.findAll({
      where: {area: area},
    });
    return res.json(products);
  });
  // API to get all people by role
  // the parameter :role passed is the identifier of the role consistent with the representation in the db
  // => 0: area rep, 1: proj manager, 2: ref assistant
  app.get('api/:role', async (req, res) => {
    const role = req.params.role;
    const people = await Person.findAll({
      where: {role: role},
    });
    return res.json(people);
  });
  // api to get all the roles of a person
  // return an object containing 3 elements: only 1 of them is not null (because each person can have only 1 role)
  app.get('api/roles/:person', async (req, res) => {
    const person = req.params.person;
    const area_resp = await Area.findOne({
      where: {manager: person},
    });
    const proj_manager = await Product.findAll({
      where: {project_manager: person},
    })
    const ref_ass = await Product.findAll(/*find all products for which perso is ref assistant*/);

    return res.json({area_resp, proj_manager, ref_ass});
  })
  
}

init();

export default app;
