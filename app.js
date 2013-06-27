var express = require("express");
var mongodb = require("mongodb");
var PATH_DB =  "mongodb://localhost/db_escuela";
var MSG_STABLISHED = "Se ha conectado a la base de datos";
var servidor = new express();
var PORT  = 8080;

var BSON = mongodb.BSONPure;

servidor.use(express.static(__dirname+"/publico"));

servidor.use(express.bodyParser());

 
var cliente_mongodb = mongodb.MongoClient;

cliente_mongodb.connect(PATH_DB, function(err, db_escuela){
	
	if(err){
	
		console.log("Error de conexion"+err);
	
	}else{
		
		console.log(MSG_STABLISHED);
		
		var cl_alumnos = db_escuela.collection("cl_alumnos");
		
		servidor.get("/alumnos",function(peticion, respuesta){

 
			cl_alumnos.find().toArray(function(err,respuesta_db){
				respuesta.send(respuesta_db);
			});
		});

		servidor.get("/alumnos/:id",function(peticion,respuesta){


			var id = new BSON.ObjectID(peticion.params.id);
			cl_alumnos.findOne({'_id':id},function(err,respuesta_db){
				respuesta.send(respuesta_db);			
			});
		});

		servidor.post("/alumnos",function(peticion,respuesta){



			var nuevo_alumno={
				nombre:peticion.body.nombre,
				edad:peticion.body.edad,
				promedio:peticion.body.promedio
			};
			cl_alumnos.insert(nuevo_alumno,function(err,respuesta_db){
				console.log("Se ha insertado: "+JSON.stringify(respuesta_db));
				respuesta.send(respuesta_db);			
			});
		});

		servidor.delete("/alumnos/:id",function(peticion,respuesta){
			var alumno_eliminar = {
				_id : new BSON.ObjectID(peticion.params.id)
			}
			
			cl_alumnos.remove(alumno_eliminar,function(err,respuesta_db){
				if(err)
					console.log("No se ha podido eliminar el registro");
				else
					respuesta.send("Registro Eliminado");				
			});			
		});

		servidor.put("/alumnos/:id",function(peticion,respuesta){
			var id_editado={
				_id : new BSON.ObjectID(peticion.params.id)			
			};
			var alumno_editado={
				nombre:peticion.body.nombre,
				edad:peticion.body.edad,
				promedio:peticion.body.promedio
			};		
			cl_alumnos.update(id_editado, alumno_editado, function(err, respuesta_db){
				if(err)
				{
					console.log("Error:"+err);
				}
				else
				{
					console.log("Resultado "+respuesta_db);
					respuesta.send("Actualizacion Exitosa");
				}
			});
		});

		
		servidor.listen(PORT,function(){
			console.log("El servidor esta escuchando en el puerto "+PORT);
		});				
	} // end mongodb


});

