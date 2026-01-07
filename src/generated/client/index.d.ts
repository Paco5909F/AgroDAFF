
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Usuario
 * 
 */
export type Usuario = $Result.DefaultSelection<Prisma.$UsuarioPayload>
/**
 * Model Cliente
 * 
 */
export type Cliente = $Result.DefaultSelection<Prisma.$ClientePayload>
/**
 * Model Establecimiento
 * 
 */
export type Establecimiento = $Result.DefaultSelection<Prisma.$EstablecimientoPayload>
/**
 * Model Lote
 * 
 */
export type Lote = $Result.DefaultSelection<Prisma.$LotePayload>
/**
 * Model Servicio
 * 
 */
export type Servicio = $Result.DefaultSelection<Prisma.$ServicioPayload>
/**
 * Model OrdenTrabajo
 * 
 */
export type OrdenTrabajo = $Result.DefaultSelection<Prisma.$OrdenTrabajoPayload>
/**
 * Model Factura
 * 
 */
export type Factura = $Result.DefaultSelection<Prisma.$FacturaPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const UserRole: {
  admin: 'admin',
  operario: 'operario',
  cliente: 'cliente'
};

export type UserRole = (typeof UserRole)[keyof typeof UserRole]


export const OrderStatus: {
  pendiente: 'pendiente',
  en_proceso: 'en_proceso',
  completada: 'completada',
  cancelada: 'cancelada',
  facturada: 'facturada'
};

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus]

}

export type UserRole = $Enums.UserRole

export const UserRole: typeof $Enums.UserRole

export type OrderStatus = $Enums.OrderStatus

