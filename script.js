// =====================================
// 1. BASIC SETTINGS AND SAMPLE DATA
// =====================================

const sampleItems = [
  {
    id: 1,
    name: "Classic Story Books",
    category: "Books",
    condition: "Good",
    type: "Free",
    description:
      "A collection of interesting story books. Perfect for young readers.",
    contact: "books@example.com",
    image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 2,
    name: "Wooden Study Table",
    category: "Furniture",
    condition: "Good",
    type: "Exchange",
    description:
      "Strong wooden study table. Looking to exchange for a bookshelf.",
    contact: "table@example.com",
    image:
      "https://images.unsplash.com/photo-1499933374294-4584851497cc?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 3,
    name: "Wireless Headphones",
    category: "Electronics",
    condition: "Like New",
    type: "Donation",
    description:
      "Working wireless headphones. Giving them away to someone who needs them.",
    contact: "audio@example.com",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 4,
    name: "Cotton Casual Shirts",
    category: "Clothing",
    condition: "Good",
    type: "Free",
    description: "Clean and wearable casual shirts. Looking for a new home.",
    contact: "clothes@example.com",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 5,
    name: "Ceramic Plant Pots",
    category: "Household",
    condition: "Like New",
    type: "Donation",
    description: "Beautiful reusable plant pots for your home or garden.",
    contact: "pots@example.com",
    image:
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 6,
    name: "Programming Books",
    category: "Books",
    condition: "Good",
    type: "Exchange",
    description: "Useful programming books for students and beginners.",
    contact: "coding@example.com",
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=700&q=80",
  },
];

// Read saved data from localStorage or use sample data

function getSavedData(key, defaultValue) {
  const saved = localStorage.getItem(key);

  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (error) {
      return defaultValue;
    }
  }

  return defaultValue;
}

let items = getSavedData("recircleItems", sampleItems);

let joinedChallenges = getSavedData("recircleChallenges", {});

let interestedItems = getSavedData("recircleInterests", []);

let completedChallenges = getSavedData("recircleCompleted", 0);

// Save data in localStorage

function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// =====================================
// 2. TOAST NOTIFICATION
// =====================================

function showToast(message) {
  const toast = document.getElementById("toast");

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(function () {
    toast.classList.remove("show");
  }, 2800);
}

// =====================================
// 3. MOBILE NAVIGATION
// =====================================

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", function () {
  navLinks.classList.toggle("active");

  if (navLinks.classList.contains("active")) {
    menuToggle.textContent = "×";
  } else {
    menuToggle.textContent = "☰";
  }
});

document.querySelectorAll(".nav-links a").forEach(function (link) {
  link.addEventListener("click", function () {
    navLinks.classList.remove("active");
    menuToggle.textContent = "☰";
  });
});

// =====================================
// 4. MARKETPLACE DISPLAY
// =====================================

const marketplaceGrid = document.getElementById("marketplaceGrid");
const emptyMessage = document.getElementById("emptyMessage");

function displayItems(list) {
  marketplaceGrid.innerHTML = "";

  if (list.length === 0) {
    emptyMessage.classList.remove("hidden");
    return;
  }

  emptyMessage.classList.add("hidden");

  list.forEach(function (item) {
    const card = document.createElement("article");
    card.className = "item-card";

    const image = item.image || "";

    card.innerHTML = `
            <div class="item-image">
                <img src="${escapeHTML(image)}" alt="${escapeHTML(item.name)}">
                <span class="item-type">${escapeHTML(item.type)}</span>
            </div>

            <div class="item-content">
                <span class="item-category">
                    ${escapeHTML(item.category)}
                </span>

                <h3>${escapeHTML(item.name)}</h3>

                <p>${escapeHTML(item.description)}</p>

                <div class="item-meta">
                    <span>Condition: ${escapeHTML(item.condition)}</span>
                    <span>Community Listing</span>
                </div>

                <div class="item-actions">
                    <button class="details-btn" data-id="${item.id}">
                        Details
                    </button>

                    <button class="interest-btn" data-id="${item.id}">
                        ${interestedItems.includes(item.id) ? "Interested ✓" : "I'm Interested"}
                    </button>
                </div>
            </div>
        `;

    marketplaceGrid.appendChild(card);
  });
}

