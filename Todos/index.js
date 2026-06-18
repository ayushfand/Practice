const bcrypt = require('bcrypt');
const express = require('express');
const jwt = require('jsonwebtoken');
const { UserModel, TodoModel } = require("./db")
const JWT_SECRET = "kya_bolti_tu_kya_me_bolu_sunnnnnn_sunnnna"
const mongoose = require('mongoose');
const { z } = require('zod');

mongoose.connect("");// add your mongodb connection string here
const app=express();
app.use(express.json());

app.post("/signup",async function(req, res){
    const requiredBody = z.object({
        email: z.string().min(3).max(100).email(),
        name: z.string().min(3).max(30),
        password: z.string().min(3).max(30)
    })

    const parsedDataWithSuccess = requiredBody.safeParse(req.body);

    if(!parsedDataWithSuccess.success){
        res.json({
            message: "Incorrect format",
            error: parsedDataWithSuccess.error
        })
        return
    }

    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    
    const hashedPassword = await bcrypt.hash(password , 3);
    console.log(hashedPassword);

    await UserModel.create({
        email: email,
        password: hashedPassword,
        name: name
    })
    res.json({
      message: "User created successfully"
    });
});

app.post("/signin", async function(req,res){
    const email = req.body.email;
    const password = req.body.password;

    const user = await UserModel.findOne({
        email: email,
    })

    if(!user){
        res.status(403).json({
            message: "User does not exist"
        })
        return;
    }
    
    const passwordMatch = await bcrypt.compare(password, user.password);

    if(passwordMatch){
      const token = jwt.sign({
            id: user._id.toString()
      }, JWT_SECRET);
      res.json({
        token: token
      })
    }else{
        res.status(403).json({
            message: "Incorrect credentials"
        })
    }
});

app.post("/todo", auth, async function(req, res) {
    const userId = req.userId;
    const title = req.body.title;
    const done = req.body.done;

    await TodoModel.create({
        userId,
        title,
        done
    });

    res.json({
        message: "Todo created"
    })
});


app.get("/todos", auth, async function(req, res) {
    const userId = req.userId;

    const todos = await TodoModel.find({
        userId
    });

    res.json({
        todos
    })
});


function auth(req,res,next){
    const token=req.headers.token;
    const decodedData=jwt.verify(token,JWT_SECRET)

    if(decodedData.id){
        req.userId=decodedData.id;
        next();
    }else{
        res.status(401).json({
            message: "Unauthorized access"
        })
    }
}

app.listen(3000,console.log("Server started at port 3000"));

