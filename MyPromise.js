const STATUS = {
  PENDING: Symbol(),
  FULFILLED: Symbol(),
  REJECTED: Symbol(),
}

class MyPromise {
  value = undefined;
  reason = undefined;
  status = STATUS.PENDING;

  onFulfilled = [];
  onRejected = [];

  resolve = value => {
    if (this.status !== STATUS.PENDING) {
      return;
    }

    this.status = STATUS.FULFILLED;

    this.value = value;

    while (this.onFulfilled.length) {
      this.onFulfilled.shift()()
    }
  }

  reject = reason => {
    if (this.status !== STATUS.PENDING) {
      return;
    }

    this.status = STATUS.REJECTED;

    this.reason = reason;

    while (this.onRejected.length) {
      this.onRejected.shift()()
    }
  }

  constructor(callback) {
    callback(this.resolve, this.reject);
  }

  then = (onFulfilled = () => { }, onRejected = () => { }) => {
    const promise2 = new MyPromise((resolve, reject) => {
      if (this.status === STATUS.FULFILLED) {
        setTimeout(() => {
          try {
            const x = onFulfilled(this.value);

            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
      } else if (this.status === STATUS.REJECTED) {
        setTimeout(() => {
          try {
            const x = onRejected(this.reason)

            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e);
          }
        }, 0)
      } else if (this.status === STATUS.PENDING) {
        this.onFulfilled.push(() => {
          setTimeout(() => {
            try {
              const x = onFulfilled(this.value);

              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }, 0)
        });
        this.onRejected.push(() => {
          setTimeout(() => {
            try {
              const x = onRejected(this.reason)

              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e);
            }
          }, 0)
        });
      }
    })

    return promise2;
  }

  catch = onRejected => {
    this.then(undefined, onRejected)
  }

  static resolve(value) {
    if (value instanceof MyPromise) {
      return value
    } else {
      return new MyPromise(resolve => resolve(value))
    }
  }

  static all(array) {
    let result = [];
    let index = 0;

    return new MyPromise((resolve, reject) => {
      function addData(key, value) {
        result[key] = value;
        index++;

        if (index == array.length) {
          resolve(result)
        }
      }

      for (let i = 0; i < array.length; i++) {
        const current = array[i];

        if (current instanceof MyPromise) {
          current.then(value => {
            addData(i, value);
          }, err => {
            reject(err)
          })
        } else {
          addData(i, array[i])
        }
      }
    })
  }

  finally = (callback) => {
    return this.then(value => {
      return MyPromise.resolve(callback()).then(() => value)
    }, reason => {
      return MyPromise.resolve(callback()).then(() => {
        throw reason
      })
    })
  }
}

/**
 * The Promise Resolution Procedure
 */
const resolvePromise = (promise2, x, resolve, reject) => {
  // If promise and x refer to the same object, reject promise with a TypeError as the reason.
  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected form promise #<Promise>'))
  }

  if (x instanceof MyPromise) {
    /**
    * If x is a promise, adopt its state
    * If x is pending, promise must remain pending until x is fulfilled or rejected.
    * If/when x is fulfilled, fulfill promise with the same value
    * If/when x is rejected, reject promise with the same reason
    */
    x.then(resolve, reject);
  } else {
    /**
     * If x is a value, fulfill promise with x
     */
    resolve(x);
  }
}

module.exports = MyPromise;