require("dotenv").config();
const PORT = process.env.PORT || 4000;
const express = require("express");
const cors = require("cors");
const app = express();
const authRoutes = require("./Routes/auth.routes.js");
const login_singup_Routes = require("./Routes/login-register.routes.js");
const userRoutes = require("./Routes/user.routes.js");

// Connection DB
const connect_DB = require("./DB/db_utilise.js");

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/auth", login_singup_Routes);
app.use("/api/user", userRoutes);

app.get("/Check", async (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Api Is live"
    })
})

app.listen(PORT,() => {
    connect_DB();
    console.log(`Server is running on http://localhost:${PORT}`);
})