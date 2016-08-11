var app=angular.module("musicApp",["ngRoute","ngSanitize"]);app.config(function(e){e.when("/items",{templateUrl:"templates/view-list.html",controller:"listController"}).when("/items/:user",{templateUrl:"templates/view-user.html",controller:"userController"}).when("/items/:user/fav",{templateUrl:"templates/view-fav.html",controller:"userController"}).when("/detail/:index",{templateUrl:"templates/view-detail.html",controller:"detailController"}).when("/detail/:user/:index",{templateUrl:"templates/view-detail-user.html",controller:"detailController"}).otherwise({redirectTo:"/items"})}),app.factory("listService",function(e,s){return{get:function(){var t=e.defer(),r=s.get("https://desafio-61085.herokuapp.com/api/musics");return r.then(function(e){t.resolve(e)},function(e){console.error(e)}),t.promise}}}),app.factory("userService",function(e,s,t){return{get:function(){var t=e.defer(),r=s.get("https://desafio-61085.herokuapp.com/api/users");return r.then(function(e){t.resolve(e)},function(e){console.error(e)}),t.promise}}}),app.factory("favsService",function(e,s,t){return{get:function(){var r=e.defer(),u=s.get("https://desafio-61085.herokuapp.com/api/users/"+t.user+"/musics");return u.then(function(e){r.resolve(e)},function(e){console.error(e)}),r.promise}}}),app.controller("listController",["$scope","$http","$location","$routeParams","listService","userService",function(e,s,t,r,u,n){e.showLoader=!0,u.get().then(function(s){e.lista=s.data,e.showLoader=!1,e.user=r.user},function(e){console.error(e)}),e.fetchUsers=function(r){var r=r;n.get(r).then(function(t){return e.users=[],angular.forEach(t.data,function(s){s.email==r&&e.users.push(s.id,s.username,s.email)}),null==e.users[0]&&s.post("https://desafio-61085.herokuapp.com/api/users",{id:"",username:"Test",email:r}),e.users}).then(function(){t.path("/items/"+r)})},e.seeItem=function(e){t.path("/detail/"+e)}}]),app.controller("userController",["$scope","$http","$location","$routeParams","listService","userService","favsService",function(e,s,t,r,u,n,a){n.get().then(function(s){return email=r.user,e.email=r.user,e.users=[],angular.forEach(s.data,function(s){s.email==email&&e.users.push(s.id,s.username,s.email)}),e.users}),e.showLoader=!0,u.get().then(function(s){e.lista=s.data,e.showLoader=!1,e.user=r.user},function(e){console.error(e)}).then(function(){return s.get("https://desafio-61085.herokuapp.com/api/users/"+e.users[0]+"/musics").success(function(s){return e.favs=s,e.favs})}),e.favItem=function(t,u){s.delete("https://desafio-61085.herokuapp.com/api/users/"+e.users[0]+"/musics/"+t,{});var u=r.user;n.get(u).then(function(t){return e.users=[],angular.forEach(t.data,function(s){s.email===u&&e.users.push(s.id,s.username,s.email)}),null===e.users[0]&&s.post("https://desafio-61085.herokuapp.com/api/users",{id:"",username:"Test",email:u}),e.users}).then(function(){return s.get("https://desafio-61085.herokuapp.com/api/users/"+e.users[0]+"/musics").success(function(s){return e.favs=s,e.favs})})},e.favAdd=function(t,u){s.post("https://desafio-61085.herokuapp.com/api/users/"+e.users[0]+"/musics",{musicid:t});var u=r.user;n.get(u).then(function(t){return e.users=[],angular.forEach(t.data,function(s){s.email===u&&e.users.push(s.id,s.username,s.email)}),null==e.users[0]&&s.post("https://desafio-61085.herokuapp.com/api/users",{id:"",username:"Test",email:u}),e.users}).then(function(){return s.get("https://desafio-61085.herokuapp.com/api/users/"+e.users[0]+"/musics").success(function(s){return e.favs=s,e.favs})})},e.seeItem=function(s){t.path("/detail/"+e.user+"/"+s)}}]),app.controller("detailController",["$scope","$http","$location","$window","$routeParams","listService","userService",function(e,s,t,r,u,n,a){e.goBack=function(){r.history.length<1?t.path("/items/"):window.history.back()},e.showLoader=!0,n.get().then(function(s){e.item=s.data[parseInt(u.index)],e.showLoader=!1},function(e){console.error(e)}),n.get().then(function(s){e.lista=s.data,e.user=u.user},function(e){console.error(e)}).then(function(){return s.get("https://desafio-61085.herokuapp.com/api/users/"+e.users[0]+"/musics").success(function(s){return e.favs=s,e.favs})}),a.get().then(function(s){return email=u.user,e.email=u.user,e.users=[],angular.forEach(s.data,function(s){s.email==email&&e.users.push(s.id,s.username,s.email)}),e.users}),e.fetchUsers=function(r){var r=r;a.get(r).then(function(t){return e.users=[],angular.forEach(t.data,function(s){s.email==r&&e.users.push(s.id,s.username,s.email)}),null==e.users[0]&&s.post("https://desafio-61085.herokuapp.com/api/users",{id:"",username:"Test",email:r}),e.users}).then(function(){t.path("/detail/"+r+"/"+u.index)})},e.favItem=function(t,r){s.delete("https://desafio-61085.herokuapp.com/api/users/"+e.users[0]+"/musics/"+t,{});var r=u.user;a.get(r).then(function(t){return e.users=[],angular.forEach(t.data,function(s){s.email===r&&e.users.push(s.id,s.username,s.email)}),null===e.users[0]&&s.post("https://desafio-61085.herokuapp.com/api/users",{id:"",username:"Test",email:r}),e.users}).then(function(){return s.get("https://desafio-61085.herokuapp.com/api/users/"+e.users[0]+"/musics").success(function(s){return e.favs=s,e.favs})})},e.favAdd=function(t,r){s.post("https://desafio-61085.herokuapp.com/api/users/"+e.users[0]+"/musics",{musicid:t});var r=u.user;a.get(r).then(function(t){return e.users=[],angular.forEach(t.data,function(s){s.email===r&&e.users.push(s.id,s.username,s.email)}),null==e.users[0]&&s.post("https://desafio-61085.herokuapp.com/api/users",{id:"",username:"Test",email:r}),e.users}).then(function(){return s.get("https://desafio-61085.herokuapp.com/api/users/"+e.users[0]+"/musics").success(function(s){return e.favs=s,e.favs})})}}]);