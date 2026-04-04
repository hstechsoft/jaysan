
var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
var current_user_id = localStorage.getItem("ls_uid");
var current_user_name = localStorage.getItem("ls_uname");
var physical_stock_array = [];
let allBomData = [];
$(document).ready(function () {


  $("#menu_bar").load('menu.html',
    function () {
      var lo = (window.location.pathname.split("/").pop());
      var web_addr = "#" + (lo.substring(0, lo.indexOf(".")))


      if ($(web_addr).find("a").hasClass('nav-link')) {
        $(web_addr).find("a").toggleClass('active')
      }
      else if ($(web_addr).find("a").hasClass('dropdown-item')) {
        $(web_addr).parent().parent().find("a").eq(0).toggleClass('active')
      }


    }
  );


  $("#sales_summary_search").on("keyup", function () {
    var value = $(this).val().toLowerCase();

    $("#sales_summary_tbody tr").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  });

  check_login();

  $("#unamed").text(localStorage.getItem("ls_uname"))


  get_final_product();
  get_company_report('', '', '', '', '', '');



  $("#thead_price").on("dblclick", function () {

    let rows = $("#sales_summary_tbody tr");

    if (rows.length > 0) {

      let total_price = 0;

      rows.each(function () {
        let priceText = $(this).find("td").eq(3).text().trim();


        priceText = priceText.replace(/₹|,/g, '');

        let price = Number(priceText) || 0;

        total_price += price;
      });

      let formatted = "₹ " + total_price.toLocaleString('en-IN');

      $("#priceTotalCard").text("Total Amount: " + formatted);
      $("#priceTotalCard").fadeIn(200);

      setTimeout(() => {
        $("#priceTotalCard").fadeOut(300);
      }, 20000);

    } else {
      salert("Warning", "No Data Found.", "warning");
    }
  });


  $('#employee').on('input', function () {
    //check the value not empty
    if ($(this).val() != "") {
      $('#employee').data("emp_id", '');

      $(this).autocomplete({
        //get data from databse return as array of object which contain label,value

        source: function (request, response) {
          $.ajax({
            url: "php/get_employee_auto.php",
            type: "get", //send it through get method
            data: {

              emp_name: request.term,


            },
            dataType: "json",
            success: function (data) {

              console.log(data);
              response($.map(data, function (item) {
                return {
                  label: item.emp_name,
                  value: item.emp_name,
                  id: item.emp_id,
                  // phone: item.cus_phone,
                  // part_name: item.part_name
                };
              }));

            }

          });
        },
        minLength: 2,
        cacheLength: 0,
        select: function (event, ui) {

          $('#employee').data("emp_id", ui.item.id);
          //   $('#part_name_out').data("selected-part_id", ui.item.id);
          //   $('#part_name_out').val(ui.item.part_name)
          //  get_bom(ui.item.id)



        },

      }).autocomplete("instance")._renderItem = function (ul, item) {
        return $("<li>")
          .append("<div style='font-size:12px;'><strong>" + item.label + "</strong></div>")
          .appendTo(ul);
      };
    }

  });

  $('#customer').on('input', function () {
    //check the value not empty
    if ($('#customer').val() != "") {
      $(this).data("cus_id", "");
      $('#customer').autocomplete({
        //get data from databse return as array of object which contain label,value

        source: function (request, response) {
          $.ajax({
            url: "php/get_customer_autocomplete.php",
            type: "get", //send it through get method
            data: {

              cus_name: $('#customer').val() + '%',

            },
            dataType: "json",
            success: function (data) {

              console.log(data);
              response($.map(data, function (item) {
                return {
                  label: item.cus_name,
                  value: item.cus_name,
                  id: item.cus_id,
                  // part_name: item.part_name
                };
              }));

            }

          });
        },
        minLength: 2,
        cacheLength: 0,
        select: function (event, ui) {

          $(this).data("cus_id", ui.item.id);
          //   $('#part_name_out').data("selected-part_id", ui.item.id);
          //   $('#part_name_out').val(ui.item.part_name)
          //  get_bom(ui.item.id)


        },

      }).autocomplete("instance")._renderItem = function (ul, item) {
        return $("<li>")
          .append("<div>" + item.label + "</div>")
          .appendTo(ul);
      };
    }

  });

  $("#product").on("change", function () {
    var product_id = $(this).val();
    $("#model, #type").val(0)
    if (product_id > 0) {
      get_final_productmodel(product_id);
    } else {
      shw_toast("Warning", "First Select The Product!");
    }
  })

  $("#model").on("change", function () {
    var model_id = $(this).val();
    $("#type").val(0)
    if (model_id > 0) {
      get_final_producttype(model_id);
    } else {
      shw_toast("Warning", "First Select The Model!");
    }
  })

  $("#generate_summary").on("click", function () {

    var emp_id = $("#employee").data("emp_id") || null;
    var cus_id = $("#customer").data("cus_id") || null;
    var product_id = $("#product").val() || null;
    var model_id = $("#model").val() || null;
    var type_id = $("#type").val() || null;
    var f_date = $("#f_date").val();
    var e_date = $("#e_date").val();


    if (product_id === "0") product_id = null;
    if (model_id === "") model_id = null;
    if (type_id === "") type_id = null;

    var sale_order_date = null;
    if (f_date || e_date) {
      sale_order_date = "'" + f_date + "'" + " and " + "'" + e_date + "'";

    }



    let hasFilter =
      emp_id !== null ||
      cus_id !== null ||
      product_id !== null ||
      model_id !== null ||
      type_id !== null ||
      sale_order_date !== null;

    console.log({
      emp_id,
      cus_id,
      product_id,
      model_id,
      type_id,
      sale_order_date
    });
    if (!hasFilter) {
      salert("Warning", "Fill At least one filter", "warning");
      return;
    }



    get_company_report(emp_id, sale_order_date, cus_id, product_id, type_id, model_id);
  });

});






