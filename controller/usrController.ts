import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Usr from '../models/Usr'

dotenv.config()

const supaSecret = process.env.SUPERSECRET || ''

const cr8Token = (_id: string) => {
	return jwt.sign({ _id }, supaSecret, { expiresIn: '1d' })
}


const loginUser = async (req: Request, res: Response, next: NextFunction) => {
	const { usermail, userpass } = req.body;

	if (!usermail || !userpass) {
		throw Error('All Fields Must Be Filled');
	}

	try {
		const exUser = await Usr.findOne({ usermail: usermail });
		if (!exUser) {
			console.log('This email is not registered!');
			res.status(404).json({ error: 'Incorrect Email or Password!' });
		} else {
			const compPass = await bcrypt.compare(userpass, exUser.userpass);
			console.log(compPass);

			if (!compPass) {
				console.log('password is wrong')
				res.status(404).json({ error: 'Incorrect Email or Password!' })
			} else {
				const token = cr8Token(`${exUser._id}`)
				res.status(200).json(token);
				console.log('user logged in: ', token)
			}
		}
	} catch (error: any) {
		res.status(400).json({ error: error.message });
	}
};



const cr8User = async (req: Request, res: Response): Promise<void> => {
	const { usermail, username, userpass } = req.body;
	const hashedpass = await bcrypt.hash(userpass, 10);

	try {
		const exUser = await Usr.findOne({ usermail });
		if (exUser) {
			console.log('This email is already registered to another user!');
			res.status(406).json({ message: 'This email is already registered to another user!' });
			return;
		}
		const usr = await Usr.create({ usermail, username, userpass: hashedpass });
		const token = cr8Token(`${usr._id}`);
		console.log(token);
		res.status(201).json(token);
	} catch (error: any) {
		res.status(400).json({ error: error.message });
		return;
	}
};


const getUser = async (req: Request, res: Response, next: NextFunction) => {

}

module.exports = {
	cr8User,
	getUser,
	loginUser
}
