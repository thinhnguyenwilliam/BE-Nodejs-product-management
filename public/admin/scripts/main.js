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


// Phân trang
// Pagination Logic
document.querySelectorAll("[button-pagination]").forEach(button => {
  button.addEventListener("click", () => {
    const page = button.getAttribute("button-pagination");
    const url = new URL(window.location);

    if (page) {
      url.searchParams.set("page", page);
    } else {
      url.searchParams.delete("page");
    }

    window.location = url.href;
  });
});

// Highlight Active Page
const currentPage = new URLSearchParams(window.location.search).get("page") || 1;
const currentButton = document.querySelector(`[button-pagination="${currentPage}"]`);

if (currentButton) {
  currentButton.parentNode.classList.add("active");
}

// Hết Phân trang



// Change status functionality
const listButtonChangeStatus = document.querySelectorAll("[button-change-status]");

if (listButtonChangeStatus.length > 0) {
  listButtonChangeStatus.forEach(button => {
    button.addEventListener("click", () => {
      //console.log(button);
      const itemId = button.getAttribute("item-id"); // Get the item ID
      //console.log(itemId);
      const statusChange = button.getAttribute("button-change-status"); // Get the new status to change to
      //console.log(statusChange);
      const path = button.getAttribute("data-path"); // Get the API endpoint path
      //console.log(path);

      // Prepare the data object
      const data = {
        id: itemId,
        status: statusChange
      };
      //console.log(data);

      // Make the fetch request to update the status
      fetch(path, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH", // Use PATCH to update the resource
        body: JSON.stringify(data) // Convert the data object to a JSON string
      })
        .then(res => res.json()) // Parse the response as JSON into object of JS, if BE response something to FE
        .then(data => {
          if (data.code === "success") {
            location.reload(); // Reload the page on success to reflect the new status
          }
        })
        .catch(error => console.error('Error:', error)); // Handle errors gracefully
    });
  });
}
// End of change status functionality




// Change status for multiple products
const formChangeMulti = document.querySelector("[form-change-multi]");

if (formChangeMulti) {
  //console.log(formChangeMulti);
  formChangeMulti.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    // Get the form action path and selected status
    const path = formChangeMulti.getAttribute("data-path");
    //console.log(path);

    const status = formChangeMulti.status.value;
    //console.log(status);

    // Collect the IDs of all checked products
    const ids = [];
    const listInputChangeChecked = document.querySelectorAll("[input-change]:checked");
    listInputChangeChecked.forEach(input => {
      const id = input.getAttribute("input-change");
      ids.push(id); // Push each product ID into the 'ids' array
    });
    //console.log(ids);

    // Prepare the data to be sent in the request
    const data = {
      ids: ids,
      status: status
    };
    //console.log(data);

    // Make the fetch request to update the status for multiple products
    fetch(path, {
      headers: {
        "Content-Type": "application/json", // Set request header to JSON
      },
      method: "PATCH", // Use PATCH for updating
      body: JSON.stringify(data) // Convert data to JSON string
    })
      .then(res => res.json()) // Parse the response as JSON
      .then(data => {
        //console.log(data);
        if (data.code === "success") {
          location.reload(); // Reload the page to reflect changes on success
        }
      })
      .catch(error => console.error('Error:', error)); // Handle any errors
  });
}
//


//xóa vĩnh viễn 1 bản ghi
const listButtonDelete = document.querySelectorAll("[button-delete]");
//console.log(listButtonDelete);
if (listButtonDelete.length > 0) {
  listButtonDelete.forEach(button => {
    button.addEventListener("click", () => {
      const productId = button.getAttribute("item-id");
      //console.log(productId);
      const path = button.getAttribute("data-path");
      //console.log(path);

      // Confirm before deleting
      const confirmDelete = confirm("Bạn có chắc muốn xóa sản phẩm này không?");
      if (confirmDelete) {
        fetch(path, {
          headers: {
            "Content-Type": "application/json",
          },
          method: "PATCH" // Use DELETE method for deletion
        })
          .then(res => res.json())
          .then(data => {
            if (data.code === "success") {
              location.reload(); // Reload the page to reflect the deletion
            }
          })
          .catch(error => console.error('Error:', error)); // Handle errors
      }
    });
  });
}
//
