const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
    name : {
        type : String,
        maxlength : 50,
        required : true,
        
    },
    email : {
        type : String,
        trim : true,
        unique : true,
        required : true,
    },
    password : {
        type : String,
        maxlength : 100,
    },
    role : {
        type : Number,
        default : 0,
    },
    token : {
        type : String,
    },
    tokenExp : {
        type : Number,
    },
});

userSchema.pre("save", function(next){
    const user = this;

    if(user.isModified("password")) {
        bcrypt.genSalt(saltRounds, function (err, salt){
            if(err) return next(err);
            bcrypt.hash(user.password, salt, function(err, hash){
                if(err) return next(err);
                user.password = hash;
                next();
            });
        });
    } else{
        next();
    }
});

userSchema.methods.comparePassword = function (plain, cb) {
    // user.comparePassword 로 호출되기 때문에 this는 찾은 문서가 됨.
    const user = this;

    bcrypt.compare(plain, user.password, function(err, isMatch){
        if(err) return cb(err);
        cb(null, isMatch);
    });
};

userSchema.methods.generateToken = function (cb) {
    const user = this;

    const token = jwt.sign({ userId: user._id.toHexString() }, "secretToken");
    user.token = token;
    // user.save(function (err, user){
    //     if(err) return cb(err);
    //     cb(null,user);
    // })

    user.save()
    .then(user => {cb(null, user)})
    .catch(error => {console.log(error);});
}

// 토큰을 복호화하는 메소드
userSchema.statics.findByToken = function (token, cb) {
    console.log("findByToken");
    const user = this;
    // 토큰을 decode 한다.
    jwt.verify(token, "secretToken", function (err, decoded) {
      // 유저 아이디를 이용해서 유저를 찾은 다음에
      // 클라이언트에서 가져온 token과 db에 보관된 토큰이 일치하는지 확인
    //   user.findOne({ _id: decoded, token: token }, function (err, user) {
    //     if (err) return cb(err);
    //     cb(null, user);
    //   });
        
      user.findOne({ _id: decoded.userId, token: token })
      .then(user => {
        console.log(`decoded : ${decoded.userId}`);
        console.log(`user : ${user}`);
        cb(null, user);
      })
      .catch(error => {
        console.log(error);
      })
    });
  };


const User = mongoose.model("User", userSchema);
module.exports = {User};