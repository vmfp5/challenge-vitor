var app = angular.module("musicApp", ["ngRoute",'ngSanitize']);

app.config(function($routeProvider) {

  $routeProvider
    .when("/items", {
      templateUrl: "templates/view-list.html",
      controller: "listController"
    })
    .when("/items/:user", {
      templateUrl: "templates/view-user.html",
      controller: "userController"
    })
    .when("/items/:user/fav", {
      templateUrl: "templates/view-fav.html",
      controller: "userController"
    })
    .when("/detail/:index", {
      templateUrl: "templates/view-detail.html",
      controller: "detailController"
    })
    .when("/detail/:user/:index", {
      templateUrl: "templates/view-detail-user.html",
      controller: "detailController"
    })
    .otherwise({
      redirectTo: "/items"
    })

});


app.factory('listService', function($q, $http) { // GET ITEMS
  return {
    get: function() {
      var deferred = $q.defer(),
        httpPromise = $http.get('https://desafio-61085.herokuapp.com/api/musics');
      httpPromise.then(function(response) {
        deferred.resolve(response);
      }, function(error) {
        console.error(error);
      });

      return deferred.promise;
    }
  };
});

app.factory('userService', function($q, $http, $routeParams) { // GET USERS
  return {
    get: function() {


      var deferred = $q.defer(),
        httpPromise = $http.get("https://desafio-61085.herokuapp.com/api/users");
      httpPromise.then(function(response) {
        deferred.resolve(response);
      }, function(error) {
        console.error(error);
      });

      return deferred.promise;

    }
  };
});

app.factory('favsService', function($q, $http, $routeParams) { // GET FAVORITES
  return {
    get: function() {


      var deferred = $q.defer(),
        httpPromise = $http.get("https://desafio-61085.herokuapp.com/api/users/" + $routeParams.user + "/musics");
      httpPromise.then(function(response) {
        deferred.resolve(response);
      }, function(error) {
        console.error(error);
      });

      return deferred.promise;

    }
  };
});


// Controlador da lista
app.controller("listController", ["$scope", "$http", "$location", "$routeParams", "listService", "userService", function($scope, $http, $location, $routeParams, listService, userService) {

  $scope.showLoader = true;
  listService.get().then(function(response) {
    $scope.lista = response.data;
    $scope.showLoader = false;
    $scope.user = $routeParams.user;
  }, function(error) {
    console.error(error);
  });

  $scope.fetchUsers = function(email) { //Vai buscar o email


    var email = email;
    userService.get(email).then(function(res) {
      $scope.users = [];
      angular.forEach(res.data, function(item) {
        if (item.email == email) {
          $scope.users.push(item.id, item.username, item.email);
        }
      });
      if ($scope.users[0] == null) { // Guarda os dados do user
        $http.post('https://desafio-61085.herokuapp.com/api/users', {
          "id": '',
          "username": "Test",
          "email": email
        });
      }
      return $scope.users;

    }).then(function() {
      $location.path("/items/" + email);




    });

  };


  $scope.seeItem = function(index) { // Vai para os detalhes
    $location.path("/detail/" + index);
  }



}]);


app.controller("userController", ["$scope", "$http", "$location", "$routeParams", "listService", "userService", "favsService", function($scope, $http, $location, $routeParams, listService, userService, favsService) {


  userService.get().then(function(res) { //GET USER
    email = $routeParams.user;
    $scope.email = $routeParams.user;
    $scope.users = [];
    angular.forEach(res.data, function(item) {
      if (item.email == email) {
        $scope.users.push(item.id, item.username, item.email);
      }
    });
    return $scope.users;
  });

  $scope.showLoader = true;
  listService.get().then(function(response) {
    $scope.lista = response.data;
    $scope.showLoader = false;
    $scope.user = $routeParams.user;
  }, function(error) {
    console.error(error);
  }).then(function() { // GET FAVORITES
      



    return $http.get("https://desafio-61085.herokuapp.com/api/users/" + $scope.users[0] + "/musics").success(function(data) {
      $scope.favs = data;

      return $scope.favs;
    });

  });


  $scope.favItem = function(fav, email) { // REMOVE FAVORITE
    $http.delete('https://desafio-61085.herokuapp.com/api/users/' + $scope.users[0] + "/musics/" + fav, {});
    var email = $routeParams.user;
    userService.get(email).then(function(res) {
      $scope.users = [];
      angular.forEach(res.data, function(item) {
        if (item.email === email) {
          $scope.users.push(item.id, item.username, item.email);
        }
      });
      if ($scope.users[0] === null) {
        $http.post('https://desafio-61085.herokuapp.com/api/users', {
          "id": '',
          "username": "Test",
          "email": email
        });

      }
      return $scope.users;

    }).then(function() {




      return $http.get("https://desafio-61085.herokuapp.com/api/users/" + $scope.users[0] + "/musics").success(function(data) {
        $scope.favs = data;

        return $scope.favs;
      });

    });
  };





  $scope.favAdd = function(fav, email) { // ADD FAVORITE
    $http.post('https://desafio-61085.herokuapp.com/api/users/' + $scope.users[0] + "/musics", {
      "musicid": fav
    });
    var email = $routeParams.user;
    userService.get(email).then(function(res) {
      $scope.users = [];
      angular.forEach(res.data, function(item) {
        if (item.email === email) {
          $scope.users.push(item.id, item.username, item.email);
        }
      });
      if ($scope.users[0] == null) {
        $http.post('https://desafio-61085.herokuapp.com/api/users', {
          "id": '',
          "username": "Test",
          "email": email
        });

      }
      return $scope.users;

    }).then(function() {




      return $http.get("https://desafio-61085.herokuapp.com/api/users/" + $scope.users[0] + "/musics").success(function(data) {
        $scope.favs = data;

        return $scope.favs;
      });

    });
  };





  $scope.seeItem = function(index) { // Ver detalhes
    $location.path("/detail/" + $scope.user + "/" + index);
  }


}]);


