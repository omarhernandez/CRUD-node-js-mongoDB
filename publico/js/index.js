 
// el evento de document ready se ejecuta cuando 
//se termina de cargar la pagina
$(document).ready(function(){
	//alert("Se ha terminado de cargar el documento");
 
	actualizarDivListaAlumnos();
	
	//Variables Globales
	id_editado=-1;
	
	$("#btnNuevo").click(function(){
		id_editado=-1;		
		$("#txtNombre").val("");
		$("#txtEdad").val("");
		$("#txtPromedio").val("");
	});

	$("#btnGuardar").click(function(){
		var alumno = {
			nombre:$("#txtNombre").val(),
			edad:$("#txtEdad").val(),
			promedio:$("#txtPromedio").val()
		};

		if(id_editado==-1){
			$.post("/alumnos",alumno,function(respuesta){
				actualizarDivListaAlumnos();
			});		
		}
		else{			
			$.ajax({
				type:"PUT",
				url:"/alumnos/"+id_editado,
				data:alumno,				
			}).done(function(respuesta){
				actualizarDivListaAlumnos();				
			});
		}
	});
});

//Functiones 
actualizarDivListaAlumnos = function(){
	$.get("/alumnos",{},function(respuesta){

		var contenido_div= '' || {} ;
		
		for(var i = 0; i< respuesta.length;i++){
	

				contenido_div += '<tr class="divAlumno" data='+respuesta[i]._id+'>';
				contenido_div += '<td>'+respuesta[i].nombre+'</td>'
				contenido_div += '<td>'+respuesta[i].edad+'</td>'
				contenido_div +=' <td>'+respuesta[i].promedio+'</td>'
				contenido_div += ' <td> <input type="button" value="Editar" class="btnEditar btn btn-info"/> '
				contenido_div += ' <input type="button" value="Eliminar" class="btnEliminar btn"/> </tr>'
		}

		$("#divListaAlumnos").html(contenido_div);

		$(".btnEliminar").click(function(){
			var btnPresionado = $(this);
			var divAlumno = btnPresionado.parent().parent();
			var indice = divAlumno.attr("data");
							
			$.ajax({
				type:"DELETE",
				url:"/alumnos/"+indice,
				data:{},				
			}).done(function(respuesta){
				actualizarDivListaAlumnos();				
			});
		});

		$(".btnEditar").click(function(){	
			var btnPresionado = $(this);
			var divAlumno = btnPresionado.parent().parent();
			var indice = divAlumno.attr("data");
				
			id_editado = indice;
			$.get("/alumnos/"+indice,{},function(resultado){
				$("#txtNombre").val(resultado.nombre);
				$("#txtEdad").val(resultado.edad);
				$("#txtPromedio").val(resultado.promedio);			
			});
		});
		
	});
}
