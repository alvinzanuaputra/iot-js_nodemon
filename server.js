const {SerialPort} = require("serialport");
const {ReadLineParser}= require ("@serialport/parser-readline");
const {Server}= require("socket.io");
const http = require("http");
const express = require("express");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json())
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/index.html")
})


io.on("connection", (socket) => {
    console.log("connected...")
    socket.on("disconnect", () => {
        console.log("disconnect")
    })
});


app.listen(3000, () => {
    console.log('server on !');
});

//konektivitas data dari arduino
const port = new SerialPort({
    path : "COM4",
    baudRate : 19200,
});

//parsing data dari arduino
const parser = port.pipe(new ReadLineParser({ delimiter: "\r\n"}))

// tangkap data dari arduino
parser.on("data", (result)=>{
    console.log("data dari arduino =>", result)
    io.emit("data", {data:result});
});

app.post("/arduinoApi", (req, res) => {
    const data = req.body.data // '1'
    port.write(data, (err) => {
        if(err)
        {
            console.log("ERRR", err)
            res.status(500).json({error: "write data error"})
        }
        console.log ("data berhasil dikirim ke arduino => ", data)
        res.end();
    })

})












