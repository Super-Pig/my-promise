# 什么是 Promise?

```
Promise是JS异步编程中的重要概念，异步抽象处理对象，是目前比较流行Javascript异步编程解决方案之一
```

# 对于几种常见异步编程方案

- 回调函数
- 事件监听
- 观察者模式
- 发布/订阅 
- Promise对象

# Promise 规范

> [Promises/A+](https://promisesaplus.com/)

## 术语

1. `promise` 是一个拥有 then 方法的对象或函数，其行为符合本规范；

2. `thenanble` 是一个定义了 then 方法的对象或者函数

3. `value` 指任何 JavaScript 的合法值（包括 undefined , thenable 和 promise）；

4. `exception` 是通过 `throw` 语句抛出的值

5. `reason` 表示一个 promise 对象的拒绝原因

## 要求

1. Promise 的状态

- 一个 Promise 的当前状态必须为以下三种状态中的一种：`Pending`、`Fulfilled`、`Rejected`

2. then 方法

- 一个 promise 对象必须提供一个 then 方法，用来访问当前值、最终值或者失败原因

- then 方法接收两个回调函数（成功回调、失败回调）

```
promise.then(onFulfilled, onRejected)
```

- onFulfilled 和 onRejected 都是可选参数

- onFulfilled 回调函数必须在 promise 状态变为 `fulfilled` 之后被调用，不能重复调用

- onRejected 回调函数必须在 promise 状态变为 `rejected` 之后被调用，不能重复调用

- onFulfilled 和 onRejected 只有在执行环境堆栈仅包含平台代码时才可被调用注（此处注解请查看原文，异步任务队列、宏任务&微任务了解一下）

- onFulfilled 和 onRejected 必须被作为函数调用（即没有 this 值，刚好可以采用箭头函数）

- 对于同一个 promise 对象，then 函数可以被多次调用

```
当 promise 状态变为 `fulfilled` 时，所有 onFulfilled 需按照其注册顺序依次回调

当 promise 状态变为 `rejected` 时，所有的 onRejected 需按照其注册顺序依次回调
```

- then 方法必须返回一个 Promise 对象

```
promise2 = promise1.then(onFulfilled, onRejected);
```
    - If either onFulfilled or onRejected returns a value x, run the Promise Resolution Procedure [[Resolve]](promise2, x).
    - If either onFulfilled or onRejected throws an exception e, promise2 must be rejected with e as the reason.
    - If onFulfilled is not a function and promise1 is fulfilled, promise2 must be fulfilled with the same value as promise1.
    - If onRejected is not a function and promise1 is rejected, promise2 must be rejected with the same reason as promise1.

# 思考

1. Promise.race() 方法实现

2. async/await 的原理是什么？