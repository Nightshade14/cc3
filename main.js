document.addEventListener("DOMContentLoaded", function () {
  var apigClient = apigClientFactory.newClient();

  // Function to search photos
  function searchPhotos() {
    var query = document.getElementById("searchInput").value;
    var params = {
      q: query,
    };
    var body = {};
    var additionalParams = {
      headers: {
        "x-api-key": "XlAOHjqUL2a2hInV0hzNiaKcjFWNhIVX9Al0L8Tb",
      },
    };

    apigClient
      .searchGet(params, body, additionalParams)
      .then(function (result) {
        var searchResults = document.getElementById("searchResults");
        searchResults.innerHTML = "";
        var results = result.data.results;
        results.forEach(function (photo) {
          var img = document.createElement("img");
          var bucket = photo._source.bucket;
          var objectKey = photo._source.objectKey;
          img.src = `https://${bucket}.s3.amazonaws.com/${objectKey}`;
          searchResults.appendChild(img);
        });
      })
      .catch(function (error) {
        console.error("Error searching photos:", error);
      });
  }

  // Function to upload photo
  function uploadPhoto() {
    var fileInput = document.getElementById("photoInput");
    var customLabels = document.getElementById("customLabels").value;
    var file = fileInput.files[0];

    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const bucket = "cc3-b2-photos";
    var key = file.name;
    const url = `https://ncoyzr119a.execute-api.us-east-1.amazonaws.com/v1/photos/${bucket}/${key}`;

    const headers = {
      "Content-Type": file.type,
      "x-amz-meta-customLabels": customLabels,
    };

    const reader = new FileReader();
    reader.onload = async function (e) {
      const body = e.target.result;

      try {
        const response = await axios.put(url, body, { headers });
        console.log("Upload successful!", response.data);
      } catch (error) {
        console.error("Error uploading photo:", error);
      }
    };

    reader.readAsArrayBuffer(file);
  }

  // Attach event listeners
  document
    .querySelector(".search-container button")
    .addEventListener("click", searchPhotos);
  document
    .querySelector(".upload-container button")
    .addEventListener("click", uploadPhoto);
});
