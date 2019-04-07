app.get('/videojuegos/llista', function(req, res){
                var listaTabla= '<table class="table">\
                  <thead>\
                    <tr>\
                      <th scope="col">#</th>\
                      <th scope="col">First</th>\
                      <th scope="col">Last</th>\
                      <th scope="col">Handle</th>\
                    </tr>\
                  </thead>\
                  <tbody>';
                docs.forEach(function(doc){
                    console.log(doc.nombre);
                        var tr_nombre="<tr><td>"+doc.nombre+"</td>";
                        var tr_plataforma="<td>"+doc.plataforma+"</td>";
                    });
                var finalTabla ='</tbody>\
                                </table>';
                fs.readFile("head.html","utf8",(err,data)=>{
                    if(err){
                        console.log(err);
                        return err;
                    }else{
                        res.send(data+listaTabla);
                    }
                })
                
            });



docs.forEach(function(doc){


for (const key in docs){
  var tr_nombre="<tr><td>"+docs[key]["nombre"]+"</td>";
  var tr_plataforma="<td>"+docs[key]["plataforma"]+"</td>";
  var fin_tr="</tr>";
  var listaContenido=tr_nombre+tr_plataforma+fin_tr;
  listaInicial=listaInicial+listaContenido;
};


app.get('/',function(req,res){
    res.redirect("/videojuegos/llista");
});