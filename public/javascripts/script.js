
setTimeout(() => {
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');

    if (successMessage) {
        successMessage.classList.add('opacity-0', 'translate-y-5'); // Add translate-y-5 for slide down effect
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 500); // Matches the transition duration (500ms)
    }
    if (errorMessage) {
        errorMessage.classList.add('opacity-0', 'translate-y-5'); // Add translate-y-5 for slide down effect
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 500); // Matches the transition duration (500ms)
    }
}, 3000); // 3 seconds before fade out
document.addEventListener("DOMContentLoaded", function () {
 window.toggleLike = function (productId) {
        window.location.href = `/like/${productId}`;
    };

    const dropdownButton = document.getElementById('profileDropdown');
    const dropdownMenu = document.getElementById('dropdownMenu');

    if (dropdownButton && dropdownMenu) {
        dropdownButton.addEventListener('click', function (event) {
            event.stopPropagation(); // Prevent the click from bubbling up
            dropdownMenu.classList.toggle('hidden');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function (event) {
            if (!dropdownButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
                dropdownMenu.classList.add('hidden');
            }
        });
    }

    // Function to open the modal
    function openModal(productId) {
        console.log('CLICKED');
        console.log('ID', productId);

        const modal = document.getElementById('deleteModal');
        const modalContent = document.getElementById('modalContent');

        // Make the modal visible
        modal.classList.remove('invisible');
        modal.classList.add('opacity-100');

        // Animate the modal to the center of the page
        modalContent.classList.remove('-translate-y-full');
        modalContent.classList.add('translate-y-0');

        const deleteButton = document.getElementById('deleteButton');
        deleteButton.onclick = function () {
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = `/cart/delete/${productId}`;

            document.body.appendChild(form);
            form.submit();
        };
    }

    function closeModal() {
        const modal = document.getElementById('deleteModal');
        const modalContent = document.getElementById('modalContent');

        // Animate the modal out of the screen
        modalContent.classList.add('-translate-y-full');
        modalContent.classList.remove('translate-y-0');
        setTimeout(() => {
            modal.classList.add('invisible');
            modal.classList.remove('opacity-100');
        }, 300); // Match this duration with the CSS transition duration
    }

    window.openModal = openModal;
    window.closeModal = closeModal;


    function deleteAllProductopen() {
        console.log('Admin open CLICKED');

        const modal = document.getElementById('deleteModal');
        const modalContent = document.getElementById('modalContent');

        modal.classList.remove('invisible');
        modal.classList.add('opacity-100');
        modalContent.classList.remove('-translate-y-full');
        modalContent.classList.add('translate-y-0');

        // Set up the delete button action
        const deleteButton = document.getElementById('deleteButton');
        deleteButton.onclick = function () {
            window.location.href = '/delete';
        };
    }

    function deleteAllProductclose() {
        const modal = document.getElementById('deleteModal');
        const modalContent = document.getElementById('modalContent');
        modalContent.classList.add('-translate-y-full');
        modalContent.classList.remove('translate-y-0');
        setTimeout(() => {
            modal.classList.add('invisible');
            modal.classList.remove('opacity-100');
        }, 300); // Match this duration with the CSS transition duration
    }

    window.deleteAllProductopen = deleteAllProductopen;
    window.deleteAllProductclose = deleteAllProductclose;
});


