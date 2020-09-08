const MyPromise = require('./MyPromise')

// const p1 = new MyPromise((resolve, reject) => {
//   setTimeout(() => {
//     resolve(123)
//   }, 1000)
// })



var a = new MyPromise((resolve, reject) => {
  resolve(100)
})

const a1 = a.then(value => {
  console.log(value);

  return a1;
})
