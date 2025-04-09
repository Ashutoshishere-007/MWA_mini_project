angular.module("weatherApp").controller("WeatherController", function ($scope, $http) {
    $scope.cityHistory = JSON.parse(localStorage.getItem("cityHistory")) || [];
  
    $scope.getWeather = function () {
      if (!$scope.city) {
        $scope.errorMessage = "Please enter a city name.";
        $scope.weatherData = null;
        return;
      }
  
      const cityName = $scope.city.trim();
      const url = `https://wttr.in/${cityName}?format=j1`;
  
      $http.get(url)
        .then(function (response) {
          const data = response.data;
  
          $scope.weatherData = {
            name: cityName,
            temp: data.current_condition[0].temp_C,
            description: data.current_condition[0].weatherDesc[0].value,
            humidity: data.current_condition[0].humidity,
            wind: data.current_condition[0].windspeedKmph,
            forecast: data.weather.slice(0, 3)  // 3-day forecast
          };
  
          $scope.errorMessage = null;
  
          // Save to history
          if (!$scope.cityHistory.includes(cityName)) {
            $scope.cityHistory.unshift(cityName);
            if ($scope.cityHistory.length > 5) $scope.cityHistory.pop();
            localStorage.setItem("cityHistory", JSON.stringify($scope.cityHistory));
          }
        })
        .catch(function () {
          $scope.weatherData = null;
          $scope.errorMessage = "Failed to fetch weather data. Try again.";
        });
    };
  
    $scope.selectHistory = function (city) {
      $scope.city = city;
      $scope.getWeather();
    };
  });
  