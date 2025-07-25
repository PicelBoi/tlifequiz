// The loading screen is broken for whatever reason, so we replace the logic behind it with our own.
document.onreadystatechange = function () {
  if (document.readyState !== "complete") {
    document.getElementById("loader").style.display = "block";
  } else {
    $("#loader").fadeOut("fast");
  }
};