function get_final_product() {

  $.ajax({
    url: "php/get_jaysan_final_product.php",
    type: "get", //send it through get method
    data: {

    },
    success: function (response) {
      console.log(response);



      if (response.trim() != "error") {

        $("#product").empty();

        if (response.trim() != "0 result") {

          $("#product").append(`<option selected value="">Choose...</option>`)
          var obj = JSON.parse(response);

          obj.forEach(function (obj) {

            $("#product").append(`<option value=${obj.product_id}>${obj.product_name}</option>`)

          })

        }
        else {
          $("#product").append(`<option selected value="">Choose...</option>`)
        }
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });




}

function get_final_productmodel(product_id) {

  $.ajax({
    url: "php/get_jaysan_final_productmodel.php",
    type: "get", //send it through get method
    data: {

      product_id: product_id,

    },
    success: function (response) {
      console.log(response);



      if (response.trim() != "error") {

        $("#model").empty();

        if (response.trim() != "0 result") {

          $("#model").append(`<option selected value="">Choose...</option>`)
          var obj = JSON.parse(response);

          obj.forEach(function (obj) {

            $("#model").append(`<option value=${obj.model_id}>${obj.model_name}</option>`)

          })

        }
        else {
          $("#model").append(`<option selected value="">Choose...</option>`)
        }
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });




}

function get_final_producttype(model_id) {

  $.ajax({
    url: "php/get_jaysan_final_producttype.php",
    type: "get", //send it through get method
    data: {

      model_id: model_id,

    },
    success: function (response) {
      console.log(response);



      if (response.trim() != "error") {

        $("#type").empty();

        if (response.trim() != "0 result") {

          $("#type").append(`<option selected value="">Choose...</option>`)
          var obj = JSON.parse(response);

          obj.forEach(function (obj) {

            $("#type").append(`<option value=${obj.mtid}>${obj.type_name}</option>`)

          })

        }
        else {
          $("#type").append(`<option selected value="">Choose...</option>`)
        }
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });




}

function get_company_report(emp_id, sale_order_date, customer_id, product_id, type_id, model_id) {

  console.log("emp_id: " + emp_id, "sale_order_date: " + sale_order_date, "customer_id: " + customer_id, "product_id: " + product_id, "type_id: " + type_id, "model_id: " + model_id);

  $.ajax({
    url: "php/get_company_report.php",
    type: "get", //send it through get method
    data: {

      emp_id: emp_id,
      sale_order_date: sale_order_date,
      customer_id: customer_id,
      product_id: product_id,
      type_id: type_id,
      model_id: model_id,
    },
    success: function (response) {
      console.log(response);



      if (response.trim() != "error") {

        $("#sales_summary_tbody").empty();

        if (response.trim() != "0 result") {

          var obj = Array.isArray(response) ? response : JSON.parse(response);

          obj.forEach(function (obj) {


            Chart.getChart("monthChart")?.destroy();
            Chart.getChart("employeeChart")?.destroy();
            Chart.getChart("customerChart")?.destroy();
            Chart.getChart("productChart")?.destroy();
            $("#employeeSummary, #customerSummary, #productSummary").empty();

            let month = Array.isArray(obj.monthly_wise) ? obj.monthly_wise : JSON.parse(obj.monthly_wise);
            let product = Array.isArray(obj.product_wise) ? obj.product_wise : JSON.parse(obj.product_wise);
            let employee = Array.isArray(obj.employee_wise) ? obj.employee_wise : JSON.parse(obj.employee_wise);
            let customer = Array.isArray(obj.customer_wise) ? obj.customer_wise : JSON.parse(obj.customer_wise);

            if (product == null) {
              return;
            }
            product.forEach(function (item, index) {

              $("#sales_summary_tbody").append(`<tr>
                <td>${index + 1}</td>
                <td>
                    <div class="card shadow-sm border-0 rounded-4 p-2 product-card">

                      <div class="d-flex justify-content-between align-items-center mb-1">
                        <span class="badge bg-light text-dark fw-semibold px-2 py-1" style='font-size: 10px'>${item.product}</span>
                        <span class="fw-bold text-primary" style='font-size: 10px'>${item.model_name}</span>
                        <span class="badge bg-success-subtle text-success px-2 py-1" style='font-size: 10px'>${item.type_name}</span>
                      </div>
                    </div>
                </td>
                <td>${0}</td>
                <td>₹<b class="text-primary">${item.total_amount}</b></td>
              </tr>`);
            })



            month.sort((a, b) => {
              return new Date(a.month) - new Date(b.month);
            });

            let monthLabels = month.map(m => m.month);
            let monthValues = month.map(m => m.total_amount);
            let totalMonth = monthValues.reduce((a, b) => a + b, 0);

            const monthCenter = {
              id: 'monthCenter',
              beforeDraw(chart) {
                const { ctx, width, height } = chart;
                ctx.save();
                ctx.textAlign = "center";

                ctx.font = "bold 12px Arial";
                ctx.fillText("Total Sales", width / 2, height / 2 - 10);

                ctx.font = "bold 14px Arial";
                ctx.fillStyle = "#d21919";
                ctx.fillText("₹ " + totalMonth.toLocaleString('en-IN'), width / 2, height / 2 + 10);

                ctx.restore();
              }
            };

            new Chart(document.getElementById("monthChart"), {
              type: "line",
              data: {
                labels: monthLabels,
                datasets: [{
                  data: monthValues,
                  borderColor: "#1976d2",
                  backgroundColor: "rgba(25,118,210,0.1)",
                  fill: true,
                  tension: 0.4
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 1200 },

                plugins: {
                  legend: { display: false },

                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        return "₹ " + context.raw.toLocaleString('en-IN');
                      }
                    }
                  }
                },

                scales: {
                  y: {
                    ticks: {
                      callback: function (value) {
                        return "₹ " + value.toLocaleString('en-IN');
                      }
                    }
                  },
                  // x: {
                  //   ticks: {
                  //     maxRotation: 45,
                  //     minRotation: 45
                  //   }
                  // }
                }
              },
              plugins: [monthCenter]
            });


            // ================= COMMON FUNCTION =================
            function cleanAndSort(data, key) {
              return data
                .filter(e => e[key] && e.total_amount > 0)
                .sort((a, b) => b.total_amount - a.total_amount);
            }

            // ================= PRODUCT =================
            product = cleanAndSort(product, "model_name");

            let allProducts = product;

            function generateColors(count) {
              let colors = [];
              for (let i = 0; i < count; i++) {
                let hue = (i * 360 / count);
                colors.push(`hsl(${hue}, 65%, 55%)`);
              }
              return colors;
            }

            let premiumColors = generateColors(allProducts.length);

            let labels = allProducts.map(p => `${p.product} - ${p.model_name} (${p.type_name})`);
            let values = allProducts.map(p => p.total_amount);

            let total = values.reduce((a, b) => a + b, 0);

            function fadeColor(color, alpha = 0.3) {
              if (color.startsWith("hsl")) {
                return color.replace("hsl", "hsla").replace(")", `, ${alpha})`);
              }

              // fallback for hex
              const r = parseInt(color.substr(1, 2), 16);
              const g = parseInt(color.substr(3, 2), 16);
              const b = parseInt(color.substr(5, 2), 16);
              return `rgba(${r}, ${g}, ${b}, ${alpha})`;
            }

            let centerText = {
              title: "Total Sales",
              value: "₹" + total.toLocaleString('en-IN')
            };

            const ctx = document.getElementById("productChart").getContext("2d");

            let productChart = new Chart(ctx, {
              type: "doughnut",
              data: {
                labels: labels,
                datasets: [{
                  data: values,
                  backgroundColor: premiumColors,
                  borderWidth: 0,
                  hoverOffset: 18
                }]
              },
              options: {
                cutout: '70%',
                responsive: true,

                animation: {
                  animateRotate: true,
                  animateScale: true,
                  duration: 1200
                },

                plugins: {
                  legend: {
                    display: false // 👉 important for many products
                  },

                  tooltip: {
                    backgroundColor: "#111827",
                    callbacks: {
                      label: function (context) {
                        let percent = ((context.raw / total) * 100).toFixed(1);
                        return ` ₹${context.raw.toLocaleString('en-IN')} (${percent}%)`;
                      }
                    }
                  }
                },

              },

              plugins: [{
                // 💎 CENTER TEXT
                id: 'centerText',
                beforeDraw(chart) {
                  const { width, height, ctx } = chart;

                  ctx.save();
                  ctx.textAlign = 'center';
                  ctx.textBaseline = 'middle';

                  ctx.font = "500 12px sans-serif";
                  ctx.fillStyle = "#6b7280";
                  ctx.fillText(centerText.title, width / 2, height / 2 - 12);

                  ctx.font = "bold 18px sans-serif";
                  ctx.fillStyle = "#111827";
                  ctx.fillText(centerText.value, width / 2, height / 2 + 10);

                  ctx.restore();
                }
              }]
            });

            let productHtml = `<div style="max-height:400px;overflow:auto">
                  <table class="table table-sm">
                  <tr class='head'><th>#</th><th>Product</th><th>Amount</th></tr>`;

            product.forEach((p, i) => {
              productHtml += `
                  <tr>
                    <td>${i + 1}</td>
                    <td>${p.product} - ${p.model_name} (${p.type_name})</td>
                    <td>₹${p.total_amount.toLocaleString('en-IN')}</td>
                  </tr>`;
            });

            productHtml += `</table></div>`;
            document.getElementById("productSummary").innerHTML = productHtml;


            // ================= EMPLOYEE =================
            employee = cleanAndSort(employee, "emp_name");

            let topEmp = employee;


            new Chart(document.getElementById("employeeChart"), {
              type: "bar",
              data: {
                labels: topEmp.map(e => e.emp_name),
                datasets: [{
                  label: "Employee Sales",
                  data: topEmp.map(e => e.total_amount), // keep number
                  backgroundColor: topEmp.map((_, i) => `hsl(${i * 35}, 70%, 60%)`),
                  borderRadius: 6
                }]
              },
              options: {
                indexAxis: 'x',
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 1200 },

                plugins: {
                  legend: { display: false },

                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        return "₹ " + context.raw.toLocaleString('en-IN');
                      }
                    }
                  }
                },

                scales: {
                  y: {
                    ticks: {
                      callback: function (value) {
                        return "₹ " + value.toLocaleString('en-IN');
                      }
                    }
                  },
                  x: {
                    ticks: {
                      maxRotation: 25,
                      minRotation: 25
                    }
                  }
                }
              }
            });


            let empHtml = `<div style="max-height:220px;overflow:auto">
                  <table class="table table-sm">
                  <tr class='head'><th>#</th><th>Employee</th><th>Amount</th></tr>`;

            employee.forEach((e, i) => {
              empHtml += `
                <tr>
                  <td>${i + 1}</td>
                  <td>${e.emp_name}</td>
                  <td>₹${e.total_amount.toLocaleString('en-IN')}</td>
                </tr>`;
            });

            empHtml += `</table></div>`;
            document.getElementById("employeeSummary").innerHTML = empHtml;


            // ================= CUSTOMER =================
            customer = cleanAndSort(customer, "cus_name");

            let topCustomers = customer.slice(0, 20);

            new Chart(document.getElementById("customerChart"), {
              type: "bar",
              data: {
                labels: topCustomers.map(c => c.cus_name),
                datasets: [{
                  label: "Customer Sales",
                  data: topCustomers.map(c => c.total_amount), // keep number
                  backgroundColor: "#ef5350",
                  borderRadius: 6
                }]
              },
              options: {
                indexAxis: 'y', // horizontal
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 1200 },

                plugins: {
                  legend: { display: false },

                  // 🔥 TOOLTIP INR FORMAT
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        return "₹ " + context.raw.toLocaleString('en-IN');
                      }
                    }
                  }
                },


                scales: {
                  x: {
                    ticks: {
                      callback: function (value) {
                        return "₹ " + value.toLocaleString('en-IN');
                      }
                    },
                    grid: {
                      color: "#eee"
                    }
                  },
                  y: {
                    ticks: {
                      font: {
                        size: 11
                      }
                    },
                    grid: {
                      display: false
                    }
                  }
                }
              }
            });


            let cusHtml = `<div style="max-height:220px;overflow:auto">
              <table class="table table-sm">
              <tr class='head'><th>#</th><th>Customer</th><th>Amount</th></tr>`;

            customer.forEach((c, i) => {
              cusHtml += `
                <tr>
                  <td>${i + 1}</td>
                  <td>${c.cus_name}</td>
                  <td>₹${c.total_amount.toLocaleString('en-IN')}</td>
                </tr>`;
            });

            cusHtml += `</table></div>`;
            document.getElementById("customerSummary").innerHTML = cusHtml;


            // ⬇ Download Function
            function downloadChart(id) {
              let link = document.createElement('a');
              link.download = id + ".png";
              link.href = document.getElementById(id).toDataURL();
              link.click();
            }
          });


        }
        else {
          $("#sales_summary_tbody").append(`<tr><td class="text-center text-danger">No Data Found.</td></tr>`)
        }
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });




}







