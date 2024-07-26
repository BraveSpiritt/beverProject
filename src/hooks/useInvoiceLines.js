export const fetchInvoiceLines = async () => {
    const response = await fetch('https://bever-aca-assignment.azurewebsites.net/invoicelines');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };
  
  