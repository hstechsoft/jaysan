function displayElementIds() {
    // Recursive function to traverse the DOM and display IDs
    function traverseElement(element) {
        // Check if the element has an ID
        if (element.id) {
            // Create a span to show the ID next to the element
            const idLabel = document.createElement('span');
            idLabel.textContent = ` (#${element.id})`;
            idLabel.style.color = 'red'; // Style the ID label
            idLabel.style.fontSize = '12px';
            idLabel.style.marginLeft = '5px';
            idLabel.style.cursor = 'text'; // Change cursor to indicate text selection

            // Allow the ID label to be selectable and prevent it from blocking other actions
            idLabel.addEventListener('click', function (event) {
                event.stopPropagation(); // Prevent click events from affecting the rest of the page
                event.preventDefault(); // Allow selecting text without triggering other events
            });

            // Append the ID label to the element, ensuring it doesn't disrupt the layout
            if (
                element.tagName.toLowerCase() === 'input' ||
                element.tagName.toLowerCase() === 'select' ||
                element.tagName.toLowerCase() === 'textarea' ||
                element.tagName.toLowerCase() === 'button'
            ) {
                // For input, select, textarea, and button, place the label after the element
                element.parentNode.insertBefore(idLabel, element.nextSibling);
            } else {
                // For other elements, append the label inside
                element.appendChild(idLabel);
            }
        }

        // Recursively traverse child nodes
        Array.from(element.children).forEach((child) => traverseElement(child));
    }

    // Start traversing from the body element
    traverseElement(document.body);
}

// Function to disable click actions on all elements except the ID labels
function disableAllClicks() {
    document.addEventListener(
        'click',
        function (event) {
            // Allow clicks on ID labels and prevent them only on other elements
            if (!event.target.matches('span')) {
                event.preventDefault(); // Prevent default click actions
                event.stopPropagation(); // Stop the click event from propagating
            }
        },
        true // Use capture phase to catch clicks on all elements
    );
}

// Run the functions when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    displayElementIds();
    // disableAllClicks();
});