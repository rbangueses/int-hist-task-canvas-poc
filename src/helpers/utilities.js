//order descending
export function compareNumbers(a, b) {
    return b.entryTime - a.entryTime;
  }

export function epochToDate(timestamp){
    var result="";
    var d = new Date(timestamp);
    result += d.getFullYear()+"/"+(d.getMonth()+1)+"/"+d.getDate() + 
              " "+ d.getHours()+":"+d.getMinutes();
    return result;
}