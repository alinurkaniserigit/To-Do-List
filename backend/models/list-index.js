const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const importancy = require('../helpers/importancy')

const listIndexSchema = new Schema({
    description:{
        type:String,
        required:true,
    },
    importancy:{
        type:String,
        default:importancy.Normal,
    },
    isDone:{
        type:Boolean,
        default:false,
    },
    listID:{
        type:Schema.Types.ObjectId, 
        ref: 'List', 
        required:true
    }
})

module.exports = mongoose.model('ListIndex',listIndexSchema);
