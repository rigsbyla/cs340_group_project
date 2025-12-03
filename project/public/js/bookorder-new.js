let bookCounter = 1;

// Add another book to the order
document.getElementById('add_book_btn').addEventListener('click', function() {
    bookCounter++;
    
    const booksContainer = document.getElementById('books_selected');
    const firstBookItem = document.querySelector('.book_item');
    const newBookItem = firstBookItem.cloneNode(true);
    
    // Clear the select and input values
    const select = newBookItem.querySelector('select');
    const input = newBookItem.querySelector('input[type="number"]');
    const removeBtn = newBookItem.querySelector('.remove_book_btn');
    
    select.selectedIndex = 0; // Reset to "Select a Book"
    input.value = 1; // Reset quantity to 1
    removeBtn.style.display = 'inline'; // Show remove button
    
    booksContainer.appendChild(newBookItem);
});

// Auto-calculate due date based on order date
document.addEventListener("DOMContentLoaded", () => {
  const orderDateInput = document.getElementById("order_date");
  const dueDateInput = document.getElementById("due_date");


  function formatDateToInput(d) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function updateDueDate() {
    if (!orderDateInput.value) {
      dueDateInput.value = "";
      return;
    }

    const orderDate = new Date(orderDateInput.value);
    if (isNaN(orderDate)) return;
    orderDate.setDate(orderDate.getDate() + 14);
    dueDateInput.value = formatDateToInput(orderDate);
  }

  // Default order date to today when page loads
  if (!orderDateInput.value) {
    const today = new Date();
    orderDateInput.value = formatDateToInput(today);
  }
  updateDueDate();

  // Recalculate whenever order date changes
  orderDateInput.addEventListener("change", updateDueDate);
});


// Remove book item (event delegation for dynamically added buttons)
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('remove_book_btn')) {
        e.target.closest('.book_item').remove();
    }
});

// Submit form
document.getElementById('create_new_order').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    
    // Convert FormData to JSON
    const data = {
        member_id: formData.get('member_id'),
        order_date: formData.get('order_date'),
        due_date: formData.get('due_date'),
        book_id: formData.getAll('book_id[]'),
        quantity: formData.getAll('quantity[]')
    };
    
    try {
        const response = await fetch('/bookorders-new', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            alert('Order created successfully!');
            window.location.href = '/order-details'; // Redirect to orders page
        } else {
            const error = await response.json();
            alert('Error creating order: ' + (error.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error creating order. Check console for details.');
    }
});
