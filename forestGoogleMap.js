let map;
let openMarkerContent = null; 

async function initMap() {
  // The location of Uluru
  const position = { lat: -23.116322976956745, lng: 132.13340905289155 };
  // Request needed libraries.
  //@ts-ignore
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  
  // The map, centered at Uluru
  map = new Map(document.getElementById("map"), {
    zoom: 4,
    center: position,
    mapId: "DEMO_MAP_ID",
  });
  


  for (var forest of forests) {
    const position = await geocodeAddress(forest.address);
    const mapMarker = new AdvancedMarkerElement({
    map,
    content: buildContent(forest),
    position: position,
    });
  
    mapMarker.addListener("click", () => {
      // map.setCenter(mapMarker.position);
      // map.setZoom(8);
      myFunction(mapMarker);
    });
    
  }


}

async function geocodeAddress(address) {
  const apiKey = 'AIzaSyCvbBZMdQ710YM1aSpZf8GGAQpBEnhMOi8';
  const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`);
  const data = await response.json();
  if (data.status === 'OK') {
    return data.results[0].geometry.location;
  } else {
    console.error('Geocode was not successful for the following reason: ' + data.status);
    return { lat: -25.344, lng: 131.036 }; // Default location on error
  }
}

function myFunction(markerView){
  if (openMarkerContent && openMarkerContent !== markerView.content) {
    // Close previously open marker content
    openMarkerContent.classList.remove("active");
  }

  markerView.content.classList.toggle("active"); // Toggle the current marker's content

  if (markerView.content.classList.contains("active")) {
    openMarkerContent = markerView.content; // Set the new active marker content
  } else {
    openMarkerContent = null; // No marker is currently open
  }

  google.maps.event.addListener(map, "click", function () {
    markerView.content.classList.remove("active"); // Close the marker content when clicking on the map
    openMarkerContent = null; // Reset the open marker content
  });
  
}

function buildContent(f){
  const moreLink = f?.link ? f.link : "#"; 
  const isLinkAvailable = f?.link !== "";
  const content = document.createElement("div");
  content.classList.add("forest");
  content.innerHTML = `
    <img class="icon" src = "https://cdn.shopify.com/s/files/1/0888/9650/4126/files/tree.png?v=1726456389">
    <section class="container">
      <div class="slider-wrapper">
        <div class="slider">
        </div>
      </div>
    </section>
    <div class="menu">
      <div class="name">
        <p>${f?.name}</p>
      </div>
      <div class="drop-up">
        <div class="address">${f?.address}</div>
        <div class="aboutMe">
          <p>${f?.intro}
            <a class="more" href="${moreLink}" target="_blank">${isLinkAvailable ? 'More' : 'Not Available'}</a>
          </p></div>
        <div class="bottom">
          <div class="feedMe" onclick="window.open('https://www.greenfleet.com.au/pages/donate');">
            <p>Feed Me</p>
          </div>
            <div class="socailMedia">
              <li class="facebook">
                <a href="https://www.facebook.com/GreenfleetAustralia/" target="_blank">
                  <img src="https://cdn.shopify.com/s/files/1/0888/9650/4126/files/facebook.png?v=1727331048">
                </a>
              </li>
              <li class="instagram">
                <a href="https://www.instagram.com/greenfleetaustralia/" target="_blank">
                  <img src="https://cdn.shopify.com/s/files/1/0888/9650/4126/files/instagram.png?v=1727359025">
                </a>
              <li class="linkedin">
                <a href="https://www.linkedin.com/company/greenfleet/?originalSubdomain=au" target="_blank">
                  <img src="https://cdn.shopify.com/s/files/1/0888/9650/4126/files/linkedin.png?v=1727359078">
                </a>
            </div>

        </div>
      </div>
      
    </div> `;
    // content.querySelector(".shareMe").addEventListener("click", () =>{
    //   shareMe();
    // });

  
    imageSlider(f, content);
    return content;
}

function shareMe(){
  const socailMedia=document.getElementsByClassName("socailMedia");
    for(let i=0; i<socailMedia.length; i++){
      if (socailMedia[i].style.display =="none") {
        socailMedia[i].style.display ="block";
      }else{
        socailMedia[i].style.display ="none";
      }
    }
}

function imageSlider(forest, content){
  var container = content.querySelector(".slider");
  var docFrag = document.createDocumentFragment();

  
  if (forest?.images) {
    forest.images.forEach(function(url) {
      var img = document.createElement('img');
      img.src = url;
      docFrag.appendChild(img);
    });
  }

  container.appendChild(docFrag);
  initializeSlider(container);
}

function initializeSlider(container) {
  let slideIndex = 0;
  const slides = container.querySelectorAll(".slider img, .slider video"); // Select both images and videos

  if (!slides || slides.length === 0) {
    console.log("No media found in the slider");
    return; // Exit if no slides are present
  }

  function showSlide(index) {
    if (index >= slides.length) {
      slideIndex = 0;
    } else if (index < 0) {
      slideIndex = slides.length - 1;
    }

    slides.forEach((slide) => {
      slide.style.display = "none"; // Hide all slides
      if (slide.tagName === "VIDEO") {
        slide.pause(); // Pause video when it’s not visible
      }
    });

    slides[slideIndex].style.display = "block"; // Show the current slide
    if (slides[slideIndex].tagName === "VIDEO") {
      slides[slideIndex].play(); // Play the video if it’s the current slide
    }
  }

  // Initialize first slide
  showSlide(slideIndex);

  // Automatically switch slides every 5 seconds
  setInterval(() => {
    slideIndex++;
    showSlide(slideIndex);
  }, 5000);
}
const forests = [
  {
    name: "River Bend",
    address: "Esdale Road, Mullion, NSW 2582",
    position: {
      lat: -35.0953155,
      lng: 148.9246943,
    },
    link:"",
    images: [
        "https://cdn.shopify.com/s/files/1/0888/9650/4126/files/fall-vegetable-box.jpg?v=1724300459",
        "https://cdn.shopify.com/s/files/1/0888/9650/4126/files/rack-of-womens-clothing.jpg?v=1724299789",
    ],
    intro:"",
  },
  {
    name: "Back O'Slaters",
    address: "5798 Taralga Rd, Curraweela, NSW 2580",
    position: {
      lat: -34.2899561,
      lng: 149.7985828,
    },
    link: "https://www.greenfleet.com.au/blogs/forest/back-oslaters",
    images:[],
    intro:"",
  },
  {
    name: "Kosciuszko National Park",
    address: "Kosciuszko Road, Jindabyne, NSW 2627",
    position: {
      lat: -36.392758,
      lng: 148.5915313,
    },
    link: "https://www.greenfleet.com.au/blogs/forest/kosciuszko-national-park",
    images:["https://www.nationalparks.nsw.gov.au/-/media/npws/images/parks/kosciuszko-national-park/khancoban-area/park/horse-riding-geehi.jpg",
            "https://www.nationalparks.nsw.gov.au/-/media/npws/images/parks/kosciuszko-national-park/park/winter-perisher-resort.jpg",
           "https://www.caravanrvcamping.com.au/assets/webshop/cms/82/782-1.jpg?1598483204",],
    intro:"Greenfleet has been working with the NSW National Parks and Wildlife Service (NPWS) since 2008 to revegetate a number of sites within Kosciuszko National Park. Five separate sites are undergoing a Greenfleet transformation, with a total area of approximately 442.5 hectares.<br> Primarily used for grazing prior to being incorporated into Kosciuszko National Park in1967, natural regeneration at these sites has been slow and sporadic because of weed infestation, kangaroo and pest animal populations, and compacted soils.",
  },
  {
    name: "Yurol-Ringtail ",
    address: "Yurol Ringtail Forest, McKinnon Drive, Pomona, QLD 4568",
    link: "https://www.greenfleet.com.au/blogs/forest/yurol-ringtail",
    images:[],
    intro:"Spanning two sites located on Kabi Kabi Country in Queensland, Yurol and Ringtail make up around 1,100 hectares of cleared land that Greenfleet is restoring to legally protected native forest. ",
  },
{
    name: "Lyrebird  ",
    address: "380 Snowdens Rd, Boolarra South, VIC 3870",
    link: "https://www.greenfleet.com.au/blogs/forest/lyrebird",
    images:["https://cdn.shopify.com/s/files/1/0888/9650/4126/files/Eucalyptus-obliqua-tree.jpg?v=1730135053",
           "https://cdn.shopify.com/s/files/1/0888/9650/4126/files/images.jpg?v=1730135052",],
    intro:"Hello world ",
  },
];

window.initMap = initMap;

