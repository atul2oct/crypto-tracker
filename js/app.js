// 1:25:39
const shimmerContainer = document.getElementsByClassName('shimmer-container')[0];
const paginationContainer = document.getElementById('pagination');

const options ={
    method: "GET",
    headers: {
        accept: "application/json",
        "x-cg-demo-api-key":"CG-mDVVqLm5xBDjvcVq523LnAmB",
    }
}

let coins = [];
const itemPerPage = 15;
let currentPage = 1;

// fetching the data from api
const fetchCoins = async () => {
    try{
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1', options);

        const coinsData = await response.json()
        return coinsData;
    }
    catch(err){
        console.log("Error occured while in fetching Coins");
        console.error(err);
    }
}

// favourite
const fetchFavouriteCoins = () => {
    return JSON.parse(localStorage.getItem('favourites')) || [];
}
const saveFavouriteCoins = (favourites) => {
    localStorage.setItem('favourites',JSON.stringify(favourites))
}
const removeFavouriteCoins = (favourites) => {
    localStorage.setItem('favourites',JSON.stringify(favourites))
}
const handleFavClick = (element) => {
    const favourites = fetchFavouriteCoins();
    // if coin already present in fav remove it otherwise 
    if(favourites.includes(element.dataset.id)){
        // remove coin id
        // element.classList.remove('favourite');
        const newFavourites = favourites.filter((favourite)=>(
            favourite !== element.dataset.id
        ))
        saveFavouriteCoins(newFavourites)
    }else{
        // save coin id
        // element.classList.add('favourite');
        favourites.push(element.dataset.id)
        saveFavouriteCoins(favourites)
    }
    displayCoins(getCoinsToDisplay(coins,currentPage),currentPage)
}

// shimmer or loader
const showShimmer = () => {
    shimmerContainer.style.display='flex'
}
const hideShimmer = () => {
    shimmerContainer.style.display='none'
}

// show the data on the page
const getCoinsToDisplay = (coins,page) => {
    const start = (page - 1) * itemPerPage; //0 16 31
    const end = start + itemPerPage;
    return coins.slice(start,end);
}
const displayCoins = (coins,page) => {
    const favourites = fetchFavouriteCoins();

    const start = (page - 1) * itemPerPage + 1;
    const tableBody = document.getElementById('crypto-table-body')
    tableBody.innerHTML = "";
    coins.forEach((coin,index) => {
        const isfavourite = favourites.includes(coin.id) ? "favourite" : "";

        const row = document.createElement('tr');
        row.innerHTML = `
                    <td>${start + index}</td>
                    <td><img src="${coin.image}" alt="${coin.name}" width="24" height="24"></td>
                    <td>${coin.name}</td>
                    <td>$${coin.current_price}</td>
                    <td>$${coin.total_volume}</td>
                    <td>$${coin.market_cap}<</td>
                    <td>
                        <i class="fa-solid fa-star favourite-icon ${isfavourite}" data-id="${coin.id}" onclick="handleFavClick(this)"></i>
                    </td>`;

        tableBody.appendChild(row)
    })
}

// pagination
const renderPagination = (coins) => {
    const totalPage = Math.ceil(coins.length / itemPerPage)
    paginationContainer.innerHTML = "";

    for(let i = 1 ; i <= totalPage ; i++){
        const pageBtn = document.createElement('button');
        pageBtn.textContent = i;

        pageBtn.classList.add('page-btn')

        if(i === currentPage){
            pageBtn.classList.add('active');
        }

        // allow click over the btn
        pageBtn.addEventListener('click',() => {
            currentPage = i;
            updatePaginationButton();
            displayCoins(getCoinsToDisplay(coins,currentPage),currentPage)
        })
        paginationContainer.appendChild(pageBtn)
    }
};
const updatePaginationButton = () => {
    const pageBtns = document.querySelectorAll('.page-btn');
    pageBtns.forEach((btn,index) => {
        if(index + 1 === currentPage){
            btn.classList.add('active')
        }else{
            btn.classList.remove('active')
        }
    })
}

// window.onload = fetchCoins();
document.addEventListener("DOMContentLoaded",async()=>{
    try{
        showShimmer();
        coins = await fetchCoins();
        displayCoins(getCoinsToDisplay(coins,currentPage),currentPage)
        renderPagination(coins)
    }catch(error){
        console.log("Error in fetch data",error)
    }    
    hideShimmer();
    
})