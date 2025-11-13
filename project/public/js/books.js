// Increase book quantity
document.querySelectorAll('.increase_quantity').forEach(button => {
    button.addEventListener('click', async function() { 
        const bookId = this.getAttribute('data-book-id');
        let quantity = parseInt(this.getAttribute('data-quantity'));
        quantity += 1;
        
        try { 
            const response = await fetch('/books-update-quantity', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify({ book_id: bookId, quantity: quantity })
            });
            

            if (response.ok) {
                document.getElementById(`quantity_${bookId}`).innerText = quantity;
                this.setAttribute('data-quantity', quantity);
                
                document.querySelector(`.decrease_quantity[data-book-id='${bookId}']`).setAttribute('data-quantity', quantity);
            } 
            else {
                alert('Error updating quantity'); 
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error updating quantity');
        }
    });
});

// Decrease book quantity
document.querySelectorAll('.decrease_quantity').forEach(button => {
    button.addEventListener('click', async function() { 
        const bookId = this.getAttribute('data-book-id');
        let quantity = parseInt(this.getAttribute('data-quantity'));
        
        if (quantity <= 0) { 
            alert('Quantity cannot be less than 0');
            return;
        }
        
        quantity -= 1;
        
        try { 
            const response = await fetch('/books-update-quantity', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify({ book_id: bookId, quantity: quantity })
            });
            
            if (response.ok) {
                document.getElementById(`quantity_${bookId}`).innerText = quantity;
                this.setAttribute('data-quantity', quantity);
                document.querySelector(`.increase_quantity[data-book-id='${bookId}']`).setAttribute('data-quantity', quantity);
            }
            else {
                alert('Error updating quantity');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error updating quantity');
        }
    });
}); 