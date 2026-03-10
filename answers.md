Parte 1 – Preguntas Teóricas
1 1. Explique la diferencia entre Middleware, Guard, Interceptor y Pipe en NestJS.

Middleware opera antes de enrutar la request.

Guard opera con la request y tiene acceso al contexto de esta(auth, roles, permisos).

Pipe opera sobre los parametros decorados, permitiendo modificarlos andes de pasar al handler.

Interceptor controla el ciclo de vida del handle completo, nos sirve para casos de caching, implementar un formato de respuesta global para todo o controlar timeouts de handlers.

2 2. ¿Cómo implementaría autorización basada en roles?

Implementamos RBAC usando un enum, se asigna el rol del usuario al momento de crear y luego este rol es codificado en los valores del jwt, luego usando el Decorator Roles despues de AuthGuard podremos evaluar el role decodificado en la peticion.

3 3. ¿Qué problemas aparecen cuando un backend crece mucho y cómo NestJS ayuda a
resolverlos?

Si el backend no tiene una arquitectura definida se generara un codigo desorganizado eventualmente como tambien la necesidad de implementar patrones para solucionar problemas como inyeccion de dependencia o una definicion completa de clases para generar modulos.

El framework nest.js soluciona estos problemas con su estructura modular, el cual mediante DI nos permite probar estos modulo facilmente. Nest.js nos organiza todo el viaje de la request mediante controller->service->repository->model y los DTO con class-validator. 

Nest.js de base nos entrega una arquitectura definida como tambien la facilidad y agilidad de implementar requisitos de una REST-API en node, con su documentacion y patron de decoradores es mas comodo y seguro implementar nuevos cambios en la API.

4 4. ¿Cómo manejaría configuración por ambiente (development, staging, production)?

Utilizando distintos .env con un prefijo -nombre-ambiente, de ser necesario modificar el metodo de deploy replicaria el mismo archivo pero con la configuracion para ese ambiente, usando el mismo prefijo que para .env.
La base de esto es que la ci/cd pueda procesar todo el deploy de acuerdo al ambiente en el que probaremos los cambios.

5 5. ¿Cómo evitaría que dos usuarios compren el último producto disponible al mismo tiempo?

Evaluando el stock, si llegan 2 requests el primero en reducir el stock a 0 se queda con la compra, eventualmente la evaluacion de la segunda request terminaria en exception por la evaluacion.

Parte 2 – Análisis y Debugging
Código a analizar:
@Injectable()
export class OrdersService {

private orders = [];
create(order) {
this.orders.push(order);
return order;
}
findAll() {
return this.orders;
}
updateStatus(id, status) {
const order = this.orders.find(o => o.id === id);
order.status = status;
return order;
}
}

1 1. Identifique al menos 5 problemas de arquitectura o diseño.

-Faltan tipos tanto para orders como para los parametros de funciones.

-UpdateStatus no evalua si order es undefined al no existir la id, generando un TypeError no controlado.

-Orders es un array en memoria, se pierde al reiniciar el proceso y no sobrevive crashes de la api, el standard es implementar la capa de bases de datos para este caso.

-El service esta mezclando la funcion con Repository al estar gestionando Orders directamente, esto deberia estar desacoplado mediante Repository->Model.

-Las funciones no tienen un bloque try catch para contener errores, cualquier operacion fallida terminara crasheando la API.

2 2. Explique cómo refactorizaría esta implementación en un proyecto real de NestJS.

Utilizando tipado en las funciones, Orders se vuelve un modelo con conexion a base de datos y se utiliza una capa de Repository para interactuar con el y de esta forma reducimos la responsabilidad del service en cuanto a interacciones con el modelo.

Como tambien implementaria class-validator con DTO para manejar operaciones create/update.