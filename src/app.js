const express = require("express")
const app = express();
const path = require("path")
const hbs = require("hbs")

const port = process.env.PORT || 3000

require("./db/conn")
const Register = require("./models/registers")


const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

// console.log(path.join(__dirname,"../public"))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))  // je pan data form ma feel thay ae undefined na dekhay aena mate use karyu 6e

app.use(express.static(static_path))
app.set("view engine", "hbs")
app.set("views", template_path)
hbs.registerPartials(partials_path)

app.get("/", (req, res) => {
    res.render("index")
})

app.get("/register", (req, res) => {
    res.render("register")
})

// create new usetr in our database
app.post("/register", async (req, res) => {

    try {
        const password = req.body.password
        const cpassword = req.body.confirmpassword
        // console.log(req.body)
        if (password === cpassword) {
            const registerEmployee = new Register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                gender: req.body.gender,
                phoneno: req.body.phone,
                age: req.body.age,
                password: req.body.password,
                confirmpassword: req.body.confirmpassword
            })
            console.log(registerEmployee)

            const registered = await registerEmployee.save()
            res.status(201).render("index")
        } else {
            res.status(400).render("register", {
                errorMessage: "Passwords do not match",
            });
        }
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})


app.get("/login", (req, res) => {
    res.render("login")
})

app.post("/login", async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password

        const userEmail = await Register.findOne({ email: email })
      
        if(userEmail.password === password){
            res.status(201).render("index")
        }else{
           
            res.send( "invalid login details")
        }
        
       
    } catch (e) {
        res.status(400).send("invalid login details")
    }
})

app.listen(port, () => {
    console.log(`server is running on the port no ${port}`)
})