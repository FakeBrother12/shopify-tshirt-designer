// Theme extension launcher. The app proxy URL is same-origin and does not expose Admin API credentials.
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".tshirt-customizer").forEach((node) => {
    const button = node.querySelector("a");
    if (!button) return;
    button.addEventListener("click", (event) => {
      // Navigation is intentionally used until the hosted designer UI is configured.
    });
  });
});
