EXPLICACIÓN COMPLETA - SISTEMA POS "COQUITOS" BACKEND

🔐 1. SISTEMA DE USUARIOS Y AUTENTICACIÓN
Roles y Permisos:
📋 2. PERMISOS POR ROL (CORREGIDO)
┌─────────────────────────────────────────────────────────┐
│ TABLA: User                                             │
├─────────────────────────────────────────────────────────┤
│ Campos:                                                 │
│ ├─ id (UUID único)                                     │
│ ├─ email (único)                                       │
│ ├─ password (hash bcrypt)                              │
│ ├─ firstName + lastName                                │
│ ├─ phone (opcional)                                    │
│ ├─ role: ADMIN | CASHIER                               │
│ └─ status: ACTIVE | INACTIVE | SUSPENDED               │
└─────────────────────────────────────────────────────────┘

RELACIONES:
├─ orders[] → Órdenes creadas
├─ cashRegisters[] → Cajas manejadas
├─ stockMovements[] → Movimientos de inventario realizados
└─ activityLogs[] → Registro de actividades

👨‍💼 ADMIN puede:
✅ Gestión de Usuarios
   ├─ Crear usuarios (asignar rol ADMIN o CASHIER)
   ├─ Editar usuarios (cambiar datos, rol, status)
   ├─ Eliminar usuarios
   └─ Cambiar roles y estados

✅ Gestión de Categorías
   ├─ Crear categorías
   ├─ Editar categorías
   └─ Eliminar categorías

✅ Gestión de Productos
   ├─ Crear productos (definir price, stock, minStock)
   ├─ Editar productos
   ├─ Eliminar productos
   └─ Cambiar estado (AVAILABLE, OUT_OF_STOCK, DISCONTINUED)

✅ Gestión de Inventario
   ├─ Reabastecer stock (PURCHASE)
   ├─ Ajustar inventario (ADJUSTMENT)
   ├─ Dar de baja productos (DAMAGED)
   ├─ Registrar devoluciones (RETURN)
   └─ Ver historial completo de movimientos

✅ Gestión de Clientes
   ├─ Crear clientes
   ├─ Editar clientes
   └─ Eliminar clientes

✅ Gestión de Órdenes
   ├─ Crear órdenes
   ├─ Ver todas las órdenes
   ├─ Editar órdenes
   └─ Cancelar/Reembolsar órdenes

✅ Gestión de Caja
   ├─ Abrir caja
   ├─ Cerrar caja
   └─ Ver TODOS los cierres de caja (de todos los cajeros)

✅ Reportes
   ├─ Ver reportes completos del sistema
   ├─ Ver ventas por hora
   ├─ Ver productos más vendidos
   ├─ Ver reportes diarios
   └─ Ver alertas de stock bajo

✅ Configuración
   ├─ Modificar configuración del sistema
   └─ Ver logs de actividad completos
👨‍💻 CAJERO puede:
❌ Gestión de Usuarios
   └─ NO puede crear/editar/eliminar usuarios
   └─ NO puede cambiar roles

✅ Gestión de Categorías
   ├─ Crear categorías
   ├─ Editar categorías
   └─ Eliminar categorías

✅ Gestión de Productos
   ├─ Crear productos
   ├─ Editar productos
   ├─ Eliminar productos
   └─ Cambiar estado

✅ Gestión de Inventario
   ├─ Reabastecer stock (PURCHASE)
   ├─ Ajustar inventario (ADJUSTMENT)
   ├─ Dar de baja productos (DAMAGED)
   ├─ Registrar devoluciones (RETURN)
   └─ Ver historial de movimientos

✅ Gestión de Clientes
   ├─ Crear clientes
   ├─ Editar clientes
   └─ Eliminar clientes

✅ Gestión de Órdenes
   ├─ Crear órdenes (automáticamente reduce stock)
   ├─ Ver sus propias órdenes
   ├─ Editar órdenes
   └─ Cancelar órdenes

✅ Gestión de Caja
   ├─ Abrir SU caja
   ├─ Cerrar SU caja
   └─ Ver solo SUS cierres de caja

