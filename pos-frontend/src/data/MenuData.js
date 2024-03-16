function getMenuData() {
    return [
        { id: 1, name: 'Items', type:'CONF', url: '/items' },
        { id: 2, name: 'Categories/Types', type:'CONF', url: '/categories' },
        { id: 3, name: 'Suppliers', type:'CONF', url: '/stake/SUP' },
        { id: 4, name: 'Customers', type:'CONF', url: '/stake/CUS' },
        { id: 5, name: 'VAT', type:'CONF', url: '/VAT' },
        { id: 6, name: 'Petty Cash', type:'CONF', url: '/PettyCash' },
        { id: 7, name: 'Main Expenses', type:'CONF', url: '/MainExpenses' },
        { id: 8, name: 'Purchase Order', type:'BUY', url: '/PurchaseOrder' },
        { id: 9, name: 'GRN', type:'BUY', url: '/GRN' },
        { id: 10, name: 'Purchase Return', type:'BUY', url: '/PurchaseReturn' },
        { id: 11, name: 'Invoice', type:'SELL', url: '/Invoice' },
        { id: 12, name: 'Item Request', type:'SELL', url: '/ItemRequest' },
        { id: 13, name: 'Item return', type:'SELL', url: '/ItemReturn' },
        { id: 14, name: 'Receipts', type:'PAY', url: '/Receipts' },
        { id: 15, name: 'Supplier Payments', type:'PAY', url: '/SupplierPayments' },
        { id: 16, name: 'Set Off', type:'PAY', url: '/SetOff' },
        { id: 17, name: 'Main Expenses', type:'PAY', url: '/MainExpenses' },
        { id: 18, name: 'Create Report', type:'STCR', url: '/CreateReport' },
        { id: 19, name: 'View/Print Report', type:'STCR', url: '/View/PrintReport' },
        { id: 20, name: 'Edit Changes', type:'STCR', url: '/EditChanges' },
        { id: 21, name: 'History & Posting', type:'STCR', url: '/History&Posting' },
        { id: 22, name: 'Report', type:'REP', url: '/Report' },
        { id: 23, name: 'Settings', type:'SET', url: '/Settings' },
        { id: 24, name: 'Petty Cash', type:'PET', url: '/PettyCash' }
    ];
}

export default getMenuData;