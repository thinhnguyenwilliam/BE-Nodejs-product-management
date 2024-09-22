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
        location.href = url.href;
    })

    // Hiển thị lựa chọn mặc định, khi lần đầu vào trang chưa làm gì cả
    const statusCurrent = url.searchParams.get("status");
    if (statusCurrent) 
        boxFilter.value = statusCurrent;
    
}
// Hết Bộ lọc