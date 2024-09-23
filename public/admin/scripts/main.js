console.log('Đang vào admin server side');
//nhiệm vụ của file js in FE là sửa url để BE làm việc

// Bộ lọc
const boxFilter = document.querySelector("[box-filter]");
//console.log(boxFilter);
if (boxFilter) {
    //xem phần khi lần đầu vào trang chưa làm gì cả, nằm ở dưới ấy

    let url = new URL(location.href); // Nhân bản url

    // Bắt sự kiện onChange
    boxFilter.addEventListener("change", () => {
        const value = boxFilter.value;
        //console.log(value);

        if (value)
            url.searchParams.set("status", value);
        else
            url.searchParams.delete("status");
        
        //console.log(url);
        //console.log(url.href);
        // Redirect the page with the new filter
        location.href = url.href;
    })


    // url có gì thì in ra cái field đó hiện ra để dễ xem
    // Hiển thị lựa chọn mặc định, khi lần đầu vào trang chưa làm gì cả
    // Set the default value in the filter dropdown
    const statusCurrent = url.searchParams.get("status");
    if (statusCurrent) 
        boxFilter.value = statusCurrent;
    
}
// Hết Bộ lọc



// Tìm kiếm
// Search by keyword
const formSearch = document.querySelector("[form-search]");
if (formSearch) {
  formSearch.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent form submission

    let url = new URL(location.href);
    const keyword = formSearch.keyword.value.trim();

    if (keyword) {
      // If there is a keyword, add/update it in the URL parameters
      url.searchParams.set("keyword", keyword);
    } else {
      // If the keyword is empty, remove the 'keyword' parameter from the URL
      url.searchParams.delete("keyword");
    }

    // Redirect the page with the new or updated parameters
    location.href = url.href;
  });

  // Set the default search keyword in the input field if it exists in the URL
  const valueCurrent = new URL(location.href).searchParams.get("keyword");
  if (valueCurrent) {
    formSearch.keyword.value = valueCurrent;
  }
}
// Hết Tìm kiếm