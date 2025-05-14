const mongoose = require('mongoose')


async function connect(){
    try{
        await mongoose.connect(process.env.DATA_KEY)
        console.log("Connnection Successfull>>>>>")
    }catch(err){
        console.log("Error  connecting with database!")
        console.log(err)
    }
}


connect();


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,

    },
    password: {
        type: String,
        required: true,
        
    },
    firstname:{
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    curriculam:[
           {
             type: mongoose.Schema.Types.ObjectID,
             ref: "curriculum"
           }
        ]
    
    


})


const curriculumSchema = new mongoose.Schema({

    intrest: {
    type: new mongoose.Schema({
        role: { type: String, required: true },
        frameworks: [{ type: String, required: true }]
    }),
    required: true
    },

    savedTrack:{
        topics:[{
            concept: {
                type: String,
            },
            links: {
                type: String, 
            },
            aiview:{
                type: String,
            }
        }]
    }


})

module.exports.Curriculum = mongoose.model("curriculum", curriculumSchema);
module.exports.User = mongoose.model("user", userSchema);