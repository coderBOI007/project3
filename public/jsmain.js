// Main application JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Auto-hide flash messages after 5 seconds
    autoHideFlashMessages();
    
    // Initialize any tooltips or interactive elements
    initInteractiveElements();
    
    // Add form validation enhancements
    enhanceFormValidation();
}

function autoHideFlashMessages() {
    const flashMessages = document.querySelectorAll('.alert');
    flashMessages.forEach(message => {
        setTimeout(() => {
            message.style.opacity = '0';
            message.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                if (message.parentNode) {
                    message.parentNode.removeChild(message);
                }
            }, 500);
        }, 5000);
    });
}

function initInteractiveElements() {
    // Add loading states to buttons
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function() {
            const submitButton = this.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.innerHTML = 'Loading...';
                
                // Re-enable button after 5 seconds in case of error
                setTimeout(() => {
                    submitButton.disabled = false;
                    submitButton.innerHTML = submitButton.getAttribute('data-original-text') || 'Submit';
                }, 5000);
            }
        });
    });
}

function enhanceFormValidation() {
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    passwordInputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value.length < 6) {
                this.setCustomValidity('Password must be at least 6 characters long');
            } else {
                this.setCustomValidity('');
            }
        });
    });
}

// Utility functions
const TodoApp = {
    // Show notification
    showNotification: function(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert ${type}`;
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.zIndex = '1000';
        notification.style.maxWidth = '300px';
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    },
    
    // Format date for display
    formatDate: function(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },
    
    // Debounce function for search inputs
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};