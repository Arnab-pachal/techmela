import express from "express"
import { app,server } from "./lib/socket.js"
import cors from "cors"
import dotenv from "dotenv"
import router from "./routes/auth.route.js"
import {connectDb} from "./lib/db.js"
import cookieParser from "cookie-parser";
import messageRoute from "./routes/mesage.route.js"
import bodyParser from "body-parser"
import announce from "./routes/announce.route.js"
import teamRoute from "./routes/team.route.js";

dotenv.config();

app.use(cors({origin:"https://techmelafrontend.onrender.com",credentials:true,methods:['GET','POST','DELETE','PUT']}));


server.listen(3000, () => {
    console.log("server is running on PORT:" + 3000);
    connectDb();
  });
app.use(bodyParser.json({ limit: '50mb' })); // Adjust the limit as needed
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/auth",router);
app.use("/messages",messageRoute)
app.use("/announce",announce)
app.use("/team",teamRoute)

