var list = require( '../static/json/address.json')
var obj = []
// list.forEach(function (item) {  //先找一级的
//   if(item.level == 1) obj[item.sheng] = item
// })
// console.log(obj)

list.forEach(function (item) {  //先找一级的
  var city = {}
  if(item.level == 2) {
    city.code = item.di
    city.name = item.name
    city.precode = item.sheng
    obj.push(city)
  }
})
console.log(obj.length)
var shu = []
for(var i=300;i<341;i++){
  shu.push(obj[i])
}
console.log(shu)