// Basic protection when displaying user-entered text

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, function (character) {
    const characters = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };

    return characters[character];
  });
}

// Initial marketplace display

displayItems(items);

// =====================================
// 5. MARKETPLACE SEARCH AND FILTERS
// =====================================

const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const typeFilter = document.getElementById("typeFilter");

function filterItems() {
  const searchText = searchInput.value.toLowerCase();

  const selectedCategory = categoryFilter.value;
  const selectedType = typeFilter.value;

  const filteredItems = items.filter(function (item) {
    const matchesSearch =
      item.name.toLowerCase().includes(searchText) ||
      item.description.toLowerCase().includes(searchText);

    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;

    const matchesType = selectedType === "all" || item.type === selectedType;

    return matchesSearch && matchesCategory && matchesType;
  });

  displayItems(filteredItems);
}

searchInput.addEventListener("input", filterItems);

categoryFilter.addEventListener("change", filterItems);

typeFilter.addEventListener("change", filterItems);

// =====================================
// 6. ITEM DETAILS MODAL
// =====================================

const itemModal = document.getElementById("itemModal");
const itemModalContent = document.getElementById("itemModalContent");

marketplaceGrid.addEventListener("click", function (event) {
  const button = event.target.closest("button");

  if (!button) {
    return;
  }

  const itemId = Number(button.dataset.id);

  if (button.classList.contains("details-btn")) {
    showItemDetails(itemId);
  }

  if (button.classList.contains("interest-btn")) {
    expressInterest(itemId);
  }
});

function showItemDetails(itemId) {
  const item = items.find(function (product) {
    return product.id === itemId;
  });

  if (!item) {
    return;
  }

  itemModalContent.innerHTML = `
        <img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.name)}">

        <span class="item-category">${escapeHTML(item.category)}</span>

        <h2>${escapeHTML(item.name)}</h2>

        <p><strong>Condition:</strong> ${escapeHTML(item.condition)}</p>

        <p><strong>Listing Type:</strong> ${escapeHTML(item.type)}</p>

        <p>${escapeHTML(item.description)}</p>

        <p>
            <strong>Preferred Contact:</strong>
            ${escapeHTML(item.contact || "Contact details not provided")}
        </p>

        <button class="btn btn-primary" id="modalInterestButton">
            I'm Interested
        </button>
    `;

  itemModal.classList.remove("hidden");

  document
    .getElementById("modalInterestButton")
    .addEventListener("click", function () {
      expressInterest(itemId);
    });
}

// Close item modal

document
  .getElementById("closeItemModal")
  .addEventListener("click", function () {
    itemModal.classList.add("hidden");
  });

itemModal.addEventListener("click", function (event) {
  if (event.target === itemModal) {
    itemModal.classList.add("hidden");
  }
});

// =====================================
// 7. INTEREST BUTTON
// =====================================

function expressInterest(itemId) {
  if (interestedItems.includes(itemId)) {
    showToast("You have already expressed interest.");
    return;
  }

  interestedItems.push(itemId);

  saveData("recircleInterests", interestedItems);

  showToast("Interest recorded successfully!");

  filterItems();

  itemModal.classList.add("hidden");
}

// =====================================
// 8. LISTING FORM
// =====================================

const listingForm = document.getElementById("listingForm");

const itemImageInput = document.getElementById("itemImage");

const imagePreview = document.getElementById("imagePreview");

let uploadedImage = "";

// Image preview

