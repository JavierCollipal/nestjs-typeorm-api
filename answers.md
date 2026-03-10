Parte 1 – Preguntas Teóricas
1 1. Explique la diferencia entre Middleware, Guard, Interceptor y Pipe en NestJS.
2 2. ¿Cómo implementaría autorización basada en roles?
3 3. ¿Qué problemas aparecen cuando un backend crece mucho y cómo NestJS ayuda a
resolverlos?
4 4. ¿Cómo manejaría configuración por ambiente (development, staging, production)?
5 5. ¿Cómo evitaría que dos usuarios compren el último producto disponible al mismo tiempo?

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
2 2. Explique cómo refactorizaría esta implementación en un proyecto real de NestJS.