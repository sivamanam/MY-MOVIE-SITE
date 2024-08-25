const express=require('express');
const mongoose=require('mongoose');
const fileupload=require('express-fileupload');
const pug=require('pug');
const fs=require('fs');
const app=express();
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded());
app.use(fileupload());
app.set('view engine','pug');
app.listen(3007,()=>
{
    console.log("Server is running at 3007...!");
});
let b=mongoose.connect('mongodb://localhost:27017/BookingAppliction-TASK');
b.then((info)=>
{
    console.log("Connection Successful");
});
b.catch((info)=>
{
    console.log("Connection failed!");
});
let theatreschema=new mongoose.Schema({
    Cityname:String,
    Theatre:String
});
let theatremodel= new mongoose.model('csedata',theatreschema,'theatres');
let movieschema=new mongoose.Schema({
    Theatre:String,
    Movie1:String,
    Movie2:String,
    Movie3:String
})
let moviemodel=new mongoose.model('csedata1',movieschema,'movies');
app.get('/home',(req,res)=>{
    res.sendFile(__dirname+'/public/main.html');
})
app.get('/login',(req,res)=>{
    res.sendFile(__dirname+'/public/login.html');
})
app.get('/index',(req,res)=>{
    res.sendFile(__dirname+'/public/index.html');
})
app.get('/forgotpassword',(req,res)=>{
    res.sendFile(__dirname+'/public/forgotpassword.html');
})
app.post('/search',async(req,res)=>{
    const finder=await theatremodel.findOne({Theatre:req.body.lsearch});
    if(finder){
        const movies=await moviemodel.findOne({Theatre:finder.Theatre});
        file='/moviespics/'+req.body.lsearch+'.jpg';
        res.render('theatre.pug',{file});
        //res.sendFile(__dirname+'/public/middle.html', { file });
    }
    else{
        const movie=await moviemodel.findOne({Movie1:req.body.lsearch});
        if(movie){
            file='/moviepics/'+req.body.lsearch+'.jpg';
            res.render('middle.pug',{file});
        }
        else{
            res.status(404).json({ message: "Movie not found" });
        }
    }
})
let personschema=new mongoose.Schema({
    Name:String,
    Class:String,
    Seats:Number
});
let personmodel= new mongoose.model('csedata2',personschema,'PersonDetails');
app.post('/booking',async(req,res)=>{
    var data={
        Name:req.body.Name,
        Class:req.body.Class,
        Seats:req.body.Seats
    }
    const p=new personmodel(data);
    await p.save().then((info)=>{
        res.sendFile(__dirname+'/public/theatre.html');
    })
})
let loginschema=new mongoose.Schema({
    Username:String,
    Password:String
})
let loginmodel=new mongoose.model('csedata3',loginschema,'LoginDetails');
app.post('/login',async(req,res)=>{
    var data={
        Username:req.body.user,
        Password:req.body.pass
    }
    const l=new loginmodel(data);
    await l.save().then((info)=>{
        res.sendFile(__dirname+'/public/index.html');
    })
})
app.post('/index',async(req,res)=>
{
    const user=await loginmodel.findOne({Username:req.body.luser})
    if(user)
    {
        const result=req.body.lpass===user.Password;
       // res.sendFile(__dirname+'/public/home.html');
       if(result){
        res.sendFile(__dirname+'/public/something.html');
        }
        else{
            res.sendFile(__dirname+'/public/index.html');
        }
    }
    else
    {
        res.sendFile(__dirname+'/public/index.html');
    }
});
app.get('/change',(req,res)=>{
    res.sendFile(__dirname+'/public/forgotpassword.html');
})
app.post('/forgotpassword',async(req,res)=>{
    const user=await loginmodel.findOne({Username:req.body.changeuser});
    if(req.body.changepass==req.body.changerpass){
        loginmodel.updateOne({Username:req.body.changeuser},{$set:{Password:req.body.changepass}}).then((data)=>{
            res.sendFile(__dirname+'/public/index.html');
        })
    }
    else{
        alert("Re-enter password not matched");
    }
})