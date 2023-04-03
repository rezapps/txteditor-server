import mongoose from 'mongoose';

// usrSchema defines the structure of our user
const usrSchema = new mongoose.Schema({
	usermail: {
		type: String,
		required: true,
	},
	username: {
		type: String,
		required: true,
	},
	userpass: {
		type: String,
		required: true,
	},
}, {
	timestamps: true,
	collection: 'usrs'
});

export default mongoose.model('Usr', usrSchema);
