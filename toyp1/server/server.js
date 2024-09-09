const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 3001;
const path = require('path');
const cors = require('cors');
const bodyParser = require("body-parser");
app.use(cors());
app.use(express.static(path.join(__dirname, '../build')));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(cookieParser());


const {User} = require("../models/User.js");
const {auth} = require("../middleware/auth.js");

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://jkh1447:n3DPJA84hDLr80v7@cluster0.2wknr0t.mongodb.net/')
.then(() => console.log('MongoDB Connected'))
.catch(() => console.log('Connect failed'));


app.post("/register", async (req, res) => {
    const user = new User(req.body);

    try{
        const userInfo = await user.save();
        res.status(200).json({success : true});
    }
    catch (err) {
        res.json({success:false, err});
    }
    
});

app.post("/loginCheck", async (req, res) => {
    // mongoose Schema의 findOne함수, 첫번째 인자는 찾을 내용, 두번째 인자는 콜백, user는 찾은 문서를 뜻함
    console.log("loginCheck");
    User.findOne(
        {
            email : req.body.email,
        })
        .then(user => {
            if(!user){
                return res.json({
                    loginSuccess : false,
                    message : "이메일에 해당하는 유저가 없습니다.",
                })
            }

            user.comparePassword(req.body.password, (err, isMatch) => {
                if (!isMatch){
                    return res.json({
                        loginSuccess : false,
                        message : "비밀번호가 틀렸습니다.",
                    })
                }


                user.generateToken((err, user) => {
                    if (err) return res.status(400).send(err);
    
                    res.cookie("x_auth", user.token)
                    .status(200)
                    .json({loginSuccess : true, userId : user._id});
                });
            });

        })
        .catch(error => {
            console.log(error);
        });
        
        
    
});

app.get("/logout", auth, (req, res) => {
    console.log("logout");
    console.log(`req.user.userId : ${req.user._id}`);
    User.findOneAndUpdate({ _id : req.user._id }, {token : ""}, { new: true, useFindAndModify: false })
    .then(user => {
        if(!user){
            console.log("token not updated\n")
            return res.json({success : false, message : "user not found"});
        }

        console.log("token update");
        return res.status(200).send({success : true});
    })
    .catch(error => {
        return res.status(500).json({ success: false, error: error.message });
    })

    // User.findOneAndUpdate({id : req.user._id}, {token : ""}, (err, user) => {
    //     if (err) return res.json({success : false, err});
    //     return res.status(200).send({success : true});
    // });
});

// auth 미들웨어를 통과해야 다음으로 넘어감
app.get("/users/auth", auth, (req, res) => {
    console.log("auth");
    // 여기까지 미들웨어를 통과해 왔다는 얘기는 Authentication이 true라는 말
    res.status(200).json({
      _id: req.user._id,
      isAdmin: req.user.role === 0 ? false : true,
      isAuth: true,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role,
    });
  });

app.listen(port, () => {
    console.log(`Connect at http://localhost:${port}`);
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
    
})


