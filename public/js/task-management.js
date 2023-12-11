/******/ (function () {
  // webpackBootstrap
  /******/ 'use strict';
  var __webpack_exports__ = {};
  /*!*************************************************!*\
  !*** ./resources/js/laravel-user-management.js ***!
  \*************************************************/
  /**
   * Page User List
   */

  // Datatable (jquery)
  $(function () {
    // Variable declaration for table
    var dt_user_table = $('.datatables-users'),
      select2 = $('.select2'),
      userView = baseUrl + 'app/user/view/account',
      offCanvasForm = $('#offcanvasAddUser');
    if (select2.length) {
      var $this = select2;
      $this.wrap('<div class="position-relative"></div>').select2({
        placeholder: 'Select Client',
        dropdownParent: $this.parent()
      });
    }

    // ajax setup
    $.ajaxSetup({
      headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
      }
    });

    // Users datatable
    if (dt_user_table.length) {
      var dt_user = dt_user_table.DataTable({
        processing: true,
        serverSide: true,
        ajax: {
          url: baseUrl + 'tasks'
        },
        columns: [
          // columns according to JSON
          {
            data: ''
          },
          {
            data: 'id'
          },
          {
            data: 'client'
          },
          {
            data: 'title'
          },
          {
            data: 'remark'
          },
          {
            data: 'cost center'
          },
          {
            data :'is billable'
          },
          

          {
            data: 'action'
          }
        ],
        columnDefs: [
          {
            // For Responsive
            className: 'control',
            searchable: false,
            orderable: false,
            responsivePriority: 2,
            targets: 0,
            render: function render(data, type, full, meta) {
              return '';
            }
          },
          {
            searchable: false,
            orderable: false,
            targets: 1,
            render: function render(data, type, full, meta) {
              return '<span>'.concat(full.fake_id, '</span>');
            }
          },
          {
            // client full name
            targets: 2,
            responsivePriority: 4,
            render: function render(data, type, full, meta) {
              var $name = full['client'];

              // For Avatar badge
              var stateNum = Math.floor(Math.random() * 6);
              var states = ['success', 'danger', 'warning', 'info', 'dark', 'primary', 'secondary'];
              var $state = states[stateNum],
                $name = full['client'],
                $initials = $name.match(/\b\w/g) || [],
                $output;
              $initials = (($initials.shift() || '') + ($initials.pop() || '')).toUpperCase();
              $output = '<span class="avatar-initial rounded-circle bg-label-' + $state + '">' + $initials + '</span>';

              // Creates full output for row
              var $row_output =
                '<div class="d-flex justify-content-start align-items-center user-name">' +
                '<div class="avatar-wrapper">' +
                '<div class="avatar avatar-sm me-3">' +
                $output +
                '</div>' +
                '</div>' +
                '<div class="d-flex flex-column">' +
                '<a href="javascript:void(0)" class="text-body text-truncate"><span class="fw-semibold">' +
                $name +
                '</span></a>' +
                '</div>' +
                '</div>';
              return $row_output;
            }
          },
          {
            // title 
            targets: 3,
            render: function render(data, type, full, meta) {
              var $title = full['title'];
              return '<span class="user-email">' + $title + '</span>';
            }
          },
          {
            // remark
            targets: 4,
            className: 'text-center',
            render: function render(data, type, full, meta) {
              var $remark = full['remark'];
              return '<span class="user-email">' + $remark + '</span>';
            }
          },
          // {
          //   // color
          //   targets: 5,
          //   className: 'text-center',
          //   render: function render(data, type, full, meta) {
          //     var $color = full['color'];
          //     return '<span class="user-email" style="background-color: ' + $color +';">' + $color + '</span>';
          //   }
          // },
          {
            // cost_center
            targets: 5,
            className: 'text-center',
            render: function render(data, type, full, meta) {
              var $cost_center = full['cost_center'];
              return '<span class="user-email">' + $cost_center + '</span>';
            }
          },
          {
            // is_billable
            targets: 6,
            className: 'text-center',
            render: function render(data, type, full, meta) {
              var $verified = full['is_billable'];
              return "".concat($verified ? '<i class="ti fs-4 ti-shield-check text-success"></i>' : '<i class="ti fs-4 ti-shield-x text-danger" ></i>');
            }
          },
          {
            // Actions
            targets: -1,
            title: 'Actions',
            searchable: false,
            orderable: false,
            render: function render(data, type, full, meta) {
              return (
                '<div class="d-inline-block text-nowrap">' +
                '<button class="btn btn-sm btn-icon edit-record" data-id="'.concat(
                  full['id'],
                  '" data-bs-toggle="offcanvas" data-bs-target="#offcanvasAddUser"><i class="ti ti-edit"></i></button>'
                ) +
                '<button class="btn btn-sm btn-icon delete-record" data-id="'.concat(
                  full['id'],
                  '"><i class="ti ti-trash"></i></button>'
                ) +
                '</div>'
              );
            }
          }
        ],
        order: [[2, 'desc']],
        dom:
          '<"row mx-2"' +
          '<"col-md-2"<"me-3"l>>' +
          '<"col-md-10"<"dt-action-buttons text-xl-end text-lg-start text-md-end text-start d-flex align-items-center justify-content-end flex-md-row flex-column mb-3 mb-md-0"fB>>' +
          '>t' +
          '<"row mx-2"' +
          '<"col-sm-12 col-md-6"i>' +
          '<"col-sm-12 col-md-6"p>' +
          '>',
        language: {
          sLengthMenu: '_MENU_',
          search: '',
          searchPlaceholder: 'Search..'
        },
        // Buttons with Dropdown
        buttons: [
          {
            extend: 'collection',
            className: 'btn btn-label-primary dropdown-toggle mx-3',
            text: '<i class="ti ti-logout rotate-n90 me-2"></i>Export',
            buttons: [
              {
                extend: 'print',
                title: 'Users',
                text: '<i class="ti ti-printer me-2" ></i>Print',
                className: 'dropdown-item',
                exportOptions: {
                  columns: [2, 3],
                  // prevent avatar to be print
                  format: {
                    body: function body(inner, coldex, rowdex) {
                      if (inner.length <= 0) return inner;
                      var el = $.parseHTML(inner);
                      var result = '';
                      $.each(el, function (index, item) {
                        if (item.classList !== undefined && item.classList.contains('user-name')) {
                          result = result + item.lastChild.textContent;
                        } else result = result + item.innerText;
                      });
                      return result;
                    }
                  }
                },
                customize: function customize(win) {
                  //customize print view for dark
                  $(win.document.body)
                    .css('color', config.colors.headingColor)
                    .css('border-color', config.colors.borderColor)
                    .css('background-color', config.colors.body);
                  $(win.document.body)
                    .find('table')
                    .addClass('compact')
                    .css('color', 'inherit')
                    .css('border-color', 'inherit')
                    .css('background-color', 'inherit');
                }
              },
              {
                extend: 'csv',
                title: 'Users',
                text: '<i class="ti ti-file-text me-2" ></i>Csv',
                className: 'dropdown-item',
                exportOptions: {
                  columns: [2, 3],
                  // prevent avatar to be print
                  format: {
                    body: function body(inner, coldex, rowdex) {
                      if (inner.length <= 0) return inner;
                      var el = $.parseHTML(inner);
                      var result = '';
                      $.each(el, function (index, item) {
                        if (item.classList.contains('user-name')) {
                          result = result + item.lastChild.textContent;
                        } else result = result + item.innerText;
                      });
                      return result;
                    }
                  }
                }
              },
              {
                extend: 'excel',
                title: 'Users',
                text: '<i class="ti ti-file-spreadsheet me-2"></i>Excel',
                className: 'dropdown-item',
                exportOptions: {
                  columns: [2, 3],
                  // prevent avatar to be display
                  format: {
                    body: function body(inner, coldex, rowdex) {
                      if (inner.length <= 0) return inner;
                      var el = $.parseHTML(inner);
                      var result = '';
                      $.each(el, function (index, item) {
                        if (item.classList.contains('user-name')) {
                          result = result + item.lastChild.textContent;
                        } else result = result + item.innerText;
                      });
                      return result;
                    }
                  }
                }
              },
              {
                extend: 'pdf',
                title: 'Users',
                text: '<i class="ti ti-file-text me-2"></i>Pdf',
                className: 'dropdown-item',
                exportOptions: {
                  columns: [2, 3],
                  // prevent avatar to be display
                  format: {
                    body: function body(inner, coldex, rowdex) {
                      if (inner.length <= 0) return inner;
                      var el = $.parseHTML(inner);
                      var result = '';
                      $.each(el, function (index, item) {
                        if (item.classList.contains('user-name')) {
                          result = result + item.lastChild.textContent;
                        } else result = result + item.innerText;
                      });
                      return result;
                    }
                  }
                }
              },
              {
                extend: 'copy',
                title: 'Users',
                text: '<i class="ti ti-copy me-1" ></i>Copy',
                className: 'dropdown-item',
                exportOptions: {
                  columns: [2, 3],
                  // prevent avatar to be copy
                  format: {
                    body: function body(inner, coldex, rowdex) {
                      if (inner.length <= 0) return inner;
                      var el = $.parseHTML(inner);
                      var result = '';
                      $.each(el, function (index, item) {
                        if (item.classList.contains('user-name')) {
                          result = result + item.lastChild.textContent;
                        } else result = result + item.innerText;
                      });
                      return result;
                    }
                  }
                }
              }
            ]
          },
          {
            text: '<i class="ti ti-plus me-0 me-sm-1"></i><span class="d-none d-sm-inline-block">Add New Task</span>',
            className: 'add-new btn btn-primary',
            attr: {
              'data-bs-toggle': 'offcanvas',
              'data-bs-target': '#offcanvasAddUser'
            }
          }
        ],
        // For responsive popup
        responsive: {
          details: {
            display: $.fn.dataTable.Responsive.display.modal({
              header: function header(row) {
                var data = row.data();
                return 'Details of ' + data['title'];
              }
            }),
            type: 'column',
            renderer: function renderer(api, rowIdx, columns) {
              var data = $.map(columns, function (col, i) {
                return col.title !== '' // ? Do not show row in modal popup if title is blank (for check box)
                  ? '<tr data-dt-row="' +
                      col.rowIndex +
                      '" data-dt-column="' +
                      col.columnIndex +
                      '">' +
                      '<td>' +
                      col.title +
                      ':' +
                      '</td> ' +
                      '<td>' +
                      col.data +
                      '</td>' +
                      '</tr>'
                  : '';
              }).join('');
              return data ? $('<table class="table"/><tbody />').append(data) : false;
            }
          }
        }
      });
    }

    // Delete Record
    $(document).on('click', '.delete-record', function () {
      var user_id = $(this).data('id'),
        dtrModal = $('.dtr-bs-modal.show');

      // hide responsive modal in small screen
      if (dtrModal.length) {
        dtrModal.modal('hide');
      }

      // sweetalert for confirmation of delete
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        customClass: {
          confirmButton: 'btn btn-primary me-3',
          cancelButton: 'btn btn-label-secondary'
        },
        buttonsStyling: false
      }).then(function (result) {
        if (result.value) {
          // delete the data
          $.ajax({
            type: 'DELETE',
            url: ''.concat(baseUrl, 'task-list/').concat(user_id),
            success: function success() {
              dt_user.draw();
            },
            error: function error(_error) {
              console.log(_error);
            }
          });

          // success sweetalert
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'The user has been deleted!',
            customClass: {
              confirmButton: 'btn btn-success'
            }
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire({
            title: 'Cancelled',
            text: 'The User is not deleted!',
            icon: 'error',
            customClass: {
              confirmButton: 'btn btn-success'
            }
          });
        }
      });
    });

    // edit record
    $(document).on('click', '.edit-record', function () {
      var user_id = $(this).data('id'),
        dtrModal = $('.dtr-bs-modal.show');

      // hide responsive modal in small screen
      if (dtrModal.length) {
        dtrModal.modal('hide');
      }

      // changing the title of offcanvas
      $('#offcanvasAddUserLabel').html('Edit User');

      // get data
      $.get(''.concat(baseUrl, 'task-list/').concat(user_id, '/edit'), function (data) {
        $('#user_id').val(data.id);
        $('#add-task-title').val(data.title);
        $('#add-task-client').val(data.client_id).trigger('change');
        $('#add-task-cost-center').val(data.cost_center);
        $('#add-task-billable').prop('checked', data.is_billable);
        $('#add-task-remark').val(data.remark);
        $('#add-task-color').val(data.color);
      });
    });

    // changing the title
    $('.add-new').on('click', function () {
      $('#user_id').val(''); //reseting input field
      $('#add-task-title').val('');
        $('#add-task-client').val('').trigger('change');
        $('#add-task-cost-center').val('');
        $('#add-task-billable').prop('checked', false);
        $('#add-task-remark').val('');
        $('#add-task-color').val('');
      $('#offcanvasAddUserLabel').html('Add Task');
    });

    // Filter form control to default size
    // ? setTimeout used for multilingual table initialization
    setTimeout(function () {
      $('.dataTables_filter .form-control').removeClass('form-control-sm');
      $('.dataTables_length .form-select').removeClass('form-select-sm');
    }, 300);

    // validating form and updating user's data
    var addNewUserForm = document.getElementById('addNewUserForm');

    // user form validation
    var fv = FormValidation.formValidation(addNewUserForm, {
      fields: {
        title: {
          validators: {
            notEmpty: {
              message: 'Please Task title'
            }
          }
        },
        client: {
          validators: {
            notEmpty: {
                message: 'Please select client'
              }
          }
        },
        // remark: {
        //   validators: {
        //     notEmpty: {
        //       message: 'Please enter Remark'
        //     }
        //   }
        // },
        cost_center: {
            validators: {
                notEmpty: {
                    message: 'Please enter cost center'
                }
            }
        },
      },
      plugins: {
        trigger: new FormValidation.plugins.Trigger(),
        bootstrap5: new FormValidation.plugins.Bootstrap5({
          // Use this for enabling/changing valid/invalid class
          eleValidClass: '',
          rowSelector: function rowSelector(field, ele) {
            // field is the field name & ele is the field element
            return '.mb-3';
          }
        }),
        submitButton: new FormValidation.plugins.SubmitButton(),
        // Submit the form when all fields are valid
        // defaultSubmit: new FormValidation.plugins.DefaultSubmit(),
        autoFocus: new FormValidation.plugins.AutoFocus()
      }
    }).on('core.form.valid', function () {
      // adding or updating user when form successfully validate
      $.ajax({
        data: $('#addNewUserForm').serialize(),
        url: ''.concat(baseUrl, 'task-list'),
        type: 'POST',
        success: function success(status) {
          dt_user.draw();
          offCanvasForm.offcanvas('hide');

          // sweetalert
          Swal.fire({
            icon: 'success',
            title: 'Successfully '.concat(status, '!'),
            text: 'User '.concat(status, ' Successfully.'),
            customClass: {
              confirmButton: 'btn btn-success'
            }
          });
        },
        error: function error(err) {
          offCanvasForm.offcanvas('hide');
          Swal.fire({
            title: 'Error',
            text: 'Something went wrong!',
            icon: 'error',
            customClass: {
              confirmButton: 'btn btn-success'
            }
          });
        }
      });
    });

    // clearing form data when offcanvas hidden
    offCanvasForm.on('hidden.bs.offcanvas', function () {
      fv.resetForm(true);
    });
    var phoneMaskList = document.querySelectorAll('.phone-mask');

    // Phone Number
    if (phoneMaskList) {
      phoneMaskList.forEach(function (phoneMask) {
        new Cleave(phoneMask, {
          phone: true,
          phoneRegionCode: 'US'
        });
      });
    }
  });
  var __webpack_export_target__ = window;
  for (var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
  if (__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, '__esModule', { value: true });
  /******/
})();