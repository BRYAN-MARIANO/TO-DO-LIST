const table = document.querySelector(".crud__table");
const form = document.querySelector(".crud__form");
const title = document.querySelector(".crud__title");
const template = document.getElementById("crud__template").content;
const fragmento = document.createDocumentFragment();

const getAll = async () => {
  try {
    let res = await fetch("http://localhost:3000/LIST");
    json = await res.json();

    if (!res.ok) throw { status: res.status, statusText: res.statusText };
    console.log(json);
    json.forEach((el) => {
      template.querySelector(".activity").textContent = el.activity;
      template.querySelector(".description").textContent = el.description;
      template.querySelector(".edit").dataset.id = el.id;
      template.querySelector(".delete").dataset.id = el.id;

      let clone = document.importNode(template, true);
      fragmento.appendChild(clone);
    });

    table.querySelector("tbody").appendChild(fragmento);

    const stateElements = document.querySelectorAll(".description-none");

    function displayTable() {
      stateElements.forEach((element) => {
        element.style.display = "table-cell";
      });
    }

    function displayNone() {
      stateElements.forEach((element) => {
        element.style.display = "none";
      });
    }

    let useDisplayTable = true;

    document.querySelectorAll(".boton").forEach((boton) => {
      boton.addEventListener("click", function () {
        if (useDisplayTable) {
          displayTable();
        } else {
          displayNone();
        }

        useDisplayTable = !useDisplayTable;
      });
    });
  } catch (err) {
    let message = err.statusText || "ocurrio error";
    table.insertAdjacentHTML(
      "afterend",
      `<p><b>Error ${err.status}: ${message}</b></p>`
    );
  }
};

document.addEventListener("DOMContentLoaded", getAll);

document.addEventListener("submit", async (e) => {
  if (e.target === form) {
    e.preventDefault();
    if (!e.target.id.value) {
      try {
        let options = {
          method: "POST",
          headers: {
            "Content-type": "application/json;charset=utf-8",
          },
          body: JSON.stringify({
            activity: e.target.activity.value,
            description: e.target.description.value,
          }),
        };
        let res = await fetch("http://localhost:3000/LIST", options);
        json = await res.json();

        if (!res.ok) throw { status: res.status, statusText: res.statusText };

        location.reload();
      } catch (err) {
        let message = err.statusText || "ocurrio error";
        form.insertAdjacentHTML(
          "afterend",
          `<p><b>Error ${err.status}: ${message}</b></p>`
        );
      }
    } else {
      try {
        let options = {
          method: "PUT",
          headers: {
            "Content-type": "application/json;charset=utf-8",
          },
          body: JSON.stringify({
            activity: e.target.activity.value,
            description: e.target.description.value,
          }),
        };
        let res = await fetch(
          `http://localhost:3000/LIST/${e.target.id.value}`,
          options
        );
        json = await res.json();
        if (!res.ok) throw { status: res.status, statusText: res.statusText };
        location.reload();
      } catch (err) {
        let message = err.statusText || "ocurrio error";
        form.insertAdjacentHTML(
          "afterend",
          `<p><b>Error ${err.status}: ${message}</b></p>`
        );
      }
    }
  }
});

document.addEventListener("click", async (e) => {
  if (e.target.matches(".edit")) {
    title.textContent = "EDIT ACTIVITY";
    const row = e.target.closest("tr");
    const activity = row.querySelector(".activity").textContent;
    const description = row.querySelector(".description").textContent;

    form.activity.value = activity;
    form.description.value = description;
    form.id.value = e.target.dataset.id;
  }
  if (e.target.matches(".delete")) {
    let isDelete = confirm(
      `ESTAS SEGURO DE ELIMINAR EL ELEMENTO ${e.target.dataset.id}?`
    );

    if (isDelete) {
      try {
        let options = {
          method: "DELETE",
          headers: {
            "Content-type": "application/json;charset=utf-8",
          },
        };
        let res = await fetch(
          `http://localhost:3000/LIST/${e.target.dataset.id}`,
          options
        );
        json = await res.json();
        location.reload();
      } catch (err) {
        let message = err.statusText || "ocurrio error";
        alert(`Error ${err.status}: ${message}`);
      }
    }
  }
});
