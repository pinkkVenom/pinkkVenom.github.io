document.addEventListener("DOMContentLoaded", () => {
    const collectionContainer = document.getElementById("collection");
    const searchInput = document.getElementById("search");
    const sortSelect = document.getElementById("sort");
    
    let dolls = [];
  
    // Fetch the doll data
    fetch('json/traditional-breyer-collection.json')
      .then(response => response.json())
      .then(data => {
        dolls = data;
        displayDolls(dolls);
      });
  
      // Function to display dolls
  function displayDolls(dolls) {
    collectionContainer.innerHTML = "";

    dolls.forEach((doll) => {
      // Create the doll card container
      const dollCard = document.createElement("div");
      dollCard.classList.add("doll-card");

      // Create slideshow container
      const slideshowContainer = document.createElement("div");
      slideshowContainer.classList.add("slideshow-container");

      // Add images to the slideshow
      doll.images.forEach((image, index) => {
        const img = document.createElement("img");
        img.src = image;
        img.alt = `${doll.name} image ${index + 1}`;
        img.classList.add("slide");
        if (index === 0) img.classList.add("active"); // Show the first image by default
        slideshowContainer.appendChild(img);
      });

      // Add navigation buttons
      const prevButton = document.createElement("button");
      prevButton.classList.add("prev");
      prevButton.textContent = "<";
      slideshowContainer.appendChild(prevButton);

      const nextButton = document.createElement("button");
      nextButton.classList.add("next");
      nextButton.textContent = ">";
      slideshowContainer.appendChild(nextButton);

      // Append slideshow to the doll card
      dollCard.appendChild(slideshowContainer);

      // Add other doll details
      dollCard.innerHTML += `
        <h2>${doll.name}</h2>
        <p><strong>Release Date:</strong> ${doll.release_date}</p>
        <p><strong>Mold Type:</strong> ${doll.mold_type}</p>
        <p><strong>Current Condition:</strong> ${doll.condition}</p>
      `;

      // Create a button for the dropdown
      const toggleButton = document.createElement("button");
      toggleButton.textContent = "More Info";
      toggleButton.classList.add("toggle-btn");

      // Create the dropdown container (hidden by default)
      const dropdownContainer = document.createElement("div");
      dropdownContainer.classList.add("dropdown-container");
      dropdownContainer.innerHTML = `
        <p><strong>Description:</strong> ${doll.description || "N/A"}</p>
        <p><strong>Price:</strong> ${doll.price || "N/A"}</p>
        <p><strong>Features:</strong> ${doll.features?.join(", ") || "N/A"}</p>
      `;
      dropdownContainer.style.display = "none"; // Hidden by default

      // Add toggle functionality
      toggleButton.addEventListener("click", () => {
        const isHidden = dropdownContainer.style.display === "none";
        dropdownContainer.style.display = isHidden ? "block" : "none";
        toggleButton.textContent = isHidden ? "Less Info" : "More Info";
      });

      // Append the toggle button and dropdown container to the card
      dollCard.appendChild(toggleButton);
      dollCard.appendChild(dropdownContainer);

      // Add the doll card to the collection container
      collectionContainer.appendChild(dollCard);
    });

    // Initialize the slideshow functionality
    initializeSlideshows();
  }

  // Function to handle the slideshow behavior
  function initializeSlideshows() {
    const dollCards = document.querySelectorAll(".doll-card");

    dollCards.forEach((card) => {
      const slides = card.querySelectorAll(".slide");
      const prevButton = card.querySelector(".prev");
      const nextButton = card.querySelector(".next");
      let currentSlide = 0;

      function showSlide(index) {
        // Wrap around the slides
        if (index >= slides.length) currentSlide = 0;
        if (index < 0) currentSlide = slides.length - 1;

        // Hide all slides and show the current one
        slides.forEach((slide, i) => {
          slide.classList.toggle("active", i === currentSlide);
        });
      }

      // Add event listeners for buttons
      prevButton.addEventListener("click", () => {
        currentSlide -= 1;
        showSlide(currentSlide);
      });

      nextButton.addEventListener("click", () => {
        currentSlide += 1;
        showSlide(currentSlide);
      });

      // Initialize the first slide
      showSlide(currentSlide);
    });
    }
  
    // Search functionality
    searchInput.addEventListener("input", () => {
      const searchTerm = searchInput.value.toLowerCase();
      const filteredDolls = dolls.filter(doll =>
        doll.name.toLowerCase().includes(searchTerm)
      );
      displayDolls(filteredDolls);
    });
  
    // Sort functionality
    sortSelect.addEventListener("change", () => {
      const sortBy = sortSelect.value;
      const sortedDolls = [...dolls].sort((a, b) => {
        if (sortBy === "release_date") {
          return new Date(a.release_date) - new Date(b.release_date);
        }
        return a[sortBy].localeCompare(b[sortBy]);
      });
      displayDolls(sortedDolls);
    });
  });
  