/**
 * Created by Balkishan on 4/4/2017.
 */
var myapp = angular.module("MainApp",['ngMaterial']);

//myapp.service('hexafy', function($http) {
//    this.myFunc = function (link,input) {
//
//        $http.post(link,input).success(function (data, status, headers, config) {
//            console.log(data);
//        }).error(function (data, status, headers, config) {
//            console.log(data)
//        })
//    }
//});

myapp.factory('myService', function($http) {
    return {
        async: function(method,link,input) {
            if(method === "POST"){
                return $http.post(link,input);
            }
            else if(method === "GET"){
                return $http.get(link);
            }
            else{
                return null
            }
        }
    };
});

myapp.controller('MainCtrl',['$mdBottomSheet','$location','$window','$scope','myService',function ($mdBottomSheet,$location,$window,$scope,myService) {
    if(sessionStorage.userEntity){
        $window.location.href = '/static/html/userDashboard.html';
    }

    var baseUrl = $location.$$protocol + '://' + $location.$$host+':'+$location.port();

    $scope.isEmpty = function (obj) {
        for (var i in obj) if (obj.hasOwnProperty(i)) return false;
        return true;
    };

    $scope.departments = ["Engineering","Quality Analysis","Product Management","UI Developers"];

    $scope.loginFunc = function () {
        myService.async("POST",baseUrl+"/user/login",JSON.stringify($scope.loginObj)).success(function (response) {
            console.log(response);
            $window.sessionStorage.email = $scope.loginObj.email;
            $window.sessionStorage.token = response.token;
            $scope.loginObj.token = response.token;
            $scope.loginObj = {};
            myService.async("POST",baseUrl+"/user/listUsers",JSON.stringify($scope.loginObj)).success(function (response) {
                console.log(response);
            });

            //sessionStorage.userEntity = JSON.stringify(response.message.userEntity);
            $window.location.href = '/static/html/userDashboard.html';
            return response.data;
        }).error(function (response) {
            $scope.loginObj = {};
            console.log(response);
            $mdBottomSheet.show({
                template: '<md-bottom-sheet style="background-color: #ff0000">'+response.message+'</md-bottom-sheet>'
            });
            return response.data;
        });
    };

    $scope.registerUser = function () {
        myService.async("POST",baseUrl+"/user/register",JSON.stringify($scope.profile)).success(function (response) {
            $scope.loginObj = {};
            console.log(response);
            //sessionStorage.userEntity = JSON.stringify(response.message.userEntity);
            //$window.location.href = '/static/html/userDashboard.html';
            return response.data;
        }).error(function (response) {
            console.log("ERROR");
            $scope.profile.password = "";
            $mdBottomSheet.show({
                template: '<md-bottom-sheet style="background-color: #ff0000">'+response.message+'</md-bottom-sheet>'
            });
            console.log(response);
            return response.data;
        });
    }

}]);