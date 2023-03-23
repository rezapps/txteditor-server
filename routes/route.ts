const express = require('express');
const { getDox, getDoc, cr8Doc, upd8Doc, delDoc } = require('../controller/docController');

const router = express.Router();

// --------------------------- doc routes --------------------------

// Get All Docs
router.get('/', getDox);

// Get one Doc
router.get('/:id', getDoc);

// Post a new Doc
router.post('/create', cr8Doc);

// Update a Doc
router.patch('/:id', upd8Doc);

// Delete a Doc
router.delete('/:id', delDoc);


// --------------------------- user routes --------------------------

router.post('/login', (req: Request, res: Response) => {
	console.log(req.body)
})
router.post('/register', (req: Request, res: Response) => {
	console.log(req.body)
})
router.get('/user', (req: Request, res: Response) => {
	console.log(req.body)
})



export default router;
