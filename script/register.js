let currentStep = 1;
let schools = [];
let filteredSchools = [];
let internetSearchResults = [];
let isSearching = false;
let searchTimeout = null;

// API Configuration
const API_ENDPOINT = "https://twikform-api.vercel.app/api/submit-form";

// Local Nigerian universities as fallback
const localNigerianUniversities = [
  "University of Lagos",
  "University of Ibadan",
  "University of Nigeria, Nsukka",
  "Obafemi Awolowo University",
  "Covenant University",
  "University of Benin",
  "Ahmadu Bello University",
  "University of Ilorin",
  "University of Port Harcourt",
  "Federal University of Technology, Akure",
  "Lagos State University",
  "University of Calabar",
  "Nnamdi Azikiwe University",
  "University of Maiduguri",
  "Bayero University Kano",
  "Other Institution",
];

// Initialize the enhanced dropdown
function initializeEnhancedDropdown() {
  const dropdownHeader = document.getElementById("dropdownHeader");
  const dropdownOptions = document.getElementById("dropdownOptions");
  const dropdownBackdrop = document.getElementById("dropdownBackdrop");
  const searchInput = document.getElementById("institutionSearch");
  const clearSearchBtn = document.getElementById("clearSearch");
  const optionsList = document.getElementById("dropdownOptionsList");
  const hiddenInput = document.getElementById("institution");
  const placeholder = document.getElementById("dropdownPlaceholder");

  let isOpen = false;

  // Load local schools initially
  schools = [...localNigerianUniversities];
  filteredSchools = [...schools];
  renderOptions();

  function toggleDropdown() {
    isOpen = !isOpen;
    dropdownOptions.classList.toggle("open", isOpen);
    dropdownBackdrop.classList.toggle("open", isOpen);
    dropdownHeader
      .querySelector(".dropdown-arrow")
      .classList.toggle("open", isOpen);

    if (isOpen) {
      searchInput.focus();
      searchInput.value = "";
      filterSchools("");
    } else {
      internetSearchResults = [];
      isSearching = false;
    }
  }

  function selectOption(institutionName, isInternetResult = false) {
    hiddenInput.value = institutionName;
    placeholder.textContent = institutionName;
    placeholder.classList.remove("dropdown-placeholder");
    dropdownHeader.classList.remove("error");
    document.getElementById("institutionError").classList.remove("show");

    // If it's an internet result, add to local schools for future use
    if (isInternetResult && !schools.includes(institutionName)) {
      schools.unshift(institutionName);
      filteredSchools.unshift(institutionName);
    }

    toggleDropdown();
    updateInstitutionCount();
  }

  function filterSchools(searchTerm) {
    const term = searchTerm.toLowerCase().trim();

    // Filter local schools
    filteredSchools = term
      ? schools.filter((school) => school.toLowerCase().includes(term))
      : schools;

    // Clear previous search
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Show loading for internet search
    if (term.length > 2) {
      isSearching = true;
      renderOptions();

      // Debounced internet search
      searchTimeout = setTimeout(() => {
        searchInternetInstitutions(term);
      }, 500);
    } else {
      internetSearchResults = [];
      isSearching = false;
      renderOptions();
    }
  }

  async function searchInternetInstitutions(searchTerm) {
    try {
      // Using CORS proxy to avoid CORS issues
      const response = await fetch(
        `https://corsproxy.io/?http://universities.hipolabs.com/search?name=${encodeURIComponent(
          searchTerm
        )}&limit=5`
      );

      if (response.ok) {
        const institutions = await response.json();
        internetSearchResults = institutions.slice(0, 5);
        internetSearchResults = institutions.slice(0, 5); // Limit to 5 results
      } else {
        internetSearchResults = [];
      }
    } catch (error) {
      console.error("Internet search failed:", error);
      internetSearchResults = [];
    } finally {
      isSearching = false;
      renderOptions();
    }
  }

  function renderOptions() {
    let html = "";

    // Local options
    if (filteredSchools.length > 0) {
      html += filteredSchools
        .map(
          (school) => `
                <div class="dropdown-option local" data-value="${school}">
                    <span>${school}</span>
                    ${
                      hiddenInput.value === school
                        ? '<span class="check-icon">✓</span>'
                        : ""
                    }
                </div>
            `
        )
        .join("");
    }

    // Internet search results
    if (internetSearchResults.length > 0) {
      if (html) html += '<div class="section-divider">Online Results</div>';

      html += internetSearchResults
        .map(
          (institution) => `
                <div class="dropdown-option internet" data-value="${
                  institution.name
                }">
                    <span class="internet-icon">🌐</span>
                    <div class="internet-details">
                        <div class="internet-name">${institution.name}</div>
                        <div class="internet-meta">
                            ${institution.country || "Nigeria"}
                            ${
                              institution.domains && institution.domains[0]
                                ? ` • ${institution.domains[0]}`
                                : ""
                            }
                        </div>
                    </div>
                </div>
            `
        )
        .join("");
    }

    // Loading state
    if (isSearching) {
      html +=
        '<div class="loading-options"><span class="loading-spinner-small"></span> Searching online...</div>';
    }

    // No results
    if (!html && !isSearching) {
      html =
        '<div class="no-results">No institutions found. Try a different search.</div>';
    }

    optionsList.innerHTML = html;

    // Add click listeners
    optionsList.querySelectorAll(".dropdown-option").forEach((option) => {
      option.addEventListener("click", () => {
        const institutionName = option.getAttribute("data-value");
        const isInternetResult = option.classList.contains("internet");
        selectOption(institutionName, isInternetResult);
      });
    });
  }

  // Event listeners
  dropdownHeader.addEventListener("click", toggleDropdown);
  dropdownBackdrop.addEventListener("click", toggleDropdown);

  searchInput.addEventListener("input", (e) => {
    filterSchools(e.target.value);
    clearSearchBtn.style.display = e.target.value ? "block" : "none";
  });

  clearSearchBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    searchInput.value = "";
    clearSearchBtn.style.display = "none";
    filterSchools("");
    searchInput.focus();
  });

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      toggleDropdown();
    }
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (
      !dropdownHeader.contains(e.target) &&
      !dropdownOptions.contains(e.target)
    ) {
      isOpen = false;
      dropdownOptions.classList.remove("open");
      dropdownBackdrop.classList.remove("open");
      dropdownHeader.querySelector(".dropdown-arrow").classList.remove("open");
    }
  });
}

