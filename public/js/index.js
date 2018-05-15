function goToDetail(ev) {
    if (ev.key === "Enter") {
        var input = document.getElementById("input");
        console.log(input.value);
        window.location = "/detail/" + input.value;
    }
}
