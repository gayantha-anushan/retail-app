function discounting(total,discount){
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

  module.exports = {discounting}