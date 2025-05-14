const express = require("express");
const cors = require('cors');

const root = express();

root.use(cors());
root.use(express.json())


root.listen(3000, (err) => {
    if(err){
        console.log("Error in listning on server at port 3000")
    }else{
        console.log("Server is listning on port 3000");
    }
})