✅ Reportes
   ├─ Ver reportes de sus propias ventas
   ├─ Ver ventas por hora
   ├─ Ver productos más vendidos
   └─ Ver alertas de stock bajo

❌ Configuración
   └─ NO puede modificar configuración del sistema
   └─ SOLO puede ver sus propios logs de actividad

RESUMEN: El CAJERO puede hacer TODO excepto gestionar USUARIOS y modificar CONFIGURACIÓN del sistema.
📦 3. CATÁLOGO - PRODUCTOS Y CATEGORÍAS
Flujo completo:
═══════════════════════════════════════════════════════════
PASO 1: Crear Categoría (ADMIN o CAJERO)
═══════════════════════════════════════════════════════════

┌─────────────────────────────────────┐
│ Category                            │
│ ├─ id: "uuid-123"                  │
│ ├─ name: "Comidas"                 │
│ ├─ description: "Platos principales"│
│ ├─ status: ACTIVE                  │
│ └─ createdAt: "2024-01-15 09:00"  │
└─────────────────────────────────────┘

═══════════════════════════════════════════════════════════
PASO 2: Crear Producto (ADMIN o CAJERO)
═══════════════════════════════════════════════════════════

┌─────────────────────────────────────┐
│ Product                             │
│ ├─ id: "uuid-456"                  │
│ ├─ name: "Combo Familiar"          │
│ ├─ description: "..."              │
│ ├─ price: 15,000                   │
│ ├─ sku: "COMBO-001" (opcional)     │
│ ├─ stock: 100                      │
│ ├─ minStock: 20                    │ ← Alerta cuando ≤ 20
│ ├─ categoryId: "uuid-123"          │
│ ├─ status: AVAILABLE               │
│ └─ image: "url-imagen.jpg"         │
└─────────────────────────────────────┘

RELACIÓN:
Category (1) ─────< (N) Product
👥 4. CLIENTES
Gestión de clientes (ADMIN o CAJERO):
┌─────────────────────────────────────┐
│ Customer                            │
│ ├─ id: "uuid-789"                  │
│ ├─ firstName: "María"              │
│ ├─ lastName: "García"              │
│ ├─ email: "maria@email.com"        │
│ ├─ phone: "3001234567"             │
│ ├─ address: "Calle 123"            │
│ └─ type: REGULAR | VIP | OCCASIONAL│
└─────────────────────────────────────┘

NOTA: El cliente es OPCIONAL al crear órdenes
📥 5. GESTIÓN DE INVENTARIO
A. Control de Stock Mínimo:
┌─────────────────────────────────────┐
│ Customer                            │
│ ├─ id: "uuid-789"                  │
│ ├─ firstName: "María"              │
│ ├─ lastName: "García"              │
│ ├─ email: "maria@email.com"        │
│ ├─ phone: "3001234567"             │
│ ├─ address: "Calle 123"            │
│ └─ type: REGULAR | VIP | OCCASIONAL│
└─────────────────────────────────────┘

NOTA: El cliente es OPCIONAL al crear órdenes
B. Reabastecimiento (ADMIN o CAJERO):
═══════════════════════════════════════════════════════════
PASO 1: Usuario recibe mercancía
═══════════════════════════════════════════════════════════

Ingresa al sistema:
├─ Producto: Combo Familiar
├─ Cantidad: +50
├─ Tipo: PURCHASE
├─ Razón: "Compra factura #789"
└─ Notas: "Proveedor XYZ"

═══════════════════════════════════════════════════════════
PASO 2: Sistema crea StockMovement
═══════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────┐
│ StockMovement                                   │
│ ├─ productId: "combo-id"                       │
│ ├─ userId: "cajero-id" (o admin-id)            │
│ ├─ type: PURCHASE                              │
│ ├─ quantity: +50                               │
│ ├─ previousStock: 18                           │
│ ├─ newStock: 68                                │
│ ├─ reason: "Compra factura #789"               │
│ └─ createdAt: "2024-01-15 10:00"              │
└─────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════
PASO 3: Producto actualizado
═══════════════════════════════════════════════════════════