itemImageInput.addEventListener("change", function () {
  const file = itemImageInput.files[0];

  uploadedImage = "";

  if (!file) {
    imagePreview.textContent = "Image preview will appear here";
    return;
  }

  if (!file.type.startsWith("image/")) {
    showToast("Please select a valid image.");
    itemImageInput.value = "";
    imagePreview.textContent = "Image preview will appear here";
    return;
  }

  if (file.size > 1024 * 1024) {
    showToast("Please select an image smaller than 1 MB.");
    itemImageInput.value = "";
    imagePreview.textContent = "Image preview will appear here";
    return;
  }

  const reader = new FileReader();

  reader.onload = function (event) {
    uploadedImage = event.target.result;

    imagePreview.innerHTML = "";

    const previewImage = document.createElement("img");

    previewImage.src = uploadedImage;
    previewImage.alt = "Selected item preview";

    imagePreview.appendChild(previewImage);
  };

  reader.readAsDataURL(file);
});

// Submit listing form

listingForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("itemName").value.trim();

  const category = document.getElementById("itemCategory").value;

  const condition = document.getElementById("itemCondition").value;

  const type = document.getElementById("listingType").value;

  const description = document.getElementById("itemDescription").value.trim();

  const contact = document.getElementById("contactInfo").value.trim();

  if (!name || !category || !condition || !type || !description || !contact) {
    showToast("Please complete all required fields.");
    return;
  }

  if (name.length < 2 || description.length < 10) {
    showToast("Please enter a valid name and description.");
    return;
  }

  if (contact.length < 5) {
    showToast("Please enter valid contact information.");
    return;
  }

  const newItem = {
    id: Date.now(),

    name: name,

    category: category,

    condition: condition,

    type: type,

    description: description,

    contact: contact,

    image:
      uploadedImage ||
      "https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?auto=format&fit=crop&w=700&q=80",
  };

  items.unshift(newItem);

  saveData("recircleItems", items);

  listingForm.reset();

  uploadedImage = "";

  imagePreview.textContent = "Image preview will appear here";

  searchInput.value = "";

  categoryFilter.value = "all";

  typeFilter.value = "all";

  displayItems(items);

  updateImpactDashboard();

  showToast("Your item has been published!");

  document.getElementById("marketplace").scrollIntoView({
    behavior: "smooth",
  });
});

// =====================================
// 9. REPAIR HUB GUIDES
// =====================================

const repairGuides = {
  electronics: {
    title: "Care for Old Electronics",
    description: "Basic maintenance can help electronic products last longer.",
    steps: [
      "Switch off and unplug the device before cleaning.",
      "Clean dust from the outside using a soft dry cloth.",
      "Check charging cables for visible damage.",
      "Keep electronic devices away from water and excessive heat.",
      "Ask a qualified technician to inspect internal electrical faults.",
    ],
    safety:
      "Do not open batteries, power supplies or electrical components unless you are trained.",
  },

  clothing: {
    title: "Repair Your Clothes",
    description:
      "Small clothing repairs can prevent wearable garments from becoming waste.",
    steps: [
      "Check the damaged area and identify the type of repair.",
      "Use a matching thread for small tears.",
      "Replace missing buttons with similar buttons.",
      "Repair loose seams with basic stitching.",
      "Wash and store clothes according to their care labels.",
    ],
    safety: "Handle needles and scissors carefully.",
  },

  furniture: {
    title: "Restore Old Furniture",
    description:
      "Simple maintenance can make furniture useful for a longer time.",
    steps: [
      "Inspect the furniture for loose screws or joints.",
      "Tighten loose screws using the correct tool.",
      "Clean the surface using a suitable cleaning cloth.",
      "Use appropriate wood polish for suitable wooden surfaces.",
      "Get unstable or seriously damaged furniture repaired by a professional.",
    ],
    safety: "Wear suitable protection when sanding or working with tools.",
  },
};

// Open repair guide modal

document.querySelectorAll(".guide-button").forEach(function (button) {
  button.addEventListener("click", function () {
    const guideKey = button.dataset.guide;

    const guide = repairGuides[guideKey];

    if (!guide) {
      return;
    }

    const guideModalContent = document.getElementById("guideModalContent");

    let stepsHTML = "";

    guide.steps.forEach(function (step) {
      stepsHTML += `<li>${escapeHTML(step)}</li>`;
    });

    guideModalContent.innerHTML = `
            <span class="eyebrow">REPAIR GUIDE</span>

            <h2>${escapeHTML(guide.title)}</h2>

            <p>${escapeHTML(guide.description)}</p>

            <h3>Step-by-step instructions</h3>

            <ul>${stepsHTML}</ul>

            <p><strong>Safety tip:</strong> ${escapeHTML(guide.safety)}</p>
        `;

    document.getElementById("guideModal").classList.remove("hidden");
  });
});

