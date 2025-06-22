
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

//******MIDDLEWARE TO HANDLE CORS***** */

app.use(cors(
    {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"]
    }
));
//  *******MIDDLEWARES *******//

app.use(express.json());
app.use(express.urlencoded({extended: true}));

//  *******ROUTES *******//



// *****SERVER UPLOADS FOLDER******//

app.use("/uploads", express.static(path.join(__dirname, "/uploads")));



//  *******SERVER LISTENING *******//
 const PORT = process.env.PORT || 5000;
 
app.listen(PORT, () => 
    console.log(`Server is running on port ${PORT}`));


