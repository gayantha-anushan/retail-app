class Common{
static discounting(total,discount){
    if(discount == ""){
      return total;
    }else{
        if(discount.indexOf("%") > -1){
          var m = discount.split("%")
          var x = Number(m[0])
          return total - total*(x /100);
        }else{
          var xi = Number(discount)
          return total - xi;
        }
    }
  }

static getPosMenu(filter){
  var itemList = [
    {
      title:"Item Management",
      route:"/items",
      menu:1,
      icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_6_12113)"><path d="M4 14H8V10H4V14ZM4 19H8V15H4V19ZM4 9H8V5H4V9ZM9 14H21V10H9V14ZM9 19H21V15H9V19ZM9 5V9H21V5H9Z" fill="#323232"/></g><defs><clipPath id="clip0_6_12113"><rect width="24" height="24" fill="white"/></clipPath></defs></svg>'
    },{
      title:"Categories and types",
      route:'/categories',
      menu:1,
      icon:'<svg class="w-6 h-6 text-gray-200 flex-shrink-0 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition duration-75" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_17_20270)"><path d="M12 2L6.5 11H17.5L12 2Z" fill="#323232"/><path d="M17.5 22C19.9853 22 22 19.9853 22 17.5C22 15.0147 19.9853 13 17.5 13C15.0147 13 13 15.0147 13 17.5C13 19.9853 15.0147 22 17.5 22Z" fill="#323232"/><path d="M3 13.5H11V21.5H3V13.5Z" fill="#323232"/></g><defs><clipPath id="clip0_17_20270"><rect width="24" height="24" fill="white"/></clipPath></defs></svg>'
    },{
      title:"Customers",
      route:'/stake/cus',
      menu:1,
      icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_6_15991)"><path d="M9 12C10.93 12 12.5 10.43 12.5 8.5C12.5 6.57 10.93 5 9 5C7.07 5 5.5 6.57 5.5 8.5C5.5 10.43 7.07 12 9 12ZM9 7C9.83 7 10.5 7.67 10.5 8.5C10.5 9.33 9.83 10 9 10C8.17 10 7.5 9.33 7.5 8.5C7.5 7.67 8.17 7 9 7ZM9.05 17H4.77C5.76 16.5 7.47 16 9 16C9.11 16 9.23 16.01 9.34 16.01C9.68 15.28 10.27 14.68 10.98 14.2C10.25 14.07 9.56 14 9 14C6.66 14 2 15.17 2 17.5V19H9V17.5C9 17.33 9.02 17.16 9.05 17ZM16.5 14.5C14.66 14.5 11 15.51 11 17.5V19H22V17.5C22 15.51 18.34 14.5 16.5 14.5ZM17.71 12.68C18.47 12.25 19 11.44 19 10.5C19 9.12 17.88 8 16.5 8C15.12 8 14 9.12 14 10.5C14 11.44 14.53 12.25 15.29 12.68C15.65 12.88 16.06 13 16.5 13C16.94 13 17.35 12.88 17.71 12.68Z" fill="#323232"/></g><defs><clipPath id="clip0_6_15991"><rect width="24" height="24" fill="white"/></clipPath></defs></svg>'
    },{
      title:"Suppliers",
      route:'/stake/sup',
      menu:1,
      icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_6_15991)"><path d="M9 12C10.93 12 12.5 10.43 12.5 8.5C12.5 6.57 10.93 5 9 5C7.07 5 5.5 6.57 5.5 8.5C5.5 10.43 7.07 12 9 12ZM9 7C9.83 7 10.5 7.67 10.5 8.5C10.5 9.33 9.83 10 9 10C8.17 10 7.5 9.33 7.5 8.5C7.5 7.67 8.17 7 9 7ZM9.05 17H4.77C5.76 16.5 7.47 16 9 16C9.11 16 9.23 16.01 9.34 16.01C9.68 15.28 10.27 14.68 10.98 14.2C10.25 14.07 9.56 14 9 14C6.66 14 2 15.17 2 17.5V19H9V17.5C9 17.33 9.02 17.16 9.05 17ZM16.5 14.5C14.66 14.5 11 15.51 11 17.5V19H22V17.5C22 15.51 18.34 14.5 16.5 14.5ZM17.71 12.68C18.47 12.25 19 11.44 19 10.5C19 9.12 17.88 8 16.5 8C15.12 8 14 9.12 14 10.5C14 11.44 14.53 12.25 15.29 12.68C15.65 12.88 16.06 13 16.5 13C16.94 13 17.35 12.88 17.71 12.68Z" fill="#323232"/></g><defs><clipPath id="clip0_6_15991"><rect width="24" height="24" fill="white"/></clipPath></defs></svg>'
    }
  ]
  if(filter == null || filter == undefined){
      return itemList;
  }else{
    return itemList.filter(rs => {
      return rs.menu == filter
    })
  }
}
}

export default Common