const ipAdd=document.getElementById("ipAddress");
  window.addEventListener('load', function(){
    setTimeout(function (){
        fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            ipAdd.innerText = data.ip;
            ipAdd.style.color ="green";
        });
    }, 1000);
});



function getUserInfo() {
    fetch("https://api.ipify.org/?format=json")
      .then((res) => res.json())
      .then((data) => {
        let ipAddress = data.ip;
  
        // console.log(ipAddress)
        fetch(`https://ipinfo.io/${ipAddress}?token=a791bcb3f533e0`)
          .then((response) => response.json())
          .then((data) => {
            const ip = data.ip;
            const lat = data.loc.split(",")[0];
            const lon = data.loc.split(",")[1];
            const timezone = data.timezone;
            const pincode = data.postal;
  
            showLocationOnMap(lat, lon, data);
            showTimezone(timezone, pincode);
            getPostOffices(pincode);
  

          })
          .catch((error) => {
            console.log("Error:", error);
          });
      });
  }


  
  function showLocationOnMap(lat, lon, data) {
    const mapDiv = document.getElementById("map");
    mapDiv.classList.add("map");
    const mapUrl = `<p>Your Current Location</p><iframe src="https://maps.google.com/maps?q=${lat}, ${lon}&z=15&output=embed" width="100%" height="100%"></iframe>`;
  
    const btn = document.querySelector(".btn");
    btn.classList.add("removeBtn");
  
    const ipDetails = document.querySelector(".ipDetails");
    ipDetails.innerHTML += `
        <ul>
          <li>Lat: ${lat}</li>
          <li>Long: ${lon}</li>
        </ul>
        <ul>
          <li>City: ${data.city}</li>
          <li>Region: ${data.region}</li>
        </ul>
        <ul>
          <li>Organisation: ${data.org}</li>
          <li>Hostname: ${data.ip}</li>
        </ul>
      
      `;
    mapDiv.innerHTML = mapUrl;
  }
  
  function showTimezone(timezone, pincode) {
    var pincodeCount = 0;
    fetch(`https://api.postalpincode.in/pincode/${pincode}`)
      .then((response) => response.json())
      .then((data) => {
        const postOffices = data[0].PostOffice;
        postOffices.forEach((element) => {
          pincodeCount++;
        });
  
        console.log(pincodeCount);
  
        
        const timezoneElement = document.getElementById("timezone");
        let currentTime = new Date().toLocaleString("en-US", {
          timeZone: timezone,
        });
  
  
        timezoneElement.innerHTML += `
        <h2>More Information About You</h2>
        <h3>Time Zone: ${timezone}</h3>
        <h3>Date And Time: ${currentTime}</h3>
        <h3>Pincode: ${pincode}</h3>
        <h3>Message: Number of pincode(s) found: ${pincodeCount}</h3>
      `;
      });
  }
  
  function getPostOffices(pincode) {
    fetch(`https://api.postalpincode.in/pincode/${pincode}`)
      .then((response) => response.json())
      .then((data) => {
        const postOffices = data[0].PostOffice;
  
        const postOfficeList = document.getElementById("postOfficeList");
        postOffices.forEach((postOffice) => {
          postOfficeList.innerHTML += `
          <ul>
              <li>Name: ${postOffice.Name}</li>
              <li>Branch Type: ${postOffice.BranchType}</li>
              <li>Delivery Status: ${postOffice.DeliveryStatus}</li>
              <li>District: ${postOffice.District}</li>
              <li>Division: ${postOffice.Division}</li>
          </ul>
          `;
        });
  
        const searchBar = document.getElementById("searchBoxed");
        searchBar.innerHTML += `
        <div class="title">Post Offices Near You</div>
        <div class="search">
        <p><img src="Vector.png" alt="pic" style="width:20px;"></p>
              <input
              type="text"
              id="searchBox"
              placeholder="Search By name"
              oninput="filterPostOffices()"
              />
              </div>
          `;
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }


  
  function filterPostOffices() {
    const searchBox = document.getElementById("searchBox");
    const filter = searchBox.value.toUpperCase();

    const postOfficeList = document.getElementById("postOfficeList");
    const listItems = postOfficeList.getElementsByTagName("ul");
  
    for (let i = 0; i < listItems.length; i++) {
      const listItem = listItems[i];
      console.log(listItem);
      const text = listItem.textContent || listItem.innerText;
      if (text.toUpperCase().indexOf(filter) > -1) {
        listItem.style.display = "";
      } else {
        listItem.style.display = "none";
      }
    }
  }