function addItem() {
    const container = document.getElementById('itemsContainer');
    const itemHTML = `
        <div class="item">
            <input type="text" class="itemName" placeholder="Item Name" required>
            <input type="number" class="itemQuantity" placeholder="Quantity" required>
            <input type="number" class="itemPrice" placeholder="Price (₹)" required>
            <input type="number" class="itemTax" placeholder="Tax (%)" required>
            <button type="button" onclick="this.parentElement.remove()">Remove</button>
        </div>`;
    container.insertAdjacentHTML('beforeend', itemHTML);
}

document.getElementById('invoiceForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Update invoice details
    document.getElementById('displayCompanyName').textContent = document.getElementById('companyName').value;
    document.getElementById('displayCompanyAddress').textContent = document.getElementById('companyAddress').value;
    document.getElementById('displayCompanyContact').textContent = document.getElementById('companyContact').value;
    document.getElementById('displayCompanyGST').textContent = document.getElementById('companyGST').value;
    document.getElementById('displayCustomerName').textContent = document.getElementById('customerName').value;
    document.getElementById('displayCustomerAddress').textContent = document.getElementById('customerAddress').value;
    document.getElementById('displayEmail').textContent = document.getElementById('customerEmail').value;
    document.getElementById('displayDate').textContent = document.getElementById('invoiceDate').value;
    document.getElementById('displayInvoiceNumber').textContent = `Invoice #: ${document.getElementById('invoiceNumber').value}`;

    const items = document.querySelectorAll('.item');
    const invoiceItems = document.getElementById('invoiceItems');
    invoiceItems.innerHTML = '';
    let total = 0, totalTax = 0;

    items.forEach(item => {
        const name = item.querySelector('.itemName').value;
        const quantity = parseFloat(item.querySelector('.itemQuantity').value);
        const price = parseFloat(item.querySelector('.itemPrice').value);
        const tax = parseFloat(item.querySelector('.itemTax').value || 0);
        const amount = quantity * price;
        const taxAmount = (tax / 100) * amount;

        total += amount;
        totalTax += taxAmount;

        const row = `
            <tr>
                <td>${name}</td>
                <td>${quantity}</td>
                <td>₹${price.toFixed(2)}</td>
                <td>${tax}%</td>
                <td>₹${amount.toFixed(2)}</td>
            </tr>`;
        invoiceItems.insertAdjacentHTML('beforeend', row);
    });

    const discount = parseFloat(document.getElementById('discount').value || 0);
    const discountAmount = (discount / 100) * total;
    const grandTotal = total + totalTax - discountAmount;

    document.getElementById('totalAmount').textContent = `₹${total.toFixed(2)}`;
    document.getElementById('totalTax').textContent = `₹${totalTax.toFixed(2)}`;
    document.getElementById('discountAmount').textContent = `₹${discountAmount.toFixed(2)}`;
    document.getElementById('grandTotal').textContent = `₹${grandTotal.toFixed(2)}`;

    document.getElementById('invoice').style.display = 'block';
    document.getElementById('downloadButton').style.display = 'block';
    document.getElementById('printButton').style.display = 'block';
});

function downloadInvoice() {
    const element = document.getElementById('invoice');
    html2pdf().from(element).set({
        margin: 1,
        filename: 'invoice.pdf',
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    }).save();
}

function printInvoice() {
    const element = document.getElementById('invoice');
    html2pdf().from(element).set({
        margin: 1,
        filename: 'invoice.pdf',
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    }).outputPdf('blob').then(function (pdfBlob) {
        const pdfUrl = URL.createObjectURL(pdfBlob);
        const printWindow = window.open(pdfUrl);
        printWindow.addEventListener('load', function () {
            printWindow.print();
        });
    });
}

