function createToolbox(rowid, presentName, rowid) {
  // <button data-target="modal1" class="btn modal-trigger">Modal</button>
  var btn = document.createElement("button");
  btn.className = "btn waves-effect waves-ligh modal-trigger";
  btn.setAttribute("data-target", "modal1");
  btn.innerHTML = "Chcę to podarować <i class=\"material-icons right\">send</i>";
  btn.setAttribute("data-attribute", presentName);

  btn.addEventListener("click", () => {
    var pName = document.getElementById("present-name");
    pName.innerText = presentName;
    document.getElementById("select-item").setAttribute("data-target", presentName);
  })

  return btn;
}

function createItem(row, rowid) {
  var liEl = document.createElement("li");
  liEl.setAttribute("data-attribute", row.name);
  var divName = document.createElement("div");
  divName.className = "name collapsible-header";

  if (row.image_url) {
    var imageEl = document.createElement("img");
    imageEl.src = row.image_url;
    imageEl.width = 80;
    imageEl.width = 80;
    divName.appendChild(imageEl);
  }
  var nameSpan = document.createElement("span");
  nameSpan.innerText = row.name;
  divName.appendChild(nameSpan);

  liEl.appendChild(divName);
  var divDescription = document.createElement("div");
  divDescription.className = "description collapsible-body";
  if (row.description || row.url) {
    var descriptionText = document.createElement("div")
    descriptionText.innerHTML = row.description;
    divDescription.appendChild(descriptionText);
    var arrowEl = document.createElement("i");
    arrowEl.className = "material-icons";
    arrowEl.style = "margin-right: 0px";
    arrowEl.innerText = "arrow_drop_down";
    divName.appendChild(arrowEl);
    var wiecejEl = document.createElement("span");
    wiecejEl.innerText = "więcej";
    wiecejEl.style = "font-size: small;";
    divName.appendChild(wiecejEl);
    if (row.url) {
      var descAEL = document.createElement("a")
      descAEL.href = row.url;
      descAEL.text = row.url;
      divDescription.appendChild(descAEL);
    }
    liEl.appendChild(divDescription)
  }
  var divToolbox = document.createElement("div");
  divToolbox.appendChild(createToolbox(rowid, row.name, rowid));
  divToolbox.className = "toolbox";
  liEl.appendChild(divToolbox);
  return liEl;
}

jQuery(function($){
  $(document).ajaxSend(function() {
    $("#overlay").fadeIn(300);
  });

  $.getJSON("https://europe-west1-witek-wishlist.cloudfunctions.net/get_present_list", function (data) {
    data.forEach((element, idx) => {
      var elLi = createItem(element);
      document.getElementById("wishlist").appendChild(elLi);
    });
    $("#disclaimer").fadeIn(300);
  }).done(function() {
    setTimeout(function(){
      $("#overlay").fadeOut(300);
    },500)
  });
})

document.addEventListener('DOMContentLoaded', function () {
  var elems = document.querySelectorAll('.collapsible');
  var instances = M.Collapsible.init(elems);
});

document.addEventListener('DOMContentLoaded', function () {
  var elems = document.querySelectorAll('.modal');
  console.log(elems);
  var instances = M.Modal.init(elems);
});

document.addEventListener("DOMContentLoaded", () => {
  var checkbox = document.getElementById("check_anony");
  var whoText = document.getElementById("icon_prefix2");
  checkbox.addEventListener('change', (el) => {
    if (el.target.checked) {
      whoText.value = "anonimowo";
      whoText.disabled = true;
    } else {
      whoText.disabled = false;
    }
  })
})

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("select-item").addEventListener("click", (el) => {
    var rowid = el.target.getAttribute("data-target");
    var whoText = document.getElementById("icon_prefix2").value;

    var postObj = {who: whoText, present_name: rowid};
    console.log(postObj);

    $.ajax({
      type: "POST",
      url: "https://europe-west1-witek-wishlist.cloudfunctions.net/save_present_name",
      data: JSON.stringify(postObj),
      contentType: 'application/json',
      dataType: 'json'
    }, function(data) {
      if (data == "OK") {
        $("li[data-attribute='" + rowid + "']")[0].remove();
      }
    }).always(function() {
      setTimeout(function(){
        $("#overlay").fadeOut(300);
      },500)
    });
    return;
  })
})