// Close repair modal

document
  .getElementById("closeGuideModal")
  .addEventListener("click", function () {
    document.getElementById("guideModal").classList.add("hidden");
  });

document
  .getElementById("guideModal")
  .addEventListener("click", function (event) {
    if (event.target.id === "guideModal") {
      document.getElementById("guideModal").classList.add("hidden");
    }
  });

// =====================================
// 10. COMMUNITY CHALLENGES
// =====================================

const challenges = [
  {
    id: "plastic",
    title: "7 Days Without Single-Use Plastic",
    description: "Avoid disposable plastic products for seven days.",
    icon: "◇",
    duration: "7 Days",
    target: 7,
  },

  {
    id: "reuse",
    title: "Reuse Instead of Buying New",
    description: "Find a new purpose for an item you already own.",
    icon: "↻",
    duration: "5 Tasks",
    target: 5,
  },

  {
    id: "repair",
    title: "Repair One Broken Item",
    description: "Repair a useful item instead of replacing it.",
    icon: "⌁",
    duration: "1 Task",
    target: 1,
  },

  {
    id: "books",
    title: "Donate Five Unused Books",
    description: "Share five readable books with people who need them.",
    icon: "▤",
    duration: "5 Books",
    target: 5,
  },

  {
    id: "waste",
    title: "Reduce Household Waste",
    description: "Follow five simple waste-reduction actions.",
    icon: "♧",
    duration: "5 Tasks",
    target: 5,
  },
];

function displayChallenges() {
  const challengeGrid = document.getElementById("challengeGrid");

  challengeGrid.innerHTML = "";

  challenges.forEach(function (challenge) {
    const progress = joinedChallenges[challenge.id] || 0;

    const percentage = Math.min((progress / challenge.target) * 100, 100);

    const isJoined = Object.prototype.hasOwnProperty.call(
      joinedChallenges,
      challenge.id,
    );

    const isCompleted = progress >= challenge.target;

    const card = document.createElement("div");

    card.className = "challenge-card";

    card.innerHTML = `

            <div class="challenge-top">
                <span class="challenge-icon">${challenge.icon}</span>
                <span class="challenge-duration">${challenge.duration}</span>
            </div>

            <h3>${challenge.title}</h3>

            <p>${challenge.description}</p>

            <div class="progress-label">
                <span>Your Progress</span>
                <span>${progress}/${challenge.target}</span>
            </div>

            <div class="progress-track">
                <div class="progress-fill" style="width: ${percentage}%"></div>
            </div>

            <div class="challenge-actions">

                <button
                    class="join-challenge"
                    data-id="${challenge.id}"
                    ${isJoined ? "disabled" : ""}>

                    ${isCompleted ? "Completed ✓" : isJoined ? "Joined ✓" : "Join Challenge"}

                </button>

                <button
                    class="update-progress"
                    data-id="${challenge.id}"
                    ${!isJoined || isCompleted ? "disabled" : ""}>

                    + Progress

                </button>

            </div>
        `;

    challengeGrid.appendChild(card);
  });
}

// Challenge button events

