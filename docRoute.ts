//@ts-nocheck
import dotenv from 'dotenv'

const express = require('express')
import { Request, Response, NextFunction } from 'express'

import jwt from 'jsonwebtoken'
const Doc = require('../models/Docmnt');




const { getDox, getDoc, cr8Doc, upd8Doc, delDoc } = require('../controller/docController')

const router = express.Router()
dotenv.config()
const ramz = process.env.SUPERSECRET || ''


const authToken = (req: Request, res: Response, next: NextFunction) => {

	const authHeader: string | undefined = req.headers['authorization']
	const token = authHeader?.split(' ')[1] || ''
	if (!token) res.sendStatus(401)

	jwt.verify(token, ramz, (err: any, user: any) => {
		if (err) return res.status(403)

		req.user = user

		next()
	})

}


// --------------------------- doc routes --------------------------

// Get All Docs
router.get('/', authToken, async (req: Request, res: Response) => {
	const dox = await Doc.find({author: req.user._id})

	if (dox) {
		res.status(200).json(dox);
	} else {
		res.status(404).json({message: 'something is wrong'})
	}

})




// Get one Doc
router.get('/:id', getDoc)

// Post a new Doc
router.post('/create', cr8Doc)

// Update a Doc
router.patch('/:id', upd8Doc)

// Delete a Doc
router.delete('/:id', delDoc)


export default router
