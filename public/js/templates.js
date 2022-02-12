class Template {
  constructor(divId) {
    this.div = document.getElementById(divId);
  }

  get containerHide() {
    return document.querySelector(".content__subcontainer");
  }

  get spinner() {
    return document.getElementById("spinner");
  }

  showView(data) {
    this.hideSpinner();
    this.containerHide.classList.add("hidden");
    this.div.classList.remove("hidden");
    this.div.innerHTML = "";
    this.div.insertAdjacentHTML("afterbegin", this._getMarkup(data));
  }

  hideView(id) {
    document.getElementById("edit__form").dataset.id = id;
    this.containerHide.classList.remove("hidden");
    this.div.classList.add("hidden");
  }

  showSpinner() {
    this.div.classList.add("hidden");
    this.containerHide.classList.add("hidden");
    this.containerHide.parentElement.insertAdjacentHTML(
      "afterbegin",
      this._spinnerMarkup()
    );
  }

  hideSpinner() {
    this.spinner.remove();
    this.containerHide.classList.remove("hidden");
    this.div.classList.remove("hidden");
  }

  _spinnerMarkup() {
    let markup = `
    <div class="spinner" id="spinner">
      <img src="/img/spinner.png">
    </div>
    `;
    return markup;
  }
}

class TourGridView extends Template {
  constructor(divId) {
    super(divId);
  }

  _getMarkup(data) {
    let markup = "";
    data.forEach((el) => {
      const template = `
      <div class="minigrid__element" >
      <div class="img--wrapper" ">
        <img  src="${el.imageCover}" data-id="${el.id}" crossorigin="anonymous">
       </div>
        <p data-id="${el.id}">${el.tourName} </p>
       </div>
    `;
      markup += template;
    });

    return markup;
  }
}

class UserGridView extends Template {
  constructor(divId) {
    super(divId);
  }
  _getMarkup(data) {
    let markup = "";
    data.forEach((el) => {
      const template = `
      <div class="minigrid__element" >
      <div class="img--wrapper" ">
        <img class="thumbnail" src="${el.photo}" data-id="${el._id}" crossorigin="anonymous">
       </div>
        <p data-id="${el._id}">${el.name} </p>
       </div>
    `;
      markup += template;
    });

    return markup;
  }
}

export { TourGridView, UserGridView };
