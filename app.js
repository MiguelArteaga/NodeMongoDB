var MongoClient = require('mongodb').MongoClient;
var assert = require('assert'); //Comprueba errores
var fs=require('fs');
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var url = 'mongodb://localhost:27017/videojuegos';
var express = require('express'),
    app=express();
var ObjectID = require('mongodb').ObjectID;




app.get('/videojuegos/llista', function(req, res){
    MongoClient.connect(url, function(err, db){
        assert.equal(null, err);
        console.log("Conectados correctamente");
        var dbo = db.db("videojuegos");
        dbo.collection('videojuegos').find({}).toArray(function(err, docs){
            var listaInicial ="";
            var listaTabla= '<table class="table">\
                  <thead>\
                    <tr>\
                      <th scope="col">ID</th>\
                      <th scope="col">Nombre</th>\
                      <th scope="col">Plataforma</th>\
                      <th scope="col">Año de lanzamiento</th>\
                    </tr>\
                  </thead>\
                  <tbody>';
            docs.forEach(function(doc){
                console.log(doc.title);
                var tr_id="<tr><td>"+doc._id+"</td>";
                var tr_nombre="<td>"+doc.nombre+"</td>";
                var tr_plataforma="<td>"+doc.plataforma+"</td>";
                var tr_lanzamiento="<td>"+doc.añoLanzamiento+"</td>";

                id_juego = doc._id;

                botonEditar = "<td><a class='btn btn-link' href=http://localhost:3000/videojuegos/borrar/"+id_juego+">Editar</a></td>";
                botonBorrar = "<td><a class='btn btn-link' href=http://localhost:3000/videojuegos/borrar/"+id_juego+">Borrar</a></td>";

                var fin_tr="</tr>";
                var listaContenido=tr_id+tr_nombre+tr_plataforma+tr_lanzamiento+botonEditar+botonBorrar+fin_tr;
                listaInicial=listaInicial+listaContenido;
            });
            var finalTabla ='</tbody>\
                            </table>';

            var botonCrear = '<a  class="btn btn-primary"  href="http://localhost:3000/videojuegos/crear" >Crear<a/>';
            var tablaFinal = listaTabla+listaInicial+finalTabla+botonCrear;
            fs.readFile("head.html","utf8",(err,data)=>{
                if(err){
                    console.log(err);
                    return err;
                }else{
                    res.send(data+tablaFinal);
                }
            })
            db.close();
        });
    });
});


app.get('/videojuegos/crear',function(req,res){
    var formularioInsertar = '<form method="POST">\
        <label for="nombre">Nombre del Juego</label>\
        <input class="form-control" type="text" name="nombre">\
        <br>\
        <label for="duracion">Plataforma</label>\
        <input class="form-control" type="text" name="plataforma">\
        <br>\
        <label for="descripcion">Año de lanzamiento</label>\
        <input class="form-control" type="text" name="lanzamiento">\
        <br>\
        <input type="submit">\
    </form>';
    fs.readFile("head.html","utf8",(err,data)=>{
        if(err){
            console.log(err);
            return err;
        }else{
            res.send(data+formularioInsertar);
        }
    })
});


app.post('/videojuegos/crear',urlencodedParser, function(req, res){
    var inputNombre = req.body.nombre;
    var inputPlataforma = req.body.plataforma;
    var inputLanzamiento = req.body.lanzamiento;

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("videojuegos");

        var myobj = { nombre: inputNombre, plataforma: inputPlataforma, añoLanzamiento: inputLanzamiento};
        dbo.collection("videojuegos").insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log("Nuevo dato insertado");
            db.close();
        });       

        res.redirect("/videojuegos/llista");

    });   

});



app.get('/videojuegos/borrar/:id',function(req,res){
    var idJuego = req.params.id;
        
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("videojuegos");

        var jsquery = { _id: idJuego };
        dbo.collection("videojuegos").deleteOne({_id: new ObjectID(idJuego)});
        console.log("Elemento Eliminado");
        res.redirect("/videojuegos/llista");

    });
});








app.use(function(req, res){
    res.sendStatus(404);
});
var server = app.listen(3000, function(){
    var port = server.address().port;
    console.log("Express server listening on port %s", port);
});