app.controller("detailController", ["$scope", "$http", "$location", "$window", "$routeParams", "listService", "userService", function($scope, $http, $location, $window, $routeParams, listService, userService) {


  $scope.goBack = function() {
    if( $window.history.length < 1 ) {
      $location.path("/items/");
    } else{
        window.history.back();
    }
  };
  

  $scope.showLoader = true;
  listService.get().then(function(response) { // Qual Detalhe
    $scope.item = response.data[parseInt($routeParams.index)];
    $scope.showLoader = false;
  }, function(error) {
    console.error(error);
  });
  
  listService.get().then(function(response) { // Qual User
    $scope.lista = response.data;
    $scope.user = $routeParams.user;
  }, function(error) {
    console.error(error);
  }).then(function() { // Quais Favoritos




    return $http.get("https://desafio-61085.herokuapp.com/api/users/" + $scope.users[0] + "/musics").success(function(data) {
      $scope.favs = data;

      return $scope.favs;
    });

  });
  
  
  userService.get().then(function(res) { // Login User
    email = $routeParams.user;
    $scope.email = $routeParams.user;
    $scope.users = [];
    angular.forEach(res.data, function(item) {
      if (item.email == email) {
        $scope.users.push(item.id, item.username, item.email);
      }
    });
    return $scope.users;
  });
  
  
  
  $scope.fetchUsers = function(email) {


    var email = email;
    userService.get(email).then(function(res) {
      $scope.users = [];
      angular.forEach(res.data, function(item) {
        if (item.email == email) {
          $scope.users.push(item.id, item.username, item.email);
        }
      });
      if ($scope.users[0] == null) {
        $http.post('https://desafio-61085.herokuapp.com/api/users', {
          "id": '',
          "username": "Test",
          "email": email
        });
      }
      return $scope.users;

    }).then(function() {
      $location.path("/detail/" + email + "/" + $routeParams.index);




    });

  };
  
  
  
  $scope.favItem = function(fav, email) {
    $http.delete('https://desafio-61085.herokuapp.com/api/users/' + $scope.users[0] + "/musics/" + fav, {});
    var email = $routeParams.user;
    userService.get(email).then(function(res) {
      $scope.users = [];
      angular.forEach(res.data, function(item) {
        if (item.email === email) {
          $scope.users.push(item.id, item.username, item.email);
        }
      });
      if ($scope.users[0] === null) {
        $http.post('https://desafio-61085.herokuapp.com/api/users', {
          "id": '',
          "username": "Test",
          "email": email
        });

      }
      return $scope.users;

    }).then(function() {




      return $http.get("https://desafio-61085.herokuapp.com/api/users/" + $scope.users[0] + "/musics").success(function(data) {
        $scope.favs = data;

        return $scope.favs;
      });

    });
  };





  $scope.favAdd = function(fav, email) {
    $http.post('https://desafio-61085.herokuapp.com/api/users/' + $scope.users[0] + "/musics", {
      "musicid": fav
    });
    var email = $routeParams.user;
    userService.get(email).then(function(res) {
      $scope.users = [];
      angular.forEach(res.data, function(item) {
        if (item.email === email) {
          $scope.users.push(item.id, item.username, item.email);
        }
      });
      if ($scope.users[0] == null) {
        $http.post('https://desafio-61085.herokuapp.com/api/users', {
          "id": '',
          "username": "Test",
          "email": email
        });

      }
      return $scope.users;

    }).then(function() {




      return $http.get("https://desafio-61085.herokuapp.com/api/users/" + $scope.users[0] + "/musics").success(function(data) {
        $scope.favs = data;

        return $scope.favs;
      });

    });
  };


}]);


