import axios from 'axios';

let SEARCH_REQUEST = 'sea';
let PAGE = 1;
const API_KEY = '30621741-446cead4559fde052eea47f9a';

window.addEventListener('DOMContentLoaded', function () {
  const items = this.document.querySelector('.items');
  const searchBtn = this.document.querySelector('.btn-search');
  const inputSearch = this.document.querySelector('.input');
  const pagination = this.document.querySelector('.pagination');
  const overlay = document.getElementById('overlay');
  const popup = document.getElementById('myPopup');

  async function getRequest() {
    await axios
      .get(
        `https://pixabay.com/api/?key=${API_KEY}&image_type=photo&per_page=4&page=${PAGE}&q=${SEARCH_REQUEST}`,
        { params: { method: 'GET' } },
      )
      .then(function (response) {
        items.innerHTML = '';
        renderImages(response.data.hits);
      })
      .catch(function (error) {
        console.error(error);
      });
  }
  getRequest();

  pagination.innerHTML = `<li class="page-item active">
    <a class="page-link" tabindex="1" href="#">1</a>
  </li>
  <li class="page-item">
    <a class="page-link" tabindex="2" href="#">2<span class="sr-only"></span></a>
  </li>
  <li class="page-item">
    <a class="page-link" tabindex="3" href="#">3</a>
  </li>
  <li class="page-item">
    <a class="page-link" tabindex="4" href="#">4</a>
  </li>
  <li class="page-item">
    <a class="page-link" tabindex="5" href="#">5</a>
  </li>`;

  let pageItems = document.querySelectorAll('.page-item');

  pagination.addEventListener('click', function (e) {
    pageItems.forEach((item) => {
      item.classList.remove('active');
    });
    e.target.closest('.page-item').classList.add('active');
    PAGE = e.target.attributes.tabindex.value;
    getRequest();
  });

  searchBtn.addEventListener('click', function (e) {
    if (inputSearch.value != '') {
      e.preventDefault();
      inputSearch.classList.remove('warning');
      popup.classList.remove('show');
      SEARCH_REQUEST = inputSearch.value;
      inputSearch.value = '';
      pageItems.forEach((item) => {
        item.classList.remove('active');
      });
      pageItems[0].classList.add('active');
      getRequest();
    } else {
      e.preventDefault();
      popup.classList.add('show');
      inputSearch.classList.add('warning');
      inputSearch.focus();
    }
  });

  function closeOverlay(e) {
    overlay.style.display = 'none';
    document.body.classList.remove('modal-open');
  }

  overlay.addEventListener('click', function (e) {
    closeOverlay(e);
  });
  this.document.addEventListener('keyup', function (e) {
    if (e.key === 'Escape') {
      closeOverlay(e);
    }
  });

  function renderImages(arrayOfImages) {
    if (arrayOfImages.length > 0) {
      window.on = function (item) {
        overlay.style.display = 'block';
        overlay.innerHTML = `<img src=${item} id="img"/>`;
        document.body.classList.add('modal-open');
      };
      arrayOfImages.map((item) => {
        items.innerHTML += `<div class="row w-75 p-3">
        <img src=${item.largeImageURL} class="img-fluid col-sm w-100 p-3" style="height: 500px; box-shadow: 0px 0px 10px 5px grey; border-radius: 10px; object-fit: cover; cursor: pointer" onclick="on(\'${item.largeImageURL}'\)" alt="Responsive image" />
        </div>
        `;
      });
      pagination.classList.remove('d-none');
      pagination.classList.add('d-flex');
    } else {
      items.removeAttribute('class');
      items.innerHTML = `<div style="display: flex;
      flex-direction: column;
      align-items: center;
      margin: 100px 0;
      ">
      <h1>There is nothing to display :(</h1><p>Try to find smth else</p>
      </div>
      `;
      pagination.classList.remove('d-flex');
      pagination.classList.add('d-none');
    }
  }
});
