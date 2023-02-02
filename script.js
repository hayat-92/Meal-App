// To check if favourite is Not present
if (localStorage.getItem("favouritesList") == null) {
  localStorage.setItem("favouritesList", JSON.stringify([]));
}

// Function to fetch Data related to value
async function fetchData(url, value) {
  const response = await fetch(`${url + value}`);
  const meals = await response.json();
  return meals;
}

// Function to present all meals card in main acording to search input value
function showMealList() {
  let inputValue = document.getElementById("my-search").value;
  let arr = JSON.parse(localStorage.getItem("favouritesList"));
  let url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
  let html = "";
  let meals = fetchData(url, inputValue);
  meals.then((data) => {
    if (data.meals) {
      data.meals.forEach((element) => {
        let isFav = false;
        for (let index = 0; index < arr.length; index++) {
          if (arr[index] == element.idMeal) {
            isFav = true;
          }
        }
        if (isFav) {
          html += `
                <div id="card" class="card mb-3 faisal">
                    <img src="${element.strMealThumb}" class="card-img-top" alt="...">
                    <div class="card-body w-100">
                        <h5 class="card-title">${element.strMeal}</h5>
                        <div class="d-flex justify-content-between mt-1 w-100">
                            <button type="button" class="btn btn-bg-color" onclick="showMealDetails(${element.idMeal})">More Details</button>
                            <button id="main${element.idMeal}" class="btn btn-outline-light btn-dark active mr-5" onclick="addRemoveToFavList(${element.idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>
                        </div>
                    </div>
                </div>
                `;
        } else {
          html += `
                <div id="card" class="card mb-3 faisal">
                    <img src="${element.strMealThumb}" class="card-img-top" alt="...">
                    <div class="card-body w-100">
                        <h5 class="card-title">${element.strMeal}</h5>
                        <div class="d-flex justify-content-between mt-1 w-100">
                            <button type="button" class="btn btn-bg-color" onclick="showMealDetails(${element.idMeal})">More Details</button>
                            <button id="main${element.idMeal}" class="btn btn-outline-light" onclick="addRemoveToFavList(${element.idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>
                        </div>
                    </div>
                </div>
                `;
        }
      });
    } else {
      html += `
            <div class="page-wrap d-flex flex-row align-items-center">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-md-12 text-center">
                            <span class="display-1 d-block">Sorry!</span>
                            <div class="mb-4 lead">
                                The meal you are looking for was not found.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
    }
    document.getElementById("main").innerHTML = html;
  });
}

//its shows full meal details in main
async function showMealDetails(id) {
  let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
  let html = "";
  // Fetches data and updates the detail page of UI
  await fetchData(url, id).then((data) => {
    html += `
          <div id="meal-details" class="mb-5">
            <div id="meal-header" class="d-flex justify-content-center flex-wrap">
              <div id="meal-thumbail">
                <img class="" src="${data.meals[0].strMealThumb}" alt="" srcset="">
              </div>
              <div id="details">
                <h3>${data.meals[0].strMeal}</h3>
                <h6>Category : ${data.meals[0].strCategory}</h6>
                <h6>Area : ${data.meals[0].strArea}</h6>
              </div>
            </div>
            <div id="meal-instruction" class="mt-3">
              <h5 class="text-center">Instruction :</h5>
              <p>${data.meals[0].strInstructions}</p>
              <div class="text-center">
              <a href="${data.meals[0].strYoutube}" target="_blank" class="btn btn-bg-color mt-3">Watch Video</a>
            </div>
            </div>
            
          </div>
        `;
  });
  document.getElementById("main").innerHTML = html;
}

// its shows all favourites meals in favourites body
async function showFavMealList() {
  let arr = JSON.parse(localStorage.getItem("favouritesList"));
  let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
  let html = "";
  if (arr.length == 0) {
    html += `
            <div class="page-wrap d-flex flex-row align-items-center">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-md-12 text-center">
                            <span class="display-1 d-block">SORRY!!</span>
                            <div class="mb-4 lead">
                                No meal in your favourites list!.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
  } else {
    for (let index = 0; index < arr.length; index++) {
      await fetchData(url, arr[index]).then((data) => {
        html += `
                <div id="card" class="card mb-3" style="width: 20rem;">
                    <img src="${data.meals[0].strMealThumb}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${data.meals[0].strMeal}</h5>
                        <div class="d-flex justify-content-between">
                            <button type="button" class="btn btn-bg-color" onclick="showMealDetails(${data.meals[0].idMeal})">More Details</button>
                            <button id="main${data.meals[0].idMeal}" class="btn btn-outline-light active" onclick="addRemoveToFavList(${data.meals[0].idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>
                        </div>
                    </div>
                </div>
                `;
      });
    }
  }
  document.getElementById("favourites-body").innerHTML = html;
}

//This function adds and remove meals from favourites list
function addRemoveToFavList(id) {
  // Gets data stored in localStorage
  let arr = JSON.parse(localStorage.getItem("favouritesList"));
  let contain = false;
  for (let index = 0; index < arr.length; index++) {
    if (id == arr[index]) {
      contain = true;
    }
  }
  if (contain) {
    let number = arr.indexOf(id);
    arr.splice(number, 1);
    alert("HEY!! Meal Removed From Your Fav list!!");
  } else {
    arr.push(id);
    alert("HEY!! Meal Added To Your Fav List!!");
  }
  // Set Updated list into localStorage
  localStorage.setItem("favouritesList", JSON.stringify(arr));
  showMealList();
  showFavMealList();
}