┌─────────────────────────────────────┐
│ Product: Combo Familiar             │
│ stock: 68 (antes: 18)              │
│ ✅ Ya no alerta (68 > 20)          │
└─────────────────────────────────────┘
C. Tipos de Movimientos:
┌──────────────────────────────────────────────────────┐
│ PURCHASE      │ +N  │ Compra/Entrada de mercancía  │
│ SALE          │ -N  │ Venta (automático al vender) │
│ ADJUSTMENT    │ ±N  │ Ajuste manual de inventario  │
│ RETURN        │ +N  │ Devolución de cliente        │
│ DAMAGED       │ -N  │ Producto dañado/vencido      │
└──────────────────────────────────────────────────────┘
🛒 6. ÓRDENES Y VENTAS - FLUJO COMPLETO
═══════════════════════════════════════════════════════════
PASO 1: Usuario abre CAJA (ADMIN o CAJERO)
═══════════════════════════════════════════════════════════

┌─────────────────────────────────────┐
│ CashRegister                        │
│ ├─ userId: "cajero-juan"           │
│ ├─ openingAmount: 50,000           │
│ ├─ status: OPEN                    │
│ └─ openedAt: "08:00"               │
└─────────────────────────────────────┘

═══════════════════════════════════════════════════════════
PASO 2: Usuario crea ORDEN
═══════════════════════════════════════════════════════════

┌─────────────────────────────────────┐
│ Order                               │
│ ├─ orderNumber: "ORD-001"          │
│ ├─ userId: "cajero-juan"           │
│ ├─ cashRegisterId: "caja-123"      │
│ ├─ customerId: null (opcional)     │
│ └─ status: PENDING                 │
└─────────────────────────────────────┘

═══════════════════════════════════════════════════════════
PASO 3: Agrega PRODUCTOS
═══════════════════════════════════════════════════════════

┌─────────────────────────────────────┐
│ OrderItem #1                        │
│ ├─ productId: "combo-id"           │
│ ├─ quantity: 2                     │
│ ├─ unitPrice: 15,000               │
│ └─ total: 30,000                   │
└─────────────────────────────────────┘

═══════════════════════════════════════════════════════════
PASO 4: COMPLETA la orden
═══════════════════════════════════════════════════════════

┌─────────────────────────────────────┐
│ Order                               │
│ ├─ subtotal: 30,000                │
│ ├─ tax: 0                          │
│ ├─ total: 30,000                   │
│ ├─ paymentMethod: CASH             │
│ ├─ amountPaid: 50,000              │
│ ├─ change: 20,000                  │
│ └─ status: COMPLETED               │
└─────────────────────────────────────┘

═══════════════════════════════════════════════════════════
PASO 5: Sistema ACTUALIZA automáticamente
═══════════════════════════════════════════════════════════

A) StockMovement (SALE):
┌─────────────────────────────────────┐
│ type: SALE                          │
│ quantity: -2                        │
│ previousStock: 68                   │
│ newStock: 66                        │
│ reference: "ORD-001"                │
└─────────────────────────────────────┘

B) Product:
┌─────────────────────────────────────┐
│ stock: 66 (antes: 68)              │
└─────────────────────────────────────┘

C) CashRegister:
┌─────────────────────────────────────┐
│ totalSales: 30,000                 │
│ totalOrders: 1                     │
│ cashSales: 30,000                  │
└─────────────────────────────────────┘

═══════════════════════════════════════════════════════════
PASO 6: Usuario CIERRA CAJA
═══════════════════════════════════════════════════════════

Usuario cuenta efectivo: 80,000

┌─────────────────────────────────────┐
│ CashRegister                        │
│ ├─ closingAmount: 80,000           │ ← Contado
│ ├─ expectedAmount: 80,000          │ ← Calculado
│ │   (50,000 + 30,000)              │
│ ├─ difference: 0                   │ ← ✅ Cuadra
│ ├─ status: CLOSED                  │
│ └─ closedAt: "20:00"               │
└─────────────────────────────────────┘

