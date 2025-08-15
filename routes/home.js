const express =  require("express");
const { validationResult } = require("express-validator");
const { productValidationRules } = require("../validators/productValidator");
const productSchema = require("../validators/productValidator");

const router =  express.Router();

const {getallList,storelist,createlist,editlist,deletelist,updatelist} =  require('../controllers/crudController');

router.get('/',getallList);

router.post("/store", async (req, res) => {
//   const errors = validationResult(req);

//   if (!errors.isEmpty()) {
//     return res.render("create", {
//       errors: errors.array(),
//       old: req.body,
//       categories: ["Electronics", "Clothing", "Books"],
//       genders: ["Male", "Female"]
//     });
//   }

//   // Validation pass → data save karo
//   storelist(req, res);

try {
    // Validate request body
    await productSchema.validateAsync(req.body, { abortEarly: false });

    // Validation passed → save data
    storelist(req, res);

  } catch (err) {
    // Validation failed → render form with errors
    //return res.send(err.details);
    const errors = err.details.map(e => ({msg : e.message}));
   //      return res.send(errors);
    return res.render("create", {
      errors,
      categories: ["Electronics", "Clothing", "Books"],
      genders: ["Male", "Female"]
    });
  }
});

router.get('/create',createlist);

router.get('/edit/:id',editlist);

router.post('/update/:id',updatelist);

router.post('/delete/:id',deletelist);

module.exports = router;