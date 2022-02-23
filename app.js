require('dotenv').config()
const express=require("express");
const bodyParser=require("body-parser");
const https=require("https");
const ejs=require("ejs");
const _=require("lodash");
const convert=require("xml-js");

const app=express();

app.set('view engine', 'ejs');
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended:true}))

app.get("/",function(req,res){
    res.render("home");
});

app.route("/city")
.get((req,res)=>{
    res.render("city");
})
.post((req,res)=>{
    const city=req.body.city;
    const unit="metric";
    var url="https://api.openweathermap.org/data/2.5/weather?q="+city+"&units="+unit+"&appid="+process.env.API;
    https.get(url,function(response){
        if(response.statusCode!==200){
            res.render("city");
        }
        else{
            response.on("data",function(data){
                const webdata=JSON.parse(data);
                const temp=webdata.main.temp;
                const des=webdata.weather[0].description;
                const icon=webdata.weather[0].icon;
                const press=webdata.main.pressure;
                const humid=webdata.main.humidity;
                const windspeed=webdata.wind.speed;
                const feels_like=webdata.main.feels_like;
                res.render("city_details",{
                    temp:temp,
                    des:des,
                    icon:"http://openweathermap.org/img/wn/"+icon+".png",
                    press:press,
                    humid:humid,  
                    windspeed:windspeed,
                    feels_like:feels_like,
                    city:_.capitalize(city)
                })
            });
        }
    });
});


app.route("/zipcode")
.get((req,res)=>{
    res.render("zipcode");
})
.post((req,res)=>{
    let city_name;
    const unit="metric";
    const zip=req.body.zip;
    const country=req.body.country;

    var url="https://api.openweathermap.org/data/2.5/weather?zip="+zip+","+country+"&units="+unit+"&appid="+process.env.API;
    https.get(url,function(response){
        if(response.statusCode!==200){
            res.render("zipcode");
        }
        else{
            response.on("data",function(data){

                const webdata=JSON.parse(data);
                const temp=webdata.main.temp;
                const des=webdata.weather[0].description;
                const icon=webdata.weather[0].icon;
                const press=webdata.main.pressure;
                const humid=webdata.main.humidity;
                const windspeed=webdata.wind.speed;
                const feels_like=webdata.main.feels_like;

                https.get("https://api.worldpostallocations.com/pincode?postalcode="+zip+"&countrycode="+country,function(res1){
                    res1.on("data",function(data1){
                        data1=data1.toString("utf-8");
                        const wedata=JSON.parse(data1);
                        city_name=wedata.result[0].postalLocation;
                        
                        res.render("zip_details",{
                            temp:temp,
                            des:des,
                            icon:"http://openweathermap.org/img/wn/"+icon+".png",
                            press:press,
                            humid:humid,  
                            windspeed:windspeed,
                            feels_like:feels_like,
                            city:city_name
                        })

                    });
                });
                
                
            });
        }
    });
});


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port,function(){
    console.log("server running on port 3000");
})