function updateInstitutionCount() {
  const institutionCount = document.getElementById("institutionCount");
  const selectedInstitution = document.getElementById("institution").value;

  if (selectedInstitution) {
    institutionCount.textContent = `Selected: ${selectedInstitution}`;
  } else {
    institutionCount.textContent =
      "Type to search local and online institutions";
  }
}

// Update progress function
function updateProgress() {
  // Update progress line
  const progressLine = document.getElementById("progressLine");
  const width = ((currentStep - 1) / 2) * 80;
  progressLine.style.width = width + "%";

  // Update step indicators
  for (let i = 1; i <= 3; i++) {
    const stepElement = document.getElementById(`progressStep${i}`);
    stepElement.classList.remove("active", "completed");

    if (i < currentStep) {
      stepElement.classList.add("completed");
    } else if (i === currentStep) {
      stepElement.classList.add("active");
    }
  }

  // Show/hide step cards
  document.querySelectorAll(".step-card").forEach((card) => {
    card.classList.remove("active");
  });

  const currentCard = document.getElementById(`step${currentStep}Card`);
  if (currentCard) {
    currentCard.classList.add("active");
  }

  // Show completion card if all steps done
  if (currentStep > 3) {
    document.getElementById("completionCard").style.display = "block";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function openRegistrationLink() {
  window.open(
    "https://gemini.google/students/?utm_source=Uber&utm_medium=paid_media&utm_campaign=students_shortlink_social-uk",
    "_blank"
  );
}

function completeStep(step) {
  const successMessage = document.getElementById(`successMessage${step}`);
  successMessage.classList.add("show");

  setTimeout(() => {
    currentStep = step + 1;
    updateProgress();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, 1500);
}

function joinWhatsAppGroup() {
  window.open(
    "https://chat.whatsapp.com/ED5LYFjaipGIhi0eSjNotP?mode=ems_copy_t",
    "_blank"
  );
}

// Form Validation and Submission
const form = document.getElementById("registrationForm");
const submitBtn = document.getElementById("submitBtn");
const submitBtnText = document.getElementById("submitBtnText");
const submitBtnIcon = document.getElementById("submitBtnIcon");
const errorAlert = document.getElementById("formErrorAlert");
const errorMessage = document.getElementById("formErrorMessage");

// Updated fields array to include institution as select
const fields = ["fullName", "email", "phone", "institution", "course", "level"];

fields.forEach((fieldName) => {
  const field = document.getElementById(fieldName);
  const errorDiv = document.getElementById(`${fieldName}Error`);

  if (field && errorDiv) {
    field.addEventListener("blur", () => {
      validateField(field, errorDiv);
    });

    field.addEventListener("input", () => {
      if (field.classList.contains("error")) {
        field.classList.remove("error");
        errorDiv.classList.remove("show");
      }
    });

    // For select elements, also validate on change
    if (field.tagName === "SELECT") {
      field.addEventListener("change", () => {
        validateField(field, errorDiv);
      });
    }
  }
});

function validateField(field, errorDiv) {
  if (field.id === "institution") {
    // Custom validation for hidden institution input
    if (!field.value.trim()) {
      document.getElementById("dropdownHeader").classList.add("error");
      errorDiv.classList.add("show");
      return false;
    }
    document.getElementById("dropdownHeader").classList.remove("error");
    errorDiv.classList.remove("show");
    return true;
  }

  // Existing validation for other fields
  if (!field.value.trim()) {
    field.classList.add("error");
    errorDiv.classList.add("show");
    return false;
  }

  // Email validation
  if (field.type === "email") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(field.value)) {
      field.classList.add("error");
      errorDiv.textContent = "Please enter a valid email address";
      errorDiv.classList.add("show");
      return false;
    }
  }

  // Phone validation
  if (field.name === "phone") {
    const phoneRegex = /^[\d\s+()-]+$/;
    if (
      !phoneRegex.test(field.value) ||
      field.value.replace(/\D/g, "").length < 10
    ) {
      field.classList.add("error");
      errorDiv.textContent = "Please enter a valid phone number";
      errorDiv.classList.add("show");
      return false;
    }
  }

  field.classList.remove("error");
  errorDiv.classList.remove("show");
  return true;
}

function validateForm() {
  let isValid = true;

  fields.forEach((fieldName) => {
    const field = document.getElementById(fieldName);
    const errorDiv = document.getElementById(`${fieldName}Error`);

    if (field && errorDiv) {
      if (!validateField(field, errorDiv)) {
        isValid = false;
      }
    }
  });

  return isValid;
}

// Form submission
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Hide any previous error alerts
  errorAlert.classList.remove("show");

  // Validate form
  if (!validateForm()) {
    window.scrollTo({
      top: form.offsetTop - 100,
      behavior: "smooth",
    });
    return;
  }

  // Prepare form data
  const formData = {
    fullName: document.getElementById("fullName").value.trim(),
    email: document.getElementById("email").value.trim(),
    institution: document.getElementById("institution").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    course: document.getElementById("course").value.trim(),
    level: document.getElementById("level").value,
  };

  // Disable submit button and show loading
  submitBtn.disabled = true;
  submitBtnText.textContent = "Submitting...";
  submitBtnIcon.innerHTML = '<span class="loading-spinner"></span>';

  try {
    console.log("Submitting to:", API_ENDPOINT);
    console.log("Form data:", formData);

    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(formData),
    });

    console.log("Response status:", response.status);
    console.log("Response ok:", response.ok);

    // Try to parse response as JSON
    let data;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
      console.log("Response data:", data);
    } else {
      const text = await response.text();
      console.log("Response text:", text);
      data = { message: text };
    }

    if (response.ok || response.status === 201) {
      // Success - show success message and move to next step
      console.log("Submission successful!");
      form.reset();
      completeStep(1);
    } else {
      // Error from server
      console.error("Server error:", data);
      throw new Error(
        data.message || data.error || `Server returned ${response.status}`
      );
    }
  } catch (error) {
    console.error("Submission error:", error);

    // Determine error message
    let displayMessage = "Something went wrong. Please try again.";

    if (error.message === "Failed to fetch") {
      displayMessage =
        "Unable to connect to server. Please check your internet connection and try again.";
    } else if (error.message.includes("CORS")) {
      displayMessage =
        "Connection blocked by security policy. Please contact support.";
    } else if (error.message) {
      displayMessage = error.message;
    }

    // Show error alert
    errorMessage.textContent = displayMessage;
    errorAlert.classList.add("show");

    // Scroll to error
    window.scrollTo({
      top: errorAlert.offsetTop - 100,
      behavior: "smooth",
    });
  } finally {
    // Re-enable submit button
    submitBtn.disabled = false;
    submitBtnText.textContent = "Submit Registration";
    submitBtnIcon.textContent = "→";
  }
});

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  initializeEnhancedDropdown();
  updateProgress();
});
