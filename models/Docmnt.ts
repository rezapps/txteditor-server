const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// docSchema defines the structure of our document
const docSchema = new Schema({
	_id: {
		type: String,
		required: true,
	},
	authors: {
		type: Array(),
		required: true
	},
    title: {
        type: String,
        required: true,
    },
    text: {
        type: Object,
        required: true,
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('doc', docSchema);