document
  .getElementById("challengeGrid")
  .addEventListener("click", function (event) {
    const button = event.target.closest("button");

    if (!button) {
      return;
    }

    const challengeId = button.dataset.id;

    const challenge = challenges.find(function (item) {
      return item.id === challengeId;
    });

    if (!challenge) {
      return;
    }

    // Join challenge

    if (button.classList.contains("join-challenge")) {
      if (Object.prototype.hasOwnProperty.call(joinedChallenges, challengeId)) {
        return;
      }

      joinedChallenges[challengeId] = 0;

      saveData("recircleChallenges", joinedChallenges);

      showToast("You joined the challenge!");

      displayChallenges();

      updateImpactDashboard();
    }

    // Update progress

    if (button.classList.contains("update-progress")) {
      if (joinedChallenges[challengeId] >= challenge.target) {
        return;
      }

      joinedChallenges[challengeId]++;

      saveData("recircleChallenges", joinedChallenges);

      if (joinedChallenges[challengeId] === challenge.target) {
        completedChallenges++;

        saveData("recircleCompleted", completedChallenges);

        showToast("Challenge completed! Great work!");
      } else {
        showToast("Your challenge progress was updated!");
      }

      displayChallenges();

      updateImpactDashboard();
    }
  });

// Initial challenge display

displayChallenges();

// =====================================
// 11. IMPACT DASHBOARD
// =====================================

function updateImpactDashboard() {
  const demoItems = 128;

  const demoWaste = 245;

  const demoMembers = 86;

  const demoChallenges = 42;

  const totalItems = demoItems + items.length - sampleItems.length;

  const totalChallenges = demoChallenges + completedChallenges;

  // The waste value is an illustrative estimate, not a verified measurement.
  const totalWaste = demoWaste;

  document.getElementById("homeItems").textContent = totalItems;

  document.getElementById("dashItems").textContent = totalItems;

  document.getElementById("homeWaste").textContent = totalWaste + " kg";

  document.getElementById("dashWaste").textContent = totalWaste + " kg";

  document.getElementById("homeMembers").textContent = demoMembers;

  document.getElementById("dashMembers").textContent = demoMembers;

  document.getElementById("homeChallenges").textContent = totalChallenges;

  document.getElementById("dashChallenges").textContent = totalChallenges;

  displayCategoryBars();
}

// Category-wise demo statistics

function displayCategoryBars() {
  const categories = [
    { name: "Books", percentage: 75 },

    { name: "Electronics", percentage: 45 },

    { name: "Clothing", percentage: 65 },

    { name: "Furniture", percentage: 55 },

    { name: "Household Items", percentage: 35 },
  ];

  const categoryBars = document.getElementById("categoryBars");

  categoryBars.innerHTML = "";

  categories.forEach(function (category) {
    const row = document.createElement("div");

    row.className = "category-row";

    row.innerHTML = `

            <div class="category-row-top">
                <span>${category.name}</span>
                <span>${category.percentage}%</span>
            </div>

            <div class="category-bar">
                <div class="category-bar-fill"
                     style="width: ${category.percentage}%">
                </div>
            </div>

        `;

    categoryBars.appendChild(row);
  });
}

// Initial dashboard display

updateImpactDashboard();

// =====================================
// 12. SMART SUSTAINABILITY ASSISTANT
// =====================================

// Predefined recommendation database