export const OrderStatus: typeof $Enums.OrderStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Usuarios
 * const usuarios = await prisma.usuario.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Usuarios
   * const usuarios = await prisma.usuario.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.usuario`: Exposes CRUD operations for the **Usuario** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Usuarios
    * const usuarios = await prisma.usuario.findMany()
    * ```
    */
  get usuario(): Prisma.UsuarioDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.cliente`: Exposes CRUD operations for the **Cliente** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Clientes
    * const clientes = await prisma.cliente.findMany()
    * ```
    */
  get cliente(): Prisma.ClienteDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.establecimiento`: Exposes CRUD operations for the **Establecimiento** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Establecimientos
    * const establecimientos = await prisma.establecimiento.findMany()
    * ```
    */
  get establecimiento(): Prisma.EstablecimientoDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.lote`: Exposes CRUD operations for the **Lote** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Lotes
    * const lotes = await prisma.lote.findMany()
    * ```
    */
  get lote(): Prisma.LoteDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.servicio`: Exposes CRUD operations for the **Servicio** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Servicios
    * const servicios = await prisma.servicio.findMany()
    * ```
    */
  get servicio(): Prisma.ServicioDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.ordenTrabajo`: Exposes CRUD operations for the **OrdenTrabajo** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more OrdenTrabajos
    * const ordenTrabajos = await prisma.ordenTrabajo.findMany()
    * ```
    */
  get ordenTrabajo(): Prisma.OrdenTrabajoDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.factura`: Exposes CRUD operations for the **Factura** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Facturas
    * const facturas = await prisma.factura.findMany()
    * ```
    */
  get factura(): Prisma.FacturaDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.2.0
   * Query Engine version: 0c8ef2ce45c83248ab3df073180d5eda9e8be7a3
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Usuario: 'Usuario',
    Cliente: 'Cliente',
    Establecimiento: 'Establecimiento',
    Lote: 'Lote',
    Servicio: 'Servicio',
    OrdenTrabajo: 'OrdenTrabajo',
    Factura: 'Factura'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "usuario" | "cliente" | "establecimiento" | "lote" | "servicio" | "ordenTrabajo" | "factura"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Usuario: {
        payload: Prisma.$UsuarioPayload<ExtArgs>
        fields: Prisma.UsuarioFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UsuarioFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UsuarioFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>
          }
          findFirst: {
            args: Prisma.UsuarioFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UsuarioFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>
          }
          findMany: {
            args: Prisma.UsuarioFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>[]
          }
          create: {
            args: Prisma.UsuarioCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>
          }
          createMany: {
            args: Prisma.UsuarioCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UsuarioCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>[]
          }
          delete: {
            args: Prisma.UsuarioDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>
          }
          update: {
            args: Prisma.UsuarioUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>
          }
          deleteMany: {
            args: Prisma.UsuarioDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UsuarioUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UsuarioUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>[]
          }
          upsert: {
            args: Prisma.UsuarioUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>
          }
          aggregate: {
            args: Prisma.UsuarioAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUsuario>
          }
          groupBy: {
            args: Prisma.UsuarioGroupByArgs<ExtArgs>
            result: $Utils.Optional<UsuarioGroupByOutputType>[]
          }
          count: {
            args: Prisma.UsuarioCountArgs<ExtArgs>
            result: $Utils.Optional<UsuarioCountAggregateOutputType> | number
          }
        }
      }
      Cliente: {
        payload: Prisma.$ClientePayload<ExtArgs>
        fields: Prisma.ClienteFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ClienteFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ClienteFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientePayload>
          }
          findFirst: {
            args: Prisma.ClienteFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ClienteFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientePayload>
          }
          findMany: {
            args: Prisma.ClienteFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientePayload>[]
          }
          create: {
            args: Prisma.ClienteCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientePayload>
          }
          createMany: {
            args: Prisma.ClienteCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ClienteCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientePayload>[]
          }
          delete: {
            args: Prisma.ClienteDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientePayload>
          }
          update: {
            args: Prisma.ClienteUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientePayload>
          }
          deleteMany: {
            args: Prisma.ClienteDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ClienteUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ClienteUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientePayload>[]
          }
          upsert: {
            args: Prisma.ClienteUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientePayload>
          }
          aggregate: {
            args: Prisma.ClienteAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCliente>
          }
          groupBy: {
            args: Prisma.ClienteGroupByArgs<ExtArgs>
            result: $Utils.Optional<ClienteGroupByOutputType>[]
          }
          count: {
            args: Prisma.ClienteCountArgs<ExtArgs>
            result: $Utils.Optional<ClienteCountAggregateOutputType> | number
          }
        }
      }
      Establecimiento: {
        payload: Prisma.$EstablecimientoPayload<ExtArgs>
        fields: Prisma.EstablecimientoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EstablecimientoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EstablecimientoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EstablecimientoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EstablecimientoPayload>
          }
          findFirst: {
            args: Prisma.EstablecimientoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EstablecimientoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EstablecimientoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EstablecimientoPayload>
          }
          findMany: {
            args: Prisma.EstablecimientoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EstablecimientoPayload>[]
          }
          create: {
            args: Prisma.EstablecimientoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EstablecimientoPayload>
          }
          createMany: {
            args: Prisma.EstablecimientoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EstablecimientoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EstablecimientoPayload>[]
          }
          delete: {
            args: Prisma.EstablecimientoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EstablecimientoPayload>
          }
          update: {
            args: Prisma.EstablecimientoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EstablecimientoPayload>
          }
          deleteMany: {
            args: Prisma.EstablecimientoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EstablecimientoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.EstablecimientoUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EstablecimientoPayload>[]
          }
          upsert: {
            args: Prisma.EstablecimientoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EstablecimientoPayload>
          }
          aggregate: {
            args: Prisma.EstablecimientoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEstablecimiento>
          }
          groupBy: {
            args: Prisma.EstablecimientoGroupByArgs<ExtArgs>
            result: $Utils.Optional<EstablecimientoGroupByOutputType>[]
          }
          count: {
            args: Prisma.EstablecimientoCountArgs<ExtArgs>
            result: $Utils.Optional<EstablecimientoCountAggregateOutputType> | number
          }
        }
      }
      Lote: {
        payload: Prisma.$LotePayload<ExtArgs>
        fields: Prisma.LoteFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LoteFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LotePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LoteFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LotePayload>
          }
          findFirst: {
            args: Prisma.LoteFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LotePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LoteFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LotePayload>
          }
          findMany: {
            args: Prisma.LoteFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LotePayload>[]
          }
          create: {
            args: Prisma.LoteCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LotePayload>
          }
          createMany: {
            args: Prisma.LoteCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LoteCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LotePayload>[]
          }
          delete: {
            args: Prisma.LoteDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LotePayload>
          }
          update: {
            args: Prisma.LoteUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LotePayload>
          }
          deleteMany: {
            args: Prisma.LoteDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LoteUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LoteUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LotePayload>[]
          }
          upsert: {
            args: Prisma.LoteUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LotePayload>
          }
          aggregate: {
            args: Prisma.LoteAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLote>
          }
          groupBy: {
            args: Prisma.LoteGroupByArgs<ExtArgs>
            result: $Utils.Optional<LoteGroupByOutputType>[]
          }
          count: {
            args: Prisma.LoteCountArgs<ExtArgs>
            result: $Utils.Optional<LoteCountAggregateOutputType> | number
          }
        }
      }
      Servicio: {
        payload: Prisma.$ServicioPayload<ExtArgs>
        fields: Prisma.ServicioFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ServicioFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServicioPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ServicioFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServicioPayload>
          }
          findFirst: {
            args: Prisma.ServicioFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServicioPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ServicioFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServicioPayload>
          }
          findMany: {
            args: Prisma.ServicioFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServicioPayload>[]
          }
          create: {
            args: Prisma.ServicioCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServicioPayload>
          }
          createMany: {
            args: Prisma.ServicioCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ServicioCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServicioPayload>[]
          }
          delete: {
            args: Prisma.ServicioDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServicioPayload>
          }
          update: {
            args: Prisma.ServicioUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServicioPayload>
          }
          deleteMany: {
            args: Prisma.ServicioDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ServicioUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ServicioUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServicioPayload>[]
          }
          upsert: {
            args: Prisma.ServicioUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServicioPayload>
          }
          aggregate: {
            args: Prisma.ServicioAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateServicio>
          }
          groupBy: {
            args: Prisma.ServicioGroupByArgs<ExtArgs>
            result: $Utils.Optional<ServicioGroupByOutputType>[]
          }
          count: {
            args: Prisma.ServicioCountArgs<ExtArgs>
            result: $Utils.Optional<ServicioCountAggregateOutputType> | number
          }
        }
      }
      OrdenTrabajo: {
        payload: Prisma.$OrdenTrabajoPayload<ExtArgs>
        fields: Prisma.OrdenTrabajoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OrdenTrabajoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrdenTrabajoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OrdenTrabajoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrdenTrabajoPayload>
          }
          findFirst: {
            args: Prisma.OrdenTrabajoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrdenTrabajoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OrdenTrabajoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrdenTrabajoPayload>
          }
          findMany: {
            args: Prisma.OrdenTrabajoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrdenTrabajoPayload>[]
          }
          create: {
            args: Prisma.OrdenTrabajoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrdenTrabajoPayload>
          }
          createMany: {
            args: Prisma.OrdenTrabajoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OrdenTrabajoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrdenTrabajoPayload>[]
          }
          delete: {
            args: Prisma.OrdenTrabajoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrdenTrabajoPayload>
          }
          update: {
            args: Prisma.OrdenTrabajoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrdenTrabajoPayload>
          }
          deleteMany: {
            args: Prisma.OrdenTrabajoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OrdenTrabajoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.OrdenTrabajoUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrdenTrabajoPayload>[]
          }
          upsert: {
            args: Prisma.OrdenTrabajoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrdenTrabajoPayload>
          }
          aggregate: {
            args: Prisma.OrdenTrabajoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOrdenTrabajo>
          }
          groupBy: {
            args: Prisma.OrdenTrabajoGroupByArgs<ExtArgs>
            result: $Utils.Optional<OrdenTrabajoGroupByOutputType>[]
          }
          count: {
            args: Prisma.OrdenTrabajoCountArgs<ExtArgs>
            result: $Utils.Optional<OrdenTrabajoCountAggregateOutputType> | number
          }
        }
      }
      Factura: {
        payload: Prisma.$FacturaPayload<ExtArgs>
        fields: Prisma.FacturaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FacturaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FacturaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FacturaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FacturaPayload>
          }
          findFirst: {
            args: Prisma.FacturaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FacturaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FacturaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FacturaPayload>
          }
          findMany: {
            args: Prisma.FacturaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FacturaPayload>[]
          }
          create: {
            args: Prisma.FacturaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FacturaPayload>
          }
          createMany: {
            args: Prisma.FacturaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FacturaCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FacturaPayload>[]
          }
          delete: {
            args: Prisma.FacturaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FacturaPayload>
          }
          update: {
            args: Prisma.FacturaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FacturaPayload>
          }
          deleteMany: {
            args: Prisma.FacturaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FacturaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FacturaUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FacturaPayload>[]
          }
          upsert: {
            args: Prisma.FacturaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FacturaPayload>
          }
          aggregate: {
            args: Prisma.FacturaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFactura>
          }
          groupBy: {
            args: Prisma.FacturaGroupByArgs<ExtArgs>
            result: $Utils.Optional<FacturaGroupByOutputType>[]
          }
          count: {
            args: Prisma.FacturaCountArgs<ExtArgs>
            result: $Utils.Optional<FacturaCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    usuario?: UsuarioOmit
    cliente?: ClienteOmit
    establecimiento?: EstablecimientoOmit
    lote?: LoteOmit
    servicio?: ServicioOmit
    ordenTrabajo?: OrdenTrabajoOmit
    factura?: FacturaOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type ClienteCountOutputType
   */

  export type ClienteCountOutputType = {
    establecimientos: number
    ordenes: number
  }

  export type ClienteCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    establecimientos?: boolean | ClienteCountOutputTypeCountEstablecimientosArgs
    ordenes?: boolean | ClienteCountOutputTypeCountOrdenesArgs
  }

  // Custom InputTypes
  /**
   * ClienteCountOutputType without action
   */
  export type ClienteCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClienteCountOutputType
     */
    select?: ClienteCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ClienteCountOutputType without action
   */
  export type ClienteCountOutputTypeCountEstablecimientosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EstablecimientoWhereInput
  }

  /**
   * ClienteCountOutputType without action
   */
  export type ClienteCountOutputTypeCountOrdenesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrdenTrabajoWhereInput
  }


  /**
   * Count Type EstablecimientoCountOutputType
   */

  export type EstablecimientoCountOutputType = {
    lotes: number
  }

  export type EstablecimientoCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lotes?: boolean | EstablecimientoCountOutputTypeCountLotesArgs
  }

  // Custom InputTypes
  /**
   * EstablecimientoCountOutputType without action
   */
  export type EstablecimientoCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EstablecimientoCountOutputType
     */
    select?: EstablecimientoCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * EstablecimientoCountOutputType without action
   */
  export type EstablecimientoCountOutputTypeCountLotesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LoteWhereInput
  }


  /**
   * Count Type LoteCountOutputType
   */

  export type LoteCountOutputType = {
    ordenes: number
  }

  export type LoteCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ordenes?: boolean | LoteCountOutputTypeCountOrdenesArgs
  }

  // Custom InputTypes
  /**
   * LoteCountOutputType without action
   */
  export type LoteCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoteCountOutputType
     */
    select?: LoteCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * LoteCountOutputType without action
   */
  export type LoteCountOutputTypeCountOrdenesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrdenTrabajoWhereInput
  }


  /**
   * Count Type ServicioCountOutputType
   */

  export type ServicioCountOutputType = {
    ordenes: number
  }

  export type ServicioCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ordenes?: boolean | ServicioCountOutputTypeCountOrdenesArgs
  }

  // Custom InputTypes
  /**
   * ServicioCountOutputType without action
   */
  export type ServicioCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServicioCountOutputType
     */
    select?: ServicioCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ServicioCountOutputType without action
   */
  export type ServicioCountOutputTypeCountOrdenesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrdenTrabajoWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Usuario
   */

  export type AggregateUsuario = {
    _count: UsuarioCountAggregateOutputType | null
    _min: UsuarioMinAggregateOutputType | null
    _max: UsuarioMaxAggregateOutputType | null
  }

  export type UsuarioMinAggregateOutputType = {
    id: string | null
    nombre: string | null
    rol: $Enums.UserRole | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type UsuarioMaxAggregateOutputType = {
    id: string | null
    nombre: string | null
    rol: $Enums.UserRole | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type UsuarioCountAggregateOutputType = {
    id: number
    nombre: number
    rol: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type UsuarioMinAggregateInputType = {
    id?: true
    nombre?: true
    rol?: true
    created_at?: true
    updated_at?: true
  }

  export type UsuarioMaxAggregateInputType = {
    id?: true
    nombre?: true
    rol?: true
    created_at?: true
    updated_at?: true
  }

  export type UsuarioCountAggregateInputType = {
    id?: true
    nombre?: true
    rol?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type UsuarioAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Usuario to aggregate.
     */
    where?: UsuarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Usuarios to fetch.
     */
    orderBy?: UsuarioOrderByWithRelationInput | UsuarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UsuarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Usuarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Usuarios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Usuarios
    **/
    _count?: true | UsuarioCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UsuarioMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UsuarioMaxAggregateInputType
  }

  export type GetUsuarioAggregateType<T extends UsuarioAggregateArgs> = {
        [P in keyof T & keyof AggregateUsuario]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUsuario[P]>
      : GetScalarType<T[P], AggregateUsuario[P]>
  }




  export type UsuarioGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UsuarioWhereInput
    orderBy?: UsuarioOrderByWithAggregationInput | UsuarioOrderByWithAggregationInput[]
    by: UsuarioScalarFieldEnum[] | UsuarioScalarFieldEnum
    having?: UsuarioScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UsuarioCountAggregateInputType | true
    _min?: UsuarioMinAggregateInputType
    _max?: UsuarioMaxAggregateInputType
  }

  export type UsuarioGroupByOutputType = {
    id: string
    nombre: string
    rol: $Enums.UserRole
    created_at: Date
    updated_at: Date
    _count: UsuarioCountAggregateOutputType | null
    _min: UsuarioMinAggregateOutputType | null
    _max: UsuarioMaxAggregateOutputType | null
  }

  type GetUsuarioGroupByPayload<T extends UsuarioGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UsuarioGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UsuarioGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UsuarioGroupByOutputType[P]>
            : GetScalarType<T[P], UsuarioGroupByOutputType[P]>
        }
      >
    >


  export type UsuarioSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    rol?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["usuario"]>

  export type UsuarioSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    rol?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["usuario"]>

  export type UsuarioSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    rol?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["usuario"]>

  export type UsuarioSelectScalar = {
    id?: boolean
    nombre?: boolean
    rol?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type UsuarioOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "nombre" | "rol" | "created_at" | "updated_at", ExtArgs["result"]["usuario"]>

  export type $UsuarioPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Usuario"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      nombre: string
      rol: $Enums.UserRole
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["usuario"]>
    composites: {}
  }

  type UsuarioGetPayload<S extends boolean | null | undefined | UsuarioDefaultArgs> = $Result.GetResult<Prisma.$UsuarioPayload, S>

  type UsuarioCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UsuarioFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UsuarioCountAggregateInputType | true
    }

  export interface UsuarioDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Usuario'], meta: { name: 'Usuario' } }
    /**
     * Find zero or one Usuario that matches the filter.
     * @param {UsuarioFindUniqueArgs} args - Arguments to find a Usuario
     * @example
     * // Get one Usuario
     * const usuario = await prisma.usuario.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UsuarioFindUniqueArgs>(args: SelectSubset<T, UsuarioFindUniqueArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Usuario that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UsuarioFindUniqueOrThrowArgs} args - Arguments to find a Usuario
     * @example
     * // Get one Usuario
     * const usuario = await prisma.usuario.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UsuarioFindUniqueOrThrowArgs>(args: SelectSubset<T, UsuarioFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Usuario that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioFindFirstArgs} args - Arguments to find a Usuario
     * @example
     * // Get one Usuario
     * const usuario = await prisma.usuario.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UsuarioFindFirstArgs>(args?: SelectSubset<T, UsuarioFindFirstArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Usuario that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioFindFirstOrThrowArgs} args - Arguments to find a Usuario
     * @example
     * // Get one Usuario
     * const usuario = await prisma.usuario.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UsuarioFindFirstOrThrowArgs>(args?: SelectSubset<T, UsuarioFindFirstOrThrowArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Usuarios that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Usuarios
     * const usuarios = await prisma.usuario.findMany()
     * 
     * // Get first 10 Usuarios
     * const usuarios = await prisma.usuario.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const usuarioWithIdOnly = await prisma.usuario.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UsuarioFindManyArgs>(args?: SelectSubset<T, UsuarioFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Usuario.
     * @param {UsuarioCreateArgs} args - Arguments to create a Usuario.
     * @example
     * // Create one Usuario
     * const Usuario = await prisma.usuario.create({
     *   data: {
     *     // ... data to create a Usuario
     *   }
     * })
     * 
     */
    create<T extends UsuarioCreateArgs>(args: SelectSubset<T, UsuarioCreateArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Usuarios.
     * @param {UsuarioCreateManyArgs} args - Arguments to create many Usuarios.
     * @example
     * // Create many Usuarios
     * const usuario = await prisma.usuario.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UsuarioCreateManyArgs>(args?: SelectSubset<T, UsuarioCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Usuarios and returns the data saved in the database.
     * @param {UsuarioCreateManyAndReturnArgs} args - Arguments to create many Usuarios.
     * @example
     * // Create many Usuarios
     * const usuario = await prisma.usuario.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Usuarios and only return the `id`
     * const usuarioWithIdOnly = await prisma.usuario.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UsuarioCreateManyAndReturnArgs>(args?: SelectSubset<T, UsuarioCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Usuario.
     * @param {UsuarioDeleteArgs} args - Arguments to delete one Usuario.
     * @example
     * // Delete one Usuario
     * const Usuario = await prisma.usuario.delete({
     *   where: {
     *     // ... filter to delete one Usuario
     *   }
     * })
     * 
     */
    delete<T extends UsuarioDeleteArgs>(args: SelectSubset<T, UsuarioDeleteArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Usuario.
     * @param {UsuarioUpdateArgs} args - Arguments to update one Usuario.
     * @example
     * // Update one Usuario
     * const usuario = await prisma.usuario.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UsuarioUpdateArgs>(args: SelectSubset<T, UsuarioUpdateArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Usuarios.
     * @param {UsuarioDeleteManyArgs} args - Arguments to filter Usuarios to delete.
     * @example
     * // Delete a few Usuarios
     * const { count } = await prisma.usuario.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UsuarioDeleteManyArgs>(args?: SelectSubset<T, UsuarioDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Usuarios.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Usuarios
     * const usuario = await prisma.usuario.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UsuarioUpdateManyArgs>(args: SelectSubset<T, UsuarioUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Usuarios and returns the data updated in the database.
     * @param {UsuarioUpdateManyAndReturnArgs} args - Arguments to update many Usuarios.
     * @example
     * // Update many Usuarios
     * const usuario = await prisma.usuario.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Usuarios and only return the `id`
     * const usuarioWithIdOnly = await prisma.usuario.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UsuarioUpdateManyAndReturnArgs>(args: SelectSubset<T, UsuarioUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Usuario.
     * @param {UsuarioUpsertArgs} args - Arguments to update or create a Usuario.
     * @example
     * // Update or create a Usuario
     * const usuario = await prisma.usuario.upsert({
     *   create: {
     *     // ... data to create a Usuario
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Usuario we want to update
     *   }
     * })
     */
    upsert<T extends UsuarioUpsertArgs>(args: SelectSubset<T, UsuarioUpsertArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Usuarios.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioCountArgs} args - Arguments to filter Usuarios to count.
     * @example
     * // Count the number of Usuarios
     * const count = await prisma.usuario.count({
     *   where: {
     *     // ... the filter for the Usuarios we want to count
     *   }
     * })
    **/
    count<T extends UsuarioCountArgs>(
      args?: Subset<T, UsuarioCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UsuarioCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Usuario.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UsuarioAggregateArgs>(args: Subset<T, UsuarioAggregateArgs>): Prisma.PrismaPromise<GetUsuarioAggregateType<T>>

    /**
     * Group by Usuario.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UsuarioGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UsuarioGroupByArgs['orderBy'] }
        : { orderBy?: UsuarioGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UsuarioGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUsuarioGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Usuario model
   */
  readonly fields: UsuarioFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Usuario.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UsuarioClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Usuario model
   */
  interface UsuarioFieldRefs {
    readonly id: FieldRef<"Usuario", 'String'>
    readonly nombre: FieldRef<"Usuario", 'String'>
    readonly rol: FieldRef<"Usuario", 'UserRole'>
    readonly created_at: FieldRef<"Usuario", 'DateTime'>
    readonly updated_at: FieldRef<"Usuario", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Usuario findUnique
   */
  export type UsuarioFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Filter, which Usuario to fetch.
     */
    where: UsuarioWhereUniqueInput
  }

  /**
   * Usuario findUniqueOrThrow
   */
  export type UsuarioFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Filter, which Usuario to fetch.
     */
    where: UsuarioWhereUniqueInput
  }

  /**
   * Usuario findFirst
   */
  export type UsuarioFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Filter, which Usuario to fetch.
     */
    where?: UsuarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Usuarios to fetch.
     */
    orderBy?: UsuarioOrderByWithRelationInput | UsuarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Usuarios.
     */
    cursor?: UsuarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Usuarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Usuarios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Usuarios.
     */
    distinct?: UsuarioScalarFieldEnum | UsuarioScalarFieldEnum[]
  }

  /**
   * Usuario findFirstOrThrow
   */
  export type UsuarioFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Filter, which Usuario to fetch.
     */
    where?: UsuarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Usuarios to fetch.
     */
    orderBy?: UsuarioOrderByWithRelationInput | UsuarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Usuarios.
     */
    cursor?: UsuarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Usuarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Usuarios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Usuarios.
     */
    distinct?: UsuarioScalarFieldEnum | UsuarioScalarFieldEnum[]
  }

  /**
   * Usuario findMany
   */
  export type UsuarioFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Filter, which Usuarios to fetch.
     */
    where?: UsuarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Usuarios to fetch.
     */
    orderBy?: UsuarioOrderByWithRelationInput | UsuarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Usuarios.
     */
    cursor?: UsuarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Usuarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Usuarios.
     */
    skip?: number
    distinct?: UsuarioScalarFieldEnum | UsuarioScalarFieldEnum[]
  }

  /**
   * Usuario create
   */
  export type UsuarioCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * The data needed to create a Usuario.
     */
    data: XOR<UsuarioCreateInput, UsuarioUncheckedCreateInput>
  }

  /**
   * Usuario createMany
   */
  export type UsuarioCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Usuarios.
     */
    data: UsuarioCreateManyInput | UsuarioCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Usuario createManyAndReturn
   */
  export type UsuarioCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * The data used to create many Usuarios.
     */
    data: UsuarioCreateManyInput | UsuarioCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Usuario update
   */
  export type UsuarioUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * The data needed to update a Usuario.
     */
    data: XOR<UsuarioUpdateInput, UsuarioUncheckedUpdateInput>
    /**
     * Choose, which Usuario to update.
     */
    where: UsuarioWhereUniqueInput
  }

  /**
   * Usuario updateMany
   */
  export type UsuarioUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Usuarios.
     */
    data: XOR<UsuarioUpdateManyMutationInput, UsuarioUncheckedUpdateManyInput>
    /**
     * Filter which Usuarios to update
     */
    where?: UsuarioWhereInput
    /**
     * Limit how many Usuarios to update.
     */
    limit?: number
  }

  /**
   * Usuario updateManyAndReturn
   */
  export type UsuarioUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * The data used to update Usuarios.
     */
    data: XOR<UsuarioUpdateManyMutationInput, UsuarioUncheckedUpdateManyInput>
    /**
     * Filter which Usuarios to update
     */
    where?: UsuarioWhereInput
    /**
     * Limit how many Usuarios to update.
     */
    limit?: number
  }

  /**
   * Usuario upsert
   */
  export type UsuarioUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * The filter to search for the Usuario to update in case it exists.
     */
    where: UsuarioWhereUniqueInput
    /**
     * In case the Usuario found by the `where` argument doesn't exist, create a new Usuario with this data.
     */
    create: XOR<UsuarioCreateInput, UsuarioUncheckedCreateInput>
    /**
     * In case the Usuario was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UsuarioUpdateInput, UsuarioUncheckedUpdateInput>
  }

  /**
   * Usuario delete
   */
  export type UsuarioDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Filter which Usuario to delete.
     */
    where: UsuarioWhereUniqueInput
  }

  /**
   * Usuario deleteMany
   */
  export type UsuarioDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Usuarios to delete
     */
    where?: UsuarioWhereInput
    /**
     * Limit how many Usuarios to delete.
     */
    limit?: number
  }

  /**
   * Usuario without action
   */
  export type UsuarioDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
  }


  /**
   * Model Cliente
   */

  export type AggregateCliente = {
    _count: ClienteCountAggregateOutputType | null
    _min: ClienteMinAggregateOutputType | null
    _max: ClienteMaxAggregateOutputType | null
  }

  export type ClienteMinAggregateOutputType = {
    id: string | null
    razon_social: string | null
    cuit: string | null
    condicion_iva: string | null
    email: string | null
    telefono: string | null
    localidad_id: string | null
    created_at: Date | null
    updated_at: Date | null
    deleted_at: Date | null
  }

  export type ClienteMaxAggregateOutputType = {
    id: string | null
    razon_social: string | null
    cuit: string | null
    condicion_iva: string | null
    email: string | null
    telefono: string | null
    localidad_id: string | null
    created_at: Date | null
    updated_at: Date | null
    deleted_at: Date | null
  }

  export type ClienteCountAggregateOutputType = {
    id: number
    razon_social: number
    cuit: number
    condicion_iva: number
    email: number
    telefono: number
    localidad_id: number
    created_at: number
    updated_at: number
    deleted_at: number
    _all: number
  }


  export type ClienteMinAggregateInputType = {
    id?: true
    razon_social?: true
    cuit?: true
    condicion_iva?: true
    email?: true
    telefono?: true
    localidad_id?: true
    created_at?: true
    updated_at?: true
    deleted_at?: true
  }

  export type ClienteMaxAggregateInputType = {
    id?: true
    razon_social?: true
    cuit?: true
    condicion_iva?: true
    email?: true
    telefono?: true
    localidad_id?: true
    created_at?: true
    updated_at?: true
    deleted_at?: true
  }

  export type ClienteCountAggregateInputType = {
    id?: true
    razon_social?: true
    cuit?: true
    condicion_iva?: true
    email?: true
    telefono?: true
    localidad_id?: true
    created_at?: true
    updated_at?: true
    deleted_at?: true
    _all?: true
  }

  export type ClienteAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Cliente to aggregate.
     */
    where?: ClienteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clientes to fetch.
     */
    orderBy?: ClienteOrderByWithRelationInput | ClienteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ClienteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clientes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clientes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Clientes
    **/
    _count?: true | ClienteCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ClienteMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ClienteMaxAggregateInputType
  }

  export type GetClienteAggregateType<T extends ClienteAggregateArgs> = {
        [P in keyof T & keyof AggregateCliente]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCliente[P]>
      : GetScalarType<T[P], AggregateCliente[P]>
  }




  export type ClienteGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClienteWhereInput
    orderBy?: ClienteOrderByWithAggregationInput | ClienteOrderByWithAggregationInput[]
    by: ClienteScalarFieldEnum[] | ClienteScalarFieldEnum
    having?: ClienteScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ClienteCountAggregateInputType | true
    _min?: ClienteMinAggregateInputType
    _max?: ClienteMaxAggregateInputType
  }

  export type ClienteGroupByOutputType = {
    id: string
    razon_social: string
    cuit: string
    condicion_iva: string
    email: string | null
    telefono: string | null
    localidad_id: string | null
    created_at: Date
    updated_at: Date
    deleted_at: Date | null
    _count: ClienteCountAggregateOutputType | null
    _min: ClienteMinAggregateOutputType | null
    _max: ClienteMaxAggregateOutputType | null
  }

  type GetClienteGroupByPayload<T extends ClienteGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ClienteGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ClienteGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ClienteGroupByOutputType[P]>
            : GetScalarType<T[P], ClienteGroupByOutputType[P]>
        }
      >
    >


  export type ClienteSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    razon_social?: boolean
    cuit?: boolean
    condicion_iva?: boolean
    email?: boolean
    telefono?: boolean
    localidad_id?: boolean
    created_at?: boolean
    updated_at?: boolean
    deleted_at?: boolean
    establecimientos?: boolean | Cliente$establecimientosArgs<ExtArgs>
    ordenes?: boolean | Cliente$ordenesArgs<ExtArgs>
    _count?: boolean | ClienteCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["cliente"]>

  export type ClienteSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    razon_social?: boolean
    cuit?: boolean
    condicion_iva?: boolean
    email?: boolean
    telefono?: boolean
    localidad_id?: boolean
    created_at?: boolean
    updated_at?: boolean
    deleted_at?: boolean
  }, ExtArgs["result"]["cliente"]>

  export type ClienteSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    razon_social?: boolean
    cuit?: boolean
    condicion_iva?: boolean
    email?: boolean
    telefono?: boolean
    localidad_id?: boolean
    created_at?: boolean
    updated_at?: boolean
    deleted_at?: boolean
  }, ExtArgs["result"]["cliente"]>

  export type ClienteSelectScalar = {
    id?: boolean
    razon_social?: boolean
    cuit?: boolean
    condicion_iva?: boolean
    email?: boolean
    telefono?: boolean
    localidad_id?: boolean
    created_at?: boolean
    updated_at?: boolean
    deleted_at?: boolean
  }

  export type ClienteOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "razon_social" | "cuit" | "condicion_iva" | "email" | "telefono" | "localidad_id" | "created_at" | "updated_at" | "deleted_at", ExtArgs["result"]["cliente"]>
  export type ClienteInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    establecimientos?: boolean | Cliente$establecimientosArgs<ExtArgs>
    ordenes?: boolean | Cliente$ordenesArgs<ExtArgs>
    _count?: boolean | ClienteCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ClienteIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type ClienteIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ClientePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Cliente"
    objects: {
      establecimientos: Prisma.$EstablecimientoPayload<ExtArgs>[]
      ordenes: Prisma.$OrdenTrabajoPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      razon_social: string
      cuit: string
      condicion_iva: string
      email: string | null
      telefono: string | null
      localidad_id: string | null
      created_at: Date
      updated_at: Date
      deleted_at: Date | null
    }, ExtArgs["result"]["cliente"]>
    composites: {}
  }

  type ClienteGetPayload<S extends boolean | null | undefined | ClienteDefaultArgs> = $Result.GetResult<Prisma.$ClientePayload, S>

  type ClienteCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ClienteFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ClienteCountAggregateInputType | true
    }

  export interface ClienteDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Cliente'], meta: { name: 'Cliente' } }
    /**
     * Find zero or one Cliente that matches the filter.
     * @param {ClienteFindUniqueArgs} args - Arguments to find a Cliente
     * @example
     * // Get one Cliente
     * const cliente = await prisma.cliente.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ClienteFindUniqueArgs>(args: SelectSubset<T, ClienteFindUniqueArgs<ExtArgs>>): Prisma__ClienteClient<$Result.GetResult<Prisma.$ClientePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Cliente that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ClienteFindUniqueOrThrowArgs} args - Arguments to find a Cliente
     * @example
     * // Get one Cliente
     * const cliente = await prisma.cliente.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ClienteFindUniqueOrThrowArgs>(args: SelectSubset<T, ClienteFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ClienteClient<$Result.GetResult<Prisma.$ClientePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Cliente that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClienteFindFirstArgs} args - Arguments to find a Cliente
     * @example
     * // Get one Cliente
     * const cliente = await prisma.cliente.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ClienteFindFirstArgs>(args?: SelectSubset<T, ClienteFindFirstArgs<ExtArgs>>): Prisma__ClienteClient<$Result.GetResult<Prisma.$ClientePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Cliente that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClienteFindFirstOrThrowArgs} args - Arguments to find a Cliente
     * @example
     * // Get one Cliente
     * const cliente = await prisma.cliente.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ClienteFindFirstOrThrowArgs>(args?: SelectSubset<T, ClienteFindFirstOrThrowArgs<ExtArgs>>): Prisma__ClienteClient<$Result.GetResult<Prisma.$ClientePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Clientes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClienteFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Clientes
     * const clientes = await prisma.cliente.findMany()
     * 
     * // Get first 10 Clientes
     * const clientes = await prisma.cliente.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const clienteWithIdOnly = await prisma.cliente.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ClienteFindManyArgs>(args?: SelectSubset<T, ClienteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClientePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Cliente.
     * @param {ClienteCreateArgs} args - Arguments to create a Cliente.
     * @example
     * // Create one Cliente
     * const Cliente = await prisma.cliente.create({
     *   data: {
     *     // ... data to create a Cliente
     *   }
     * })
     * 
     */
    create<T extends ClienteCreateArgs>(args: SelectSubset<T, ClienteCreateArgs<ExtArgs>>): Prisma__ClienteClient<$Result.GetResult<Prisma.$ClientePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Clientes.
     * @param {ClienteCreateManyArgs} args - Arguments to create many Clientes.
     * @example
     * // Create many Clientes
     * const cliente = await prisma.cliente.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ClienteCreateManyArgs>(args?: SelectSubset<T, ClienteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Clientes and returns the data saved in the database.
     * @param {ClienteCreateManyAndReturnArgs} args - Arguments to create many Clientes.
     * @example
     * // Create many Clientes
     * const cliente = await prisma.cliente.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Clientes and only return the `id`
     * const clienteWithIdOnly = await prisma.cliente.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ClienteCreateManyAndReturnArgs>(args?: SelectSubset<T, ClienteCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClientePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Cliente.
     * @param {ClienteDeleteArgs} args - Arguments to delete one Cliente.
     * @example
     * // Delete one Cliente
     * const Cliente = await prisma.cliente.delete({
     *   where: {
     *     // ... filter to delete one Cliente
     *   }
     * })
     * 
     */
    delete<T extends ClienteDeleteArgs>(args: SelectSubset<T, ClienteDeleteArgs<ExtArgs>>): Prisma__ClienteClient<$Result.GetResult<Prisma.$ClientePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Cliente.
     * @param {ClienteUpdateArgs} args - Arguments to update one Cliente.
     * @example
     * // Update one Cliente
     * const cliente = await prisma.cliente.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ClienteUpdateArgs>(args: SelectSubset<T, ClienteUpdateArgs<ExtArgs>>): Prisma__ClienteClient<$Result.GetResult<Prisma.$ClientePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Clientes.
     * @param {ClienteDeleteManyArgs} args - Arguments to filter Clientes to delete.
     * @example
     * // Delete a few Clientes
     * const { count } = await prisma.cliente.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ClienteDeleteManyArgs>(args?: SelectSubset<T, ClienteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Clientes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClienteUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Clientes
     * const cliente = await prisma.cliente.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ClienteUpdateManyArgs>(args: SelectSubset<T, ClienteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Clientes and returns the data updated in the database.
     * @param {ClienteUpdateManyAndReturnArgs} args - Arguments to update many Clientes.
     * @example
     * // Update many Clientes
     * const cliente = await prisma.cliente.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Clientes and only return the `id`
     * const clienteWithIdOnly = await prisma.cliente.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ClienteUpdateManyAndReturnArgs>(args: SelectSubset<T, ClienteUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClientePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Cliente.
     * @param {ClienteUpsertArgs} args - Arguments to update or create a Cliente.
     * @example
     * // Update or create a Cliente
     * const cliente = await prisma.cliente.upsert({
     *   create: {
     *     // ... data to create a Cliente
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Cliente we want to update
     *   }
     * })
     */
    upsert<T extends ClienteUpsertArgs>(args: SelectSubset<T, ClienteUpsertArgs<ExtArgs>>): Prisma__ClienteClient<$Result.GetResult<Prisma.$ClientePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Clientes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClienteCountArgs} args - Arguments to filter Clientes to count.
     * @example
     * // Count the number of Clientes
     * const count = await prisma.cliente.count({
     *   where: {
     *     // ... the filter for the Clientes we want to count
     *   }
     * })
    **/
    count<T extends ClienteCountArgs>(
      args?: Subset<T, ClienteCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ClienteCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Cliente.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClienteAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ClienteAggregateArgs>(args: Subset<T, ClienteAggregateArgs>): Prisma.PrismaPromise<GetClienteAggregateType<T>>

    /**
     * Group by Cliente.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClienteGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ClienteGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ClienteGroupByArgs['orderBy'] }
        : { orderBy?: ClienteGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ClienteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetClienteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Cliente model
   */
  readonly fields: ClienteFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Cliente.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ClienteClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    establecimientos<T extends Cliente$establecimientosArgs<ExtArgs> = {}>(args?: Subset<T, Cliente$establecimientosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EstablecimientoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    ordenes<T extends Cliente$ordenesArgs<ExtArgs> = {}>(args?: Subset<T, Cliente$ordenesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrdenTrabajoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Cliente model
   */
  interface ClienteFieldRefs {
    readonly id: FieldRef<"Cliente", 'String'>
    readonly razon_social: FieldRef<"Cliente", 'String'>
    readonly cuit: FieldRef<"Cliente", 'String'>
    readonly condicion_iva: FieldRef<"Cliente", 'String'>
    readonly email: FieldRef<"Cliente", 'String'>
    readonly telefono: FieldRef<"Cliente", 'String'>
    readonly localidad_id: FieldRef<"Cliente", 'String'>
    readonly created_at: FieldRef<"Cliente", 'DateTime'>
    readonly updated_at: FieldRef<"Cliente", 'DateTime'>
    readonly deleted_at: FieldRef<"Cliente", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Cliente findUnique
   */
  export type ClienteFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cliente
     */
    select?: ClienteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cliente
     */
    omit?: ClienteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClienteInclude<ExtArgs> | null
    /**
     * Filter, which Cliente to fetch.
     */
    where: ClienteWhereUniqueInput
  }

  /**
   * Cliente findUniqueOrThrow
   */
  export type ClienteFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cliente
     */
    select?: ClienteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cliente
     */
    omit?: ClienteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClienteInclude<ExtArgs> | null
    /**
     * Filter, which Cliente to fetch.
     */
    where: ClienteWhereUniqueInput
  }

  /**
   * Cliente findFirst
   */
  export type ClienteFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cliente
     */
    select?: ClienteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cliente
     */
    omit?: ClienteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClienteInclude<ExtArgs> | null
    /**
     * Filter, which Cliente to fetch.
     */
    where?: ClienteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clientes to fetch.
     */
    orderBy?: ClienteOrderByWithRelationInput | ClienteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Clientes.
     */
    cursor?: ClienteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clientes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clientes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Clientes.
     */
    distinct?: ClienteScalarFieldEnum | ClienteScalarFieldEnum[]
  }

  /**
   * Cliente findFirstOrThrow
   */
  export type ClienteFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cliente
     */
    select?: ClienteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cliente
     */
    omit?: ClienteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClienteInclude<ExtArgs> | null
    /**
     * Filter, which Cliente to fetch.
     */
    where?: ClienteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clientes to fetch.
     */
    orderBy?: ClienteOrderByWithRelationInput | ClienteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Clientes.
     */
    cursor?: ClienteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clientes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clientes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Clientes.
     */
    distinct?: ClienteScalarFieldEnum | ClienteScalarFieldEnum[]
  }

  /**
   * Cliente findMany
   */
  export type ClienteFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cliente
     */
    select?: ClienteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cliente
     */
    omit?: ClienteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClienteInclude<ExtArgs> | null
    /**
     * Filter, which Clientes to fetch.
     */
    where?: ClienteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clientes to fetch.
     */
    orderBy?: ClienteOrderByWithRelationInput | ClienteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Clientes.
     */
    cursor?: ClienteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clientes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clientes.
     */
    skip?: number
    distinct?: ClienteScalarFieldEnum | ClienteScalarFieldEnum[]
  }

  /**
   * Cliente create
   */
  export type ClienteCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cliente
     */
    select?: ClienteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cliente
     */
    omit?: ClienteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClienteInclude<ExtArgs> | null
    /**
     * The data needed to create a Cliente.
     */
    data: XOR<ClienteCreateInput, ClienteUncheckedCreateInput>
  }

  /**
   * Cliente createMany
   */
  export type ClienteCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Clientes.
     */
    data: ClienteCreateManyInput | ClienteCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Cliente createManyAndReturn
   */
  export type ClienteCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cliente
     */
    select?: ClienteSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Cliente
     */
    omit?: ClienteOmit<ExtArgs> | null
    /**
     * The data used to create many Clientes.
     */
    data: ClienteCreateManyInput | ClienteCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Cliente update
   */
  export type ClienteUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cliente
     */
    select?: ClienteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cliente
     */
    omit?: ClienteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClienteInclude<ExtArgs> | null
    /**
     * The data needed to update a Cliente.
     */
    data: XOR<ClienteUpdateInput, ClienteUncheckedUpdateInput>
    /**
     * Choose, which Cliente to update.
     */
    where: ClienteWhereUniqueInput
  }

  /**
   * Cliente updateMany
   */
  export type ClienteUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Clientes.
     */
    data: XOR<ClienteUpdateManyMutationInput, ClienteUncheckedUpdateManyInput>
    /**
     * Filter which Clientes to update
     */
    where?: ClienteWhereInput
    /**
     * Limit how many Clientes to update.
     */
    limit?: number
  }

  /**
   * Cliente updateManyAndReturn
   */
  export type ClienteUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cliente
     */
    select?: ClienteSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Cliente
     */
    omit?: ClienteOmit<ExtArgs> | null
    /**
     * The data used to update Clientes.
     */
    data: XOR<ClienteUpdateManyMutationInput, ClienteUncheckedUpdateManyInput>
    /**
     * Filter which Clientes to update
     */
    where?: ClienteWhereInput
    /**
     * Limit how many Clientes to update.
     */
    limit?: number
  }

  /**
   * Cliente upsert
   */
  export type ClienteUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cliente
     */
    select?: ClienteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cliente
     */
    omit?: ClienteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClienteInclude<ExtArgs> | null
    /**
     * The filter to search for the Cliente to update in case it exists.
     */
    where: ClienteWhereUniqueInput
    /**
     * In case the Cliente found by the `where` argument doesn't exist, create a new Cliente with this data.
     */
    create: XOR<ClienteCreateInput, ClienteUncheckedCreateInput>
    /**
     * In case the Cliente was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ClienteUpdateInput, ClienteUncheckedUpdateInput>
  }

  /**
   * Cliente delete
   */
  export type ClienteDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cliente
     */
    select?: ClienteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cliente
     */
    omit?: ClienteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClienteInclude<ExtArgs> | null
    /**
     * Filter which Cliente to delete.
     */
    where: ClienteWhereUniqueInput
  }

  /**
   * Cliente deleteMany
   */
  export type ClienteDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Clientes to delete
     */
    where?: ClienteWhereInput
    /**
     * Limit how many Clientes to delete.
     */
    limit?: number
  }

  /**
   * Cliente.establecimientos
   */
  export type Cliente$establecimientosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Establecimiento
     */
    select?: EstablecimientoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Establecimiento
     */
    omit?: EstablecimientoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EstablecimientoInclude<ExtArgs> | null
    where?: EstablecimientoWhereInput
    orderBy?: EstablecimientoOrderByWithRelationInput | EstablecimientoOrderByWithRelationInput[]
    cursor?: EstablecimientoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EstablecimientoScalarFieldEnum | EstablecimientoScalarFieldEnum[]
  }

  /**
   * Cliente.ordenes
   */
  export type Cliente$ordenesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrdenTrabajo
     */
    select?: OrdenTrabajoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrdenTrabajo
     */
    omit?: OrdenTrabajoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrdenTrabajoInclude<ExtArgs> | null
    where?: OrdenTrabajoWhereInput
    orderBy?: OrdenTrabajoOrderByWithRelationInput | OrdenTrabajoOrderByWithRelationInput[]
    cursor?: OrdenTrabajoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OrdenTrabajoScalarFieldEnum | OrdenTrabajoScalarFieldEnum[]
  }

  /**
   * Cliente without action
   */
  export type ClienteDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cliente
     */
    select?: ClienteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cliente
     */
    omit?: ClienteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClienteInclude<ExtArgs> | null
  }


  /**
   * Model Establecimiento
   */

  export type AggregateEstablecimiento = {
    _count: EstablecimientoCountAggregateOutputType | null
    _min: EstablecimientoMinAggregateOutputType | null
    _max: EstablecimientoMaxAggregateOutputType | null
  }

  export type EstablecimientoMinAggregateOutputType = {
    id: string | null
    nombre: string | null
    cliente_id: string | null
    created_at: Date | null
    deleted_at: Date | null
  }

  export type EstablecimientoMaxAggregateOutputType = {
    id: string | null
    nombre: string | null
    cliente_id: string | null
    created_at: Date | null
    deleted_at: Date | null
  }

  export type EstablecimientoCountAggregateOutputType = {
    id: number
    nombre: number
    cliente_id: number
    created_at: number
    deleted_at: number
    _all: number
  }


  export type EstablecimientoMinAggregateInputType = {
    id?: true
    nombre?: true
    cliente_id?: true
    created_at?: true
    deleted_at?: true
  }

  export type EstablecimientoMaxAggregateInputType = {
    id?: true
    nombre?: true
    cliente_id?: true
    created_at?: true
    deleted_at?: true
  }

  export type EstablecimientoCountAggregateInputType = {
    id?: true
    nombre?: true
    cliente_id?: true
    created_at?: true
    deleted_at?: true
    _all?: true
  }

  export type EstablecimientoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Establecimiento to aggregate.
     */
    where?: EstablecimientoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Establecimientos to fetch.
     */
    orderBy?: EstablecimientoOrderByWithRelationInput | EstablecimientoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EstablecimientoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Establecimientos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Establecimientos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Establecimientos
    **/
    _count?: true | EstablecimientoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EstablecimientoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EstablecimientoMaxAggregateInputType
  }

  export type GetEstablecimientoAggregateType<T extends EstablecimientoAggregateArgs> = {
        [P in keyof T & keyof AggregateEstablecimiento]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEstablecimiento[P]>
      : GetScalarType<T[P], AggregateEstablecimiento[P]>
  }




  export type EstablecimientoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EstablecimientoWhereInput
    orderBy?: EstablecimientoOrderByWithAggregationInput | EstablecimientoOrderByWithAggregationInput[]
    by: EstablecimientoScalarFieldEnum[] | EstablecimientoScalarFieldEnum
    having?: EstablecimientoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EstablecimientoCountAggregateInputType | true
    _min?: EstablecimientoMinAggregateInputType
    _max?: EstablecimientoMaxAggregateInputType
  }

  export type EstablecimientoGroupByOutputType = {
    id: string
    nombre: string
    cliente_id: string
    created_at: Date
    deleted_at: Date | null
    _count: EstablecimientoCountAggregateOutputType | null
    _min: EstablecimientoMinAggregateOutputType | null
    _max: EstablecimientoMaxAggregateOutputType | null
  }

  type GetEstablecimientoGroupByPayload<T extends EstablecimientoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EstablecimientoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EstablecimientoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EstablecimientoGroupByOutputType[P]>
            : GetScalarType<T[P], EstablecimientoGroupByOutputType[P]>
        }
      >
    >


  export type EstablecimientoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    cliente_id?: boolean
    created_at?: boolean
    deleted_at?: boolean
    cliente?: boolean | ClienteDefaultArgs<ExtArgs>
    lotes?: boolean | Establecimiento$lotesArgs<ExtArgs>
    _count?: boolean | EstablecimientoCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["establecimiento"]>

  export type EstablecimientoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    cliente_id?: boolean
    created_at?: boolean
    deleted_at?: boolean
    cliente?: boolean | ClienteDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["establecimiento"]>

  export type EstablecimientoSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    cliente_id?: boolean
    created_at?: boolean
    deleted_at?: boolean
    cliente?: boolean | ClienteDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["establecimiento"]>

  export type EstablecimientoSelectScalar = {
    id?: boolean
    nombre?: boolean
    cliente_id?: boolean
    created_at?: boolean
    deleted_at?: boolean
  }

  export type EstablecimientoOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "nombre" | "cliente_id" | "created_at" | "deleted_at", ExtArgs["result"]["establecimiento"]>
  export type EstablecimientoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cliente?: boolean | ClienteDefaultArgs<ExtArgs>
    lotes?: boolean | Establecimiento$lotesArgs<ExtArgs>
    _count?: boolean | EstablecimientoCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type EstablecimientoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cliente?: boolean | ClienteDefaultArgs<ExtArgs>
  }
  export type EstablecimientoIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cliente?: boolean | ClienteDefaultArgs<ExtArgs>
  }

  export type $EstablecimientoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Establecimiento"
    objects: {
      cliente: Prisma.$ClientePayload<ExtArgs>
      lotes: Prisma.$LotePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      nombre: string
      cliente_id: string
      created_at: Date
      deleted_at: Date | null
    }, ExtArgs["result"]["establecimiento"]>
    composites: {}
  }

  type EstablecimientoGetPayload<S extends boolean | null | undefined | EstablecimientoDefaultArgs> = $Result.GetResult<Prisma.$EstablecimientoPayload, S>

  type EstablecimientoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<EstablecimientoFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: EstablecimientoCountAggregateInputType | true
    }

  export interface EstablecimientoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Establecimiento'], meta: { name: 'Establecimiento' } }
    /**
     * Find zero or one Establecimiento that matches the filter.
     * @param {EstablecimientoFindUniqueArgs} args - Arguments to find a Establecimiento
     * @example
     * // Get one Establecimiento
     * const establecimiento = await prisma.establecimiento.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EstablecimientoFindUniqueArgs>(args: SelectSubset<T, EstablecimientoFindUniqueArgs<ExtArgs>>): Prisma__EstablecimientoClient<$Result.GetResult<Prisma.$EstablecimientoPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Establecimiento that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {EstablecimientoFindUniqueOrThrowArgs} args - Arguments to find a Establecimiento
     * @example
     * // Get one Establecimiento
     * const establecimiento = await prisma.establecimiento.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EstablecimientoFindUniqueOrThrowArgs>(args: SelectSubset<T, EstablecimientoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EstablecimientoClient<$Result.GetResult<Prisma.$EstablecimientoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Establecimiento that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EstablecimientoFindFirstArgs} args - Arguments to find a Establecimiento
     * @example
     * // Get one Establecimiento
     * const establecimiento = await prisma.establecimiento.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EstablecimientoFindFirstArgs>(args?: SelectSubset<T, EstablecimientoFindFirstArgs<ExtArgs>>): Prisma__EstablecimientoClient<$Result.GetResult<Prisma.$EstablecimientoPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Establecimiento that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EstablecimientoFindFirstOrThrowArgs} args - Arguments to find a Establecimiento
     * @example
     * // Get one Establecimiento
     * const establecimiento = await prisma.establecimiento.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EstablecimientoFindFirstOrThrowArgs>(args?: SelectSubset<T, EstablecimientoFindFirstOrThrowArgs<ExtArgs>>): Prisma__EstablecimientoClient<$Result.GetResult<Prisma.$EstablecimientoPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Establecimientos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EstablecimientoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Establecimientos
     * const establecimientos = await prisma.establecimiento.findMany()
     * 
     * // Get first 10 Establecimientos
     * const establecimientos = await prisma.establecimiento.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const establecimientoWithIdOnly = await prisma.establecimiento.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EstablecimientoFindManyArgs>(args?: SelectSubset<T, EstablecimientoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EstablecimientoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Establecimiento.
     * @param {EstablecimientoCreateArgs} args - Arguments to create a Establecimiento.
     * @example
     * // Create one Establecimiento
     * const Establecimiento = await prisma.establecimiento.create({
     *   data: {
     *     // ... data to create a Establecimiento
     *   }
     * })
     * 
     */
    create<T extends EstablecimientoCreateArgs>(args: SelectSubset<T, EstablecimientoCreateArgs<ExtArgs>>): Prisma__EstablecimientoClient<$Result.GetResult<Prisma.$EstablecimientoPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Establecimientos.
     * @param {EstablecimientoCreateManyArgs} args - Arguments to create many Establecimientos.
     * @example
     * // Create many Establecimientos
     * const establecimiento = await prisma.establecimiento.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EstablecimientoCreateManyArgs>(args?: SelectSubset<T, EstablecimientoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Establecimientos and returns the data saved in the database.
     * @param {EstablecimientoCreateManyAndReturnArgs} args - Arguments to create many Establecimientos.
     * @example
     * // Create many Establecimientos
     * const establecimiento = await prisma.establecimiento.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Establecimientos and only return the `id`
     * const establecimientoWithIdOnly = await prisma.establecimiento.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EstablecimientoCreateManyAndReturnArgs>(args?: SelectSubset<T, EstablecimientoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EstablecimientoPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Establecimiento.
     * @param {EstablecimientoDeleteArgs} args - Arguments to delete one Establecimiento.
     * @example
     * // Delete one Establecimiento
     * const Establecimiento = await prisma.establecimiento.delete({
     *   where: {
     *     // ... filter to delete one Establecimiento
     *   }
     * })
     * 
     */
    delete<T extends EstablecimientoDeleteArgs>(args: SelectSubset<T, EstablecimientoDeleteArgs<ExtArgs>>): Prisma__EstablecimientoClient<$Result.GetResult<Prisma.$EstablecimientoPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Establecimiento.
     * @param {EstablecimientoUpdateArgs} args - Arguments to update one Establecimiento.
     * @example
     * // Update one Establecimiento
     * const establecimiento = await prisma.establecimiento.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EstablecimientoUpdateArgs>(args: SelectSubset<T, EstablecimientoUpdateArgs<ExtArgs>>): Prisma__EstablecimientoClient<$Result.GetResult<Prisma.$EstablecimientoPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Establecimientos.
     * @param {EstablecimientoDeleteManyArgs} args - Arguments to filter Establecimientos to delete.
     * @example
     * // Delete a few Establecimientos
     * const { count } = await prisma.establecimiento.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EstablecimientoDeleteManyArgs>(args?: SelectSubset<T, EstablecimientoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Establecimientos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EstablecimientoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Establecimientos
     * const establecimiento = await prisma.establecimiento.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EstablecimientoUpdateManyArgs>(args: SelectSubset<T, EstablecimientoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Establecimientos and returns the data updated in the database.
     * @param {EstablecimientoUpdateManyAndReturnArgs} args - Arguments to update many Establecimientos.
     * @example
     * // Update many Establecimientos
     * const establecimiento = await prisma.establecimiento.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Establecimientos and only return the `id`
     * const establecimientoWithIdOnly = await prisma.establecimiento.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends EstablecimientoUpdateManyAndReturnArgs>(args: SelectSubset<T, EstablecimientoUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EstablecimientoPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Establecimiento.
     * @param {EstablecimientoUpsertArgs} args - Arguments to update or create a Establecimiento.
     * @example
     * // Update or create a Establecimiento
     * const establecimiento = await prisma.establecimiento.upsert({
     *   create: {
     *     // ... data to create a Establecimiento
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Establecimiento we want to update
     *   }
     * })
     */
    upsert<T extends EstablecimientoUpsertArgs>(args: SelectSubset<T, EstablecimientoUpsertArgs<ExtArgs>>): Prisma__EstablecimientoClient<$Result.GetResult<Prisma.$EstablecimientoPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Establecimientos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EstablecimientoCountArgs} args - Arguments to filter Establecimientos to count.
     * @example
     * // Count the number of Establecimientos
     * const count = await prisma.establecimiento.count({
     *   where: {
     *     // ... the filter for the Establecimientos we want to count
     *   }
     * })
    **/
    count<T extends EstablecimientoCountArgs>(
      args?: Subset<T, EstablecimientoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EstablecimientoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Establecimiento.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EstablecimientoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EstablecimientoAggregateArgs>(args: Subset<T, EstablecimientoAggregateArgs>): Prisma.PrismaPromise<GetEstablecimientoAggregateType<T>>

    /**
     * Group by Establecimiento.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EstablecimientoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EstablecimientoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EstablecimientoGroupByArgs['orderBy'] }
        : { orderBy?: EstablecimientoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EstablecimientoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEstablecimientoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Establecimiento model
   */
  readonly fields: EstablecimientoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Establecimiento.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EstablecimientoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    cliente<T extends ClienteDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ClienteDefaultArgs<ExtArgs>>): Prisma__ClienteClient<$Result.GetResult<Prisma.$ClientePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    lotes<T extends Establecimiento$lotesArgs<ExtArgs> = {}>(args?: Subset<T, Establecimiento$lotesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LotePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Establecimiento model
   */
  interface EstablecimientoFieldRefs {
    readonly id: FieldRef<"Establecimiento", 'String'>
    readonly nombre: FieldRef<"Establecimiento", 'String'>
    readonly cliente_id: FieldRef<"Establecimiento", 'String'>
    readonly created_at: FieldRef<"Establecimiento", 'DateTime'>
    readonly deleted_at: FieldRef<"Establecimiento", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Establecimiento findUnique
   */
  export type EstablecimientoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Establecimiento
     */
    select?: EstablecimientoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Establecimiento
     */
    omit?: EstablecimientoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EstablecimientoInclude<ExtArgs> | null
    /**
     * Filter, which Establecimiento to fetch.
     */
    where: EstablecimientoWhereUniqueInput
  }

  /**
   * Establecimiento findUniqueOrThrow
   */
  export type EstablecimientoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Establecimiento
     */
    select?: EstablecimientoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Establecimiento
     */
    omit?: EstablecimientoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EstablecimientoInclude<ExtArgs> | null
    /**
     * Filter, which Establecimiento to fetch.
     */
    where: EstablecimientoWhereUniqueInput
  }

  /**
   * Establecimiento findFirst
   */
  export type EstablecimientoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Establecimiento
     */
    select?: EstablecimientoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Establecimiento
     */
    omit?: EstablecimientoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EstablecimientoInclude<ExtArgs> | null
    /**
     * Filter, which Establecimiento to fetch.
     */
    where?: EstablecimientoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Establecimientos to fetch.
     */
    orderBy?: EstablecimientoOrderByWithRelationInput | EstablecimientoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Establecimientos.
     */
    cursor?: EstablecimientoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Establecimientos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Establecimientos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Establecimientos.
     */
    distinct?: EstablecimientoScalarFieldEnum | EstablecimientoScalarFieldEnum[]
  }

  /**
   * Establecimiento findFirstOrThrow
   */
  export type EstablecimientoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Establecimiento
     */
    select?: EstablecimientoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Establecimiento
     */
    omit?: EstablecimientoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EstablecimientoInclude<ExtArgs> | null
    /**
     * Filter, which Establecimiento to fetch.
     */
    where?: EstablecimientoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Establecimientos to fetch.
     */
    orderBy?: EstablecimientoOrderByWithRelationInput | EstablecimientoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Establecimientos.
     */
    cursor?: EstablecimientoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Establecimientos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Establecimientos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Establecimientos.
     */
    distinct?: EstablecimientoScalarFieldEnum | EstablecimientoScalarFieldEnum[]
  }

  /**
   * Establecimiento findMany
   */
  export type EstablecimientoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Establecimiento
     */
    select?: EstablecimientoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Establecimiento
     */
    omit?: EstablecimientoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EstablecimientoInclude<ExtArgs> | null
    /**
     * Filter, which Establecimientos to fetch.
     */
    where?: EstablecimientoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Establecimientos to fetch.
     */
    orderBy?: EstablecimientoOrderByWithRelationInput | EstablecimientoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Establecimientos.
     */
    cursor?: EstablecimientoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Establecimientos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Establecimientos.
     */
    skip?: number
    distinct?: EstablecimientoScalarFieldEnum | EstablecimientoScalarFieldEnum[]
  }

  /**
   * Establecimiento create
   */
  export type EstablecimientoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Establecimiento
     */
    select?: EstablecimientoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Establecimiento
     */
    omit?: EstablecimientoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EstablecimientoInclude<ExtArgs> | null
    /**
     * The data needed to create a Establecimiento.
     */
    data: XOR<EstablecimientoCreateInput, EstablecimientoUncheckedCreateInput>
  }

  /**
   * Establecimiento createMany
   */
  export type EstablecimientoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Establecimientos.
     */
    data: EstablecimientoCreateManyInput | EstablecimientoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Establecimiento createManyAndReturn
   */
  export type EstablecimientoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Establecimiento
     */
    select?: EstablecimientoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Establecimiento
     */
    omit?: EstablecimientoOmit<ExtArgs> | null
    /**
     * The data used to create many Establecimientos.
     */
    data: EstablecimientoCreateManyInput | EstablecimientoCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EstablecimientoIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Establecimiento update
   */
  export type EstablecimientoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Establecimiento
     */
    select?: EstablecimientoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Establecimiento
     */
    omit?: EstablecimientoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EstablecimientoInclude<ExtArgs> | null
    /**
     * The data needed to update a Establecimiento.
     */
    data: XOR<EstablecimientoUpdateInput, EstablecimientoUncheckedUpdateInput>
    /**
     * Choose, which Establecimiento to update.
     */
    where: EstablecimientoWhereUniqueInput
  }

  /**
   * Establecimiento updateMany
   */
  export type EstablecimientoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Establecimientos.
     */
    data: XOR<EstablecimientoUpdateManyMutationInput, EstablecimientoUncheckedUpdateManyInput>
    /**
     * Filter which Establecimientos to update
     */
    where?: EstablecimientoWhereInput
    /**
     * Limit how many Establecimientos to update.
     */
    limit?: number
  }

  /**
   * Establecimiento updateManyAndReturn
   */
  export type EstablecimientoUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Establecimiento
     */
    select?: EstablecimientoSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Establecimiento
     */
    omit?: EstablecimientoOmit<ExtArgs> | null
    /**
     * The data used to update Establecimientos.
     */
    data: XOR<EstablecimientoUpdateManyMutationInput, EstablecimientoUncheckedUpdateManyInput>
    /**
     * Filter which Establecimientos to update
     */
    where?: EstablecimientoWhereInput
    /**
     * Limit how many Establecimientos to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EstablecimientoIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Establecimiento upsert
   */
  export type EstablecimientoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Establecimiento
     */
    select?: EstablecimientoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Establecimiento
     */
    omit?: EstablecimientoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EstablecimientoInclude<ExtArgs> | null
    /**
     * The filter to search for the Establecimiento to update in case it exists.
     */
    where: EstablecimientoWhereUniqueInput
    /**
     * In case the Establecimiento found by the `where` argument doesn't exist, create a new Establecimiento with this data.
     */
    create: XOR<EstablecimientoCreateInput, EstablecimientoUncheckedCreateInput>
    /**
     * In case the Establecimiento was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EstablecimientoUpdateInput, EstablecimientoUncheckedUpdateInput>
  }

  /**
   * Establecimiento delete
   */
  export type EstablecimientoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Establecimiento
     */
    select?: EstablecimientoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Establecimiento
     */
    omit?: EstablecimientoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EstablecimientoInclude<ExtArgs> | null
    /**
     * Filter which Establecimiento to delete.
     */
    where: EstablecimientoWhereUniqueInput
  }

  /**
   * Establecimiento deleteMany
   */
  export type EstablecimientoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Establecimientos to delete
     */
    where?: EstablecimientoWhereInput
    /**
     * Limit how many Establecimientos to delete.
     */
    limit?: number
  }

  /**
   * Establecimiento.lotes
   */
  export type Establecimiento$lotesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lote
     */
    select?: LoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lote
     */
    omit?: LoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoteInclude<ExtArgs> | null
    where?: LoteWhereInput
    orderBy?: LoteOrderByWithRelationInput | LoteOrderByWithRelationInput[]
    cursor?: LoteWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LoteScalarFieldEnum | LoteScalarFieldEnum[]
  }

  /**
   * Establecimiento without action
   */
  export type EstablecimientoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Establecimiento
     */
    select?: EstablecimientoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Establecimiento
     */
    omit?: EstablecimientoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EstablecimientoInclude<ExtArgs> | null
  }


  /**
   * Model Lote
   */

  export type AggregateLote = {
    _count: LoteCountAggregateOutputType | null
    _avg: LoteAvgAggregateOutputType | null
    _sum: LoteSumAggregateOutputType | null
    _min: LoteMinAggregateOutputType | null
    _max: LoteMaxAggregateOutputType | null
  }

  export type LoteAvgAggregateOutputType = {
    hectareas: Decimal | null
  }

  export type LoteSumAggregateOutputType = {
    hectareas: Decimal | null
  }

  export type LoteMinAggregateOutputType = {
    id: string | null
    nombre: string | null
    hectareas: Decimal | null
    establecimiento_id: string | null
    created_at: Date | null
    deleted_at: Date | null
  }

  export type LoteMaxAggregateOutputType = {
    id: string | null
    nombre: string | null
    hectareas: Decimal | null
    establecimiento_id: string | null
    created_at: Date | null
    deleted_at: Date | null
  }

  export type LoteCountAggregateOutputType = {
    id: number
    nombre: number
    hectareas: number
    establecimiento_id: number
    created_at: number
    deleted_at: number
    _all: number
  }


  export type LoteAvgAggregateInputType = {
    hectareas?: true
  }

  export type LoteSumAggregateInputType = {
    hectareas?: true
  }

  export type LoteMinAggregateInputType = {
    id?: true
    nombre?: true
    hectareas?: true
    establecimiento_id?: true
    created_at?: true
    deleted_at?: true
  }

  export type LoteMaxAggregateInputType = {
    id?: true
    nombre?: true
    hectareas?: true
    establecimiento_id?: true
    created_at?: true
    deleted_at?: true
  }

  export type LoteCountAggregateInputType = {
    id?: true
    nombre?: true
    hectareas?: true
    establecimiento_id?: true
    created_at?: true
    deleted_at?: true
    _all?: true
  }

  export type LoteAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Lote to aggregate.
     */
    where?: LoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Lotes to fetch.
     */
    orderBy?: LoteOrderByWithRelationInput | LoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Lotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Lotes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Lotes
    **/
    _count?: true | LoteCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LoteAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LoteSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LoteMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LoteMaxAggregateInputType
  }

  export type GetLoteAggregateType<T extends LoteAggregateArgs> = {
        [P in keyof T & keyof AggregateLote]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLote[P]>
      : GetScalarType<T[P], AggregateLote[P]>
  }




  export type LoteGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LoteWhereInput
    orderBy?: LoteOrderByWithAggregationInput | LoteOrderByWithAggregationInput[]
    by: LoteScalarFieldEnum[] | LoteScalarFieldEnum
    having?: LoteScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LoteCountAggregateInputType | true
    _avg?: LoteAvgAggregateInputType
    _sum?: LoteSumAggregateInputType
    _min?: LoteMinAggregateInputType
    _max?: LoteMaxAggregateInputType
  }

  export type LoteGroupByOutputType = {
    id: string
    nombre: string
    hectareas: Decimal
    establecimiento_id: string
    created_at: Date
    deleted_at: Date | null
    _count: LoteCountAggregateOutputType | null
    _avg: LoteAvgAggregateOutputType | null
    _sum: LoteSumAggregateOutputType | null
    _min: LoteMinAggregateOutputType | null
    _max: LoteMaxAggregateOutputType | null
  }

  type GetLoteGroupByPayload<T extends LoteGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LoteGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LoteGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LoteGroupByOutputType[P]>
            : GetScalarType<T[P], LoteGroupByOutputType[P]>
        }
      >
    >


  export type LoteSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    hectareas?: boolean
    establecimiento_id?: boolean
    created_at?: boolean
    deleted_at?: boolean
    establecimiento?: boolean | EstablecimientoDefaultArgs<ExtArgs>
    ordenes?: boolean | Lote$ordenesArgs<ExtArgs>
    _count?: boolean | LoteCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["lote"]>

  export type LoteSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    hectareas?: boolean
    establecimiento_id?: boolean
    created_at?: boolean
    deleted_at?: boolean
    establecimiento?: boolean | EstablecimientoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["lote"]>

  export type LoteSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    hectareas?: boolean
    establecimiento_id?: boolean
    created_at?: boolean
    deleted_at?: boolean
    establecimiento?: boolean | EstablecimientoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["lote"]>

  export type LoteSelectScalar = {
    id?: boolean
    nombre?: boolean
    hectareas?: boolean
    establecimiento_id?: boolean
    created_at?: boolean
    deleted_at?: boolean
  }

  export type LoteOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "nombre" | "hectareas" | "establecimiento_id" | "created_at" | "deleted_at", ExtArgs["result"]["lote"]>
  export type LoteInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    establecimiento?: boolean | EstablecimientoDefaultArgs<ExtArgs>
    ordenes?: boolean | Lote$ordenesArgs<ExtArgs>
    _count?: boolean | LoteCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type LoteIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    establecimiento?: boolean | EstablecimientoDefaultArgs<ExtArgs>
  }
  export type LoteIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    establecimiento?: boolean | EstablecimientoDefaultArgs<ExtArgs>
  }

  export type $LotePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Lote"
    objects: {
      establecimiento: Prisma.$EstablecimientoPayload<ExtArgs>
      ordenes: Prisma.$OrdenTrabajoPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      nombre: string
      hectareas: Prisma.Decimal
      establecimiento_id: string
      created_at: Date
      deleted_at: Date | null
    }, ExtArgs["result"]["lote"]>
    composites: {}
  }

  type LoteGetPayload<S extends boolean | null | undefined | LoteDefaultArgs> = $Result.GetResult<Prisma.$LotePayload, S>

  type LoteCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LoteFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LoteCountAggregateInputType | true
    }

  export interface LoteDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Lote'], meta: { name: 'Lote' } }
    /**
     * Find zero or one Lote that matches the filter.
     * @param {LoteFindUniqueArgs} args - Arguments to find a Lote
     * @example
     * // Get one Lote
     * const lote = await prisma.lote.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LoteFindUniqueArgs>(args: SelectSubset<T, LoteFindUniqueArgs<ExtArgs>>): Prisma__LoteClient<$Result.GetResult<Prisma.$LotePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Lote that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LoteFindUniqueOrThrowArgs} args - Arguments to find a Lote
     * @example
     * // Get one Lote
     * const lote = await prisma.lote.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LoteFindUniqueOrThrowArgs>(args: SelectSubset<T, LoteFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LoteClient<$Result.GetResult<Prisma.$LotePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Lote that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoteFindFirstArgs} args - Arguments to find a Lote
     * @example
     * // Get one Lote
     * const lote = await prisma.lote.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LoteFindFirstArgs>(args?: SelectSubset<T, LoteFindFirstArgs<ExtArgs>>): Prisma__LoteClient<$Result.GetResult<Prisma.$LotePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Lote that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoteFindFirstOrThrowArgs} args - Arguments to find a Lote
     * @example
     * // Get one Lote
     * const lote = await prisma.lote.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LoteFindFirstOrThrowArgs>(args?: SelectSubset<T, LoteFindFirstOrThrowArgs<ExtArgs>>): Prisma__LoteClient<$Result.GetResult<Prisma.$LotePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Lotes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoteFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Lotes
     * const lotes = await prisma.lote.findMany()
     * 
     * // Get first 10 Lotes
     * const lotes = await prisma.lote.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const loteWithIdOnly = await prisma.lote.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LoteFindManyArgs>(args?: SelectSubset<T, LoteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LotePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Lote.
     * @param {LoteCreateArgs} args - Arguments to create a Lote.
     * @example
     * // Create one Lote
     * const Lote = await prisma.lote.create({
     *   data: {
     *     // ... data to create a Lote
     *   }
     * })
     * 
     */
    create<T extends LoteCreateArgs>(args: SelectSubset<T, LoteCreateArgs<ExtArgs>>): Prisma__LoteClient<$Result.GetResult<Prisma.$LotePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Lotes.
     * @param {LoteCreateManyArgs} args - Arguments to create many Lotes.
     * @example
     * // Create many Lotes
     * const lote = await prisma.lote.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LoteCreateManyArgs>(args?: SelectSubset<T, LoteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Lotes and returns the data saved in the database.
     * @param {LoteCreateManyAndReturnArgs} args - Arguments to create many Lotes.
     * @example
     * // Create many Lotes
     * const lote = await prisma.lote.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Lotes and only return the `id`
     * const loteWithIdOnly = await prisma.lote.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LoteCreateManyAndReturnArgs>(args?: SelectSubset<T, LoteCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LotePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Lote.
     * @param {LoteDeleteArgs} args - Arguments to delete one Lote.
     * @example
     * // Delete one Lote
     * const Lote = await prisma.lote.delete({
     *   where: {
     *     // ... filter to delete one Lote
     *   }
     * })
     * 
     */
    delete<T extends LoteDeleteArgs>(args: SelectSubset<T, LoteDeleteArgs<ExtArgs>>): Prisma__LoteClient<$Result.GetResult<Prisma.$LotePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Lote.
     * @param {LoteUpdateArgs} args - Arguments to update one Lote.
     * @example
     * // Update one Lote
     * const lote = await prisma.lote.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LoteUpdateArgs>(args: SelectSubset<T, LoteUpdateArgs<ExtArgs>>): Prisma__LoteClient<$Result.GetResult<Prisma.$LotePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Lotes.
     * @param {LoteDeleteManyArgs} args - Arguments to filter Lotes to delete.
     * @example
     * // Delete a few Lotes
     * const { count } = await prisma.lote.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LoteDeleteManyArgs>(args?: SelectSubset<T, LoteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Lotes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoteUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Lotes
     * const lote = await prisma.lote.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LoteUpdateManyArgs>(args: SelectSubset<T, LoteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Lotes and returns the data updated in the database.
     * @param {LoteUpdateManyAndReturnArgs} args - Arguments to update many Lotes.
     * @example
     * // Update many Lotes
     * const lote = await prisma.lote.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Lotes and only return the `id`
     * const loteWithIdOnly = await prisma.lote.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LoteUpdateManyAndReturnArgs>(args: SelectSubset<T, LoteUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LotePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Lote.
     * @param {LoteUpsertArgs} args - Arguments to update or create a Lote.
     * @example
     * // Update or create a Lote
     * const lote = await prisma.lote.upsert({
     *   create: {
     *     // ... data to create a Lote
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Lote we want to update
     *   }
     * })
     */
    upsert<T extends LoteUpsertArgs>(args: SelectSubset<T, LoteUpsertArgs<ExtArgs>>): Prisma__LoteClient<$Result.GetResult<Prisma.$LotePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Lotes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoteCountArgs} args - Arguments to filter Lotes to count.
     * @example
     * // Count the number of Lotes
     * const count = await prisma.lote.count({
     *   where: {
     *     // ... the filter for the Lotes we want to count
     *   }
     * })
    **/
    count<T extends LoteCountArgs>(
      args?: Subset<T, LoteCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LoteCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Lote.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoteAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LoteAggregateArgs>(args: Subset<T, LoteAggregateArgs>): Prisma.PrismaPromise<GetLoteAggregateType<T>>

    /**
     * Group by Lote.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoteGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LoteGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LoteGroupByArgs['orderBy'] }
        : { orderBy?: LoteGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LoteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLoteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Lote model
   */
  readonly fields: LoteFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Lote.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LoteClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    establecimiento<T extends EstablecimientoDefaultArgs<ExtArgs> = {}>(args?: Subset<T, EstablecimientoDefaultArgs<ExtArgs>>): Prisma__EstablecimientoClient<$Result.GetResult<Prisma.$EstablecimientoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    ordenes<T extends Lote$ordenesArgs<ExtArgs> = {}>(args?: Subset<T, Lote$ordenesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrdenTrabajoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Lote model
   */
  interface LoteFieldRefs {
    readonly id: FieldRef<"Lote", 'String'>
    readonly nombre: FieldRef<"Lote", 'String'>
    readonly hectareas: FieldRef<"Lote", 'Decimal'>
    readonly establecimiento_id: FieldRef<"Lote", 'String'>
    readonly created_at: FieldRef<"Lote", 'DateTime'>
    readonly deleted_at: FieldRef<"Lote", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Lote findUnique
   */
  export type LoteFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lote
     */
    select?: LoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lote
     */
    omit?: LoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoteInclude<ExtArgs> | null
    /**
     * Filter, which Lote to fetch.
     */
    where: LoteWhereUniqueInput
  }

  /**
   * Lote findUniqueOrThrow
   */
  export type LoteFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lote
     */
    select?: LoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lote
     */
    omit?: LoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoteInclude<ExtArgs> | null
    /**
     * Filter, which Lote to fetch.
     */
    where: LoteWhereUniqueInput
  }

  /**
   * Lote findFirst
   */
  export type LoteFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lote
     */
    select?: LoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lote
     */
    omit?: LoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoteInclude<ExtArgs> | null
    /**
     * Filter, which Lote to fetch.
     */
    where?: LoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Lotes to fetch.
     */
    orderBy?: LoteOrderByWithRelationInput | LoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Lotes.
     */
    cursor?: LoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Lotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Lotes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Lotes.
     */
    distinct?: LoteScalarFieldEnum | LoteScalarFieldEnum[]
  }

  /**
   * Lote findFirstOrThrow
   */
  export type LoteFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lote
     */
    select?: LoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lote
     */
    omit?: LoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoteInclude<ExtArgs> | null
    /**
     * Filter, which Lote to fetch.
     */
    where?: LoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Lotes to fetch.
     */
    orderBy?: LoteOrderByWithRelationInput | LoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Lotes.
     */
    cursor?: LoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Lotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Lotes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Lotes.
     */
    distinct?: LoteScalarFieldEnum | LoteScalarFieldEnum[]
  }

  /**
   * Lote findMany
   */
  export type LoteFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lote
     */
    select?: LoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lote
     */
    omit?: LoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoteInclude<ExtArgs> | null
    /**
     * Filter, which Lotes to fetch.
     */
    where?: LoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Lotes to fetch.
     */
    orderBy?: LoteOrderByWithRelationInput | LoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Lotes.
     */
    cursor?: LoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Lotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Lotes.
     */
    skip?: number
    distinct?: LoteScalarFieldEnum | LoteScalarFieldEnum[]
  }

  /**
   * Lote create
   */
  export type LoteCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lote
     */
    select?: LoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lote
     */
    omit?: LoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoteInclude<ExtArgs> | null
    /**
     * The data needed to create a Lote.
     */
    data: XOR<LoteCreateInput, LoteUncheckedCreateInput>
  }

  /**
   * Lote createMany
   */
  export type LoteCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Lotes.
     */
    data: LoteCreateManyInput | LoteCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Lote createManyAndReturn
   */
  export type LoteCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lote
     */
    select?: LoteSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Lote
     */
    omit?: LoteOmit<ExtArgs> | null
    /**
     * The data used to create many Lotes.
     */
    data: LoteCreateManyInput | LoteCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoteIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Lote update
   */
  export type LoteUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lote
     */
    select?: LoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lote
     */
    omit?: LoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoteInclude<ExtArgs> | null
    /**
     * The data needed to update a Lote.
     */
    data: XOR<LoteUpdateInput, LoteUncheckedUpdateInput>
    /**
     * Choose, which Lote to update.
     */
    where: LoteWhereUniqueInput
  }

  /**
   * Lote updateMany
   */
  export type LoteUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Lotes.
     */
    data: XOR<LoteUpdateManyMutationInput, LoteUncheckedUpdateManyInput>
    /**
     * Filter which Lotes to update
     */
    where?: LoteWhereInput
    /**
     * Limit how many Lotes to update.
     */
    limit?: number
  }

  /**
   * Lote updateManyAndReturn
   */
  export type LoteUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lote
     */
    select?: LoteSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Lote
     */
    omit?: LoteOmit<ExtArgs> | null
    /**
     * The data used to update Lotes.
     */
    data: XOR<LoteUpdateManyMutationInput, LoteUncheckedUpdateManyInput>
    /**
     * Filter which Lotes to update
     */
    where?: LoteWhereInput
    /**
     * Limit how many Lotes to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoteIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Lote upsert
   */
  export type LoteUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lote
     */
    select?: LoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lote
     */
    omit?: LoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoteInclude<ExtArgs> | null
    /**
     * The filter to search for the Lote to update in case it exists.
     */
    where: LoteWhereUniqueInput
    /**
     * In case the Lote found by the `where` argument doesn't exist, create a new Lote with this data.
     */
    create: XOR<LoteCreateInput, LoteUncheckedCreateInput>
    /**
     * In case the Lote was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LoteUpdateInput, LoteUncheckedUpdateInput>
  }

  /**
   * Lote delete
   */
  export type LoteDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lote
     */
    select?: LoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lote
     */
    omit?: LoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoteInclude<ExtArgs> | null
    /**
     * Filter which Lote to delete.
     */
    where: LoteWhereUniqueInput
  }

  /**
   * Lote deleteMany
   */
  export type LoteDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Lotes to delete
     */
    where?: LoteWhereInput
    /**
     * Limit how many Lotes to delete.
     */
    limit?: number
  }

  /**
   * Lote.ordenes
   */
  export type Lote$ordenesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrdenTrabajo
     */
    select?: OrdenTrabajoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrdenTrabajo
     */
    omit?: OrdenTrabajoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrdenTrabajoInclude<ExtArgs> | null
    where?: OrdenTrabajoWhereInput
    orderBy?: OrdenTrabajoOrderByWithRelationInput | OrdenTrabajoOrderByWithRelationInput[]
    cursor?: OrdenTrabajoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OrdenTrabajoScalarFieldEnum | OrdenTrabajoScalarFieldEnum[]
  }

  /**
   * Lote without action
   */
  export type LoteDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lote
     */
    select?: LoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lote
     */
    omit?: LoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoteInclude<ExtArgs> | null
  }


  /**
   * Model Servicio
   */

  export type AggregateServicio = {
    _count: ServicioCountAggregateOutputType | null
    _avg: ServicioAvgAggregateOutputType | null
    _sum: ServicioSumAggregateOutputType | null
    _min: ServicioMinAggregateOutputType | null
    _max: ServicioMaxAggregateOutputType | null
  }

  export type ServicioAvgAggregateOutputType = {
    precio_base: Decimal | null
  }

  export type ServicioSumAggregateOutputType = {
    precio_base: Decimal | null
  }

  export type ServicioMinAggregateOutputType = {
    id: string | null
    nombre: string | null
    unidad_medida: string | null
    precio_base: Decimal | null
    created_at: Date | null
    active: boolean | null
  }

  export type ServicioMaxAggregateOutputType = {
    id: string | null
    nombre: string | null
    unidad_medida: string | null
    precio_base: Decimal | null
    created_at: Date | null
    active: boolean | null
  }

  export type ServicioCountAggregateOutputType = {
    id: number
    nombre: number
    unidad_medida: number
    precio_base: number
    created_at: number
    active: number
    _all: number
  }


  export type ServicioAvgAggregateInputType = {
    precio_base?: true
  }

  export type ServicioSumAggregateInputType = {
    precio_base?: true
  }

  export type ServicioMinAggregateInputType = {
    id?: true
    nombre?: true
    unidad_medida?: true
    precio_base?: true
    created_at?: true
    active?: true
  }

  export type ServicioMaxAggregateInputType = {
    id?: true
    nombre?: true
    unidad_medida?: true
    precio_base?: true
    created_at?: true
    active?: true
  }

  export type ServicioCountAggregateInputType = {
    id?: true
    nombre?: true
    unidad_medida?: true
    precio_base?: true
    created_at?: true
    active?: true
    _all?: true
  }

  export type ServicioAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Servicio to aggregate.
     */
    where?: ServicioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Servicios to fetch.
     */
    orderBy?: ServicioOrderByWithRelationInput | ServicioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ServicioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Servicios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Servicios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Servicios
    **/
    _count?: true | ServicioCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ServicioAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ServicioSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ServicioMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ServicioMaxAggregateInputType
  }

  export type GetServicioAggregateType<T extends ServicioAggregateArgs> = {
        [P in keyof T & keyof AggregateServicio]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateServicio[P]>
      : GetScalarType<T[P], AggregateServicio[P]>
  }




  export type ServicioGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ServicioWhereInput
    orderBy?: ServicioOrderByWithAggregationInput | ServicioOrderByWithAggregationInput[]
    by: ServicioScalarFieldEnum[] | ServicioScalarFieldEnum
    having?: ServicioScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ServicioCountAggregateInputType | true
    _avg?: ServicioAvgAggregateInputType
    _sum?: ServicioSumAggregateInputType
    _min?: ServicioMinAggregateInputType
    _max?: ServicioMaxAggregateInputType
  }

  export type ServicioGroupByOutputType = {
    id: string
    nombre: string
    unidad_medida: string
    precio_base: Decimal
    created_at: Date
    active: boolean | null
    _count: ServicioCountAggregateOutputType | null
    _avg: ServicioAvgAggregateOutputType | null
    _sum: ServicioSumAggregateOutputType | null
    _min: ServicioMinAggregateOutputType | null
    _max: ServicioMaxAggregateOutputType | null
  }

  type GetServicioGroupByPayload<T extends ServicioGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ServicioGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ServicioGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ServicioGroupByOutputType[P]>
            : GetScalarType<T[P], ServicioGroupByOutputType[P]>
        }
      >
    >


  export type ServicioSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    unidad_medida?: boolean
    precio_base?: boolean
    created_at?: boolean
    active?: boolean
    ordenes?: boolean | Servicio$ordenesArgs<ExtArgs>
    _count?: boolean | ServicioCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["servicio"]>

  export type ServicioSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    unidad_medida?: boolean
    precio_base?: boolean
    created_at?: boolean
    active?: boolean
  }, ExtArgs["result"]["servicio"]>

  export type ServicioSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    unidad_medida?: boolean
    precio_base?: boolean
    created_at?: boolean
    active?: boolean
  }, ExtArgs["result"]["servicio"]>

  export type ServicioSelectScalar = {
    id?: boolean
    nombre?: boolean
    unidad_medida?: boolean
    precio_base?: boolean
    created_at?: boolean
    active?: boolean
  }

  export type ServicioOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "nombre" | "unidad_medida" | "precio_base" | "created_at" | "active", ExtArgs["result"]["servicio"]>
  export type ServicioInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ordenes?: boolean | Servicio$ordenesArgs<ExtArgs>
    _count?: boolean | ServicioCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ServicioIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type ServicioIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ServicioPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Servicio"
    objects: {
      ordenes: Prisma.$OrdenTrabajoPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      nombre: string
      unidad_medida: string
      precio_base: Prisma.Decimal
      created_at: Date
      active: boolean | null
    }, ExtArgs["result"]["servicio"]>
    composites: {}
  }

  type ServicioGetPayload<S extends boolean | null | undefined | ServicioDefaultArgs> = $Result.GetResult<Prisma.$ServicioPayload, S>

  type ServicioCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ServicioFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ServicioCountAggregateInputType | true
    }

  export interface ServicioDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Servicio'], meta: { name: 'Servicio' } }
    /**
     * Find zero or one Servicio that matches the filter.
     * @param {ServicioFindUniqueArgs} args - Arguments to find a Servicio
     * @example
     * // Get one Servicio
     * const servicio = await prisma.servicio.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ServicioFindUniqueArgs>(args: SelectSubset<T, ServicioFindUniqueArgs<ExtArgs>>): Prisma__ServicioClient<$Result.GetResult<Prisma.$ServicioPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Servicio that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ServicioFindUniqueOrThrowArgs} args - Arguments to find a Servicio
     * @example
     * // Get one Servicio
     * const servicio = await prisma.servicio.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ServicioFindUniqueOrThrowArgs>(args: SelectSubset<T, ServicioFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ServicioClient<$Result.GetResult<Prisma.$ServicioPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Servicio that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServicioFindFirstArgs} args - Arguments to find a Servicio
     * @example
     * // Get one Servicio
     * const servicio = await prisma.servicio.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ServicioFindFirstArgs>(args?: SelectSubset<T, ServicioFindFirstArgs<ExtArgs>>): Prisma__ServicioClient<$Result.GetResult<Prisma.$ServicioPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Servicio that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServicioFindFirstOrThrowArgs} args - Arguments to find a Servicio
     * @example
     * // Get one Servicio
     * const servicio = await prisma.servicio.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ServicioFindFirstOrThrowArgs>(args?: SelectSubset<T, ServicioFindFirstOrThrowArgs<ExtArgs>>): Prisma__ServicioClient<$Result.GetResult<Prisma.$ServicioPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Servicios that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServicioFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Servicios
     * const servicios = await prisma.servicio.findMany()
     * 
     * // Get first 10 Servicios
     * const servicios = await prisma.servicio.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const servicioWithIdOnly = await prisma.servicio.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ServicioFindManyArgs>(args?: SelectSubset<T, ServicioFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ServicioPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Servicio.
     * @param {ServicioCreateArgs} args - Arguments to create a Servicio.
     * @example
     * // Create one Servicio
     * const Servicio = await prisma.servicio.create({
     *   data: {
     *     // ... data to create a Servicio
     *   }
     * })
     * 
     */
    create<T extends ServicioCreateArgs>(args: SelectSubset<T, ServicioCreateArgs<ExtArgs>>): Prisma__ServicioClient<$Result.GetResult<Prisma.$ServicioPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Servicios.
     * @param {ServicioCreateManyArgs} args - Arguments to create many Servicios.
     * @example
     * // Create many Servicios
     * const servicio = await prisma.servicio.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ServicioCreateManyArgs>(args?: SelectSubset<T, ServicioCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Servicios and returns the data saved in the database.
     * @param {ServicioCreateManyAndReturnArgs} args - Arguments to create many Servicios.
     * @example
     * // Create many Servicios
     * const servicio = await prisma.servicio.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Servicios and only return the `id`
     * const servicioWithIdOnly = await prisma.servicio.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ServicioCreateManyAndReturnArgs>(args?: SelectSubset<T, ServicioCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ServicioPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Servicio.
     * @param {ServicioDeleteArgs} args - Arguments to delete one Servicio.
     * @example
     * // Delete one Servicio
     * const Servicio = await prisma.servicio.delete({
     *   where: {
     *     // ... filter to delete one Servicio
     *   }
     * })
     * 
     */
    delete<T extends ServicioDeleteArgs>(args: SelectSubset<T, ServicioDeleteArgs<ExtArgs>>): Prisma__ServicioClient<$Result.GetResult<Prisma.$ServicioPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Servicio.
     * @param {ServicioUpdateArgs} args - Arguments to update one Servicio.
     * @example
     * // Update one Servicio
     * const servicio = await prisma.servicio.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ServicioUpdateArgs>(args: SelectSubset<T, ServicioUpdateArgs<ExtArgs>>): Prisma__ServicioClient<$Result.GetResult<Prisma.$ServicioPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Servicios.
     * @param {ServicioDeleteManyArgs} args - Arguments to filter Servicios to delete.
     * @example
     * // Delete a few Servicios
     * const { count } = await prisma.servicio.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ServicioDeleteManyArgs>(args?: SelectSubset<T, ServicioDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Servicios.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServicioUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Servicios
     * const servicio = await prisma.servicio.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ServicioUpdateManyArgs>(args: SelectSubset<T, ServicioUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Servicios and returns the data updated in the database.
     * @param {ServicioUpdateManyAndReturnArgs} args - Arguments to update many Servicios.
     * @example
     * // Update many Servicios
     * const servicio = await prisma.servicio.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Servicios and only return the `id`
     * const servicioWithIdOnly = await prisma.servicio.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ServicioUpdateManyAndReturnArgs>(args: SelectSubset<T, ServicioUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ServicioPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Servicio.
     * @param {ServicioUpsertArgs} args - Arguments to update or create a Servicio.
     * @example
     * // Update or create a Servicio
     * const servicio = await prisma.servicio.upsert({
     *   create: {
     *     // ... data to create a Servicio
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Servicio we want to update
     *   }
     * })
     */
    upsert<T extends ServicioUpsertArgs>(args: SelectSubset<T, ServicioUpsertArgs<ExtArgs>>): Prisma__ServicioClient<$Result.GetResult<Prisma.$ServicioPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Servicios.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServicioCountArgs} args - Arguments to filter Servicios to count.
     * @example
     * // Count the number of Servicios
     * const count = await prisma.servicio.count({
     *   where: {
     *     // ... the filter for the Servicios we want to count
     *   }
     * })
    **/
    count<T extends ServicioCountArgs>(
      args?: Subset<T, ServicioCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ServicioCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Servicio.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServicioAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ServicioAggregateArgs>(args: Subset<T, ServicioAggregateArgs>): Prisma.PrismaPromise<GetServicioAggregateType<T>>

    /**
     * Group by Servicio.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServicioGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ServicioGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ServicioGroupByArgs['orderBy'] }
        : { orderBy?: ServicioGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ServicioGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetServicioGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Servicio model
   */
  readonly fields: ServicioFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Servicio.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ServicioClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    ordenes<T extends Servicio$ordenesArgs<ExtArgs> = {}>(args?: Subset<T, Servicio$ordenesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrdenTrabajoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Servicio model
   */
  interface ServicioFieldRefs {
    readonly id: FieldRef<"Servicio", 'String'>
    readonly nombre: FieldRef<"Servicio", 'String'>
    readonly unidad_medida: FieldRef<"Servicio", 'String'>
    readonly precio_base: FieldRef<"Servicio", 'Decimal'>
    readonly created_at: FieldRef<"Servicio", 'DateTime'>
    readonly active: FieldRef<"Servicio", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * Servicio findUnique
   */
  export type ServicioFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Servicio
     */
    select?: ServicioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Servicio
     */
    omit?: ServicioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServicioInclude<ExtArgs> | null
    /**
     * Filter, which Servicio to fetch.
     */
    where: ServicioWhereUniqueInput
  }

  /**
   * Servicio findUniqueOrThrow
   */
  export type ServicioFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Servicio
     */
    select?: ServicioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Servicio
     */
    omit?: ServicioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServicioInclude<ExtArgs> | null
    /**
     * Filter, which Servicio to fetch.
     */
    where: ServicioWhereUniqueInput
  }

  /**
   * Servicio findFirst
   */
  export type ServicioFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Servicio
     */
    select?: ServicioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Servicio
     */
    omit?: ServicioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServicioInclude<ExtArgs> | null
    /**
     * Filter, which Servicio to fetch.
     */
    where?: ServicioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Servicios to fetch.
     */
    orderBy?: ServicioOrderByWithRelationInput | ServicioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Servicios.
     */
    cursor?: ServicioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Servicios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Servicios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Servicios.
     */
    distinct?: ServicioScalarFieldEnum | ServicioScalarFieldEnum[]
  }

  /**
   * Servicio findFirstOrThrow
   */
  export type ServicioFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Servicio
     */
    select?: ServicioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Servicio
     */
    omit?: ServicioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServicioInclude<ExtArgs> | null
    /**
     * Filter, which Servicio to fetch.
     */
    where?: ServicioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Servicios to fetch.
     */
    orderBy?: ServicioOrderByWithRelationInput | ServicioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Servicios.
     */
    cursor?: ServicioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Servicios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Servicios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Servicios.
     */
    distinct?: ServicioScalarFieldEnum | ServicioScalarFieldEnum[]
  }

  /**
   * Servicio findMany
   */
  export type ServicioFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Servicio
     */
    select?: ServicioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Servicio
     */
    omit?: ServicioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServicioInclude<ExtArgs> | null
    /**
     * Filter, which Servicios to fetch.
     */
    where?: ServicioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Servicios to fetch.
     */
    orderBy?: ServicioOrderByWithRelationInput | ServicioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Servicios.
     */
    cursor?: ServicioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Servicios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Servicios.
     */
    skip?: number
    distinct?: ServicioScalarFieldEnum | ServicioScalarFieldEnum[]
  }

  /**
   * Servicio create
   */
  export type ServicioCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Servicio
     */
    select?: ServicioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Servicio
     */
    omit?: ServicioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServicioInclude<ExtArgs> | null
    /**
     * The data needed to create a Servicio.
     */
    data: XOR<ServicioCreateInput, ServicioUncheckedCreateInput>
  }

  /**
   * Servicio createMany
   */
  export type ServicioCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Servicios.
     */
    data: ServicioCreateManyInput | ServicioCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Servicio createManyAndReturn
   */
  export type ServicioCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Servicio
     */
    select?: ServicioSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Servicio
     */
    omit?: ServicioOmit<ExtArgs> | null
    /**
     * The data used to create many Servicios.
     */
    data: ServicioCreateManyInput | ServicioCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Servicio update
   */
  export type ServicioUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Servicio
     */
    select?: ServicioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Servicio
     */
    omit?: ServicioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServicioInclude<ExtArgs> | null
    /**
     * The data needed to update a Servicio.
     */
    data: XOR<ServicioUpdateInput, ServicioUncheckedUpdateInput>
    /**
     * Choose, which Servicio to update.
     */
    where: ServicioWhereUniqueInput
  }

  /**
   * Servicio updateMany
   */
  export type ServicioUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Servicios.
     */
    data: XOR<ServicioUpdateManyMutationInput, ServicioUncheckedUpdateManyInput>
    /**
     * Filter which Servicios to update
     */
    where?: ServicioWhereInput
    /**
     * Limit how many Servicios to update.
     */
    limit?: number
  }

  /**
   * Servicio updateManyAndReturn
   */
  export type ServicioUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Servicio
     */
    select?: ServicioSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Servicio
     */
    omit?: ServicioOmit<ExtArgs> | null
    /**
     * The data used to update Servicios.
     */
    data: XOR<ServicioUpdateManyMutationInput, ServicioUncheckedUpdateManyInput>
    /**
     * Filter which Servicios to update
     */
    where?: ServicioWhereInput
    /**
     * Limit how many Servicios to update.
     */
    limit?: number
  }

  /**
   * Servicio upsert
   */
  export type ServicioUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Servicio
     */
    select?: ServicioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Servicio
     */
    omit?: ServicioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServicioInclude<ExtArgs> | null
    /**
     * The filter to search for the Servicio to update in case it exists.
     */
    where: ServicioWhereUniqueInput
    /**
     * In case the Servicio found by the `where` argument doesn't exist, create a new Servicio with this data.
     */
    create: XOR<ServicioCreateInput, ServicioUncheckedCreateInput>
    /**
     * In case the Servicio was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ServicioUpdateInput, ServicioUncheckedUpdateInput>
  }

  /**
   * Servicio delete
   */
  export type ServicioDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Servicio
     */
    select?: ServicioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Servicio
     */
    omit?: ServicioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServicioInclude<ExtArgs> | null
    /**
     * Filter which Servicio to delete.
     */
    where: ServicioWhereUniqueInput
  }

  /**
   * Servicio deleteMany
   */
  export type ServicioDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Servicios to delete
     */
    where?: ServicioWhereInput
    /**
     * Limit how many Servicios to delete.
     */
    limit?: number
  }

  /**
   * Servicio.ordenes
   */
  export type Servicio$ordenesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrdenTrabajo
     */
    select?: OrdenTrabajoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrdenTrabajo
     */
    omit?: OrdenTrabajoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrdenTrabajoInclude<ExtArgs> | null
    where?: OrdenTrabajoWhereInput
    orderBy?: OrdenTrabajoOrderByWithRelationInput | OrdenTrabajoOrderByWithRelationInput[]
    cursor?: OrdenTrabajoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OrdenTrabajoScalarFieldEnum | OrdenTrabajoScalarFieldEnum[]
  }

  /**
   * Servicio without action
   */
  export type ServicioDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Servicio
     */
    select?: ServicioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Servicio
     */
    omit?: ServicioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServicioInclude<ExtArgs> | null
  }


  /**
   * Model OrdenTrabajo
   */

  export type AggregateOrdenTrabajo = {
    _count: OrdenTrabajoCountAggregateOutputType | null
    _avg: OrdenTrabajoAvgAggregateOutputType | null
    _sum: OrdenTrabajoSumAggregateOutputType | null
    _min: OrdenTrabajoMinAggregateOutputType | null
    _max: OrdenTrabajoMaxAggregateOutputType | null
  }

  export type OrdenTrabajoAvgAggregateOutputType = {
    cantidad: Decimal | null
    total: Decimal | null
  }

  export type OrdenTrabajoSumAggregateOutputType = {
    cantidad: Decimal | null
    total: Decimal | null
  }

  export type OrdenTrabajoMinAggregateOutputType = {
    id: string | null
    fecha: Date | null
    cliente_id: string | null
    servicio_id: string | null
    lote_id: string | null
    cantidad: Decimal | null
    total: Decimal | null
    estado: $Enums.OrderStatus | null
    created_by: string | null
    observaciones: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type OrdenTrabajoMaxAggregateOutputType = {
    id: string | null
    fecha: Date | null
    cliente_id: string | null
    servicio_id: string | null
    lote_id: string | null
    cantidad: Decimal | null
    total: Decimal | null
    estado: $Enums.OrderStatus | null
    created_by: string | null
    observaciones: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type OrdenTrabajoCountAggregateOutputType = {
    id: number
    fecha: number
    cliente_id: number
    servicio_id: number
    lote_id: number
    cantidad: number
    total: number
    estado: number
    created_by: number
    observaciones: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type OrdenTrabajoAvgAggregateInputType = {
    cantidad?: true
    total?: true
  }

  export type OrdenTrabajoSumAggregateInputType = {
    cantidad?: true
    total?: true
  }

  export type OrdenTrabajoMinAggregateInputType = {
    id?: true
    fecha?: true
    cliente_id?: true
    servicio_id?: true
    lote_id?: true
    cantidad?: true
    total?: true
    estado?: true
    created_by?: true
    observaciones?: true
    created_at?: true
    updated_at?: true
  }

  export type OrdenTrabajoMaxAggregateInputType = {
    id?: true
    fecha?: true
    cliente_id?: true
    servicio_id?: true
    lote_id?: true
    cantidad?: true
    total?: true
    estado?: true
    created_by?: true
    observaciones?: true
    created_at?: true
    updated_at?: true
  }

  export type OrdenTrabajoCountAggregateInputType = {
    id?: true
    fecha?: true
    cliente_id?: true
    servicio_id?: true
    lote_id?: true
    cantidad?: true
    total?: true
    estado?: true
    created_by?: true
    observaciones?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type OrdenTrabajoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OrdenTrabajo to aggregate.
     */
    where?: OrdenTrabajoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrdenTrabajos to fetch.
     */
    orderBy?: OrdenTrabajoOrderByWithRelationInput | OrdenTrabajoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OrdenTrabajoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrdenTrabajos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrdenTrabajos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned OrdenTrabajos
    **/
    _count?: true | OrdenTrabajoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: OrdenTrabajoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: OrdenTrabajoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OrdenTrabajoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OrdenTrabajoMaxAggregateInputType
  }

  export type GetOrdenTrabajoAggregateType<T extends OrdenTrabajoAggregateArgs> = {
        [P in keyof T & keyof AggregateOrdenTrabajo]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOrdenTrabajo[P]>
      : GetScalarType<T[P], AggregateOrdenTrabajo[P]>
  }




  export type OrdenTrabajoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrdenTrabajoWhereInput
    orderBy?: OrdenTrabajoOrderByWithAggregationInput | OrdenTrabajoOrderByWithAggregationInput[]
    by: OrdenTrabajoScalarFieldEnum[] | OrdenTrabajoScalarFieldEnum
    having?: OrdenTrabajoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OrdenTrabajoCountAggregateInputType | true
    _avg?: OrdenTrabajoAvgAggregateInputType
    _sum?: OrdenTrabajoSumAggregateInputType
    _min?: OrdenTrabajoMinAggregateInputType
    _max?: OrdenTrabajoMaxAggregateInputType
  }

  export type OrdenTrabajoGroupByOutputType = {
    id: string
    fecha: Date
    cliente_id: string
    servicio_id: string
    lote_id: string | null
    cantidad: Decimal
    total: Decimal
    estado: $Enums.OrderStatus
    created_by: string | null
    observaciones: string | null
    created_at: Date
    updated_at: Date
    _count: OrdenTrabajoCountAggregateOutputType | null
    _avg: OrdenTrabajoAvgAggregateOutputType | null
    _sum: OrdenTrabajoSumAggregateOutputType | null
    _min: OrdenTrabajoMinAggregateOutputType | null
    _max: OrdenTrabajoMaxAggregateOutputType | null
  }

  type GetOrdenTrabajoGroupByPayload<T extends OrdenTrabajoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OrdenTrabajoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OrdenTrabajoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OrdenTrabajoGroupByOutputType[P]>
            : GetScalarType<T[P], OrdenTrabajoGroupByOutputType[P]>
        }
      >
    >


  export type OrdenTrabajoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fecha?: boolean
    cliente_id?: boolean
    servicio_id?: boolean
    lote_id?: boolean
    cantidad?: boolean
    total?: boolean
    estado?: boolean
    created_by?: boolean
    observaciones?: boolean
    created_at?: boolean
    updated_at?: boolean
    cliente?: boolean | ClienteDefaultArgs<ExtArgs>
    servicio?: boolean | ServicioDefaultArgs<ExtArgs>
    lote?: boolean | OrdenTrabajo$loteArgs<ExtArgs>
    factura?: boolean | OrdenTrabajo$facturaArgs<ExtArgs>
  }, ExtArgs["result"]["ordenTrabajo"]>

  export type OrdenTrabajoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fecha?: boolean
    cliente_id?: boolean
    servicio_id?: boolean
    lote_id?: boolean
    cantidad?: boolean
    total?: boolean
    estado?: boolean
    created_by?: boolean
    observaciones?: boolean
    created_at?: boolean
    updated_at?: boolean
    cliente?: boolean | ClienteDefaultArgs<ExtArgs>
    servicio?: boolean | ServicioDefaultArgs<ExtArgs>
    lote?: boolean | OrdenTrabajo$loteArgs<ExtArgs>
  }, ExtArgs["result"]["ordenTrabajo"]>

  export type OrdenTrabajoSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fecha?: boolean
    cliente_id?: boolean
    servicio_id?: boolean
    lote_id?: boolean
    cantidad?: boolean
    total?: boolean
    estado?: boolean
    created_by?: boolean
    observaciones?: boolean
    created_at?: boolean
    updated_at?: boolean
    cliente?: boolean | ClienteDefaultArgs<ExtArgs>
    servicio?: boolean | ServicioDefaultArgs<ExtArgs>
    lote?: boolean | OrdenTrabajo$loteArgs<ExtArgs>
  }, ExtArgs["result"]["ordenTrabajo"]>

  export type OrdenTrabajoSelectScalar = {
    id?: boolean
    fecha?: boolean
    cliente_id?: boolean
    servicio_id?: boolean
    lote_id?: boolean
    cantidad?: boolean
    total?: boolean
    estado?: boolean
    created_by?: boolean
    observaciones?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type OrdenTrabajoOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "fecha" | "cliente_id" | "servicio_id" | "lote_id" | "cantidad" | "total" | "estado" | "created_by" | "observaciones" | "created_at" | "updated_at", ExtArgs["result"]["ordenTrabajo"]>
  export type OrdenTrabajoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cliente?: boolean | ClienteDefaultArgs<ExtArgs>
    servicio?: boolean | ServicioDefaultArgs<ExtArgs>
    lote?: boolean | OrdenTrabajo$loteArgs<ExtArgs>
    factura?: boolean | OrdenTrabajo$facturaArgs<ExtArgs>
  }
  export type OrdenTrabajoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cliente?: boolean | ClienteDefaultArgs<ExtArgs>
    servicio?: boolean | ServicioDefaultArgs<ExtArgs>
    lote?: boolean | OrdenTrabajo$loteArgs<ExtArgs>
  }
  export type OrdenTrabajoIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cliente?: boolean | ClienteDefaultArgs<ExtArgs>
    servicio?: boolean | ServicioDefaultArgs<ExtArgs>
    lote?: boolean | OrdenTrabajo$loteArgs<ExtArgs>
  }

  export type $OrdenTrabajoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "OrdenTrabajo"
    objects: {
      cliente: Prisma.$ClientePayload<ExtArgs>
      servicio: Prisma.$ServicioPayload<ExtArgs>
      lote: Prisma.$LotePayload<ExtArgs> | null
      factura: Prisma.$FacturaPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      fecha: Date
      cliente_id: string
      servicio_id: string
      lote_id: string | null
      cantidad: Prisma.Decimal
      total: Prisma.Decimal
      estado: $Enums.OrderStatus
      created_by: string | null
      observaciones: string | null
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["ordenTrabajo"]>
    composites: {}
  }

  type OrdenTrabajoGetPayload<S extends boolean | null | undefined | OrdenTrabajoDefaultArgs> = $Result.GetResult<Prisma.$OrdenTrabajoPayload, S>

  type OrdenTrabajoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<OrdenTrabajoFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: OrdenTrabajoCountAggregateInputType | true
    }

  export interface OrdenTrabajoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['OrdenTrabajo'], meta: { name: 'OrdenTrabajo' } }
    /**
     * Find zero or one OrdenTrabajo that matches the filter.
     * @param {OrdenTrabajoFindUniqueArgs} args - Arguments to find a OrdenTrabajo
     * @example
     * // Get one OrdenTrabajo
     * const ordenTrabajo = await prisma.ordenTrabajo.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OrdenTrabajoFindUniqueArgs>(args: SelectSubset<T, OrdenTrabajoFindUniqueArgs<ExtArgs>>): Prisma__OrdenTrabajoClient<$Result.GetResult<Prisma.$OrdenTrabajoPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one OrdenTrabajo that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OrdenTrabajoFindUniqueOrThrowArgs} args - Arguments to find a OrdenTrabajo
     * @example
     * // Get one OrdenTrabajo
     * const ordenTrabajo = await prisma.ordenTrabajo.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OrdenTrabajoFindUniqueOrThrowArgs>(args: SelectSubset<T, OrdenTrabajoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OrdenTrabajoClient<$Result.GetResult<Prisma.$OrdenTrabajoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OrdenTrabajo that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrdenTrabajoFindFirstArgs} args - Arguments to find a OrdenTrabajo
     * @example
     * // Get one OrdenTrabajo
     * const ordenTrabajo = await prisma.ordenTrabajo.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OrdenTrabajoFindFirstArgs>(args?: SelectSubset<T, OrdenTrabajoFindFirstArgs<ExtArgs>>): Prisma__OrdenTrabajoClient<$Result.GetResult<Prisma.$OrdenTrabajoPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OrdenTrabajo that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrdenTrabajoFindFirstOrThrowArgs} args - Arguments to find a OrdenTrabajo
     * @example
     * // Get one OrdenTrabajo
     * const ordenTrabajo = await prisma.ordenTrabajo.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OrdenTrabajoFindFirstOrThrowArgs>(args?: SelectSubset<T, OrdenTrabajoFindFirstOrThrowArgs<ExtArgs>>): Prisma__OrdenTrabajoClient<$Result.GetResult<Prisma.$OrdenTrabajoPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more OrdenTrabajos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrdenTrabajoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all OrdenTrabajos
     * const ordenTrabajos = await prisma.ordenTrabajo.findMany()
     * 
     * // Get first 10 OrdenTrabajos
     * const ordenTrabajos = await prisma.ordenTrabajo.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const ordenTrabajoWithIdOnly = await prisma.ordenTrabajo.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OrdenTrabajoFindManyArgs>(args?: SelectSubset<T, OrdenTrabajoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrdenTrabajoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a OrdenTrabajo.
     * @param {OrdenTrabajoCreateArgs} args - Arguments to create a OrdenTrabajo.
     * @example
     * // Create one OrdenTrabajo
     * const OrdenTrabajo = await prisma.ordenTrabajo.create({
     *   data: {
     *     // ... data to create a OrdenTrabajo
     *   }
     * })
     * 
     */
    create<T extends OrdenTrabajoCreateArgs>(args: SelectSubset<T, OrdenTrabajoCreateArgs<ExtArgs>>): Prisma__OrdenTrabajoClient<$Result.GetResult<Prisma.$OrdenTrabajoPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many OrdenTrabajos.
     * @param {OrdenTrabajoCreateManyArgs} args - Arguments to create many OrdenTrabajos.
     * @example
     * // Create many OrdenTrabajos
     * const ordenTrabajo = await prisma.ordenTrabajo.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OrdenTrabajoCreateManyArgs>(args?: SelectSubset<T, OrdenTrabajoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many OrdenTrabajos and returns the data saved in the database.
     * @param {OrdenTrabajoCreateManyAndReturnArgs} args - Arguments to create many OrdenTrabajos.
     * @example
     * // Create many OrdenTrabajos
     * const ordenTrabajo = await prisma.ordenTrabajo.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many OrdenTrabajos and only return the `id`
     * const ordenTrabajoWithIdOnly = await prisma.ordenTrabajo.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OrdenTrabajoCreateManyAndReturnArgs>(args?: SelectSubset<T, OrdenTrabajoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrdenTrabajoPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a OrdenTrabajo.
     * @param {OrdenTrabajoDeleteArgs} args - Arguments to delete one OrdenTrabajo.
     * @example
     * // Delete one OrdenTrabajo
     * const OrdenTrabajo = await prisma.ordenTrabajo.delete({
     *   where: {
     *     // ... filter to delete one OrdenTrabajo
     *   }
     * })
     * 
     */
    delete<T extends OrdenTrabajoDeleteArgs>(args: SelectSubset<T, OrdenTrabajoDeleteArgs<ExtArgs>>): Prisma__OrdenTrabajoClient<$Result.GetResult<Prisma.$OrdenTrabajoPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one OrdenTrabajo.
     * @param {OrdenTrabajoUpdateArgs} args - Arguments to update one OrdenTrabajo.
     * @example
     * // Update one OrdenTrabajo
     * const ordenTrabajo = await prisma.ordenTrabajo.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OrdenTrabajoUpdateArgs>(args: SelectSubset<T, OrdenTrabajoUpdateArgs<ExtArgs>>): Prisma__OrdenTrabajoClient<$Result.GetResult<Prisma.$OrdenTrabajoPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more OrdenTrabajos.
     * @param {OrdenTrabajoDeleteManyArgs} args - Arguments to filter OrdenTrabajos to delete.
     * @example
     * // Delete a few OrdenTrabajos
     * const { count } = await prisma.ordenTrabajo.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OrdenTrabajoDeleteManyArgs>(args?: SelectSubset<T, OrdenTrabajoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OrdenTrabajos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrdenTrabajoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many OrdenTrabajos
     * const ordenTrabajo = await prisma.ordenTrabajo.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OrdenTrabajoUpdateManyArgs>(args: SelectSubset<T, OrdenTrabajoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OrdenTrabajos and returns the data updated in the database.
     * @param {OrdenTrabajoUpdateManyAndReturnArgs} args - Arguments to update many OrdenTrabajos.
     * @example
     * // Update many OrdenTrabajos
     * const ordenTrabajo = await prisma.ordenTrabajo.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more OrdenTrabajos and only return the `id`
     * const ordenTrabajoWithIdOnly = await prisma.ordenTrabajo.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends OrdenTrabajoUpdateManyAndReturnArgs>(args: SelectSubset<T, OrdenTrabajoUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrdenTrabajoPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one OrdenTrabajo.
     * @param {OrdenTrabajoUpsertArgs} args - Arguments to update or create a OrdenTrabajo.
     * @example
     * // Update or create a OrdenTrabajo
     * const ordenTrabajo = await prisma.ordenTrabajo.upsert({
     *   create: {
     *     // ... data to create a OrdenTrabajo
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the OrdenTrabajo we want to update
     *   }
     * })
     */
    upsert<T extends OrdenTrabajoUpsertArgs>(args: SelectSubset<T, OrdenTrabajoUpsertArgs<ExtArgs>>): Prisma__OrdenTrabajoClient<$Result.GetResult<Prisma.$OrdenTrabajoPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of OrdenTrabajos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrdenTrabajoCountArgs} args - Arguments to filter OrdenTrabajos to count.
     * @example
     * // Count the number of OrdenTrabajos
     * const count = await prisma.ordenTrabajo.count({
     *   where: {
     *     // ... the filter for the OrdenTrabajos we want to count
     *   }
     * })
    **/
    count<T extends OrdenTrabajoCountArgs>(
      args?: Subset<T, OrdenTrabajoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OrdenTrabajoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a OrdenTrabajo.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrdenTrabajoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OrdenTrabajoAggregateArgs>(args: Subset<T, OrdenTrabajoAggregateArgs>): Prisma.PrismaPromise<GetOrdenTrabajoAggregateType<T>>

    /**
     * Group by OrdenTrabajo.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrdenTrabajoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends OrdenTrabajoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OrdenTrabajoGroupByArgs['orderBy'] }
        : { orderBy?: OrdenTrabajoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, OrdenTrabajoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOrdenTrabajoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the OrdenTrabajo model
   */
  readonly fields: OrdenTrabajoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for OrdenTrabajo.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OrdenTrabajoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    cliente<T extends ClienteDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ClienteDefaultArgs<ExtArgs>>): Prisma__ClienteClient<$Result.GetResult<Prisma.$ClientePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    servicio<T extends ServicioDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ServicioDefaultArgs<ExtArgs>>): Prisma__ServicioClient<$Result.GetResult<Prisma.$ServicioPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    lote<T extends OrdenTrabajo$loteArgs<ExtArgs> = {}>(args?: Subset<T, OrdenTrabajo$loteArgs<ExtArgs>>): Prisma__LoteClient<$Result.GetResult<Prisma.$LotePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    factura<T extends OrdenTrabajo$facturaArgs<ExtArgs> = {}>(args?: Subset<T, OrdenTrabajo$facturaArgs<ExtArgs>>): Prisma__FacturaClient<$Result.GetResult<Prisma.$FacturaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the OrdenTrabajo model
   */
  interface OrdenTrabajoFieldRefs {
    readonly id: FieldRef<"OrdenTrabajo", 'String'>
    readonly fecha: FieldRef<"OrdenTrabajo", 'DateTime'>
    readonly cliente_id: FieldRef<"OrdenTrabajo", 'String'>
    readonly servicio_id: FieldRef<"OrdenTrabajo", 'String'>
    readonly lote_id: FieldRef<"OrdenTrabajo", 'String'>
    readonly cantidad: FieldRef<"OrdenTrabajo", 'Decimal'>
    readonly total: FieldRef<"OrdenTrabajo", 'Decimal'>
    readonly estado: FieldRef<"OrdenTrabajo", 'OrderStatus'>
    readonly created_by: FieldRef<"OrdenTrabajo", 'String'>
    readonly observaciones: FieldRef<"OrdenTrabajo", 'String'>
    readonly created_at: FieldRef<"OrdenTrabajo", 'DateTime'>
    readonly updated_at: FieldRef<"OrdenTrabajo", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * OrdenTrabajo findUnique
   */
  export type OrdenTrabajoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrdenTrabajo
     */
    select?: OrdenTrabajoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrdenTrabajo
     */
    omit?: OrdenTrabajoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrdenTrabajoInclude<ExtArgs> | null
    /**
     * Filter, which OrdenTrabajo to fetch.
     */
    where: OrdenTrabajoWhereUniqueInput
  }

  /**
   * OrdenTrabajo findUniqueOrThrow
   */
  export type OrdenTrabajoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrdenTrabajo
     */
    select?: OrdenTrabajoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrdenTrabajo
     */
    omit?: OrdenTrabajoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrdenTrabajoInclude<ExtArgs> | null
    /**
     * Filter, which OrdenTrabajo to fetch.
     */
    where: OrdenTrabajoWhereUniqueInput
  }

  /**
   * OrdenTrabajo findFirst
   */
  export type OrdenTrabajoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrdenTrabajo
     */
    select?: OrdenTrabajoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrdenTrabajo
     */
    omit?: OrdenTrabajoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrdenTrabajoInclude<ExtArgs> | null
    /**
     * Filter, which OrdenTrabajo to fetch.
     */
    where?: OrdenTrabajoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrdenTrabajos to fetch.
     */
    orderBy?: OrdenTrabajoOrderByWithRelationInput | OrdenTrabajoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OrdenTrabajos.
     */
    cursor?: OrdenTrabajoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrdenTrabajos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrdenTrabajos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OrdenTrabajos.
     */
    distinct?: OrdenTrabajoScalarFieldEnum | OrdenTrabajoScalarFieldEnum[]
  }

  /**
   * OrdenTrabajo findFirstOrThrow
   */
  export type OrdenTrabajoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrdenTrabajo
     */
    select?: OrdenTrabajoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrdenTrabajo
     */
    omit?: OrdenTrabajoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrdenTrabajoInclude<ExtArgs> | null
    /**
     * Filter, which OrdenTrabajo to fetch.
     */
    where?: OrdenTrabajoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrdenTrabajos to fetch.
     */
    orderBy?: OrdenTrabajoOrderByWithRelationInput | OrdenTrabajoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OrdenTrabajos.
     */
    cursor?: OrdenTrabajoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrdenTrabajos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrdenTrabajos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OrdenTrabajos.
     */
    distinct?: OrdenTrabajoScalarFieldEnum | OrdenTrabajoScalarFieldEnum[]
  }

  /**
   * OrdenTrabajo findMany
   */
  export type OrdenTrabajoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrdenTrabajo
     */
    select?: OrdenTrabajoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrdenTrabajo
     */
    omit?: OrdenTrabajoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrdenTrabajoInclude<ExtArgs> | null
    /**
     * Filter, which OrdenTrabajos to fetch.
     */
    where?: OrdenTrabajoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrdenTrabajos to fetch.
     */
    orderBy?: OrdenTrabajoOrderByWithRelationInput | OrdenTrabajoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing OrdenTrabajos.
     */
    cursor?: OrdenTrabajoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrdenTrabajos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrdenTrabajos.
     */
    skip?: number
    distinct?: OrdenTrabajoScalarFieldEnum | OrdenTrabajoScalarFieldEnum[]
  }

  /**
   * OrdenTrabajo create
   */
  export type OrdenTrabajoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrdenTrabajo
     */
    select?: OrdenTrabajoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrdenTrabajo
     */
    omit?: OrdenTrabajoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrdenTrabajoInclude<ExtArgs> | null
    /**
     * The data needed to create a OrdenTrabajo.
     */
    data: XOR<OrdenTrabajoCreateInput, OrdenTrabajoUncheckedCreateInput>
  }

  /**
   * OrdenTrabajo createMany
   */
  export type OrdenTrabajoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many OrdenTrabajos.
     */
    data: OrdenTrabajoCreateManyInput | OrdenTrabajoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * OrdenTrabajo createManyAndReturn
   */
  export type OrdenTrabajoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrdenTrabajo
     */
    select?: OrdenTrabajoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OrdenTrabajo
     */
    omit?: OrdenTrabajoOmit<ExtArgs> | null
    /**
     * The data used to create many OrdenTrabajos.
     */
    data: OrdenTrabajoCreateManyInput | OrdenTrabajoCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrdenTrabajoIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * OrdenTrabajo update
   */
  export type OrdenTrabajoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrdenTrabajo
     */
    select?: OrdenTrabajoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrdenTrabajo
     */
    omit?: OrdenTrabajoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrdenTrabajoInclude<ExtArgs> | null
    /**
     * The data needed to update a OrdenTrabajo.
     */
    data: XOR<OrdenTrabajoUpdateInput, OrdenTrabajoUncheckedUpdateInput>
    /**
     * Choose, which OrdenTrabajo to update.
     */
    where: OrdenTrabajoWhereUniqueInput
  }

  /**
   * OrdenTrabajo updateMany
   */
  export type OrdenTrabajoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update OrdenTrabajos.
     */
    data: XOR<OrdenTrabajoUpdateManyMutationInput, OrdenTrabajoUncheckedUpdateManyInput>
    /**
     * Filter which OrdenTrabajos to update
     */
    where?: OrdenTrabajoWhereInput
    /**
     * Limit how many OrdenTrabajos to update.
     */
    limit?: number
  }

  /**
   * OrdenTrabajo updateManyAndReturn
   */
  export type OrdenTrabajoUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrdenTrabajo
     */
    select?: OrdenTrabajoSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OrdenTrabajo
     */
    omit?: OrdenTrabajoOmit<ExtArgs> | null
    /**
     * The data used to update OrdenTrabajos.
     */
    data: XOR<OrdenTrabajoUpdateManyMutationInput, OrdenTrabajoUncheckedUpdateManyInput>
    /**
     * Filter which OrdenTrabajos to update
     */
    where?: OrdenTrabajoWhereInput
    /**
     * Limit how many OrdenTrabajos to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrdenTrabajoIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * OrdenTrabajo upsert
   */
  export type OrdenTrabajoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrdenTrabajo
     */
    select?: OrdenTrabajoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrdenTrabajo
     */
    omit?: OrdenTrabajoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrdenTrabajoInclude<ExtArgs> | null
    /**
     * The filter to search for the OrdenTrabajo to update in case it exists.
     */
    where: OrdenTrabajoWhereUniqueInput
    /**
     * In case the OrdenTrabajo found by the `where` argument doesn't exist, create a new OrdenTrabajo with this data.
     */
    create: XOR<OrdenTrabajoCreateInput, OrdenTrabajoUncheckedCreateInput>
    /**
     * In case the OrdenTrabajo was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OrdenTrabajoUpdateInput, OrdenTrabajoUncheckedUpdateInput>
  }

  /**
   * OrdenTrabajo delete
   */
  export type OrdenTrabajoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrdenTrabajo
     */
    select?: OrdenTrabajoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrdenTrabajo
     */
    omit?: OrdenTrabajoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrdenTrabajoInclude<ExtArgs> | null
    /**
     * Filter which OrdenTrabajo to delete.
     */
    where: OrdenTrabajoWhereUniqueInput
  }

  /**
   * OrdenTrabajo deleteMany
   */
  export type OrdenTrabajoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OrdenTrabajos to delete
     */
    where?: OrdenTrabajoWhereInput
    /**
     * Limit how many OrdenTrabajos to delete.
     */
    limit?: number
  }

  /**
   * OrdenTrabajo.lote
   */
  export type OrdenTrabajo$loteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lote
     */
    select?: LoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lote
     */
    omit?: LoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoteInclude<ExtArgs> | null
    where?: LoteWhereInput
  }

  /**
   * OrdenTrabajo.factura
   */
  export type OrdenTrabajo$facturaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Factura
     */
    select?: FacturaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Factura
     */
    omit?: FacturaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FacturaInclude<ExtArgs> | null
    where?: FacturaWhereInput
  }

  /**
   * OrdenTrabajo without action
   */
  export type OrdenTrabajoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrdenTrabajo
     */
    select?: OrdenTrabajoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrdenTrabajo
     */
    omit?: OrdenTrabajoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrdenTrabajoInclude<ExtArgs> | null
  }


  /**
   * Model Factura
   */

  export type AggregateFactura = {
    _count: FacturaCountAggregateOutputType | null
    _avg: FacturaAvgAggregateOutputType | null
    _sum: FacturaSumAggregateOutputType | null
    _min: FacturaMinAggregateOutputType | null
    _max: FacturaMaxAggregateOutputType | null
  }

  export type FacturaAvgAggregateOutputType = {
    punto_venta: number | null
    numero: number | null
    total: Decimal | null
  }

  export type FacturaSumAggregateOutputType = {
    punto_venta: number | null
    numero: bigint | null
    total: Decimal | null
  }

  export type FacturaMinAggregateOutputType = {
    id: string | null
    orden_trabajo_id: string | null
    tipo_comprobante: string | null
    punto_venta: number | null
    numero: bigint | null
    cae: string | null
    fecha_vencimiento: Date | null
    total: Decimal | null
    fecha_emision: Date | null
    estado_afip: string | null
    observaciones_afip: string | null
    pdf_url: string | null
    created_at: Date | null
  }

  export type FacturaMaxAggregateOutputType = {
    id: string | null
    orden_trabajo_id: string | null
    tipo_comprobante: string | null
    punto_venta: number | null
    numero: bigint | null
    cae: string | null
    fecha_vencimiento: Date | null
    total: Decimal | null
    fecha_emision: Date | null
    estado_afip: string | null
    observaciones_afip: string | null
    pdf_url: string | null
    created_at: Date | null
  }

  export type FacturaCountAggregateOutputType = {
    id: number
    orden_trabajo_id: number
    tipo_comprobante: number
    punto_venta: number
    numero: number
    cae: number
    fecha_vencimiento: number
    total: number
    fecha_emision: number
    estado_afip: number
    observaciones_afip: number
    pdf_url: number
    created_at: number
    _all: number
  }


  export type FacturaAvgAggregateInputType = {
    punto_venta?: true
    numero?: true
    total?: true
  }

  export type FacturaSumAggregateInputType = {
    punto_venta?: true
    numero?: true
    total?: true
  }

  export type FacturaMinAggregateInputType = {
    id?: true
    orden_trabajo_id?: true
    tipo_comprobante?: true
    punto_venta?: true
    numero?: true
    cae?: true
    fecha_vencimiento?: true
    total?: true
    fecha_emision?: true
    estado_afip?: true
    observaciones_afip?: true
    pdf_url?: true
    created_at?: true
  }

  export type FacturaMaxAggregateInputType = {
    id?: true
    orden_trabajo_id?: true
    tipo_comprobante?: true
    punto_venta?: true
    numero?: true
    cae?: true
    fecha_vencimiento?: true
    total?: true
    fecha_emision?: true
    estado_afip?: true
    observaciones_afip?: true
    pdf_url?: true
    created_at?: true
  }

  export type FacturaCountAggregateInputType = {
    id?: true
    orden_trabajo_id?: true
    tipo_comprobante?: true
    punto_venta?: true
    numero?: true
    cae?: true
    fecha_vencimiento?: true
    total?: true
    fecha_emision?: true
    estado_afip?: true
    observaciones_afip?: true
    pdf_url?: true
    created_at?: true
    _all?: true
  }

  export type FacturaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Factura to aggregate.
     */
    where?: FacturaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Facturas to fetch.
     */
    orderBy?: FacturaOrderByWithRelationInput | FacturaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FacturaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Facturas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Facturas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Facturas
    **/
    _count?: true | FacturaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FacturaAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FacturaSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FacturaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FacturaMaxAggregateInputType
  }

  export type GetFacturaAggregateType<T extends FacturaAggregateArgs> = {
        [P in keyof T & keyof AggregateFactura]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFactura[P]>
      : GetScalarType<T[P], AggregateFactura[P]>
  }




  export type FacturaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FacturaWhereInput
    orderBy?: FacturaOrderByWithAggregationInput | FacturaOrderByWithAggregationInput[]
    by: FacturaScalarFieldEnum[] | FacturaScalarFieldEnum
    having?: FacturaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FacturaCountAggregateInputType | true
    _avg?: FacturaAvgAggregateInputType
    _sum?: FacturaSumAggregateInputType
    _min?: FacturaMinAggregateInputType
    _max?: FacturaMaxAggregateInputType
  }

  export type FacturaGroupByOutputType = {
    id: string
    orden_trabajo_id: string
    tipo_comprobante: string
    punto_venta: number
    numero: bigint
    cae: string | null
    fecha_vencimiento: Date | null
    total: Decimal
    fecha_emision: Date | null
    estado_afip: string | null
    observaciones_afip: string | null
    pdf_url: string | null
    created_at: Date
    _count: FacturaCountAggregateOutputType | null
    _avg: FacturaAvgAggregateOutputType | null
    _sum: FacturaSumAggregateOutputType | null
    _min: FacturaMinAggregateOutputType | null
    _max: FacturaMaxAggregateOutputType | null
  }

  type GetFacturaGroupByPayload<T extends FacturaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FacturaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FacturaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FacturaGroupByOutputType[P]>
            : GetScalarType<T[P], FacturaGroupByOutputType[P]>
        }
      >
    >


  export type FacturaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orden_trabajo_id?: boolean
    tipo_comprobante?: boolean
    punto_venta?: boolean
    numero?: boolean
    cae?: boolean
    fecha_vencimiento?: boolean
    total?: boolean
    fecha_emision?: boolean
    estado_afip?: boolean
    observaciones_afip?: boolean
    pdf_url?: boolean
    created_at?: boolean
    orden?: boolean | OrdenTrabajoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["factura"]>

  export type FacturaSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orden_trabajo_id?: boolean
    tipo_comprobante?: boolean
    punto_venta?: boolean
    numero?: boolean
    cae?: boolean
    fecha_vencimiento?: boolean
    total?: boolean
    fecha_emision?: boolean
    estado_afip?: boolean
    observaciones_afip?: boolean
    pdf_url?: boolean
    created_at?: boolean
    orden?: boolean | OrdenTrabajoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["factura"]>

  export type FacturaSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orden_trabajo_id?: boolean
    tipo_comprobante?: boolean
    punto_venta?: boolean
    numero?: boolean
    cae?: boolean
    fecha_vencimiento?: boolean
    total?: boolean
    fecha_emision?: boolean
    estado_afip?: boolean
    observaciones_afip?: boolean
    pdf_url?: boolean
    created_at?: boolean
    orden?: boolean | OrdenTrabajoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["factura"]>

  export type FacturaSelectScalar = {
    id?: boolean
    orden_trabajo_id?: boolean
    tipo_comprobante?: boolean
    punto_venta?: boolean
    numero?: boolean
    cae?: boolean
    fecha_vencimiento?: boolean
    total?: boolean
    fecha_emision?: boolean
    estado_afip?: boolean
    observaciones_afip?: boolean
    pdf_url?: boolean
    created_at?: boolean
  }

  export type FacturaOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "orden_trabajo_id" | "tipo_comprobante" | "punto_venta" | "numero" | "cae" | "fecha_vencimiento" | "total" | "fecha_emision" | "estado_afip" | "observaciones_afip" | "pdf_url" | "created_at", ExtArgs["result"]["factura"]>
  export type FacturaInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    orden?: boolean | OrdenTrabajoDefaultArgs<ExtArgs>
  }
  export type FacturaIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    orden?: boolean | OrdenTrabajoDefaultArgs<ExtArgs>
  }
  export type FacturaIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    orden?: boolean | OrdenTrabajoDefaultArgs<ExtArgs>
  }

  export type $FacturaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Factura"
    objects: {
      orden: Prisma.$OrdenTrabajoPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      orden_trabajo_id: string
      tipo_comprobante: string
      punto_venta: number
      numero: bigint
      cae: string | null
      fecha_vencimiento: Date | null
      total: Prisma.Decimal
      fecha_emision: Date | null
      estado_afip: string | null
      observaciones_afip: string | null
      pdf_url: string | null
      created_at: Date
    }, ExtArgs["result"]["factura"]>
    composites: {}
  }

  type FacturaGetPayload<S extends boolean | null | undefined | FacturaDefaultArgs> = $Result.GetResult<Prisma.$FacturaPayload, S>

  type FacturaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FacturaFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FacturaCountAggregateInputType | true
    }

  export interface FacturaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Factura'], meta: { name: 'Factura' } }
    /**
     * Find zero or one Factura that matches the filter.
     * @param {FacturaFindUniqueArgs} args - Arguments to find a Factura
     * @example
     * // Get one Factura
     * const factura = await prisma.factura.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FacturaFindUniqueArgs>(args: SelectSubset<T, FacturaFindUniqueArgs<ExtArgs>>): Prisma__FacturaClient<$Result.GetResult<Prisma.$FacturaPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Factura that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FacturaFindUniqueOrThrowArgs} args - Arguments to find a Factura
     * @example
     * // Get one Factura
     * const factura = await prisma.factura.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FacturaFindUniqueOrThrowArgs>(args: SelectSubset<T, FacturaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FacturaClient<$Result.GetResult<Prisma.$FacturaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Factura that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FacturaFindFirstArgs} args - Arguments to find a Factura
     * @example
     * // Get one Factura
     * const factura = await prisma.factura.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FacturaFindFirstArgs>(args?: SelectSubset<T, FacturaFindFirstArgs<ExtArgs>>): Prisma__FacturaClient<$Result.GetResult<Prisma.$FacturaPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Factura that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FacturaFindFirstOrThrowArgs} args - Arguments to find a Factura
     * @example
     * // Get one Factura
     * const factura = await prisma.factura.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FacturaFindFirstOrThrowArgs>(args?: SelectSubset<T, FacturaFindFirstOrThrowArgs<ExtArgs>>): Prisma__FacturaClient<$Result.GetResult<Prisma.$FacturaPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Facturas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FacturaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Facturas
     * const facturas = await prisma.factura.findMany()
     * 
     * // Get first 10 Facturas
     * const facturas = await prisma.factura.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const facturaWithIdOnly = await prisma.factura.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FacturaFindManyArgs>(args?: SelectSubset<T, FacturaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FacturaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Factura.
     * @param {FacturaCreateArgs} args - Arguments to create a Factura.
     * @example
     * // Create one Factura
     * const Factura = await prisma.factura.create({
     *   data: {
     *     // ... data to create a Factura
     *   }
     * })
     * 
     */
    create<T extends FacturaCreateArgs>(args: SelectSubset<T, FacturaCreateArgs<ExtArgs>>): Prisma__FacturaClient<$Result.GetResult<Prisma.$FacturaPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Facturas.
     * @param {FacturaCreateManyArgs} args - Arguments to create many Facturas.
     * @example
     * // Create many Facturas
     * const factura = await prisma.factura.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FacturaCreateManyArgs>(args?: SelectSubset<T, FacturaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Facturas and returns the data saved in the database.
     * @param {FacturaCreateManyAndReturnArgs} args - Arguments to create many Facturas.
     * @example
     * // Create many Facturas
     * const factura = await prisma.factura.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Facturas and only return the `id`
     * const facturaWithIdOnly = await prisma.factura.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FacturaCreateManyAndReturnArgs>(args?: SelectSubset<T, FacturaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FacturaPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Factura.
     * @param {FacturaDeleteArgs} args - Arguments to delete one Factura.
     * @example
     * // Delete one Factura
     * const Factura = await prisma.factura.delete({
     *   where: {
     *     // ... filter to delete one Factura
     *   }
     * })
     * 
     */
    delete<T extends FacturaDeleteArgs>(args: SelectSubset<T, FacturaDeleteArgs<ExtArgs>>): Prisma__FacturaClient<$Result.GetResult<Prisma.$FacturaPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Factura.
     * @param {FacturaUpdateArgs} args - Arguments to update one Factura.
     * @example
     * // Update one Factura
     * const factura = await prisma.factura.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FacturaUpdateArgs>(args: SelectSubset<T, FacturaUpdateArgs<ExtArgs>>): Prisma__FacturaClient<$Result.GetResult<Prisma.$FacturaPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Facturas.
     * @param {FacturaDeleteManyArgs} args - Arguments to filter Facturas to delete.
     * @example
     * // Delete a few Facturas
     * const { count } = await prisma.factura.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FacturaDeleteManyArgs>(args?: SelectSubset<T, FacturaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Facturas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FacturaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Facturas
     * const factura = await prisma.factura.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FacturaUpdateManyArgs>(args: SelectSubset<T, FacturaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Facturas and returns the data updated in the database.
     * @param {FacturaUpdateManyAndReturnArgs} args - Arguments to update many Facturas.
     * @example
     * // Update many Facturas
     * const factura = await prisma.factura.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Facturas and only return the `id`
     * const facturaWithIdOnly = await prisma.factura.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends FacturaUpdateManyAndReturnArgs>(args: SelectSubset<T, FacturaUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FacturaPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Factura.
     * @param {FacturaUpsertArgs} args - Arguments to update or create a Factura.
     * @example
     * // Update or create a Factura
     * const factura = await prisma.factura.upsert({
     *   create: {
     *     // ... data to create a Factura
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Factura we want to update
     *   }
     * })
     */
    upsert<T extends FacturaUpsertArgs>(args: SelectSubset<T, FacturaUpsertArgs<ExtArgs>>): Prisma__FacturaClient<$Result.GetResult<Prisma.$FacturaPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Facturas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FacturaCountArgs} args - Arguments to filter Facturas to count.
     * @example
     * // Count the number of Facturas
     * const count = await prisma.factura.count({
     *   where: {
     *     // ... the filter for the Facturas we want to count
     *   }
     * })
    **/
    count<T extends FacturaCountArgs>(
      args?: Subset<T, FacturaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FacturaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Factura.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FacturaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FacturaAggregateArgs>(args: Subset<T, FacturaAggregateArgs>): Prisma.PrismaPromise<GetFacturaAggregateType<T>>

    /**
     * Group by Factura.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FacturaGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FacturaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FacturaGroupByArgs['orderBy'] }
        : { orderBy?: FacturaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FacturaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFacturaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Factura model
   */
  readonly fields: FacturaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Factura.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FacturaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    orden<T extends OrdenTrabajoDefaultArgs<ExtArgs> = {}>(args?: Subset<T, OrdenTrabajoDefaultArgs<ExtArgs>>): Prisma__OrdenTrabajoClient<$Result.GetResult<Prisma.$OrdenTrabajoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Factura model
   */
  interface FacturaFieldRefs {
    readonly id: FieldRef<"Factura", 'String'>
    readonly orden_trabajo_id: FieldRef<"Factura", 'String'>
    readonly tipo_comprobante: FieldRef<"Factura", 'String'>
    readonly punto_venta: FieldRef<"Factura", 'Int'>
    readonly numero: FieldRef<"Factura", 'BigInt'>
    readonly cae: FieldRef<"Factura", 'String'>
    readonly fecha_vencimiento: FieldRef<"Factura", 'DateTime'>
    readonly total: FieldRef<"Factura", 'Decimal'>
    readonly fecha_emision: FieldRef<"Factura", 'DateTime'>
    readonly estado_afip: FieldRef<"Factura", 'String'>
    readonly observaciones_afip: FieldRef<"Factura", 'String'>
    readonly pdf_url: FieldRef<"Factura", 'String'>
    readonly created_at: FieldRef<"Factura", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Factura findUnique
   */
  export type FacturaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Factura
     */
    select?: FacturaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Factura
     */
    omit?: FacturaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FacturaInclude<ExtArgs> | null
    /**
     * Filter, which Factura to fetch.
     */
    where: FacturaWhereUniqueInput
  }

  /**
   * Factura findUniqueOrThrow
   */
  export type FacturaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Factura
     */
    select?: FacturaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Factura
     */
    omit?: FacturaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FacturaInclude<ExtArgs> | null
    /**
     * Filter, which Factura to fetch.
     */
    where: FacturaWhereUniqueInput
  }

  /**
   * Factura findFirst
   */
  export type FacturaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Factura
     */
    select?: FacturaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Factura
     */
    omit?: FacturaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FacturaInclude<ExtArgs> | null
    /**
     * Filter, which Factura to fetch.
     */
    where?: FacturaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Facturas to fetch.
     */
    orderBy?: FacturaOrderByWithRelationInput | FacturaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Facturas.
     */
    cursor?: FacturaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Facturas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Facturas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Facturas.
     */
    distinct?: FacturaScalarFieldEnum | FacturaScalarFieldEnum[]
  }

  /**
   * Factura findFirstOrThrow
   */
  export type FacturaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Factura
     */
    select?: FacturaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Factura
     */
    omit?: FacturaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FacturaInclude<ExtArgs> | null
    /**
     * Filter, which Factura to fetch.
     */
    where?: FacturaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Facturas to fetch.
     */
    orderBy?: FacturaOrderByWithRelationInput | FacturaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Facturas.
     */
    cursor?: FacturaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Facturas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Facturas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Facturas.
     */
    distinct?: FacturaScalarFieldEnum | FacturaScalarFieldEnum[]
  }

  /**
   * Factura findMany
   */
  export type FacturaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Factura
     */
    select?: FacturaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Factura
     */
    omit?: FacturaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FacturaInclude<ExtArgs> | null
    /**
     * Filter, which Facturas to fetch.
     */
    where?: FacturaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Facturas to fetch.
     */
    orderBy?: FacturaOrderByWithRelationInput | FacturaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Facturas.
     */
    cursor?: FacturaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Facturas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Facturas.
     */
    skip?: number
    distinct?: FacturaScalarFieldEnum | FacturaScalarFieldEnum[]
  }

  /**
   * Factura create
   */
  export type FacturaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Factura
     */
    select?: FacturaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Factura
     */
    omit?: FacturaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FacturaInclude<ExtArgs> | null
    /**
     * The data needed to create a Factura.
     */
    data: XOR<FacturaCreateInput, FacturaUncheckedCreateInput>
  }

  /**
   * Factura createMany
   */
  export type FacturaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Facturas.
     */
    data: FacturaCreateManyInput | FacturaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Factura createManyAndReturn
   */
  export type FacturaCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Factura
     */
    select?: FacturaSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Factura
     */
    omit?: FacturaOmit<ExtArgs> | null
    /**
     * The data used to create many Facturas.
     */
    data: FacturaCreateManyInput | FacturaCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FacturaIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Factura update
   */
  export type FacturaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Factura
     */
    select?: FacturaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Factura
     */
    omit?: FacturaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FacturaInclude<ExtArgs> | null
    /**
     * The data needed to update a Factura.
     */
    data: XOR<FacturaUpdateInput, FacturaUncheckedUpdateInput>
    /**
     * Choose, which Factura to update.
     */
    where: FacturaWhereUniqueInput
  }

  /**
   * Factura updateMany
   */
  export type FacturaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Facturas.
     */
    data: XOR<FacturaUpdateManyMutationInput, FacturaUncheckedUpdateManyInput>
    /**
     * Filter which Facturas to update
     */
    where?: FacturaWhereInput
    /**
     * Limit how many Facturas to update.
     */
    limit?: number
  }

  /**
   * Factura updateManyAndReturn
   */
  export type FacturaUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Factura
     */
    select?: FacturaSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Factura
     */
    omit?: FacturaOmit<ExtArgs> | null
    /**
     * The data used to update Facturas.
     */
    data: XOR<FacturaUpdateManyMutationInput, FacturaUncheckedUpdateManyInput>
    /**
     * Filter which Facturas to update
     */
    where?: FacturaWhereInput
    /**
     * Limit how many Facturas to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FacturaIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Factura upsert
   */
  export type FacturaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Factura
     */
    select?: FacturaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Factura
     */
    omit?: FacturaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FacturaInclude<ExtArgs> | null
    /**
     * The filter to search for the Factura to update in case it exists.
     */
    where: FacturaWhereUniqueInput
    /**
     * In case the Factura found by the `where` argument doesn't exist, create a new Factura with this data.
     */
    create: XOR<FacturaCreateInput, FacturaUncheckedCreateInput>
    /**
     * In case the Factura was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FacturaUpdateInput, FacturaUncheckedUpdateInput>
  }

  /**
   * Factura delete
   */
  export type FacturaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Factura
     */
    select?: FacturaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Factura
     */
    omit?: FacturaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FacturaInclude<ExtArgs> | null
    /**
     * Filter which Factura to delete.
     */
    where: FacturaWhereUniqueInput
  }

  /**
   * Factura deleteMany
   */
  export type FacturaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Facturas to delete
     */
    where?: FacturaWhereInput
    /**
     * Limit how many Facturas to delete.
     */
    limit?: number
  }

  /**
   * Factura without action
   */
  export type FacturaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Factura
     */
    select?: FacturaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Factura
     */
    omit?: FacturaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FacturaInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UsuarioScalarFieldEnum: {
    id: 'id',
    nombre: 'nombre',
    rol: 'rol',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type UsuarioScalarFieldEnum = (typeof UsuarioScalarFieldEnum)[keyof typeof UsuarioScalarFieldEnum]


  export const ClienteScalarFieldEnum: {
    id: 'id',
    razon_social: 'razon_social',
    cuit: 'cuit',
    condicion_iva: 'condicion_iva',
    email: 'email',
    telefono: 'telefono',
    localidad_id: 'localidad_id',
    created_at: 'created_at',
    updated_at: 'updated_at',
    deleted_at: 'deleted_at'
  };

  export type ClienteScalarFieldEnum = (typeof ClienteScalarFieldEnum)[keyof typeof ClienteScalarFieldEnum]


  export const EstablecimientoScalarFieldEnum: {
    id: 'id',
    nombre: 'nombre',
    cliente_id: 'cliente_id',
    created_at: 'created_at',
    deleted_at: 'deleted_at'
  };

  export type EstablecimientoScalarFieldEnum = (typeof EstablecimientoScalarFieldEnum)[keyof typeof EstablecimientoScalarFieldEnum]


  export const LoteScalarFieldEnum: {
    id: 'id',
    nombre: 'nombre',
    hectareas: 'hectareas',
    establecimiento_id: 'establecimiento_id',
    created_at: 'created_at',
    deleted_at: 'deleted_at'
  };

  export type LoteScalarFieldEnum = (typeof LoteScalarFieldEnum)[keyof typeof LoteScalarFieldEnum]


  export const ServicioScalarFieldEnum: {
    id: 'id',
    nombre: 'nombre',
    unidad_medida: 'unidad_medida',
    precio_base: 'precio_base',
    created_at: 'created_at',
    active: 'active'
  };

  export type ServicioScalarFieldEnum = (typeof ServicioScalarFieldEnum)[keyof typeof ServicioScalarFieldEnum]


  export const OrdenTrabajoScalarFieldEnum: {
    id: 'id',
    fecha: 'fecha',
    cliente_id: 'cliente_id',
    servicio_id: 'servicio_id',
    lote_id: 'lote_id',
    cantidad: 'cantidad',
    total: 'total',
    estado: 'estado',
    created_by: 'created_by',
    observaciones: 'observaciones',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type OrdenTrabajoScalarFieldEnum = (typeof OrdenTrabajoScalarFieldEnum)[keyof typeof OrdenTrabajoScalarFieldEnum]


  export const FacturaScalarFieldEnum: {
    id: 'id',
    orden_trabajo_id: 'orden_trabajo_id',
    tipo_comprobante: 'tipo_comprobante',
    punto_venta: 'punto_venta',
    numero: 'numero',
    cae: 'cae',
    fecha_vencimiento: 'fecha_vencimiento',
    total: 'total',
    fecha_emision: 'fecha_emision',
    estado_afip: 'estado_afip',
    observaciones_afip: 'observaciones_afip',
    pdf_url: 'pdf_url',
    created_at: 'created_at'
  };

  export type FacturaScalarFieldEnum = (typeof FacturaScalarFieldEnum)[keyof typeof FacturaScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'UserRole'
   */
  export type EnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole'>
    


  /**
   * Reference to a field of type 'UserRole[]'
   */
  export type ListEnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'OrderStatus'
   */
  export type EnumOrderStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'OrderStatus'>
    


  /**
   * Reference to a field of type 'OrderStatus[]'
   */
  export type ListEnumOrderStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'OrderStatus[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'BigInt'
   */
  export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>
    


  /**
   * Reference to a field of type 'BigInt[]'
   */
  export type ListBigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UsuarioWhereInput = {
    AND?: UsuarioWhereInput | UsuarioWhereInput[]
    OR?: UsuarioWhereInput[]
    NOT?: UsuarioWhereInput | UsuarioWhereInput[]
    id?: UuidFilter<"Usuario"> | string
    nombre?: StringFilter<"Usuario"> | string
    rol?: EnumUserRoleFilter<"Usuario"> | $Enums.UserRole
    created_at?: DateTimeFilter<"Usuario"> | Date | string
    updated_at?: DateTimeFilter<"Usuario"> | Date | string
  }

  export type UsuarioOrderByWithRelationInput = {
    id?: SortOrder
    nombre?: SortOrder
    rol?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type UsuarioWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: UsuarioWhereInput | UsuarioWhereInput[]
    OR?: UsuarioWhereInput[]
    NOT?: UsuarioWhereInput | UsuarioWhereInput[]
    nombre?: StringFilter<"Usuario"> | string
    rol?: EnumUserRoleFilter<"Usuario"> | $Enums.UserRole
    created_at?: DateTimeFilter<"Usuario"> | Date | string
    updated_at?: DateTimeFilter<"Usuario"> | Date | string
  }, "id">

  export type UsuarioOrderByWithAggregationInput = {
    id?: SortOrder
    nombre?: SortOrder
    rol?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: UsuarioCountOrderByAggregateInput
    _max?: UsuarioMaxOrderByAggregateInput
    _min?: UsuarioMinOrderByAggregateInput
  }

  export type UsuarioScalarWhereWithAggregatesInput = {
    AND?: UsuarioScalarWhereWithAggregatesInput | UsuarioScalarWhereWithAggregatesInput[]
    OR?: UsuarioScalarWhereWithAggregatesInput[]
    NOT?: UsuarioScalarWhereWithAggregatesInput | UsuarioScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Usuario"> | string
    nombre?: StringWithAggregatesFilter<"Usuario"> | string
    rol?: EnumUserRoleWithAggregatesFilter<"Usuario"> | $Enums.UserRole
    created_at?: DateTimeWithAggregatesFilter<"Usuario"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"Usuario"> | Date | string
  }

  export type ClienteWhereInput = {
    AND?: ClienteWhereInput | ClienteWhereInput[]
    OR?: ClienteWhereInput[]
    NOT?: ClienteWhereInput | ClienteWhereInput[]
    id?: UuidFilter<"Cliente"> | string
    razon_social?: StringFilter<"Cliente"> | string
    cuit?: StringFilter<"Cliente"> | string
    condicion_iva?: StringFilter<"Cliente"> | string
    email?: StringNullableFilter<"Cliente"> | string | null
    telefono?: StringNullableFilter<"Cliente"> | string | null
    localidad_id?: UuidNullableFilter<"Cliente"> | string | null
    created_at?: DateTimeFilter<"Cliente"> | Date | string
    updated_at?: DateTimeFilter<"Cliente"> | Date | string
    deleted_at?: DateTimeNullableFilter<"Cliente"> | Date | string | null
    establecimientos?: EstablecimientoListRelationFilter
    ordenes?: OrdenTrabajoListRelationFilter
  }

  export type ClienteOrderByWithRelationInput = {
    id?: SortOrder
    razon_social?: SortOrder
    cuit?: SortOrder
    condicion_iva?: SortOrder
    email?: SortOrderInput | SortOrder
    telefono?: SortOrderInput | SortOrder
    localidad_id?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    deleted_at?: SortOrderInput | SortOrder
    establecimientos?: EstablecimientoOrderByRelationAggregateInput
    ordenes?: OrdenTrabajoOrderByRelationAggregateInput
  }

  export type ClienteWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    cuit?: string
    AND?: ClienteWhereInput | ClienteWhereInput[]
    OR?: ClienteWhereInput[]
    NOT?: ClienteWhereInput | ClienteWhereInput[]
    razon_social?: StringFilter<"Cliente"> | string
    condicion_iva?: StringFilter<"Cliente"> | string
    email?: StringNullableFilter<"Cliente"> | string | null
    telefono?: StringNullableFilter<"Cliente"> | string | null
    localidad_id?: UuidNullableFilter<"Cliente"> | string | null
    created_at?: DateTimeFilter<"Cliente"> | Date | string
    updated_at?: DateTimeFilter<"Cliente"> | Date | string
    deleted_at?: DateTimeNullableFilter<"Cliente"> | Date | string | null
    establecimientos?: EstablecimientoListRelationFilter
    ordenes?: OrdenTrabajoListRelationFilter
  }, "id" | "cuit">

  export type ClienteOrderByWithAggregationInput = {
    id?: SortOrder
    razon_social?: SortOrder
    cuit?: SortOrder
    condicion_iva?: SortOrder
    email?: SortOrderInput | SortOrder
    telefono?: SortOrderInput | SortOrder
    localidad_id?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    deleted_at?: SortOrderInput | SortOrder
    _count?: ClienteCountOrderByAggregateInput
    _max?: ClienteMaxOrderByAggregateInput
    _min?: ClienteMinOrderByAggregateInput
  }

  export type ClienteScalarWhereWithAggregatesInput = {
    AND?: ClienteScalarWhereWithAggregatesInput | ClienteScalarWhereWithAggregatesInput[]
    OR?: ClienteScalarWhereWithAggregatesInput[]
    NOT?: ClienteScalarWhereWithAggregatesInput | ClienteScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Cliente"> | string
    razon_social?: StringWithAggregatesFilter<"Cliente"> | string
    cuit?: StringWithAggregatesFilter<"Cliente"> | string
    condicion_iva?: StringWithAggregatesFilter<"Cliente"> | string
    email?: StringNullableWithAggregatesFilter<"Cliente"> | string | null
    telefono?: StringNullableWithAggregatesFilter<"Cliente"> | string | null
    localidad_id?: UuidNullableWithAggregatesFilter<"Cliente"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"Cliente"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"Cliente"> | Date | string
    deleted_at?: DateTimeNullableWithAggregatesFilter<"Cliente"> | Date | string | null
  }

  export type EstablecimientoWhereInput = {
    AND?: EstablecimientoWhereInput | EstablecimientoWhereInput[]
    OR?: EstablecimientoWhereInput[]
    NOT?: EstablecimientoWhereInput | EstablecimientoWhereInput[]
    id?: UuidFilter<"Establecimiento"> | string
    nombre?: StringFilter<"Establecimiento"> | string
    cliente_id?: UuidFilter<"Establecimiento"> | string
    created_at?: DateTimeFilter<"Establecimiento"> | Date | string
    deleted_at?: DateTimeNullableFilter<"Establecimiento"> | Date | string | null
    cliente?: XOR<ClienteScalarRelationFilter, ClienteWhereInput>
    lotes?: LoteListRelationFilter
  }

  export type EstablecimientoOrderByWithRelationInput = {
    id?: SortOrder
    nombre?: SortOrder
    cliente_id?: SortOrder
    created_at?: SortOrder
    deleted_at?: SortOrderInput | SortOrder
    cliente?: ClienteOrderByWithRelationInput
    lotes?: LoteOrderByRelationAggregateInput
  }

  export type EstablecimientoWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: EstablecimientoWhereInput | EstablecimientoWhereInput[]
    OR?: EstablecimientoWhereInput[]
    NOT?: EstablecimientoWhereInput | EstablecimientoWhereInput[]
    nombre?: StringFilter<"Establecimiento"> | string
    cliente_id?: UuidFilter<"Establecimiento"> | string
    created_at?: DateTimeFilter<"Establecimiento"> | Date | string
    deleted_at?: DateTimeNullableFilter<"Establecimiento"> | Date | string | null
    cliente?: XOR<ClienteScalarRelationFilter, ClienteWhereInput>
    lotes?: LoteListRelationFilter
  }, "id">

  export type EstablecimientoOrderByWithAggregationInput = {
    id?: SortOrder
    nombre?: SortOrder
    cliente_id?: SortOrder
    created_at?: SortOrder
    deleted_at?: SortOrderInput | SortOrder
    _count?: EstablecimientoCountOrderByAggregateInput
    _max?: EstablecimientoMaxOrderByAggregateInput
    _min?: EstablecimientoMinOrderByAggregateInput
  }

  export type EstablecimientoScalarWhereWithAggregatesInput = {
    AND?: EstablecimientoScalarWhereWithAggregatesInput | EstablecimientoScalarWhereWithAggregatesInput[]
    OR?: EstablecimientoScalarWhereWithAggregatesInput[]
    NOT?: EstablecimientoScalarWhereWithAggregatesInput | EstablecimientoScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Establecimiento"> | string
    nombre?: StringWithAggregatesFilter<"Establecimiento"> | string
    cliente_id?: UuidWithAggregatesFilter<"Establecimiento"> | string
    created_at?: DateTimeWithAggregatesFilter<"Establecimiento"> | Date | string
    deleted_at?: DateTimeNullableWithAggregatesFilter<"Establecimiento"> | Date | string | null
  }

  export type LoteWhereInput = {
    AND?: LoteWhereInput | LoteWhereInput[]
    OR?: LoteWhereInput[]
    NOT?: LoteWhereInput | LoteWhereInput[]
    id?: UuidFilter<"Lote"> | string
    nombre?: StringFilter<"Lote"> | string
    hectareas?: DecimalFilter<"Lote"> | Decimal | DecimalJsLike | number | string
    establecimiento_id?: UuidFilter<"Lote"> | string
    created_at?: DateTimeFilter<"Lote"> | Date | string
    deleted_at?: DateTimeNullableFilter<"Lote"> | Date | string | null
    establecimiento?: XOR<EstablecimientoScalarRelationFilter, EstablecimientoWhereInput>
    ordenes?: OrdenTrabajoListRelationFilter
  }

  export type LoteOrderByWithRelationInput = {
    id?: SortOrder
    nombre?: SortOrder
    hectareas?: SortOrder
    establecimiento_id?: SortOrder
    created_at?: SortOrder
    deleted_at?: SortOrderInput | SortOrder
    establecimiento?: EstablecimientoOrderByWithRelationInput
    ordenes?: OrdenTrabajoOrderByRelationAggregateInput
  }

  export type LoteWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: LoteWhereInput | LoteWhereInput[]
    OR?: LoteWhereInput[]
    NOT?: LoteWhereInput | LoteWhereInput[]
    nombre?: StringFilter<"Lote"> | string
    hectareas?: DecimalFilter<"Lote"> | Decimal | DecimalJsLike | number | string
    establecimiento_id?: UuidFilter<"Lote"> | string
    created_at?: DateTimeFilter<"Lote"> | Date | string
    deleted_at?: DateTimeNullableFilter<"Lote"> | Date | string | null
    establecimiento?: XOR<EstablecimientoScalarRelationFilter, EstablecimientoWhereInput>
    ordenes?: OrdenTrabajoListRelationFilter
  }, "id">

  export type LoteOrderByWithAggregationInput = {
    id?: SortOrder
    nombre?: SortOrder
    hectareas?: SortOrder
    establecimiento_id?: SortOrder
    created_at?: SortOrder
    deleted_at?: SortOrderInput | SortOrder
    _count?: LoteCountOrderByAggregateInput
    _avg?: LoteAvgOrderByAggregateInput
    _max?: LoteMaxOrderByAggregateInput
    _min?: LoteMinOrderByAggregateInput
    _sum?: LoteSumOrderByAggregateInput
  }

  export type LoteScalarWhereWithAggregatesInput = {
    AND?: LoteScalarWhereWithAggregatesInput | LoteScalarWhereWithAggregatesInput[]
    OR?: LoteScalarWhereWithAggregatesInput[]
    NOT?: LoteScalarWhereWithAggregatesInput | LoteScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Lote"> | string
    nombre?: StringWithAggregatesFilter<"Lote"> | string
    hectareas?: DecimalWithAggregatesFilter<"Lote"> | Decimal | DecimalJsLike | number | string
    establecimiento_id?: UuidWithAggregatesFilter<"Lote"> | string
    created_at?: DateTimeWithAggregatesFilter<"Lote"> | Date | string
    deleted_at?: DateTimeNullableWithAggregatesFilter<"Lote"> | Date | string | null
  }

  export type ServicioWhereInput = {
    AND?: ServicioWhereInput | ServicioWhereInput[]
    OR?: ServicioWhereInput[]
    NOT?: ServicioWhereInput | ServicioWhereInput[]
    id?: UuidFilter<"Servicio"> | string
    nombre?: StringFilter<"Servicio"> | string
    unidad_medida?: StringFilter<"Servicio"> | string
    precio_base?: DecimalFilter<"Servicio"> | Decimal | DecimalJsLike | number | string
    created_at?: DateTimeFilter<"Servicio"> | Date | string
    active?: BoolNullableFilter<"Servicio"> | boolean | null
    ordenes?: OrdenTrabajoListRelationFilter
  }

  export type ServicioOrderByWithRelationInput = {
    id?: SortOrder
    nombre?: SortOrder
    unidad_medida?: SortOrder
    precio_base?: SortOrder
    created_at?: SortOrder
    active?: SortOrderInput | SortOrder
    ordenes?: OrdenTrabajoOrderByRelationAggregateInput
  }

  export type ServicioWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ServicioWhereInput | ServicioWhereInput[]
    OR?: ServicioWhereInput[]
    NOT?: ServicioWhereInput | ServicioWhereInput[]
    nombre?: StringFilter<"Servicio"> | string
    unidad_medida?: StringFilter<"Servicio"> | string
    precio_base?: DecimalFilter<"Servicio"> | Decimal | DecimalJsLike | number | string
    created_at?: DateTimeFilter<"Servicio"> | Date | string
    active?: BoolNullableFilter<"Servicio"> | boolean | null
    ordenes?: OrdenTrabajoListRelationFilter
  }, "id">

  export type ServicioOrderByWithAggregationInput = {
    id?: SortOrder
    nombre?: SortOrder
    unidad_medida?: SortOrder
    precio_base?: SortOrder
    created_at?: SortOrder
    active?: SortOrderInput | SortOrder
    _count?: ServicioCountOrderByAggregateInput
    _avg?: ServicioAvgOrderByAggregateInput
    _max?: ServicioMaxOrderByAggregateInput
    _min?: ServicioMinOrderByAggregateInput
    _sum?: ServicioSumOrderByAggregateInput
  }

  export type ServicioScalarWhereWithAggregatesInput = {
    AND?: ServicioScalarWhereWithAggregatesInput | ServicioScalarWhereWithAggregatesInput[]
    OR?: ServicioScalarWhereWithAggregatesInput[]
    NOT?: ServicioScalarWhereWithAggregatesInput | ServicioScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Servicio"> | string
    nombre?: StringWithAggregatesFilter<"Servicio"> | string
    unidad_medida?: StringWithAggregatesFilter<"Servicio"> | string
    precio_base?: DecimalWithAggregatesFilter<"Servicio"> | Decimal | DecimalJsLike | number | string
    created_at?: DateTimeWithAggregatesFilter<"Servicio"> | Date | string
    active?: BoolNullableWithAggregatesFilter<"Servicio"> | boolean | null
  }

  export type OrdenTrabajoWhereInput = {
    AND?: OrdenTrabajoWhereInput | OrdenTrabajoWhereInput[]
    OR?: OrdenTrabajoWhereInput[]
    NOT?: OrdenTrabajoWhereInput | OrdenTrabajoWhereInput[]
    id?: UuidFilter<"OrdenTrabajo"> | string
    fecha?: DateTimeFilter<"OrdenTrabajo"> | Date | string
    cliente_id?: UuidFilter<"OrdenTrabajo"> | string
    servicio_id?: UuidFilter<"OrdenTrabajo"> | string
    lote_id?: UuidNullableFilter<"OrdenTrabajo"> | string | null
    cantidad?: DecimalFilter<"OrdenTrabajo"> | Decimal | DecimalJsLike | number | string
    total?: DecimalFilter<"OrdenTrabajo"> | Decimal | DecimalJsLike | number | string
    estado?: EnumOrderStatusFilter<"OrdenTrabajo"> | $Enums.OrderStatus
    created_by?: UuidNullableFilter<"OrdenTrabajo"> | string | null
    observaciones?: StringNullableFilter<"OrdenTrabajo"> | string | null
    created_at?: DateTimeFilter<"OrdenTrabajo"> | Date | string
    updated_at?: DateTimeFilter<"OrdenTrabajo"> | Date | string
    cliente?: XOR<ClienteScalarRelationFilter, ClienteWhereInput>
    servicio?: XOR<ServicioScalarRelationFilter, ServicioWhereInput>
    lote?: XOR<LoteNullableScalarRelationFilter, LoteWhereInput> | null
    factura?: XOR<FacturaNullableScalarRelationFilter, FacturaWhereInput> | null
  }

  export type OrdenTrabajoOrderByWithRelationInput = {
    id?: SortOrder
    fecha?: SortOrder
    cliente_id?: SortOrder
    servicio_id?: SortOrder
    lote_id?: SortOrderInput | SortOrder
    cantidad?: SortOrder
    total?: SortOrder
    estado?: SortOrder
    created_by?: SortOrderInput | SortOrder
    observaciones?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    cliente?: ClienteOrderByWithRelationInput
    servicio?: ServicioOrderByWithRelationInput
    lote?: LoteOrderByWithRelationInput
    factura?: FacturaOrderByWithRelationInput
  }

  export type OrdenTrabajoWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: OrdenTrabajoWhereInput | OrdenTrabajoWhereInput[]
    OR?: OrdenTrabajoWhereInput[]
    NOT?: OrdenTrabajoWhereInput | OrdenTrabajoWhereInput[]
    fecha?: DateTimeFilter<"OrdenTrabajo"> | Date | string
    cliente_id?: UuidFilter<"OrdenTrabajo"> | string
    servicio_id?: UuidFilter<"OrdenTrabajo"> | string
    lote_id?: UuidNullableFilter<"OrdenTrabajo"> | string | null
    cantidad?: DecimalFilter<"OrdenTrabajo"> | Decimal | DecimalJsLike | number | string
    total?: DecimalFilter<"OrdenTrabajo"> | Decimal | DecimalJsLike | number | string
    estado?: EnumOrderStatusFilter<"OrdenTrabajo"> | $Enums.OrderStatus
    created_by?: UuidNullableFilter<"OrdenTrabajo"> | string | null
    observaciones?: StringNullableFilter<"OrdenTrabajo"> | string | null
    created_at?: DateTimeFilter<"OrdenTrabajo"> | Date | string
    updated_at?: DateTimeFilter<"OrdenTrabajo"> | Date | string
    cliente?: XOR<ClienteScalarRelationFilter, ClienteWhereInput>
    servicio?: XOR<ServicioScalarRelationFilter, ServicioWhereInput>
    lote?: XOR<LoteNullableScalarRelationFilter, LoteWhereInput> | null
    factura?: XOR<FacturaNullableScalarRelationFilter, FacturaWhereInput> | null
  }, "id">

  export type OrdenTrabajoOrderByWithAggregationInput = {
    id?: SortOrder
    fecha?: SortOrder
    cliente_id?: SortOrder
    servicio_id?: SortOrder
    lote_id?: SortOrderInput | SortOrder
    cantidad?: SortOrder
    total?: SortOrder
    estado?: SortOrder
    created_by?: SortOrderInput | SortOrder
    observaciones?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: OrdenTrabajoCountOrderByAggregateInput
    _avg?: OrdenTrabajoAvgOrderByAggregateInput
    _max?: OrdenTrabajoMaxOrderByAggregateInput
    _min?: OrdenTrabajoMinOrderByAggregateInput
    _sum?: OrdenTrabajoSumOrderByAggregateInput
  }

  export type OrdenTrabajoScalarWhereWithAggregatesInput = {
    AND?: OrdenTrabajoScalarWhereWithAggregatesInput | OrdenTrabajoScalarWhereWithAggregatesInput[]
    OR?: OrdenTrabajoScalarWhereWithAggregatesInput[]
    NOT?: OrdenTrabajoScalarWhereWithAggregatesInput | OrdenTrabajoScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"OrdenTrabajo"> | string
    fecha?: DateTimeWithAggregatesFilter<"OrdenTrabajo"> | Date | string
    cliente_id?: UuidWithAggregatesFilter<"OrdenTrabajo"> | string
    servicio_id?: UuidWithAggregatesFilter<"OrdenTrabajo"> | string
    lote_id?: UuidNullableWithAggregatesFilter<"OrdenTrabajo"> | string | null
    cantidad?: DecimalWithAggregatesFilter<"OrdenTrabajo"> | Decimal | DecimalJsLike | number | string
    total?: DecimalWithAggregatesFilter<"OrdenTrabajo"> | Decimal | DecimalJsLike | number | string
    estado?: EnumOrderStatusWithAggregatesFilter<"OrdenTrabajo"> | $Enums.OrderStatus
    created_by?: UuidNullableWithAggregatesFilter<"OrdenTrabajo"> | string | null
    observaciones?: StringNullableWithAggregatesFilter<"OrdenTrabajo"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"OrdenTrabajo"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"OrdenTrabajo"> | Date | string
  }

  export type FacturaWhereInput = {
    AND?: FacturaWhereInput | FacturaWhereInput[]
    OR?: FacturaWhereInput[]
    NOT?: FacturaWhereInput | FacturaWhereInput[]
    id?: UuidFilter<"Factura"> | string
    orden_trabajo_id?: UuidFilter<"Factura"> | string
    tipo_comprobante?: StringFilter<"Factura"> | string
    punto_venta?: IntFilter<"Factura"> | number
    numero?: BigIntFilter<"Factura"> | bigint | number
    cae?: StringNullableFilter<"Factura"> | string | null
    fecha_vencimiento?: DateTimeNullableFilter<"Factura"> | Date | string | null
    total?: DecimalFilter<"Factura"> | Decimal | DecimalJsLike | number | string
    fecha_emision?: DateTimeNullableFilter<"Factura"> | Date | string | null
    estado_afip?: StringNullableFilter<"Factura"> | string | null
    observaciones_afip?: StringNullableFilter<"Factura"> | string | null
    pdf_url?: StringNullableFilter<"Factura"> | string | null
    created_at?: DateTimeFilter<"Factura"> | Date | string
    orden?: XOR<OrdenTrabajoScalarRelationFilter, OrdenTrabajoWhereInput>
  }

  export type FacturaOrderByWithRelationInput = {
    id?: SortOrder
    orden_trabajo_id?: SortOrder
    tipo_comprobante?: SortOrder
    punto_venta?: SortOrder
    numero?: SortOrder
    cae?: SortOrderInput | SortOrder
    fecha_vencimiento?: SortOrderInput | SortOrder
    total?: SortOrder
    fecha_emision?: SortOrderInput | SortOrder
    estado_afip?: SortOrderInput | SortOrder
    observaciones_afip?: SortOrderInput | SortOrder
    pdf_url?: SortOrderInput | SortOrder
    created_at?: SortOrder
    orden?: OrdenTrabajoOrderByWithRelationInput
  }

  export type FacturaWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    orden_trabajo_id?: string
    AND?: FacturaWhereInput | FacturaWhereInput[]
    OR?: FacturaWhereInput[]
    NOT?: FacturaWhereInput | FacturaWhereInput[]
    tipo_comprobante?: StringFilter<"Factura"> | string
    punto_venta?: IntFilter<"Factura"> | number
    numero?: BigIntFilter<"Factura"> | bigint | number
    cae?: StringNullableFilter<"Factura"> | string | null
    fecha_vencimiento?: DateTimeNullableFilter<"Factura"> | Date | string | null
    total?: DecimalFilter<"Factura"> | Decimal | DecimalJsLike | number | string
    fecha_emision?: DateTimeNullableFilter<"Factura"> | Date | string | null
    estado_afip?: StringNullableFilter<"Factura"> | string | null
    observaciones_afip?: StringNullableFilter<"Factura"> | string | null
    pdf_url?: StringNullableFilter<"Factura"> | string | null
    created_at?: DateTimeFilter<"Factura"> | Date | string
    orden?: XOR<OrdenTrabajoScalarRelationFilter, OrdenTrabajoWhereInput>
  }, "id" | "orden_trabajo_id">

  export type FacturaOrderByWithAggregationInput = {
    id?: SortOrder
    orden_trabajo_id?: SortOrder
    tipo_comprobante?: SortOrder
    punto_venta?: SortOrder
    numero?: SortOrder
    cae?: SortOrderInput | SortOrder
    fecha_vencimiento?: SortOrderInput | SortOrder
    total?: SortOrder
    fecha_emision?: SortOrderInput | SortOrder
    estado_afip?: SortOrderInput | SortOrder
    observaciones_afip?: SortOrderInput | SortOrder
    pdf_url?: SortOrderInput | SortOrder
    created_at?: SortOrder
    _count?: FacturaCountOrderByAggregateInput
    _avg?: FacturaAvgOrderByAggregateInput
    _max?: FacturaMaxOrderByAggregateInput
    _min?: FacturaMinOrderByAggregateInput
    _sum?: FacturaSumOrderByAggregateInput
  }

  export type FacturaScalarWhereWithAggregatesInput = {
    AND?: FacturaScalarWhereWithAggregatesInput | FacturaScalarWhereWithAggregatesInput[]
    OR?: FacturaScalarWhereWithAggregatesInput[]
    NOT?: FacturaScalarWhereWithAggregatesInput | FacturaScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Factura"> | string
    orden_trabajo_id?: UuidWithAggregatesFilter<"Factura"> | string
    tipo_comprobante?: StringWithAggregatesFilter<"Factura"> | string
    punto_venta?: IntWithAggregatesFilter<"Factura"> | number
    numero?: BigIntWithAggregatesFilter<"Factura"> | bigint | number
    cae?: StringNullableWithAggregatesFilter<"Factura"> | string | null
    fecha_vencimiento?: DateTimeNullableWithAggregatesFilter<"Factura"> | Date | string | null
    total?: DecimalWithAggregatesFilter<"Factura"> | Decimal | DecimalJsLike | number | string
    fecha_emision?: DateTimeNullableWithAggregatesFilter<"Factura"> | Date | string | null
    estado_afip?: StringNullableWithAggregatesFilter<"Factura"> | string | null
    observaciones_afip?: StringNullableWithAggregatesFilter<"Factura"> | string | null
    pdf_url?: StringNullableWithAggregatesFilter<"Factura"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"Factura"> | Date | string
  }

  export type UsuarioCreateInput = {
    id: string
    nombre: string
    rol?: $Enums.UserRole
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type UsuarioUncheckedCreateInput = {
    id: string
    nombre: string
    rol?: $Enums.UserRole
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type UsuarioUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    rol?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UsuarioUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    rol?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UsuarioCreateManyInput = {
    id: string
    nombre: string
    rol?: $Enums.UserRole
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type UsuarioUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    rol?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UsuarioUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    rol?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClienteCreateInput = {
    id?: string
    razon_social: string
    cuit: string
    condicion_iva: string
    email?: string | null
    telefono?: string | null
    localidad_id?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    deleted_at?: Date | string | null
    establecimientos?: EstablecimientoCreateNestedManyWithoutClienteInput
    ordenes?: OrdenTrabajoCreateNestedManyWithoutClienteInput
  }

  export type ClienteUncheckedCreateInput = {
    id?: string
    razon_social: string
    cuit: string
    condicion_iva: string
    email?: string | null
    telefono?: string | null
    localidad_id?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    deleted_at?: Date | string | null
    establecimientos?: EstablecimientoUncheckedCreateNestedManyWithoutClienteInput
    ordenes?: OrdenTrabajoUncheckedCreateNestedManyWithoutClienteInput
  }

  export type ClienteUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    razon_social?: StringFieldUpdateOperationsInput | string
    cuit?: StringFieldUpdateOperationsInput | string
    condicion_iva?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    telefono?: NullableStringFieldUpdateOperationsInput | string | null
    localidad_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    establecimientos?: EstablecimientoUpdateManyWithoutClienteNestedInput
    ordenes?: OrdenTrabajoUpdateManyWithoutClienteNestedInput
  }

  export type ClienteUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    razon_social?: StringFieldUpdateOperationsInput | string
    cuit?: StringFieldUpdateOperationsInput | string
    condicion_iva?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    telefono?: NullableStringFieldUpdateOperationsInput | string | null
    localidad_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    establecimientos?: EstablecimientoUncheckedUpdateManyWithoutClienteNestedInput
    ordenes?: OrdenTrabajoUncheckedUpdateManyWithoutClienteNestedInput
  }

  export type ClienteCreateManyInput = {
    id?: string
    razon_social: string
    cuit: string
    condicion_iva: string
    email?: string | null
    telefono?: string | null
    localidad_id?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    deleted_at?: Date | string | null
  }

  export type ClienteUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    razon_social?: StringFieldUpdateOperationsInput | string
    cuit?: StringFieldUpdateOperationsInput | string
    condicion_iva?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    telefono?: NullableStringFieldUpdateOperationsInput | string | null
    localidad_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ClienteUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    razon_social?: StringFieldUpdateOperationsInput | string
    cuit?: StringFieldUpdateOperationsInput | string
    condicion_iva?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    telefono?: NullableStringFieldUpdateOperationsInput | string | null
    localidad_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type EstablecimientoCreateInput = {
    id?: string
    nombre: string
    created_at?: Date | string
    deleted_at?: Date | string | null
    cliente: ClienteCreateNestedOneWithoutEstablecimientosInput
    lotes?: LoteCreateNestedManyWithoutEstablecimientoInput
  }

  export type EstablecimientoUncheckedCreateInput = {
    id?: string
    nombre: string
    cliente_id: string
    created_at?: Date | string
    deleted_at?: Date | string | null
    lotes?: LoteUncheckedCreateNestedManyWithoutEstablecimientoInput
  }

  export type EstablecimientoUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cliente?: ClienteUpdateOneRequiredWithoutEstablecimientosNestedInput
    lotes?: LoteUpdateManyWithoutEstablecimientoNestedInput
  }

  export type EstablecimientoUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    cliente_id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lotes?: LoteUncheckedUpdateManyWithoutEstablecimientoNestedInput
  }

  export type EstablecimientoCreateManyInput = {
    id?: string
    nombre: string
    cliente_id: string
    created_at?: Date | string
    deleted_at?: Date | string | null
  }

  export type EstablecimientoUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type EstablecimientoUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    cliente_id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type LoteCreateInput = {
    id?: string
    nombre: string
    hectareas?: Decimal | DecimalJsLike | number | string
    created_at?: Date | string
    deleted_at?: Date | string | null
    establecimiento: EstablecimientoCreateNestedOneWithoutLotesInput
    ordenes?: OrdenTrabajoCreateNestedManyWithoutLoteInput
  }

  export type LoteUncheckedCreateInput = {
    id?: string
    nombre: string
    hectareas?: Decimal | DecimalJsLike | number | string
    establecimiento_id: string
    created_at?: Date | string
    deleted_at?: Date | string | null
    ordenes?: OrdenTrabajoUncheckedCreateNestedManyWithoutLoteInput
  }

  export type LoteUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    hectareas?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    establecimiento?: EstablecimientoUpdateOneRequiredWithoutLotesNestedInput
    ordenes?: OrdenTrabajoUpdateManyWithoutLoteNestedInput
  }

  export type LoteUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    hectareas?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    establecimiento_id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ordenes?: OrdenTrabajoUncheckedUpdateManyWithoutLoteNestedInput
  }

  export type LoteCreateManyInput = {
    id?: string
    nombre: string
    hectareas?: Decimal | DecimalJsLike | number | string
    establecimiento_id: string
    created_at?: Date | string
    deleted_at?: Date | string | null
  }

  export type LoteUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    hectareas?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type LoteUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    hectareas?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    establecimiento_id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ServicioCreateInput = {
    id?: string
    nombre: string
    unidad_medida: string
    precio_base?: Decimal | DecimalJsLike | number | string
    created_at?: Date | string
    active?: boolean | null
    ordenes?: OrdenTrabajoCreateNestedManyWithoutServicioInput
  }

  export type ServicioUncheckedCreateInput = {
    id?: string
    nombre: string
    unidad_medida: string
    precio_base?: Decimal | DecimalJsLike | number | string
    created_at?: Date | string
    active?: boolean | null
    ordenes?: OrdenTrabajoUncheckedCreateNestedManyWithoutServicioInput
  }

  export type ServicioUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    unidad_medida?: StringFieldUpdateOperationsInput | string
    precio_base?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    active?: NullableBoolFieldUpdateOperationsInput | boolean | null
    ordenes?: OrdenTrabajoUpdateManyWithoutServicioNestedInput
  }

  export type ServicioUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    unidad_medida?: StringFieldUpdateOperationsInput | string
    precio_base?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    active?: NullableBoolFieldUpdateOperationsInput | boolean | null
    ordenes?: OrdenTrabajoUncheckedUpdateManyWithoutServicioNestedInput
  }

  export type ServicioCreateManyInput = {
    id?: string
    nombre: string
    unidad_medida: string
    precio_base?: Decimal | DecimalJsLike | number | string
    created_at?: Date | string
    active?: boolean | null
  }

  export type ServicioUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    unidad_medida?: StringFieldUpdateOperationsInput | string
    precio_base?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    active?: NullableBoolFieldUpdateOperationsInput | boolean | null
  }

  export type ServicioUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    unidad_medida?: StringFieldUpdateOperationsInput | string
    precio_base?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    active?: NullableBoolFieldUpdateOperationsInput | boolean | null
  }

  export type OrdenTrabajoCreateInput = {
    id?: string
    fecha?: Date | string
    cantidad: Decimal | DecimalJsLike | number | string
    total: Decimal | DecimalJsLike | number | string
    estado?: $Enums.OrderStatus
    created_by?: string | null
    observaciones?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    cliente: ClienteCreateNestedOneWithoutOrdenesInput
    servicio: ServicioCreateNestedOneWithoutOrdenesInput
    lote?: LoteCreateNestedOneWithoutOrdenesInput
    factura?: FacturaCreateNestedOneWithoutOrdenInput
  }

  export type OrdenTrabajoUncheckedCreateInput = {
    id?: string
    fecha?: Date | string
    cliente_id: string
    servicio_id: string
    lote_id?: string | null
    cantidad: Decimal | DecimalJsLike | number | string
    total: Decimal | DecimalJsLike | number | string
    estado?: $Enums.OrderStatus
    created_by?: string | null
    observaciones?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    factura?: FacturaUncheckedCreateNestedOneWithoutOrdenInput
  }

  export type OrdenTrabajoUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    cantidad?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    estado?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus
    created_by?: NullableStringFieldUpdateOperationsInput | string | null
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    cliente?: ClienteUpdateOneRequiredWithoutOrdenesNestedInput
    servicio?: ServicioUpdateOneRequiredWithoutOrdenesNestedInput
    lote?: LoteUpdateOneWithoutOrdenesNestedInput
    factura?: FacturaUpdateOneWithoutOrdenNestedInput
  }

  export type OrdenTrabajoUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    cliente_id?: StringFieldUpdateOperationsInput | string
    servicio_id?: StringFieldUpdateOperationsInput | string
    lote_id?: NullableStringFieldUpdateOperationsInput | string | null
    cantidad?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    estado?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus
    created_by?: NullableStringFieldUpdateOperationsInput | string | null
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    factura?: FacturaUncheckedUpdateOneWithoutOrdenNestedInput
  }

  export type OrdenTrabajoCreateManyInput = {
    id?: string
    fecha?: Date | string
    cliente_id: string
    servicio_id: string
    lote_id?: string | null
    cantidad: Decimal | DecimalJsLike | number | string
    total: Decimal | DecimalJsLike | number | string
    estado?: $Enums.OrderStatus
    created_by?: string | null
    observaciones?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type OrdenTrabajoUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    cantidad?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    estado?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus
    created_by?: NullableStringFieldUpdateOperationsInput | string | null
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrdenTrabajoUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    cliente_id?: StringFieldUpdateOperationsInput | string
    servicio_id?: StringFieldUpdateOperationsInput | string
    lote_id?: NullableStringFieldUpdateOperationsInput | string | null
    cantidad?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    estado?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus
    created_by?: NullableStringFieldUpdateOperationsInput | string | null
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FacturaCreateInput = {
    id?: string
    tipo_comprobante: string
    punto_venta: number
    numero: bigint | number
    cae?: string | null
    fecha_vencimiento?: Date | string | null
    total: Decimal | DecimalJsLike | number | string
    fecha_emision?: Date | string | null
    estado_afip?: string | null
    observaciones_afip?: string | null
    pdf_url?: string | null
    created_at?: Date | string
    orden: OrdenTrabajoCreateNestedOneWithoutFacturaInput
  }

  export type FacturaUncheckedCreateInput = {
    id?: string
    orden_trabajo_id: string
    tipo_comprobante: string
    punto_venta: number
    numero: bigint | number
    cae?: string | null
    fecha_vencimiento?: Date | string | null
    total: Decimal | DecimalJsLike | number | string
    fecha_emision?: Date | string | null
    estado_afip?: string | null
    observaciones_afip?: string | null
    pdf_url?: string | null
    created_at?: Date | string
  }

  export type FacturaUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tipo_comprobante?: StringFieldUpdateOperationsInput | string
    punto_venta?: IntFieldUpdateOperationsInput | number
    numero?: BigIntFieldUpdateOperationsInput | bigint | number
    cae?: NullableStringFieldUpdateOperationsInput | string | null
    fecha_vencimiento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    fecha_emision?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    estado_afip?: NullableStringFieldUpdateOperationsInput | string | null
    observaciones_afip?: NullableStringFieldUpdateOperationsInput | string | null
    pdf_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    orden?: OrdenTrabajoUpdateOneRequiredWithoutFacturaNestedInput
  }

  export type FacturaUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    orden_trabajo_id?: StringFieldUpdateOperationsInput | string
    tipo_comprobante?: StringFieldUpdateOperationsInput | string
    punto_venta?: IntFieldUpdateOperationsInput | number
    numero?: BigIntFieldUpdateOperationsInput | bigint | number
    cae?: NullableStringFieldUpdateOperationsInput | string | null
    fecha_vencimiento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    fecha_emision?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    estado_afip?: NullableStringFieldUpdateOperationsInput | string | null
    observaciones_afip?: NullableStringFieldUpdateOperationsInput | string | null
    pdf_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FacturaCreateManyInput = {
    id?: string
    orden_trabajo_id: string
    tipo_comprobante: string
    punto_venta: number
    numero: bigint | number
    cae?: string | null
    fecha_vencimiento?: Date | string | null
    total: Decimal | DecimalJsLike | number | string
    fecha_emision?: Date | string | null
    estado_afip?: string | null
    observaciones_afip?: string | null
    pdf_url?: string | null
    created_at?: Date | string
  }

  export type FacturaUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tipo_comprobante?: StringFieldUpdateOperationsInput | string
    punto_venta?: IntFieldUpdateOperationsInput | number
    numero?: BigIntFieldUpdateOperationsInput | bigint | number
    cae?: NullableStringFieldUpdateOperationsInput | string | null
    fecha_vencimiento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    fecha_emision?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    estado_afip?: NullableStringFieldUpdateOperationsInput | string | null
    observaciones_afip?: NullableStringFieldUpdateOperationsInput | string | null
    pdf_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FacturaUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    orden_trabajo_id?: StringFieldUpdateOperationsInput | string
    tipo_comprobante?: StringFieldUpdateOperationsInput | string
    punto_venta?: IntFieldUpdateOperationsInput | number
    numero?: BigIntFieldUpdateOperationsInput | bigint | number
    cae?: NullableStringFieldUpdateOperationsInput | string | null
    fecha_vencimiento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    fecha_emision?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    estado_afip?: NullableStringFieldUpdateOperationsInput | string | null
    observaciones_afip?: NullableStringFieldUpdateOperationsInput | string | null
    pdf_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type EnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type UsuarioCountOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    rol?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type UsuarioMaxOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    rol?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type UsuarioMinOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    rol?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type UuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type EnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type UuidNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type EstablecimientoListRelationFilter = {
    every?: EstablecimientoWhereInput
    some?: EstablecimientoWhereInput
    none?: EstablecimientoWhereInput
  }

  export type OrdenTrabajoListRelationFilter = {
    every?: OrdenTrabajoWhereInput
    some?: OrdenTrabajoWhereInput
    none?: OrdenTrabajoWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type EstablecimientoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type OrdenTrabajoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ClienteCountOrderByAggregateInput = {
    id?: SortOrder
    razon_social?: SortOrder
    cuit?: SortOrder
    condicion_iva?: SortOrder
    email?: SortOrder
    telefono?: SortOrder
    localidad_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    deleted_at?: SortOrder
  }

  export type ClienteMaxOrderByAggregateInput = {
    id?: SortOrder
    razon_social?: SortOrder
    cuit?: SortOrder
    condicion_iva?: SortOrder
    email?: SortOrder
    telefono?: SortOrder
    localidad_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    deleted_at?: SortOrder
  }

  export type ClienteMinOrderByAggregateInput = {
    id?: SortOrder
    razon_social?: SortOrder
    cuit?: SortOrder
    condicion_iva?: SortOrder
    email?: SortOrder
    telefono?: SortOrder
    localidad_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    deleted_at?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type UuidNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type ClienteScalarRelationFilter = {
    is?: ClienteWhereInput
    isNot?: ClienteWhereInput
  }

  export type LoteListRelationFilter = {
    every?: LoteWhereInput
    some?: LoteWhereInput
    none?: LoteWhereInput
  }

  export type LoteOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type EstablecimientoCountOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    cliente_id?: SortOrder
    created_at?: SortOrder
    deleted_at?: SortOrder
  }

  export type EstablecimientoMaxOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    cliente_id?: SortOrder
    created_at?: SortOrder
    deleted_at?: SortOrder
  }

  export type EstablecimientoMinOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    cliente_id?: SortOrder
    created_at?: SortOrder
    deleted_at?: SortOrder
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type EstablecimientoScalarRelationFilter = {
    is?: EstablecimientoWhereInput
    isNot?: EstablecimientoWhereInput
  }

  export type LoteCountOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    hectareas?: SortOrder
    establecimiento_id?: SortOrder
    created_at?: SortOrder
    deleted_at?: SortOrder
  }

  export type LoteAvgOrderByAggregateInput = {
    hectareas?: SortOrder
  }

  export type LoteMaxOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    hectareas?: SortOrder
    establecimiento_id?: SortOrder
    created_at?: SortOrder
    deleted_at?: SortOrder
  }

  export type LoteMinOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    hectareas?: SortOrder
    establecimiento_id?: SortOrder
    created_at?: SortOrder
    deleted_at?: SortOrder
  }

  export type LoteSumOrderByAggregateInput = {
    hectareas?: SortOrder
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type ServicioCountOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    unidad_medida?: SortOrder
    precio_base?: SortOrder
    created_at?: SortOrder
    active?: SortOrder
  }

  export type ServicioAvgOrderByAggregateInput = {
    precio_base?: SortOrder
  }

  export type ServicioMaxOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    unidad_medida?: SortOrder
    precio_base?: SortOrder
    created_at?: SortOrder
    active?: SortOrder
  }

  export type ServicioMinOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    unidad_medida?: SortOrder
    precio_base?: SortOrder
    created_at?: SortOrder
    active?: SortOrder
  }

  export type ServicioSumOrderByAggregateInput = {
    precio_base?: SortOrder
  }

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type EnumOrderStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.OrderStatus | EnumOrderStatusFieldRefInput<$PrismaModel>
    in?: $Enums.OrderStatus[] | ListEnumOrderStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.OrderStatus[] | ListEnumOrderStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumOrderStatusFilter<$PrismaModel> | $Enums.OrderStatus
  }

  export type ServicioScalarRelationFilter = {
    is?: ServicioWhereInput
    isNot?: ServicioWhereInput
  }

  export type LoteNullableScalarRelationFilter = {
    is?: LoteWhereInput | null
    isNot?: LoteWhereInput | null
  }

  export type FacturaNullableScalarRelationFilter = {
    is?: FacturaWhereInput | null
    isNot?: FacturaWhereInput | null
  }

  export type OrdenTrabajoCountOrderByAggregateInput = {
    id?: SortOrder
    fecha?: SortOrder
    cliente_id?: SortOrder
    servicio_id?: SortOrder
    lote_id?: SortOrder
    cantidad?: SortOrder
    total?: SortOrder
    estado?: SortOrder
    created_by?: SortOrder
    observaciones?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type OrdenTrabajoAvgOrderByAggregateInput = {
    cantidad?: SortOrder
    total?: SortOrder
  }

  export type OrdenTrabajoMaxOrderByAggregateInput = {
    id?: SortOrder
    fecha?: SortOrder
    cliente_id?: SortOrder
    servicio_id?: SortOrder
    lote_id?: SortOrder
    cantidad?: SortOrder
    total?: SortOrder
    estado?: SortOrder
    created_by?: SortOrder
    observaciones?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type OrdenTrabajoMinOrderByAggregateInput = {
    id?: SortOrder
    fecha?: SortOrder
    cliente_id?: SortOrder
    servicio_id?: SortOrder
    lote_id?: SortOrder
    cantidad?: SortOrder
    total?: SortOrder
    estado?: SortOrder
    created_by?: SortOrder
    observaciones?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type OrdenTrabajoSumOrderByAggregateInput = {
    cantidad?: SortOrder
    total?: SortOrder
  }

  export type EnumOrderStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.OrderStatus | EnumOrderStatusFieldRefInput<$PrismaModel>
    in?: $Enums.OrderStatus[] | ListEnumOrderStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.OrderStatus[] | ListEnumOrderStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumOrderStatusWithAggregatesFilter<$PrismaModel> | $Enums.OrderStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumOrderStatusFilter<$PrismaModel>
    _max?: NestedEnumOrderStatusFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type BigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type OrdenTrabajoScalarRelationFilter = {
    is?: OrdenTrabajoWhereInput
    isNot?: OrdenTrabajoWhereInput
  }

  export type FacturaCountOrderByAggregateInput = {
    id?: SortOrder
    orden_trabajo_id?: SortOrder
    tipo_comprobante?: SortOrder
    punto_venta?: SortOrder
    numero?: SortOrder
    cae?: SortOrder
    fecha_vencimiento?: SortOrder
    total?: SortOrder
    fecha_emision?: SortOrder
    estado_afip?: SortOrder
    observaciones_afip?: SortOrder
    pdf_url?: SortOrder
    created_at?: SortOrder
  }

  export type FacturaAvgOrderByAggregateInput = {
    punto_venta?: SortOrder
    numero?: SortOrder
    total?: SortOrder
  }

  export type FacturaMaxOrderByAggregateInput = {
    id?: SortOrder
    orden_trabajo_id?: SortOrder
    tipo_comprobante?: SortOrder
    punto_venta?: SortOrder
    numero?: SortOrder
    cae?: SortOrder
    fecha_vencimiento?: SortOrder
    total?: SortOrder
    fecha_emision?: SortOrder
    estado_afip?: SortOrder
    observaciones_afip?: SortOrder
    pdf_url?: SortOrder
    created_at?: SortOrder
  }

  export type FacturaMinOrderByAggregateInput = {
    id?: SortOrder
    orden_trabajo_id?: SortOrder
    tipo_comprobante?: SortOrder
    punto_venta?: SortOrder
    numero?: SortOrder
    cae?: SortOrder
    fecha_vencimiento?: SortOrder
    total?: SortOrder
    fecha_emision?: SortOrder
    estado_afip?: SortOrder
    observaciones_afip?: SortOrder
    pdf_url?: SortOrder
    created_at?: SortOrder
  }

  export type FacturaSumOrderByAggregateInput = {
    punto_venta?: SortOrder
    numero?: SortOrder
    total?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type BigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumUserRoleFieldUpdateOperationsInput = {
    set?: $Enums.UserRole
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type EstablecimientoCreateNestedManyWithoutClienteInput = {
    create?: XOR<EstablecimientoCreateWithoutClienteInput, EstablecimientoUncheckedCreateWithoutClienteInput> | EstablecimientoCreateWithoutClienteInput[] | EstablecimientoUncheckedCreateWithoutClienteInput[]
    connectOrCreate?: EstablecimientoCreateOrConnectWithoutClienteInput | EstablecimientoCreateOrConnectWithoutClienteInput[]
    createMany?: EstablecimientoCreateManyClienteInputEnvelope
    connect?: EstablecimientoWhereUniqueInput | EstablecimientoWhereUniqueInput[]
  }

  export type OrdenTrabajoCreateNestedManyWithoutClienteInput = {
    create?: XOR<OrdenTrabajoCreateWithoutClienteInput, OrdenTrabajoUncheckedCreateWithoutClienteInput> | OrdenTrabajoCreateWithoutClienteInput[] | OrdenTrabajoUncheckedCreateWithoutClienteInput[]
    connectOrCreate?: OrdenTrabajoCreateOrConnectWithoutClienteInput | OrdenTrabajoCreateOrConnectWithoutClienteInput[]
    createMany?: OrdenTrabajoCreateManyClienteInputEnvelope
    connect?: OrdenTrabajoWhereUniqueInput | OrdenTrabajoWhereUniqueInput[]
  }

  export type EstablecimientoUncheckedCreateNestedManyWithoutClienteInput = {
    create?: XOR<EstablecimientoCreateWithoutClienteInput, EstablecimientoUncheckedCreateWithoutClienteInput> | EstablecimientoCreateWithoutClienteInput[] | EstablecimientoUncheckedCreateWithoutClienteInput[]
    connectOrCreate?: EstablecimientoCreateOrConnectWithoutClienteInput | EstablecimientoCreateOrConnectWithoutClienteInput[]
    createMany?: EstablecimientoCreateManyClienteInputEnvelope
    connect?: EstablecimientoWhereUniqueInput | EstablecimientoWhereUniqueInput[]
  }

  export type OrdenTrabajoUncheckedCreateNestedManyWithoutClienteInput = {
    create?: XOR<OrdenTrabajoCreateWithoutClienteInput, OrdenTrabajoUncheckedCreateWithoutClienteInput> | OrdenTrabajoCreateWithoutClienteInput[] | OrdenTrabajoUncheckedCreateWithoutClienteInput[]
    connectOrCreate?: OrdenTrabajoCreateOrConnectWithoutClienteInput | OrdenTrabajoCreateOrConnectWithoutClienteInput[]
    createMany?: OrdenTrabajoCreateManyClienteInputEnvelope
    connect?: OrdenTrabajoWhereUniqueInput | OrdenTrabajoWhereUniqueInput[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type EstablecimientoUpdateManyWithoutClienteNestedInput = {
    create?: XOR<EstablecimientoCreateWithoutClienteInput, EstablecimientoUncheckedCreateWithoutClienteInput> | EstablecimientoCreateWithoutClienteInput[] | EstablecimientoUncheckedCreateWithoutClienteInput[]
    connectOrCreate?: EstablecimientoCreateOrConnectWithoutClienteInput | EstablecimientoCreateOrConnectWithoutClienteInput[]
    upsert?: EstablecimientoUpsertWithWhereUniqueWithoutClienteInput | EstablecimientoUpsertWithWhereUniqueWithoutClienteInput[]
    createMany?: EstablecimientoCreateManyClienteInputEnvelope
    set?: EstablecimientoWhereUniqueInput | EstablecimientoWhereUniqueInput[]
    disconnect?: EstablecimientoWhereUniqueInput | EstablecimientoWhereUniqueInput[]
    delete?: EstablecimientoWhereUniqueInput | EstablecimientoWhereUniqueInput[]
    connect?: EstablecimientoWhereUniqueInput | EstablecimientoWhereUniqueInput[]
    update?: EstablecimientoUpdateWithWhereUniqueWithoutClienteInput | EstablecimientoUpdateWithWhereUniqueWithoutClienteInput[]
    updateMany?: EstablecimientoUpdateManyWithWhereWithoutClienteInput | EstablecimientoUpdateManyWithWhereWithoutClienteInput[]
    deleteMany?: EstablecimientoScalarWhereInput | EstablecimientoScalarWhereInput[]
  }

  export type OrdenTrabajoUpdateManyWithoutClienteNestedInput = {
    create?: XOR<OrdenTrabajoCreateWithoutClienteInput, OrdenTrabajoUncheckedCreateWithoutClienteInput> | OrdenTrabajoCreateWithoutClienteInput[] | OrdenTrabajoUncheckedCreateWithoutClienteInput[]
    connectOrCreate?: OrdenTrabajoCreateOrConnectWithoutClienteInput | OrdenTrabajoCreateOrConnectWithoutClienteInput[]
    upsert?: OrdenTrabajoUpsertWithWhereUniqueWithoutClienteInput | OrdenTrabajoUpsertWithWhereUniqueWithoutClienteInput[]
    createMany?: OrdenTrabajoCreateManyClienteInputEnvelope
    set?: OrdenTrabajoWhereUniqueInput | OrdenTrabajoWhereUniqueInput[]
    disconnect?: OrdenTrabajoWhereUniqueInput | OrdenTrabajoWhereUniqueInput[]
    delete?: OrdenTrabajoWhereUniqueInput | OrdenTrabajoWhereUniqueInput[]
    connect?: OrdenTrabajoWhereUniqueInput | OrdenTrabajoWhereUniqueInput[]
    update?: OrdenTrabajoUpdateWithWhereUniqueWithoutClienteInput | OrdenTrabajoUpdateWithWhereUniqueWithoutClienteInput[]
    updateMany?: OrdenTrabajoUpdateManyWithWhereWithoutClienteInput | OrdenTrabajoUpdateManyWithWhereWithoutClienteInput[]
    deleteMany?: OrdenTrabajoScalarWhereInput | OrdenTrabajoScalarWhereInput[]
  }

  export type EstablecimientoUncheckedUpdateManyWithoutClienteNestedInput = {
    create?: XOR<EstablecimientoCreateWithoutClienteInput, EstablecimientoUncheckedCreateWithoutClienteInput> | EstablecimientoCreateWithoutClienteInput[] | EstablecimientoUncheckedCreateWithoutClienteInput[]
    connectOrCreate?: EstablecimientoCreateOrConnectWithoutClienteInput | EstablecimientoCreateOrConnectWithoutClienteInput[]
    upsert?: EstablecimientoUpsertWithWhereUniqueWithoutClienteInput | EstablecimientoUpsertWithWhereUniqueWithoutClienteInput[]
    createMany?: EstablecimientoCreateManyClienteInputEnvelope
    set?: EstablecimientoWhereUniqueInput | EstablecimientoWhereUniqueInput[]
    disconnect?: EstablecimientoWhereUniqueInput | EstablecimientoWhereUniqueInput[]
    delete?: EstablecimientoWhereUniqueInput | EstablecimientoWhereUniqueInput[]
    connect?: EstablecimientoWhereUniqueInput | EstablecimientoWhereUniqueInput[]
    update?: EstablecimientoUpdateWithWhereUniqueWithoutClienteInput | EstablecimientoUpdateWithWhereUniqueWithoutClienteInput[]
    updateMany?: EstablecimientoUpdateManyWithWhereWithoutClienteInput | EstablecimientoUpdateManyWithWhereWithoutClienteInput[]
    deleteMany?: EstablecimientoScalarWhereInput | EstablecimientoScalarWhereInput[]
  }

  export type OrdenTrabajoUncheckedUpdateManyWithoutClienteNestedInput = {
    create?: XOR<OrdenTrabajoCreateWithoutClienteInput, OrdenTrabajoUncheckedCreateWithoutClienteInput> | OrdenTrabajoCreateWithoutClienteInput[] | OrdenTrabajoUncheckedCreateWithoutClienteInput[]
    connectOrCreate?: OrdenTrabajoCreateOrConnectWithoutClienteInput | OrdenTrabajoCreateOrConnectWithoutClienteInput[]
    upsert?: OrdenTrabajoUpsertWithWhereUniqueWithoutClienteInput | OrdenTrabajoUpsertWithWhereUniqueWithoutClienteInput[]
    createMany?: OrdenTrabajoCreateManyClienteInputEnvelope
    set?: OrdenTrabajoWhereUniqueInput | OrdenTrabajoWhereUniqueInput[]
    disconnect?: OrdenTrabajoWhereUniqueInput | OrdenTrabajoWhereUniqueInput[]
    delete?: OrdenTrabajoWhereUniqueInput | OrdenTrabajoWhereUniqueInput[]
    connect?: OrdenTrabajoWhereUniqueInput | OrdenTrabajoWhereUniqueInput[]
    update?: OrdenTrabajoUpdateWithWhereUniqueWithoutClienteInput | OrdenTrabajoUpdateWithWhereUniqueWithoutClienteInput[]
    updateMany?: OrdenTrabajoUpdateManyWithWhereWithoutClienteInput | OrdenTrabajoUpdateManyWithWhereWithoutClienteInput[]
    deleteMany?: OrdenTrabajoScalarWhereInput | OrdenTrabajoScalarWhereInput[]
  }

  export type ClienteCreateNestedOneWithoutEstablecimientosInput = {
    create?: XOR<ClienteCreateWithoutEstablecimientosInput, ClienteUncheckedCreateWithoutEstablecimientosInput>
    connectOrCreate?: ClienteCreateOrConnectWithoutEstablecimientosInput
    connect?: ClienteWhereUniqueInput
  }

  export type LoteCreateNestedManyWithoutEstablecimientoInput = {
    create?: XOR<LoteCreateWithoutEstablecimientoInput, LoteUncheckedCreateWithoutEstablecimientoInput> | LoteCreateWithoutEstablecimientoInput[] | LoteUncheckedCreateWithoutEstablecimientoInput[]
    connectOrCreate?: LoteCreateOrConnectWithoutEstablecimientoInput | LoteCreateOrConnectWithoutEstablecimientoInput[]
    createMany?: LoteCreateManyEstablecimientoInputEnvelope
    connect?: LoteWhereUniqueInput | LoteWhereUniqueInput[]
  }

  export type LoteUncheckedCreateNestedManyWithoutEstablecimientoInput = {
    create?: XOR<LoteCreateWithoutEstablecimientoInput, LoteUncheckedCreateWithoutEstablecimientoInput> | LoteCreateWithoutEstablecimientoInput[] | LoteUncheckedCreateWithoutEstablecimientoInput[]
    connectOrCreate?: LoteCreateOrConnectWithoutEstablecimientoInput | LoteCreateOrConnectWithoutEstablecimientoInput[]
    createMany?: LoteCreateManyEstablecimientoInputEnvelope
    connect?: LoteWhereUniqueInput | LoteWhereUniqueInput[]
  }

  export type ClienteUpdateOneRequiredWithoutEstablecimientosNestedInput = {
    create?: XOR<ClienteCreateWithoutEstablecimientosInput, ClienteUncheckedCreateWithoutEstablecimientosInput>
    connectOrCreate?: ClienteCreateOrConnectWithoutEstablecimientosInput
    upsert?: ClienteUpsertWithoutEstablecimientosInput
    connect?: ClienteWhereUniqueInput
    update?: XOR<XOR<ClienteUpdateToOneWithWhereWithoutEstablecimientosInput, ClienteUpdateWithoutEstablecimientosInput>, ClienteUncheckedUpdateWithoutEstablecimientosInput>
  }

  export type LoteUpdateManyWithoutEstablecimientoNestedInput = {
    create?: XOR<LoteCreateWithoutEstablecimientoInput, LoteUncheckedCreateWithoutEstablecimientoInput> | LoteCreateWithoutEstablecimientoInput[] | LoteUncheckedCreateWithoutEstablecimientoInput[]
    connectOrCreate?: LoteCreateOrConnectWithoutEstablecimientoInput | LoteCreateOrConnectWithoutEstablecimientoInput[]
    upsert?: LoteUpsertWithWhereUniqueWithoutEstablecimientoInput | LoteUpsertWithWhereUniqueWithoutEstablecimientoInput[]
    createMany?: LoteCreateManyEstablecimientoInputEnvelope
    set?: LoteWhereUniqueInput | LoteWhereUniqueInput[]
    disconnect?: LoteWhereUniqueInput | LoteWhereUniqueInput[]
    delete?: LoteWhereUniqueInput | LoteWhereUniqueInput[]
    connect?: LoteWhereUniqueInput | LoteWhereUniqueInput[]
    update?: LoteUpdateWithWhereUniqueWithoutEstablecimientoInput | LoteUpdateWithWhereUniqueWithoutEstablecimientoInput[]
    updateMany?: LoteUpdateManyWithWhereWithoutEstablecimientoInput | LoteUpdateManyWithWhereWithoutEstablecimientoInput[]
    deleteMany?: LoteScalarWhereInput | LoteScalarWhereInput[]
  }

  export type LoteUncheckedUpdateManyWithoutEstablecimientoNestedInput = {
    create?: XOR<LoteCreateWithoutEstablecimientoInput, LoteUncheckedCreateWithoutEstablecimientoInput> | LoteCreateWithoutEstablecimientoInput[] | LoteUncheckedCreateWithoutEstablecimientoInput[]
    connectOrCreate?: LoteCreateOrConnectWithoutEstablecimientoInput | LoteCreateOrConnectWithoutEstablecimientoInput[]
    upsert?: LoteUpsertWithWhereUniqueWithoutEstablecimientoInput | LoteUpsertWithWhereUniqueWithoutEstablecimientoInput[]
    createMany?: LoteCreateManyEstablecimientoInputEnvelope
    set?: LoteWhereUniqueInput | LoteWhereUniqueInput[]
    disconnect?: LoteWhereUniqueInput | LoteWhereUniqueInput[]
    delete?: LoteWhereUniqueInput | LoteWhereUniqueInput[]
    connect?: LoteWhereUniqueInput | LoteWhereUniqueInput[]
    update?: LoteUpdateWithWhereUniqueWithoutEstablecimientoInput | LoteUpdateWithWhereUniqueWithoutEstablecimientoInput[]
    updateMany?: LoteUpdateManyWithWhereWithoutEstablecimientoInput | LoteUpdateManyWithWhereWithoutEstablecimientoInput[]
    deleteMany?: LoteScalarWhereInput | LoteScalarWhereInput[]
  }

  export type EstablecimientoCreateNestedOneWithoutLotesInput = {
    create?: XOR<EstablecimientoCreateWithoutLotesInput, EstablecimientoUncheckedCreateWithoutLotesInput>
    connectOrCreate?: EstablecimientoCreateOrConnectWithoutLotesInput
    connect?: EstablecimientoWhereUniqueInput
  }

  export type OrdenTrabajoCreateNestedManyWithoutLoteInput = {
    create?: XOR<OrdenTrabajoCreateWithoutLoteInput, OrdenTrabajoUncheckedCreateWithoutLoteInput> | OrdenTrabajoCreateWithoutLoteInput[] | OrdenTrabajoUncheckedCreateWithoutLoteInput[]
    connectOrCreate?: OrdenTrabajoCreateOrConnectWithoutLoteInput | OrdenTrabajoCreateOrConnectWithoutLoteInput[]
    createMany?: OrdenTrabajoCreateManyLoteInputEnvelope
    connect?: OrdenTrabajoWhereUniqueInput | OrdenTrabajoWhereUniqueInput[]
  }

  export type OrdenTrabajoUncheckedCreateNestedManyWithoutLoteInput = {
    create?: XOR<OrdenTrabajoCreateWithoutLoteInput, OrdenTrabajoUncheckedCreateWithoutLoteInput> | OrdenTrabajoCreateWithoutLoteInput[] | OrdenTrabajoUncheckedCreateWithoutLoteInput[]
    connectOrCreate?: OrdenTrabajoCreateOrConnectWithoutLoteInput | OrdenTrabajoCreateOrConnectWithoutLoteInput[]
    createMany?: OrdenTrabajoCreateManyLoteInputEnvelope
    connect?: OrdenTrabajoWhereUniqueInput | OrdenTrabajoWhereUniqueInput[]
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type EstablecimientoUpdateOneRequiredWithoutLotesNestedInput = {
    create?: XOR<EstablecimientoCreateWithoutLotesInput, EstablecimientoUncheckedCreateWithoutLotesInput>
    connectOrCreate?: EstablecimientoCreateOrConnectWithoutLotesInput
    upsert?: EstablecimientoUpsertWithoutLotesInput
    connect?: EstablecimientoWhereUniqueInput
    update?: XOR<XOR<EstablecimientoUpdateToOneWithWhereWithoutLotesInput, EstablecimientoUpdateWithoutLotesInput>, EstablecimientoUncheckedUpdateWithoutLotesInput>
  }

  export type OrdenTrabajoUpdateManyWithoutLoteNestedInput = {
    create?: XOR<OrdenTrabajoCreateWithoutLoteInput, OrdenTrabajoUncheckedCreateWithoutLoteInput> | OrdenTrabajoCreateWithoutLoteInput[] | OrdenTrabajoUncheckedCreateWithoutLoteInput[]
    connectOrCreate?: OrdenTrabajoCreateOrConnectWithoutLoteInput | OrdenTrabajoCreateOrConnectWithoutLoteInput[]
    upsert?: OrdenTrabajoUpsertWithWhereUniqueWithoutLoteInput | OrdenTrabajoUpsertWithWhereUniqueWithoutLoteInput[]
    createMany?: OrdenTrabajoCreateManyLoteInputEnvelope
    set?: OrdenTrabajoWhereUniqueInput | OrdenTrabajoWhereUniqueInput[]
    disconnect?: OrdenTrabajoWhereUniqueInput | OrdenTrabajoWhereUniqueInput[]
    delete?: OrdenTrabajoWhereUniqueInput | OrdenTrabajoWhereUniqueInput[]
    connect?: OrdenTrabajoWhereUniqueInput | OrdenTrabajoWhereUniqueInput[]
    update?: OrdenTrabajoUpdateWithWhereUniqueWithoutLoteInput | OrdenTrabajoUpdateWithWhereUniqueWithoutLoteInput[]
    updateMany?: OrdenTrabajoUpdateManyWithWhereWithoutLoteInput | OrdenTrabajoUpdateManyWithWhereWithoutLoteInput[]
    deleteMany?: OrdenTrabajoScalarWhereInput | OrdenTrabajoScalarWhereInput[]
  }

  export type OrdenTrabajoUncheckedUpdateManyWithoutLoteNestedInput = {
    create?: XOR<OrdenTrabajoCreateWithoutLoteInput, OrdenTrabajoUncheckedCreateWithoutLoteInput> | OrdenTrabajoCreateWithoutLoteInput[] | OrdenTrabajoUncheckedCreateWithoutLoteInput[]
    connectOrCreate?: OrdenTrabajoCreateOrConnectWithoutLoteInput | OrdenTrabajoCreateOrConnectWithoutLoteInput[]
    upsert?: OrdenTrabajoUpsertWithWhereUniqueWithoutLoteInput | OrdenTrabajoUpsertWithWhereUniqueWithoutLoteInput[]
    createMany?: OrdenTrabajoCreateManyLoteInputEnvelope
    set?: OrdenTrabajoWhereUniqueInput | OrdenTrabajoWhereUniqueInput[]
    disconnect?: OrdenTrabajoWhereUniqueInput | OrdenTrabajoWhereUniqueInput[]
    delete?: OrdenTrabajoWhereUniqueInput | OrdenTrabajoWhereUniqueInput[]
    connect?: OrdenTrabajoWhereUniqueInput | OrdenTrabajoWhereUniqueInput[]
    update?: OrdenTrabajoUpdateWithWhereUniqueWithoutLoteInput | OrdenTrabajoUpdateWithWhereUniqueWithoutLoteInput[]
    updateMany?: OrdenTrabajoUpdateManyWithWhereWithoutLoteInput | OrdenTrabajoUpdateManyWithWhereWithoutLoteInput[]
    deleteMany?: OrdenTrabajoScalarWhereInput | OrdenTrabajoScalarWhereInput[]
  }

  export type OrdenTrabajoCreateNestedManyWithoutServicioInput = {
    create?: XOR<OrdenTrabajoCreateWithoutServicioInput, OrdenTrabajoUncheckedCreateWithoutServicioInput> | OrdenTrabajoCreateWithoutServicioInput[] | OrdenTrabajoUncheckedCreateWithoutServicioInput[]
    connectOrCreate?: OrdenTrabajoCreateOrConnectWithoutServicioInput | OrdenTrabajoCreateOrConnectWithoutServicioInput[]
    createMany?: OrdenTrabajoCreateManyServicioInputEnvelope
    connect?: OrdenTrabajoWhereUniqueInput | OrdenTrabajoWhereUniqueInput[]
  }

  export type OrdenTrabajoUncheckedCreateNestedManyWithoutServicioInput = {
    create?: XOR<OrdenTrabajoCreateWithoutServicioInput, OrdenTrabajoUncheckedCreateWithoutServicioInput> | OrdenTrabajoCreateWithoutServicioInput[] | OrdenTrabajoUncheckedCreateWithoutServicioInput[]
    connectOrCreate?: OrdenTrabajoCreateOrConnectWithoutServicioInput | OrdenTrabajoCreateOrConnectWithoutServicioInput[]
    createMany?: OrdenTrabajoCreateManyServicioInputEnvelope
    connect?: OrdenTrabajoWhereUniqueInput | OrdenTrabajoWhereUniqueInput[]
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
  }

  export type OrdenTrabajoUpdateManyWithoutServicioNestedInput = {
    create?: XOR<OrdenTrabajoCreateWithoutServicioInput, OrdenTrabajoUncheckedCreateWithoutServicioInput> | OrdenTrabajoCreateWithoutServicioInput[] | OrdenTrabajoUncheckedCreateWithoutServicioInput[]
    connectOrCreate?: OrdenTrabajoCreateOrConnectWithoutServicioInput | OrdenTrabajoCreateOrConnectWithoutServicioInput[]
    upsert?: OrdenTrabajoUpsertWithWhereUniqueWithoutServicioInput | OrdenTrabajoUpsertWithWhereUniqueWithoutServicioInput[]
    createMany?: OrdenTrabajoCreateManyServicioInputEnvelope
    set?: OrdenTrabajoWhereUniqueInput | OrdenTrabajoWhereUniqueInput[]
    disconnect?: OrdenTrabajoWhereUniqueInput | OrdenTrabajoWhereUniqueInput[]
    delete?: OrdenTrabajoWhereUniqueInput | OrdenTrabajoWhereUniqueInput[]
    connect?: OrdenTrabajoWhereUniqueInput | OrdenTrabajoWhereUniqueInput[]
    update?: OrdenTrabajoUpdateWithWhereUniqueWithoutServicioInput | OrdenTrabajoUpdateWithWhereUniqueWithoutServicioInput[]
    updateMany?: OrdenTrabajoUpdateManyWithWhereWithoutServicioInput | OrdenTrabajoUpdateManyWithWhereWithoutServicioInput[]
    deleteMany?: OrdenTrabajoScalarWhereInput | OrdenTrabajoScalarWhereInput[]
  }

  export type OrdenTrabajoUncheckedUpdateManyWithoutServicioNestedInput = {
    create?: XOR<OrdenTrabajoCreateWithoutServicioInput, OrdenTrabajoUncheckedCreateWithoutServicioInput> | OrdenTrabajoCreateWithoutServicioInput[] | OrdenTrabajoUncheckedCreateWithoutServicioInput[]
    connectOrCreate?: OrdenTrabajoCreateOrConnectWithoutServicioInput | OrdenTrabajoCreateOrConnectWithoutServicioInput[]
    upsert?: OrdenTrabajoUpsertWithWhereUniqueWithoutServicioInput | OrdenTrabajoUpsertWithWhereUniqueWithoutServicioInput[]
    createMany?: OrdenTrabajoCreateManyServicioInputEnvelope
    set?: OrdenTrabajoWhereUniqueInput | OrdenTrabajoWhereUniqueInput[]
    disconnect?: OrdenTrabajoWhereUniqueInput | OrdenTrabajoWhereUniqueInput[]
    delete?: OrdenTrabajoWhereUniqueInput | OrdenTrabajoWhereUniqueInput[]
    connect?: OrdenTrabajoWhereUniqueInput | OrdenTrabajoWhereUniqueInput[]
    update?: OrdenTrabajoUpdateWithWhereUniqueWithoutServicioInput | OrdenTrabajoUpdateWithWhereUniqueWithoutServicioInput[]
    updateMany?: OrdenTrabajoUpdateManyWithWhereWithoutServicioInput | OrdenTrabajoUpdateManyWithWhereWithoutServicioInput[]
    deleteMany?: OrdenTrabajoScalarWhereInput | OrdenTrabajoScalarWhereInput[]
  }

  export type ClienteCreateNestedOneWithoutOrdenesInput = {
    create?: XOR<ClienteCreateWithoutOrdenesInput, ClienteUncheckedCreateWithoutOrdenesInput>
    connectOrCreate?: ClienteCreateOrConnectWithoutOrdenesInput
    connect?: ClienteWhereUniqueInput
  }

  export type ServicioCreateNestedOneWithoutOrdenesInput = {
    create?: XOR<ServicioCreateWithoutOrdenesInput, ServicioUncheckedCreateWithoutOrdenesInput>
    connectOrCreate?: ServicioCreateOrConnectWithoutOrdenesInput
    connect?: ServicioWhereUniqueInput
  }

  export type LoteCreateNestedOneWithoutOrdenesInput = {
    create?: XOR<LoteCreateWithoutOrdenesInput, LoteUncheckedCreateWithoutOrdenesInput>
    connectOrCreate?: LoteCreateOrConnectWithoutOrdenesInput
    connect?: LoteWhereUniqueInput
  }

  export type FacturaCreateNestedOneWithoutOrdenInput = {
    create?: XOR<FacturaCreateWithoutOrdenInput, FacturaUncheckedCreateWithoutOrdenInput>
    connectOrCreate?: FacturaCreateOrConnectWithoutOrdenInput
    connect?: FacturaWhereUniqueInput
  }

  export type FacturaUncheckedCreateNestedOneWithoutOrdenInput = {
    create?: XOR<FacturaCreateWithoutOrdenInput, FacturaUncheckedCreateWithoutOrdenInput>
    connectOrCreate?: FacturaCreateOrConnectWithoutOrdenInput
    connect?: FacturaWhereUniqueInput
  }

  export type EnumOrderStatusFieldUpdateOperationsInput = {
    set?: $Enums.OrderStatus
  }

  export type ClienteUpdateOneRequiredWithoutOrdenesNestedInput = {
    create?: XOR<ClienteCreateWithoutOrdenesInput, ClienteUncheckedCreateWithoutOrdenesInput>
    connectOrCreate?: ClienteCreateOrConnectWithoutOrdenesInput
    upsert?: ClienteUpsertWithoutOrdenesInput
    connect?: ClienteWhereUniqueInput
    update?: XOR<XOR<ClienteUpdateToOneWithWhereWithoutOrdenesInput, ClienteUpdateWithoutOrdenesInput>, ClienteUncheckedUpdateWithoutOrdenesInput>
  }

  export type ServicioUpdateOneRequiredWithoutOrdenesNestedInput = {
    create?: XOR<ServicioCreateWithoutOrdenesInput, ServicioUncheckedCreateWithoutOrdenesInput>
    connectOrCreate?: ServicioCreateOrConnectWithoutOrdenesInput
    upsert?: ServicioUpsertWithoutOrdenesInput
    connect?: ServicioWhereUniqueInput
    update?: XOR<XOR<ServicioUpdateToOneWithWhereWithoutOrdenesInput, ServicioUpdateWithoutOrdenesInput>, ServicioUncheckedUpdateWithoutOrdenesInput>
  }

  export type LoteUpdateOneWithoutOrdenesNestedInput = {
    create?: XOR<LoteCreateWithoutOrdenesInput, LoteUncheckedCreateWithoutOrdenesInput>
    connectOrCreate?: LoteCreateOrConnectWithoutOrdenesInput
    upsert?: LoteUpsertWithoutOrdenesInput
    disconnect?: LoteWhereInput | boolean
    delete?: LoteWhereInput | boolean
    connect?: LoteWhereUniqueInput
    update?: XOR<XOR<LoteUpdateToOneWithWhereWithoutOrdenesInput, LoteUpdateWithoutOrdenesInput>, LoteUncheckedUpdateWithoutOrdenesInput>
  }

  export type FacturaUpdateOneWithoutOrdenNestedInput = {
    create?: XOR<FacturaCreateWithoutOrdenInput, FacturaUncheckedCreateWithoutOrdenInput>
    connectOrCreate?: FacturaCreateOrConnectWithoutOrdenInput
    upsert?: FacturaUpsertWithoutOrdenInput
    disconnect?: FacturaWhereInput | boolean
    delete?: FacturaWhereInput | boolean
    connect?: FacturaWhereUniqueInput
    update?: XOR<XOR<FacturaUpdateToOneWithWhereWithoutOrdenInput, FacturaUpdateWithoutOrdenInput>, FacturaUncheckedUpdateWithoutOrdenInput>
  }

  export type FacturaUncheckedUpdateOneWithoutOrdenNestedInput = {
    create?: XOR<FacturaCreateWithoutOrdenInput, FacturaUncheckedCreateWithoutOrdenInput>
    connectOrCreate?: FacturaCreateOrConnectWithoutOrdenInput
    upsert?: FacturaUpsertWithoutOrdenInput
    disconnect?: FacturaWhereInput | boolean
    delete?: FacturaWhereInput | boolean
    connect?: FacturaWhereUniqueInput
    update?: XOR<XOR<FacturaUpdateToOneWithWhereWithoutOrdenInput, FacturaUpdateWithoutOrdenInput>, FacturaUncheckedUpdateWithoutOrdenInput>
  }

  export type OrdenTrabajoCreateNestedOneWithoutFacturaInput = {
    create?: XOR<OrdenTrabajoCreateWithoutFacturaInput, OrdenTrabajoUncheckedCreateWithoutFacturaInput>
    connectOrCreate?: OrdenTrabajoCreateOrConnectWithoutFacturaInput
    connect?: OrdenTrabajoWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BigIntFieldUpdateOperationsInput = {
    set?: bigint | number
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type OrdenTrabajoUpdateOneRequiredWithoutFacturaNestedInput = {
    create?: XOR<OrdenTrabajoCreateWithoutFacturaInput, OrdenTrabajoUncheckedCreateWithoutFacturaInput>
    connectOrCreate?: OrdenTrabajoCreateOrConnectWithoutFacturaInput
    upsert?: OrdenTrabajoUpsertWithoutFacturaInput
    connect?: OrdenTrabajoWhereUniqueInput
    update?: XOR<XOR<OrdenTrabajoUpdateToOneWithWhereWithoutFacturaInput, OrdenTrabajoUpdateWithoutFacturaInput>, OrdenTrabajoUncheckedUpdateWithoutFacturaInput>
  }

  export type NestedUuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedEnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedUuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedEnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedUuidNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedUuidNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type NestedEnumOrderStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.OrderStatus | EnumOrderStatusFieldRefInput<$PrismaModel>
    in?: $Enums.OrderStatus[] | ListEnumOrderStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.OrderStatus[] | ListEnumOrderStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumOrderStatusFilter<$PrismaModel> | $Enums.OrderStatus
  }

  export type NestedEnumOrderStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.OrderStatus | EnumOrderStatusFieldRefInput<$PrismaModel>
    in?: $Enums.OrderStatus[] | ListEnumOrderStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.OrderStatus[] | ListEnumOrderStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumOrderStatusWithAggregatesFilter<$PrismaModel> | $Enums.OrderStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumOrderStatusFilter<$PrismaModel>
    _max?: NestedEnumOrderStatusFilter<$PrismaModel>
  }

  export type NestedBigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedBigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type EstablecimientoCreateWithoutClienteInput = {
    id?: string
    nombre: string
    created_at?: Date | string
    deleted_at?: Date | string | null
    lotes?: LoteCreateNestedManyWithoutEstablecimientoInput
  }

  export type EstablecimientoUncheckedCreateWithoutClienteInput = {
    id?: string
    nombre: string
    created_at?: Date | string
    deleted_at?: Date | string | null
    lotes?: LoteUncheckedCreateNestedManyWithoutEstablecimientoInput
  }

  export type EstablecimientoCreateOrConnectWithoutClienteInput = {
    where: EstablecimientoWhereUniqueInput
    create: XOR<EstablecimientoCreateWithoutClienteInput, EstablecimientoUncheckedCreateWithoutClienteInput>
  }

  export type EstablecimientoCreateManyClienteInputEnvelope = {
    data: EstablecimientoCreateManyClienteInput | EstablecimientoCreateManyClienteInput[]
    skipDuplicates?: boolean
  }

  export type OrdenTrabajoCreateWithoutClienteInput = {
    id?: string
    fecha?: Date | string
    cantidad: Decimal | DecimalJsLike | number | string
    total: Decimal | DecimalJsLike | number | string
    estado?: $Enums.OrderStatus
    created_by?: string | null
    observaciones?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    servicio: ServicioCreateNestedOneWithoutOrdenesInput
    lote?: LoteCreateNestedOneWithoutOrdenesInput
    factura?: FacturaCreateNestedOneWithoutOrdenInput
  }

  export type OrdenTrabajoUncheckedCreateWithoutClienteInput = {
    id?: string
    fecha?: Date | string
    servicio_id: string
    lote_id?: string | null
    cantidad: Decimal | DecimalJsLike | number | string
    total: Decimal | DecimalJsLike | number | string
    estado?: $Enums.OrderStatus
    created_by?: string | null
    observaciones?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    factura?: FacturaUncheckedCreateNestedOneWithoutOrdenInput
  }

  export type OrdenTrabajoCreateOrConnectWithoutClienteInput = {
    where: OrdenTrabajoWhereUniqueInput
    create: XOR<OrdenTrabajoCreateWithoutClienteInput, OrdenTrabajoUncheckedCreateWithoutClienteInput>
  }

  export type OrdenTrabajoCreateManyClienteInputEnvelope = {
    data: OrdenTrabajoCreateManyClienteInput | OrdenTrabajoCreateManyClienteInput[]
    skipDuplicates?: boolean
  }

  export type EstablecimientoUpsertWithWhereUniqueWithoutClienteInput = {
    where: EstablecimientoWhereUniqueInput
    update: XOR<EstablecimientoUpdateWithoutClienteInput, EstablecimientoUncheckedUpdateWithoutClienteInput>
    create: XOR<EstablecimientoCreateWithoutClienteInput, EstablecimientoUncheckedCreateWithoutClienteInput>
  }

  export type EstablecimientoUpdateWithWhereUniqueWithoutClienteInput = {
    where: EstablecimientoWhereUniqueInput
    data: XOR<EstablecimientoUpdateWithoutClienteInput, EstablecimientoUncheckedUpdateWithoutClienteInput>
  }

  export type EstablecimientoUpdateManyWithWhereWithoutClienteInput = {
    where: EstablecimientoScalarWhereInput
    data: XOR<EstablecimientoUpdateManyMutationInput, EstablecimientoUncheckedUpdateManyWithoutClienteInput>
  }

  export type EstablecimientoScalarWhereInput = {
    AND?: EstablecimientoScalarWhereInput | EstablecimientoScalarWhereInput[]
    OR?: EstablecimientoScalarWhereInput[]
    NOT?: EstablecimientoScalarWhereInput | EstablecimientoScalarWhereInput[]
    id?: UuidFilter<"Establecimiento"> | string
    nombre?: StringFilter<"Establecimiento"> | string
    cliente_id?: UuidFilter<"Establecimiento"> | string
    created_at?: DateTimeFilter<"Establecimiento"> | Date | string
    deleted_at?: DateTimeNullableFilter<"Establecimiento"> | Date | string | null
  }

  export type OrdenTrabajoUpsertWithWhereUniqueWithoutClienteInput = {
    where: OrdenTrabajoWhereUniqueInput
    update: XOR<OrdenTrabajoUpdateWithoutClienteInput, OrdenTrabajoUncheckedUpdateWithoutClienteInput>
    create: XOR<OrdenTrabajoCreateWithoutClienteInput, OrdenTrabajoUncheckedCreateWithoutClienteInput>
  }

  export type OrdenTrabajoUpdateWithWhereUniqueWithoutClienteInput = {
    where: OrdenTrabajoWhereUniqueInput
    data: XOR<OrdenTrabajoUpdateWithoutClienteInput, OrdenTrabajoUncheckedUpdateWithoutClienteInput>
  }

  export type OrdenTrabajoUpdateManyWithWhereWithoutClienteInput = {
    where: OrdenTrabajoScalarWhereInput
    data: XOR<OrdenTrabajoUpdateManyMutationInput, OrdenTrabajoUncheckedUpdateManyWithoutClienteInput>
  }

  export type OrdenTrabajoScalarWhereInput = {
    AND?: OrdenTrabajoScalarWhereInput | OrdenTrabajoScalarWhereInput[]
    OR?: OrdenTrabajoScalarWhereInput[]
    NOT?: OrdenTrabajoScalarWhereInput | OrdenTrabajoScalarWhereInput[]
    id?: UuidFilter<"OrdenTrabajo"> | string
    fecha?: DateTimeFilter<"OrdenTrabajo"> | Date | string
    cliente_id?: UuidFilter<"OrdenTrabajo"> | string
    servicio_id?: UuidFilter<"OrdenTrabajo"> | string
    lote_id?: UuidNullableFilter<"OrdenTrabajo"> | string | null
    cantidad?: DecimalFilter<"OrdenTrabajo"> | Decimal | DecimalJsLike | number | string
    total?: DecimalFilter<"OrdenTrabajo"> | Decimal | DecimalJsLike | number | string
    estado?: EnumOrderStatusFilter<"OrdenTrabajo"> | $Enums.OrderStatus
    created_by?: UuidNullableFilter<"OrdenTrabajo"> | string | null
    observaciones?: StringNullableFilter<"OrdenTrabajo"> | string | null
    created_at?: DateTimeFilter<"OrdenTrabajo"> | Date | string
    updated_at?: DateTimeFilter<"OrdenTrabajo"> | Date | string
  }

  export type ClienteCreateWithoutEstablecimientosInput = {
    id?: string
    razon_social: string
    cuit: string
    condicion_iva: string
    email?: string | null
    telefono?: string | null
    localidad_id?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    deleted_at?: Date | string | null
    ordenes?: OrdenTrabajoCreateNestedManyWithoutClienteInput
  }

  export type ClienteUncheckedCreateWithoutEstablecimientosInput = {
    id?: string
    razon_social: string
    cuit: string
    condicion_iva: string
    email?: string | null
    telefono?: string | null
    localidad_id?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    deleted_at?: Date | string | null
    ordenes?: OrdenTrabajoUncheckedCreateNestedManyWithoutClienteInput
  }

  export type ClienteCreateOrConnectWithoutEstablecimientosInput = {
    where: ClienteWhereUniqueInput
    create: XOR<ClienteCreateWithoutEstablecimientosInput, ClienteUncheckedCreateWithoutEstablecimientosInput>
  }

  export type LoteCreateWithoutEstablecimientoInput = {
    id?: string
    nombre: string
    hectareas?: Decimal | DecimalJsLike | number | string
    created_at?: Date | string
    deleted_at?: Date | string | null
    ordenes?: OrdenTrabajoCreateNestedManyWithoutLoteInput
  }

  export type LoteUncheckedCreateWithoutEstablecimientoInput = {
    id?: string
    nombre: string
    hectareas?: Decimal | DecimalJsLike | number | string
    created_at?: Date | string
    deleted_at?: Date | string | null
    ordenes?: OrdenTrabajoUncheckedCreateNestedManyWithoutLoteInput
  }

  export type LoteCreateOrConnectWithoutEstablecimientoInput = {
    where: LoteWhereUniqueInput
    create: XOR<LoteCreateWithoutEstablecimientoInput, LoteUncheckedCreateWithoutEstablecimientoInput>
  }

  export type LoteCreateManyEstablecimientoInputEnvelope = {
    data: LoteCreateManyEstablecimientoInput | LoteCreateManyEstablecimientoInput[]
    skipDuplicates?: boolean
  }

  export type ClienteUpsertWithoutEstablecimientosInput = {
    update: XOR<ClienteUpdateWithoutEstablecimientosInput, ClienteUncheckedUpdateWithoutEstablecimientosInput>
    create: XOR<ClienteCreateWithoutEstablecimientosInput, ClienteUncheckedCreateWithoutEstablecimientosInput>
    where?: ClienteWhereInput
  }

  export type ClienteUpdateToOneWithWhereWithoutEstablecimientosInput = {
    where?: ClienteWhereInput
    data: XOR<ClienteUpdateWithoutEstablecimientosInput, ClienteUncheckedUpdateWithoutEstablecimientosInput>
  }

  export type ClienteUpdateWithoutEstablecimientosInput = {
    id?: StringFieldUpdateOperationsInput | string
    razon_social?: StringFieldUpdateOperationsInput | string
    cuit?: StringFieldUpdateOperationsInput | string
    condicion_iva?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    telefono?: NullableStringFieldUpdateOperationsInput | string | null
    localidad_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ordenes?: OrdenTrabajoUpdateManyWithoutClienteNestedInput
  }

  export type ClienteUncheckedUpdateWithoutEstablecimientosInput = {
    id?: StringFieldUpdateOperationsInput | string
    razon_social?: StringFieldUpdateOperationsInput | string
    cuit?: StringFieldUpdateOperationsInput | string
    condicion_iva?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    telefono?: NullableStringFieldUpdateOperationsInput | string | null
    localidad_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ordenes?: OrdenTrabajoUncheckedUpdateManyWithoutClienteNestedInput
  }

  export type LoteUpsertWithWhereUniqueWithoutEstablecimientoInput = {
    where: LoteWhereUniqueInput
    update: XOR<LoteUpdateWithoutEstablecimientoInput, LoteUncheckedUpdateWithoutEstablecimientoInput>
    create: XOR<LoteCreateWithoutEstablecimientoInput, LoteUncheckedCreateWithoutEstablecimientoInput>
  }

  export type LoteUpdateWithWhereUniqueWithoutEstablecimientoInput = {
    where: LoteWhereUniqueInput
    data: XOR<LoteUpdateWithoutEstablecimientoInput, LoteUncheckedUpdateWithoutEstablecimientoInput>
  }

  export type LoteUpdateManyWithWhereWithoutEstablecimientoInput = {
    where: LoteScalarWhereInput
    data: XOR<LoteUpdateManyMutationInput, LoteUncheckedUpdateManyWithoutEstablecimientoInput>
  }

  export type LoteScalarWhereInput = {
    AND?: LoteScalarWhereInput | LoteScalarWhereInput[]
    OR?: LoteScalarWhereInput[]
    NOT?: LoteScalarWhereInput | LoteScalarWhereInput[]
    id?: UuidFilter<"Lote"> | string
    nombre?: StringFilter<"Lote"> | string
    hectareas?: DecimalFilter<"Lote"> | Decimal | DecimalJsLike | number | string
    establecimiento_id?: UuidFilter<"Lote"> | string
    created_at?: DateTimeFilter<"Lote"> | Date | string
    deleted_at?: DateTimeNullableFilter<"Lote"> | Date | string | null
  }

  export type EstablecimientoCreateWithoutLotesInput = {
    id?: string
    nombre: string
    created_at?: Date | string
    deleted_at?: Date | string | null
    cliente: ClienteCreateNestedOneWithoutEstablecimientosInput
  }

  export type EstablecimientoUncheckedCreateWithoutLotesInput = {
    id?: string
    nombre: string
    cliente_id: string
    created_at?: Date | string
    deleted_at?: Date | string | null
  }

  export type EstablecimientoCreateOrConnectWithoutLotesInput = {
    where: EstablecimientoWhereUniqueInput
    create: XOR<EstablecimientoCreateWithoutLotesInput, EstablecimientoUncheckedCreateWithoutLotesInput>
  }

  export type OrdenTrabajoCreateWithoutLoteInput = {
    id?: string
    fecha?: Date | string
    cantidad: Decimal | DecimalJsLike | number | string
    total: Decimal | DecimalJsLike | number | string
    estado?: $Enums.OrderStatus
    created_by?: string | null
    observaciones?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    cliente: ClienteCreateNestedOneWithoutOrdenesInput
    servicio: ServicioCreateNestedOneWithoutOrdenesInput
    factura?: FacturaCreateNestedOneWithoutOrdenInput
  }

  export type OrdenTrabajoUncheckedCreateWithoutLoteInput = {
    id?: string
    fecha?: Date | string
    cliente_id: string
    servicio_id: string
    cantidad: Decimal | DecimalJsLike | number | string
    total: Decimal | DecimalJsLike | number | string
    estado?: $Enums.OrderStatus
    created_by?: string | null
    observaciones?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    factura?: FacturaUncheckedCreateNestedOneWithoutOrdenInput
  }

  export type OrdenTrabajoCreateOrConnectWithoutLoteInput = {
    where: OrdenTrabajoWhereUniqueInput
    create: XOR<OrdenTrabajoCreateWithoutLoteInput, OrdenTrabajoUncheckedCreateWithoutLoteInput>
  }

  export type OrdenTrabajoCreateManyLoteInputEnvelope = {
    data: OrdenTrabajoCreateManyLoteInput | OrdenTrabajoCreateManyLoteInput[]
    skipDuplicates?: boolean
  }

  export type EstablecimientoUpsertWithoutLotesInput = {
    update: XOR<EstablecimientoUpdateWithoutLotesInput, EstablecimientoUncheckedUpdateWithoutLotesInput>
    create: XOR<EstablecimientoCreateWithoutLotesInput, EstablecimientoUncheckedCreateWithoutLotesInput>
    where?: EstablecimientoWhereInput
  }

  export type EstablecimientoUpdateToOneWithWhereWithoutLotesInput = {
    where?: EstablecimientoWhereInput
    data: XOR<EstablecimientoUpdateWithoutLotesInput, EstablecimientoUncheckedUpdateWithoutLotesInput>
  }

  export type EstablecimientoUpdateWithoutLotesInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cliente?: ClienteUpdateOneRequiredWithoutEstablecimientosNestedInput
  }

  export type EstablecimientoUncheckedUpdateWithoutLotesInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    cliente_id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type OrdenTrabajoUpsertWithWhereUniqueWithoutLoteInput = {
    where: OrdenTrabajoWhereUniqueInput
    update: XOR<OrdenTrabajoUpdateWithoutLoteInput, OrdenTrabajoUncheckedUpdateWithoutLoteInput>
    create: XOR<OrdenTrabajoCreateWithoutLoteInput, OrdenTrabajoUncheckedCreateWithoutLoteInput>
  }

  export type OrdenTrabajoUpdateWithWhereUniqueWithoutLoteInput = {
    where: OrdenTrabajoWhereUniqueInput
    data: XOR<OrdenTrabajoUpdateWithoutLoteInput, OrdenTrabajoUncheckedUpdateWithoutLoteInput>
  }

  export type OrdenTrabajoUpdateManyWithWhereWithoutLoteInput = {
    where: OrdenTrabajoScalarWhereInput
    data: XOR<OrdenTrabajoUpdateManyMutationInput, OrdenTrabajoUncheckedUpdateManyWithoutLoteInput>
  }

  export type OrdenTrabajoCreateWithoutServicioInput = {
    id?: string
    fecha?: Date | string
    cantidad: Decimal | DecimalJsLike | number | string
    total: Decimal | DecimalJsLike | number | string
    estado?: $Enums.OrderStatus
    created_by?: string | null
    observaciones?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    cliente: ClienteCreateNestedOneWithoutOrdenesInput
    lote?: LoteCreateNestedOneWithoutOrdenesInput
    factura?: FacturaCreateNestedOneWithoutOrdenInput
  }

  export type OrdenTrabajoUncheckedCreateWithoutServicioInput = {
    id?: string
    fecha?: Date | string
    cliente_id: string
    lote_id?: string | null
    cantidad: Decimal | DecimalJsLike | number | string
    total: Decimal | DecimalJsLike | number | string
    estado?: $Enums.OrderStatus
    created_by?: string | null
    observaciones?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    factura?: FacturaUncheckedCreateNestedOneWithoutOrdenInput
  }

  export type OrdenTrabajoCreateOrConnectWithoutServicioInput = {
    where: OrdenTrabajoWhereUniqueInput
    create: XOR<OrdenTrabajoCreateWithoutServicioInput, OrdenTrabajoUncheckedCreateWithoutServicioInput>
  }

  export type OrdenTrabajoCreateManyServicioInputEnvelope = {
    data: OrdenTrabajoCreateManyServicioInput | OrdenTrabajoCreateManyServicioInput[]
    skipDuplicates?: boolean
  }

  export type OrdenTrabajoUpsertWithWhereUniqueWithoutServicioInput = {
    where: OrdenTrabajoWhereUniqueInput
    update: XOR<OrdenTrabajoUpdateWithoutServicioInput, OrdenTrabajoUncheckedUpdateWithoutServicioInput>
    create: XOR<OrdenTrabajoCreateWithoutServicioInput, OrdenTrabajoUncheckedCreateWithoutServicioInput>
  }

  export type OrdenTrabajoUpdateWithWhereUniqueWithoutServicioInput = {
    where: OrdenTrabajoWhereUniqueInput
    data: XOR<OrdenTrabajoUpdateWithoutServicioInput, OrdenTrabajoUncheckedUpdateWithoutServicioInput>
  }

  export type OrdenTrabajoUpdateManyWithWhereWithoutServicioInput = {
    where: OrdenTrabajoScalarWhereInput
    data: XOR<OrdenTrabajoUpdateManyMutationInput, OrdenTrabajoUncheckedUpdateManyWithoutServicioInput>
  }

  export type ClienteCreateWithoutOrdenesInput = {
    id?: string
    razon_social: string
    cuit: string
    condicion_iva: string
    email?: string | null
    telefono?: string | null
    localidad_id?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    deleted_at?: Date | string | null
    establecimientos?: EstablecimientoCreateNestedManyWithoutClienteInput
  }

  export type ClienteUncheckedCreateWithoutOrdenesInput = {
    id?: string
    razon_social: string
    cuit: string
    condicion_iva: string
    email?: string | null
    telefono?: string | null
    localidad_id?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    deleted_at?: Date | string | null
    establecimientos?: EstablecimientoUncheckedCreateNestedManyWithoutClienteInput
  }

  export type ClienteCreateOrConnectWithoutOrdenesInput = {
    where: ClienteWhereUniqueInput
    create: XOR<ClienteCreateWithoutOrdenesInput, ClienteUncheckedCreateWithoutOrdenesInput>
  }

  export type ServicioCreateWithoutOrdenesInput = {
    id?: string
    nombre: string
    unidad_medida: string
    precio_base?: Decimal | DecimalJsLike | number | string
    created_at?: Date | string
    active?: boolean | null
  }

  export type ServicioUncheckedCreateWithoutOrdenesInput = {
    id?: string
    nombre: string
    unidad_medida: string
    precio_base?: Decimal | DecimalJsLike | number | string
    created_at?: Date | string
    active?: boolean | null
  }

  export type ServicioCreateOrConnectWithoutOrdenesInput = {
    where: ServicioWhereUniqueInput
    create: XOR<ServicioCreateWithoutOrdenesInput, ServicioUncheckedCreateWithoutOrdenesInput>
  }

  export type LoteCreateWithoutOrdenesInput = {
    id?: string
    nombre: string
    hectareas?: Decimal | DecimalJsLike | number | string
    created_at?: Date | string
    deleted_at?: Date | string | null
    establecimiento: EstablecimientoCreateNestedOneWithoutLotesInput
  }

  export type LoteUncheckedCreateWithoutOrdenesInput = {
    id?: string
    nombre: string
    hectareas?: Decimal | DecimalJsLike | number | string
    establecimiento_id: string
    created_at?: Date | string
    deleted_at?: Date | string | null
  }

  export type LoteCreateOrConnectWithoutOrdenesInput = {
    where: LoteWhereUniqueInput
    create: XOR<LoteCreateWithoutOrdenesInput, LoteUncheckedCreateWithoutOrdenesInput>
  }

  export type FacturaCreateWithoutOrdenInput = {
    id?: string
    tipo_comprobante: string
    punto_venta: number
    numero: bigint | number
    cae?: string | null
    fecha_vencimiento?: Date | string | null
    total: Decimal | DecimalJsLike | number | string
    fecha_emision?: Date | string | null
    estado_afip?: string | null
    observaciones_afip?: string | null
    pdf_url?: string | null
    created_at?: Date | string
  }

  export type FacturaUncheckedCreateWithoutOrdenInput = {
    id?: string
    tipo_comprobante: string
    punto_venta: number
    numero: bigint | number
    cae?: string | null
    fecha_vencimiento?: Date | string | null
    total: Decimal | DecimalJsLike | number | string
    fecha_emision?: Date | string | null
    estado_afip?: string | null
    observaciones_afip?: string | null
    pdf_url?: string | null
    created_at?: Date | string
  }

  export type FacturaCreateOrConnectWithoutOrdenInput = {
    where: FacturaWhereUniqueInput
    create: XOR<FacturaCreateWithoutOrdenInput, FacturaUncheckedCreateWithoutOrdenInput>
  }

  export type ClienteUpsertWithoutOrdenesInput = {
    update: XOR<ClienteUpdateWithoutOrdenesInput, ClienteUncheckedUpdateWithoutOrdenesInput>
    create: XOR<ClienteCreateWithoutOrdenesInput, ClienteUncheckedCreateWithoutOrdenesInput>
    where?: ClienteWhereInput
  }

  export type ClienteUpdateToOneWithWhereWithoutOrdenesInput = {
    where?: ClienteWhereInput
    data: XOR<ClienteUpdateWithoutOrdenesInput, ClienteUncheckedUpdateWithoutOrdenesInput>
  }

  export type ClienteUpdateWithoutOrdenesInput = {
    id?: StringFieldUpdateOperationsInput | string
    razon_social?: StringFieldUpdateOperationsInput | string
    cuit?: StringFieldUpdateOperationsInput | string
    condicion_iva?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    telefono?: NullableStringFieldUpdateOperationsInput | string | null
    localidad_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    establecimientos?: EstablecimientoUpdateManyWithoutClienteNestedInput
  }

  export type ClienteUncheckedUpdateWithoutOrdenesInput = {
    id?: StringFieldUpdateOperationsInput | string
    razon_social?: StringFieldUpdateOperationsInput | string
    cuit?: StringFieldUpdateOperationsInput | string
    condicion_iva?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    telefono?: NullableStringFieldUpdateOperationsInput | string | null
    localidad_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    establecimientos?: EstablecimientoUncheckedUpdateManyWithoutClienteNestedInput
  }

  export type ServicioUpsertWithoutOrdenesInput = {
    update: XOR<ServicioUpdateWithoutOrdenesInput, ServicioUncheckedUpdateWithoutOrdenesInput>
    create: XOR<ServicioCreateWithoutOrdenesInput, ServicioUncheckedCreateWithoutOrdenesInput>
    where?: ServicioWhereInput
  }

  export type ServicioUpdateToOneWithWhereWithoutOrdenesInput = {
    where?: ServicioWhereInput
    data: XOR<ServicioUpdateWithoutOrdenesInput, ServicioUncheckedUpdateWithoutOrdenesInput>
  }

  export type ServicioUpdateWithoutOrdenesInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    unidad_medida?: StringFieldUpdateOperationsInput | string
    precio_base?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    active?: NullableBoolFieldUpdateOperationsInput | boolean | null
  }

  export type ServicioUncheckedUpdateWithoutOrdenesInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    unidad_medida?: StringFieldUpdateOperationsInput | string
    precio_base?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    active?: NullableBoolFieldUpdateOperationsInput | boolean | null
  }

  export type LoteUpsertWithoutOrdenesInput = {
    update: XOR<LoteUpdateWithoutOrdenesInput, LoteUncheckedUpdateWithoutOrdenesInput>
    create: XOR<LoteCreateWithoutOrdenesInput, LoteUncheckedCreateWithoutOrdenesInput>
    where?: LoteWhereInput
  }

  export type LoteUpdateToOneWithWhereWithoutOrdenesInput = {
    where?: LoteWhereInput
    data: XOR<LoteUpdateWithoutOrdenesInput, LoteUncheckedUpdateWithoutOrdenesInput>
  }

  export type LoteUpdateWithoutOrdenesInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    hectareas?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    establecimiento?: EstablecimientoUpdateOneRequiredWithoutLotesNestedInput
  }

  export type LoteUncheckedUpdateWithoutOrdenesInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    hectareas?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    establecimiento_id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type FacturaUpsertWithoutOrdenInput = {
    update: XOR<FacturaUpdateWithoutOrdenInput, FacturaUncheckedUpdateWithoutOrdenInput>
    create: XOR<FacturaCreateWithoutOrdenInput, FacturaUncheckedCreateWithoutOrdenInput>
    where?: FacturaWhereInput
  }

  export type FacturaUpdateToOneWithWhereWithoutOrdenInput = {
    where?: FacturaWhereInput
    data: XOR<FacturaUpdateWithoutOrdenInput, FacturaUncheckedUpdateWithoutOrdenInput>
  }

  export type FacturaUpdateWithoutOrdenInput = {
    id?: StringFieldUpdateOperationsInput | string
    tipo_comprobante?: StringFieldUpdateOperationsInput | string
    punto_venta?: IntFieldUpdateOperationsInput | number
    numero?: BigIntFieldUpdateOperationsInput | bigint | number
    cae?: NullableStringFieldUpdateOperationsInput | string | null
    fecha_vencimiento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    fecha_emision?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    estado_afip?: NullableStringFieldUpdateOperationsInput | string | null
    observaciones_afip?: NullableStringFieldUpdateOperationsInput | string | null
    pdf_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FacturaUncheckedUpdateWithoutOrdenInput = {
    id?: StringFieldUpdateOperationsInput | string
    tipo_comprobante?: StringFieldUpdateOperationsInput | string
    punto_venta?: IntFieldUpdateOperationsInput | number
    numero?: BigIntFieldUpdateOperationsInput | bigint | number
    cae?: NullableStringFieldUpdateOperationsInput | string | null
    fecha_vencimiento?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    fecha_emision?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    estado_afip?: NullableStringFieldUpdateOperationsInput | string | null
    observaciones_afip?: NullableStringFieldUpdateOperationsInput | string | null
    pdf_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrdenTrabajoCreateWithoutFacturaInput = {
    id?: string
    fecha?: Date | string
    cantidad: Decimal | DecimalJsLike | number | string
    total: Decimal | DecimalJsLike | number | string
    estado?: $Enums.OrderStatus
    created_by?: string | null
    observaciones?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    cliente: ClienteCreateNestedOneWithoutOrdenesInput
    servicio: ServicioCreateNestedOneWithoutOrdenesInput
    lote?: LoteCreateNestedOneWithoutOrdenesInput
  }

  export type OrdenTrabajoUncheckedCreateWithoutFacturaInput = {
    id?: string
    fecha?: Date | string
    cliente_id: string
    servicio_id: string
    lote_id?: string | null
    cantidad: Decimal | DecimalJsLike | number | string
    total: Decimal | DecimalJsLike | number | string
    estado?: $Enums.OrderStatus
    created_by?: string | null
    observaciones?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type OrdenTrabajoCreateOrConnectWithoutFacturaInput = {
    where: OrdenTrabajoWhereUniqueInput
    create: XOR<OrdenTrabajoCreateWithoutFacturaInput, OrdenTrabajoUncheckedCreateWithoutFacturaInput>
  }

  export type OrdenTrabajoUpsertWithoutFacturaInput = {
    update: XOR<OrdenTrabajoUpdateWithoutFacturaInput, OrdenTrabajoUncheckedUpdateWithoutFacturaInput>
    create: XOR<OrdenTrabajoCreateWithoutFacturaInput, OrdenTrabajoUncheckedCreateWithoutFacturaInput>
    where?: OrdenTrabajoWhereInput
  }

  export type OrdenTrabajoUpdateToOneWithWhereWithoutFacturaInput = {
    where?: OrdenTrabajoWhereInput
    data: XOR<OrdenTrabajoUpdateWithoutFacturaInput, OrdenTrabajoUncheckedUpdateWithoutFacturaInput>
  }

  export type OrdenTrabajoUpdateWithoutFacturaInput = {
    id?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    cantidad?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    estado?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus
    created_by?: NullableStringFieldUpdateOperationsInput | string | null
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    cliente?: ClienteUpdateOneRequiredWithoutOrdenesNestedInput
    servicio?: ServicioUpdateOneRequiredWithoutOrdenesNestedInput
    lote?: LoteUpdateOneWithoutOrdenesNestedInput
  }

  export type OrdenTrabajoUncheckedUpdateWithoutFacturaInput = {
    id?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    cliente_id?: StringFieldUpdateOperationsInput | string
    servicio_id?: StringFieldUpdateOperationsInput | string
    lote_id?: NullableStringFieldUpdateOperationsInput | string | null
    cantidad?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    estado?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus
    created_by?: NullableStringFieldUpdateOperationsInput | string | null
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EstablecimientoCreateManyClienteInput = {
    id?: string
    nombre: string
    created_at?: Date | string
    deleted_at?: Date | string | null
  }

  export type OrdenTrabajoCreateManyClienteInput = {
    id?: string
    fecha?: Date | string
    servicio_id: string
    lote_id?: string | null
    cantidad: Decimal | DecimalJsLike | number | string
    total: Decimal | DecimalJsLike | number | string
    estado?: $Enums.OrderStatus
    created_by?: string | null
    observaciones?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type EstablecimientoUpdateWithoutClienteInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lotes?: LoteUpdateManyWithoutEstablecimientoNestedInput
  }

  export type EstablecimientoUncheckedUpdateWithoutClienteInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lotes?: LoteUncheckedUpdateManyWithoutEstablecimientoNestedInput
  }

  export type EstablecimientoUncheckedUpdateManyWithoutClienteInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type OrdenTrabajoUpdateWithoutClienteInput = {
    id?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    cantidad?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    estado?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus
    created_by?: NullableStringFieldUpdateOperationsInput | string | null
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    servicio?: ServicioUpdateOneRequiredWithoutOrdenesNestedInput
    lote?: LoteUpdateOneWithoutOrdenesNestedInput
    factura?: FacturaUpdateOneWithoutOrdenNestedInput
  }

  export type OrdenTrabajoUncheckedUpdateWithoutClienteInput = {
    id?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    servicio_id?: StringFieldUpdateOperationsInput | string
    lote_id?: NullableStringFieldUpdateOperationsInput | string | null
    cantidad?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    estado?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus
    created_by?: NullableStringFieldUpdateOperationsInput | string | null
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    factura?: FacturaUncheckedUpdateOneWithoutOrdenNestedInput
  }

  export type OrdenTrabajoUncheckedUpdateManyWithoutClienteInput = {
    id?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    servicio_id?: StringFieldUpdateOperationsInput | string
    lote_id?: NullableStringFieldUpdateOperationsInput | string | null
    cantidad?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    estado?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus
    created_by?: NullableStringFieldUpdateOperationsInput | string | null
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoteCreateManyEstablecimientoInput = {
    id?: string
    nombre: string
    hectareas?: Decimal | DecimalJsLike | number | string
    created_at?: Date | string
    deleted_at?: Date | string | null
  }

  export type LoteUpdateWithoutEstablecimientoInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    hectareas?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ordenes?: OrdenTrabajoUpdateManyWithoutLoteNestedInput
  }

  export type LoteUncheckedUpdateWithoutEstablecimientoInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    hectareas?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ordenes?: OrdenTrabajoUncheckedUpdateManyWithoutLoteNestedInput
  }

  export type LoteUncheckedUpdateManyWithoutEstablecimientoInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    hectareas?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type OrdenTrabajoCreateManyLoteInput = {
    id?: string
    fecha?: Date | string
    cliente_id: string
    servicio_id: string
    cantidad: Decimal | DecimalJsLike | number | string
    total: Decimal | DecimalJsLike | number | string
    estado?: $Enums.OrderStatus
    created_by?: string | null
    observaciones?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type OrdenTrabajoUpdateWithoutLoteInput = {
    id?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    cantidad?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    estado?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus
    created_by?: NullableStringFieldUpdateOperationsInput | string | null
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    cliente?: ClienteUpdateOneRequiredWithoutOrdenesNestedInput
    servicio?: ServicioUpdateOneRequiredWithoutOrdenesNestedInput
    factura?: FacturaUpdateOneWithoutOrdenNestedInput
  }

  export type OrdenTrabajoUncheckedUpdateWithoutLoteInput = {
    id?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    cliente_id?: StringFieldUpdateOperationsInput | string
    servicio_id?: StringFieldUpdateOperationsInput | string
    cantidad?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    estado?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus
    created_by?: NullableStringFieldUpdateOperationsInput | string | null
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    factura?: FacturaUncheckedUpdateOneWithoutOrdenNestedInput
  }

  export type OrdenTrabajoUncheckedUpdateManyWithoutLoteInput = {
    id?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    cliente_id?: StringFieldUpdateOperationsInput | string
    servicio_id?: StringFieldUpdateOperationsInput | string
    cantidad?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    estado?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus
    created_by?: NullableStringFieldUpdateOperationsInput | string | null
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrdenTrabajoCreateManyServicioInput = {
    id?: string
    fecha?: Date | string
    cliente_id: string
    lote_id?: string | null
    cantidad: Decimal | DecimalJsLike | number | string
    total: Decimal | DecimalJsLike | number | string
    estado?: $Enums.OrderStatus
    created_by?: string | null
    observaciones?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type OrdenTrabajoUpdateWithoutServicioInput = {
    id?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    cantidad?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    estado?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus
    created_by?: NullableStringFieldUpdateOperationsInput | string | null
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    cliente?: ClienteUpdateOneRequiredWithoutOrdenesNestedInput
    lote?: LoteUpdateOneWithoutOrdenesNestedInput
    factura?: FacturaUpdateOneWithoutOrdenNestedInput
  }

  export type OrdenTrabajoUncheckedUpdateWithoutServicioInput = {
    id?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    cliente_id?: StringFieldUpdateOperationsInput | string
    lote_id?: NullableStringFieldUpdateOperationsInput | string | null
    cantidad?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    estado?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus
    created_by?: NullableStringFieldUpdateOperationsInput | string | null
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    factura?: FacturaUncheckedUpdateOneWithoutOrdenNestedInput
  }

  export type OrdenTrabajoUncheckedUpdateManyWithoutServicioInput = {
    id?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    cliente_id?: StringFieldUpdateOperationsInput | string
    lote_id?: NullableStringFieldUpdateOperationsInput | string | null
    cantidad?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    total?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    estado?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus
    created_by?: NullableStringFieldUpdateOperationsInput | string | null
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}