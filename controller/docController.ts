import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
const Doc = require('../models/Docmnt');

// Get all Docs
const getDox = async (req: Request, res: Response, next: NextFunction) => {
    // getting docs and sorting them by created time
    const dox = await Doc.find({}).sort({createdAt: -1});

	if (dox) {
		res.status(200).json(dox);
	} else {
		res.status(404).json({message: ''})
	}

    next();
}

// Get single Doc
const getDoc = async (req: Request, res: Response) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'The id is not valid id'})
    }

    const doc = await Doc.findById(id);

    res.status(200).json(doc);
}


// Create new Doc
const cr8Doc = async (req: Request, res: Response) => {

    const {title, text, authors} = req.body;

    // try to add doc to db
    try {
        const doc = await Doc.create({title, text, authors});
        res.status(200).json(doc);

    } catch(error:any) {
        res.status(400).json({error: error.message})
    }

    res.json();
}



// Delete a Doc
const delDoc = async (req: Request, res: Response) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'The id is not valid id'})
    }

    const doc = await Doc.findByIdAndDelete({_id: id})

    res.status(204).json(doc);
}



// Update a Doc
const upd8Doc = async (req: Request, res: Response) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'The id is not valid id'})
    }

    const doc = await Doc.findOneAndUpdate({_id: id}, {
        ...req.body
    })

    res.status(200).json(doc);
}

module.exports = {
    getDox,
    getDoc,
    cr8Doc,
    upd8Doc,
    delDoc
}
