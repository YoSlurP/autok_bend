import express from "express"
import cors from "cors"
import fs from "fs"

let autok=[];
let nextId=0;
fs.readFile("autok.csv","utf-8",(error,data)=>{
    if(error)console.log(error);
    else{console.log(data);
        let sorok = data.split("\n");
        for(let sor of sorok){
            let s= sor.split(";");
            autok.push({id:s[0], tipus:s[1], suly:s[2]*1,loero:s[3]*1})
        }
        for(let a of autok)if(a.id>nextId)nextId=a.id;
        nextId++;
        console.log("Beolvasott autól száma: "+autok.length+" (nextId: "+nextId+" )")
    }
})

const app= express();
app.use(express.json())
app.use(cors());

function addauto(req,res){
    if(req.body.tipus&&req.body.suly&&req.body.loero){
        const auto = {id:nextId++, tipus:req.body.tipus, suly:req.body.suly*1,loero:req.body.loero*1};
        autok.push(auto)
        res.send(auto)
    }else{
        res.send({error:"Hiányzó  paraméterek! "})
    }
}
function updauto(req,res){
    if(req.body.id&&req.body.tipus&&req.body.suly&&req.body.loero){
        let i = indexOf(req.body.id*1)
        if(i!=-1){
            const auto = {id:req.body.id, tipus:req.body.tipus, suly:req.body.suly*1,loero:req.body.loero*1};
            autok[i]=(auto)
            res.send(auto)
        }else res.send({error:"Nincs ilyen id"})
        
    }else{
        res.send({error:"Hiányzó  paraméterek! "})
    }
}
function delauto(req,res){
    if(req.body.id){
        let i= indexOf(req.body.id*1)
        if(autok[i].id==i){
            autok.splice(i,1)
            res.send({status:"OK"})
        }else res.send({error:"Nincs ilyen id"})
    }else res.send({error:"Nincs ilyen"})
}
function indexOf(id){
    let i=0;while(i<autok.length&&autok[i].id !=id)i++;
    if(i<autok.length) return i; else return-1;
}


app.get("/",(req,res)=>res.send("<h1> Cars v1.0.0</h1>"));
app.get("/autok", (req,res)=>res.send(autok))
app.post("/auto",addauto)
app.put("/auto",updauto)
app.delete("/auto",delauto)



app.listen(88,(error)=>{if(error)console.log(error);else console.log("Server on :88")})
