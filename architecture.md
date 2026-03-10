1 1. ¿Cómo escalaría esta API para soportar 1000 requests por segundo?

Empezaria por implementar caching si la request fuera para obtener data, con esto nos ahorramos llegar al handler y la db, utilizaria el adapter de Fastify para obtener mejor performance.

Eventualmente con docker llevaria esta api a kubernetes, con esto podriamos escalar horizontalmente la api y enrutar las requests automaticamente mediante load balancer.

2 2. ¿Qué cambios haría si el sistema creciera a millones de tareas?

Aprovecharia la arquitectura modular de nest para identificar los modulos mas usados como tambien su dependencia entre ellos, para luego generar microservicios y que estos puedan escalar en caso de procesar muchas tareas. 

implementamos el patron api-gateway y con una cola de mensajeria generamos proceso asincrono el cual nos permitira procesar N tareas al mismo tiempo.

Con esto podriamos mantener funcionado la API-REST la cual delegaria las tareas a los microservicios.

3 3. ¿Cómo implementaría autenticación JWT en este sistema?

El patron standard de codificado/decodificado de jwt para usuarios con el patron middleware de express.js, el cual es simplificado con el decorador Guard de nest, decorador implementado en base al ejemplo de la documentacion AUth.


4 4. ¿Cómo manejaría procesamiento asincrónico para tareas pesadas?
Generando un microservicio para manejar esta tarea pesada, y un sistema de cola con el cual eliminariamos la carga en la REST-API ya que de manera asincrona el microservicio estara procesando tareas.