📊 7. REPORTES Y MÉTRICAS
A. Reporte Diario:
┌─────────────────────────────────────────────────┐
│ DailySalesReport (2024-01-15)                   │
├─────────────────────────────────────────────────┤
│ totalSales: 125,450                             │
│ totalOrders: 87                                 │
│ averageTicket: 1,442 (total ÷ órdenes)         │
│ newCustomers: 12                                │
│                                                 │
│ cashSales: 75,000                               │
│ cardSales: 40,450                               │
│ transferSales: 10,000                           │
└─────────────────────────────────────────────────┘
B. Ventas por Hora:
┌─────────────────────────────────────┐
│ HourlySales (para gráfica)          │
├─────────────────────────────────────┤
│ hour: 8  → 5,000  (3 órdenes)      │
│ hour: 9  → 12,000 (8 órdenes)      │
│ hour: 10 → 18,000 (12 órdenes)     │
│ ... etc                             │
└─────────────────────────────────────┘
C. Top Productos:
┌─────────────────────────────────────────────────┐
│ TopProduct (2024-01-15)                         │
├─────────────────────────────────────────────────┤
│ 1. Combo Familiar: 45 unidades → $67,500       │
│ 2. Pollo Broaster: 38 unidades → $41,800       │
│ 3. Alitas BBQ: 32 unidades → $28,800           │
└─────────────────────────────────────────────────┘
🗺️ 8. MAPA DE RELACIONES COMPLETO
                    ┌─────────────┐
                    │    User     │
                    │ (Usuario)   │
                    │ ADMIN/CAJERO│
                    └──────┬──────┘
                           │
            ┌──────────────┼──────────────┬────────────────┐
            │              │              │                │
            ▼              ▼              ▼                ▼
    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
    │    Order     │  │CashRegister  │  │StockMovement │  │ ActivityLog  │
    │   (Orden)    │  │    (Caja)    │  │ (Inventario) │  │  (Auditoría) │
    └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────────────┘
           │                 │                 │
           │                 │                 │
           ├─────────────────┤                 │
           │                                   │
           ▼                                   ▼
    ┌──────────────┐                    ┌──────────────┐
    │  OrderItem   │                    │   Product    │
    │ (Item Orden) │───────────────────>│  (Producto)  │
    └──────────────┘                    └──────┬───────┘
                                               │
                                               ▼
    ┌──────────────┐                    ┌──────────────┐
    │   Customer   │                    │  Category    │
    │  (Cliente)   │                    │ (Categoría)  │
    └──────┬───────┘                    └──────────────┘
           │
           │
           ▼
    ┌──────────────┐
    │    Order     │
    │   (Orden)    │
    └──────────────┘

REPORTES (generados desde órdenes):
    ┌──────────────────┐  ┌──────────────┐  ┌──────────────┐
    │ DailySalesReport │  │ HourlySales  │  │  TopProduct  │
    └──────────────────┘  └──────────────┘  └──────────────┘

CONFIGURACIÓN:
    ┌──────────────┐
    │SystemConfig  │
    └──────────────┘
✅ 9. VERIFICACIÓN DE COHERENCIA
Sin fugas - Todo está conectado:
✅ Usuario → Puede ser ADMIN o CAJERO
✅ CAJERO → Puede hacer TODO excepto gestionar usuarios
✅ Categoría → Creada por ADMIN o CAJERO
✅ Producto → Creado por ADMIN o CAJERO, vinculado a categoría
✅ Stock → Controlado con minStock (alerta automática)
✅ StockMovement → Registro de TODO cambio de inventario (quién, cuándo, cuánto)
✅ Order → Creada por ADMIN o CAJERO, vinculada a caja y usuario
✅ OrderItem → Reduce stock automáticamente al completar orden
✅ CashRegister → Manejada por ADMIN o CAJERO, calcula descuadres
✅ Reportes → Generados desde órdenes completadas
✅ ActivityLog → Auditoría completa de acciones