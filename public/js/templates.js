class Template {
  get containerHide() {
    return document.querySelector(".content__subcontainer");
  }

  showView(data) {
    this.containerHide.classList.add("hidden");
    this.div.classList.remove("hidden");
    this.div.innerHTML = "";
    this.div.insertAdjacentHTML("afterbegin", this._getMarkup(data));
  }

  hideView(id) {
    document.getElementById("tour__form").dataset.id = id;
    this.containerHide.classList.remove("hidden");
    this.div.classList.add("hidden");
  }
}

class GridView extends Template {
  constructor(divId) {
    super();
    this.div = document.getElementById(divId);
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

export { GridView };
