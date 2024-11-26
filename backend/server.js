import express from "express";
import cookieParser from "cookie-parser";
import path from "path";

import authRoutes from "./routes/auth.route.js";
import movieTvRoutes from "./routes/movietv.route.js";
import searchRoutes from "./routes/search.route.js";

import actorRoutes from "./routes/actor.route.js"; // Import the actor route
import trendingRoutes from "./routes/trending.route.js";

import { ENV_VARS } from "./config/envVars.js";
import { connectDB } from "./config/db.js";
import { protectRoute } from "./middleware/protectRoute.js";

const app = express();
const port = ENV_VARS.PORT;
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/content", protectRoute, movieTvRoutes);
app.use("/api/v1/search", protectRoute, searchRoutes);
app.use("/api/v1/actor", protectRoute, actorRoutes);
app.use("/api/v1/trending", protectRoute, trendingRoutes);

// to deploy the production (react application)
if(ENV_VARS.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "/frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    });
}

// app.get("/", (req, res) =>{
//     res.send("Hello :)");
// });

app.listen(port, () => {
    console.log("Server started at http://localhost:" + port);
    connectDB();
});