const recommendations = {
  laptop: {
    reuse:
      "If the laptop still works, consider using it for learning, browsing or basic office work. You may also donate it to a student.",
    repair:
      "A technician may be able to replace a damaged battery, keyboard or storage drive.",
    recycle:
      "If it cannot be repaired, use an authorised e-waste collection or recycling facility.",
    extra:
      "Back up your data and securely erase personal information before sharing or recycling it.",
  },

  bottle: {
    reuse:
      "Use a clean and safe reusable bottle for storing water or other suitable items.",
    repair:
      "If the cap is damaged, consider replacing the cap instead of discarding the entire bottle.",
    recycle:
      "Check the material and local recycling instructions before recycling it.",
    extra:
      "Avoid reusing containers that are not designed for repeated food or drink storage.",
  },

  chair: {
    reuse:
      "A usable chair can be donated or reused in a study room, garden or workspace.",
    repair: "Loose screws, joints or minor surface damage may be repairable.",
    recycle:
      "If it cannot be repaired, separate recyclable materials where possible and check local disposal guidance.",
    extra: "Do not use an unstable chair until it has been repaired.",
  },

  clothes: {
    reuse:
      "Donate wearable clothes or exchange them with friends and community members.",
    repair:
      "Small tears, loose buttons and damaged seams can often be repaired with basic stitching.",
    recycle:
      "Very damaged textiles may be accepted by textile recycling programmes.",
    extra: "Wash and store clothes properly to help them last longer.",
  },

  books: {
    reuse:
      "Share books with friends, donate them or exchange them with other readers.",
    repair:
      "Loose pages and damaged covers may be repaired carefully using suitable book-repair materials.",
    recycle:
      "If a book is beyond use, check whether its paper can be recycled. Separate unsuitable covers if required.",
    extra: "Keep books dry and away from direct moisture.",
  },

  furniture: {
    reuse:
      "Pass useful furniture to someone who needs it or give it a new purpose at home.",
    repair: "Loose joints, screws and minor surface damage may be repairable.",
    recycle:
      "Separate materials where possible and check suitable local recycling options.",
    extra: "Get unstable furniture repaired before using it.",
  },

  mobile: {
    reuse:
      "A working old mobile phone can be used as a music player, learning device or backup phone.",
    repair:
      "A technician may be able to replace a damaged screen, charging port or battery.",
    recycle:
      "If the phone is unusable, send it to an authorised e-waste collection facility.",
    extra:
      "Remove your SIM card and securely erase your personal data before donating or recycling it.",
  },
};

// Find a matching recommendation

function getRecommendation(userItem) {
  const text = userItem.toLowerCase();

  if (
    text.includes("laptop") ||
    text.includes("computer") ||
    text.includes("pc")
  ) {
    return recommendations.laptop;
  }

  if (text.includes("bottle") || text.includes("plastic")) {
    return recommendations.bottle;
  }

  if (text.includes("chair") || text.includes("table")) {
    return recommendations.chair;
  }

  if (
    text.includes("cloth") ||
    text.includes("shirt") ||
    text.includes("dress") ||
    text.includes("jeans")
  ) {
    return recommendations.clothes;
  }

  if (text.includes("book") || text.includes("notebook")) {
    return recommendations.books;
  }

  if (
    text.includes("furniture") ||
    text.includes("sofa") ||
    text.includes("shelf")
  ) {
    return recommendations.furniture;
  }

  if (text.includes("mobile") || text.includes("phone")) {
    return recommendations.mobile;
  }

  // Default recommendation for unknown items

  return {
    reuse:
      "Think about whether this item can be used for another purpose or shared with someone else.",

    repair:
      "Check whether the item has a small problem that can be repaired safely.",

    recycle:
      "Identify the material and check suitable recycling options in your area.",

    extra: "Try to extend the item's life before deciding to replace it.",
  };
}

// Add assistant message to chat

function addAssistantMessage(message, className) {
  const chat = document.getElementById("assistantChat");

  const messageElement = document.createElement("div");

  messageElement.className = className;

  messageElement.textContent = message;

  chat.appendChild(messageElement);

  chat.scrollTop = chat.scrollHeight;
}

// Assistant form event

document
  .getElementById("assistantForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const input = document.getElementById("assistantInput");

    const userItem = input.value.trim();

    if (!userItem) {
      return;
    }

    // Display user message

    addAssistantMessage(userItem, "user-message");

    // Generate recommendations

    const result = getRecommendation(userItem);

    // Display assistant response

    const response =
      "Here are some ideas for your " +
      userItem +
      ":\n\n" +
      "REUSE:\n" +
      result.reuse +
      "\n\n" +
      "REPAIR:\n" +
      result.repair +
      "\n\n" +
      "RECYCLE:\n" +
      result.recycle +
      "\n\n" +
      "EXTRA TIP:\n" +
      result.extra;

    addAssistantMessage(response, "bot-message");

    input.value = "";
  });

// =====================================
// 13. INITIAL PAGE SETUP
// =====================================

document.addEventListener("DOMContentLoaded", function () {
  displayItems(items);

  displayChallenges();

  updateImpactDashboard();

  console.log("ReCircle website loaded successfully!");
});
