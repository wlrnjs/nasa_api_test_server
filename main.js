const NASA_key = 'vJHjAA7bMfWfc9gsgliiXo2j1SRfKNonQbP03n6T';
const NEWS_key = '548ec6a83add43f4b8d10c5ecc31df26';

let NASAapi = '';
let NEWSapi = '';
let MARSapi = '';

document.addEventListener("DOMContentLoaded", function() {
  setTimeout(function() {
    document.querySelector(".welcome-screen").style.display = "none";
    document.querySelector(".container").style.display = "block";
  }, 2000);
});

async function NASA() {
  try {
    let response = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${NASA_key}`
    );
    let data = await response.json();
    console.log(data);
    NASAapi = data;
  } catch (error) {
    console.error(`nasa_server_error: ${error}`);
  }
}

async function MARS() {
  try {
    let response = await fetch(
      `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&camera=fhaz&api_key=${NASA_key}`
    );
    let data = await response.json();
    console.log(data);
    MARSapi = data.photos[0];
  } catch (error) {
    console.error(`earth_server_error: ${error}`);
  }
}

async function NEWS() {
  try {
    let scienceNews = await fetch(
      `https://newsapi.org/v2/top-headlines?country=kr&apiKey=${NEWS_key}&category=science&totalResults=10`
    );
    let newsData = await scienceNews.json();
    console.log(newsData);
    NEWSapi = newsData.articles;
  } catch (error) {
    console.log(`news_server_error: ${error}`);
  }
}

const mainContent = document.querySelector('.main-content');
const todaySpacePicture = document.querySelector('.today-space-picture');
const NASAimg = document.querySelector('.NASA-img');
const scienceNews = document.querySelector('.science-news');

todaySpacePicture.addEventListener('click', (event) => {
  event.preventDefault();
  
  mainContent.innerHTML = `
      <img src=${NASAapi.url} class="content">
        <div class='content-btn'>
          <button class="content-img-close">X</button>
          <button class="content-img-menu"><i class='bx bx-menu'></i></button>
        </div>
        <div class="content-first">
          <div class="content-details">
            <h2>${NASAapi.title}</h2>
            <p>${NASAapi.explanation}</p>
          </div>
        </div>
      </img>
  `;

  const contentFirst = document.querySelector('.content-first');
  const contentImgMenu = document.querySelector('.content-img-menu');

  contentImgMenu.addEventListener('click', () => {
    contentFirst.classList.toggle('hidden');
  });

  const contentImgClose = document.querySelector('.content-img-close');

  contentImgClose.addEventListener('click', () => {
    mainContent.innerHTML = '';
  })
});

NASAimg.addEventListener('click', (event) => {
  event.preventDefault();

  mainContent.innerHTML = '';

  mainContent.innerHTML = `
      <div class="nasa-img">
        <h1>MARS IMG</h1>
        <button class="nasa-img-close">X</button>
        <div class="nasa-img-dives">
          <div class="nasa-img-div">
            <img src=${MARSapi.img_src} class='nasa-img-MARS'>
            <div class="nasa-img-div-details">
              <p>${MARSapi.id}</p>
            </div>
          </div>
        </div>
      </div>
  `

  document.querySelector('.nasa-img-close').addEventListener('click', () => {
    mainContent.innerHTML = '';
  })
});

function img(i) {
  window.open(NEWSapi[i].url, '_blank');
}

let currentPage = 1;
const itemsPerPage = 10;

function pagiNation(totalItems) {
  const pageCount = Math.ceil(totalItems / itemsPerPage);
  const paginationButtonsDiv = document.createElement('div');
  paginationButtonsDiv.className = ('pagination-button-div');

  for (let i = 1; i <= pageCount; i++) {
    const button = document.createElement('button');
    button.textContent = i;
    button.addEventListener('click', () => {
      currentPage = i;
      renderNewsPage();
    });
    paginationButtonsDiv.appendChild(button);
  }
  mainContent.appendChild(paginationButtonsDiv);
}

function renderNewsPage() {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedNews = NEWSapi.slice(startIndex, endIndex)

  mainContent.innerHTML = `
    <div class="science-news-page">
      <button class="science-news-page-button">X</button>
      <h1>SCIENCE NEWS</h1>
      <div class="science-news-page-items">
        ${paginatedNews.map((article, i) => `
          <div class="science-news-page-item">
            <img src="${article.urlToImage || 'space_background.jpg'}" class='science-news-page-img' onclick='img(${i})'>
            <div class="science-news-page-details">
              <h1>${truncateText(article.title)}</h1>
              <p>${article.publishedAt}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  document.querySelector('.science-news-page-button').addEventListener('click', () => {
    mainContent.innerHTML = '';
  });
  pagiNation(NEWSapi.length);
}

scienceNews.addEventListener('click', (event) => {
  event.preventDefault();
  currentPage = 1;
  renderNewsPage();
});

function truncateText(text, maxLength = 20) {
  if (text.length > maxLength) {
      return text.slice(0, maxLength) + '...';
  }
  return text;
}

NASA();

NEWS();

MARS();