function insert_new_process(processId) {

  $.ajax({
    url: "php/insert_nprocess.php",
    type: "get", //send it through get method
    data: {

      process_id: processId,
      edit_process_id: edit_process_id,
      input_part_id: sel_input_part_id,
      output_part_id: sel_output_part_id,
    },
    success: function (response) {
      console.log(response);



      if (response.trim()) {
        sessionStorage.setItem('editProcessId', response.trim());
        sessionStorage.setItem('breadcrumb', $('#out_breadcrumb').html());
        // Reload the page
        location.reload();
      }





    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });




}













function check_login() {

  if (localStorage.getItem("logemail") == null && phone_id == null) {
    window.location.replace("login.html");
  }
  else if (localStorage.getItem("logemail") == null && phone_id != null) {
    get_current_userid_byphoneid();
    $('#menu_bar').hide()
  }

  else {

  }
}


function get_current_userid_byphoneid() {
  $.ajax({
    url: "php/get_current_employee_id_byphoneid.php",
    type: "get", //send it through get method
    data: {
      phone_id: phone_id,


    },
    success: function (response) {


      if (response.trim() != "error") {
        var obj = JSON.parse(response);


        console.log(response);


        obj.forEach(function (obj) {
          current_user_id = obj.emp_id;
          current_user_name = obj.emp_name;
        });

        //    get_sales_order()
      }

      else {
        salert("Error", "User ", "error");
      }



    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });
}


function shw_toast(title, des, theme) {


  $('.toast-title').text(title);
  $('.toast-description').text(des);
  var toast = new bootstrap.Toast($('#myToast'));
  toast.show();
}

function get_millis(t) {

  var dt = new Date(t);
  return dt.getTime();
}



function get_cur_millis() {
  var dt = new Date();
  return dt.getTime();
}


function get_today_date() {
  var date = new Date();

  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();

  var hour = date.getHours();
  var mins = date.getMinutes();

  console.log(mins)

  if (month < 10) month = "0" + month;
  if (day < 10) day = "0" + day;

  var today = year + "-" + month + "-" + day + "T" + hour + ":" + mins;
  return today;
}

function get_today_start_millis() {
  var date = new Date();

  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();

  if (month < 10) month = "0" + month;
  if (day < 10) day = "0" + day;

  var today = year + "-" + month + "-" + day + "T00:00";

  return get_millis(today)

}


function get_today_end_millis() {
  var date = new Date();

  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();

  if (month < 10) month = "0" + month;
  if (day < 10) day = "0" + day;

  var today = year + "-" + month + "-" + day + "T23:59";

  return get_millis(today)

}

function salert(title, text, icon) {


  swal({
    title: title,
    text: text,
    icon: icon,
  });
}



function millis_to_date(millis) {
  var d = new Date(millis); // Parameter should be long value


  return d.toLocaleString('en-GB');

}