 const appEnums = {
     RECEIPT: {
         NODATA: 'receipt.nodata',
         OK: 'receipt.ok',
         FILECREATED: 'receipt.filecreated'
     },
     Email: {
          SENT: 'email.sent',
          NOTSENT: 'email.notsent',
          ERROR: 'email.error' 
     },
     EXPORTRECEIPTS: {
        EMAIL: 'email',
        PDF: 'pdf',
        CSV: 'csv',
        
     },
     MODULETYPE: {
        QUOTE: 'quote',
        Invoice: 'invoice',
        Order: 'order',
        Delivery: 'delivery'
     }
}

module.exports = {
    appEnums
};